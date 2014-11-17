// 文件名称: fma_a_setting_home.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/11
// 描    述: 设置页首页
define([
    "jquery",
    "views/base_view",
    "text!templates/setting/fma_ui_setting_home.html"
],function($, BaseView,settingHomeTpl){

    /**
     * 设置页首页
     */
    var SettingHomeView = app.views.SettingHomeView = BaseView.extend({
        id: "setting_home",
        className : "page",
        template: _.template(settingHomeTpl),
        initialize: function () {
            this.$el.html(this.template);
        },
        render : function(options){
            this.constructor.__super__.render.apply(this,[options]);
            //this.initRenderer();
            $("#manager").click(function(){
                app.routers.appRouter.navigate("fma/setting_manager",{replace:true,trigger:true});
            });
            $("#div_feedback").click(function(){
                app.routers.appRouter.navigate("fma/setting_feedback",{replace:true,trigger:true});
            });
        },
        pageIn : function(){

        },
        remove : function(){

        }
    });

    return SettingHomeView;

});