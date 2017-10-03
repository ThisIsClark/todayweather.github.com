var sceneLoadIn = {
	sourcelist : [
		{id:'loadIn_bg',src:'img/loading/bg.png'},
		{id:'loadIn_brush',src:'img/loading/brush.png'},
		{id:'loadIn_css',src:'css/sceneloadIn.css'}
	],
};

sceneLoadIn.initScene = function(){
	var myloader = new createjs.LoadQueue(false);		//创建加载序列
	myloader.on("complete",loadComplete,this);
	myloader.loadManifest(sceneLoadIn.sourcelist);
	
	function loadComplete(){
		var i = sceneLoadIn.sourcelist.length;
		sceneLoadIn.loadIn_div = document.getElementById('loadIn_div');
		sceneLoadIn.loadIn_stage = document.getElementById('loadIn_stage');
		sceneLoadIn.loadIn_title = document.getElementById('loadIn_title');
		sceneLoadIn.loadIn_title.innerHTML = baseText.load_title;
		sceneLoadIn.ctx = sceneLoadIn.loadIn_stage.getContext('2d');
		sceneLoadIn.brush = new sceneLoadIn.Brush(-128,-384,sceneLoadIn.loadIn_stage.width - 384,sceneLoadIn.loadIn_stage.height - 128,-512,-400,-23,3500);
		sceneLoadIn.isEnd = false;
		while(i--){
			var tmpID = sceneLoadIn.sourcelist[i]['id'];
			sceneLoadIn[tmpID] = myloader.getResult(tmpID);		//为所有的加载资源，创建一个变量引用，变量名即为sourcelist中的id
			if(tmpID == 'loadIn_css'){
				continue;
			}
			sceneLoadIn[tmpID].setAttribute('id',tmpID);			//为所有加载资源，创建一个ID，方便css的调用
		};

		//加载结束后，抛出事件'sceneHome_ok'
		document.body.dispatchEvent(new Event('sceneLoadIn_ok'));
	};
};

//Brush类
sceneLoadIn.Brush = function(min_x,min_y,max_x,max_y,x,y,angle,speed){
	var tmp_r;
	this.min_x = min_x;
	this.min_y = min_y;
	this.max_x = max_x;
	this.max_y = max_y;
	this.x = x;
	this.y = y;
	this.angle = angle;
	this.speed = speed;
	tmp_r = angle * Math.PI / 180;
	this.vel = {
		x: Math.cos(tmp_r) * speed,
		y: -Math.sin(tmp_r) * speed
	};
	this.last_update = 0;
	this.status = 'stop';
};

sceneLoadIn.Brush.prototype.calVel = function(){
	tmp_r = this.angle * Math.PI / 180;
	this.vel = {
		x: Math.cos(tmp_r) * this.speed,
		y: -Math.sin(tmp_r) * this.speed
	};
}

//Brush类的update函数
sceneLoadIn.Brush.prototype.update = function(){
	if(this.status == 'stop'){
		return;
	}
	
	if (!this.last_update) {
        this.last_update = Date.now();
	}else{
		var time = Date.now(),
			st = time - this.last_update,
			dt = st / 1000,
			tmp_num;
		this.last_update = time;
		tmp_num = this.y + this.vel.y * dt;
		if((tmp_num < this.min_y && this.vel.y < 0) || (tmp_num > this.max_y && this.vel.y > 0)){
			if(this.status == 'add'){
				document.body.dispatchEvent(new Event('stage_add_ok'));
			}else{
				document.body.dispatchEvent(new Event('stage_clear_ok'));
			}
			this.last_update = 0;
			this.status = 'stop';
			return;
		};
		this.y = tmp_num;
		
		tmp_num = this.x + this.vel.x * dt;
		if(tmp_num > this.max_x){
			this.x = this.max_x;
			this.vel.x *= -1;
		}else if(tmp_num < this.min_x){
			this.x = this.min_x;
			this.vel.x *= -1;
		}else{
			this.x = tmp_num;
		}
	}
};

//绘制页面的更新函数
sceneLoadIn.updateStage = function(ctx,img,mask,brush){
	brush.update();
	if(brush.status == 'add'){
		ctx.globalCompositeOperation = 'destination-over';
		ctx.drawImage(mask,brush.x,brush.y);
		ctx.globalCompositeOperation = 'source-in';
		ctx.drawImage(img,0,0);
	} else if(brush.status == 'clear'){
		ctx.globalCompositeOperation = 'destination-out';
		ctx.drawImage(mask,brush.x,brush.y);
	}
	
};

//运行loadIn页面的逻辑
sceneLoadIn.playScene = function(){
	sceneLoadIn.drawFrame();
	sceneLoadIn.brush.status = 'add';
};

//显示title动画的逻辑
sceneLoadIn.showTitle = function(){
	sceneLoadIn.loadIn_title.style.animation = 'loadIn_title_in 1.5s ease-in';
	sceneLoadIn.loadIn_title.addEventListener('webkitAnimationEnd',inEnd);
	
	function inEnd(){
		sceneLoadIn.loadIn_title.removeEventListener('webkitAnimationEnd',inEnd);
		sceneLoadIn.loadIn_title.style.animation = 'loadIn_title_out 1.5s ease-in-out';
		sceneLoadIn.loadIn_title.addEventListener('webkitAnimationEnd',outEnd);
	};
	
	function outEnd(){
		sceneLoadIn.loadIn_title.removeEventListener('webkitAnimationEnd',outEnd);
		if(sceneLoadIn.isEnd){
			sceneLoadIn.brush.x = -512;
			sceneLoadIn.brush.y = 1000;
			sceneLoadIn.brush.angle = 21;
			sceneLoadIn.brush.calVel();
			sceneLoadIn.brush.status = 'clear';
		}else{
			sceneLoadIn.loadIn_title.style.animation = 'loadIn_title_in 1.5s ease-in';
			sceneLoadIn.loadIn_title.addEventListener('webkitAnimationEnd',inEnd);
		}
	}
}

//loadIn页面退出，关闭所有监听和递归事件
sceneLoadIn.quitScene = function(){
	cancelAnimationFrame(sceneLoadIn.stopFrame);
}

//每帧刷新的递归函数
sceneLoadIn.drawFrame = function(){
	sceneLoadIn.stopFrame = requestAnimationFrame(sceneLoadIn.drawFrame);
	sceneLoadIn.updateStage(sceneLoadIn.ctx,sceneLoadIn.loadIn_bg,sceneLoadIn.loadIn_brush,sceneLoadIn.brush);
};
