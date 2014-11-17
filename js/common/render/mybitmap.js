// 文件名称: mybitmap.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/09
// 描    述: 重写createjs.Bitmap对象
define([
    'jquery',
    'easeljs'
],function($,c){
    var MyBitmap = function(imageOrUri){
        this.type = "mybitmap";
        this.initialize(imageOrUri);
    };

    var p = MyBitmap.prototype = new createjs.Bitmap();

    p.Bitmap_initialize = p.initialize;

    p.initialize = function(imageOrUri){
        this.Bitmap_initialize(imageOrUri);
    };

    p.draw = function(ctx, ignoreCache) {
        if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
        var rect = this.sourceRect;
        if (rect) {
            ctx.drawImage(this.image, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.targetWidth, rect.targetHeight);
        } else {
            ctx.drawImage(this.image, 0, 0);
        }
        return true;
    };

    createjs.MyBitmap = MyBitmap;

    return MyBitmap;
});