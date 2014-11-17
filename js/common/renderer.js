/**
 * Created by chenshy on 2014/8/25.
 */
// 文件名称: renderer.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/25
// 描    述: 渲染器，渲染显示对象
define(['common/render/include'],function(createjs){

    var Renderer = function(canvas){
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.stage = new createjs.Stage(this.canvas);

        createjs.wkContext = this.context;
        createjs.wkCanvas = this.canvas;
        createjs.Touch.enable(this.stage);

        this.stage.enableMouseOver(3);
        this.stage.mouseMoveOutside = true; // ke

        //背景层
//        this.bgLayer = new createjs.Container();
//        //蒙罩层
//        this.maskLayer = new createjs.Container();
//        //矩形层
//        this.rectLayer = new createjs.Container();
//        //文本层
//        this.textLayer = new createjs.Container();

        this.stopAnimate = false;
        var self = this;

//        this.stage.on("click",function(){
////            topEvent.trigger(EventConstant.DISPLAYOBJECT_CLICK,self.stage);
//        });

        this.enterFrame = function(){
            return function(e){
                self.onEnterFrame(e);
            }
        };

        createjs.Ticker.setFPS(40);
        createjs.Ticker.addEventListener("tick", this.enterFrame());
    };

    /**
     * 获取canvas上某一区域的图像数据
     * @param x
     * @param y
     * @param width
     * @param height
     */
    Renderer.prototype.getImageData = function(x,y,width,height){
//        this.context.getImageData(x,y,width,height);
    };

    Renderer.prototype.onEnterFrame = function(e){
        //console.log("enterframe")
//        createjs.wkContext.save();
//        createjs.wkContext.scale(0.5,0.5);
        this.stage.update(e);
//        createjs.wkContext.restore();
//        console.log("ddd")
    };

    /**
     * 获取canvas图像数据
     * @param imageType 图像类型 "iamge/png" , "image/jpg"
     * @param s 图像品质 0-1
     * @returns {*|string} Base64图像数据
     */
    Renderer.prototype.toDataURL = function(imageType,s){
//        toDataUrl(imageType,s);
    };

    /**
     * 动画循环
     * 不要擅自调用
     */
    Renderer.prototype.animate = function(){
        //停止动画循环
//        if(this.stopAnimate){
//            return;
//        }
//
//        var self = this;
//        if(this.enterFrame){
//            this.enterFrame();
//        }
//
//        this.renderer.render(this.stage);
//
//        //console.log("animation")
//        window.requestAnimationFrame(function(){
//            self.animate.call(self);
//        });
    };

    /**
     * 添加显示对象
     * @param objects
     */
    Renderer.prototype.addObjects = function(objects){
        addObjectsToStage(objects,this.stage);
    };

    Renderer.prototype.addObject = function(object,index){
//        console.log(object)
        if(index){
            this.stage.addChildAt(object,index);
        }else{
            this.stage.addChild(object);
        }
//        var obj = this.stage.children[this.stage.children.length - 1];
//        console.log("ddd",obj.type)
    };

    /**
     * @prevate 将显示对象添加到stage
     * @param objects
     * @param stage
     */
    function addObjectsToStage(objects,stage){
        for(var i=0;i < objects.length;i++){
            var item = objects[i];
            stage.addChild(item);
        }
    }
    /**
     * @private 获取canvas图像数据
     * @param imageType 图像类型 "iamge/png" , "image/jpg"
     * @param s 图像品质 0-1
     * @returns {*|string} Base64图像数据
     */
    Renderer.prototype.toDataUrl = function(imageType,s){
//        s = s || 1;
//        imageType = imageType || "image/png";
        return this.canvas.toDataURL("image/png",1);
    };


    /**
     * 根据传入的显示对象生成图像数据
     * @param objects 显示对象
     * @param w 图像宽度
     * @param h 图像高度
     * @param imageType 图像类型
     * @param s 图像品质
     * @returns Base64图像数据
     */
    Renderer.prototype.getImageDataByObjects = function(w,h,objects,imageType,s){
//        var canvas = document.createElement("canvas"),
//            context = canvas.getContext("2d");
//        var stage = new PIXI.Stage(0x000000);
//        var renderer = new PIXI.CanvasRenderer(w, h, canvas);

//        addObjectsToStage(objects,stage);
//
//        renderer.render(stage);

//        return toDataUrl(imageType,s);
    };

    /**
     * 销毁渲染器
     * 渲染器不使用时，调用此方法销毁
     */
    Renderer.prototype.dispose = function(){
        this.stopAnimate = true;
        this.clear();
        this.stage = null;
        this.renderer = null;
    };

//    var vscr_widht = 480;
//    var vscr_height = 640;
//    var x_scale = 1;
//    var y_scale = 1;
//    function init_v_screen(widht,height)
//    {
//        x_scale =
//    }
//
//    function vx(x)
//    {
//        return x * x_scale;
//    }
//
//    function vy(y){
//        return y * y_scale;
//    }

    /**
     * 缩放渲染对象
     * @param object
     */
    Renderer.prototype.scaleObject = function(object,scale){
        object.x = (object.x) * scale;
        object.y = (object.y) * scale;
        object.width = object.width * scale;
        object.height = object.height * scale;

        /**
         * 设置缩放系数
         */
        object.setGscale(scale);

        //console.log(object)
//        if(object.userData.item_type == "text"){
////            console.log(object.userData)
//            object.text.font = object.userData.font_size + " " + object.userData.font_family;
//            //console.log(object.text.font)
//        }
    };

    /**
     * 缩放渲染对象
     * @param objects
     */
    Renderer.prototype.scaleObjects = function(objects,scale){
        for(var i = 0;i < objects.length;i++){
            this.scaleObject(objects[i],scale);
        }
    };

	// 移除子控件
	Renderer.prototype.remove = function(obj)
	{
		for (var i = 0; i < this.stage.children.length; i++)
		{
			var item = this.stage.children[i];

			if (item == obj)
			{
				this.stage.removeChildAt(i);
			}
		}
	}

    Renderer.prototype.clear = function(){
        if(this.stage){
            if(this.stage.children.length > 0){
                this.stage.removeAllChildren();
            }
        }

        createjs.Ticker.removeAllEventListeners();
    };

    return Renderer;
});
