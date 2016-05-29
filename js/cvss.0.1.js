	/************************************************************************
	CVSS javascript Libaray - Version 0.0.1
	made by
	*************************************************************************/
	(function(window){
		window.Canvas=function Canvas(/*optional*/name){if(name){this.target(name);}}
		window.Canvas.reference_canvas=new Array();
		Canvas.prototype.target=function(name){
			var canvas=document.getElementById(name.substring(1));
			if(!canvas){
				console.error("CvSS ERROR : not found element '"+name+"'");
				return 0;
			}
			var context=canvas.getContext("2d");
			if(context){
				this.$canvas=canvas;
				this.$context=context;
				this.$element=new Object();
				this.$elementKey=new Object();

				this.$canvas.addEventListener("mousemove",tempCanvasMouseOver);
				this.$canvas.addEventListener("mousedown",tempCanvasMouseDown);
				this.$canvas.addEventListener("mouseup",tempCanvasMouseUp);
				this.$canvas.addEventListener("mouseout",function(){
					if(th.$preOver && th.$eventFunc[th.$preOver] && typeof th.$eventFunc[th.$preOver].mouseout == "function"){th.$eventFunc[th.$preOver].mouseout.apply(th,[NaN,th.$preOver]);}
					else if(th.$preOver && th.$element[th.$preOver] && th.$element[th.$preOver].baseEventElement && th.$eventFunc[th.$element[th.$preOver].baseEventElement] && typeof th.$eventFunc[th.$element[th.$preOver].baseEventElement].mouseout=="function"){th.$eventFunc[th.$element[th.$preOver].baseEventElement].mouseout.apply(th,[NaN,th.$preOver]);}

					if(th.$dragOn && th.$eventFunc[th.$dragElement] && typeof th.$eventFunc[th.$dragElement].drop=="function"){
						th.$eventFunc[th.$dragElement].drop.apply(th,[NaN,th.$dragElement]);
					}else if(th.$dragOn && th.$element[th.$dragElement].baseEventElement && th.$element[th.$dragElement].baseEventElement && th.$eventFunc[th.$element[th.$dragElement].baseEventElement] && typeof th.$eventFunc[th.$element[th.$dragElement].baseEventElement].drop=="function"){
						th.$eventFunc[th.$element[th.$dragElement].baseEventElement].drop.apply(th,[NaN,th.$dragElement]);
					}
					th.$preOver=undefined;
					th.$canvas.style.cursor="default";
					th.$dragOn=false;
					th.$preEvent=undefined;
					th.$preEventType=undefined;
				});

				var th=this;
				function tempCanvasMouseOver(event){th.canvasMouseOver(event);}
				function tempCanvasMouseDown(event){th.canvasMouseEvent(event,"mousedown");}
				function tempCanvasMouseUp(event){th.canvasMouseEvent(event,"mouseup");}
				this.$canvas.onselectstart=function(){return false};
	
				this.$preOver=undefined;

				this.$preEvent=undefined;
				this.$preEventType=undefined;
				
				this.$dblclickTimer=false;
				this.$dblclickTimerFunc=undefined;
				this.$dragOn=false;
				this.$dargElement=undefined;


				this.$eventFunc=new Object();
				this.$windowEvent=new Object();
				this.$event=new Object();

				this.$imageData=new Array();
				this.$imageSrc=new Array();
				this.$imageDataMatch=new Object();

				this.$cvss_target=new Array();
				return 1;			
			}else{
				console.error("CvSS ERROR : not found canvas '"+name+"'");
				return 0;		
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
		Canvas.prototype.canvasMouseOver=function(event){
			var e=Canvas.prototype.getRealMousePosition(event),i;
			if(typeof this.$windowEvent.mousemove=="function"){
				this.$windowEvent.mousemove.apply(this,[e]);
			}
			if(this.$preEventType=="mousedown"){
				if(this.$dragOn===false){
					this.$dragOn=true;
					this.$dragElement=this.$preEvent;
					if(this.$eventFunc[this.$dragElement] && typeof this.$eventFunc[this.$dragElement].dragstart=="function"){
						this.$eventFunc[this.$dragElement].dragstart.apply(this,[e,this.$dragElement]);
					}else if(this.$element[this.$dragElement].baseEventElement && this.$eventFunc[this.$element[this.$dragElement].baseEventElement] && typeof this.$eventFunc[this.$element[this.$dragElement].baseEventElement].dragstart=="function"){
						this.$eventFunc[this.$element[this.$dragElement].baseEventElement].dragstart.apply(this,[e,this.$dragElement]);
					}
				}else{
					if(this.$eventFunc[this.$dragElement] && typeof this.$eventFunc[this.$dragElement].drag=="function"){
						this.$eventFunc[this.$dragElement].drag.apply(this,[e,this.$dragElement]);
					}else if(this.$element[this.$dragElement].baseEventElement && this.$eventFunc[this.$element[this.$dragElement].baseEventElement] && typeof this.$eventFunc[this.$element[this.$dragElement].baseEventElement].drag=="function"){
						this.$eventFunc[this.$element[this.$dragElement].baseEventElement].drag.apply(this,[e,this.$dragElement]);
					}
				}
			}
			var insideCheck=false,i,j,element;
			for(i=this.$elementKey.length-1; i>=0; i--)
			{
				element=this.$element[this.$elementKey[i]];
				if(element.show===false || element.onlyBaseElement===true){continue;}
				var tempE=this.$event[this.$elementKey[i]];
				switch(element.type){
					case "block":
						insideCheck=Canvas.prototype.polygonInsideCheck({x:e.x,y:e.y},tempE.line);
						break;
					case "path":
						insideCheck=Canvas.prototype.polygonInsideCheck({x:e.x,y:e.y},tempE.line);
						break;
					case "circle":
						var c=this.$event[this.$elementKey[i]].c,a=this.$event[this.$elementKey[i]].a;
						if(Math.sqrt(Math.pow(e.x-c.x,2)+Math.pow(e.y-c.y,2))+Math.sqrt(Math.pow(e.x-c.mirrorx,2)+Math.pow(e.y-c.mirrory,2))<a*2){
							insideCheck=true;
						}
						break;						
				}
				if(insideCheck){
					var key=this.$elementKey[i];
					this.$canvas.style.cursor=element.cursor || this.$initElement.cursor;
					if(this.$preOver==key){return 0;}
					if(this.$preOver && this.$preOver!=key && this.$eventFunc[this.$preOver] && typeof this.$eventFunc[this.$preOver].mouseout == "function"){this.$eventFunc[this.$preOver].mouseout.apply(this,[e,this.$preOver]);}
					else if(this.$preOver && this.$preOver!=key && this.$element[this.$preOver].baseEventElement && this.$eventFunc[this.$element[this.$preOver].baseEventElement] && typeof this.$eventFunc[this.$element[this.$preOver].baseEventElement].mouseout=="function"){this.$eventFunc[this.$element[this.$preOver].baseEventElement].mouseout.apply(this,[e,this.$preOver]);}
					this.$preOver=key; 
					if(this.$eventFunc[key] && typeof this.$eventFunc[key].mousein == "function"){this.$eventFunc[key].mousein.apply(this,[e,key]);}
					else if(element.baseEventElement && this.$eventFunc[element.baseEventElement] && typeof this.$eventFunc[element.baseEventElement].mousein=="function"){this.$eventFunc[element.baseEventElement].mousein.apply(this,[e,key]);}			
					return 0;
				}
			}
			if(this.$preOver && this.$eventFunc[this.$preOver] && typeof this.$eventFunc[this.$preOver].mouseout == "function"){this.$eventFunc[this.$preOver].mouseout.apply(this,[e,this.$preOver]);}
			else if(this.$preOver && this.$element[this.$preOver] && this.$element[this.$preOver].baseEventElement && this.$eventFunc[this.$element[this.$preOver].baseEventElement] && typeof this.$eventFunc[this.$element[this.$preOver].baseEventElement].mouseout=="function"){this.$eventFunc[this.$element[this.$preOver].baseEventElement].mouseout.apply(this,[e,this.$preOver]);}
			this.$preOver=undefined;
			this.$canvas.style.cursor="default";
		}

		Canvas.prototype.canvasMouseEvent=function(event,type){
			var e=Canvas.prototype.getRealMousePosition(event),i;
			if(typeof this.$windowEvent[type]=="function"){
				this.$windowEvent[type].apply(this,e);
			}
			if(type=="mouseup" && this.$dragOn){
				this.$dragOn=false;
				if(this.$eventFunc[this.$dragElement] && typeof this.$eventFunc[this.$dragElement].drop=="function"){
					this.$eventFunc[this.$dragElement].drop.apply(this,[e,this.$dragElement]);
				}else if(this.$element[this.$dragElement].baseEventElement && this.$element[this.$dragElement].baseEventElement && this.$eventFunc[this.$element[this.$dragElement].baseEventElement] && typeof this.$eventFunc[this.$element[this.$dragElement].baseEventElement].drop=="function"){
						this.$eventFunc[this.$element[this.$dragElement].baseEventElement].drop.apply(this,[NaN,this.$dragElement]);
				}
			}
			var insideCheck=false,i,j,element;
			for(i=this.$elementKey.length-1; i>=0; i--){
				element=this.$element[this.$elementKey[i]];
				if(element.show===false || element.onlyBaseElement===true){continue;}
				var tempE=this.$event[this.$elementKey[i]];
				switch(element.type){
					case "block":
						insideCheck=Canvas.prototype.polygonInsideCheck({x:e.x,y:e.y},tempE.line);
						break;
					case "path":
						insideCheck=Canvas.prototype.polygonInsideCheck({x:e.x,y:e.y},tempE.line);
						break;
					case "circle":
						var c=this.$event[this.$elementKey[i]].c,a=this.$event[this.$elementKey[i]].a;
						if(Math.sqrt(Math.pow(e.x-c.x,2)+Math.pow(e.y-c.y,2))+Math.sqrt(Math.pow(e.x-c.mirrorx,2)+Math.pow(e.y-c.mirrory,2))<a*2){
							insideCheck=true;
						}
						break;				
				}
				if(insideCheck){
					if(type=="mousedown" && this.$preEvent!=this.$elementKey[i]){
						clearTimeout(this.$dblclickTimerFunc);
						this.$dblclickTimer=false;
					}					
					if(type=="mouseup" && this.$preEvent==this.$elementKey[i] && this.$preEventType=="mousedown"){
						type="click";
						this.$dblclickTimerFunc=setTimeout(function(){th.$dblclickTimer=false;},500);						
						if(this.$dblclickTimer==true){
							clearTimeout(this.$dblclickTimerFunc);
							this.$dblclickTimer=false;
							type="dblclick";
						}else{
							var th=this;
							this.$dblclickTimer=true;
							this.$dblclickTimerFunc=setTimeout(function(){th.$dblclickTimer=false;},500);						
						}
					}

					this.$preEvent=this.$elementKey[i];
					this.$preEventType=type;
					this.$canvas.style.cursor=element.cursor || this.$initElement.cursor;	
					if(this.$eventFunc[this.$elementKey[i]] && typeof this.$eventFunc[this.$elementKey[i]][type] == "function"){this.$eventFunc[this.$elementKey[i]][type].apply(this,[e,this.$elementKey[i]]);}
					else if(element.baseEventElement && this.$eventFunc[element.baseEventElement] && typeof this.$eventFunc[element.baseEventElement][type]=="function"){this.$eventFunc[element.baseEventElement][type].apply(this,[e,this.$elementKey[i]]);}
					return 0;
				}
			}
			this.$preEvent=undefined;
			this.$preEventType=undefined;
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
		Canvas.prototype.numberFormat=function(val,previous_val,initVal,px){
			if(typeof previous_val!="number" && !previous_val){
				previous_val=initVal;
			}
			if(typeof val =="string"){
				if(val.substring(val.length-2)=="px" && px!==false){
					val=val.substring(0,val.length-2);
				}
				switch(val.substring(0,2)){
					case "+=":val=Number(previous_val)+Number(val.substring(2)); break;
					case "-=":val=Number(previous_val)-Number(val.substring(2)); break;
				}
				val=Number(val);
			}
			if(isNaN(val)){return initVal;}
			return val;
		}
		Canvas.prototype.persentFormat=function(size,persent,init_val){
			var front_str="";
			if(typeof persent=="string" && (persent.substring(0,2)=="+=" || persent.substring(0,2)=="-=")){
				front_str=persent.substring(0,2);
				persent=persent.substring(2);
			}
			switch(typeof persent){
				case "string":
					if(persent.substring(persent.length-2,persent.length)=="px"){
						persent=Number(persent.substring(0,persent.length-2)) || init_val;
					}else if(persent.substring(persent.length-1,persent.length)=="%"){
						persent=(size/100)*Number(persent.substring(0,persent.length-1)) || init_val;
					}else{
						persent=Number(persent) || init_val;
					}
					break;
				case "number":break;
				default: persent=init_val;
			}
			if(front_str==""){
				return persent;
			}
			return front_str+persent;
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
		Canvas.prototype.createElement=function (info,/*optional*/option){
			if(!this.$context){ // cvss canvas check
				console.error("CvSS ERROR : not found target canvas");
				return 0;
			}
			var i,j;
			if(!info){ // parameter check : invalid infoVluae
				return 0;
			}else if(typeof info=="string" || typeof info=="number"){ 
				var name=info;
				if(typeof option=="object"){ //paremter type 1	
					info=new Object();
					info[name]=Canvas.prototype.setBaseObj(this.$element[name],option,true);		
				}else{						 //paremter type 2
					return 0;
				}
			}else if(typeof info!="object"){
				return 0;
			}
			//Else : paremter type 3

			info=Canvas.prototype.setBaseObj(this.$element,info); // this.$element is previous(now) element's info
			this.$context.clearRect(0,0,this.$canvas.width,this.$canvas.height); // canvas Clear
			
			var info_key=Object.keys(info),element,img_obj=[],img_info=[],
				initElement=this.$initElement, // the initial value of cvssElement
				numberFormat=Canvas.prototype.numberFormat,
				persentFormat=Canvas.prototype.persentFormat
			info_key=info_key.sort(function(a,b){ // order by zindex of cvssElement asc
				return (info[a].zindex || initElement.zindex)<(info[b].zindex || initElement.zindex) ? -1 : (info[a].zindex || initElement.zindex)>(info[b].zindex || initElement.zindex) ? 1 : 0;
			});
			var patterns=Canvas.prototype.$backgroundRepeatType;
			var Join=Canvas.prototype.$lineJoin; // lineJoin's kinds
			this.$elementKey=info_key;
			for(i=0; i<info_key.length; i++){
				var x=NaN,y=NaN,width=NaN,height=NaN,temp=NaN,border={width:0,color:0},sourceX=NaN,sourceY=NaN,src=NaN,pattern=NaN,origin=NaN,borderArr=NaN,TempX=NaN,TempY=NaN;

				element=info[info_key[i]];
				$element=this.$element[info_key[i]];

				this.$context.save(); //canvas.Context save
				if(typeof element.baseElement=="string" && ($element && $element.baseElement)!=element.baseElement){
					element.baseStyleElement=($element && $element.baseStyleElement)==element.baseStyleElement ? element.baseElement : element.baseStyleElement;
					element.baseEventElement=($element && $element.baseEventElement)==element.baseEventElement ? element.baseElement : element.baseEventElement;
				}
				if(typeof element.baseStyleElement=="string" && typeof info[element.baseStyleElement]=="object"){
					element=Canvas.prototype.setBaseObj(info[element.baseStyleElement],element,true,true);
				}
				if(this.$Element_Type.indexOf(element.type) == -1){
					element.type=initElement.type;
				}
				element.opacity=numberFormat(element.opacity,$element && $element.opacity || 0,initElement.opacity);
				this.$context.globalAlpha=element.opacity;

				if(!this.$event[info_key[i]]){
					this.$event[info_key[i]]=new Object();
				}
				event=this.$event[info_key[i]];
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
							/*
							if(element.boxSizing=="border-box"){
								x+=element.borderWidth/2;
								y+=element.borderWidth/2;
								width-=element.borderWidth;
								height-=element.borderWidth;
							}
							*/
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
							if(element.translateX){element.translateX=numberFormat(persentFormat(element.width,element.translateX,initElement.translate.x),($element && $element.translateX),initElement.translate.x);}
							if(element.translateY){element.translateY=numberFormat(persentFormat(element.height,element.translateY,initElement.translate.y),($element && $element.translateY),initElement.translate.y);}
							if(typeof element.scaleX=="number"){
								element.scaleX=numberFormat(persentFormat(element.width,element.scaleX,initElement.scale.x),($element && $element.scaleX),initElement.scale.x);
							}
							if(typeof element.scaleY=="number"){
								element.scaleY=numberFormat(persentFormat(element.height,element.scaleY.initElement.scale.y),($element && $element.scaleY),initElement.scale.y);
							}
							var translate={
								x:typeof element.translateX=="number" ? element.translateX : initElement.translate.x,
								y:typeof element.translateY=="number" ? element.translateY : initElement.translate.y
							}
							if(element.rotate){ //transform
								element.rotate=numberFormat(element.rotate,$element && $element.rotate,initElement.rotate,false);
								element.rotateOriginX=numberFormat(persentFormat(element.width,element.rotateOriginX,initElement.rotateOrigin.x),($element && $element.rotateOriginX),initElement.rotateOrigin.x);
								element.rotateOriginY=numberFormat(persentFormat(element.height,element.rotateOriginY,initElement.rotateOrigin.y),($element && $element.rotateOriginY),initElement.rotateOrigin.y);
								var cos=Math.cos(element.rotate);
								var sin=Math.sin(element.rotate);
								//x+rotateOriginX
								event.line=[[-element.rotateOriginX*cos+element.rotateOriginY*sin+x+element.rotateOriginX+translate.x,-element.rotateOriginX*sin-element.rotateOriginY*cos+y+element.rotateOriginY+translate.y],[(width-element.rotateOriginX)*cos+element.rotateOriginY*sin+x+element.rotateOriginX+translate.x,(width-element.rotateOriginX)*sin-element.rotateOriginY*cos+y+translate.y+element.rotateOriginY],[(width-element.rotateOriginX)*cos-(height-element.rotateOriginY)*sin+x+element.rotateOriginX+translate.x,(width-element.rotateOriginX)*sin+(height-element.rotateOriginY)*cos+y+element.rotateOriginY+translate.y],[-element.rotateOriginX*cos-(height-element.rotateOriginY)*sin+x+element.rotateOriginX+translate.x,-element.rotateOriginX*sin+(height-element.rotateOriginY)*cos+y+element.rotateOriginY+translate.y]];	
								t=event.line;
							}else{
								event.line=[[x+translate.x,y+translate.y],[x+width+translate.x,y+translate.y],[x+width+translate.x,y+height+translate.y],[x+translate.x,y+height+translate.y]];	
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
							var translate={
								x:typeof element.translateX=="number" ? element.translateX : initElement.translate.x,
								y:typeof element.translateY=="number" ? element.translateY : initElement.translate.y
							}	
						}
									
						if(element.backgroundImage){
							var index=this.$imageSrc.indexOf(src);
							if(index == -1){
								var image=new Image(),th=this;
								image.onload=function(){
									th.$imageData.push(this);
									th.$imageSrc.push(this.src);
									th.$imageDataMatch[info_key[i]]=th.$imageData.length-1;
									th.createElement(th.$element);
								};
								image.src=src;
								element.$backgroundImage={
									width:NaN,height:NaN
								};
							}else{
								var img=this.$imageData[index],w=width<img.width ? width : img.width,h=height<img.height ? height : img.height;
								element.$backgroundImage={
									width:img.width,height:img.height
								};
							}
						}
						if(element.show===false || element.show=="false"){
							element.show=false;
							this.$element[info_key[i]]=element;
							this.$context.restore();
							continue;												
						}
						if( element.onlyBaseElement===true || element.onlyBaseElement=="true"){
							element.onlyBaseElement=true;
							this.$element[info_key[i]]=element;
							this.$context.restore();
							continue;												
						}
						
						this.$context.translate(translate.x,translate.y);
						if(element.rotate){
							TempX=x,TempY=y;
							this.$context.translate(x+element.rotateOriginX,y+element.rotateOriginY);
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
					case "path":
						if(element.$temp || !$element){
							element.borderWidth=border.width;
							element.borderColor=border.color;
							element.border=border.width+" solid "+border.color;
							if(element.lineJoin){
								if(Join.indexOf(element.lineJoin)){
									this.$context.lineJoin=element.lineJoin;
								}
							}
							if(element.line && typeof(element.line) =="object"){
								var pass=0;
								element.figure=element.figure===undefined ? initElement.figure : element.figure;
								var isFigure=element.figure===true;
								
								if(!event.line){
									event.line=new Array();
								}
								this.$context.beginPath();
								if(element.translateX){element.translateX=numberFormat(persentFormat(this.$canvas.width,element.translateX,initElement.translate.x),($element && $element.translateX),initElement.translate.x);}
								if(element.translateY){element.translateY=numberFormat(persentFormat(this.$canvas.height,element.translateY,initElement.translate.y),($element && $element.translateY),initElement.translate.y);}
									var translateX=typeof element.translateX=="number" ? element.translateX : initElement.translate.x;
									var translateY=typeof element.translateY=="number" ? element.translateY : initElement.translate.y;
								this.$context.translate(translateX,translateY);
								
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
										event.line[j][0]=element.line[j][0]+translateX;
										event.line[j][1]=element.line[j][1]+translateY;
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
							this.$context.translate(typeof element.translateX=="number" ? element.translateX : initElement.translate.x,typeof element.translateY=="number" ? element.translateY : initElement.translate.y);
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
				this.$element[info_key[i]]=element;
				this.$context.restore();
			}
		}
		Canvas.prototype.element=function(element){
			if(!this.$canvas){
				console.error("CvSS ERROR : not found element");
				return 0;
			}
			if(element == this){ //canvas window Event
				return this.$windowEvent;
			}
			if(typeof element=="string" || typeof element=="number"){
				this.$cvss_target.push(String(element))
			}
			return this;
		}
		//element(element).cvss
		Canvas.prototype.cvss=function(info,/*optional*/val){
			var target=this.$cvss_target[this.$cvss_target.length-1];
			if(!this.$element[target]){
				console.error("CvSS ERROR : not found element");
				return 0;
			}
			this.$cvss_target.pop();
			var obj=new Object();
			if((val || val=="") && typeof info=="string"){
				obj[target]=Canvas.prototype.CopyObj(this.$element[target]);
				obj[target][info]=val;
				this.createElement(obj);						
			}else{
				if(Object.prototype.toString.call( info ) === '[object Array]'){
					var i,arr=new Object();
					for(i=0; i<info.length; i++){
						arr[info[i]]=this.$element[target][info[i]];
					}
					return arr;
				}else if(typeof info=="object"){						
					obj[target]=Canvas.prototype.setBaseObj(this.$element[target],info,true);		
					this.createElement(obj);
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
			var target=this.$cvss_target[this.$cvss_target.length-1];

			if(!this.$element[target]){
				console.error("CvSS ERROR : not found element");
				return 0;
			}
			this.$cvss_target.pop();

			return Canvas.prototype.CopyObj(this.$element[target]);
		}
		//element(element).create({info})
		Canvas.prototype.create=function(info){
			var result=[];
			result[this.$cvss_target]=info;
			this.$cvss_target.pop();
			this.createElement(result);
			return 1;
		}
		//element(element).remove();
		Canvas.prototype.remove=function(){
			var target=this.$cvss_target[this.$cvss_target.length-1];
			if(!this.$element[target]){
				console.error("CvSS ERROR : not found element");	
				return 0;
			}

			delete this.$element[target];
			delete this.$eventFunc[target];
			this.$cvss_target.pop();
			this.createElement(this.$element);
		}


		/*CvssElement Events*/
		Canvas.prototype.submitEvent=function(type,func){
			var target=this.$cvss_target[this.$cvss_target.length-1];
			this.$cvss_target.pop();
			if(typeof type!="string"){return 0;}
			if(Canvas.prototype.$Element_Event.indexOf(type)==-1){return 0;}
			if(typeof func!="function"){return 0;}
			if(typeof this.$eventFunc[target] !="object"){
				this.$eventFunc[target]=new Object();
			}
			this.$eventFunc[target][type]=func;
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
			var target=this.$cvss_target[this.$cvss_target.length-1];
			if(typeof Infunc=="function"){this.submitEvent("mousein",Infunc);}
			this.$cvss_target.push(target);
			if(typeof Outfunc=="function"){this.submitEvent("mouseout",Outfunc);}
		}
		Canvas.prototype.click=function(func){
			var target=this.$cvss_target[this.$cvss_target.length-1];
			this.$cvss_target.pop();
			if(typeof this.$eventFunc[target] !="object"){
				this.$eventFunc[target]=new Object();
			}
			this.$eventFunc[target]["click"]=func;
		}
		Canvas.prototype.hide=function(func){
			var target=this.$cvss_target[this.$cvss_target.length-1];
			this.$cvss_target.pop();
			if(this.$element[target]){
				this.$element[target].show=false;
				this.createElement(this.$element);
			}
			return 0;
		}
		Canvas.prototype.show=function(func){
			var target=this.$cvss_target[this.$cvss_target.length-1];
			this.$cvss_target.pop();
			if(this.$element[target]){
				this.$element[target].show=true;
				this.createElement(this.$element);
			}
			return 0;
		}
		Canvas.prototype.bind=function(events,func){
			var target=this.$cvss_target[this.$cvss_target.length-1];
			if(typeof events!="string"){console.warn("Cvss Warning : bind's events is string"); return 0;}
			events=events.split(" ");
			var i;
			for(i=0; i<events.length; i++){
				if(Canvas.prototype.$Element_Event.indexOf(events[i])==-1){continue;}
				this.submitEvent(events[i],func);
				this.$cvss_target.push(target);
			}
			this.$cvss_target.pop();
		}
		Canvas.prototype.unbind=function(events){
			var target=this.$cvss_target[this.$cvss_target.length-1];
		
			if(typeof events!="string"){console.warn("Cvss Warning : bind's events is string"); return 0;}
			events=events.split(" ");
			var i;
			for(i=0; i<events.length; i++){
				if(Canvas.prototype.$Element_Event.indexOf(events[i])==-1){continue;}
				if(this.$eventFunc[target]){
					delete this.$eventFunc[target][events[i]];
					return 1;
				}
			}
			this.$cvss_target.pop();
			return 0;
		}
		Canvas.prototype.$initElement={
			translate:{
				x:0,
				y:0
			},
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
			origin:["0","0"],
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
			border:[1],
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
		Canvas.prototype.$Element_Type=["block","path","circle","text"];
		Canvas.prototype.$Element_Event=["mouseup","mousedown","click","mousein","mouseout","dblclick","dragstart","drag","drop"];
		Canvas.prototype.$lineJoin=["miter","round","bevel"];
		Canvas.prototype.$backgroundRepeatType=["no-repeat","repeat","repeat-y","repeat-x"];
		Canvas.prototype.CopyObj=function(val){
			if(!val){
				return new Object();
			}
			return JSON.parse(JSON.stringify(val));
		}
		//CVSS EVENT CODE
	}(window));
