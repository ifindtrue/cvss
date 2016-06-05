/*게임엔진 GearWorld*/

/*호환성에 맞는 애니메이션함수를 적용해주는 소스*/
/*출처 : https://msdn.microsoft.com/ko-kr/library/hh920765(v=vs.85).aspx*/
	window.requestAniFrame = (function () {
	    return window.requestAnimationFrame ||
	            window.webkitRequestAnimationFrame ||
	            window.mozRequestAnimationFrame ||
	            window.oRequestAnimationFrame ||
	            function (callback) {
	                return window.setTimeout(callback, 1000/32); // 저사양이라고 판단하여 설정해 둔 프레임수대신 32fps로 적용함
	            };
	})();
	window.cancelAniFrame = (function () {
	    return window.cancelAnimationFrame ||
	            window.webkitCancelAnimationFrame ||
	            window.mozCancelAnimationFrame ||
	            window.oCancelAnimationFrame ||
	            function (id) {
	                window.clearTimeout(id);
	            };
	})();
/*************************************************************************/

(function(window){
	window.Engine=function(canvas,engineInfo){
		if(!canvas){console.warn("Gear World : 작동하려는 엔진의 기본정보를 입력해주세요"); return 0;}

		this.fps=(engineInfo && engineInfo.fps)|| Engine.prototype.basicEngineInfo.fps;
			this.engineSpeed=1/2;
		this.$gravity=(engineInfo && Vector.isVector(engineInfo.gravity)) || Engine.prototype.basicEngineInfo.gravity; // 중력가속도 설정

		this.$systemValue={
			now:NaN,
			then:Date.now(),
			interval:1000/this.fps,
			delta:NaN,
			engineTime:this.fps/this.engineSpeed/1000,
			restitution:0.3,
			contactNormal:[0,1],
			standbyParticleProperty:new Object()
		};
		this.$systemValue.gravity=Vector.multiply(this.$gravity,this.$systemValue.engineTime);
		this.$systemValue.dammping=Math.pow(0.99,this.$systemValue.engineTime)

		this.$canvas=canvas;
		this.$particle=new Object();
			this.$particleStack=new Array();
			this.$crashParticleObject=new Object(); // 충돌이벤트 시 실행할 함수 목록 idea tag기능의 경우 "tag:~"
			this.$stopParticle={x:new Object(),y:new Object()} // 충돌의 경우
			this.$checkContact=new Object();
		this.$gearSystem();
	}
	Engine.prototype.basicEngineInfo={
		fps:32,
		gravity:[0,0]
	};
	Engine.prototype.basicParticle={
		f:[0,0],v:[0,0],a:[0,0],
		friction:1,contactHandling:true
	};
	Engine.prototype.particleType={
		m:"number",
		f:"vector",
		a:"vector",
		v:"vector",
		s:"vector",
		friction:"number",
		contactHandling:"boolean"
	};
	// 1000ms/fps 1000ms 1초를 fps로 나눔
	Engine.prototype.$gearSystem=function(){
		var th=this;
		window.requestAniFrame(function(){th.$gearSystem();});

		var sysInfo=th.$systemValue;
		sysInfo.now=Date.now();
		sysInfo.delta=sysInfo.now-sysInfo.then;

		if(sysInfo.delta>sysInfo.interval*this.engineSpeed){
			// (sysInfo.interval/2) 는 FPS/2(MS_PER_UPDATE) , FPS를 기준으로 설정된다.
			var particleKey=Object.keys(this.$particle);
			this.applyParticleProperty();//대기열에 있는 입자의 변경된속성들을 일괄적용
			
			for(i=0; i<particleKey.length; i++){
				//충돌판정 및 위치변동
				this.crashJudgment(particleKey[i],sysInfo.engineTime,i);		
				//적분기
				var drawElement=this.$canvas.$element[particleKey[i]];
				if(this.integrator(this.$particle[particleKey[i]],sysInfo.engineTime,!this.$stopParticle.y[particleKey[i]])){
					drawElement.x=this.$particle[particleKey[i]].s[0];
					drawElement.y=this.$particle[particleKey[i]].s[1];
				}
			}
			for(i=0; i<particleKey.length; i++){//2차 충돌판정
				this.crashJudgment(particleKey[i],sysInfo.engineTime,i);		
			}			
		}
		if(sysInfo.delta>sysInfo.interval){
			// 프레임 시작 FPS
			this.$canvas.drawElement(this.$canvas.$element);
			sysInfo.then=sysInfo.now-(sysInfo.delta%sysInfo.interval);
		}
	};

	Engine.prototype.integrator=function(particle,duration,g){
		//F(힘)=m(질량)*a(가속도)
			//a(가속도)=f/m
			//v(속도)=at+v0
			//s(위치)=at^2/2+v0t+s0 이지만 at^2이부분을 생략한 근사값을 적용한다.

		if(particle.inverseMass<=0){ //질량이 무한 또는 음수라면 적분하지않는다.
			return;
		}
		particle.s=Vector.sum(particle.s,Vector.multiply(particle.v,duration));

		particle.a=Vector.sum(particle.a,Vector.multiply(particle.f,particle.inverseMass));
		var gravity=g ? this.$systemValue.gravity : [0,0];
		particle.v=Vector.sum(particle.v,Vector.sum(Vector.multiply(particle.a,duration),gravity)); //Math.pow(0.999,duration)=>드래그 추가
		//기존 가속도에 중력을 더해준다.
		particle.f=[0,0];
		return 1;
	}
	Engine.prototype.imagineIntergrator=function(particle,duration){
		particle=this.$particle[particle];
		if(particle.inverseMass<=0){ //질량이 무한 또는 음수라면 적분하지않는다.
			return [particle.s[0],particle.s[1]];
		}
		return Vector.sum(particle.s,Vector.multiply(particle.v,duration));
	}
	Engine.prototype.particle=function(key,info){
		if(!this.$canvas.$element[key]){
			console.warn("Gear World : 엘레먼트의 이름을 올바르게 입력해주세요");
			return;
		}
		var newParticle=this.$particle[key] ? false : true;
		/*particleStack은 명령어를 수행할 입자를 저장하는 역할을 한다*/
		/*각 명령은 대부분 particleStack.pop() 을통해 대상이되는 입자를 pop한다.*/
		switch(newParticle){
			case true:
				info.m=isNaN(info.m) ? Engine.prototype.basicParticle.m : Number(info.m);
				info.f=Vector.isVector(info.f) || [Engine.prototype.basicParticle.f[0],Engine.prototype.basicParticle.f[1]];
				info.v=Vector.isVector(info.v) || [Engine.prototype.basicParticle.v[0],Engine.prototype.basicParticle.v[1]];
				info.a=Vector.isVector(info.a) || [Engine.prototype.basicParticle.a[0],Engine.prototype.basicParticle.a[1]];
				info.s=[this.$canvas.$element[key].x,this.$canvas.$element[key].y];
				info.inverseMass=1/info.m; //역 질량 a=f/inverseMass
				info.friction=isNaN(info.friction) ? Engine.prototype.basicParticle.friction : Number(info.friction);
				info.contactHandling=info.contactHandling===true || info.contactHandling===false ? info.contactHandling : Engine.prototype.basicParticle.contactHandling;
				this.$particle[key]=info;
				return 1;
			case false:
				this.$particleStack.push(key);
				return this;
		}

	}
	Engine.prototype.applyParticleProperty=function(){
		var i,j,obj=this.$systemValue.standbyParticleProperty,
			key=Object.keys(obj);
		for(i=0; i<key.length; i++){
			var subKey=typeof obj[key[i]]=="object" ? Object.keys(obj[key[i]]) :NaN;
			if(!subKey){continue}
			for(j=0; j<subKey.length; j++){
				this.$particle[key[i]][subKey[j]]=obj[key[i]][subKey[j]];
				delete obj[key[i]][subKey[j]]
			}
		}
	}
	//원래 정석적인 물리엔진은 속도를 변경하기위해서는 가속도를 변경시키지만,
	//이 엔진은 2d 가벼운 엔진이기때문에 속도를 직접적으로 변경할 수 있게 제작할 것이다.
	//위치 또한 포탈이나 기타 부수적인 기능 때문에 필요하다. 다만, engine.js에서 지원하는 위치벡터를 권장할 예정
	Engine.prototype.property=function(propertyName,propertyValue){
		if(this.$particleStack.length<1){
			return;
		}
		var particleName=this.$particleStack.pop(),particle=this.$systemValue.standbyParticleProperty;
		if(!particle[particleName]){particle[particleName]=new Object();}

		if(typeof propertyName=="object"){ // 첫 요소가 오브젝트형식으로 주어졌을 경우
			var key=Object.keys(propertyName);
			for(i=0; i<key.length; i++){
				var keyName=key[i].toLowerCase();
				var type=Engine.prototype.particleType[keyName];

				if(!type){
					continue;
				}
				switch(type){
					case "number":
						var result=Number(propertyName[key[i]]);
						type="number";
						break;
					case "vector":
						var result=Vector.isVector(propertyName[key[i]]);
						type="vector";	
						break;
				}
				if((isNaN(result) && type=="number") || (!result && type=="vector") || (type=="B" && (result!==false || result!==true))){
					continue;
				}
				particle[particleName][keyName]=result;
			}
//			particle.inverseMass=1/particle.m; //역질량 설정
			return 1;
		}else if(typeof propertyName=="string" && Engine.prototype.particleType[propertyName.toLowerCase()]){
			//기본적으로 paticle의 요소는 string 형식을 취하고 있기때문에 typeof propertyName==string을 체크하고, 주어진 propertyName이 허용범위의 속성인지 확인후 그 속성값이 vector인지 number인지 확인한다.
			var name=propertyName.toLowerCase();
			var type;
			switch(Engine.prototype.particleType[name]){
				case "number":
					var result=Number(propertyValue);
					type="N";
					break;
				case "vector":
					var result=Vector.isVector(propertyValue);
					type="V";	
					break;
				case "boolean":
					result=propertyValue;
					type="B"
			}

			if((isNaN(result) && type=="N") || (!result && type=="V") || (type=="B" && (result!==false || result!==true))){
				//propertyName만 주어졌을 경우에는(혹은 value가 올바르지않을경우) particle.propertyName 의 값만을 출력해주는 역할을한다.
				return Vector.isVector(this.$particle[particleName][name]) ? Canvas.prototype.CopyObj(this.$particle[particleName][name]) : this.$particle[particleName][name];
			}
			particle[particleName][name]=result;

			return 1;
		}
		return;
	}
	Engine.prototype.addForce=function(f){
		if(this.$particleStack.length<1){
			return;
		}
		var particle=this.$particle[this.$particleStack.pop()];
		particle.f=Vector.sum(particle.f,Vector.isVector(f) || Engine.prototype.basicParticle.f); //(x)
		return;
	}
	Engine.prototype.crash=function(func){
		if(this.$particleStack.length<1){
			return;
		}
		if(typeof func!="function"){
			return;
		}
		var particle=this.$particleStack.pop();
		this.$crashParticleObject[particle]=func;
	}
	window.Vector={
		sum:function(v1,v2){
			return [v1[0]+v2[0],v1[1]+v2[1]];
		},
		sub:function(v1,v2){
			return [v1[0]-v2[0],v1[1]-v2[1]];
		},
		multiply:function(v,a){ // 실수곱
			return [v[0]*a,v[1]*a];
		},
		scalarProduct:function(v1,v2){ // 두벡터의 내적
			return v1[0]*v2[0]+v1[1]*v2[1];
		},
		normalize:function(v){ // 정규화(단위벡터)
			var l=Vector.length(v);
			return [v[0]/l,v[1]/l];
		},
		length:function(v){ // 벡터의 길이(크기)
			return Math.sqrt(v[0]*v[0]+v[1]*v[1]);
		},
		isVector:function(val){
			if(Object.prototype.toString.call( val ) === '[object Array]' && val.length==2){
				val[0]=Number(val[0]);
				val[1]=Number(val[1]);
				if(isNaN(val[0]) || isNaN(val[1])){
					return;
				}
				return val;
			}
			return;
		}
	}


	// case n^2, (n^2+1)/2
	Engine.prototype.crashJudgment=function(particle,duration,index){
		var particleProperty=this.$particle[particle];
		if(particleProperty.contactHandling===false){return}
		var targetObj=this.$canvas.$systemValue.eventPointer[particle].line,
			particleKey=Object.keys(this.$particle),crash=false,
			p=this.imagineIntergrator(particle,duration),
			deltaP=Vector.sub(p,particleProperty.s),odeltaP={x:NaN,y:NaN};
		if(targetObj.length<3){
			return;
		}
		if(index==0){
			this.$checkContact=new Object()
		}
		var i,j,e;
		for(i=index+1; i<particleKey.length; i++){
			var oparticleProperty=this.$particle[particleKey[i]];
			if(oparticleProperty.contactHandling===false){continue}
			otherObj=this.$canvas.$systemValue.eventPointer[particleKey[i]].line;
			tempP=this.imagineIntergrator(particleKey[i],duration);
			odeltaP=Vector.sub(tempP,oparticleProperty.s);
			if(otherObj.length<3){
				continue;
			}
			for(j=0; j<targetObj.length; j++){
				tempTargetObj=(j<targetObj.length-1) ? targetObj[j+1] : targetObj[0];
				for(e=0; e<otherObj.length; e++){
					tempOtherObj=(e<otherObj.length-1) ? otherObj[e+1] : otherObj[0];
					var S1=Vector.sum(targetObj[j],deltaP);
					var S2=Vector.sum(tempTargetObj,deltaP);
					var S3=Vector.sum(otherObj[e],odeltaP);
					var S4=Vector.sum(tempOtherObj,odeltaP);

					var x1=S1[0],y1=S1[1];
					var x2=S2[0],y2=S2[1];
					var x3=S3[0],y3=S3[1];
					var x4=S4[0],y4=S4[1];

					var den=(y4-y3)*(x2-x1)-(x4-x3)*(y2-y1);
					if(den==0){continue}
					var ua=(x4-x3)*(y1-y3)-(y4-y3)*(x1-x3);
					var ub=(x2-x1)*(y1-y3)-(y2-y1)*(x1-x3);
					var ad=ua/den,bd=ub/den;
					if(ad<0 || ad>1 || bd<0 || bd>1){
						continue;
					}
					if(ua==0 && ub==0){
						continue;
					}
					crash=true;
					break;
				}
				if(crash===true){break;}
			}
			if(crash===true){
				this.particleContact([particle,particleKey[i]],duration,Vector.sum(targetObj[0],deltaP),Vector.sum(otherObj[0],odeltaP));
				crash=false;
				continue;
			}
		}
		if(!this.$checkContact[particle]){
			this.$stopParticle.x[particle]=false;
			this.$stopParticle.y[particle]=false;
		}
		return;
	}
	Engine.prototype.particleContact=function(particle,duration,pA,pB){
		var A=this.$particle[particle[0]];
		var B=this.$particle[particle[1]];
		this.$checkContact[particle[0]]=true;
		this.$checkContact[particle[1]]=true;
		/**************************************************************/
		/*문제, 왜 x축 속도를 지정해줄경우에만	 충돌판정을하는가?    */
		//	solution. 충돌 판정문제였다.
		var isBackgroundA=A.inverseMass<=0;
		var isBackgroundB=B.inverseMass<=0;
		if(isBackgroundA){A.a=[0,0];	A.v=[0,0];}
		if(isBackgroundB){B.a=[0,0];	B.v=[0,0];}

		var isStopA={x:this.$stopParticle.x[particle[0]],y:this.$stopParticle.y[particle[0]]};
		var isStopB={x:this.$stopParticle.x[particle[1]],y:this.$stopParticle.y[particle[1]]};

		if(isBackgroundA || isBackgroundB){
			var contactVector=[0,(pA[1]-pB[1]>0) ? 1 :-1];
		}else{
			var contactVector=Vector.normalize(Vector.sub(pA,pB));
		}
		var separatingV=Vector.scalarProduct(Vector.sub(A.v,B.v),contactVector);
		if(separatingV>0){
			return;
		}

		var newSepV=-separatingV*this.$systemValue.restitution;
		var deltaV=newSepV-separatingV;

		var totalInverseMass=A.inverseMass+B.inverseMass;
		if(totalInverseMass<=0){ // 둘다 배경이라면
			return;
		}

		var impulse=deltaV/totalInverseMass; // Ma+Mb/MaMb * 속도 변화량
		//운동량은 보존된다.
		impulsePerlMass=Vector.multiply(contactVector,impulse);
		
		var aA=Vector.sum(A.v,Vector.multiply(impulsePerlMass,A.inverseMass));
		var aB=Vector.sum(B.v,Vector.multiply(impulsePerlMass,-B.inverseMass));

		if((!isStopA.y && !isBackgroundA) && (isStopB.y || isBackgroundB)){
			A.v[1]=A.m>=B.m ? 0 : aA[1];
			B.v[1]=0;
		}else if((!isStopB.y && !isBackgroundB) && (isStopA.y || isBackgroundA)){
			A.v[1]=0;
			B.v[1]=B.m>=A.m ? 0 : aB[1];
		}else if(!isStopA.y && !isBackgroundA && !isStopB.y && !isBackgroundB){
			A.v[1]=A.m>=B.m ? 0 : aA[1];
			B.v[1]=B.m>=A.m ? 0 : aB[1];
		}		

		A.v[0]=aA[0];
		B.v[0]=aB[0];

		this.detectStopParticle(particle[0]);
		this.detectStopParticle(particle[1]);	
		//앞부분에다가 작성하면
		return;
	}
	Engine.prototype.detectStopParticle=function(name){
		var particle=this.$particle[name],i;
		var particleLx=Math.abs(particle.v[0]);
		var particleLy=Math.abs(particle.v[1]);
		var obj=this.$stopParticle
		var l=1;
		if(particleLx<=l && particle.inverseMass>0){
			particle.v[0]=0; this.$stopParticle.x[name]=true
		}else{
			this.$stopParticle.x[name]=false;
		}
		if(particleLy<=l && particle.inverseMass>0){
			particle.v[1]=0; this.$stopParticle.y[name]=true
		}else{
			this.$stopParticle.y[name]=false;
		}
		return;
	}
})(window);
