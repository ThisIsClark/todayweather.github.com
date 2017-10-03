//建立粒子构造函数，并作为命名空间
var easyParticle = function(plist,width,height,x,y){
	this.cbg = document.createElement('canvas');
	var c = this.cbg
	c.style.pointerEvents = 'none';
	c.width = width || window.innerWidth;
	c.height = height || window.innerHeight;
	c.style.left = x? x + 'px' : '0px';
	c.style.top = y? y + 'px' : '0px';
	this.ctx = c.getContext('2d');
	this.emitter = new easyParticle.Emitter(0,0,plist,this);
};

//类实例的合集数组
easyParticle.instances = [];

//get和set方法,使得操作粒子函数为操作其子类canvas
easyParticle.prototype = {
	constructor: easyParticle,
	get x(){
		var tmp = this.cbg.style.left;
		tmp = tmp.substr(0,tmp.length - 2)
		return tmp;
	},
	set x(val){
		this.cbg.style.left = val + 'px';
	},
	get y(){
		var tmp = this.cbg.style.top;
		tmp = tmp.substr(0,tmp.length - 2)
		return tmp;
	},
	set y(val){
		this.cbg.style.top = val + 'px';
	},
	get width(){
		return this.cbg.width;
	},
	set width(val){
		this.cbg.width = val;
	},
	get height(){
		return this.cbg.height;
	},
	set height(val){
		this.cbg.height = val;
	},
	
	addToStage:function(id){							//将粒子添加到屏幕的方法
		document.getElementById(id).appendChild(this.cbg);
	}
}

//模板粒子的参数
easyParticle.tmpPlist = {
	'x_val':0,
	'y_val':0,
	'emission_rate': 20,			//每秒喷射速率，单位为 个/s
	'max_particle': 20,				//画面上最多出现多少个粒子
	'duration': 0,					//喷射持续多少时间，单位为s
    'life': 1,
    'life_val': 1,
    'angle': 0,						//所有角度的单位都为°
    'angle_val': 180,			
    'speed': 30,					//单位为 像素/s
    'speed_val': 20,
    'acc_x': 0,						//单位为 像素/s·s
    'acc_y': 0,
    's_size': 16,					//与size相关的单位为像素
    's_size_val': 0,
    't_size': 32,
    't_size_val': 0,
    's_opacity': 1,
    's_opacity_val': 0,
    't_opacity': 0,
    't_opacity_val': 0,
    's_rotate': 0,
    's_rotate_val': 180,
    't_rotate': 0,
    't_rotate_val': 180,
    's_color': [255,255,255],
    's_color_val': [0,0,0],
    't_color': [255,255,255],
    't_color_val': [0,0,0],
    'imgData': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAARCAMAAAGQgzxdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABjUExURQAAAP7+/v7+/v////7+/v7+/v7+/v////7+/v7+/v////////7+/v7+/v7+/v////7+/v7+/v////7+/v7+/v7+/v7+/v7+/v7+/v////7+/v////7+/v7+/v7+/v////7+/jjerPYAAAAhdFJOUwD4kQ/t2h8MvKlVAQlKRwaj0f/86UEj5pIQ7iA7/mkC+8GZu2QAAAAJcEhZcwAAFxEAABcRAcom8z8AAAChSURBVBhXbU5bEoQgDCsogk+0CIry8P6nXFBndMblg6ZpmhSgBYhYQK7pLcdZmpmm/vrzRApWwYA4XuhWS9M7G1NjhEK/BflCaeeeZvVlDtG63shMVJTNoklQhs2jEqaFYjwQcRnii3t0z+7LL8MoubVcxjsCYrfrsNb1GvTepeNyqqZTSZQi5UT1eTB3lBGf4tATRh1v/1F/FpPZx/5zxA98+A9PtzxVSgAAAABJRU5ErkJggg=='
}

easyParticle.randNum = function(base,vary){
	return base + Math.random() * vary * 2 - vary;
}

easyParticle.randColor = function(base,vary){
	var tmp
	tmp = easyParticle.randNum(base[0],vary[0]);
	c0 = Math.min(Math.max(tmp,0),255);
	tmp = easyParticle.randNum(base[1],vary[1]);
	c1 = Math.min(Math.max(tmp,0),255);	
	tmp = easyParticle.randNum(base[2],vary[2]);
	c2 = Math.min(Math.max(tmp,0),255);
	return [c0,c1,c2];
}

//变换颜色矩阵的参数，用正片叠底公式
easyParticle.transColor = function(o_arr,c_arr,color){
	var r = color[0],								//缓存颜色值
		g = color[1],
		b = color[2],
		i = 0,
		length = o_arr.length - 1;
	while(i<length){
		if(0 != (c_arr[i+3] = o_arr[i+3])){
			c_arr[i] = Math.round(o_arr[i] * r / 255);
			c_arr[i+1] = Math.round(o_arr[i+1] * g / 255);
			c_arr[i+2] = Math.round(o_arr[i+2] * b / 255);
		}
		i += 4;
	};
}

//从全局的instances数组中删除标记为empty的粒子实例，让其不再进行更新
easyParticle.delEmpty = function(){
	var i = easyParticle.instances.length;
	while(i--){
		if(easyParticle.instances[i].emitter.state == 'empty'){
			easyParticle.instances.splice(i,1);
		};
	};
};

//全局更新每个粒子实例
easyParticle.update = function(){
	var i = 0;
	while(easyParticle.instances[i] != null){
		easyParticle.instances[i].update();
		i++;
	};
};

//画布更新方法
easyParticle.prototype.update = function(){
	this.ctx.clearRect(0,0,this.cbg.width,this.cbg.height);
	var _this = this;
	var _ctx = this.ctx;
	this.emitter.update(function(p,c){
//		console.log(p.x + ' ' + p.y);
		if(p.opacity == 0){return;};
		_ctx.globalAlpha = p.opacity;
		_ctx.translate(_this.emitter.x + p.x,_this.emitter.y + p.y);
		_ctx.rotate(p.rotate);
//		var s = p.size;
		var s = Math.round(p.size);
		_ctx.drawImage(c,-s/2, -s/2,s,s);
		_ctx.setTransform(1,0,0,1,0,0);		
	});
}

//粒子启动方法
easyParticle.prototype.start = function(){	
	if(this.emitter.o_data && this.emitter.state == 'empty'){
		easyParticle.instances.push(this);
	};
	this.emitter.state = 'run';
}

//粒子结束的方法
easyParticle.prototype.stop = function(){
	this.emitter.lived = 0;
	this.emitter.last_emission = 0;
	this.emitter.state = 'stop';
}

//单个粒子对象
easyParticle.Particle = function(setting) {
	var c0,
		c1,
		c2,
		tmp_num,
		tmp_s,
		l;
    this.life = Math.max(easyParticle.randNum(setting.life,setting.life_val),0);
    l = this.life;
    
    this.size = Math.max(easyParticle.randNum(setting.s_size,setting.s_size_val),0);
    tmp_num = Math.max(easyParticle.randNum(setting.t_size,setting.t_size_val),0);
    this.d_size = (tmp_num - this.size) / l;

    this.opacity =  Math.min(Math.max(easyParticle.randNum(setting.s_opacity,setting.s_opacity_val),0),1);
    tmp_num = Math.min(Math.max(easyParticle.randNum(setting.t_opacity,setting.t_opacity_val),0),1);
    this.d_opacity = (tmp_num - this.opacity) / l;
    
    this.rotate = easyParticle.randNum(setting.s_rotate,setting.s_rotate_val) * Math.PI / 180;	//初始角度，转换单位为弧度
    tmp_num = easyParticle.randNum(setting.t_rotate,setting.t_rotate_val) * Math.PI / 180;		//目标角度，转换单位为弧度
    this.d_rotate = (tmp_num - this.rotate) / l;
    
    this.color = easyParticle.randColor(setting.s_color,setting.s_color_val);
    tmp_num = easyParticle.randColor(setting.t_color,setting.t_color_val);
	this.d_color = [];
    this.d_color[0] = (tmp_num[0] - this.color[0]) / l;
    this.d_color[1] = (tmp_num[1] - this.color[1]) / l;
    this.d_color[2] = (tmp_num[2] - this.color[2]) / l;

    this.lived = 0;								//已经存活的时间，单位为s
    this.dead = false;							//是否死亡
    this.isNew = true;
	this.x = easyParticle.randNum(0,setting.x_val);
    this.y = easyParticle.randNum(0,setting.y_val);
    
    tmp_s = easyParticle.randNum(setting.speed,setting.speed_val);						//粒子速度speed，因为更新的时候无需此参数，因此用临时数据在构造的时候使用即可。
   	tmp_num = easyParticle.randNum(setting.angle,setting.angle_val) * Math.PI / 180;	//发射角度，单位为°，方向以向右为0°，逆时针方向旋转。最后，角度转换单位为弧度
    this.vel = {
        x:  Math.cos(tmp_num) * tmp_s,			//速度x方向的分量
        y: -Math.sin(tmp_num) * tmp_s			//速度y方向的分量
    };
    this.acc_x = setting.acc_x;
    this.acc_y = setting.acc_y;
};

//粒子更新的方法
easyParticle.Particle.prototype.update = function(t){
    if(this.isNew){
    	this.isNew = false;
    	return;
    }
    var tmp_t;
    if(this.lived + t > this.life) {				//如果粒子存活时间大于声明周期，则标记为死亡
    	tmp_t = this.life - this.lived;				//超过了生命则改变数值为最大生命时间
        this.dead = true;
        this.lived = this.life;
    }else{
    	tmp_t = t;
    	this.lived += t;
    };
    this.x += this.vel.x * tmp_t;					//更新粒子各方面参数
	this.y += this.vel.y * tmp_t;
	this.vel.x += this.acc_x * tmp_t;				//更新粒子的速度
	this.vel.y += this.acc_y * tmp_t;
	this.size += this.d_size * tmp_t;
	this.opacity = Math.max((this.opacity + this.d_opacity * tmp_t),0);
	this.rotate += this.d_rotate * tmp_t;
	this.color[0] += this.d_color[0] * tmp_t;
	this.color[1] += this.d_color[1] * tmp_t;
	this.color[2] += this.d_color[2] * tmp_t;
//	console.log(this.s_color)
}

//喷射器对象
easyParticle.Emitter = function(x, y, plist,container) {
 	this.x = x || 0;						//喷射器位置x
 	this.y = y || 0;						//喷射器位置y
// 	console.log(this.x + ' ' + this.y)
    this.setting = plist || easyParticle.tmpPlist;						//需要使用的plist设置
    this.emission_delay = 1000 / this.setting.emission_rate;  			//根据喷射速率计算喷射间隔，这里用毫秒为单位，因此乘以1000。
    this.duration = this.setting.duration;
    this.state = 'empty';
    this.lived = 0;
    this.last_update = 0;					//最后一次更新的当前时间
    this.last_emission = 0;					//从第一次开始喷射后，经过了多长时间没有发射粒子
    this.particles = [];					//本次喷射的所有粒子集合，为一个数组
    var _this = this;
    var pic = new Image();
    pic.onload = function(){
    	_this.o_pic = document.createElement('canvas');					//设置内置canvas
    	var w = pic.width;
    	var h = pic.height;
	    _this.o_pic.width = w;
	    _this.o_pic.height = h;
		_this.o_ctx = _this.o_pic.getContext('2d');
		_this.o_ctx.drawImage(pic,0,0);
		_this.o_data = _this.o_ctx.getImageData(0,0,h,w);
		_this.c_pic = document.createElement('canvas');    
		_this.c_pic.width = w;
		_this.c_pic.height = h;
		_this.c_ctx = _this.c_pic.getContext('2d');
		_this.c_data = _this.c_ctx.createImageData(h,w);
		if(_this.state == 'run'){
			easyParticle.instances.push(container);
		};		
    }
	pic.src = this.setting.imgData;										//设置喷射粒子的贴图
};

//喷射器每次更新的方法
easyParticle.Emitter.prototype.update = function(drawParticle){
	if (!this.last_update) {				//如果尚未更新，则立即更新第一次
        this.last_update = Date.now();
        return;
	};
	var time = Date.now();					//获取当前时间
	var st = time - this.last_update;		//从当前时间到上一次更新时间之间经过了多久
	var dt = st / 1000;						//转换单位为秒
	this.last_update = time;				//更改最后更新的时间戳	
	if(this.state == 'run'){
		this.last_emission += st;				//得到已经多长时间没有发射粒子了
		if(this.duration > 0){
			this.lived += dt;
		};
		if(this.lived <= this.duration){
			//判断是否应该发射粒子了，应该的话就发射
			if (this.last_emission >= this.emission_delay) {
				var i = Math.floor(this.last_emission / this.emission_delay);	//定义i，计算应该发射的粒子个数
				var p_num = this.particles.length;
				var m = this.setting.max_particle;
				this.last_emission -= i * this.emission_delay;  	//余数计入下一次未发射时间的初始值，计算使用的是改变前的i，而不是调整后的i
				if(p_num + i > m){
					i = Math.max(0,m - p_num)
				};
				while(i--){											//设定新生成粒子的初始状态
					var particle = new easyParticle.Particle(this.setting);
					this.particles.push(particle);
		       };
			};	
		}else{
			this.lived = 0;
			this.last_emission = 0;
			this.state = 'stop';				//如果超过了发射持续时间，则修改状态为stop
		};
	};
	
	if(this.state != 'empty'){
		i = this.particles.length;				//重设i等于当前已有的粒子数量，接下来更新它们的状态
		if(i<=0 && this.state == 'stop'){
			this.last_update = 0;
			this.state = 'empty';
			easyParticle.delEmpty();
			return;
		}
		while(i--){
			var particle = this.particles[i];
	        if (particle.dead) {				//如果粒子死亡，则从数组中删除它
	            this.particles.splice(i, 1);
	            continue;
        	};
			
			particle.update(dt);				//更新粒子状态
			var can;
			//判断是否改了颜色，如果没改，则直接使用初始画布o_pic。如果改了，则使用中间画布c_pic
			if(particle.color[0] + particle.color[1] + particle.color[2] < 763.5){
				easyParticle.transColor(this.o_data.data,this.c_data.data,particle.color);
				this.c_ctx.putImageData(this.c_data,0,0);
				can = this.c_pic;
			}else{
				can = this.o_pic;
			};
        	drawParticle(particle,can);
		};
	};
};
