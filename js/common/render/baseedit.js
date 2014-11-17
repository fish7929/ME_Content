// 文件名称: baseedit.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/05
// 描    述: 可编辑对象的基类，一个显示对象需要可编辑时，可以继承此类
//          该类本身不可单独用
define([
    'jquery',
    'easeljs'
],function($){

    /**
     * 可编辑对象的基类,该类继承自createjs.Container，本身就是一个容器，可添加显示对象
     * @param item 元素对象数据 里面包含有元素的属性（坐标，角度，字大小 ，字体等）
     *             当item为空时，会自动创建数据，并挂载在当前对象的userData属性下,
     *             当显示对象的属性发生改变时，请自行修改userData的属性
     * @constructor
     */
    var BaseEdit = function(){

//        if(!item){
//            item = fmaobj.elem.create();
//            item.set("item_left",0);
//            item.set("item_top",0);
//            item.set("item_width",0);
//            item.set("item_height",0);
//            item.set("item_color","rgba(255,255,255,0)");
//        }

		if (!app.base_edit_buttons_inited)
		{
			app.base_edit_buttons_inited = true;

			this.init_buttons();
		}

        this.initialize();

    };

    //继承createjs.Container()
    var p = BaseEdit.prototype = new createjs.Container();

    //将父类的initialize方法存放在临时变量
    p.Container_initialize = p.initialize;

    /**
     * 当前类的initialize
     */
    p.initialize = function(){
        //调用父类的initialize方法
        this.Container_initialize();

        this.scaleObjects = [];

//        this.userData = {
//            set : function(attr,value){
//                this[attr] = value;
//            }
//        };

        this.userData = fmaobj.elem.create();

        this.gScale = 1;

        /**
         * 当前是否在选中状态
         * @type {boolean}
         */
        this.selected = false;

        /**
         * 是否可旋转操作
         * @type {boolean}
         */
        this.isRotation = false;

        /**
         * 是否可缩放
         * @type {boolean}
         */
        this.isScale = false;

        /**
         * 是否可做增加操作
         * @type {boolean}
         */
        this.isAdd = false;

        /**
         * 是否可做左右缩放操作，与Add公用一个按钮位置
         * @type {boolean}
         */
        this.isHScale = false;

        /**
         * 是否可删除
         * @type {boolean}
         */
        this.isDelete = false;

        /**
         * 是否可拖动
         * @type {boolean}
         */
        this.isDragging = false;

        /**
         * 一个图形对象，绘制矩形框用
         * @type {createjs.Shape}
         */
        this.shape = new createjs.Shape();

        this.sg = this.shape.graphics;

        var self = this;

		this.load_buttons();

        //绘制边框
        var bgRect = this.bgRect = new createjs.Shape();
        bgRect.cursor = "pointer";
        this.shapg = bgRect.graphics;

        //文本外边框事件，可拖动文本
        bgRect.on("mousedown", function(evt) {
            self.offset = {x:self.x-evt.stageX, y:self.y-evt.stageY};
        });

        var clickTime = 0;

        bgRect.on("click",function(evt){
             var now = +(new Date());
             //两次点击间隔<300ms,判定为双击 TO-DO 多点会出现问题
             if(now - clickTime < 300){
                 self.dblclickHandle(evt);
             }else{
                 self.clickHandle(evt);
             }
             clickTime = now;
        });

        bgRect.on("pressmove", function(evt) {
            self.pressMoveHandle(evt);
        });


        /**
         * 显示对象大小 改变时触发此方法,子类重写
         */
        this.onresize = function(){};

        this.addChild(this.bgRect);
    };

	// 加载按钮图片
	p.load_buttons = function() {
		var self = this;

		if (!app.base_edit_buttons
			|| !app.base_edit_buttons.rotate
			|| !app.base_edit_buttons.close
			|| !app.base_edit_buttons.add)
		{
			setTimeout(function(){self.load_buttons()}, 500);
		}
		else
		{
			// 加载按钮图片
			this.load_button_rotate(app.base_edit_buttons.rotate);	
			this.load_button_close(app.base_edit_buttons.close);
			this.load_button_add(app.base_edit_buttons.add);
            this.load_button_hscale(app.base_edit_buttons.hscale);
		}		
	};

	// 加载按钮图片_关闭
	p.load_button_close = function(img) {
		var self = this;
		
		this.closeBtn = new createjs.MyBitmap(img);

		app.chaimg = img;

		var imgRect = {
			x:0,y:0,
			width:img.width,height:img.height,
			targetWidth:img.width,
			targetHeight:img.height
		};

		this.closeBtn.sourceRect = imgRect;

		/**
		 * 关闭删除事件
		 */
		this.closeBtn.on("click",function(evt){
			self.closeHandle(evt);
		});
	}
	
	// 加载按钮图片_旋转缩放
	p.load_button_rotate = function(img) {
		var self = this;

		this.scaleRotateBtn = new createjs.MyBitmap(img);

		var imgRect = {
			x:0,y:0,
			width:img.width,height:img.height,
			targetWidth:img.width,
			targetHeight:img.height
		};

		this.scaleRotateBtn.sourceRect = imgRect;

		this.scaleRotateBtn.cursor = "pointer";

		//缩放按钮的事件
		this.scaleRotateBtn.on("mousedown", function(evt) {
			//console.log(evt.stageX)
			self.offset = {x:self.x-evt.stageX, y:self.y-evt.stageY};
		});
		this.scaleRotateBtn.on("pressmove", function(evt) {
			self.pressMoveScaleHandle(evt);
		});
	};

	// 加载按钮图片_增加
	p.load_button_add = function(img) {
		var self = this;

		this.addBtn = new createjs.MyBitmap(img);

        var imgRect = {
			x:0,y:0,
			width:img.width,height:img.height,
			targetWidth:img.width,
			targetHeight:img.height
		};

		this.addBtn.sourceRect = imgRect;

		/**
		 * 增加一个新的当前对象
		 */
		this.addBtn.on("click",function(evt){
			self.addHandle(evt);
		});

	};

    // 加载按钮图片_左右
    p.load_button_hscale = function(img) {
        var self = this;

        this.hscaleBtn = new createjs.MyBitmap(img);

        var imgRect = {
            x: 0, y: 0,
            width: img.width, height: img.height,
            targetWidth: img.width,
            targetHeight: img.height
        };

        this.hscaleBtn.sourceRect = imgRect;

        //左右伸缩
        this.hscaleBtn.on("mousedown", function (evt) {
            self.offset = {x: self.x - evt.stageX, y: self.y - evt.stageY};
        });
        this.hscaleBtn.on("pressmove", function (evt) {
            self.pressMoveHScaleHandle(evt);
        });
    };


	// 初始化按钮图片
	p.init_buttons = function() {
		app.base_edit_buttons_inited = true;

		if (!app.base_edit_buttons)
		{
			app.base_edit_buttons = new Object();
		}

		utils.loadImage("images/skin3/make/cha.png",function(img) {
			app.base_edit_buttons.close = img;
		});

		utils.loadImage("images/skin3/make/scale.png",function(img) {
			app.base_edit_buttons.rotate = img;
		});

		utils.loadImage("images/skin3/make/add_img.png",function(img) {
			app.base_edit_buttons.add = img;
		});

	        utils.loadImage("images/skin/zuoyou.png",function(img) {
	            app.base_edit_buttons.hscale = img;
        });
	}

    p.clickHandle = function(evt){
        //alert("type:"+this.type);
        topEvent.trigger(EventConstant.DISPLAYOBJECT_CLICK,this);
    };

    p.dblclickHandle = function(evt){
        topEvent.trigger(EventConstant.DISPLAYOBJECT_DBLCLICK,this);
    };

    /**
     * 设置可增加
     * @param b true 增加新对象，添加按钮可见， false 添加按钮不可见
     */
    p.setIsAdd = function(b){
        this.isAdd = b;
        this.drawButtons();
    };

    /**
     * 设置可左右缩放
     * @param b true 左右缩放按钮可见， false 左右缩放按钮不可见
     */
    p.setIsHScale = function(b){
        this.isHScale = b;
        this.drawButtons();
    };

    /**
     * 设置可旋转
     * @param b true 可旋转， false 不可旋转
     */
    p.setIsRotation = function(b){
        this.isRotation = b;
        this.drawButtons();
    };

    /**
     * 设置可缩放
     * @param b true 可缩放， false 不可缩放
     */
    p.setIsScale = function(b){
        this.isScale = b;
        this.drawButtons();
    };

    /**
     * 设置可删除
     * @param b true 可删除， false 不可删除
     */
    p.setIsDelete = function(b){
        this.isDelete = b;
        this.drawButtons();
    };

    p.setSelected = function(b){
        this.selected = b;
        this.drawOuterRect();
        this.drawButtons();
    };

    p.getSelected = function(){
        return this.selected;
    };


    /**
     * 处理旋转缩放
     * @param e
     */
    p.pressMoveScaleHandle = function(e){
        var lastAngle;
        var currAngle;
        var proto = this.parent.__proto__;
		// 旋转处理
        if(this.isRotation){
            if(proto!==createjs.Stage.prototype){
                // scaleBp = this.localToLocal(this.scaleRotateBtn.x,this.scaleRotateBtn.y,this.parent);
                var scaleBp = this.localToLocal(this.scaleRotateBtn.x,this.scaleRotateBtn.y,this.parent);
                // var stageXY = this.localToGlobal(e.stageX,e.stageY);
                var stageXY = this.globalToLocal(e.stageX,e.stageY);
                    stageXY = this.localToLocal(stageXY.x,stageXY.y,this.parent);
                lastAngle = Math.atan2(scaleBp.y - this.y, scaleBp.x - this.x);
                currAngle = Math.atan2(stageXY.y - this.y, stageXY.x - this.x);
                // var scaleBp = this.localToLocal(this.scaleRotateBtn.x,this.scaleRotateBtn.y,this.parent);
                // var stageXY = this.globalToLocal(e.stageX,e.stageY);
                // stageXY = this.localToLocal(stageXY.x,stageXY.y,this.parent);
                // var thisXY = this.localToLocal(this.x,this.y,this.parent);
                // lastAngle = Math.atan2(scaleBp.y-thisXY.y,scaleBp.x-thisXY.x);
                // currAngle = Math.atan2(stageXY.y-thisXY.y,stageXY.x-thisXY.x);

                // this.rotation += (currAngle - lastAngle) * 180 / Math.PI;lastAngle = Math.atan2(scaleBp.y - this.y, scaleBp.x - this.x);
                currAngle = Math.atan2(stageXY.y - this.y, stageXY.x - this.x);
            }else{
                var scaleBp = this.localToGlobal(this.scaleRotateBtn.x,this.scaleRotateBtn.y);

            //计算缩放按钮在舞台的坐标相对于父类在舞台的坐标角度
            lastAngle = Math.atan2(scaleBp.y - this.y,scaleBp.x - this.x);

            //鼠标点相对于父类的角度
            currAngle = Math.atan2(e.stageY - this.y, e.stageX - this.x);
            }
            //计算缩放按钮在舞台上的全局坐标
            //旋转缩放后，缩放按钮的位置在舞台上发生改变，所以这里必须进行转换

            // //计算缩放按钮在舞台的坐标相对于父类在舞台的坐标角度
            // var lastAngle = Math.atan2(scaleBp.y - this.y,scaleBp.x - this.x);

            // //鼠标点相对于父类的角度
            // var currAngle = Math.atan2(e.stageY - this.y, e.stageX - this.x);

            //旋转，弧度转角度
            this.rotation += (currAngle - lastAngle) * 180 / Math.PI;
            this.userData.set("rotate_angle",this.rotation);
            // console.log(this.rotation);

//            this.userData.item_angle = this.rotation;

//            this.userData.set("item_left",VS.rvx(this.x) - VS.rvx(this.regX));
//            this.userData.set("item_top",VS.rvy(this.y) - VS.rvy(this.regY));

			console.log("this.regXY_旋转: " + this.regX + ", " + this.regY);

			if (this.onrotate)
			{
				this.onrotate();
			}
        }
				proto = null;

        //缩放处理
        if(this.isScale){
            var lastLen,curLen,scaleBp;
            //计算缩放按钮在舞台上的全局坐标
            //旋转缩放后，缩放按钮的位置在舞台上发生改变，所以这里必须进行转换
            if(this.parent.parent){
                // scaleBp = this.localToLocal(this.scaleRotateBtn.x,this.scaleRotateBtn.y,this.parent);
            //     scaleBp = this.localToGlobal(this.scaleRotateBtn.x,this.scaleRotateBtn.y);

            //     var thisXY = this.localToGlobal(this.x,this.y);

            // //鼠标上次移动时，相对于容器的长度
            // lastLen = Math.sqrt(Math.pow(scaleBp.y - thisXY.y, 2) +
            //               Math.pow(scaleBp.x - thisXY.x, 2));

            // //鼠标当前移动时，相对于容器的长度
            // curLen = Math.sqrt(Math.pow(e.stageY - thisXY.y, 2) +
            //              Math.pow(e.stageX - thisXY.x, 2));

            scaleBp = this.localToLocal(this.scaleRotateBtn.x,this.scaleRotateBtn.y,this.parent);

            var stageXY = this.globalToLocal(e.stageX,e.stageY);
                stageXY = this.localToLocal(stageXY.x,stageXY.y,this.parent);

            //鼠标上次移动时，相对于容器的长度
            lastLen = Math.sqrt(Math.pow(scaleBp.y - this.y, 2) +
                          Math.pow(scaleBp.x - this.x, 2));

            //鼠标当前移动时，相对于容器的长度
            curLen = Math.sqrt(Math.pow(stageXY.y - this.y, 2) +
                         Math.pow(stageXY.x - this.x, 2));

            }else{
                scaleBp = this.localToGlobal(this.scaleRotateBtn.x,this.scaleRotateBtn.y);

            //鼠标上次移动时，相对于容器的长度
            lastLen = Math.sqrt(Math.pow(scaleBp.y - this.y, 2) +
                          Math.pow(scaleBp.x - this.x, 2));

            //鼠标当前移动时，相对于容器的长度
            curLen = Math.sqrt(Math.pow(e.stageY - this.y, 2) +
                         Math.pow(e.stageX - this.x, 2));
            }

            var scaleX,
                scaleY;
            //计算缩放值
            // console.log(this.parent.scaleObjects.length);
            if(this.scaleObjects.length > 0){

                var obj = this.scaleObjects[0];

                scaleX = obj.scaleX * (curLen / lastLen);
				scaleY = obj.scaleY * (curLen / lastLen);

				// u:using
				var scaleX_u = scaleX;
				var scaleY_u = scaleY;

                for(var i = 0;i < this.scaleObjects.length;i++){
					
					var scale_obj = this.scaleObjects[i];

					if (this.type == "edittext")
					{
						if (this.b_jingxiang)
						{
							scaleX_u = 0 - Math.abs(scaleX_u);
						}
						else
						{
							scaleX_u = Math.abs(scaleX_u);
						}

						if (this.b_fanzhuan)
						{
							scaleY_u = 0 - Math.abs(scaleY_u);
						}
						else
						{
							scaleY_u = Math.abs(scaleY_u);
						}

						console.log("111111111111111111111111111: " + this.b_jingxiang + ", " + this.b_fanzhuan
							+ ", " + scaleY_u + ", " + this.tag3);
					}

                    scale_obj.scaleX = scaleX_u;
                    scale_obj.scaleY = scaleY_u;

					if (this.type == "edittext")
					{
						this.resetRegPosition();
					}
                }
            }else{
                scaleX = this.scaleX * (curLen / lastLen);
            }

            scaleY = scaleX;

            this.userData.set("x_scale",VS.rvx(scaleX));
            this.userData.set("y_scale",VS.rvy(scaleY));

           // console.log(scaleX,scaleY)

            //核心逻辑已处理，剩下交由子类去处理
            this.onscale(scaleX,scaleY);
        }
    };

    /**
     * 缩放处理 ，默认整个容器缩放，如果只想缩放容器里面某个显示对象
     * 请重写实现
     * @param scaleX
     * @param scaleY
     */
    p.onscale = function(scaleX,scaleY){
		if (this.type == "edittext")
		{
			this.text.scaleX = scaleX;
			this.text.scaleY = scaleY;
			this.resize();
		}
		else
		{
			this.scaleX = scaleX;
			this.scaleY = scaleY;
		}
    };

    /**
     * 绘制按钮，根据状态绘制，如isAdd=false,将不绘制添加按钮
     * @param b
     */
    p.drawButtons = function(){
        var rect = this.getRectBounds();
        var bRect;
        var w,h;

		if (!rect)
		{
			return;
		}

        //如果可删除，绘制删除按钮
//        console.log(this.isDelete,this.selected)
        if(this.isDelete && this.selected){
            if(this.getChildIndex(this.closeBtn) == -1){
                this.addChild(this.closeBtn);
            }

            var closeBtn = this.closeBtn;
            bRect = closeBtn.getBounds();

			try
			{
				if(closeBtn.sourceRect && closeBtn.sourceRect.targetWidth){
					w = closeBtn.sourceRect.targetWidth;
					h = closeBtn.sourceRect.targetHeight;
				}else{
					w = bRect.width;
					h = bRect.height;
				}
			}
			catch (e)
			{
				w = 33;
				h = 37.5;
			}

            closeBtn.regX = w / 2;
            closeBtn.regY = h / 2;
            closeBtn.x = rect.x;
            closeBtn.y = rect.y;
        }else{
            if(this.getChildIndex(this.closeBtn) != -1){
                this.removeChild(this.closeBtn);
            }
        }

        //如果可增加或可左右缩放，则绘制该按钮
        if((this.isAdd || this.isHScale) && this.selected){

            var Btn = this.isAdd ? this.addBtn : this.hscaleBtn;

            if(this.getChildIndex(Btn) == -1){
                this.addChild(Btn);
            }

            bRect = Btn.getBounds();

			try
			{
				if(Btn.sourceRect && Btn.sourceRect.targetWidth){
					w = Btn.sourceRect.targetWidth;
					h = Btn.sourceRect.targetHeight;
				}else{
					w = bRect.width;
					h = bRect.height;
				}
			}
			catch (e)
			{
				w = 33;
				h = 37.5;
			}

            Btn.regX = w / 2;
            Btn.regY = h / 2;
            Btn.x = rect.x + rect.width;
            Btn.y = rect.y;
        }else{

            var theBtn = this.isAdd ? this.addBtn : this.hscaleBtn;

            if(this.getChildIndex(theBtn) != -1){
                this.removeChild(theBtn);
            }
        }

        //如果可旋转或缩放
        if((this.isScale || this.isRotation) && this.selected){
            if(this.getChildIndex(this.scaleRotateBtn) == -1){
                this.addChild(this.scaleRotateBtn);
            }

            var scaleBtn = this.scaleRotateBtn;
            bRect = scaleBtn.getBounds();

			try
			{
				if(scaleBtn.sourceRect && scaleBtn.sourceRect.targetWidth){
					w = scaleBtn.sourceRect.targetWidth;
					h = scaleBtn.sourceRect.targetHeight;
				}else{
					w = bRect.width;
					h = bRect.height;
				}
			}
			catch (e)
			{
				w = 33;
				h = 37.5;
			}

            scaleBtn.regX = w / 2;
            scaleBtn.regY = h / 2;
            scaleBtn.x = rect.x + rect.width;
            scaleBtn.y = rect.y + rect.height;
        }else{
            if(this.getChildIndex(this.scaleRotateBtn) != -1){
                this.removeChild(this.scaleRotateBtn);
            }
        }

    };


    /**
     * 绘制外边框
     */
    p.drawOuterRect = function(b){
        var g = this.shapg;
        g.clear();
        var rect = this.getRectBounds();
        g.beginFill("rgba(0,0,0,0.01)");
        if(!b){
            if(this.selected){
                //g.beginStroke("rgba(0,0,0,1)");
                g.beginStroke("rgba(255,255,255,0.60)");
                g.setStrokeStyle(2);

            }
//            else{
//                g.beginStroke("rgba(0,0,0,0.2)");
//                g.setStrokeStyle(1);
//            }
        }
		try
		{
			g.rect((~~rect.x) + 0.5, (~~rect.y) + 0.5,(~~rect.width) + 0.5,(~~rect.height) + 0.5);
		}
		catch (e)
		{
		}
//        g.endStroke();
//        g.beginStroke("rgba(100,100,100,1)");
//        g.setStrokeStyle(5);
//        g.rect((~~rect.x) - 0.5, (~~rect.y) - 0.5,(~~rect.width) + 2.5,(~~rect.height) + 2.5);
        g.endStroke();
        g.endFill();
    };

    p.getRectBounds = function(){
        return {x:0,y:0,width:0,height:0};
    };

//    p.resetRegPosition = function(){
//        var r = this.getTextRect();
//
//        this.regX = r.width / 2 + 5 * this.gScale;
//        this.regY = r.height / 2;
//        this.text.regX = this.regX;
//        this.text.regY = this.regY;
//        this.text.x = r.width / 2;
//        this.text.y = r.height / 2;
//    };

    /**
     * 拖动处理
     * @param evt
     */
    p.localToLocal = function(a, b, c) {
                var d = this.localToGlobal(a, b);
                return c.globalToLocal(d.x, d.y)
            }
    p.pressMoveHandle = function(evt){
        if(this.isDragging){
            var ox = this.offset.x;
            var oy = this.offset.y;
            // console.log(evt.stageX);
            // console.log(evt.stageY);
            if(this.parent.rotation){
            var g = this.globalToLocal(evt.stageX,evt.stageY);
            var l = this.localToLocal(g.x,g.y,this.parent);
            this.x = l.x;
            this.y = l.y;
            }else {
            this.x = evt.stageX+ox;
            this.y = evt.stageY+oy;

            }

            var itemLeft = this.userData.get("item_left");
            var itemTop = this.userData.get("item_top");

            var ix = this.x - this.regX;
            var iy = this.y - this.regY;

			var x_scale = this.userData.get("x_scale");
			var y_scale = this.userData.get("y_scale");

			if (typeof(x_scale) == "undefined")
			{
				x_scale = 1;
			}

			if (typeof(y_scale) == "undefined")
			{
				y_scale = 1;
			}

			if (this.type == "editwatermark")
			{
				this.userData.set("item_left", VS.rvx(this.x));
				this.userData.set("item_top", VS.rvy(this.y));
			}
			else
			{
				this.userData.set("item_left", VS.rvx(this.x) - this.regX / VS.vx(x_scale));
				this.userData.set("item_top", VS.rvy(this.y) - this.regY / VS.vx(y_scale));
			}

            //console.log(ix,iy)
            this.onmove();
            //TO-DO
//            this.userData.set("item_left",this.x);
//            this.userData.set("item_top", this.y);
        }
    };

    p.onmove = function(){};

    /**
     * 显示对象大小改变时，子类调用此方法
     * @type {null}
     */
    p.resize = function(){
        this.drawOuterRect();
        this.drawButtons();
        this.onresize();
    };


    /**
     * 默认删除事件，子类可重写
     * 重写时请派发EventConstant.DISPLAYOBJECT_REMOVED 事件，并将当前对象抛出去
     * @param evt
     */
    p.closeHandle = function(evt){

		if (this.onclose)
		{
			this.onclose();
		}

        if(this.parent){
            this.parent.removeChild(this);
        }
        topEvent.trigger(EventConstant.DISPLAYOBJECT_REMOVED,this);
    };

    /**
     * 新加事件，了类重写实现
     * 默认克隆当前对象,并派发EventConstant.DISPLAYOBJECT_ADDED事件
     * @param evt
     */
    p.addHandle = function(evt){
        var obj = this.clone();
        topEvent.trigger(EventConstant.DISPLAYOBJECT_ADDED,obj);
    };

    /**
     * 左右拉伸，主要针对文本的字间距和行宽
     * @param evt
     */
    p.pressMoveHScaleHandle = function(e){
        topEvent.trigger(EventConstant.DISPLAYOBJECT_HSCALE,this);
    };

    /**
     * 一个判断最小框的方法，由了类去实现
     * 主要限制框的缩放最小值
     */
    p.isMinSize = function(){
        return true;
    };

    p.setGscale = function(scale){

    };

    p.setScale = function(scaleX,scaleY){};

    createjs.BaseEdit = BaseEdit;
    return BaseEdit;
});