///**
// * Created by Farness on 14-9-25.
// */

// 印章列表类
function SignatureListClass()
{
	// 加载签章文字元素信息
	function load_signature_infor(signature_list, current_index)
	{
        
	}

	// 加载签章列表的信息
	function load_signature_list_infor(signature_list)
	{
		app.watermark_list = signature_list;
		g_variable.signature_list_html_code = "";

		for(i=0;i<signature_list.length;i++) {

            var tplobj = signature_list[i];
            var pic_url = fmacapi.tpl_thumb_img_url(tplobj);

            g_variable.signature_list_html_code += "<li><div class='watermarkbg' ><div attr='watermark' imgUrl='" + pic_url + "' params=\"" + signature_list[i].get("tpl_id") + "\" " +
                "style='background-image:url(\"" + pic_url + "\") '></div></div></li>";
        }

        disp_signature_list(signature_list.length);
	}

	// 加载签章列表
	SignatureListClass.prototype.load_signature_list = function()
	{
		fmacloud.query_tpl_works(
			2, "all", null,true,0,1000,
			on_query_signature,
			function(err){
				alert("签章查询失败："+err);
			}
		);
	}

	// 获取得返回结果
	function on_query_signature(signature_list)
	{
		try
		{
			load_signature_list_infor(signature_list);
		}
		catch (e)
		{
		}
	}

	// 将横排文字转换为竖排(通过增加换行符的方式)
	SignatureListClass.prototype.to_vertical = function(text)
	{
		var result = "";

		var text_length = text.length;

		for	(var i = 0; i < text_length; i++)
		{
			var char_i = text.subString(char_i, 1);

			if (i != 0)
			{
				result += "\r\n";
			}

			result += char_i;
		}

		return result;
	}

	// 将竖排文字转换为横排(通过去除换行符的方式)
	SignatureListClass.prototype.to_horizontal = function(text)
	{
		var result = "";

		result = text.replace(/\\r\\n/g, "");

		return result;
	}
	//load img for div select
	SignatureListClass.prototype.list_watermark = function(){
		$("#picframe_type_scroller").removeClass("watermark_type_selected");
		$("#pic_list_div").show();
		var html = "";
		for(var i in app.watermark_list){
			           var tplobj = app.watermark_list[i];
            				var pic_url = fmacapi.tpl_thumb_img_url(tplobj);
			html +=  "<div ><div attr='watermark' imgUrl='" + pic_url + "' params=\"" + app.watermark_list[i].get("tpl_id") + "\" " +
                "style='background:url(\"" + pic_url + "\")  no-repeat center;background-size: 90px 90px;'></div></div>";
		}
		$("#pic_list_div>section").html(html);
	}

	// 显示签章列表
	function disp_signature_list(item_length)
	{
		var html_code = g_variable.signature_list_html_code;

		var old_code = g_variable.signature_html;

		$("#watermark_scroller > ul:first").html(old_code + html_code);

		var w =  $("#watermark_scroller > ul:first").find("li:first");

		var liWidth = w.width();

		$("#watermark_scroller").css({width:(liWidth+20) * (g_variable.signature_original_length + item_length)+ "px"});

		setTimeout(function(){
			g_variable.pic_scroll.refresh();
			},100)
	}
}

var g_SignatureListClass = new SignatureListClass();

g_SignatureListClass.load_signature_list();