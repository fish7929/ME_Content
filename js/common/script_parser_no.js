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
                objects[i] = object;
                returnArr.push(getItemDisplayObject(object));
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
        var font = item.get("font_size") + " " + item.get("font_family");
        var color = item.get("item_color");
        text = new createjs.EditText(item.get("item_val"),font,color);
        text.userData = item;

        text.alpha = item.get("item_opacity") / 100;
        text.rotation = item.get("rotate_angle");
//        console.log(item.get("x_scale"))
        text.setScale(item.get("x_scale"),item.get("y_scale"));

//        text.x = item.item_left;
//        text.y = item.item_top;
        text.setPosition(item.get("item_left"),item.get("item_top"));
        return text;
    }

    /**
     * 创建水印对象
     * @param item
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
        }

        return wm;
//        console.log("水印：" + item)
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