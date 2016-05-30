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
			restitution:0.5,
			contactNormal:[0,1]
		};
		this.$systemValue.gravity=Vector.multiply(this.$gravity,this.$systemValue.engineTime);
		this.$systemValue.dammping=Math.pow(0.999,this.$systemValue.engineTime)

		this.$canvas=canvas;
		this.$particle=new Object();
			this.$particleStack=new Array();
			this.$crashParticleObject=new Object(); // 충돌이벤트 시 실행할 함수 목록 idea tag기능의 경우 "tag:~"
			this.$stopParticle=new Object(); // 충돌의 경우
		this.$gearSystem();
	}
	Engine.prototype.basicEngineInfo={
		fps:32,
		gravity:[0,0]
	};
	Engine.prototype.basicParticle={
		m:5,f:[0,0],v:[0,0],a:[0,0],
		friction:0.5,contactHandling:true
	};
	Engine.prototype.particleType={
		m:"number",
		f:"vector",
		a:"vector",
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
			for(i=0; i<particleKey.length; i++){
				//충돌판정 및 위치변동
				this.crashJudgment(particleKey[i],sysInfo.engineTime,i);		
				//적분기
				var drawElement=this.$canvas.$element[particleKey[i]];
				if(this.integrator(this.$particle[particleKey[i]],sysInfo.engineTime,!this.$stopParticle[particleKey[i]])){
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
			this.$canvas.createElement(this.$canvas.$element);

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

		particle.v=Vector.multiply(Vector.sum(particle.v,Vector.sum(Vector.multiply(particle.a,duration),gravity)),this.$systemValue.dammping); //Math.pow(0.999,duration)=>드래그 추가

		//기존 가속도에 중력을 더해준다.
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
				info.m=Number(info.m) ? Number(info.m) : Engine.prototype.basicParticle.m;
				info.f=Vector.isVector(info.f) || [Engine.prototype.basicParticle.f[0],Engine.prototype.basicParticle.f[1]];
				info.v=Vector.isVector(info.v) || [Engine.prototype.basicParticle.v[0],Engine.prototype.basicParticle.v[1]];
				info.a=Vector.isVector(info.a) || [Engine.prototype.basicParticle.a[0],Engine.prototype.basicParticle.a[1]];
				info.s=[this.$canvas.$element[key].x,this.$canvas.$element[key].y];
				info.inverseMass=1/info.m; //역 질량 a=f/inverseMass
				info.friction=Number(info.friction) ? Number(info.friction) : Engine.prototype.basicParticle.friction;
				info.contactHandling=info.contactHandling===true || info.contactHandling===false ? info.contactHandling : Engine.prototype.basicParticle.contactHandling;
				this.$particle[key]=info;
				return 1;
			case false:
				this.$particleStack.push(key);
				return this;
		}

	}
	Engine.prototype.property=function(propertyName,propertyValue){
		if(this.$particleStack.length<1){
			return;
		}
		var particle=this.$particle[this.$particleStack.pop()];

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
				particle[keyName]=result;
			}
			particle.inverseMass=1/particle.m; //역질량 설정
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
				return Vector.isVector(particle[propertyName.toLowerCase()]) ? Canvas.prototype.CopyObj(particle[propertyName.toLowerCase()]) : particle[propertyName.toLowerCase()];
			}
			particle[name]=result;
			particle.inverseMass=1/particle.m;

			return 1;
		}
		return;
	}
	Engine.prototype.addForce=function(f){
		if(this.$particleStack.length<1){
			return;
		}
		var particle=this.$particle[this.$particleStack.pop()];
		//여기서 바로 힘을 추가하는것이아닌 물리엔진부분에서 힘을 가한다
		//즉 addForce 함수는 결국 힘예약
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
		var targetObj=this.$canvas.$event[particle].line,
			particleKey=Object.keys(this.$particle),crash=false,
			p=this.imagineIntergrator(particle,duration),
			deltaP={x:p[0]-particleProperty.s[0],y:p[1]-particleProperty.s[1]},odeltaP={x:NaN,y:NaN};
		if(targetObj.length<3){
			return;
		}
		var i,j,e;
		for(i=index+1; i<particleKey.length; i++){
			var oparticleProperty=this.$particle[particleKey[i]];
			if(oparticleProperty.contactHandling===false){continue}
			otherObj=this.$canvas.$event[particleKey[i]].line;
			tempP=this.imagineIntergrator(particleKey[i],duration);
			odeltaP={x:tempP[0]-oparticleProperty.s[0],y:tempP[1]-oparticleProperty.s[1]};
			if(otherObj.length<3){
				continue;
			}
			for(j=0; j<targetObj.length; j++){
				tempTargetObj=(j<targetObj.length-1) ? targetObj[j+1] : targetObj[0];
				for(e=0; e<otherObj.length; e++){
					tempOtherObj=(e<otherObj.length-1) ? otherObj[e+1] : otherObj[0];
					var x1=targetObj[j][0]+deltaP.x,y1=targetObj[j][1]+deltaP.y,
						x2=tempTargetObj[0]+deltaP.x,y2=tempTargetObj[1]+deltaP.y,
						x3=otherObj[e][0]+odeltaP.x,y3=otherObj[e][1]+odeltaP.y,
						x4=tempOtherObj[0]+odeltaP.x,y4=tempOtherObj[1]+odeltaP.y;
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
				this.particleContact([particle,particleKey[i]],duration);
				crash=false;
				continue;
			}
			this.$stopParticle[particle]=false;
			this.$stopParticle[particleKey[i]]=false;
		}
	}
	Engine.prototype.particleContact=function(particle,duration){
		var A=this.$particle[particle[0]];
		var B=this.$particle[particle[1]];
		/**************************************************************/
		/*문제, 왜 x축 속도를 지정해줄경우에만	 충돌판정을하는가?*/
		
		if(A.inverseMass<=0){A.a=[0,0];	A.v=[0,0];}
		if(B.inverseMass<=0){B.a=[0,0];	B.v=[0,0];}

		var contactVector=Vector.multiply(this.$systemValue.contactNormal,(A.s[1]-B.s[1]>0) ? 1 :-1);

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
		impulsePerlMass=Vector.multiply(contactVector,impulse);
		A.v=Vector.multiply(Vector.sum(A.v,Vector.multiply(impulsePerlMass,A.inverseMass)),Math.pow(B.friction,duration));
		B.v=Vector.multiply(Vector.sum(B.v,Vector.multiply(impulsePerlMass,-B.inverseMass)),Math.pow(A.friction,duration));

		var Alength=A.v[1],Blength=B.v[1];
		if(Alength>=-1 && Alength<=1){
			A.v[1]=0; this.$stopParticle[particle[0]]=true
		}else{
			this.$stopParticle[particle[0]]=false;
		}
		if(Blength>=-1 && Blength<=1){
			B.v[1]=0; this.$stopParticle[particle[1]]=true
		}else{
			this.$stopParticle[particle[1]]=false;
		}
		return;
	}
})(window);
