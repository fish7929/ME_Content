// 文件名称: fma_a_slider.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/30
// 描    述: 左侧边栏
define([
    'jquery',
    'text!templates/fma_ui_slider.html',
    'views/base_view'
], function($,navTpl,BaseView) {

    var SliderView = app.views.SliderView = BaseView.extend({
        tagName : "div",
        id : "nav",
        currentView : null,
        template : _.template(navTpl),
        //视图初始化
        initialize: function() {
            //console.log(this.$el.swipe)
            this.$el.html(this.template);
        },
        render : function(options){
            this.constructor.__super__.render.apply(this,[options]);
        }

    });

    return SliderView;
});