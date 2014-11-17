
/**
 * Created by Farness on 14-9-24.
 */
 function ResListClass()
 {
	// 取得html代码_边框
	function get_html_frame(res_list)
	{
		app.make_pic_list = res_list;

		var result = "";

		for (var i = 0; i < res_list.length; i++) {

			var res_text = res_list[i].get("content");

			var pic_url = "http://me.gli.cn/filestore/res/" + res_list[i].get("item_val");

			var scale = escape(res_list[i].get("scale"));

			result += "<li><div class='framekuang' style=''><div class='framebgdiv'>" +
			"<div class='framediv' attr='picframe' scale='" + scale + "' imgUrl='"+pic_url+"' style='background: url(\""+ pic_url+"\") no-repeat center;background-size:50px 50px;'" +
			">" +
			"</div></div></div></li>";
		}

		return result;
	}

	// 取得html代码_水印
	function get_html_watermark(res_list)
	{
		var result = "";

		for (var i = 0; i < res_list.length; i++) {

			var res_text = res_list[i].get("content");

			var pic_url = "http://me.gli.cn/filestore/res/" + res_list[i].get("item_val");

			var pic_html = "<img src=\"" + pic_url + "\" />";

			result += "<li><div class='watermarkbg'><div attr='watermark' imgUrl='"+ pic_url+"' " +
			"style='background-image:url(\""+ pic_url +"\") '></div></div></li>";
		}

		return result;
	}

	// 取得返回结果_边框
	function on_query_frame(res_list)
	{
		try
		{
			var html_code = get_html_frame(res_list);

			var old_code = g_variable.frame_html;

			$("#picframe_scroller > ul:first").html(old_code + html_code);

			var w =  $("#picframe_scroller > ul:first").find("li:first");

			var liWidth = w.width();

			$("#picframe_scroller").css({width:(liWidth+20) * (g_variable.frame_original_length + res_list.length)+8+ "px"});

			g_variable.pic_scroll.refresh();
		}
		catch (e)
		{
		}
	}

	// 取得返回结果_水印
	function on_query_watermark(res_list)
	{
		app.watermark_list = res_list;
		try
		{
			var html_code = get_html_watermark(res_list);

			var old_code = g_variable.watermark_html;

			$("#watermark_scroller > ul:first").html(old_code + html_code);

			var w =  $("#watermark_scroller > ul:first").find("li:first");

			var liWidth = w.width();

			$("#watermark_scroller").css({width:(liWidth+20) * (g_variable.watermark_original_length + res_list.length)+ "px"});
			setTimeout(function(){
			g_variable.pic_scroll.refresh();
			$("#watermark_scroller").scrollLeft(0);
			},100)
		}
		catch (e)
		{
		}
	}

	// 加载边框
	ResListClass.prototype.load_frame = function(scale, source)
	{
		$("#picframe_type_scroller > ul:first > li.watermark_type_selected").removeClass("watermark_type_selected");

		if (source)
		{
			$(source).parent().addClass("watermark_type_selected");
		}

		scale = unescape(scale);
		fmacloud.query_res(
			"resobj", "type_and_scale:2:" + escape(scale), null,true,0,1000,
			on_query_frame,
			function(err){
				alert("边框查询失败："+err);
			}
			);
	}

	//列出边框
	ResListClass.prototype.list_frame = function(){
		$("#picframe_type_scroller").removeClass("watermark_type_selected");
		$("#pic_list_div").show();
		var html = "";
		for(var i in app.make_pic_list){
			html += "<div><div attr='picframe' scale='" + escape(app.make_pic_list[i].get("scale")) + "' imgUrl='http://me.gli.cn/filestore/res/"+app.make_pic_list[i].get('item_val')+"' style='background:url(http://me.gli.cn/filestore/res/"+app.make_pic_list[i].get('item_val')+") no-repeat center;background-size:70px;'></div></div>"
		}
		$("#pic_list_div>section").html(html);
	}

	// 加载印花
	ResListClass.prototype.load_watermark_list = function()
	{
		fmacloud.query_res(
			"resobj", "type:1", null,true,0,1000,
			on_query_watermark,
			function(err){
				alert("印花查询失败："+err);
			}
			);
	}

	// 加载形状
	ResListClass.prototype.load_shape_list = function()
	{
		fmacloud.query_res(
			"resobj", "type:3", null,true,0,1000,
			on_query_watermark,
			function(err){
				alert("形状查询失败："+err);
			}
			);
	}

	ResListClass.prototype.list_watermark = function(){
		$("#picframe_type_scroller").removeClass("watermark_type_selected");
		$("#pic_list_div").show();
		var html = "";
		for(var i in app.watermark_list){
			var pic_url = "http://me.gli.cn/filestore/res/" + app.watermark_list[i].get("item_val");

			var pic_html = "<img src=\"" + pic_url + "\" />";
			html +=  "<div><div><div attr='watermark' imgUrl='"+ pic_url+"' " +
				"style='background:url(\""+ pic_url +"\") no-repeat center;background-size: 90px 90px; '></div></div></div>";
		}
		$("#pic_list_div>section").html(html);
	}
}

var g_ResListClass = new ResListClass();
