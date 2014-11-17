/**
 * Created by Farness on 14-9-24.
 */

// 语料列表类
function CorpusListClass()
{
	// 取得语料的分类列表
	function get_categories_list_corpus()
	{
		var result = new Array("逗逼", "爱情", "安静", "伤感", "励志");

		return result;
	}

	// 取得html代码_语料
	function get_html_corpus(category_list)
	{
		var result = "";

		for (var i = 0; i < category_list.length; i++)
		{
			var corpus_text = category_list[i].get("content");

			result += "<li><div><div style=\"white-space:nowrap;\" onclick=\"g_CorpusListClass.apply_corpus('" + escape(corpus_text) + "',this)\">" + corpus_text + "</div></div></li>";
		}

		return result;
	}

	// 取得html代码_分类列表
	function get_html_corpus_categories(category_list)
	{
		var result = "";

		for (var i = 0; i < category_list.length; i++)
		{
			var selected_code = "";

			if (i == 0)
			{
				selected_code = " class=\"text_type_selected\"";
			}

			result += "<li><div" + selected_code + " onclick=\"g_CorpusListClass.load_corpus('" + category_list[i] + "', this)\">" + category_list[i] + "</div></li>";
		}

		return result;
	}

	// 应用语料
	CorpusListClass.prototype.apply_corpus = function(corpus_text,div)
	{
		$("#input_text2").val(unescape(corpus_text));
		$(div).parents("ul").find("li.text_type_selected").removeClass("text_type_selected");
		$(div).parents("li").addClass("text_type_selected");
	}

	// 加载语料
	CorpusListClass.prototype.load_corpus = function(category, div_obj)
	{
		if (div_obj)
		{
			$(div_obj).parent().parent().find("li:eq(" + g_variable.corpus_catetory_selected_index + ")").find("div:first").attr("class", "");

			div_obj.className = "text_type_selected";

			g_variable.corpus_catetory_selected_index = $(div_obj).parent().index();
		}

		fmacloud.query_corpus(
			"corpus_obj","label:" + category, null,true,0,1000,
			on_query_corpus,
			function(err){
				alert("查询失败："+err);
			}
		);
	}

	// 获取得返回结果
	function on_query_corpus(corpus_list)
	{
		try
		{
			var html_code = get_html_corpus(corpus_list);

			$("#list2").html(html_code);
		}
		catch (e)
		{
		}
	}

	// 显示语料分类列表
	CorpusListClass.prototype.disp_categories_corpus = function()
	{
		var category_list = get_categories_list_corpus();

		var html_code = get_html_corpus_categories(category_list);

		$("#list1").html(html_code);

		g_variable.corpus_catetory_selected_index = 0;

		if (category_list.length >= 1)
		{
			this.load_corpus(category_list[0]);
		}
	}
}

var g_CorpusListClass = new CorpusListClass();

g_CorpusListClass.disp_categories_corpus();