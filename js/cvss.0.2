/************************************************************************
CVSS javascript Libaray - Version 0.2
made by
*************************************************************************/
(function(window){
	window.Canvas=function Canvas(/*optional*/id){
		if(typeof id=="string"){
			this.target(id);
		}
	}
	Canvas.prototype.target=function(name){
		var canvas=document.getElementById(name.substring(1)) //#(맨 앞글자)을 제외한다.
			,context=canvas.getContext("2d");

		if(context){
			this.$canvas=canvas;
			this.$context=context;
			this.$element=new Object(); //현재 등록된 엘레먼트의 정보를 보관한다.
			this.$elementKey=new Object(); //zindex에 따라 객체의 순서를 지정해줄 필요가있다
			
			var th=this;

			this.$canvas.addEventListener("mousemove",tempCanvasMouseOver);
			this.$canvas.addEventListener("mousedown",tempCanvasMouseDown);
			this.$canvas.addEventListener("mouseup",tempCanvasMouseUp);
			this.$canvas.addEventListener("mouseout",function(){
				var sys=th.$systemValue;
				if(sys.prevOverElement && sys.eventFunc[sys.prevOverElement] && typeof sys.eventFunc[sys.prevOverElement].mouseout == "function"){sys.eventFunc[sys.prevOverElement].mouseout.apply(th,[NaN,sys.prevOverElement]);}
				else if(sys.prevOverElement && th.$element[sys.prevOverElement] && th.$element[sys.prevOverElement].baseEventElement && sys.eventFunc[th.$element[sys.prevOverElement].baseEventElement] && typeof sys.eventFunc[th.$element[sys.prevOverElement].baseEventElement].mouseout=="function"){sys.eventFunc[th.$element[sys.prevOverElement].baseEventElement].mouseout.apply(th,[NaN,sys.prevOverElement]);}

				if(sys.dragOn && sys.eventFunc[sys.dragElement] && typeof sys.eventFunc[sys.dragElement].drop=="function"){
					sys.eventFunc[sys.dragElement].drop.apply(th,[NaN,sys.dragElement]);
				}else if(sys.dragOn && th.$element[sys.dragElement].baseEventElement && th.$element[sys.dragElement].baseEventElement && sys.eventFunc[th.$element[sys.dragElement].baseEventElement] && typeof sys.eventFunc[th.$element[sys.dragElement].baseEventElement].drop=="function"){
					sys.eventFunc[th.$element[sys.dragElement].baseEventElement].drop.apply(th,[NaN,sys.dragElement]);
				}
				sys.prevOverElement=undefined;
				th.$canvas.style.cursor="default";
				sys.dragOn=false;
				sys.prevEventElement=undefined;
				sys.prevEventType=undefined;
			});

			function tempCanvasMouseOver(event){th.detectMOUSEMOVE(event);}
			function tempCanvasMouseDown(event){th.detectMOUSEDU(event,"mousedown");}
			function tempCanvasMouseUp(event){th.detectMOUSEDU(event,"mouseup");}
			this.$canvas.onselectstart=function(){return false};

			this.$systemValue={
				prevOverElement:undefined,
				prevEventElement:undefined,
				prevEventType:undefined,
				dblclickTimer:false,
				dblclickTimerFunc:undefined,
				dragOn:false,
				dragElement:undefined,
				eventFunc:new Object(),//객체{이벤트 타입:함수}
				windowEvent:new Object(),
				eventPointer:new Object(),//block 이나 polygon의 점들의 좌표를 보관한다.
				imageData:new Array(),
				imageSrc:new Array(),
				imageDataMatch:new Object(),
				STACK:new Array(),
				elementType:["block","polygon","circle","text"],
				elementEventType:["mouseup","mousedown","click","mousein","mouseout","dblclick","dragstart","drag","drop"],
				backgroundRepeatType:["no-repeat","repeat","repeat-y","repeat-x"]
			}
		}else{
			console.warn("CvSS ERROR : "+name+" 캔버스를 찾을 수 없습니다.");
			return;
		}
	}
	Canvas.prototype.polygonInsideCheck=function(pointer,lineInfo,figure){
		var length=typeof lineInfo=="object" ? lineInfo.length : 0;
		if(length<=2){
			return 0;
		}
		var direct=[0,0],i,temp;
		for(i=0; i<length; i++){
			if(i==length-1){
				temp=0;
			}else{
				temp=i+1;
			}
			if((lineInfo[i][1]<pointer.y && pointer.y<=lineInfo[temp][1]) || (lineInfo[temp][1]<pointer.y && pointer.y<=lineInfo[i][1])){
				if((-pointer.y+lineInfo[i][1])*(lineInfo[temp][0]-lineInfo[i][0])/(-lineInfo[temp][1]+lineInfo[i][1])+lineInfo[i][0]<=pointer.x){
					direct[0]++;			
				}else{
					direct[1]++;
				}
			}
		}
		if(direct[0]%2==1 && direct[1]%2==1){
			return 1;
		}
		return 0;
	}
	Canvas.prototype.detectMOUSEMOVE=function(event){
		var e=Canvas.prototype.getRealMousePosition(event),i,j,
			sys=this.$systemValue,insideCheck=false,element;

		if(typeof sys.windowEvent.mousemove=="function"){ //윈도우 함수가 등록되어있으면 실행한다.
			sys.windowEvent.mousemove.apply(this,[e]);
		}
		if(sys.prevEventType=="mousedown"){ // 드래그판정
			if(sys.dragOn===false){
				sys.dragOn=true;
				sys.dragElement=sys.prevEventElement;
				if(sys.eventFunc[sys.dragElement] && typeof sys.eventFunc[sys.dragElement].dragstart=="function"){
					sys.eventFunc[sys.dragElement].dragstart.apply(this,[e,sys.dragElement]);
				}else if(this.$element[sys.dragElement].baseEventElement && sys.eventFunc[this.$element[sys.dragElement].baseEventElement] && typeof sys.eventFunc[this.$element[sys.dragElement].baseEventElement].dragstart=="function"){
					sys.eventFunc[this.$element[sys.dragElement].baseEventElement].dragstart.apply(this,[e,sys.dragElement]);
				}
			}else{
				if(sys.eventFunc[sys.dragElement] && typeof sys.eventFunc[sys.dragElement].drag=="function"){
					sys.eventFunc[sys.dragElement].drag.apply(this,[e,sys.dragElement]);
				}else if(this.$element[sys.dragElement].baseEventElement && sys.eventFunc[this.$element[sys.dragElement].baseEventElement] && typeof sys.eventFunc[this.$element[sys.dragElement].baseEventElement].drag=="function"){
					sys.eventFunc[this.$element[sys.dragElement].baseEventElement].drag.apply(this,[e,sys.dragElement]);
				}
			}
		}
		for(i=this.$elementKey.length-1; i>=0; i--)
		{
			element=this.$element[this.$elementKey[i]];
			if(element.show===false || element.onlyBaseElement===true){continue;}
			var tempE=sys.eventPointer[this.$elementKey[i]];
			switch(element.type){
				case "block":
				case "polygon":
					insideCheck=Canvas.prototype.polygonInsideCheck({x:e.x,y:e.y},tempE.line);
					break;
				case "circle":
					var c=sys.eventPointer[this.$elementKey[i]].c,a=sys.eventPointer[this.$elementKey[i]].a;
					if(Math.sqrt(Math.pow(e.x-c.x,2)+Math.pow(e.y-c.y,2))+Math.sqrt(Math.pow(e.x-c.mirrorx,2)+Math.pow(e.y-c.mirrory,2))<a*2){
						insideCheck=true;
					}
					break;						
			}
			if(insideCheck){
				var key=this.$elementKey[i];
				this.$canvas.style.cursor=element.cursor || this.$initElement.cursor;
				if(sys.prevOverElement==key){return;}
				if(sys.prevOverElement && sys.prevOverElement!=key && sys.eventFunc[sys.prevOverElement] && typeof sys.eventFunc[sys.prevOverElement].mouseout == "function"){sys.eventFunc[sys.prevOverElement].mouseout.apply(this,[e,sys.prevOverElement]);}
				else if(sys.prevOverElement && sys.prevOverElement!=key && this.$element[sys.prevOverElement].baseEventElement && sys.eventFunc[this.$element[sys.prevOverElement].baseEventElement] && typeof sys.eventFunc[this.$element[sys.prevOverElement].baseEventElement].mouseout=="function"){sys.eventFunc[this.$element[sys.prevOverElement].baseEventElement].mouseout.apply(this,[e,sys.prevOverElement]);}
				sys.prevOverElement=key; 
				if(sys.eventFunc[key] && typeof sys.eventFunc[key].mousein == "function"){sys.eventFunc[key].mousein.apply(this,[e,key]);}
				else if(element.baseEventElement && sys.eventFunc[element.baseEventElement] && typeof sys.eventFunc[element.baseEventElement].mousein=="function"){sys.eventFunc[element.baseEventElement].mousein.apply(this,[e,key]);}			
				return;
			}
		}
		if(sys.prevOverElement && sys.eventFunc[sys.prevOverElement] && typeof sys.eventFunc[sys.prevOverElement].mouseout == "function"){sys.eventFunc[sys.prevOverElement].mouseout.apply(this,[e,sys.prevOverElement]);}
		else if(sys.prevOverElement && this.$element[sys.prevOverElement] && this.$element[sys.prevOverElement].baseEventElement && sys.eventFunc[this.$element[sys.prevOverElement].baseEventElement] && typeof sys.eventFunc[this.$element[sys.prevOverElement].baseEventElement].mouseout=="function"){sys.eventFunc[this.$element[sys.prevOverElement].baseEventElement].mouseout.apply(this,[e,sys.prevOverElement]);}
		sys.prevOverElement=undefined;
		this.$canvas.style.cursor="default";
	}
	Canvas.prototype.detectMOUSEDU=function(event,type){
		var e=Canvas.prototype.getRealMousePosition(event),i,
			insideCheck=false,j,element,sys=this.$systemValue;
		if(typeof sys.windowEvent[type]=="function"){
			sys.windowEvent[type].apply(this,e);
		}
		if(type=="mouseup" && sys.dragOn){
			sys.dragOn=false;
			if(sys.eventFunc[sys.dragElement] && typeof sys.eventFunc[sys.dragElement].drop=="function"){
				sys.eventFunc[sys.dragElement].drop.apply(this,[e,sys.dragElement]);
			}else if(this.$element[sys.dragElement].baseEventElement && this.$element[sys.dragElement].baseEventElement && sys.eventFunc[this.$element[sys.dragElement].baseEventElement] && typeof sys.eventFunc[this.$element[sys.dragElement].baseEventElement].drop=="function"){
					sys.eventFunc[this.$element[sys.dragElement].baseEventElement].drop.apply(this,[NaN,sys.dragElement]);
			}
		}
		for(i=this.$elementKey.length-1; i>=0; i--){
			element=this.$element[this.$elementKey[i]];
			if(element.show===false || element.onlyBaseElement===true){continue;}
			var tempE=sys.eventPointer[this.$elementKey[i]];
			switch(element.type){
				case "block":
				case "polygon":
					insideCheck=Canvas.prototype.polygonInsideCheck({x:e.x,y:e.y},tempE.line);
					break;
				case "circle":
					var c=sys.eventPointer[this.$elementKey[i]].c,a=sys.eventPointer[this.$elementKey[i]].a;
					if(Math.sqrt(Math.pow(e.x-c.x,2)+Math.pow(e.y-c.y,2))+Math.sqrt(Math.pow(e.x-c.mirrorx,2)+Math.pow(e.y-c.mirrory,2))<a*2){
						insideCheck=true;
					}
					break;				
			}
			if(insideCheck){
				if(type=="mousedown" && sys.prevEventElement!=this.$elementKey[i]){
					clearTimeout(sys.dblclickTimerFunc);
					sys.dblclickTimer=false;
				}					
				if(type=="mouseup" && sys.prevEventElement==this.$elementKey[i] && sys.prevEventType=="mousedown"){
					type="click";
					sys.dblclickTimerFunc=setTimeout(function(){sys.dblclickTimer=false;},500);						
					if(sys.dblclickTimer==true){
						clearTimeout(sys.dblclickTimerFunc);
						sys.dblclickTimer=false;
						type="dblclick";
					}else{
						var th=this;
						sys.dblclickTimer=true;
						sys.dblclickTimerFunc=setTimeout(function(){sys.dblclickTimer=false;},500);						
					}
				}

				sys.prevEventElement=this.$elementKey[i];
				sys.prevEventType=type;
				this.$canvas.style.cursor=element.cursor || this.$initElement.cursor;	
				if(sys.eventFunc[this.$elementKey[i]] && typeof sys.eventFunc[this.$elementKey[i]][type] == "function"){sys.eventFunc[this.$elementKey[i]][type].apply(this,[e,this.$elementKey[i]]);}
				else if(element.baseEventElement && sys.eventFunc[element.baseEventElement] && typeof sys.eventFunc[element.baseEventElement][type]=="function"){sys.eventFunc[element.baseEventElement][type].apply(this,[e,this.$elementKey[i]]);}
				return;
			}
		}
		sys.prevEventElement=undefined;
		sys.prevEventType=undefined;
	}
	Canvas.prototype.getRealMousePosition=function(event){
		var mouseX,mouseY
		var e=event.originalEvent || event,
			canvas=event.currentTraget || event.srcElement,
			boundingRect=canvas.getBoundingClientRect();
		if(e.touches){
			mouseX=e.touches[0].clientX-boundingRect.left;
			mouseY=e.touches[0].clientY-boundingRect.top;
		}else{
			mouseX=e.clientX-boundingRect.left;
			mouseY=e.clientY-boundingRect.top;
		}
		return{
			x:parseInt(mouseX),
			y:parseInt(mouseY)
		}
	}
	//numberFormat함수는 문자열 형식의 숫자를 입력받으면 이를 순수한 숫자로 반환한다.
	//또한 previous_val을 통하여 이전 값에 현재값을 더하거나 빼는 증감연산자를 사용할수 있다.
	Canvas.prototype.numberFormat=function(val,previousVal,initVal,px){
		if(isNaN(previousVal)){//previousVal이 올바른 숫자가 아니면 initVal로 대채한다.
			previousVal=initVal;
		}
		if(typeof val =="string"){
			if(val.substring(val.length-2)=="px" && px!==false){ //px이 false라면 Npx 형식을 지원하지않는다.
				val=val.substring(0,val.length-2);
			}
			switch(val.substring(0,2)){
				case "+=":val=Number(previousVal)+Number(val.substring(2)); break;
				case "-=":val=Number(previousVal)-Number(val.substring(2)); break;
			}
			val=Number(val);
		}
		return isNaN(val) ? initVal : val;
	}

	Canvas.prototype.persentFormat=function(size,val,initVal){
		var front=new String();
		if(typeof val=="string" && (val.substring(0,2)=="+=" || val.substring(0,2)=="-=")){
			front=val.substring(0,2);
			val=val.substring(2);
		}
		switch(typeof val){
			case "string":
				if(val.substring(val.length-2,val.length)=="px"){
					val=Number(val.substring(0,val.length-2)) || initVal;
				}else if(val.substring(val.length-1,val.length)=="%"){
					val=(size/100)*Number(val.substring(0,val.length-1)) || initVal;
				}else{
					val=Number(val) || initVal;
				}
				break;
			case "number":break;
			default: val=initVal;
		}
		return front=="" ? val : front+val;
	}
	Canvas.prototype.setBaseObj=function(baseObj,newObj,sub,baseElementCheck){
		var key=Object.keys(newObj),
			r=Canvas.prototype.CopyObj(baseObj);
		if(baseElementCheck && sub){delete r.onlyBaseElement}
		for(var i=0; i<key.length; i++){
			var newKey=key[i];
			//불른 형식으로 타입이결정되는 객체는 제외 show가안되는이유는 onlybaseelement에서막혔기 때문이다.
			if(sub && newKey!="onlyBaseElement" && newKey!="show" && (newObj[newKey]=="none" || isNaN(newObj[newKey]))){
				if(!baseElementCheck){
					delete r[newKey];
					if(sub){
						r.$temp=true;
					}else{
						r[newKey].$temp=true;
					}
				}
				continue;
			}else{
				r[newKey]=newObj[newKey];
				if(sub){
					r.$temp=true;
				}else{
					r[newKey].$temp=true;
				}
			}
		}
		return r;
	}

	Canvas.prototype.drawElement=function (info,/*optional*/option){
		if(!info){ //info가 없으면 리턴
			return;
		}else if(typeof info=="string" || typeof info=="number"){ 
			var name=info;
			if(typeof option=="object"){ //drawElement(엘레먼트이름,{속성:...})
				info=new Object();
				info[name]=Canvas.prototype.setBaseObj(this.$element[name],option,true);		
			}else{
				return;
			}
		}else if(typeof info!="object"){
			return;
		}

		info=Canvas.prototype.setBaseObj(this.$element,info);
		//이전 엘레먼트에 현재 입력받 정보를 덮어씌기한다.
		this.$context.clearRect(0,0,this.$canvas.width,this.$canvas.height); // 캔버스를 지운다
		var i,j,infoKey=Object.keys(info),element,img_obj=[],img_info=[],
			initElement=this.$initElement, // the initial value of cvssElement
			numberFormat=Canvas.prototype.numberFormat,
			persentFormat=Canvas.prototype.persentFormat,
			sys=this.$systemValue;

		infoKey=infoKey.sort(function(a,b){ // ZINDEX에 따라 엘레먼트를 출력할 순서를 지정해줘야하기때문에 정렬한다.
			return (info[a].zindex || initElement.zindex)<(info[b].zindex || initElement.zindex) ? -1 : (info[a].zindex || initElement.zindex)>(info[b].zindex || initElement.zindex) ? 1 : 0;
		});
		this.$elementKey=infoKey; //$elementKey에 정렬된 key순서를 적용한다, 다른 함수(이벤트함수)에서도 엘레먼트의 출력순서는 꼭 필요하다

		var patterns=sys.backgroundRepeatType; //block속성 중 background기능에서 repeat의 허용범위를 지정해준 배열을 불러온다.

		for(i=0; i<infoKey.length; i++){
			var x=NaN,y=NaN,width=NaN,height=NaN,temp=NaN,border={width:0,color:0},sourceX=NaN,sourceY=NaN,src=NaN,pattern=NaN,origin=NaN,borderArr=NaN,TempX=NaN,TempY=NaN; //대표적인 속성값을 NaN으로 초기화한다.

			element=info[infoKey[i]];
			$element=this.$element[infoKey[i]];

			this.$context.save();
			if(typeof element.baseElement=="string" && ($element && $element.baseElement)!=element.baseElement){
				element.baseStyleElement=($element && $element.baseStyleElement)==element.baseStyleElement ? element.baseElement : element.baseStyleElement;
				element.baseEventElement=($element && $element.baseEventElement)==element.baseEventElement ? element.baseElement : element.baseEventElement;
			}
			if(typeof element.baseStyleElement=="string" && typeof info[element.baseStyleElement]=="object"){
				element=Canvas.prototype.setBaseObj(info[element.baseStyleElement],element,true,true);
			}
			if(sys.elementType.indexOf(element.type) == -1){
				element.type=initElement.type;
			}
			element.opacity=numberFormat(element.opacity,$element && $element.opacity || 0,initElement.opacity);
			this.$context.globalAlpha=element.opacity;

			if(!sys.eventPointer[infoKey[i]]){
				sys.eventPointer[infoKey[i]]=new Object();
			}
			event=sys.eventPointer[infoKey[i]];

			if(element.$temp || !$element){
				if((!$element && typeof element.border=="string")|| typeof element.border=="string" && ($element && $element.border!=element.border)){
					borderArr=element.border.split(" ");
					border.width=numberFormat(borderArr[0],0,initElement.borderWidth);
						this.$context.lineWidth=border.width;
					border.color=borderArr[2] || initElement.borderColor;
						this.$context.strokeStyle=border.color;
				}
				if(!border.width){
					border.width=numberFormat(element.borderWidth,($element && $element.borderWidth)||0,initElement.borderWidth);
					this.$context.lineWidth=border.width;
				}
				if(!border.color){
					border.color=element.borderColor || initElement.borderColor;
					this.$context.strokeStyle=border.color;
				}
			}

			switch(element.type){
				case "block":
					if(element.$temp || !$element){
						element.width=numberFormat(persentFormat(this.$canvas.width,element.width,initElement.width),($element && $element.width) || 0,initElement.width);
						element.height=numberFormat(persentFormat(this.$canvas.height,element.height,initElement.height),($element && $element.height) || 0,initElement.height);
						element.x=numberFormat(persentFormat(this.$canvas.width,element.x,initElement.x),($element && $element.x),initElement.x);
						element.y=numberFormat(persentFormat(this.$canvas.height,element.y,initElement.y),($element && $element.y),initElement.y);
					
						width=element.width;
						if(element.minWidth){
							element.minWidth=numberFormat(persentFormat(this.$canvas.width,element.minWidth,0),($element && $element.minWidth) || 0,0);
							width=element.minWidth<element.width ? element.width : element.minWidth;
						}
						if(element.maxWidth){
							element.maxWidth=numberFormat(persentFormat(this.$canvas.width,element.maxWidth,width),($element && $element.maxWidth) || 0,width);
							width=element.maxWidth<width ? element.maxWidth : width;
						}
						
						height=element.height;
						if(element.minHeight){
							element.minHeight=numberFormat(persentFormat(this.$canvas.height,element.minHeight,0),($element && $element.minHeight) || 0,0);
							height=element.minHeight<element.height ? element.height :element.minHeight;
						}
						if(element.maxHeight){
							element.maxHeight=numberFormat(persentFormat(this.$canvas.height,element.maxHeight,height),($element && $element.maxHeight) || 0,height);
							height=element.maxHeight<height ? element.maxHeight: height;
						}

						x=element.x;
						y=element.y;
						origin=typeof element.origin=="string" ? element.origin.split(" ") : initElement.origin;
						x-=persentFormat(element.width,origin[0],initElement.origin[0]);
						y-=persentFormat(element.height,origin[1],initElement.origin[1]);

						this.$context.fillStyle=element.background ? element.background: initElement.background;

						element.borderWidth=border.width;
						element.borderColor=border.color;
						element.border=border.width+" solid "+border.color;
						if(element.backgroundImage){
							if(typeof element.backgroundImage=="string"){
								temp=element.backgroundImage.split(" ");
								src=temp[0] || initElement.backgroundImage.src;
								pattern=patterns.indexOf(temp[1])!=-1 ? temp[1] : initElement.backgroundImage.pattern;
								sourceX=numberFormat(temp[2],($element && $element.backgroundImageX)||0,0);
								sourceY=numberFormat(temp[3],($element && $element.backgroundImageY)||0,0);
							}
							if((!$element && element.backgroundImageSrc) || ($element && $element.backgroundImageSrc!=element.backgroundImageSrc)){src=element.backgroundImageSrc;}
							if((!$element && element.backgroundImagePattern) || ($element && $element.backgroundImagePattern!=element.backgroundImagePattern)){pattern=patterns.indexOf(element.backgroundImagePattern)==-1?initElement.backgroundImage.pattern : element.backgroundImagePattern}
							if((!$element && typeof element.backgroundImageX=="number") || ($element && $element.backgroundImageX!=element.backgroundImageX)){
								sourceX=numberFormat(element.backgroundImageX,($element && $element.backgroundImageX)||0,0);
							}

							if((!$element && typeof element.backgroundImageY)=="number" || ($element && $element.backgroundImageY!=element.backgroundImageY)){
								sourceY=numberFormat(element.backgroundImageY,($element && $element.backgroundImageY)||0,0);
							}
							element.backgroundImage=src+" "+pattern+" "+sourceX+" "+sourceY;
							element.backgroundImageSrc=src;
							element.backgroundImagePattern=pattern;
							element.backgroundImageX=sourceX;
							element.backgroundImageY=sourceY;				
						}
						if(typeof element.scaleX=="number"){
							element.scaleX=numberFormat(persentFormat(element.width,element.scaleX,initElement.scale.x),($element && $element.scaleX),initElement.scale.x);
						}
						if(typeof element.scaleY=="number"){
							element.scaleY=numberFormat(persentFormat(element.height,element.scaleY.initElement.scale.y),($element && $element.scaleY),initElement.scale.y);
						}
						if(element.rotate){ //transform
							element.rotate=numberFormat(element.rotate,$element && $element.rotate,initElement.rotate,false);
							element.rotateOriginX=numberFormat(persentFormat(element.width,element.rotateOriginX,initElement.rotateOrigin.x),($element && $element.rotateOriginX),initElement.rotateOrigin.x);
							element.rotateOriginY=numberFormat(persentFormat(element.height,element.rotateOriginY,initElement.rotateOrigin.y),($element && $element.rotateOriginY),initElement.rotateOrigin.y);
							var cos=Math.cos(element.rotate);
							var sin=Math.sin(element.rotate);
							//x+rotateOriginX
							event.line=[[-element.rotateOriginX*cos+element.rotateOriginY*sin+x+element.rotateOriginX,-element.rotateOriginX*sin-element.rotateOriginY*cos+y+element.rotateOriginY],[(width-element.rotateOriginX)*cos+element.rotateOriginY*sin+x+element.rotateOriginX,(width-element.rotateOriginX)*sin-element.rotateOriginY*cos+y+element.rotateOriginY],[(width-element.rotateOriginX)*cos-(height-element.rotateOriginY)*sin+x+element.rotateOriginX,(width-element.rotateOriginX)*sin+(height-element.rotateOriginY)*cos+y+element.rotateOriginY],[-element.rotateOriginX*cos-(height-element.rotateOriginY)*sin+x+element.rotateOriginX,-element.rotateOriginX*sin+(height-element.rotateOriginY)*cos+y+element.rotateOriginY]];	
							t=event.line;
						}else{
							event.line=[[x,y],[x+width,y],[x+width,y+height],[x,y+height]];	
							t=event.line;
						}
						delete element.$temp;
					}else{
						x=element.$x;
						y=element.$y;
						width=element.width;
						height=element.height;

						this.$context.fillStyle=element.background ? element.background: initElement.background;
						this.$context.lineWidth=element.borderWidth;
						this.$context.strokeStyle=element.borderColor;
						if(element.backgroundImage){
							sourceX=element.backgroundImageX;
							sourceY=element.backgroundImageY;
							pattern=element.backgroundImagePattern;
							src=element.backgroundImageSrc;
						}
					}
								
					if(element.backgroundImage){
						var index=this.$imageSrc.indexOf(src);
						if(index == -1){
							var image=new Image(),th=this;
							image.onload=function(){
								sys.imageData.push(this);
								sys.imageSrc.push(this.src);
								sys.imageDataMatch[infoKey[i]]=sys.imageData.length-1;
								th.drawElement(th.$element);
							};
							image.src=src;
							element.$backgroundImage={
								width:NaN,height:NaN
							};
						}else{
							var img=sys.imageData[index],w=width<img.width ? width : img.width,h=height<img.height ? height : img.height;
							element.$backgroundImage={
								width:img.width,height:img.height
							};
						}
					}
					if(element.show===false || element.show=="false"){
						element.show=false;
						this.$element[infoKey[i]]=element;
						this.$context.restore();
						continue;												
					}
					if( element.onlyBaseElement===true || element.onlyBaseElement=="true"){
						element.onlyBaseElement=true;
						this.$element[infoKey[i]]=element;
						this.$context.restore();
						continue;												
					}
					
					if(element.rotate){
						TempX=x,TempY=y;
						x=-(element.rotateOriginX),y=-(element.rotateOriginY);
						this.$context.rotate(element.rotate);
					}
					if(element.borderWidth>0){
						this.$context.strokeRect(x-element.borderWidth/2,y-element.borderWidth/2,width+element.borderWidth,height+element.borderWidth);
					}
					this.$context.fillRect(x,y,width,height);
					if(index!==-1){
						if(pattern=="no-repeat"){
							var tempsourcex=0,tempsourcey=0,tempsourcewidth=w,tempsourceheight=h,tempx=x+sourceX,tempy=y+sourceY;
							if(sourceX<0){
								tempsourcex=-sourceX;
								tempsourcewidth=w;
								tempx=x;
							}else if(sourceX+img.width>width){
								tempsourcex=0;
								tempsourcewidth=width-sourceX;
							}
							if(sourceY<0){
								tempsourcey=-sourceY;
								tempsourceheight=h;
								tempy=y;
							}else if(sourceY+img.height>height){
								tempsourcey=0;
								tempsourceheight=height-sourceY;
							}
							this.$context.drawImage(img,tempsourcex,tempsourcey,tempsourcewidth,tempsourceheight,tempx,tempy,tempsourcewidth,tempsourceheight);
						}else if(pattern=="repeat"){
							var countx=Math.ceil(width/img.width),county=Math.ceil(height/img.height),count=countx*county,rw=width%img.width,rh=height%img.height;
							for(j=1; j<=count; j++){
								if(j==count){
									this.$context.drawImage(img,0,0,rw,rh,x+(countx-1)*w,y+(county-1)*h,rw,rh);
								}else if(j%countx==0){
									this.$context.drawImage(img,0,0,rw,h,x+(countx-1)*w,y+parseInt((j-1)/countx)*h,rw,h);
								}else if(j>(county-1)*countx){
									this.$context.drawImage(img,0,0,w,rh,x+(parseInt((j-1)%countx))*w,y+(county-1)*h,w,rh);
								}else{
									this.$context.drawImage(img,0,0,w,h,x+((j%countx)-1)*w,y+parseInt((j-1)/countx)*h,w,h);											
								}
							}
						}else{
							var count,rw,rh,px,py;
							switch(pattern){
								case "repeat-x":count=parseInt(width/img.width),rw=width%img.width,rh=height<img.height ? height : img.height,px=img.width,py=0,w=width<img.width ? width : img.width;
									break;
								case "repeat-y":count=parseInt(height/img.height),rh=height%img.height,rw=width<img.width ? width : img.width,px=0,py=img.height,h=height<img.height ? height : img.height;
									break;
							}
							for(j=0; j<=count; j++){
								if(j==count){
									this.$context.drawImage(img,0,0,rw,rh,x+j*px,y+j*py,rw,rh);
									continue;
								}
								this.$context.drawImage(img,0,0,w,h,x+j*px,y+j*py,w,h);
							}		
						}
					}
					x=TempX ? TempX : x;
					y=TempY ? TempY : y;
					element.$x=x;
					element.$y=y;

					break;
				case "polygon":
					if(element.$temp || !$element){
						element.borderWidth=border.width;
						element.borderColor=border.color;
						element.border=border.width+" solid "+border.color;
						if(element.line && typeof(element.line) =="object"){
							var pass=0;
							element.figure=element.figure===undefined ? initElement.figure : element.figure;
							var isFigure=element.figure===true;
							
							if(!event.line){
								event.line=new Array();
							}
							this.$context.beginPath();
							
							if(typeof element.line[0][0] !="number" || typeof element.line[0][1] != "number"){
								pass=1;
							}else{

								for(j=0; j<element.line.length; j++){
									if(typeof element.line[j][0] !="number" || typeof element.line[j][1] != "number"){
										pass=1;
										break;
									}
									element.line[j][0]=numberFormat(element.line[j][0],($element && $element.line && $element.line[j][0])||0,0);
									element.line[j][1]=numberFormat(element.line[j][1],($element && $element.line && $element.line[j][1])||0,0);

									if(!event.line[j]){
										event.line[j]=new Object();
									}
									event.line[j][0]=element.line[j][0];
									event.line[j][1]=element.line[j][1];
									if(j==0){
										this.$context.moveTo(element.line[0][0],element.line[0][1]);
										continue;
									}
									this.$context.lineTo(element.line[j][0],element.line[j][1]);
								}
							}
							if(element.figure===true || element.figure=="true"){
								element.figure=true;
								this.$context.closePath();
							}
							if(pass==0){
								if(element.background && element.figure===true){this.$context.fillStyle=element.background; this.$context.fill();}
								this.$context.stroke();
							}
						}
						delete element.$temp;
					}else{							
						this.$context.lineJoin=element.lineJoin;
						this.$context.lineWidth=element.borderWidth;
						this.$context.strokeStyle=element.borderColor;
						this.$context.beginPath();
						for(j=0; j<(event.line && event.line.length) || 0; j++){
							if(j==0){
								this.$context.moveTo(element.line[0][0],element.line[0][1]);
								continue;
							}
							this.$context.lineTo(element.line[j][0],element.line[j][1]);
						}
						if(element.figure===true || element.figure=="true"){
							element.figure=true;
							this.$context.closePath();
						}
						if(element.background && element.figure===true){this.$context.fillStyle=element.background; this.$context.fill();}
						this.$context.stroke();
					}
					break;
				case "circle":
					if(element.$temp || !$element){
						x=numberFormat(element.x,($element && $element.x) || 0,initElement.circle.x);
						y=numberFormat(element.y,($element && $element.y) || 0,initElement.circle.y);

						element.r=numberFormat(element.r,($element && $element.r),10);
					

						element.borderWidth=border.width;
						element.borderColor=border.color;
						element.border=border.width+" solid "+border.color;

						if(!element.start){
							element.start=initElement.circle.start;
						}
						if(!element.end){
							element.end=initElement.circle.end;
						}
						if(!element.clock){
							element.clock=initElement.circle.clock;
						}

						origin=typeof element.origin=="string" ? element.origin.split(" ") : initElement.origin;
						x-=persentFormat(element.r*2,origin[0],initElement.origin[0]);
						y-=persentFormat(element.r*2,origin[1],initElement.origin[1]);

						this.$context.beginPath();
						this.$context.arc(x,y,element.r,element.start,element.end,element.clock);
						if(element.background){this.$context.fillStyle=element.background; this.$context.fill();}
						if(element.borderWidth>0){this.$context.stroke();}

						if(typeof event.c!="object"){
							event.c=new Object();
						}
						event.c.x=x;
						event.c.y=y;
						event.c.mirrorx=x;
						event.c.mirrory=y;
						event.a=element.r;
						event.mirror=true;

						element.$x=x;
						element.$y=y;
						delete element.$temp;
					}else{
						this.$context.beginPath();
						this.$context.arc(element.$x,element.$y,element.r,element.start,element.end,element.clock);
						if(element.background){this.$context.fillStyle=element.background; this.$context.fill();}
						if(element.borderWidth>0){this.$context.stroke();}
					}
					break;
				case "text":
					var str=typeof element.content=="string" || typeof element.content=="number" ? element.content : initElement.content;
					element.fontSize=numberFormat(element.fontSize,($element && $element.fontSize),initElement.fontSize);
					var fontTemp=(element.fontSize || initElement.fontSize)+"px "+(element.fontFamily || initElement.fontFamily);
					this.$context.font=fontTemp;
					this.$context.fillStyle=element.color;
					this.$context.textAlign=element.textAlign;
					this.$context.textBaseline=element.textBaseline;
						element.x=numberFormat(persentFormat(this.$canvas.width,element.x,initElement.x),($element && $element.x),initElement.x);
						element.y=numberFormat(persentFormat(this.$canvas.height,element.y,initElement.y),($element && $element.y),initElement.y);
					this.$context.fillText(str,element.x,element.y);
					break;
			}
			this.$element[infoKey[i]]=element;
			this.$context.restore();
		}
	}
	Canvas.prototype.CopyObj=function(val){ //Object를 변경한다, 자바스크립트에서 object는 c의 포인터 같이 주소참조같은 효과
		if(!val){
			return new Object();
		}
		return JSON.parse(JSON.stringify(val));
	}



	Canvas.prototype.element=function(element){
		if(!this.$canvas){
			console.warn("CvSS ERROR : 캔버스가 등록 되지 않았습니다.");
			return;
		}
		if(element == this){ //객체가 캔버스객체라면 윈도우 이벤트를 등록하겠금한다.
			return this.$systemValue.windowEvent;
		}
		if(typeof element=="string" || typeof element=="number"){
			this.$systemValue.STACK.push(String(element))
		}
		return this;
	}
	//element(element).cvss
	Canvas.prototype.cvss=function(info,/*optional*/val){
		var target=this.$systemValue.STACK.pop();
		if(!this.$element[target]){
			console.warn("CvSS ERROR : 엘레먼트를 찾을 수 없습니다.");
			return;
		}
		;
		var obj=new Object();
		if((val || val=="") && typeof info=="string"){
			obj[target]=Canvas.prototype.CopyObj(this.$element[target]);
			obj[target][info]=val;
			this.drawElement(obj);						
		}else{
			if(Object.prototype.toString.call( info ) === '[object Array]'){
				var i,arr=new Object();
				for(i=0; i<info.length; i++){
					arr[info[i]]=this.$element[target][info[i]];
				}
				return arr;
			}else if(typeof info=="object"){						
				obj[target]=Canvas.prototype.setBaseObj(this.$element[target],info,true);		
				this.drawElement(obj);
			}else{
				if(this.$element[target] && this.$element[target][info]){
					if(typeof this.$element[target][info]=="object"){
						return Canvas.prototype.CopyObj(this.$element[target][info]);
					}
					return this.$element[target][info];
				}
			}
		}
	}
	Canvas.prototype.getInfo=function(){
		var target=this.$systemValue.STACK.pop();

		if(!this.$element[target]){
			console.error("CvSS ERROR : not found element");
			return 0;
		}

		return Canvas.prototype.CopyObj(this.$element[target]);
	}
	//element(element).create({info})
	Canvas.prototype.create=function(info){
		var result=[],target=this.$systemValue.STACK.pop();
		result[target]=info;
		this.drawElement(result);
		return 1;
	}
	//element(element).remove();
	Canvas.prototype.remove=function(){
		var target=this.$systemValue.STACK.pop();
		if(!this.$element[target]){
			console.error("CvSS ERROR : not found element");	
			return 0;
		}

		delete this.$element[target];
		delete this.$systemValue.eventFunc[target];
		this.drawElement(this.$element);
	}


	/*CvssElement Events*/
	Canvas.prototype.submitEvent=function(type,func){
		var target=this.$systemValue.STACK.pop();
		if(typeof type!="string"){return 0;}
		if(this.$systemValue.elementEventType.indexOf(type)==-1){return 0;}
		if(typeof func!="function"){return 0;}
		if(typeof this.$systemValue.eventFunc[target] !="object"){
			this.$systemValue.eventFunc[target]=new Object();
		}
		this.$systemValue.eventFunc[target][type]=func;
	}
	Canvas.prototype.mousedown=function(func){this.submitEvent("mousedown",func);}
	Canvas.prototype.mouseup=function(func){this.submitEvent("mouseup",func);}
	Canvas.prototype.dblclick=function(func){this.submitEvent("dblclick",func);}
	Canvas.prototype.mousein=function(func){this.submitEvent("mousein",func);}
	Canvas.prototype.mouseout=function(func){this.submitEvent("mouseout",func);}
	Canvas.prototype.dragstart=function(func){this.submitEvent("dragstart",func);}
	Canvas.prototype.drag=function(func){this.submitEvent("drag",func);}
	Canvas.prototype.drop=function(func){this.submitEvent("drop",func);}

	//hover is mousein and mouseout event
	Canvas.prototype.hover=function(Infunc,/*optional*/Outfunc){
		var target=this.$systemValue.STACK.pop();
		if(typeof Infunc=="function"){this.submitEvent("mousein",Infunc);}
		this.$systemValue.STACK.push(target);
		if(typeof Outfunc=="function"){this.submitEvent("mouseout",Outfunc);}
	}
	Canvas.prototype.click=function(func){
		var target=this.$systemValue.STACK.pop();
		if(typeof this.$systemValue.eventFunc[target] !="object"){
			this.$systemValue.eventFunc[target]=new Object();
		}
		this.$systemValue.eventFunc[target]["click"]=func;
	}
	Canvas.prototype.hide=function(func){
		var target=this.$systemValue.STACK.pop();
		if(this.$element[target]){
			this.$element[target].show=false;
			this.drawElement(this.$element);
		}
		return 0;
	}
	Canvas.prototype.show=function(func){
		var target=this.$systemValue.STACK.pop();
		if(this.$element[target]){
			this.$element[target].show=true;
			this.drawElement(this.$element);
		}
		return 0;
	}
	Canvas.prototype.bind=function(events,func){
		var target=this.$systemValue.STACK.pop();
		if(typeof events!="string"){console.warn("Cvss Warning : bind함수의 첫인자는 문자열입니다."); return 0;}
		events=events.split(" ");
		var i;
		for(i=0; i<events.length; i++){
			if(this.$systemValue.elementEventType.indexOf(events[i])==-1){continue;}
			this.submitEvent(events[i],func);
			this.$systemValue.STACK.push(target);
		}
	}
	Canvas.prototype.unbind=function(events){
		var target=this.$systemValue.STACK.pop();
	
		if(typeof events!="string"){console.warn("Cvss Warning : unbind함수의 첫인자는 문자열입니다."); return 0;}
		events=events.split(" ");
		var i;
		for(i=0; i<events.length; i++){
			if(this.$systemValue.elementEventType.indexOf(events[i])==-1){continue;}
			if(this.$systemValue.eventFunc[target]){
				delete this.$systemValue.eventFunc[target][events[i]];
				return 1;
			}
		}
		return 0;
	}

	Canvas.prototype.$initElement={
		scale:{
			x:0,
			y:0
		},
		zindex:0,
		type:"block",
		width:50,
		height:50,
		x:0,
		y:0,	
		background:"rgba(0,0,0,0)",
		opacity:1,
		origin:[0,0],
		circle:{
			x:0,
			y:0,
			r:10,
			start:0,
			end:2*Math.PI,
			clock:true
		},
		backgroundImage:{
			src:undefined,
			pattern:"no-repeat",
		},
		cursor:"default",
		fontSize:12,
		fontFamily:"Arial",
		borderColor:"black",
		borderWidth:0,
		content:"",
		figure:true,
		rotate:0,
		rotateOrigin:{
			x:0,
			y:0
		}
	};
}(window));//end
