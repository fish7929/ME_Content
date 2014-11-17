// 文件名称: mybitmap.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/09
// 描    述: 重写createjs.Text对象,使其支持更多功能
define([
    'jquery',
    'easeljs'
],function($,c){
    var MyText = function(text,font,color){
        this.type = "mytext";
        this.initialize(r);
    };

    var p = MyText.prototype = new createjs.Text();

    p.Text_initialize = p.initialize;

    p.initialize = function(text,font,color){
        this.Text_initialize(text,font,color);
    };

    createjs.MyText = MyText;

    return MyText;
});