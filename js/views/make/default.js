// 文件名称: default.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/11
// 描    述: 默认的菜单
define([
    "jquery",
    "underscore"
],function($, _){

    /**
     * 默认的菜单,该菜单的功能只负责显示底部菜单
     * @param parentView
     * @constructor
     */
    var Default = function(parentView){
        this.parentView = parentView;

        utils.delay(function(){
            var self = this;
            this.$el = $("#defaulton");
            this.el = this.$el.get(0);

//            this.$el.click(function(){
//                self.hide();
//            });
        },0,this);
    };

    Default.prototype.show = function(){
        this.$el.css({display:"block"});
    };

    Default.prototype.hide = function(func){
        this.$el.css({display:"none"});
        if(func){
            func();
        }
    };

    return Default;
});