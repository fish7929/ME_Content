// 文件名称: watermark_edit.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/09
// 描    述: 水印编辑界面
define([
    "jquery",
    "underscore",
    "text!templates/fma_ui_watermark_edit.html",
    "config/font_color",
    "common/render/include"
],function($, _, waterMarkEditTpl,Colors,C) {

    /**
     * 水印编辑界面
     */
    var WaterMarkEdit = function (parent) {
        this.template = _.template(waterMarkEditTpl);
        this.$el = $("<div>").attr("id","watermarkedit");
        this.$el.addClass("hidewatermarkedit make_menu_bgcolor");
        this.el = this.$el.get(0);

        this.closeBtn = $("#watermarkedit_on");

        this.parentView = parent;
        this.parentView.MenuReset(this.$el);

        this.$el.html(this.template);

        utils.delay(function(){
            var ul = this.$el.find("#watercolor_scroller > ul:first");
            var html = utils.createMaskColorLi(Colors);
            this.closeBtn = $("#watermarkedit_on");

            ul.html(html);

            this.$el.find("#watermark_alpha").get(0).oninput = function(e){
                self.changeAlpha(e.target.value);
            };

            var self = this;

            //颜色
            this.waterColor = $("#watercolor_wrapper");
            this.waterColor.click(function(e){
                onWaterColorClick.call(self,e);
            });

			this.okBtn = $("#watermark_ok");
			this.cancelBtn = $("#watermark_close");

            this.closeBtn.click(function(){
                self.hide();
            });

			// OK按钮被按下
			this.okBtn.click(function()
			{
				self.hide();
			});

			// CANCEL按钮被按下
			this.cancelBtn.click(function()
			{
				var p = self.parentView;
				var obj = p.opObject;
				if(obj && obj.type == "editwatermark"){
					if (self.cancel_color)
					{
						obj.changeColor(self.cancel_color);
					}
					if (self.cancel_alpha)
					{
						obj.changeAlpha(self.cancel_alpha);
					}
					else
					{
						obj.changeAlpha(1);
					}
				}
				self.hide();
			});

        },0,this);
    };

    WaterMarkEdit.prototype.initScroll = function(){
        var self = this;
        setTimeout(function(){
            var w = $("#watercolor_scroller").find("ul:first > li");

            var liSize = w.size();
            var liWidth = w.eq(0).width();
            //console.log("w:" + liWidth)
            //需要动态算出滚动条的宽度
            $("#watercolor_scroller").css({width:((liWidth) * (liSize) ) + "px"});

            self.fontScroll = new IScroll('#watercolor_wrapper', {
                scrollX: true, scrollY: false, mouseWheel: true,
                tap : true,
                click : true,
                bounce : false,
                bindToWrapper : true,
                keyBindings:false
            });
        },100);
    };

    WaterMarkEdit.prototype.changeAlpha = function(value){
        var p = this.parentView;
        var obj = p.opObject;
        if(obj && obj.type == "editwatermark"){
            obj.changeAlpha(value);
        }
    };

    function onWaterColorClick(e){
        var div = $(e.target);
        var color = div.attr("color");
        //console.log(color)
        var p = this.parentView;
        var obj = p.opObject;
        if(obj && obj.type == "editwatermark"){
            obj.changeColor(color);
        }
    }

    WaterMarkEdit.prototype.show = function(){
        //console.log("watershow")

        var p = this.parentView;
        var obj = p.opObject;
        if(obj && obj.type == "editwatermark"){
			this.cancel_color = obj.current_color;
			this.cancel_alpha = obj.current_alpha;
        }

//        this.$el.removeClass("hidewatermarkedit");
//        this.$el.addClass("showwatermarkedit");
        this.parentView.MenuIn(this.$el);
        this.closeBtn.css({display:"block"});
    };

    WaterMarkEdit.prototype.hide = function(){
        //console.log("hide")
        this.parentView.MenuOut(this.$el);
//        this.$el.removeClass("showwatermarkedit");
//        this.$el.addClass("hidewatermarkedit");
        this.closeBtn.css({display:"none"});

		this.cancel_color = null;
		this.cancel_alpha = null;

        if(this.onhide){
            this.onhide();
        }
    };

	// 用户点击OK按钮
    WaterMarkEdit.prototype.okHandle = function(){
        this.hide();
    };

	// 用户点击CANCEL按钮
    WaterMarkEdit.prototype.cancelHandle = function(){
        this.hide();
    };

    return WaterMarkEdit;
});