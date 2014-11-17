// 文件名称: text_input_ui.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/04
// 描    述: 文字输入界面
define([
    "jquery",
    "underscore",
    "text!templates/text_ui.html"
],function($, _, textInputTpl){

    /**
     * 文本输入界面
     */
    var TextInputUI = function(parent){
        this.template = _.template(textInputTpl);
        this.$el = $("<div>").attr("id","textinput");
        this.$el.addClass("hidetextinput");
        this.el = this.$el.get(0);
        this.inputtab = null;
        this.inputcontent = null;
        this.$el.html(this.template);
        
        this.imHeight = null;
        this.parentView = parent;

        //文本类型滚动条
        this.textTypeScroll = null;
        //文本滚动条
        this.textScroll = null;

        //关闭按钮
        this.closeBn = null;

        this.textNavUl = null;

        this.currentTextInputTypeDiv = null;

		// 当前编辑的EditText控件
		this.currentTextCtrl = null;

        var self = this;
        setTimeout(function(){
            self.inputtab = $("#inputtab");
            self.inputcontent = $("#inputcontent");
            self.closeBn = $("#close_text_ui");
            self.closeBn.on("tap",function(){
                self.okHandle();
            });

            self.textNavUl = $("#text_nav_ul");
            self.textNavUl.on("click",function(e){
                self.onNavUlClick(e);
            });

            self.textArae = $("#input_text2");

        //阻止冒泡
            $("#input_text2").on("touchmove",function(e){
                e.stopPropagation();
            }).height(document.body.scrollHeight-520)

        },0);

        $("#list_font").hide();
        
        window.topEvent.bind("windowresize",function(o,data){
        	self.resize(data);
        });
    };

	// 选中当前字体
	TextInputUI.prototype.goto_font = function(font_family)
	{
		if (!font_family)
		{
			if (this.currentTextCtrl)
			{
				font_family = this.currentTextCtrl.userData.get("font_family");
			}
			else
			{
				return;
			}
		}

		var self = this;

		$("#list_font").children().each(function(index, element)
		{
			element = $(element);

			var font_family_item = element.children(0).children(0).html();

			if (font_family_item == font_family)
			{
				self.textScroll.scrollTo(0, 0 - 80 * element.index());
				element.addClass("text_type_selected");
			}
		})
	}

    TextInputUI.prototype.onNavUlClick = function(e){
        var div = $(e.target);
        var attr = div.attr("attr");

		if (!this.currentTextInputTypeDiv)
		{
			this.currentTextInputTypeDiv = $("#text_nav_ul > li:first > div:first");
		}

		if (this.currentTextInputTypeDiv && div.attr("attr") == this.currentTextInputTypeDiv.attr("attr"))
		{
			return;
		}

       // console.log(attr)
        if(attr == "text_input"){
            if(this.currentTextInputTypeDiv){
                this.currentTextInputTypeDiv.removeClass("zikuselected");
                this.currentTextInputTypeDiv.addClass("zikunoselected");
            }
            div.removeClass("zitinoselected");
            div.addClass("zitiselected");
            //$("#input_text2").blur();

            this.currentTextInputTypeDiv = div;
			$("#text_type_wrapper").hide();
			$("#list_font").show();
			$("#list2").hide();
			$("#text_wrapper").css({width: 100+"%"});
			this.textScroll.refresh();
			this.goto_font("Arial");
        }else if(attr == "text_type"){
            if(this.currentTextInputTypeDiv){
                this.currentTextInputTypeDiv.removeClass("zitiselected");
                this.currentTextInputTypeDiv.addClass("zitinoselected");
            }
            //$("#input_text2").focus();
            div.addClass("zikuselected");
            div.removeClass("zikunoselected");
            this.currentTextInputTypeDiv = div;
			$("#text_wrapper").css({width: 80+"%"});
			$("#text_type_wrapper").show();
			$("#list2").show();
			$("#list_font").hide();
			this.textScroll.refresh();
        }
    };

    /**
     * 手机窗体大小改变
     * @param o
     */
    TextInputUI.prototype.resize = function(o){
        var isMobile = utils.isMobile();
        if(isMobile){
//                appLog("pppx:" + this.imHeight)
//
//    			this.inputtab.css({bottom:o.imHeight + "px"});
//            	this.inputcontent.css({height:o.imHeight + "px"});

//            appLog(this.textArae.get(0));
//            appLog(document.activeElement)
//            appLog(this.textArae == document.activeElement)
            if(this.textArae.get(0) == document.activeElement){
                this.imgHeight = o.imHeight;
                this.inputtab.css({bottom:0});
                this.inputcontent.css({height:o.imHeight + "px"});
                this.inputcontent.css({bottom:-o.imHeight + "px"});
            }else{
//                    this.imgHeight = o.imgHeight;
                if(!this.imgHeight){
                    this.imgHeight = 200;
                }
                //appLog("nnnnnnnnnnn")
//                    if(o.imgHeight > 50){
//                        this.imgHeight = o.imgHeight;
//                    }
                this.inputtab.css({bottom:this.imgHeight + "px"});
                this.inputcontent.css({height:this.imHeight + "px"});
                this.inputcontent.css({bottom:0});
            }
        }
//    	if(this.imHeight == null){
//    		this.imHeight = o.imHeight;
//
//
//    	}
    };

    TextInputUI.prototype.initScroll = function(){
        var self = this;
        setTimeout(function(){
            //初始化文本类型滚动条
            self.textTypeScroll = new IScroll('#text_type_wrapper', {
                scrollX: false, scrollY: true, mouseWheel: true,
                tap : true,
                bounce : false,
                click:true,
                bindToWrapper : true
            });

            //初始化文本滚动条
            self.textScroll = new IScroll('#text_wrapper', {
                scrollX: false, scrollY: true, mouseWheel: true,
                tap : true,
                bounce : false,
                click:true,
                bindToWrapper : true
            });
        },0);
    };

    TextInputUI.prototype.okHandle = function(){
        var text = this.textArae.val();
        var objs = DisplayObjectManager.displayObjects;
        var index = -1;
        var has = true;

        var tpl_data = TplDataManager.currentTplData;
        var page = tpl_data.get("pages")[0];

        if($.trim(text) != ""){
			var obj = this.currentTextCtrl;
            if(obj){
                //var obj = DisplayObjectManager.currentDisplayObject;
                var type = obj.type;
                if(type == "editlinetext"){
                    text = text.replace(/\ +/g,"").replace(/[ ]/g,"");
                    text = text.replace(/[\r\n]/g,"");
                    obj.setLineText(text);
                }else if(type == "edittext"){
					if (obj.font_valight == "垂直")
					{
						text = g_SignatureListClass.to_vertical(text);
					}

                    //设置行宽，超出自动换行
                    obj.setLineWidth(page.get("page_width")-50);

                    obj.setText(text);
					obj.setFontFamily(g_variable.current_edit_font_family);
                }else if(type == "editwatermark"){
                    obj.setText(text);
					if (!g_variable.current_edit_font_family)
					{
						g_variable.current_edit_font_family = "宋体";
					}
					obj.setFontFamily(g_variable.current_edit_font_family);
                }
                //不是文本类型显示对象
                else{
                    has = false;
                    index = objs.indexOf(obj);
                }
            }else{
                has = false;
            }

            if(!has){
//                if(index == -1){
//                    for(var i = 0;i < objs.length;i++){
//                        var obj = objs[i];
//                        if(obj.type == 'editlinetext' || obj.type == 'edittext'){
//                            index = i;
//                            break;
//                        }
//                    }
//
//                    if(index == -1){
//                        index = objs.length - 1;
//                    }
//                }

                var newText = new createjs.EditText(
                    text,"50px Arial","rgba(0,0,0,1)", 1);
                newText.setFontFamily(g_variable.current_edit_font_family);

                var lineWidth = page.get("page_width")-50;

                var rect = newText.getRectBounds();
                if ( rect.width > lineWidth ){
                    newText.setLineWidth(lineWidth);
                    rect = newText.getRectBounds();
                }

                newText.setPosition(
                    (page.get("page_width")-rect.width)/2,
                    (page.get("page_height")- rect.height) / 2);

                DisplayObjectManager.add(newText);
            }
        }
        this.textArae.val("");
        this.hide();
    };

    TextInputUI.prototype.createNewText = function(text){

    };

    TextInputUI.prototype.show = function(){
		this.currentTextCtrl = null;
		
        app.makeView.header.removeClass("showmakeheader");
        app.makeView.header.addClass("hidemakeheader");

        this.$el.removeClass("hidetextinput");
        this.$el.addClass("showtextinput");
        this.textTypeScroll.refresh();
        this.textScroll.refresh();

        if(DisplayObjectManager.currentDisplayObject &&
            (DisplayObjectManager.currentDisplayObject.type == 'editlinetext' ||
                DisplayObjectManager.currentDisplayObject.type == 'edittext' ||
				DisplayObjectManager.currentDisplayObject.type == 'editwatermark')){
			this.currentTextCtrl = DisplayObjectManager.currentDisplayObject;
			var context = DisplayObjectManager.currentDisplayObject.getTextValue();
			if (DisplayObjectManager.currentDisplayObject.font_valight == "垂直")
			{
				context = g_SignatureListClass.to_horizontal(context);
			}
            this.textArae.val(context);
			g_variable.current_edit_font_family = DisplayObjectManager.currentDisplayObject.userData.get("font_family");
			g_variable.current_edit_font_size = DisplayObjectManager.currentDisplayObject.userData.get("font_size");
			this.textArae.css({"font-family": g_variable.current_edit_font_family});
        }
        //this.textArae.focus();
		this.textArae.blur();
        var val = this.textArae.val();
        if(val){
            //utils.setCaretPosition(this.textArae.get(0),val.length);
        }
    };

    TextInputUI.prototype.hide = function(){

        app.makeView.header.removeClass("hidemakeheader");
        app.makeView.header.addClass("showmakeheader");

        this.$el.removeClass("showtextinput");
        this.$el.addClass("hidetextinput");
        this.textArae.val("");
        if(this.onhide){
            this.onhide();
        }
    };

    return TextInputUI;
});