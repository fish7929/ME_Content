// 文件名称: edittext.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/29
// 描    述: 一个mask矩形遮罩，
define([
    'jquery',
    'common/render/baseedit',
    'easeljs'
],function($){

    var EditMaskRect = function(item){
        this.type = EditMaskRect.TYPE;
//        this.userData = item || {};
//        if(!item){
            //this.userData = fmaobj.elem.create();
//            this.userData.set("item_left",0);
//            this.userData.set("item_top",0);
//            this.userData.set("item_width",createjs.wkCanvas.width);
//            this.userData.set("item_height",createjs.wkCanvas.height);
//            this.userData.set("item_color","rgba(255,255,255,0)");
//            //console.log(this.userData);
//        }else{
//            this.userData = item;
//        }
        this.initialize();

    };

    var p = EditMaskRect.prototype = new createjs.BaseEdit();

    p.BaseEdit_initialize = p.initialize;

    p.initialize = function(){
        this.BaseEdit_initialize();

        var userData = this.userData;
        this.isImage = false;

		this.userData.set("item_type", DisplayObjectType.MASKRECT);
		this.userData.set("item_opacity", 100);

//        userData.set();

        this.selected = false;

        //图形
        this.shape = new createjs.Shape();

        this.bitmap = new createjs.Bitmap();

        var item = this.userData;

        if(item){
            this.setColor(null);
        }

        this.addChild(this.bitmap);

        this.addChild(this.shape);
    };

    /**
     * 设置mask颜色
     * @param color 格式 rgba(0,0,0,1) 或者#000000
     * 或者json {colors:[rgba(0,0,0,1),rgba(255,255,255,1)],ratios:[0,1],pos:[x0,y0,x1,y1]}
     * 当为json时，只有一个颜色表单色，有多个颜色时表渐变，colors为渐变颜色 ratios为所对应的颜色在pos区域对应的位置，
     * 该值为比率0-1,pos渐变色区域
     */
    p.setColor = function(color){
        this.bitmap.visible = false;
        this.shape.visible = true;
        var g = this.shape.graphics;
        this.isImage = false;
        g.clear();
        var data = this.userData;
        //color格式 rgba(0,0,0,1) 或者#000000 或者json {colors:[rgba(0,0,0,1),rgba(255,255,255,1)],ratios:[0,1]}
//        color = color || data.get("item_color");
        color = color || "rgba(255,255,255,0)";

//        var width = data.get("item_width"),
//            height = data.get("item_height"),
//            x = data.get("item_left"),
//            y = data.get("item_top");

        var width = createjs.wkCanvas.width,
            height = createjs.wkCanvas.height,
            x = 0,
            y = 0;

		this.userData.set("item_left", 0);
		this.userData.set("item_top", 0);
		this.userData.set("item_width", width);
		this.userData.set("item_height", height);

        //判断是否json格式
        if(color.indexOf("{") == 0 && color.indexOf("}") == color.length - 1){

			this.userData.set("use_mask", true);
			this.userData.set("mask_color", color);

            var object = $.parseJSON(color);
            var colors = object.colors;
            if(colors.length > 1){
                var ratios = [];
                if(object.ratios){
                    ratios = object.radios;
                }else{
                    var rate = 1 / (colors.length - 1);
                    for(var i = 0;i < colors.length;i++){
                        ratios.push(rate * i);
                    }
                }
                g.beginLinearGradientFill(colors, ratios, 0, 0, 0, height);
            }else{
                g.beginFill(colors[0]);
            }
        }else{
            g.beginFill(color);
        }

        g.rect(x,y,width,height);
        g.endFill();
    };

    /**
     *
     * @param url base64
     */
    p.setImageUrl = function(url){
        var self = this;
        this.base64Image = url;
        this.isImage = true;
//        appLog(url)
        utils.loadImage(url,function(img){
            self.bitmap.image = img;
            self.bitmap.visible = true;
            self.shape.visible = false;
            self.resize();
        });
    };

    p.getRectBounds = function(){
        var b = {x:0,y:0,width:0,height:0};
        if(this.isImage){
//            var rect = this.bitmap.getBounds();
//            b.x = rect.x;
//            b.y = rect.y;

            b.width = this.bitmap.image.width;
            b.height = this.bitmap.image.height;
        }
        return b;
    };

    /**
     * 设置矩形透明度
     * @param value
     */
    p.setAlpha = function(value){
        this.shape.alpha = value;
        this.bitmap.alpha = value;
        //var data = this.userData;
		this.userData.set("item_opacity", value * 100);
//        data.set("item_transp",value);
    };

    p.setSelected = function(b){
        this.selected = b;
    };

    p.getSelected = function(){
        return this.selected;
    };

	// 添加到舞台事件
	p.on_added = function () {

	}

    p.setIsDragging = function(b){
        this.isDragging = b;
        if(b){
            this.bgRect.visible = true;
        }else{
            this.bgRect.visible = false;
        }
    };

    p.isEdit = false;

    createjs.EditMaskRect = EditMaskRect;

    EditMaskRect.TYPE = "maskrect";
});