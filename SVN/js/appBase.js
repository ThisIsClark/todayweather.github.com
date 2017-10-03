//设定全局静态对象appBase
var appBase = {};

//获取设备类型，是ios，android，还是pc
(function(){
	var agent = navigator.userAgent;
	if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(agent)){
		appBase.evt_move = 'touchmove';
		appBase.evt_down = 'touchstart';
		appBase.evt_up = 'touchend';
		if(agent.indexOf("iPhone")>-1||agent.indexOf("iPad")>-1){
			appBase.appClient = 'ios';
		}else{
			appBase.appClient = 'android';
		}
	}else{
		appBase.evt_move = 'mousemove';
		appBase.evt_down = 'mousedown';
		appBase.evt_up = 'mouseup';
		appBase.appClient = 'pc';
	}
})();

//重设分辨率的方法
appBase.resetScreen = function(){
	var orient=window.orientation;
   	var viewportString;
	var width_h;
	var ratio_h;
   	var phoneType = navigator.userAgent;

   	if(orient==90||orient==-90){
       	if(appBase.appClient == 'ios'){
       	    width_h = 640 / window.screen.width * window.screen.height;
       	    ratio_h = window.screen.width / 640;
       	}
       	else{
       		width_h = 640 / window.screen.height * window.screen.width;
       		ratio_h = window.screen.height / 640;
       	}
       	return 'width='+width_h+',initial-scale='+ratio_h+',user-scalable=no';
	}
   	else{
   		return 'width=640,initial-scale=' + window.screen.width/640 +',user-scalable=no';
	}
};

//禁止微信往下拖动的方法，但可能会导致全局所有的拖拽都屏蔽掉了，需验证。
appBase.noDrag = function(){
	document.body.addEventListener(appBase.evt_move, function(e){e.preventDefault()});
};

//加载页面资源的方法
appBase.loadResource = function(pageName){
	var jsloader = new createjs.JavaScriptLoader('js/' + pageName + '.js',false);
	jsloader.on("complete",loadComplete,this);
	jsloader.load();
	function loadComplete(){
		document.head.appendChild(jsloader.getResult());
		var loadScene = eval('(' + pageName + ')');
		loadScene.initScene();
	};
};

//运行sceneHome自身的场景逻辑
appBase.playHome = function(){
	document.body.removeEventListener('sceneHome_ok',appBase.playHome);
	sceneHome.playScene();
//	alert(e);
};

//从sceneHome过渡到sceneLoadIn的逻辑
appBase.startLoadIn = function(){
	document.body.removeEventListener('go_loadIn',appBase.startLoadIn);
	sceneLoadIn.playScene();
	document.body.addEventListener('stage_add_ok',appBase.loadMain);
};

//加载sceneMain的资源
appBase.loadMain = function(){
	document.body.removeEventListener('stage_add_ok',appBase.loadMain);
	sceneLoadIn.showTitle();
	appBase.loadResource('sceneMain');
	document.body.addEventListener('sceneMain_ok',appBase.toMain);
};

//loadIn退出事件
appBase.toMain = function(){
	document.body.removeEventListener('sceneMain_ok',appBase.toMain);
	sceneLoadIn.isEnd = true;
	document.body.addEventListener('stage_clear_ok',appBase.playMain);
}

//运行主界面自身的场景逻辑
appBase.playMain = function(){
	document.body.removeEventListener('stage_clear_ok',appBase.playMain);
	sceneLoadIn.quitScene();	//loadIn场景退出的逻辑
	sceneMain.playScene();
};

//---------------在用户旋转屏幕时间的时候发生事件---------------
window.onorientationchange=function(){
	//调用resetScreen方法，调整屏幕分辨率
	var viewport_h = document.querySelector("meta[name=viewport]");
	viewport_h.setAttribute('content',appBase.resetScreen());  
};

//---------------在body初始化后发生的事件-----------------------
window.onload = function(){
	appBase.noDrag();							//禁止上下拖动
	appBase.loadResource('sceneHome');  		//加载sceneHome的资源
	appBase.loadResource('sceneLoadIn');		//加载sceneLoadIn的资源
	document.body.addEventListener('sceneHome_ok',appBase.playHome);		//监听sceneHome加载完成的事件
	document.body.addEventListener('go_loadIn',appBase.startLoadIn);		//监听过渡至sceneloadIn的事件
};

//---------------该js脚本解析结束时，立即运行以下事件------------
(function(){
	//屏蔽微信右上角按钮的一些分享功能，但不能完全隐藏按钮
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {	
	    WeixinJSBridge.call('hideOptionMenu');
	});
	
	//调用一次 resetScreen
	var metaTag=document.createElement('meta');
	metaTag.name = 'viewport';
	if(appBase.appClient != 'pc'){
		metaTag.content = appBase.resetScreen();
		document.head.appendChild(metaTag);
	}
})();
