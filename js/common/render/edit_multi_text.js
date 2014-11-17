// 文件名称: edit_multi_text.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/22
// 描    述: 一个可编辑多行文本的组件
define([
    'jquery',
    'common/render/baseedit',
    'common/render/include',
    'lib/canvastext/CanvasText-0.4.1'
],function($,ce,i,CanvasText){

    /**
     * 可编辑的多行文本对象
     * @constructor
     */
    var EditMultiText = function(prop){
        this.type = "edittext";
        this.gScale = this.gScale || 1;
        prop = prop || {};
        this.initialize(prop);
    };

    var p = EditMultiText.prototype = new createjs.BaseEdit();

    p.BaseEdit_initialize = p.initialize;

    p.initialize = function(prop){

        this.BaseEdit_initialize();

        /*文本字符串*/
        this.textStr = prop.text || "";
        /*字体*/
        this.fontFamily = prop.fontFamily || "Arial";
        /*粗细*/
        this.fontWeight = prop.bold ? "bold" : "normal";
        /*字大小*/
        this.fontSize = prop.fontSize || "12px";
        /*字颜色*/
        this.fontColor = prop.fontColor || "#000";
        /*字体 ：斜体*/
        this.fontStyle = prop.fontStyle || "normal";
        /*水平对齐方式  start, end, left,right, center。默认值:start.*/
        this.textAlign = prop.textAlign || "start";
        /*垂直对齐方式 top, hanging, middle,alphabetic, ideographic, bottom。默认值：alphabetic.*/
        this.textBaseline = prop.textBaseline || "alphabetic";
        /*行高，默认值和字体大小一样*/
        this.lineHeight = prop.lineHeight || parseInt(this.fontSize,10);
        /*阴影*/
        this.textShadow = prop.textShadow || null;
        /*字间距*/
        this.letterSpacing = prop.letterSpacing || 0;

        /*文本效果的缓存图像*/
        this.textBufferedImage = null;

        var self = this;
        /*绘制文本的核心对象，将返回一个绘制好文本的canvas对象*/
        this.canvasText = new CanvasText();

        /**
         * 合成图
         * @type {null}
         */
        this.patternImage = null;

        //重设当前坐标，坐标点在中心点
        this.resetRegPosition();
//        var rect = this.getRectBounds();

//        this.scaleObjects.push(this.text);

        this.setSelected(false);

        this.setIsAdd(true);
        this.setIsRotation(true);
        this.setIsDelete(true);
        this.setIsScale(true);
        this.isDragging = true;

        this.resetTextConfig();

    };

    p.resetTextConfig = function(){
        var self = this;
        this.canvasText.config({
            canvas: createjs.wkCanvas,
            context: createjs.wkContext,
            fontFamily: self.fontFamily,
            fontSize: 20,
            fontWeight: self.fontWeight,
            fontColor: self.fontColor,
            lineHeight: 20,
            letterSpacing : self.letterSpacing,
            fontStyle : self.fontStyle,
            textAlign : self.textAlign,
            textBaseline : self.textBaseline,
            textShadow : self.textShadow
        });

        this.canvasText.defineClass("blue",{
            fontSize: "22px",
            fontColor: "#29a1f1",
            fontFamily: "Impact",
            fontWeight: "normal",
            textShadow: "2px 2px 2px #919191"
        });

        this.canvasText.defineClass("pink",{
            fontSize: "22px",
            fontColor: "#ff5e99",
            fontFamily: "Times new roman",
            fontWeight: "bold",
            fontStyle: "italic"
        });

//        console.log("fontSize:" + self.lineHeight)

        this.textBufferedImage = this.canvasText.drawText({
            text : self.textStr,
            x : 0,
            y : 20,
            returnImage : true,
            boxWidth : 450
        });

//        console.log("config:" + this.textBufferedImage)
    };

    /**
     * 设置字体
     * @param fontFamily
     */
    p.setFontFamily = function(fontFamily){
        this.fontFamily = fontFamily;
        this.resetTextConfig();
    };

    /*是否加粗*/
    p.setFontWeight = function(bold){
        this.bold = bold;
        this.resetTextConfig();
    };

    p.getRectBounds = function(){
//        var width = this.text.getMeasuredWidth(),
//            height = this.text.getMeasuredHeight();
//        var rect = this.text.getBounds();
        var scaleX = this.canvasText.scaleX || 1;
        var scaleY = this.canvasText.scaleY || 1;
        var width = this.canvasText.maxWidth;
        var height = this.canvasText.maxHeight;
        return {
            x : 0,
            y : 0,
            width : width * scaleX,
            height : height * scaleY
        };
    };

    p.BaseEdit_draw = p.draw;

    p.draw = function(ctx, ignoreCache){
        this.BaseEdit_draw(ctx,ignoreCache);
        //console.log(this.textBufferedImage)
        if(this.textBufferedImage){
            ctx.drawImage(this.textBufferedImage,0,0);
        }
    };

    /**
     * 文字透明度
     * @param value
     */
    p.setTextAlpha = function(value){
        //this.userData.item_transp = value;
        this.text.alpha = value;
        //设置userData数据 item_opacity
        this.userData.set("item_opacity",~~(value * 100));
    };

    /**
     * 文字大小
     * @param value
     */
    p.setFontSize = function(value){
        this.fontSize = value;
        this.resetTextConfig();
    };


    /**
     * 判断当前缩水的框已到最小
     */
    p.isMinSize = function(){
//        var r = this.getTextRect();
//        var b = this.touchScale.getBounds();
//        if(r.height < b.height || r.width < b.width){
//            return true;
//        }
//        return false;
    };

    /**
     * 设置文本颜色
     * @param color
     */
    p.setFontColor = function(color){
        var obj = $.parseJSON(color);
        this.patternImage = null;
        if(obj.colors.length > 1){
            var r = this.getRectBounds();
            var g = createjs.wkContext.createLinearGradient(0,0, 0, r.height);
            g.addColorStop(0,"#ff0000");
            g.addColorStop(1,"#0000ff");
//            this.text.color = g;
            this.fontColor = g;
        }else{
//            this.text.color = obj.colors[0];
//            this.userData.set("item_color",obj.colors[0]);
            this.fontColor = obj.colors[0];
        }
        this.resetTextConfig();
    };

    p.setFontStyle = function(fontStyle){
        this.fontStyle = fontStyle;
        this.resetTextConfig();
    };

    /**
     * 设置字体水平对齐方式
     * @param textAlign
     */
    p.setTextAlign = function(textAlign){
        this.textAlign = textAlign;
        this.resetTextConfig();
    };

    /**
     * 设置垂直对齐方式
     * @param baseline
     */
    p.setBaseline = function(baseline){
        this.textBaseline = baseline;
        this.resetTextConfig();
    };

    /**
     * 设置行高
     * @param lineHeight
     */
    p.setLineHeight = function(lineHeight){
        this.lineHeight = lineHeight;
        this.resetTextConfig();
    };

    /**
     * 设置字阴影
     * @param textShadow
     */
    p.setTextShadow = function(textShadow){
        this.textShadow = textShadow;
        this.resetTextConfig();
    };

    /**
     * 设置字间距
     * @param letterSpacing
     */
    p.setLetterSpacing = function(letterSpacing){
        this.letterSpacing = letterSpacing;
        this.resetTextConfig();
    };

    /**
     * 设置镜像
     * @param dir left 左右镜像
     * top 上下镜像
     * nleft 左右还原
     * nright 上下还原
     */
    p.setTextMirror = function(dir){
        var data = this.userData;

        var mir = data.get("item_mirror") + "";
        var leftMir = mir.indexOf("left") == -1 ? "" : "left",
            topMir = mir.indexOf("top") == -1 ? "" : "top";

        switch (dir){
            case "left":
                this.text.scaleX = (this.text.scaleX * -1);
                leftMir = "left";
                break;
            case "top":
                this.text.scaleY = (this.text.scaleY * -1);
                topMir = "top";
                break;
            case "nleft":
                this.text.scaleX = Math.abs(this.text.scaleX);
                leftMir = "";
                break;
            case "ntop":
                this.text.scaleY = Math.abs(this.text.scaleY);
                topMir = "";
                break;
        }

        var m = leftMir;
        if(m){
            if(topMir){
                m += "," + top;
            }
        }else{
            m = topMir;
        }

        data.set("item_mirror",m);
        this.resize();
    };

    p.setText = function(text){
        this.textStr = text;
        this.userData.set("item_val",text);

        this.resetTextConfig();
        //this.resize();
    };

    p.BaseEdit_resize = p.resize;

    p.resize = function(){
        this.resetRegPosition();
        this.BaseEdit_resize();
    };

    p.resetRegPosition = function(){
//        var rect = this.getRectBounds();
//        this.regX  = rect.width / 2;
//        this.regY  = rect.height / 2;
//
//        this.text.regX = rect.width / 2 ;
//        this.text.regY = rect.height / 2 ;
//
//        this.text.x = rect.width / 2 * this.text.scaleX;
//        this.text.y = rect.height / 2 * this.text.scaleY;
    };

    p.setTextImage = function(imageOrUri){
        var self = this;
        utils.loadImage(imageOrUri,function(img){
            self.patternImage = img;
            var pattern = createjs.wkContext.createPattern(self.patternImage,"repeat");
            self.text.color = pattern;
        });
    };

    p.onmove = function(){
        //console.log(this.patternImage)
        if(this.patternImage){
            var ctx = createjs.wkContext;
            ctx.save();
            ctx.translate(0,0);


            var pattern = createjs.wkContext.createPattern(this.patternImage,"repeat");
            this.text.color = pattern;
            ctx.restore();
        }
    };

    p.setGscale = function(scale){
//        this.text.scaleX = VS.xScale;
//        this.text.scaleY = VS.yScale;
        this.resize();
    };

    p.setPosition = function(x,y){
        this.x = x + this.regX;
        this.y = y + this.regY;
    };

    p.getTextValue = function(){
        return this.text.text;
    };

    p.onscale = function(scaleX,scaleY){
        this.resize();
    };

    createjs.EditMultiText = EditMultiText;
    return EditMultiText;
});