// 文件名称: font_ui.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/28
// 描    述: 字体编辑
define([
    "jquery",
    "underscore",
    "text!templates/font_ui.html",
    "common/render/include",
    "config/font_color"
],function($, _, fontUITpl,createjs,colors){

    /**
     * 字体编辑界面
     * @param parentView
     * @constructor
     */
    var FontUI = function(parentView){
        this.template = _.template(fontUITpl);
        this.$el = $("<div>").addClass("font_ui make_menu_bgcolor");
        this.$el.addClass("hidefontui");
        this.el = this.$el.get(0);

        this.$el.html(this.template);

        this.fontScroll = null;

        //工具条滚动
        this.toolScroll = null;

        //透明度事件
        this.onOpcityChange = null;

        //字体大小事件
        this.onFontSizeChange = null;

        //字间距事件
        this.onSpacingChange = null;

        //字行距事件
        this.onRowSpacingChange = null;

        //当前选中的颜色元素li
        this.currentSelectedColorLi = null;

        this.parentView = parentView;
        this.parentView.MenuReset(this.$el);

        utils.delay(function(){
            var self = this;
            this.$el.find("#cmpClose > div").click(function(){
                self.hide();
            });

//            $('input[type="range"]').rangeslider();

            //透明度
            this.$el.find("input[attr=opacity]").get(0).oninput = function(e){
                self.change("opacity", e.target.value);
            };

            //字体大小
            this.$el.find("input[attr=fontsize]").get(0).oninput = function(e){
                self.change("fontsize", e.target.value);
            };

            //字间距
            this.$el.find("input[attr=spacing]").get(0).oninput = function(e){
                self.change("spacing", e.target.value);
            };

            //字行距
            this.$el.find("input[attr=rowspacing]").get(0).oninput = function(e){
                self.change("rowspacing", e.target.value);
            };

            var ul = this.$el.find("#font_scroller > ul:first");
            var html = "<li><div attr='photo' color='photo_pic'></div></li>";
            html += "<li><div attr='photolib' color='photo_lib'></div></li>";

            ul.html(html + utils.createMaskColorLi(colors));

            this.fontTextAlign = this.$el.find(".font_text_align");
            this.textAlignDet = this.$el.find(".text_align_det");

            this.fontTextAlign.click(function(){
                displayTextAlign.call(self);
            });

            //颜色
            this.fontColor = $("#font_wrapper");
            this.fontColor.click(function(e){
                onFontColorClick.call(self,e);
            });

            //镜像
            $(".jingxiang").click(function(){
                var on = $(this).attr("on");
                if(on == "false"){
                    $(this).attr("on","true");
                    self.setTextMirror("left");
                }else{
                    $(this).attr("on","false")
                    self.setTextMirror("nleft");
                }
                $(this).parent().find(".active").removeClass("active")
                $(this).addClass("active")
            });

            //镜像上下
            $(".fanzhuan").click(function(){
                var on = $(this).attr("on");
                if(on == "false"){
                    $(this).attr("on","true");
                    self.setTextMirror("top");
                }else{
                    $(this).attr("on","false")
                    self.setTextMirror("ntop");
                }
                $(this).parent().find(".active").removeClass("active")
                $(this).addClass("active")
            });

            //左对齐
            $("#fontAlign .align-left").click(function(){
                if (DisplayObjectManager.currentDisplayObject && DisplayObjectManager.currentDisplayObject.type == "edittext") {
                    var text = DisplayObjectManager.currentDisplayObject;
                    text.setAlign("left");
                }
            });

            //居中对齐
            $("#fontAlign .align-center").click(function(){
                if (DisplayObjectManager.currentDisplayObject && DisplayObjectManager.currentDisplayObject.type == "edittext") {
                    var text = DisplayObjectManager.currentDisplayObject;
                    text.setAlign("center");
                }
            });

            //右对齐
            $("#fontAlign .align-right").click(function(){
                if (DisplayObjectManager.currentDisplayObject && DisplayObjectManager.currentDisplayObject.type == "edittext") {
                    var text = DisplayObjectManager.currentDisplayObject;
                    text.setAlign("right");
                }
            });

            //关闭按钮
            this.closeBtn = $("#cmpClose");
            this.closeBtn.click(function(){
                self.hide();
            });

            /*相机相册点击事件*/
            $('#fontColor li:eq(0)').on("tap", function (e) {
                self.photoClick(e);
            })
            $('#fontColor li:eq(1)').on("tap", function (e) {
                self.photoClick(e);
            })

            //工具栏点击事件
            $("#font_tool li").on("tap", function (e) {
                $("#font_tool").find(".active").removeClass("active");
                $(this).addClass("active");
                $("#font_ui").css("visibility", "visible");
                $("#font_ui [role='util']").hide();
                $(".input_mask.font").hide();
                $($(this)[0].dataset.target).show();
                if ($($(this)[0].dataset.target).next().hasClass("input_mask")) $($(this)[0].dataset.target).next().show();
                if ($(this)[0].dataset.target === "#fontColor") {
                    self.fontScroll.refresh();
                }
            })


        },0,this);

    };

    /**
     * 颜色点击事件处理
     * @param e
     */
    function onFontColorClick(e){
        var div = $(e.target);
        var color = div.attr("color");

        if(color){
            if(color == "photo"){
                //console.log("ddd")

//                this.setColorOrImage("images/test/2.png",2);


                if(DisplayObjectManager.currentDisplayObjectIsType(createjs.EditText.TYPE)){
                    var self = this;
                    this.parentView.photoSelect.show(function(img){
                        self.setColorOrImage(img,2);
                    });
                }
            }else{
                if(this.currentSelectedColor){
                    this.currentSelectedColor.removeClass("colorli_selected");
                }

                this.currentSelectedColor = $(div);
                this.currentSelectedColor.addClass("colorli_selected");

                this.setColorOrImage(color,1);
            }
        }
    }

    FontUI.prototype.photoClick = function(e){
        var div = $(e.target);
        var attr = div.attr("attr");
//        alert(attr)
        if(attr){
            if(DisplayObjectManager.currentDisplayObjectIsType(createjs.EditText.TYPE)){
                var self = this;
                this.parentView.photoSelect.getNativePic(attr,function(img){
                    self.setColorOrImage(img,2);
                });
            }
        }
    };

    FontUI.prototype.setColorOrImage = function(obj,type){
        if(this.parentView && this.parentView.opObject &&
            this.parentView.opObject.type == "edittext"){
            var text = this.parentView.opObject;
            if(type == 1){
                text.setTextColor(obj);
            }else if(type == 2){
                text.setTextImage(obj);
            }
        }
    };


    function displayTextAlign(){
        var on = this.fontTextAlign.attr("on");
        if(on == "false"){
            this.fontTextAlign.attr("on","true");
            this.fontTextAlign.addClass("selected");
            this.textAlignDet.css({display:"block"});
        }else{
            this.fontTextAlign.attr("on","false");
            this.fontTextAlign.removeClass("selected");
            this.textAlignDet.css({display:"none"});
        }
    }

    FontUI.prototype.initScroll = function(){
        var self = this;
        setTimeout(function(){

            var w = $("#font_scroller").find("ul:first > li");

            var liSize = w.size();
            var liWidth = w.eq(0).width();
            //需要动态算出滚动条的宽度
            $("#font_scroller").css({
                width: ((liWidth + 12.33) * (liSize)) + "px"
            });

            self.fontScroll = new IScroll('#font_wrapper', {
                scrollX: true,
                scrollY: false,
                mouseWheel: true,
                tap: true,
                click: true,
                bounce: false,
                bindToWrapper: true,
                keyBindings: false
            });

            w = $("#font-tool-scroller").find("ul:first > li");

            var liSize = w.size();
            var liWidth = w.eq(0).width();
//            console.log(liWidth)
            //需要动态算出滚动条的宽度
            $("#font-tool-scroller").css({
                width: ((liWidth + 12.33) * (liSize)) + "px"
            });

            self.toolScroll = new IScroll('#font_tool', {
                scrollX: true,
                scrollY: false,
                mouseWheel: true,
                tap: true,
                click: true,
                bounce: false,
                bindToWrapper: true,
                keyBindings: false
            });
        }, 100);
    };

    /**
     * 字体的属性值改变
     * @param type 改变的属性类型
     * @param value 改变的属性值
     */
    FontUI.prototype.change = function(type,value){
        if(this.parentView && this.parentView.opObject && this.parentView.opObject.type == "edittext"){
            var text = this.parentView.opObject;

            var style = text.style;
            switch (type){
                case "opacity": //透明度
                    text.setTextAlpha(value);
                    var inputPercent = $("#fontOpacityInput").val()/($("#fontOpacityInput").prop("max")-$("#fontOpacityInput").prop("min"));
                    $("#fontOpacityMask").width(($("#fontOpacityInput").offsetParent().width()*0.9-53)*inputPercent);
                    break;
                case "fontsize"://字大小
                    text.setFontSize(value);
                    var inputPercent = $("#fontSizeInput").val()/($("#fontSizeInput").prop("max")-$("#fontSizeInput").prop("min"));
                    $("#fontSizeMask").width(($("#fontSizeInput").offsetParent().width()*0.9-53)*inputPercent);
                    break;
                case "spacing":
                    text.setLetterSpacing(value);
                    var inputPercent = $("#fontSpacingInput").val()/($("#fontSpacingInput").prop("max")-$("#fontSpacingInput").prop("min"));
                    $("#fontSpacingMask").width(($("#fontSpacingInput").offsetParent().width()*0.9-53)*inputPercent);
                    break;
                case "rowspacing":
                    text.setLineHeight(value);
                    var inputPercent = $("#fontHeightInput").val()/($("#fontHeightInput").prop("max")-$("#fontHeightInput").prop("min"));
                    $("#fontHeightMask").width(($("#fontHeightInput").offsetParent().width()*0.9-53)*inputPercent);
                    break;
            }
        }
    };

    FontUI.prototype.show = function(){
        //this.$el.removeClass("hidefontui");
        //this.$el.addClass("showfontui");

        this.parentView.MenuIn(this.$el);
        this.closeBtn.css({display:"block"});

        this.fontScroll.refresh();
        this.toolScroll.refresh();
    };

    FontUI.prototype.hide = function(){

//        this.$el.removeClass("showfontui");
//        this.$el.addClass("hidefontui");
        this.parentView.MenuOut(this.$el);
        this.closeBtn.css({display:"none"});
        if(this.onhide){
            this.onhide();
        }
    };

    FontUI.prototype.setTextMirror = function (dir) {
        if (DisplayObjectManager.currentDisplayObject && DisplayObjectManager.currentDisplayObject.type == "edittext") {
            var text = DisplayObjectManager.currentDisplayObject;
            text.setTextMirror(dir);
        }
    };

    // 设置字体大小
    FontUI.prototype.set_font_size = function (font_size) {
        this.$el.find("input[attr=fontsize]").get(0).value = font_size;
        var inputPercent = $("#fontSizeInput").val() / ($("#fontSizeInput").prop("max") - $("#fontSizeInput").prop("min"));
        $("#fontSizeMask").width(($("#fontSizeInput").offsetParent().width() * 0.9 - 53) * inputPercent);
    };

    // 设置字体透明度
    FontUI.prototype.set_alpha = function (alpha) {
        this.$el.find("input[attr=opacity]").get(0).value = alpha;
        //初始化inputMask造成长度
        var inputPercent = $("#fontOpacityInput").val() / ($("#fontOpacityInput").prop("max") - $("#fontOpacityInput").prop("min"));
        $("#fontOpacityMask").width(($("#fontOpacityInput").offsetParent().width() * 0.9 - 53) * inputPercent);
    };

    // 设置字间距
    FontUI.prototype.set_spacing = function (spacing) {
        //TODU功能未实现，hbj给予固定值
        this.$el.find("input[attr=spacing]").get(0).value = 25;
        var inputPercent = $("#fontSpacingInput").val() / ($("#fontSpacingInput").prop("max") - $("#fontSpacingInput").prop("min"));
        $("#fontSpacingMask").width(($("#fontSpacingInput").offsetParent().width() * 0.9 - 53) * inputPercent);
    };

    // 设置行间距
    FontUI.prototype.set_row_spacing = function (row_spacing) {
        //TODU功能未实现，hbj给予固定值
        this.$el.find("input[attr=rowspacing]").get(0).value = row_spacing;
        var inputPercent = $("#fontHeightInput").val() / ($("#fontHeightInput").prop("max") - $("#fontHeightInput").prop("min"));
        $("#fontHeightMask").width(($("#fontHeightInput").offsetParent().width() * 0.9 - 53) * inputPercent);
    };

    return FontUI;
});