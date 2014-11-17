function FontListClass()
{
	var g_font_list = new Array(
		"壕粗",
		"启繁",
		"劲黑",
		"篆娃",
		"白棋",
		"立黑",
		"菱心",
		"双线",
		"丫丫",
		"小丸子",
		"锐线",
		"中山行书",
		"毛泽东字体",

		"Age",
		"ALBURA",
		"Amatic-Bold",
		"ANNIHILATE",
		"Archive",
		"Bevan",
		"Billion Stars",
		"Blackout-2am",
		"Brainflower",
		"Canter Light",
		"Capture it",
		"CHI-TOWN",
		"Chunkfive",
		"clutchee",
		"COLLEGE",
		"COLLEGEC",
		"COLLEGES",
		"Comfortaa_Bold",
		"Comfortaa_Regular",
		"CookieMonster",
		"Cubop",
		"Dekar Light",
		"Dekar",
		"Diner-Fatt",
		"Diner-Obese",
		"Diner-Regular",
		"Diner-Skinny",
		"Dubtronic-Inline",
		"Dubtronic-Solid",
		"Feathergraphy",
		"FONT",
		"GEIST_RND",
		"GrandHotel-Regular",
		"hauptbahnhof",
		"Hero Light",
		"Hipstelvetica Light",
		"illuminate",
		"Intro Inline",
		"Intro",
		"JennaSue",
		"JUICE_Bold",
		"JUICE_Light",
		"JUICE_Regular",
		"Kabel Light",
		"Kabel",
		"Kankin",
		"KOMIKAX_",
		"Kong-Regular",
		"Langdon",
		"League Script",
		"LeagueGothic-CondensedItalic",
		"LeagueGothic-CondensedRegular",
		"LeagueGothic-Italic",
		"LeagueGothic-Regular",
		"Lobster_1.3",
		"LOT",
		"Lovelo Black",
		"Lovelo Line Bold",
		"Lovelo Line Light",
		"LOVERBOY",
		"mastodonte",
		"MavenProLight-300",
		"Metropolis",
		"Molot",
		"Monoton-Regular",
		"Morden",
		"MWHeart",
		"Myra 4F Caps",
		"neon2",
		"Null Free",
		"ostrich-black",
		"ostrich-bold",
		"ostrich-dashed",
		"ostrich-light",
		"ostrich-regular",
		"ostrich-rounded",
		"Outstanding",
		"OutStanding",
		"OXYGENE1",
		"Pacifico",
		"PaperHearts",
		"pincoyablack",
		"Quicksand",
		"Raleway Thin",
		"Raleway",
		"RalewayDots",
		"Raleway-Heavy",
		"Raleway-Light",
		"RBNo2Light_a",
		"Retro Fitted",
		"Rex Bold",
		"Rex Inline",
		"Rex",
		"ROMANTIC",
		"ROSECUBE.TTF",
		"Sanotra Bold",
		"Sanotra",
		"Silverfake",
		"Simply Glamorous",
		"Skram",
		"Snickles",
		"Sniglet",
		"Stiff Staff",
		"TETRA",
		"Track",
		"TrueLove Bold",
		"TrueLove",
		"urban_brigade",
		"VAL Stencil",
		"VAL",
		"Voga-Medium",
		"Weston Free",
		"White Rabbit");

	// 取得字体列表的html代码
	function get_html_font_list(font_list)
	{
		var result = "";

		for (var i = 0; i < font_list.length; i++)
		{
			result += "<li><div><div onclick=\"g_FontListClass.apply_font('" + font_list[i] + "',this)\" style=\"font-family: " + font_list[i] + ";\">" + font_list[i] + "</div></div></li>";
		}

		return result;
	}

	// 应用字体
	FontListClass.prototype.apply_font = function(font_family,div)
	{
		g_variable.current_edit_font_family = font_family;
		$("#input_text2").css({"font-family": font_family});
		$(div).parents("ul").find(".text_type_selected").removeClass("text_type_selected");
		$(div).parents("li").addClass("text_type_selected")
	}

	// 显示字体列表
	FontListClass.prototype.disp_font_list = function()
	{
		var html_code = get_html_font_list(g_font_list);

		$("#list_font").html(html_code);
	}

	// 显示当前字体
	FontListClass.prototype.goto_font = function(font_family)
	{
		$("#list_font").children().each(function(index, element)
		{
			element = $(element);

			var font_family_item = element.children(0).children(0).html();

			if (font_family_item == font_family)
			{
				//app.makeView.fontUI.fontScroll.scrollTo(0, 0 - 80 * element.index());
				if (!app.makeView.fontUI.fontScroll)
				{
					alert("控件不存在!");
				}
				app.makeView.fontUI.fontScroll.scrollTo(0, -200);
			}
		})
	}
}

var g_FontListClass = new FontListClass();

g_FontListClass.disp_font_list();