var sceneMain = {
	sourcelist : [
		{id:'main_css',src:'css/sceneMain.css'}
	],
};

sceneMain.initScene = function(){
	var myloader = new createjs.LoadQueue(false);		//创建加载序列
	myloader.on("complete",loadComplete,this);
	myloader.loadManifest(sceneMain.sourcelist);
	
	function loadComplete(){
		var i = sceneMain.sourcelist.length;
		sceneMain.main_div = document.getElementById('main_div');
		while(i--){
			var tmpID = sceneMain.sourcelist[i]['id'];
			sceneMain[tmpID] = myloader.getResult(tmpID);		//为所有的加载资源，创建一个变量引用，变量名即为sourcelist中的id
			if(tmpID == 'main_css'){
				continue;
			}
			sceneMain[tmpID].setAttribute('id',tmpID);			//为所有加载资源，创建一个ID，方便css的调用
		};

		//加载结束后，抛出事件'sceneHome_ok'
		document.body.dispatchEvent(new Event('sceneMain_ok'));
	};
};

sceneMain.playScene = function(){
	console.log('start Main!');
}
