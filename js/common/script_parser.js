/**
 * Created by chenshy on 2014/8/22.
 */
// 文件名称: script_parser.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/25
// 描    述: 脚本解析器/模板解释器
define([
    "common/render/include"
],function(createjs){
    /**
     * 根据传进来的脚本，解析成渲染器可以识别的对象
     * 解析后对象存入数组
     * @param script
     */
    var ScriptParser = function(script){
//        console.log(sc)
        this._displayObjects = [];
        this.originScript = script;
        this.script = [script].slice()[0];

        this.version = 0.1;//解析器版本号
        parse(this);
    };

    var currentTplData;

    /**
     * 私有方法
     * @param scriptParser 脚本解析器
     */
    function parse(scriptParser){
        //模板页或作品数据
        var obj = scriptParser.script;
        currentTplData = obj;
//        console.log(obj)
        var arr = obj.get("pages");

        var pages = [];

        for(var i = 0;i < arr.length;i++){
            var v = arr[i];
            var items = v.get("item_object");
            if(items && items.length > 0){
                pages.push(getItemDisplayObjects(items));
            }
        }

        scriptParser._displayObjects = pages;
    }

    /**
     * 获取元素数组显示对象
     * @param objects 元素数组
     * @return Array 显示对象数组
     */
    function getItemDisplayObjects(objects){
        var i,len = objects.length;

        objects = objects.sort(function(a,b){
            var aLayer = parseInt(a.get("item_layer"));
            var bLayer = parseInt(b.get("item_layer"));
            return aLayer - bLayer;
        });

        var returnArr = [];
        for(i = 0;i < objects.length;i++){
//            var objectA = objects[i];

            //var objectB = objectA.clone();
//            console.log(objectA);
//            console.log(objectB);
            if(objects[i]){
                var object = objects[i].clone();
				object.is_deleted = objects[i].is_deleted;
                objects[i] = object;
				if (!object.is_deleted)
				{
					if (object.get("item_type") == DisplayObjectType.WATERMARK)
					{
						object.objects_list = objects;
						object.current_index = i;
					}
					returnArr.push(getItemDisplayObject(object));
				}
            }
        }
        return returnArr;
    }

    /**
     * 获取页元素显示对象
     * @param pageItemObject 模板对象或作品对象
     * @return 显示对象
     */
    function getItemDisplayObject(pageItemObject){
        //显示对象
        var displayObject = null;

		if (typeof(pageItemObject.get("group_ID")) == "undefined")
		{
			pageItemObject.set("group_ID", 0);
		}

        //console.log(pageItemObject)
//        图片 文本框 水印 动画 路径 填充区 域 音频	视频
//	      12345678
        var type = pageItemObject.get("item_type") + "";
        switch (type){
            case "1": //图片
                displayObject = createImageObject(pageItemObject);
                break;
            case "2"://文本
                displayObject = createTextObject(pageItemObject);
                break;
            case "3"://水印
                displayObject = createWaterMarkObject(pageItemObject);
                break;
            case "4"://动画
                break;
            case "5"://路径
                break;
            case "6"://填充区
                displayObject = createRectObject(pageItemObject);
                break;
            case "7"://音频
                break;
            case "8"://视频
                break;
            case "9"://掩码
				displayObject = createMaskRectObject(pageItemObject);
                break;
            case "10"://边框
                displayObject = createPicFrameObject(pageItemObject);
                break;
        }

        return displayObject;
    }

    /**
     * 创建一个图片渲染对象
     * @param item 脚本元素
     */
    function createImageObject(item){
        var sprite;
        var cntype = item.get("item_cntype");
        var imgUrl = "";
        if(cntype == 2){ //元素值类型 item_val指示(1-直接内容；2-链接地址；3-资源id)

            imgUrl = item.get("item_val");
        }else if(cntype == 3){
            var tpl_id = currentTplData.get("key_id");
            var url = item.get("item_val");
//            console.log("模板id:" + tpl_id,"类型：" + cntype, "url:" + url)

            imgUrl = fmacapi.tpl_res_img_url(tpl_id,cntype,url);

//            console.log("imageUrl:" + imgUrl);
        }

        sprite = new createjs.EditBitmap(imgUrl);
//        console.log("ddd")

        sprite.x = item.get("item_left");
        sprite.y = item.get("item_top");

        sprite.setImageRect(item.get("item_width"),item.get("item_height"));

        sprite.alpha = item.get("item_opacity") / 100;
        sprite.rotation = item.get("rotate_angle");
        //镜像 item_mirror	镜像方式（left,top,null）[左右镜像,上下镜像，无]
        //TO-DO

        //遮罩 mask
        //TO-DO

        //滤镜 [item_filter]
        //TO-DO

        sprite.userData = item;

        return sprite;
    };

    /**
     * 创建一个文本渲染对象
     * @param item 脚本元素
     */
    function createTextObject(item){
		var text;
        var context = item.get("item_val").replace(/\(\\n\)/g, "\r\n").replace(/\&lt;\\n\&gt;/g, "\r\n");

		// 文字方向
		var font_valight = "水平";

		if (item.get("font_valight") == "垂直")
		{
			context = g_SignatureListClass.to_vertical(context);
		}
		
		// 为特殊字体添加对应关系
        var fontname = item.get("font_family");

		if (fontname == "Microsoft YaHei")
		{
			if (g_variable.platform == "IOS")
			{
				item.set("font_family", "STHeiti-Light");
			}
			else if (g_variable.platform == "android")
			{
				item.set("font_family", "Droid Sans Fallback");
			}
		}
		else if (fontname == "Wawati SC Regular" || fontname == "Wawati")
		{
			item.set("font_family", "娃娃体");
		}
		else if (fontname == "FZDaHei-B02S"  || fontname == "FZDaHei")
		{
			item.set("font_family", "方正大黑简体");
		}
		else if (fontname == "FZYingBiXingShu-S16S")
		{
			item.set("font_family", "方正硬笔行书简体");
		}
		else if (fontname == "Helvetica Light")
		{
			item.set("font_family", "Helvetica Light");
		}
		else if (fontname == "Trajan Pro 3 Bold")
		{
			item.set("font_family", "Trajan Pro");
		}
		else if (fontname == "Avenir Next Heavy")
		{
			item.set("font_family", "Avenir Next Heavy");
		}
		else if (fontname == "Abadi MT Condensed")
		{
			item.set("font_family", "Abadi MT");
		}
		else if (fontname == "Chalkboard SE Bold")
		{
			item.set("font_family", "Chalkboard SE Bold");
		}
		else if (fontname == "Mistral Regular")
		{
			item.set("font_family", "Mistral Regular");
		}
		else if (fontname == "Apple Chancery")
		{
			item.set("font_family", "Apple Chancery");
		}

		var font_size = item.get("font_size");

		if (font_size.indexOf("px") < 0)
		{
			font_size += "px";
		}

        var font = font_size + " " + item.get("font_family");
        var color = item.get("item_color");

        var alpha = item.get("item_opacity") / 100;

        text = new createjs.EditText(context,font,color,alpha,200);

		if (font_valight)
		{
			text.font_valight = font_valight;
		}

        text.userData = item;
		text.userData.set("item_val", context);

        text.setAlign(item.get("font_halign"));
        text.setLetterSpacing(item.get("font_dist"));
        text.setLineHeight(item.get("line_height")||0);

        text.resetRegPosition();
        text.x = item.get("item_left") + text.regX;
        text.y = item.get("item_top") + text.regY;

        text.setScale(item.get("x_scale"), item.get("y_scale"));
        text.rotation = item.get("rotate_angle");

		// 设置镜像翻转效果
		var item_mirror = item.get("item_mirror");

		item.set("item_mirror", "");

		if (item_mirror.indexOf("left") >= 0)
		{
			text.setTextMirror("left");
		}

		if (item_mirror.indexOf("top") >= 0)
		{
			text.setTextMirror("top");
		}

		/* mistery and 2014-10-11 */
        if ( !! item.get("use_mask") ) {
            var x = VS.vx(item.get("mask_color").split(" ")[0].split("X:")[1]),
                y = VS.vy(item.get("mask_color").split(" ")[1].split("Y:")[1]),
                w = VS.vx(item.get("mask_width")),
                h = VS.vx(item.get("mask_height"));
            text.mask = utils.textRevoke(x,y+h*1.15,w,h);
            createjs.EditText.prototype.maskobj = text;
        }

        //设置背景色
        //text.setBackground("#00bb33",0.5);

        //设置背景图片
        //var m = new createjs.EiditWaterMark("edit_watermark");

        return text;
    }

	// 添加签章子控件
	function add_signature_children(signature_obj, objects_list, current_index)
	{
		// group_ID整除100后的结果
		var group_ID_a = Math.floor(signature_obj.userData.get("group_ID") / 100);

		for	(var i = current_index + 1; i < objects_list.length; i++)
		{
			var obj = objects_list[i];

			// group_ID整除100后的结果
			var group_ID_o = Math.floor(obj.get("group_ID") / 100);

			if (group_ID_a == group_ID_o)
			{
				//signature_obj.add_object(obj);

				//obj.set("item_layer", obj.get("item_layer") - 10000);
				obj.is_deleted = true;

				break;
			}
		}
	}

    /**
     * 创建水印对象
     * @param item
	 * 如果item.objects_list != null, 则表示这个对象是签章对象
     */
    function createWaterMarkObject(item){
        var wm = new createjs.EiditWaterMark();
        wm.userData = item;

        wm.x = item.get("item_left");
        wm.y = item.get("item_top");

        wm.alpha = item.get("item_opacity");
        wm.rotation = item.get("rotate_angle");
//        wm.scaleX = item.get("x_scale");
//        wm.scaleY = item.get("y_scale");

        var cntype = item.get("item_cntype") + "";

        if(cntype == "2"){
            wm.setImageUrl(item.get("item_val"));

			if (item.get("item_filter") == "color_filter")
			{
				wm.changeColor(item.get("item_filter_val"));
			}
        }

		if (item.get("group_ID") != 0)
		{
			//add_signature_children(wm, item.objects_list, item.current_index);
		}

        return wm;
    }

    /**
     * 创建边框对象
     * @param item
     */
    function createPicFrameObject(item){
        var pf = new createjs.EditPicFrame();
        pf.userData = item;

        pf.x = item.get("item_left");
        pf.y = item.get("item_top");

        var cntype = item.get("item_cntype") + "";

        if(cntype == "2"){
			if (item.get("item_val").indexOf(".") >= 0)
			{
				pf.setImageUrl(item.get("item_val"), item.get("item_width"), item.get("item_height"));
			}
        }

//        pf.alpha = item.get("item_opacity");
//        pf.rotation = item.get("rotate_angle");
//        pf.scaleX = item.get("x_scale");
//        pf.scaleY = item.get("y_scale");

        return pf;
    }

    function createRectObject(item){
        var rect = new createjs.EditRect();
        rect.userData = item;

        var x = item.get("item_left");
        var y = item.get("item_top");
        var width = item.get("item_width");
        var height = item.get("item_height");
        var color = item.get("item_color");
        var alpha = item.get("item_opacity");

        rect.setRect(x,y,width,height);
        rect.setRectAlpha(alpha / 100);
        rect.setRectColor(color);

        return rect;
    }
	
	// 创建掩码对象
    function createMaskRectObject(item){
        var mask = new createjs.EditMaskRect();
        mask.userData = item;

        var x = item.get("item_left");
        var y = item.get("item_top");
        var width = item.get("item_width");
        var height = item.get("item_height");
		var use_mask = item.get("use_mask");
        var mask_color = item.get("mask_color");
        var alpha = item.get("item_opacity");

		mask.on_added = function () {
			if (use_mask)
			{
				mask.setColor(mask_color);
			}

			mask.setAlpha(alpha / 100);
		}

        return mask;
    }

    /**
     * 获取单页显示对象
     * @return Array  [显示对象，显示对象]
     */
    ScriptParser.prototype.getDisplayObjects = function(page){
        return this._displayObjects[page || 0];
    };

    /**
     * 获取所有页显示对象
     * @returns {Array} [页1，页2]
     */
    ScriptParser.prototype.getDisplayObjectPages = function(){
        return this._displayObjects;
    };

    /**
     * 根据渲染对象生成脚本
     * @param renderArr 渲染对象数组
     * @return Array
     */
    ScriptParser.prototype.getRenderObjectScript = function(renderArr){
        return [];
    };

    return ScriptParser;
});