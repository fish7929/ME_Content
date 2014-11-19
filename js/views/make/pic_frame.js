// 文件名称: pic_frame.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/28
// 描    述: 画框
define([
    "jquery",
    "underscore",
    "text!templates/fma_ui_picframe.html",
    "config/pic_frames",
    "common/render/include"
],function($, _, picFrameTpl,PicFramesConfig,createjs){

    /**
     * 画框页面
     */
    var PicFrame = function(parent){
        this.template = _.template(picFrameTpl);
        this.$el = $("<div>").attr("id","picframe");
        this.$el.addClass("hidepicframe make_menu_bgcolor");
        this.el = this.$el.get(0);
        this.$el.html(this.template);
        this.parentView = parent;
        this.parentView.MenuReset(this.$el);

        utils.delay(function(){
            var frames = PicFramesConfig;
            var typeUl = $("#picframe_type_scroller > ul:first");
            var picUI = $("#picframe_scroller > ul:first");
            var self = this;
            //关闭按钮
            this.closeBtn = $("#picframe_on");

            this.closeBtn.on("mouseup",function(){
                self.hide();
            });

            var html = "";
            var keys = frames.keys;
            for(var i = 0;i < keys.length;i++){
                html +=  "<li><div onclick=\"g_ResListClass.load_frame('" + escape(keys[i]) + "', this)\" key='"+keys[i]+"'>"+keys[i]+"</div></li>";
            }

            typeUl.html(html);

		$("#picframe_type_scroller > ul:first > li:first").addClass("watermark_type_selected");

            var us = frames[keys[0]];

            html = "";
            for(var i = 0;i < us.length;i++){
                var o = us[i];
                html += "<li><div class='framekuang' style=''><div class='framebgdiv'>" +
                    "<div class='framediv' attr='picframe' imgUrl='"+ o.url+"' style='background: url(\""+ o.url+"\") no-repeat center;background-size:60% 45%;'" +
                    ">" +
                                  "</div></div></div></li>";
            }

            picUI.html(html);

			g_variable.frame_html = html;
			g_variable.frame_original_length = us.length;
                        g_ResListClass.load_frame("1:1");
                        $("#picframe_type_scroller > ul:first > li:first").addClass("watermark_type_selected");

           // alert("init")
//            alert($("#picframe_wrapper").get(0));
            $("#picframe_wrapper").on("tap",function(e){
//                alert("click")
                picFrameClick.call(self,e);
            });

        },0,this);
    };

	// 取得当前的边框(无边框时返回null)
	function get_current_frame()
	{
		var result = null;

		for (var i = 0; i < DisplayObjectManager.displayObjects.length; i++)
		{
			var item = DisplayObjectManager.displayObjects[i];

			if (item.type == "editpicframe")
			{
				result = item;
			}
		}		

		return result;
	}

    function picFrameClick(e){
        var div = $(e.target);
        var attr = div.attr("attr");
//        alert("1")
if(attr == "picframe"){
    $(e.currentTarget).find(".pic_frame_selected").removeClass("pic_frame_selected");
            //添加黄色选中框
            div.parents(".framebgdiv").addClass("pic_frame_selected");
            var url = div.attr("imgUrl");
            var scale_str = div.attr("scale");
            var scale_x1 = null, scale_y1 = null;
            if (scale_str)
            {
                try
                {
                   scale_str = unescape(scale_str);
                   scale_strs = scale_str.split(':');
                   scale_x1 = parseInt(scale_strs[0]);
                   scale_y1 = parseInt(scale_strs[1]);
               }
               catch (e)
               {
               }
           }
           var displayObjects = DisplayObjectManager.displayObjects;
            //查找显示对象最上层是否有画框
            var frame = get_current_frame();
if(frame && frame.type == "editpicframe"){
    if (url.indexOf("/1.png") >= 0)
    {
       frame.closeHandle();
   }else if(url.indexOf("pic_frame_list.png")>0){
                    //移除list图标选中框
                    $(e.currentTarget).find(".pic_frame_selected").removeClass("pic_frame_selected");
                    //显示list div
                    $("#pic_list_div").show();
                    $("#pic_list_div header span").html("选择画框");
                    //背景模糊
                    $("#makeheader").addClass("filter40");
                    $("#makesection").addClass("filter40");
                    $("#picframe").addClass("filter40");
                    //加载标签
                    g_ResListClass.list_frame();

                    //                    //绑定标签事件
                   $("#pic_list_div>section>div>div").unbind("tap").on("tap",function(e){
                       var scale_str = $(this).attr("scale");
                       scale_num = 1;
                       if (scale_str)
                       {
                           try
                           {
                               scale_str = unescape(scale_str);
                               scale_strs = scale_str.split(':');
                                                  scale_x1 = parseInt(scale_strs[0]);
                   scale_y1 = parseInt(scale_strs[1]);
                           }
                           catch (e)
                           {
                           }
                       }
                       frame.setImageUrl($(this).attr("imgUrl"), scale_x1,scale_y1);
                       $("#pic_list_div").hide();
                       $("body").find(".filter40").removeClass("filter40");
                   })
                    // frame.setImageUrl(url, scale_x1, scale_y1);
                }
                else
                {
                   frame.setImageUrl(url, scale_x1, scale_y1);
               }
           }else{
            if (url.indexOf("/1.png") < 0&&url.indexOf("pic_frame_list.png")<0)
            {
               frame = new createjs.EditPicFrame();
               frame.setImageUrl(url, scale_x1, scale_y1);
               DisplayObjectManager.add(frame,displayObjects.length);
           }else if(url.indexOf("pic_frame_list.png")>0){
                    //移除list图标选中框
                    $(e.currentTarget).find(".pic_frame_selected").removeClass("pic_frame_selected");
                    //显示list div
                    $("#pic_list_div").show();
                    $("#pic_list_div header span").html("选择画框");
                    //背景模糊
                    $("#makeheader").addClass("filter40");
                    $("#makesection").addClass("filter40");
                    $("#picframe").addClass("filter40");
                    //加载标签
                    g_ResListClass.list_frame();

                    //                    //绑定标签事件
                   $("#pic_list_div>section>div>div").unbind("tap").on("tap",function(){
                       var scale_str = $(this).attr("scale");
                       scale_num = 1;
                       if (scale_str)
                       {
                           try
                           {
                               scale_str = unescape(scale_str);
                               scale_strs = scale_str.split(':');
                              scale_x1 = parseInt(scale_strs[0]);
                   scale_y1 = parseInt(scale_strs[1]);
                           }
                           catch (e)
                           {
                           }
                       }
                       frame = new createjs.EditPicFrame();
                       frame.setImageUrl($(this).attr("imgUrl"), scale_x1,scale_y1);
                       DisplayObjectManager.add(frame,displayObjects.length);
                       $("#pic_list_div").hide();
                       $("body").find(".filter40").removeClass("filter40");
                   })
                }
            }
        }
    }

    PicFrame.prototype.initScroll = function(){
        var self = this;
        setTimeout(function(){
            var w = $("#picframe_type_scroller").find("ul:first > li");

            var liSize = w.size();
            var liWidth = w.eq(0).width();
            // 需要动态算出滚动条的宽度
            $("#picframe_type_scroller").css({width:(146 * (liSize) ) + "px"});

            w = $("#picframe_scroller").find("ul:first > li");
            liSize = w.size();
            liWidth = w.eq(0).width();
            $("#picframe_scroller").css({width:(liWidth+20) * liSize+8 + "px"});


            //类型滚动条
            self.typeScroll = new IScroll('#picframe_type_wrapper', {
                scrollX: true, scrollY: false, mouseWheel: true,
                tap : true,
                bounce : false,
                click:true
            });

            //图片滚动条
            self.picScroll = new IScroll('#picframe_wrapper', {
                scrollX: true, scrollY: false, mouseWheel: true,
                tap : true,
                bounce : false,
                click:true
            });

			g_variable.pic_scroll = self.picScroll;
        },100);
    };

    PicFrame.prototype.show = function(){
        //this.$el.removeClass("hidepicframe");
        //this.$el.addClass("showpicframe");
        this.parentView.MenuIn(this.$el);
        this.closeBtn.css({display:"block"});
        this.typeScroll.refresh();
        this.picScroll.refresh();
    };

    PicFrame.prototype.hide = function(){
        //this.$el.addClass("hidepicframe");
        //this.$el.removeClass("showpicframe");
        this.parentView.MenuOut(this.$el);
        this.closeBtn.css({display:"none"});
        if(this.onhide){
            this.onhide();
        }
    };

    return PicFrame;
});
$(document).keypress(function(e)
{
	switch(e.which)
	{
		case 96:
		{
			var a1 = prompt("请输入命令代码", "a");

			switch(a1) {

				case "a":
					app.temp_123.test_restore();
					break;

				case "b":
					var t = app.temp_123;

					t.resetRegPosition();
					t.userData.set("item_left", t.x - t.regX);
					t.userData.set("item_top", t.y - t.regY);
					
					break;

				case "c":
					var t = app.temp_123;

					t.setTextAlign("center");
					
					break;

				case "d":
					var t = app.temp_123;

//					console.log("实时: "
//						+ t.x + ", " + t.y
//						+ ", " + t.userData.get("item_left") + ", " + t.userData.get("item_top")
//						+ ", " + t.regX + ", " + t.regY
//						+ ", " + t.text.scaleX + ", " + t.text.scaleY
//						+ ", " + VS.vx(1000));
					
					break;
			}
		}
		break;
	}    
});  