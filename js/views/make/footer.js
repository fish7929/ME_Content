// 文件名称: footer.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/11
// 描    述: 底部菜单
define([
    "jquery",
    "underscore"
],function($, _){

    /**
     * 底部菜单
     * @param parentView
     * @constructor
     */
    var Footer = function(parentView){
        this.$el = $("#makefooter");
        this.el = this.$el.get(0);

        this.parentView = parentView;

        this.maskUI = parentView.maskUI;
        this.picFrame = parentView.picFrame;
        this.waterMark = parentView.waterMark;
        this.picScroll = parentView.picScroll;

        var self = this;



        utils.delay(function(){
            var self = this;

            this.currentShow = this.parentView.footer;

            this.closeBtn = $("#footeron");

            this.closeBtn.on("click",function(){
                self.hide();
            });

            this.$el.on("click",function(e){
//                e.preventDefault();
                self.footerEventHandle(e);
            });
        },0,this);
    };

    /**
     * 图文框印点击事件处理
     * @param  Event事件
     */
    Footer.prototype.footerEventHandle = function(e){
        var ftype = utils.getEventAttr(e,"ftype");
        var parentView = this.parentView;

        if(this.currentShow){
            this.currentShow.hide();
        }

        if(ftype != null){
            switch (ftype){
                case "1"://模板
                    this.currentShow = parentView.picScroll;

                    break;
                case "2"://背景
                    this.currentShow = parentView.maskUI;
                    break;
                case "3"://文字
                    this.currentShow = parentView.textInputUI;
                    break;
                case "4"://画框
                    this.currentShow = parentView.picFrame;
                    break;
                case "5": //水印
                    this.currentShow = parentView.waterMark;
                    break;
            }
        }
        this.parentView.Default.hide();
        this.currentShow.show();
    };

    Footer.prototype.show = function(){
        this.$el.show();
        this.closeBtn.css({display:"block"});
    };

    Footer.prototype.hide = function(func){
        this.$el.hide();
        this.closeBtn.css({display:"none"});
        this.parentView.Default.show();
        if(func){
            func();
        }
    };

    return Footer;
});