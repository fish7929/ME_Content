// 文件名称: pic.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/03
// 描    述: 图片背景蒙罩
define([
    "jquery",
    "underscore",
    "text!templates/fma_ui_mask.html",
    "config/mask_color",
    "common/render/include"
],function($, _, maskTpl,MaskColors,createjs){

    /**
     * 图片背景蒙罩页面
     */
    var MaskUI = function(parent){
        this.parentView = parent;
        this.template = _.template(maskTpl);
        this.$el = $("<div>").attr("id","makemask");
        this.$el.addClass("hidemaskui make_menu_bgcolor");
        this.el = this.$el.get(0);

        this.currentSelectedColorLi = null;

        this.$el.html(this.template);
        this.maskScroll = null;

        this.parentView.MenuReset(this.$el);

        var self = this;
        var ul = this.$el.find("#mask_scroller > ul:first");
        var html = "<li><div class='mask_photo' color='photo_pic'></div></li>";
        html += "<li><div class='mask_photolib' color='photo_lib'></div></li>";

        html += utils.createMaskColorLi(MaskColors);
        ul.html(html);

        //颜色
        setTimeout(function(){
            self.maskColor = $("#mask_wrapper");
            self.maskColor.on("click",function(e){
                onMaskColorClick.call(self,e);
            });

            //透明度改变
            self.maskAlpha = $("#maskalpha");
            self.maskAlpha.get(0).oninput = function(e){
                onAlphaChange.call(self, e.target.value);
            };

            /**
             * 关闭按钮
             * @type {*|jQuery|HTMLElement}
             */
            self.closeBtn = $("#mask_on");

            self.closeBtn.on("mouseup",function(){
                self.hide();
            });

            //前景背景按钮
            self.foreBtn = $("#make-fore-btn");
            self.backBtn = $("#make-back-btn");

            //console.log(self.foreBtn.get(0));
            self.foreBtn.on("click",function(){
                self.foreBackClickHandler(1);
            });

            self.backBtn.on("click",function(){
                self.foreBackClickHandler(2);
            });

            if(DisplayObjectManager.lastChangeImageType != -1){
                self.foreBackClickHandler(DisplayObjectManager.lastChangeImageType);
            }

            topEvent.bind(EventConstant.FORE_BACK_CHANGE, function(e, data){
                self.foreBackSelected(data);
            });

        //初始化input者造成长度
        var inputPercent = $("#maskalpha").val()/($("#maskalpha").prop("max")-$("#maskalpha").prop("min"));
        $("#maskalphaMask").width(($("#maskalpha").offsetParent().width()*0.9-56)*inputPercent);
        },0);
    };

    //透明度改变
    function onAlphaChange(value){
//        if(this.parentView){
            var p = DisplayObjectManager;
            var objects = p.displayObjects;
            var object = objects[1];
        if(!object){
            return;
        }

            if(object.type == "maskrect"){
                object.setAlpha(value);
            }
        //初始化input者造成长度
        var inputPercent = $("#maskalpha").val()/($("#maskalpha").prop("max")-$("#maskalpha").prop("min"));
        $(".input_mask").width(($("#maskalpha").offsetParent().width()-56)*inputPercent);
//        }
    }

    //颜色点击事件处理
    function onMaskColorClick(e){
        var div = e.target;

        var color = $(div).attr("color");
        var self = this;

        if(color){
            if(color == "photo_pic"){
                //this.getNativePic("photo");
                this.parentView.photoSelect.getNativePic("photo",function(img){
                    self.setColorOrImage(img,2);
                });
            }else if(color == "photo_lib"){
                this.parentView.photoSelect.getNativePic("photolib",function(img){
                    self.setColorOrImage(img,2);
                });
            }else{
                //选中状态样式改变
                if(this.currentSelectedColor){
                    this.currentSelectedColor.removeClass("pic_li_selected");
                }
                this.currentSelectedColor = $(div);
                this.currentSelectedColor.addClass("pic_li_selected");

                self.setColorOrImage(color,1);
            }
        }
    }

    MaskUI.prototype.setColorOrImage = function(obj,type){
//        if(this.parentView){
            var p = DisplayObjectManager;
            var objects = p.displayObjects;

            var object = objects[1];
            var mask;
            if(object && object.type == "maskrect"){
                //object.setColor(color);
                mask = object;
            }else{
                mask = new createjs.EditMaskRect();
                //mask.setColor(color);
                p.add(mask,1);
            }

            if(type == 1){
                mask.setColor(obj);
            }else{
                mask.setImageUrl(obj);
            }
//        }
    };

    MaskUI.prototype.initScroll = function(){
        var self = this;
        setTimeout(function(){
            var w = $("#mask_scroller").find("ul:first > li");

            var liSize = w.size();
            var liWidth = w.eq(0).width();

            //需要动态算出滚动条的宽度
            $("#mask_scroller").css({width:((liWidth) * (liSize) ) + "px"});

            self.maskScroll = new IScroll('#mask_wrapper', {
                scrollX: true, scrollY: false, mouseWheel: true,
                tap : true,
                bounce : false,
                click:true,
                bindToWrapper : true
            });
        },0);
    };

    MaskUI.prototype.show = function(){
        //this.$el.removeClass("hidemaskui");
        //this.$el.addClass("showmaskui");
        //this.$el.slideDown("fast");
        this.parentView.MenuIn(this.$el);
        this.closeBtn.css({display:"block"});
        this.maskScroll.refresh();
    };

    MaskUI.prototype.hide = function(){
        //this.$el.removeClass("showmaskui");
        //this.$el.addClass("hidemaskui");
        //this.$el.slideUp("fast");
        this.parentView.MenuOut(this.$el);
        this.closeBtn.css({display:"none"});
        if(this.onhide){
            this.onhide();
        }
    };

    MaskUI.prototype.foreBackClickHandler = function(type){
        this.foreBackSelected(type);
        topEvent.trigger(EventConstant.FORE_BACK_CHANGE,type);
    };

    MaskUI.prototype.foreBackSelected = function(type){
        if(type == 1){
            this.backBtn.removeClass("active");
            this.foreBtn.addClass("active");
        }else{
            this.backBtn.addClass("active");
            this.foreBtn.removeClass("active");
        }
    };

    return MaskUI;
});