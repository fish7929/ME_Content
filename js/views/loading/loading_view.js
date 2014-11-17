// 文件名称: loading_view.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/25
// 描    述: loading页
define([
    'jquery',
    'underscore',
    'text!templates/loading/loading.html'
],function($,_,tpl){

    if(window.loadingView){
        return window.loadingView;
    }

    var LoadingView = function(){
        this.$el = $(tpl);

//        console.log(this.$el.get(0))
        $(document.body).append(this.$el);

        this.hide();

        this.init();
    };

    /**
     * 显示加载
     * @type {string}
     */
    LoadingView.SHOW_LOADING = "SHOW_LOADING";

    LoadingView.HIDE_LOADING = "HIDE_LOADING";

    LoadingView.prototype.init = function(){
        var self = this;
        topEvent.bind(LoadingView.SHOW_LOADING,function(obj){
            self.show();
        });

        topEvent.bind(LoadingView.HIDE_LOADING,function(obj){
            self.hide();
        });
    };

    LoadingView.prototype.show = function(){
        this.$el.show();
    };

    LoadingView.prototype.hide = function(){
        this.$el.hide();
    };

    window.loadingView = new LoadingView();
    Window.LoadingView = LoadingView;

    return window.loadingView;
});