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

				this.$canvas.addEventListener("mousemove",tempCanvasMouseOver);
				this.$canvas.addEventListener("click",tempCanvasMouseClick);
				this.$canvas.addEventListener("mousedown",tempCanvasMouseDown);
				this.$canvas.addEventListener("dblclick",tempCanvasDblclick);

				var th=this;
				function tempCanvasMouseOver(event){Canvas.prototype.canvasMouseOver.apply(th,[event]);}
				function tempCanvasMouseClick(event){Canvas.prototype.canvasMouseEvent.apply(th,[event,"$click"]);}
				function tempCanvasMouseDown(event){Canvas.prototype.canvasMouseEvent.apply(th,[event,"$mousedown"]);}
				function tempCanvasDblclick(event){Canvas.prototype.canvasMouseEvent.apply(th,[event,"$dblclick"]);}

				this.$canvas.onselectstart=function(){return false};
				this.$preOver=undefined;
				this.$eventFunc=new Object();

				return 1;			
			}else{
				console.error("CvSS ERROR : not found canvas '"+name+"'");
				return 0;		
			}
		}
		Canvas.prototype.canvasMouseOver=function(event){
			var i;
			for(i=this.$elementKey.length-1; i>=0; i--)
			{
				var element=this.$element[this.$elementKey[i]];
				if(element.eventX && element.eventX[0]<=event.layerX && element.eventX[1]>event.layerX && element.eventY && element.eventY[0]<=event.layerY && element.eventY[1]>event.layerY){
					this.$canvas.style.cursor=element.cursor || Canvas.$initElement.cursor;
					if(this.$preOver==this.$elementKey[i]){return 0;}
					if(this.$preOver && this.$preOver!=this.$elementKey[i] && this.$eventFunc[this.$preOver] && typeof this.$eventFunc[this.$preOver].$hoverOut == "function"){this.$eventFunc[this.$preOver].$hoverOut.apply(this.element(this.$preOver));}
					else if(this.$preOver && this.$preOver!=this.$elementKey[i] && this.$element[this.$preOver].baseEventElement && this.$eventFunc[this.$element[this.$preOver].baseEventElement] && typeof this.$eventFunc[this.$element[this.$preOver].baseEventElement].$hoverOut=="function"){this.$eventFunc[this.$element[this.$preOver].baseEventElement].$hoverOut.apply(this.element(this.$preOver));}
					this.$preOver=this.$elementKey[i]; 
					if(this.$eventFunc[this.$elementKey[i]] && typeof this.$eventFunc[this.$elementKey[i]].$hoverIn == "function"){this.$eventFunc[this.$elementKey[i]].$hoverIn.apply(this.element(this.$elementKey[i]));}
					else if(element.baseEventElement && this.$eventFunc[element.baseEventElement] && typeof this.$eventFunc[element.baseEventElement].$hoverIn=="function"){this.$eventFunc[element.baseEventElement].$hoverIn.apply(this.element(this.$elementKey[i]));}			
					return 0;
				}
			}
			if(this.$preOver && this.$eventFunc[this.$preOver] && typeof this.$eventFunc[this.$preOver].$hoverOut == "function"){this.$eventFunc[this.$preOver].$hoverOut.apply(this.element(this.$preOver));}
			else if(this.$preOver && this.$element[this.$preOver].baseEventElement && this.$eventFunc[this.$element[this.$preOver].baseEventElement] && typeof this.$eventFunc[this.$element[this.$preOver].baseEventElement].$hoverOut=="function"){this.$eventFunc[this.$element[this.$preOver].baseEventElement].$hoverOut.apply(this.element(this.$preOver));}
			this.$preOver=undefined;
			this.$canvas.style.cursor="default";
		}


		Canvas.prototype.canvasMouseEvent=function(event,type){
			var i;
			for(i=this.$elementKey.length-1; i>=0; i--){
				var element=this.$element[this.$elementKey[i]];
				if(element.eventX && element.eventX[0]<=event.layerX && element.eventX[1]>event.layerX && element.eventY && element.eventY[0]<=event.layerY && element.eventY[1]>event.layerY){
					this.$canvas.style.cursor=element.cursor || Canvas.$initElement.cursor;	
					if(this.$eventFunc[this.$elementKey[i]] && typeof this.$eventFunc[this.$elementKey[i]][type] == "function"){this.$eventFunc[this.$elementKey[i]][type].apply(this.element(this.$elementKey[i]));}
					else if(element.baseEventElement && this.$eventFunc[element.baseEventElement] && typeof this.$eventFunc[element.baseEventElement][type]=="function"){this.$eventFunc[element.baseEventElement][type].apply(this.element(this.$elementKey[i]));}
					return 0;
				}
			}
		}
		
		Canvas.prototype.numberFormat=function(val,previous_val,initVal){
			if(typeof val =="string"){
				if(val.substring(val.length-2)=="px"){
					val=val.substring(0,val.length-2);
				}
				switch(val.substring(0,2)){
					case "+=":val=Number(previous_val)+Number(val.substring(2)); break;
					case "-=":val=Number(previous_val)-Number(val.substring(2)); break;
				}
			}
			if(typeof val=="number"){return val;}
			return initVal;
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
		Canvas.prototype.setBaseObj=function(base_obj,obj,/*optional*/Changeundefined){
			var i=0,key=Object.keys(obj),result=CopyObj(base_obj);
			for(i=0; i<key.length; i++){
				if(obj[key[i]]!==undefined && obj[key[i]]!==null && (obj[key[i]]!="" && obj[key[i]]!="none") ||	 obj[key[i]]===0){
					result[key[i]]=obj[key[i]];
				}
				else if((obj[key[i]]=="" || obj[key[i]]=="none") && Changeundefined==true){
					result[key[i]]="";
				}
			}
			return result;
		}
		Canvas.prototype.createElement=function (info,/*optional*/option){
			if(!this.$context){
				console.error("CvSS ERROR : not found target canvas");
				return 0;
			}
			if(typeof info=="string" && typeof option=="object"){
				var name=info;
				info=new Object();
				info[name]=option;
			}
			info=Canvas.prototype.setBaseObj(this.$element,info,true);
			this.$context.clearRect(0,0,this.$canvas.width,this.$canvas.height);
			var info_key=Object.keys(info),i,element,img_obj=[],img_info=[],initElement=Canvas.prototype.$initElement;
			info_key=info_key.sort(function(a,b){
				return (info[a].zindex || initElement.zindex)<(info[b].zindex || initElement.zindex) ? -1 : (info[a].zindex || initElement.zindex)>(info[b].zindex || initElement.zindex) ? 1 : 0;
			});
			this.$elementKey=info_key;
			for(i=0; i<info_key.length; i++){
				element=info[info_key[i]];
				$element=this.$element[info_key[i]];
				this.$context.save();
				if(element.baseStyleElement && info[element.baseStyleElement]){
					element=Canvas.prototype.setBaseObj(info[element.baseStyleElement],element);
				}
				if(this.$Element_Type.indexOf(element.type) == -1){
					element.type=initElement.type;
				}
				switch(element.type){
					case "box":
						element.width=Canvas.prototype.numberFormat(Canvas.prototype.persentFormat(this.$canvas.width,element.width,initElement.width),($element && $element.width) || 0,initElement.width);
						element.height=Canvas.prototype.numberFormat(Canvas.prototype.persentFormat(this.$canvas.width,element.height,initElement.height),($element && $element.height) || 0,initElement.height);
						element.x=Canvas.prototype.numberFormat(Canvas.prototype.persentFormat(this.$canvas.x,element.x,initElement.x),($element && $element.x) || 0,initElement.x);
						element.y=Canvas.prototype.numberFormat(Canvas.prototype.persentFormat(this.$canvas.y,element.y,initElement.y),($element && $element.y) || 0,initElement.y);
						
						element.opacity=Canvas.prototype.numberFormat(element.opacity,$element && $element.opacity || 0,initElement.opacity);
						var x=element.x,y=element.y,width=element.width,height=element.height;
						this.$context.globalAlpha=element.opacity;
						if(typeof element.focus=="object"){
							x-=Canvas.prototype.persentFormat(element.width,element.focus[0],initElement.focus[0]);
							y-=Canvas.prototype.persentFormat(element.height,element.focus[1],initElement.focus[1]);
						}
						this.$context.fillStyle=element.background || initElement.background;
						if(element.border && width!=0 && height!=0){
							element.border[0]=Canvas.prototype.numberFormat(element.border[0],($element && $element.border && $element.border[0])||0,initElement.border[0]);
							this.$context.lineWidth=element.border[0];
							this.$context.strokeStyle=element.border[1];
							if(element.border[2]=="dotted" || element.border[2]=="dashed"){
								var border_info=[];
								if(element.border[3]){
									border_info.push(element.border[3]);
								}
								if(element.border[4]){
									border_info.push(element.border[4]);
								}
								this.$context.setLineDash(border_info);
							}
							if(element.show==false){
								this.$element[info_key[i]]=element;
								this.$context.restore();
								continue;								
							}

							if(element.boxSizing=="border-box"){
								x+=element.border[0]/2;
								y+=element.border[0]/2;
								width-=element.border[0];
								height-=element.border[0];
							}

							this.$context.strokeRect(x,y,width,height);
						}
						if(element.show==false){
							this.$element[info_key[i]]=element;
							this.$context.restore();
							continue;												
						}
						this.$context.fillRect(x,y,width,height);
						if(element.background_image){
							if(typeof element.background_image=="array"){
								var img_src=element.background_image[0];
							}else{
								var img_src=element.background_image;
							}
							var img=new Image();
							img.src=img_src;
							img_obj.push(img);
							img_info.push({
								x:x,
								y:y,
								width:width,
								height:height
							});
							var th=this,index=img_obj.length-1;
							img_obj[index].onload=(function(element){
								return function(){
									th.$context.drawImage(this,element.x,element.y,element.width,element.height);
								};
							})(element);
							element['background_image']=[];
							element['background_image'][0]=img_src;
						}

						element.eventX=[(width<0 && x+width) || x,(width<0 && x) || x+width];
						element.eventY=[(height<0 && y+height) || y,(height<0 && y) || y+Number(height)];
						break;
					case "path":
						if(element.width){this.$context.lineWidth=element.width;}
						if(element.color){this.$context.strokeStyle=element.color;}
						if(element.line && typeof(element.line) =="object"){
							var pass=0;
							this.$context.beginPath();
							if(typeof element.line[0][0] !="number" || typeof element.line[0][1] != "number"){
								pass=1;
							}else{
								this.$context.moveTo(element.line[0][0],element.line[0][1]);
								
								for(i=1; i<element.line.length; i++){
									if(typeof element.line[i][0] !="number" || typeof element.line[i][1] != "number"){
										pass=1;
										break;
									}	
									this.$context.lineTo(element.line[i][0],element.line[i][1]);
								}
							}
							this.$context.closePath();
							if(pass==0){
								this.$context.stroke();
								if(element.background){this.$context.fillStyle=element.background; this.$context.fill();}
							}
						}else if(typeof element.circle=="object"){
							element.circle.x=Canvas.prototype.numberFormat(element.circle.x,($element && $element.circle.x),initElement.circle.x);
							element.circle.y=Canvas.prototype.numberFormat(element.circle.y,($element && $element.circle.y),initElement.circle.y);
							element.circle.r=Canvas.prototype.numberFormat(element.circle.r,($element && $element.circle.r),initElement.circle.r);
							if(!element.circle.start){
								element.circle.start=initElement.circle.start;
							}
							if(!element.circle.end){
								element.circle.end=initElement.circle.end;
							}
							if(!element.circle.clock){
								element.circle.clock=initElement.circle.clock;
							}
							var x=element.circle.x;
							var y=element.circle.y;
							if(typeof element.circle.focus=="object"){
								x-=Canvas.prototype.persentFormat(element.circle.r*2,element.circle.focus[0],initElement.focus[0]);
								y-=Canvas.prototype.persentFormat(element.circle.r*2,element.circle.focus[1],initElement.focus[1]);
							}							
							this.$context.beginPath();
							this.$context.arc(x,y,element.circle.r,element.circle.start,element.circle.end,element.circle.clock);
							this.$context.stroke();
							if(element.background){this.$context.fillStyle=element.background; this.$context.fill();}
						}
						break;
					case "text":
						var str=String(element.content);
						if(String(element.content)){
						}
						break;
				}
				this.$element[info_key[i]]=element;
				this.$context.restore();
			}	
		}
		Canvas.prototype.element=function(element){
			if(!this.$element[element]){
				return 0;
			}else{
				this.$cvss_target=element;
			}
			return this;
		}
		Canvas.prototype.cvss=function(info,/*optional*/val){
			if(!this.$element[this.$cvss_target]){
				console.error("CvSS ERROR : not found element");	
				return 0;
			}
			var obj=new Object();
			obj[this.$cvss_target]=CopyObj(this.$element[this.$cvss_target]);
			if((val || val=="") && typeof info=="string"){
				obj[this.$cvss_target][info]=val;
				this.createElement(obj);						
			}else{
				if(typeof info=="object"){						
					var info_key=Object.keys(info);
					for(i=0; i<info_key.length; i++){
						obj[this.$cvss_target][info_key[i]]=info[info_key[i]];
					}
					this.createElement(obj);
				}else{
					if(this.$element[this.$cvss_target] && this.$element[this.$cvss_target][info]){
						return this.$element[this.$cvss_target][info];
					}
				}
			}
		}
		Canvas.prototype.create=function(info){
			var result=[];
			result[this.$cvss_target]=info;
			this.createElement(result);
		}
		Canvas.prototype.hover=function(Infunc,/*optional*/Outfunc){
			if(typeof this.$eventFunc[this.$cvss_target] !="object"){
				this.$eventFunc[this.$cvss_target]=new Object();
			}
			this.$eventFunc[this.$cvss_target]["$hoverIn"]=Infunc;
			if(Outfunc){
				this.$eventFunc[this.$cvss_target]["$hoverOut"]=Outfunc;
			}
		}
		Canvas.prototype.click=function(func){
			if(typeof this.$eventFunc[this.$cvss_target] !="object"){
				this.$eventFunc[this.$cvss_target]=new Object();
			}
			this.$eventFunc[this.$cvss_target]["$click"]=func;
		}
		Canvas.prototype.mousedown=function(func){
			if(typeof this.$eventFunc[this.$cvss_target] !="object"){
				this.$eventFunc[this.$cvss_target]=new Object();
			}
			this.$eventFunc[this.$cvss_target]["$mousedown"]=func;
		}
		Canvas.prototype.dblclick=function(func){
			if(typeof this.$eventFunc[this.$cvss_target] !="object"){
				this.$eventFunc[this.$cvss_target]=new Object();
			}
			this.$eventFunc[this.$cvss_target]["$dblclick"]=func;
		}	
		Canvas.prototype.$initElement={
			zindex:0,
			type:"box",
			width:10,
			height:10,
			x:0,
			y:0,	
			background:"black",
			opacity:1,
			focus:["0","0"],
			circle:{
				x:0,
				y:0,
				r:10,
				start:0,
				end:2*Math.PI,
				clock:true
			},
			border:[1],
			cursor:"default"
		};
		Canvas.prototype.$Element_Type=["box","path","text"];
		function CopyObj(val){
			return JSON.parse(JSON.stringify(val));
		}


		//CVSS EVENT CODE
	
	}(window));