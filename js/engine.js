<!DOCTYPE HTML>
<html>
	<head>
		<title>엔진 테스트</title>
		<meta charset="utf8">
		<script src="./js/cvss.0.2.js"></script>
		<script src="./js/engine.js"></script>
	</head>
	<body>
		<canvas width=500 height=500 id="canvas"></canvas>
		<script>
			var canvas=new Canvas("#canvas");

			canvas.element("particle").create({type:"block",x:200,y:-100,background:"red"});
			canvas.element("particle2").create({type:"block",x:300,y:100,border:"1px solid blue"});
			canvas.element("particle3").create({type:"block",x:0,y:00,border:"1px solid blue"});
			canvas.element("particle4").create({type:"block",x:"200",y:100,origin:"0% 0%",border:"1px solid blue"});
			canvas.element("background").create({type:"block",width:"100%",background:"#aaa",y:"100%",origin:"0 100%",zindex:-1});
			canvas.element("background2").create({type:"block",width:"100%",background:"#aaa",x:300,y:"50%",origin:"0 100%",zindex:-1});

			var engine=new Engine(canvas,{fps:100,gravity:[0,5]});

			engine.particle("background",{
				m:Infinity,v:[0,0]
			});

			engine.particle("background2",{
				m:Infinity,v:[0,0]
			});

			engine.particle("particle3",{ //blackHigh
				m:1,v:[0,0]
			});
			engine.particle("particle2",{ //blueLOW
				m:32,v:[0,0]
			});
			engine.particle("particle4",{ //blueLOW
				m:1,v:[0,0]
			});
			engine.particle("particle",{ //blackHigh
				m:10000000000,v:[0,0]
			});
			engine.particle("particle",{ //blackHigh
				m:10000000000,v:[0,0]
			});
			document.addEventListener("keydown",function(event){
				switch(event.keyCode){
					case 38:
						v=[0,-30]
						break;
					case 37:
						v=[-30,0]
						break;
					case 40:
						v=[0,30]
						break;
					case 39:
						v=[30,0]
						break;
				}
				if(typeof v=="object"){engine.particle("particle").property('v',v);}
				delete v
			});

		</script>
	</body>
</html>
