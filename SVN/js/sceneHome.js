//设定全局静态对象sceneHome
var sceneHome = {
	sourcelist : [									//定义home页面的资源列表
		{id:'home_bg',src:'img/home/bg.png'},
		{id:'home_logo',src:'img/home/logo.png'},
		{id:'home_flower01',src:'img/home/flower01.png'},
		{id:'home_flower02',src:'img/home/flower02.png'},
		{id:'home_hill01',src:'img/home/hill01.png'},
		{id:'home_hill02',src:'img/home/hill02.png'},
		{id:'home_poem01',src:'img/home/poem01.png'},
		{id:'home_poem02',src:'img/home/poem02.png'},
		{id:'home_poem03',src:'img/home/poem03.png'},
		{id:'home_poem04',src:'img/home/poem04.png'},
		{id:'home_start',src:'img/home/start.png'},
		{id:'home_startdown',src:'img/home/startdown.png'},
		{id:'home_css',src:'css/sceneHome.css'},
		{id:'petal_plist',type:'jsonp',src:'particle/petal.json',callback:'petal'}
	],
	lastUpdate : 0
};

//home页面初始化过程
sceneHome.initScene = function(){
	var myloader = new createjs.LoadQueue(false);		//创建加载序列
	myloader.on("complete",loadComplete,this);
	myloader.loadManifest(sceneHome.sourcelist);
	
	//加载完成后执行的逻辑
	function loadComplete(){
		var i = sceneHome.sourcelist.length;
		sceneHome.home_div = document.getElementById("home_div");		//创建变量home_div，引用sceneHome的根节点
		sceneHome.home_back_layer = document.getElementById("home_back_layer");			//创建变量home_back_layer，引用背景层节点
		sceneHome.home_front_layer = document.getElementById("home_front_layer");		//创建变量home_front_layer，引用前景层节点
		sceneHome.tmpstr = document.getElementById("tmpstr")
		while(i--){
			var tmpID = sceneHome.sourcelist[i]['id'];
			sceneHome[tmpID] = myloader.getResult(tmpID);		//为所有的加载资源，创建一个变量引用，变量名即为sourcelist中的id
			if(tmpID == 'home_css' || tmpID == 'petal_plist'){
				continue;
			}
			sceneHome[tmpID].setAttribute('id',tmpID);			//为所有加载资源，创建一个ID，方便css的调用
		};

		//将图片资源写在html的dom内
		sceneHome.home_back_layer.appendChild(sceneHome.home_bg);
		sceneHome.home_back_layer.appendChild(sceneHome.home_hill02);
		sceneHome.home_front_layer.appendChild(sceneHome.home_flower01);
		sceneHome.home_front_layer.appendChild(sceneHome.home_flower02);
		sceneHome.home_front_layer.appendChild(sceneHome.home_hill01);
		sceneHome.home_front_layer.appendChild(sceneHome.home_logo);
		sceneHome.home_front_layer.appendChild(sceneHome.home_start);
		sceneHome.home_div.appendChild(sceneHome.home_poem01);
		sceneHome.home_div.appendChild(sceneHome.home_poem02);
		sceneHome.home_div.appendChild(sceneHome.home_poem03);
		sceneHome.home_div.appendChild(sceneHome.home_poem04);
		sceneHome.home_petal = new easyParticle(sceneHome.petal_plist,640,1136);
		sceneHome.home_petal.emitter.x = 50;
		sceneHome.home_petal.emitter.y = -50;
		sceneHome.home_petal.cbg.style.zIndex = 15;
		sceneHome.home_petal.addToStage('home_div');
		//加载结束后，抛出事件'sceneHome_ok'
		document.body.dispatchEvent(new Event('sceneHome_ok'));
	};
};

//home页面的启动动画过程
sceneHome.playScene = function(){
	sceneHome.home_back_layer.style.animationPlayState = 'running';
	sceneHome.home_poem01.style.animationPlayState = 'running';
	sceneHome.home_poem02.style.animationPlayState = 'running';
	sceneHome.home_poem03.style.animationPlayState = 'running';
	sceneHome.home_poem04.style.animationPlayState = 'running';
	sceneHome.home_front_layer.style.animationPlayState = 'running';
	sceneHome.home_div.style.animationPlayState = 'running';
	sceneHome.home_hill01.style.animationPlayState = 'running';
	sceneHome.home_flower01.style.animationPlayState = 'running';
	sceneHome.home_flower02.style.animationPlayState = 'running';
	sceneHome.home_logo.style.animationPlayState = 'running';
	sceneHome.home_start.style.animationPlayState = 'running';
	sceneHome.home_start.addEventListener('webkitAnimationEnd',sceneHome.idleScene);
};

//home页面idle状态的逻辑
sceneHome.idleScene = function(){
//	alert('finish2');
	sceneHome.home_start.removeEventListener('webkitAnimationEnd',sceneHome.idleScene);
	sceneHome.home_back_layer.style.animation = 'none';
	sceneHome.home_back_layer.style.opacity = 1;
	sceneHome.home_back_layer.style.transform = 'translate(0,0)';
	sceneHome.home_hill01.style.animation = 'none';
	sceneHome.home_hill01.style.transform = 'translate(0,0)';
	sceneHome.home_flower01.style.animation = 'none';
	sceneHome.home_flower01.style.transform = 'translate(0,0)';
	sceneHome.home_flower02.style.animation = 'none';
	sceneHome.home_flower02.style.transform = 'translate(0,0)';
	window.addEventListener('devicemotion',sceneHome.orientChange,false);
	sceneHome.home_start.style.webkitMask = 'none';
	sceneHome.home_start.style.opacity = '1';
	sceneHome.home_start_src = sceneHome.home_start.src;
	sceneHome.home_startdown_src = sceneHome.home_startdown.src;
	sceneHome.home_left = sceneHome.home_start.offsetLeft + document.body.clientWidth/2;
	sceneHome.home_top = sceneHome.home_start.offsetTop + document.body.clientHeight/2;
	sceneHome.home_right = sceneHome.home_left + sceneHome.home_start.width;
	sceneHome.home_bottom = sceneHome.home_top + sceneHome.home_start.height;
	sceneHome.home_petal.start();
//	console.log(easyParticle.instances);
	sceneHome.drawFrame();
	//根据ios和安卓不同，start图标的动画方式采取不同方案
	if(appBase.appClient == 'ios'){
		//ios逻辑
		var tempArg = {top:0};
		sceneHome.startTween = new TWEEN.Tween(tempArg).to({top:20},2000).easing(TWEEN.Easing.Quadratic.InOut);
		sceneHome.startTween.onUpdate(function(){sceneHome.home_start.style.transform = 'translate(0px,' + tempArg.top + 'px)';
		});
		sceneHome.startTween.start().repeat(Infinity).yoyo(true);
		sceneHome.home_start.addEventListener(appBase.evt_down,sceneHome.iosDown);
		
	}else{
		//pc端用跟安卓相同的逻辑
		sceneHome.home_start.style.animation = 'home_start_idle 2s ease-in-out infinite alternate';
		sceneHome.home_start.addEventListener(appBase.evt_down,sceneHome.androidDown);
	}
};

//按下start按钮后，共同的逻辑
sceneHome.commonDown = function(){
	sceneHome.home_start.src = sceneHome.home_startdown_src;
}

//松开start按钮后，共同的逻辑
sceneHome.commonUp = function(evt){
	sceneHome.home_start.src = sceneHome.home_start_src;
	var trans = getComputedStyle(sceneHome.home_start).transform.split('(')[1].split(')')[0].split(',');
	var transY = parseFloat(trans[5]);
	var _moveTop = sceneHome.home_top + transY;
	var _moveBottom = sceneHome.home_bottom + transY;
	if (appBase.appClient == 'pc') {
		var _x = evt.clientX;
		var _y = evt.clientY;
	}else{
		var _x = evt.changedTouches[0].clientX;
		var _y = evt.changedTouches[0].clientY;
	}
	if(_x>=sceneHome.home_left && _x<=sceneHome.home_right && _y>=_moveTop && _y<=_moveBottom){
		//松手在按钮范围内，执行loading逻辑
		sceneHome.home_petal.stop();
		return true;
	}else{
		return false;
	}
}

//ios按下start按钮后的逻辑
sceneHome.iosDown = function(){
	sceneHome.startTween.pause();
	sceneHome.commonDown();
	sceneHome.home_start.removeEventListener(appBase.evt_down,sceneHome.iosDown);
	sceneHome.home_div.addEventListener(appBase.evt_up,sceneHome.iosUp);
}

//安卓按下start按钮后的逻辑
sceneHome.androidDown = function(){
	sceneHome.home_start.style.animationPlayState = 'paused';
	sceneHome.commonDown();
	sceneHome.home_start.removeEventListener(appBase.evt_down,sceneHome.androidDown);
	sceneHome.home_div.addEventListener(appBase.evt_up,sceneHome.androidUp);
};

//ios从start按钮松手后的逻辑
sceneHome.iosUp = function(evt){
	sceneHome.home_div.removeEventListener(appBase.evt_up,sceneHome.iosUp);
	if(sceneHome.commonUp(evt)){
//		window.cancelAnimationFrame(sceneHome.stopFrame);
		sceneHome.toLoadIn();
	}else{
		sceneHome.home_start.addEventListener(appBase.evt_down,sceneHome.iosDown);
		sceneHome.startTween.play();
	}
};

//安卓从start按钮松手后的逻辑
sceneHome.androidUp = function(evt){
	sceneHome.home_div.removeEventListener(appBase.evt_up,sceneHome.androidUp);
	if(sceneHome.commonUp(evt)){
		sceneHome.toLoadIn();
	}else{
		sceneHome.home_start.addEventListener(appBase.evt_down,sceneHome.androidDown);
		sceneHome.home_start.style.animationPlayState = 'running';
	}
};

//切换至loading的代码
sceneHome.toLoadIn = function(){
	window.removeEventListener('devicemotion',sceneHome.orientChange,false);
	document.body.dispatchEvent(new Event('go_loadIn'));
	sceneHome.home_div.style.animation = 'home_quit 1.5s ease 0.5s forwards';
	sceneHome.home_div.addEventListener('webkitAnimationEnd',quitHome);
	
	//停止每帧刷新的事件
	function quitHome(){
		cancelAnimationFrame(sceneHome.stopFrame);
//		console.log('stop')
	};
};

//旋转手机角度事件
sceneHome.orientChange = function(evt){
	if(!sceneHome.lastUpdate){
		sceneHome.lastUpdate = Date.now();
		return;
	};
	var t = Date.now();
	if(t - sceneHome.lastUpdate < 33){
		return;
	};
	var alpha = evt.rotationRate.alpha,
		beta = evt.rotationRate.beta,
		gamma = evt.rotationRate.gamma,
		dx = parseInt(beta/20),
		dy = -1 * parseInt(alpha/20),
		trans = getComputedStyle(sceneHome.home_back_layer).transform.split('(')[1].split(')')[0].split(','),
		x = parseInt(trans[4]),
		y = parseInt(trans[5]),
		tmp;
		
		dx = Math.min(Math.max(dx,-1),1);
		dy = Math.min(Math.max(dy,-1),1);
		tmp = x + dx;
		x = Math.min(Math.max(tmp,-6),6);
		tmp = y + dy;
		y = Math.min(Math.max(tmp,-6),6);
		
//		sceneHome.tmpstr.innerHTML = 'x=' + Math.round(x) + ' y=' + Math.round(y) + ' dx=' + Math.round(dx) + ' dy=' + Math.round(dy);
		sceneHome.home_back_layer.style.transform = 'translate(' + x + 'px,' + y + 'px)';
		sceneHome.home_hill01.style.transform = 'translate(' + x + 'px,' + y + 'px)';
		sceneHome.home_flower01.style.transform = 'translate(' + x + 'px,' + y + 'px)';
		sceneHome.home_flower02.style.transform = 'translate(' + x + 'px,' + y + 'px)';
		sceneHome.lastUpdate = t;
};

//每帧刷新的递归函数
sceneHome.drawFrame = function(){
    sceneHome.stopFrame = requestAnimationFrame(sceneHome.drawFrame);
//  console.log('no-stop!');
	TWEEN.update();
	easyParticle.update();
};