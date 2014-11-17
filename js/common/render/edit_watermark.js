// 文件名称: edittext.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/29
// 描    述: 一个可编辑文本的组件
define([
    'jquery',
    'common/render/baseedit',
    'common/render/include'
],function($){

    /**
     * 可编辑的水印
     * @param item
     * @constructor
	 * type2 "signature" - 用于区分水印和签章
     */
    var EiditWaterMark = function(type2){
        this.type = "editwatermark";

		if (type2)
		{
			this.type2 = type2;
		}

        //缩放比
//        this.gScale = this.gScale || 1;

//        if(!item){
//            item = fmaobj.elem.create();
//            item.set("item_left",createjs.wkCanvas.width / 2);
//            item.set("item_top",createjs.wkCanvas.height / 2);
//            item.set("item_width",0);
//            item.set("item_height",0);
//            item.set("item_color","rgba(255,255,255,0)");
//        }

//        this.userData = item;

        this.initialize();
    };

    var p = EiditWaterMark.prototype = new createjs.BaseEdit();

    p.BaseEdit_initialize = p.initialize;

    p.initialize = function(){
        this.BaseEdit_initialize();
        this.bitmap;
        this.isDragging = true;
        this.isDelete = true;
        this.isScale = true;
        this.isRotation = true;
        this.setIsHScale(true);

        this.x = createjs.wkCanvas.width / 2;
        this.y = createjs.wkCanvas.height / 2;

        this.userData.set("item_left",VS.rvx(this.x));
        this.userData.set("item_top",VS.rvy(this.y));
        this.userData.set("item_opacity",100);

        this.userData.set("x_scale",VS.rvx(0.25));
        this.userData.set("y_scale",VS.rvy(0.25));

        this.userData.set("item_type",DisplayObjectType.WATERMARK);
    };

    p.getTextValue = function(){

		var result = "";

		if (this.text)
		{
			result = this.text.text.text;
		}

        return result;
    };

    p.setText = function(text){

		if (this.text)
		{
			this.text.text = text;
			this.userData.set("text",text);
		}
    };

	// 设置初始参数(包括文本内容、字体、字体大小、初始位置、宽高、旋转角度)
    p.set_params = function(params, rotation){

		if (!params)
		{
			return;
		}

		var self = this;

		fmacapi.tpl_get_data(params,function(data){

			var pages = data.get("pages");

			var items = pages[0].get("item_object");

			var item = items[1];

			item.set("x_scale", undefined);
			item.set("y_scale", undefined);

			if (typeof(rotation) != "undefined")
			{
				item.set("rotate_angle", rotation);
			}
			
			self.add_object(item);
		},function(){});
    };

    /**
     * 文字字体
     * @param value
     */
    p.setFontFamily = function(value){
        this.userData.set("font_family",value);
		this.text.font = this.userData.get("font_size") + " " + this.userData.get("font_family");
    };

    p.setImageUrl = function(url){
        var self = this;

        if(this.bitmap){
            if(this.getChildIndex(this.bitmap) != -1){
                this.removeChild(this.bitmap);
                this.scaleObjects = [];
            }
            this.bitmap = null;
        }

        this.userData.set("item_cntype",2);
        //设置水印图片路径
        this.userData.set("item_val",url);

        var scale = this.userData.get("x_scale");

        utils.loadImage(url,function(img){
            var userData = self.userData;
            self.bitmap = new createjs.MyBitmap(img);
            var rect = new createjs.Rectangle(0,0,img.width,img.height);

            rect.targetWidth = img.width;
            rect.targetHeight = img.height;

            self.bitmap.sourceRect = rect;

            self.bitmap.cache(0,0,img.width,img.height);

            //默认缩到
            self.bitmap.scaleX = self.bitmap.scaleY = VS.vx(scale);

            self.addChild(self.bitmap);

            self.scaleObjects.push(self.bitmap);

            self.resize();
			self.drawOuterRect();
			self.drawButtons();
        });
    };

    p.getRectBounds = function(){
        if(this.bitmap){
            var rect = this.bitmap.sourceRect;
            return {
                x : 0,
                y : 0,
                width : rect.targetWidth * this.bitmap.scaleX,
                height : rect.targetHeight * this.bitmap.scaleY
            };
        }
    };

    p.resetPosition = function(){
        if(this.bitmap){
            var rect = this.getRectBounds();
            this.regX = rect.width / 2;
            this.regY = rect.height / 2;

            this.bitmap.regX = rect.width / 2;
            this.bitmap.regY = rect.height / 2;

            this.bitmap.x = rect.width / 2 * this.bitmap.scaleX;
            this.bitmap.y = rect.height / 2 * this.bitmap.scaleY;

			if (this.text)
			{
				this.text.regX = rect.width / 2;
				this.text.regY = rect.height / 2;

				this.text.regX = 0;
				this.text.regY = 0;

//				this.text.x = rect.width / 2;
//				this.text.y = rect.height / 2;
			}
        }
    };

    /**
     * 改变图片颜色
     * @param color
     */
    p.changeColor = function(color){

		if (!color)
		{
			return;
		}

		this.userData.set("item_filter", "color_filter");
		this.userData.set("item_filter_val", color);

		this.current_color = color;

		var obj = $.parseJSON(color);

		var r = -1;
		var g = -1;
		var b = -1;
		var a = -1;

		if (obj.colors.length == 1)
		{
			var color_str = obj.colors[0];

			if (color_str.indexOf("rgba(") >= 0)
			{
				color_str = color_str.replace("rgba(", "");
				color_str = color_str.replace(")", "");

				var colors = color_str.split(',');

				r = parseInt(colors[0]);
				g = parseInt(colors[1]);
				b = parseInt(colors[2]);
				a = parseInt(colors[3]);
			}
			else if (color_str.indexOf("#") >= 0)
			{
				var pos1 = color_str.indexOf("#");

				var r_str = color_str.substring(pos1 + 1, pos1 + 3);
				var g_str = color_str.substring(pos1 + 3, pos1 + 5);
				var b_str = color_str.substring(pos1 + 5, pos1 + 7);

				r = parseInt(r_str, 16);
				g = parseInt(g_str, 16);
				b = parseInt(b_str, 16);
				a = 1;
			}
		}

		if(this.bitmap && this.bitmap.cacheCanvas){
			this.bitmap.filters = [
				new createjs.ColorFilter(0,0,0,1, r,g,b,a)
			];

			this.bitmap.updateCache();
		}

		if (this.text)
		{
			this.text.setTextColor(color);
		}

//        if(this.bitmap && this.bitmap.cacheCanvas){
//            var canvas = this.bitmap.cacheCanvas;
//            var context = canvas.getContext("2d");
//
//            console.log(canvas.width)
//            var imgDatas = context.getImageData(0,0,canvas.width,canvas.height);
//
//            var data = imgDatas.data;
//            var len = data.length;
//
//            var obj = $.parseJSON(color);
//            if(obj.colors.length > 1){
////                var g = createjs.wkContext.createLinearGradient(0,0, 0, r.height);
////                g.addColorStop(0,"#ff0000");
////                g.addColorStop(1,"#0000ff");
////                this.text.color = g;
//            }else{
//                var sc = obj.colors[0];
//                //console.log(len)
//                for(var i=0;i < len;i+=4){
//                    //console.log(imgData)
//                    data[i] = 255;
//                    data[i+1] = 0;
//                    data[i+2] = 0;
////                    console.log(i)
//                    //imgData[i] = 255;
//                }
//            }
//
//            context.putImageData(imgDatas,0,0);
//
//            this.bitmap.updateCache();
//        }
    };

    /**
     * 改变alpha
     * @param color
     */
    p.changeAlpha = function(value){
		this.current_alpha = value;
        if(this.bitmap){
            this.bitmap.alpha = value;
            this.userData.set("item_opacity",value * 100);
        }

		if (this.text)
		{
			this.text.setTextAlpha(value);
		}
    };

    p.BaseEdit_resize = p.resize;

    p.resize = function(){
        this.resetPosition();
        this.BaseEdit_resize();
    };
	
	// 设置颜色或图像蒙板
    p.setColorOrImage = function(obj,type){
//        if(this.parentView){
            var m = DisplayObjectManager;
            var objects = m.displayObjects;

            var object = objects[1];
            var mask;
            if(object && object.type == "maskrect"){
                //object.setColor(color);
                mask = object;
            }else{
                mask = new createjs.EditMaskRect();
                //mask.setColor(color);
                this.addChild(mask);
            }

            if(type == 1){
                mask.setColor(obj);
            }else{
                mask.setImageUrl(obj);
            }
//        }
    };

	// 取得当前元素的group_ID
	function get_group_ID(objects_list)
	{
		var result = 10000;

		for	(var i = 0; i < objects_list.length; i++)
		{
			var obj = objects_list[i];

			if (obj.get("group_ID") != 0 && obj.get("group_ID") % 100 == 0)
			{
				result = obj.get("group_ID") + 100;
			}
		}

		return result;
	}

	// 将对象列表保存到canvas对象列表中
	p.save_objects = function(objects_list) {

		var group_ID = get_group_ID(objects_list);

		this.userData.set("group_ID", group_ID);

		objects_list.push(this.userData);

		if (this.text)
		{
			this.text.userData.set("group_ID", this.userData.get("group_ID") + 1);

			this.text.userData.set("item_layer", this.text.userData.get("item_layer") + 10000);

			objects_list.push(this.text.userData);
		}
	}

	// 回显子控件
	p.add_object = function(userData)
	{
		if (this.text)
		{
			return;
		}

		this.type2 = "signature";
		var type = userData.get("item_type") + "";

		switch (type)
		{
		// 文本编辑框
		case "2":
			{
				var item = userData;

				var font_size = parseInt(item.get("font_size"));

				if (!this.text)
				{
					this.text = new createjs.EditText("", font_size + "px " + item.get("font_family"), "#000000", 1);

					DisplayObjectManager.add(this.text);

					this.text.parent_watermark = this;
				}

				this.text.userData = item;

				var scale = VS.vx(this.userData.get("x_scale"));

				this.text.setFontSize(font_size);
				this.text.setFontFamily(item.get("font_family"));
				this.text.setTextColor("{\"colors\":[\"" + item.get("item_color") + "\"]}");
				//self.text.x = item.get("item_left") * scale + font_size * scale / 2;
				//self.text.y = item.get("item_top") * scale + font_size * scale / 2;
				this.text.setText(item.get("item_val"));
				//this.text.setPosition((item.get("item_left") + font_size * scale / 2) * scale, (item.get("item_top") + font_size * scale / 2) * scale);
				////this.text.setPosition((item.get("item_left") + font_size * scale / 2) * scale, (item.get("item_top") + font_size * scale / 2) * scale);
				////this.text.setPosition((item.get("item_left") + font_size * scale / 2) * scale, (item.get("item_top") + font_size * scale / 2) * scale);
				this.text.resetRegPosition();
				// 显示位置
				//var pos1 = this.localToGlobal(VS.vx(item.get("item_left") + this.text.regX / VS.vx(item.get("x_scale"))), VS.vy(item.get("item_top") + this.text.regY / VS.vy(item.get("y_scale"))));
//				item.set("item_left", 220);
//				item.set("item_top", 220);
//				var pos1 = this.localToGlobal(item.get("item_left"), item.get("item_top"));
//				this.text.x = VS.vx(pos1.x + this.text.regX);
//				this.text.y = VS.vy(pos1.y + this.text.regY);

				//item.set("item_left", 220);
				//item.set("item_top", 220);

				// 文本相对于签章控件的中心坐标
				var x_c = (item.get("item_left") + this.text.regX) * VS.vx(this.userData.get("x_scale"));
				var y_c = (item.get("item_top") + this.text.regY) * VS.vx(this.userData.get("x_scale"));

				// 文本相对于签章控件的中心坐标的vx vy值
				var x_c2 = x_c;
				var y_c2 = y_c;

				// 文本相对于签章控件的中心坐标的global值
				var pos_123 = this.localToGlobal(x_c2, y_c2);
				var x_g = pos_123.x;
				var y_g = pos_123.y;

				this.text.x = x_g;
				this.text.y = y_g;

				console.log("save02: "
					+ this.text.x + ", " + this.text.y);

				// 计算签章文字的缩放比例
				var x_scale = 1;

				if (typeof(item.get("x_scale")) != "undefined")
				{
					x_scale = VS.vx(item.get("x_scale"));
				}
				else
				{
					x_scale = VS.vx(this.userData.get("x_scale"));
					item.set("x_scale", VS.rvx(x_scale));
				}

				var y_scale = 1;

				if (typeof(item.get("y_scale")) != "undefined")
				{
					y_scale = VS.vy(item.get("y_scale"));
				}
				else
				{
					y_scale = VS.vy(this.userData.get("y_scale"));
					item.set("y_scale", VS.rvy(y_scale));
				}

				this.text.text.scaleX = x_scale;
				this.text.text.scaleY = y_scale;
				this.text.resize();
				this.text.rotation = item.get("rotate_angle");
				this.text.resetRegPosition();
				this.text.calc_relative_pos();		// 计算相对位置
				this.text.calc_relative_rotation();	// 计算相对角度
				this.text.calc_relative_scale();	// 计算相对缩放比例

				if (app.temp_66)
				{
					this.text.x = this.text.x;
				}

				//this.text.setScale(x_scale, y_scale);
//				if (!this.text_added)
//				{
//					this.text_added = true;
//
//					//this.addChild(this.text);
//				}
			}
		break;
		}
	}

    /**
     * 缩放
     */
    p.onscale = function(scaleX,scaleY){
        this.resize();
		
		if (this.type2 && this.type2 == "signature" && this.text)
		{
			if (typeof(this.text.scaleX_r) == "undefined")
			{
				this.text.scaleX_r = 1;
			}

			if (typeof(this.text.scaleY_r) == "undefined")
			{
				this.text.scaleY_r = 1;
			}

			this.text.text.scaleX = VS.vx(this.userData.get("x_scale")) * this.text.scaleX_r;
			this.text.text.scaleY = VS.vy(this.userData.get("y_scale")) * this.text.scaleY_r;

			this.text.userData.set("x_scale", VS.rvx(this.text.text.scaleX));
			this.text.userData.set("y_scale", VS.rvy(this.text.text.scaleY));

			var pos1 = this.localToGlobal(this.text.x_r * this.userData.get("x_scale"), this.text.y_r * this.userData.get("y_scale"));

			this.text.x = pos1.x;
			this.text.y = pos1.y;

			this.text.resetRegPosition();

			this.text.calc_item_left_top();
		}
    };

	// 移动位置回调函数
	p.onmove = function()
	{
		if (this.type2 && this.type2 == "signature" && this.text)
		{
			var pos1 = this.localToGlobal(this.text.x_r * this.userData.get("x_scale"), this.text.y_r * this.userData.get("y_scale"));

			this.text.x = pos1.x;
			this.text.y = pos1.y;

			this.text.calc_item_left_top();
		}
	}

	// 旋转回调函数
	p.onrotate = function() {
		if (this.type2 && this.type2 == "signature" && this.text)
		{
			if (typeof(this.text.rotation_r) == "undefined")
			{
				this.text.rotation_r = 0;
			}

			this.text.rotation = this.rotation + this.text.rotation_r;
			this.text.userData.set("rotate_angle", this.text.rotation);

			this.text.calc_item_left_top();
		}
	}

	// 关闭事件被触发
	p.onclose = function() {
		if (this.text)
		{
			this.text.closeHandle();
		}
	}

	// 取得当前控件所在层号
	p.get_current_object_index = function()
	{
		var result = -1;

		for (var i = 0; i < DisplayObjectManager.displayObjects.length; i++)
		{
			var item = DisplayObjectManager.displayObjects[i];

			if (item == this)
			{
				result = i;
			}
		}

		return result;
	}

	// 向上移动一层
	p.upper = function()
	{
		var cur_index = this.get_current_object_index();

		var add_index = cur_index + 1;

		if (add_index > DisplayObjectManager.displayObjects.length - 1)
		{
			add_index = DisplayObjectManager.displayObjects.length - 1;
		}
		
		DisplayObjectManager.remove(this);
		DisplayObjectManager.add(this, add_index);

		app.makeView.renderer.remove(this);
		app.makeView.renderer.addObject(this, add_index);
	}

	// 向下移动一层
	p.lower = function()
	{
		var cur_index = this.get_current_object_index();

		var add_index = cur_index - 1;

		if (add_index < 0)
		{
			add_index = 0;
		}
		
		DisplayObjectManager.remove(this);
		DisplayObjectManager.add(this, add_index);

		app.makeView.renderer.remove(this);
		app.makeView.renderer.addObject(this, add_index);
	}

    //左右缩放
    p.pressMoveHScaleHandle = function(e){

        if(this.isHScale){

            var dx,dy;
            if(this.parent.rotation){
//                var g = this.globalToLocal(evt.stageX,evt.stageY);
//                var l = this.localToLocal(g.x,g.y,this.parent);
//                dx = l.x - (this.x-this.regX);
//                dy = l.y - (this.y-this.regY);
            }else {
                dx = e.stageX - (this.x - this.regX);
                dy = e.stageY - (this.y - this.regY);

				var scaleX = dx / 50;

				if (scaleX < 0)
				{
					scaleX = 0;
				}

				if (this.bitmap)
				{
					this.bitmap.scaleX = 0.35 + scaleX;
					this.resize();
				}

				console.log("dx 000000: " + dx);
            }

            //this.setLineWidth(VS.rvx(dx));
            //this.resize();
        }
    };

    createjs.EiditWaterMark = EiditWaterMark;

    return EiditWaterMark;
});