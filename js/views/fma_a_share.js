// 文件名称: fma_a_share.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/27
// 描    述: 作品分类
define([
    "jquery",
    "views/base_view",
    "text!templates/fma_ui_type.html",
    "masonry"
],function($, BaseView,fmaTypeTpl,masonry){

    var ShareView = app.views.ShareView = BaseView.extend({
        id : "fma_ui_type",
        template : _.template(fmaTypeTpl),
        iScroll : null,
        sectionIScroll : null,
        initialize : function(){
            $(this.el).html(this.template);
            var self = this;
            setTimeout(function(){
                var $container = $('#type_infinite_scroll');
                $container.imagesLoaded(function() {
                    $('#type_infinite_scroll').masonry({
                        itemSelector: '.typewarterbox',
                        isAnimated: false,
                        columnWidth: 12
                    });
                });
            },0);
        },
        render : function(options){
            this.constructor.__super__.render.apply(this,[options]);
        },
        remove : function(){
            $(this.el).remove();
        },
        pageIn : function(){
            if(!this.sectionIScroll){
                //照片墙的滚动条
                this.sectionIScroll = new IScroll('#type_fall_wrapper', {
                    tap:true,
                    click:false,
                    mouseWheel:true, scrollbars:false,
                    fadeScrollbars:true,
                    interactiveScrollbars:false,
                    keyBindings:false
                });
            }
        }
    });
    return ShareView;
});