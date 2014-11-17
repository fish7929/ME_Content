// 文件名称: fma_a_setting_about.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/15
// 描    述: 设置关于页
define([
    "jquery",
    "views/base_view",
    "text!templates/setting/fma_ui_setting_about.html"
],function($, BaseView,settingAboutTpl){
    /**
     * 设置关于页
     */
    var SettingAboutView = app.views.SettingAboutView = BaseView.extend({
        id: "setting_about",
        className : "page",
        template: _.template(settingAboutTpl),
        initialize: function () {
            this.$el.html(this.template);
        },
        render : function(options){
            this.constructor.__super__.render.apply(this,[options]);
            //this.initRenderer();
        },
        pageIn : function(){

        },
        remove : function(){

        }
    });

    return SettingAboutView;

});