// 文件名称: edittext.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/29
// 描    述: 一个可编辑矩形
define([
    'jquery',
    'common/render/baseedit',
    'easeljs'
],function($){

    /**
     * 可编辑的矩形\色带、填充区域
     * @constructor
     */
    var EditRect = function(){
        this.type = EditRect.TYPE;
        this.initialize();
    };

    EditRect.TYPE = "editrect";

    var p = EditRect.prototype = new createjs.BaseEdit();

    p.BaseEdit_initialize = p.initialize;

    p.initialize = function(){
        this.BaseEdit_initialize();

        this.selected = false;

        this.shape = new createjs.Shape();

        /**
         * 矩形的区域
         * @type {{x: number, y: number, width: number, height: number}}
         */
        this.rect = {x:0,y:0,width:0,height:0};

        /**
         * 矩形填充的颜色
         * @type {string}
         */
        this.rectColor = "#000000";

        this.rectAlpha = 1;

        this.rectRGBA = hexToRgb(this.rectColor,this.rectAlpha);

        this._graphics = this.shape.graphics;

        this.addChild(this.shape);
    };

    /**
     * 设置矩形区域大小
     * @param x
     * @param y
     * @param width
     * @param height
     */
    p.setRect = function(x,y,width,height){
        var rect = this.rect;
        rect.x = x;
        rect.y = y;
        rect.width = width;
        rect.height = height;

        var userData = this.userData;
        userData.set("item_left",x);
        userData.set("item_top",y);
        userData.set("item_width",width);
        userData.set("item_height",height);
        this.redraw();
    };

    /**
     * 设置矩形的颜色
     * @param color
     */
    p.setRectColor = function(color){
        this.rectColor = color;

        if(color.indexOf("#") == -1){
            return;
        }

        var userData = this.userData;
        userData.set("item_color",color);

        this.rectRGBA = hexToRgb(color,this.rectAlpha);

        this.redraw();
    };

    /**
     * 设置矩形的alpha值
     * @param alpha
     */
    p.setRectAlpha = function(alpha){
        this.rectAlpha = alpha;

        alpha = (alpha < 0 ? 0 : alpha);
        alpha = (alpha > 1 ? 1 : alpha);

        this.userData.set("item_opcacity",alpha * 100);

        this.rectRGBA = hexToRgb(this.rectColor,alpha);

        this.redraw();
    };

    p.setGscale = function(){
        var rect = this.rect;
        rect.x = VS.vx(rect.x);
        rect.y = VS.vy(rect.y);
        rect.width = VS.vx(rect.width);
        rect.height = VS.vy(rect.height);

        this.redraw();
    };

    p.redraw = function(){
        var g = this._graphics;
        g.clear();
        g.beginFill(this.rectRGBA.toString());
        var rect = this.rect;

        g.rect(rect.x,rect.y,rect.width,rect.height);
        g.endFill();
    };

    createjs.EditRect = EditRect;

    return EditRect;
});