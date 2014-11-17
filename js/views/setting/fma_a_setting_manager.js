// 文件名称: fma_a_setting_manager.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/15
// 描    述: 设置管理中心
define([
    "jquery",
    "views/base_view",
    "text!templates/setting/fma_ui_setting_manager.html"
],function($, BaseView,settingManagerTpl){

    /**
     * 设置管理中心
     */
    var SettingManagerView = app.views.SettingManagerView = BaseView.extend({
        id: "setting_manager",
        className : "page",
        template: _.template(settingManagerTpl),
        initialize: function () {
            this.$el.html(this.template);
        },
        render : function(options){
            this.constructor.__super__.render.apply(this,[options]);
            //this.initRenderer();
            this.init();
        },
        pageIn : function(){

        },
        remove : function(){
        },

        /**
         *  管理中心左右切换
         *  obj 1:要显示的内容  obj 2:要隐藏的内容
         */
        switchLeftGotoRight : function(gotoId, inID){
            $("#" + inID).hide();
            $("#" + gotoId).css("margin-left", "-100%");
            $("#" + gotoId).show();
            $("#" + gotoId).animate({"margin-left": "0"}, function(){
                $("#" + inID).hide();
            });
        },
        switchRightGotoLeft : function(gotoId, inID){
            $("#" + inID).hide();
            $("#" + gotoId).css("margin-left", "100%");
            $("#" + gotoId).show();
            $("#" + gotoId).animate({"margin-left": "0"}, function(){
                $("#" + inID).hide();
            });
        },
        navTabClick : function(e){
            //当前选中的元素
            var sel_obj = $(".set_menu_sel");
            if(sel_obj.attr("menu_nmu") == $(e.target).attr("menu_nmu")) return ;
            //获取当前选中元素的 菜单号
            var sel_index = sel_obj.attr("menu_nmu");
            $(".set_menu_sel").removeClass("set_menu_sel");
            $(e.target).addClass("set_menu_sel");
            //滑动
            if($(e.target).attr("menu_nmu") > sel_index){
                this.switchLeftGotoRight($(e.target).attr("pageId"), sel_obj.attr("pageId"));
            }else{
                this.switchRightGotoLeft($(e.target).attr("pageId"), sel_obj.attr("pageId"));
            }
        },
        init : function(){
            var self = this;
            $(".set_menu div[menu_nmu]").bind("click",function(e){
                self.navTabClick(e);
            });
        }



});

    return SettingManagerView;

});