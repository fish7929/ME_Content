/**
 * Created by shychen on 2014/8/23.
 */
/**
 * 一级view的基类
 * 提供view过场效果，二级view 不应继承
 */
define([
    'underscore',
    'backbone'
],function(_,Backbone){

    var BaseView = function(options){
        "use strict";
        this.renderParams = {};
        //alert(Backbone)
        Backbone.View.apply(this,[options]);
    };

    //this.constructor.__super__.render.
    _.extend(BaseView.prototype,Backbone.View.prototype,{
        render : function(options){
            options = options || {};
            if(options.page === true){
                //this.$el.addClass("page");
            }
            return this;
        }
    });

    BaseView.extend = Backbone.View.extend;

    return BaseView;
});