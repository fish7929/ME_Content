// 文件名称: draw_frame.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/28
// 描    述: 水印
define([
    "jquery",
    "underscore",
    "text!templates/fma_ui_watermark.html",
    "config/watermark_config",
    "common/render/include",
    "config/font_color"
    ],function($, _, waterMarkTpl,WaterMarkConfig,C,Colors){

    /**
     * 水印页面
     */
     var WaterMark = function(parent){
        this.template = _.template(waterMarkTpl);
        this.$el = $("<div>").attr("id","watermark");
        this.$el.addClass("hidewatermark make_menu_bgcolor");
        this.el = this.$el.get(0);

        this.waterMarkConfig = WaterMarkConfig;
        this.picScrollDiv = null;

        this.currentSelectTab = null;
        this.$el.html(this.template);
        this.parentView = parent;

        this.picUL = null;

        this.key = "signature";

        utils.delay(function(){
                    //初始化input者造成长度
                    var inputPercent = $("#watermark_alpha").val()/($("#watermark_alpha").prop("max")-$("#watermark_alpha").prop("min"));
                    $("#watermarkMask").width(($("#watermark_alpha").offsetParent().width())*inputPercent*0.9-56*inputPercent);
            //加载颜色
            var ul = this.$el.find("#color_scroller > ul:first");
            var html = utils.createMaskColorLi(Colors);
            this.closeBtn = $("#watermarkedit_on");

            ul.html(html);

            var config = WaterMarkConfig;

            var typeUl = $("#watermark_type_scroller > ul:first");
            var picUI = this.picUL = $("#watermark_scroller > ul:first");
            this.picScrollDiv = $("#watermark_scroller");
            this.closeBtn = $("#watermark_on");


            var html = "";
            var keys = config.keys;
            for(var i = 0;i < keys.length;i++){
                html += "<li><div key='"+keys[i]+"'>"+config.labels[i]+"</div></li>";
            }
            typeUl.html(html);

            this.currentSelectTab = typeUl.find("li:first");
            this.currentSelectTab.addClass("watermark_type_selected");

            changeWaterMark.call(this,keys[0]);

            var self = this;

            this.closeBtn.on("click",function(){
                self.hide();
            });

            //类型点击事件
            typeUl.on("click",function(e){
                onTypeTabClick.call(self,e);
            });

            picUI.on("click",function(e){
                onPicClick.call(self,e);
            });

            //透明度input
            $("#watermark_alpha").on("input",function(e){
                changeAlpha.call(self,e.target.value);
            });

            //颜色改变事件
            $("#watermark_color").on("click",function(e){
                onWaterColorClick.call(self,e);
            });

        },0,this);
};

    /**
     * 标签选中
     * @param e
     */
     function onTypeTabClick(e){
        var div = $(e.target);
        var key = div.attr("key");
        if(key){
            if(this.currentSelectTab){
                this.currentSelectTab.removeClass("watermark_type_selected");
                this.currentSelectTab.addClass("watermark_type_noselected");
            }
            this.currentSelectTab = div.parent("li");
            this.currentSelectTab.addClass("watermark_type_selected");
            this.currentSelectTab.removeClass("watermark_type_noselected");

            changeWaterMark.call(this,key);
        }
    }

/**
 * 水印选中
 * @param e
 */
function onPicClick(e){
	var self = this;
	var div = $(e.target);
	var attr = div.attr("attr");
	if(attr == "watermark")
	{
		var imgUrl = div.attr("imgUrl");
		var params = div.attr("params");
		var displayObjects = DisplayObjectManager.displayObjects;
		var obj;
		var watermark_key = this.key;
		var type2 = undefined;

		if (params) {
			type2 = "signature";
        }

        if(div.attr("imgurl").indexOf("pic_frame_list.png")>-1)
		{
			//显示list div
			$("#pic_list_div").show();
			//var title = this.key==="signature"?"签章":this.key==="stamp"?"贴纸":'';

			//思路从watermark_config文件中读取标签名称，根据keys数组获取this.key对应的index
			//从WaterMarkConfig.labels中根据得到的index获取对应的标签
			var title = "";
			$.each(WaterMarkConfig.keys, function(key, val){
				if(watermark_key == val){
					 title = WaterMarkConfig.labels[key];
				}
			});
			$("#pic_list_div header span").html("选择"+title);
			$("#makeheader").addClass("filter40");
			$("#makesection").addClass("filter40");
			$("#watermark").addClass("filter40");
			//this.key==="signature"?g_SignatureListClass.list_watermark():this.key==="stamp"?g_ResListClass.list_watermark():'';

			switch(this.key){
				case "signature":
					g_SignatureListClass.list_watermark();
					break;
				case "stamp" :
					g_ResListClass.list_watermark();
					break;
				case "shape" :
					g_ResListClass.list_watermark();
					break;
				default: 
					'';
			}
                    //this.key==="signature"?g_SignatureListClass.list_watermark():this.key==="stamp"?g_ResListClass.list_watermark():this.key==="shape"?g_ResListClass.list_watermark():'';
			$("#pic_list_div>section>div>div").unbind("click").on("click",
				function(e)
				{
					params = $(this).attr("params");
					fmacapi.tpl_get_data(params,
						function(data)
						{
							var pages = data.get("pages");
							var items = pages[0].get("item_object");
							var item = items[0];

							var url = fmacapi.tpl_res_img_url(params,
								item.get("item_cntype"),item.get("item_val"));

							//obj = DisplayObjectManager.currentDisplayObject;

							if (obj && obj.type == "edit_watermark") {
								obj.setImageUrl(url);
								obj.set_params(params);
							} else if(self.key === "signature") {//签章
								var is_selected_form = app.makeView.opObject && app.makeView.opObject.type == "editwatermark";
					
								var is_not_signature = false;

								if (is_selected_form)
								{
									is_not_signature = !app.makeView.opObject.type || app.makeView.opObject.type2 != "signature";
								}
								
								var m = new createjs.EiditWaterMark(type2);

								var text_rotation = 0;

								if (is_selected_form)
								{
									if (!is_not_signature)
									{
										m.x = app.makeView.opObject.x;
										m.y = app.makeView.opObject.y;
										m.userData.set("item_left", VS.rvx(m.x));
										m.userData.set("item_top", VS.rvy(m.y));
										
										m.rotation = app.makeView.opObject.rotation;
										m.userData.set("rotate_angle",m.rotation);
										text_rotation = m.rotation;
											
										m.userData.set("x_scale", app.makeView.opObject.userData.get("x_scale"));
										m.userData.set("y_scale", app.makeView.opObject.userData.get("y_scale"));
									}
								}

								m.setImageUrl(url);
								m.set_params(params, text_rotation);

								DisplayObjectManager.add(m);
								
								if (is_selected_form)
								{
									if (!is_not_signature)
									{
										app.makeView.opObject.closeHandle();
									}
								}

								setTimeout(function(){app.makeView.clickHandle(null, m);}, 100);
							}
							else{//水印
								//obj = displayObjects[displayObjects.length - 1];
								var is_selected_form = app.makeView.opObject && app.makeView.opObject.type == "editwatermark";

								var is_not_signature = false;

								if (is_selected_form)
								{
									is_not_signature = !app.makeView.opObject.type || app.makeView.opObject.type2 != "signature";
								}

								var m = new createjs.EiditWaterMark(type2);

								if (is_selected_form)
								{
									if (is_not_signature)
									{
										m.x = app.makeView.opObject.x;
										m.y = app.makeView.opObject.y;
										m.userData.set("item_left", VS.rvx(m.x));
										m.userData.set("item_top", VS.rvy(m.y));
										
										m.rotation = app.makeView.opObject.rotation;
										m.userData.set("rotate_angle",m.rotation);
											
										m.userData.set("x_scale", app.makeView.opObject.userData.get("x_scale"));
										m.userData.set("y_scale", app.makeView.opObject.userData.get("y_scale"));
									}
								}

								m.setImageUrl($(e.currentTarget).children().attr("imgurl"));

								DisplayObjectManager.add(m);

								if (is_selected_form)
								{
									if (is_not_signature)
									{
										app.makeView.opObject.closeHandle();
									}
								}

								setTimeout(function(){app.makeView.clickHandle(null, m);}, 100);
							}
						},
						function(error) {}
					);

					//点击后隐藏
					$("#pic_list_div").hide();
					$("body").find(".filter40").removeClass("filter40");
				}
			)		// $("#pic_list_div>section>div>div").unbind("click").on("click",function(e) 结束
		}	// if(div.attr("imgurl").indexOf("pic_frame_list.png")>-1) 结束

		//签章
		if (type2 == "signature" && imgUrl.indexOf("pic_frame_list.png") == -1)
		{
			fmacapi.tpl_get_data(params,
				function(data)
				{
					var pages = data.get("pages");
					var items = pages[0].get("item_object");
					var item = items[0];

					var url = fmacapi.tpl_res_img_url(params,
						item.get("item_cntype"),item.get("item_val"));

					//obj = DisplayObjectManager.currentDisplayObject;

					if (obj && obj.type == "edit_watermark")
					{
						obj.setImageUrl(url);
						obj.set_params(params);
					}
					else
					{
					/* 大菜 添加或替换签章 */
						var is_selected_form = app.makeView.opObject && app.makeView.opObject.type == "editwatermark";
					
						var is_not_signature = false;

						if (is_selected_form)
						{
							is_not_signature = !app.makeView.opObject.type || app.makeView.opObject.type2 != "signature";
						}
						
						var m = new createjs.EiditWaterMark(type2);

						var text_rotation = 0;

						if (is_selected_form)
						{
							if (!is_not_signature)
							{
								m.x = app.makeView.opObject.x;
								m.y = app.makeView.opObject.y;
								m.userData.set("item_left", VS.rvx(m.x));
								m.userData.set("item_top", VS.rvy(m.y));
								
								m.rotation = app.makeView.opObject.rotation;
								m.userData.set("rotate_angle",m.rotation);
								text_rotation = m.rotation;
									
								m.userData.set("x_scale", app.makeView.opObject.userData.get("x_scale"));
								m.userData.set("y_scale", app.makeView.opObject.userData.get("y_scale"));
							}
						}

						m.setImageUrl(url);
						m.set_params(params, text_rotation);

						DisplayObjectManager.add(m);
						
						if (is_selected_form)
						{
							if (!is_not_signature)
							{
								app.makeView.opObject.closeHandle();
							}
						}

						setTimeout(function(){app.makeView.clickHandle(null, m);}, 100);
						/*end*/
					}
				},
				function(error) {}
			);
		}
		//水印
		else if (imgUrl.indexOf("pic_frame_list.png") == -1)
		{
			if (obj && obj.type == "edit_watermark")
			{
				obj.setImageUrl(imgUrl);
			}
			else
			{
				//                obj = displayObjects[displayObjects.length - 1];
				/* 大菜 添加或替换水印 */
				var is_selected_form = app.makeView.opObject && app.makeView.opObject.type == "editwatermark";

				var is_not_signature = false;

				if (is_selected_form)
				{
					is_not_signature = !app.makeView.opObject.type || app.makeView.opObject.type2 != "signature";
				}

				var m = new createjs.EiditWaterMark(type2);

				if (is_selected_form)
				{
					if (is_not_signature)
					{
						m.x = app.makeView.opObject.x;
						m.y = app.makeView.opObject.y;
						m.userData.set("item_left", VS.rvx(m.x));
						m.userData.set("item_top", VS.rvy(m.y));
						
						m.rotation = app.makeView.opObject.rotation;
						m.userData.set("rotate_angle",m.rotation);
							
						m.userData.set("x_scale", app.makeView.opObject.userData.get("x_scale"));
						m.userData.set("y_scale", app.makeView.opObject.userData.get("y_scale"));
					}
				}

				m.setImageUrl(imgUrl);

				DisplayObjectManager.add(m);

				if (is_selected_form)
				{
					if (is_not_signature)
					{
						app.makeView.opObject.closeHandle();
					}
				}

				setTimeout(function(){app.makeView.clickHandle(null, m);}, 100);
				/* end */

				//                if(obj.type == "editpicframe"){
				//                    this.parentView.addDisplayObject(m,displayObjects.length - 1);
				//                }else{
				//                    this.parentView.addDisplayObject(m,displayObjects.length);
				//                }
			}
        }

		div.parents("ul").find(".active").removeClass("active");
		div.parent().addClass("active");
		$("#watermark_opacity").css("visibility","visible");
		$("#watermark_color").css("visibility","visible");
	}
}

    //水印类型改变
    function changeWaterMark(key){
        this.key = key;
        var us = this.waterMarkConfig[key];
        var html = "";

        for(var i = 0;i < us.length;i++){
            var o = us[i];
            html += "<li><div class='watermarkbg'><div attr='watermark' imgUrl='"+ o.url+"' " +
            "style='background-image:url(\""+ o.url +"\") '></div></div></li>";
        }

        var w =  this.picUL.find("li:first");
        var liWidth = w.width();

        this.picUL.html(html);

        if (key == "signature")
        {
         g_variable.signature_html = html;
         g_variable.signature_original_length = us.length;

         g_SignatureListClass.load_signature_list();
     }
     else if (key == "stamp")
     {
         g_variable.watermark_html = html;
         g_variable.watermark_original_length = us.length;

         g_ResListClass.load_watermark_list();
     }else if (key == "shape"){ //添加形状菜单选中的触发事件
         g_variable.watermark_html = html;
         g_variable.watermark_original_length = us.length;

         g_ResListClass.load_shape_list();
     }

     // this.picScrollDiv.css({width:(liWidth * (us.length)) + "px"});

    //  if(this.picScroll){
    //     var self = this;
    //     setTimeout(function(){
    //         self.picScroll.refresh();
    //     },0);
    // }

}

    //透明度改变
    function changeAlpha(value){
        var p = this.parentView;
        var obj = p.opObject;
        if(obj && obj.type == "editwatermark"){
            obj.changeAlpha(value);
        }
        var inputPercent = $("#watermark_alpha").val()/($("#watermark_alpha").prop("max")-$("#watermark_alpha").prop("min"));
        $("#watermarkMask").width(($("#watermark_alpha").offsetParent().width())*inputPercent*0.9-56*inputPercent);
    };

    //颜色改变
    function onWaterColorClick(e){
        var div = $(e.target);
        var color = div.attr("color");
        //console.log(color)
        var p = this.parentView;
        var obj = p.opObject;
        if(obj && obj.type == "editwatermark"){
            obj.changeColor(color);
        }
        if(color){
            div.parents("ul").find(".colorli_selected").removeClass("colorli_selected");
            div.addClass("colorli_selected")
        }
    }

    WaterMark.prototype.initScroll = function(){
        var self = this;
        setTimeout(function(){
            //类型滚动条
            self.typeScroll = new IScroll('#watermark_type_wrapper', {
                scrollX: true, scrollY: false, mouseWheel: true,
                tap : true,
                bounce : false,
                click : true
            });

            //图片滚动条
            self.picScroll = new IScroll('#watermark_wrapper', {
                scrollX: true, scrollY: false, mouseWheel: true,
                tap : true,
                bounce : false,
                click : true
            });
            g_variable.pic_scroll = self.picScroll;

            $("#color_scroller").width(($("#color_scroller").find("li:first").width()+12.2)*$("#color_scroller").find("li").size());
            //颜色滚动条
            self.colorScroll = new IScroll('#watermark_color', {
                scrollX: true, scrollY: false, mouseWheel: true,
                tap : true,
                bounce : false,
                click : true
            });

            g_variable.color_scroll = self.colorScroll;
        },0);
};

// 初始化透明度滚动条位置
WaterMark.prototype.init_alpha = function(value){
	$("#watermark_alpha").get(0).value = value;
    var inputPercent = $("#watermark_alpha").val()/($("#watermark_alpha").prop("max")-$("#watermark_alpha").prop("min"));
    $("#watermarkMask").width(($("#watermark_alpha").offsetParent().width())*inputPercent*0.9-56*inputPercent);
};

WaterMark.prototype.show = function(){
    this.$el.removeClass("hidewatermark");
    this.$el.addClass("showwatermark");
    this.closeBtn.css({display:"block"});
    this.typeScroll.refresh();
    this.picScroll.refresh();
    this.colorScroll.refresh();

    var obj = app.makeView.opObject;
    if (obj && obj.type == "editwatermark")
    {
      this.init_alpha(parseInt(obj.userData.get("item_opacity")) / 100);
  }
};

WaterMark.prototype.hide = function(){
    this.$el.removeClass("showwatermark");
    this.$el.addClass("hidewatermark");
    this.closeBtn.css({display:"none"});
    if(this.onhide){
        this.onhide();
    }
};

return WaterMark;
});
