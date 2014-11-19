// 文件名称: edittext.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/29
// 描    述: 一个可编辑文本的组件
define([
    'jquery',
    'common/render/baseedit',
    'common/render/include'
],function($,ce){

    /**
     * 可编辑的文本对象
     * @param item
     * @constructor
     */
    var EditText = function(text,font,color,alpha,lineWidth){
        this.type = EditText.TYPE;
        this.gScale = this.gScale || 1;
        this.bg = {
            inUse : false,
            bgColor : "#ffffff",
            bgAlpha : 0.5,
            bgStyle : "rect"
        };

        this.initialize(text,font,color,alpha,lineWidth);
    };

    /* mistery add prototype */
    EditText.prototype.maskobj = null;

    EditText.TYPE = "edittext";

    var p = EditText.prototype = new createjs.BaseEdit();

    p.BaseEdit_initialize = p.initialize;

    p.initialize = function(textStr,font,color,alpha,lineWidth){

        this.BaseEdit_initialize();

		// 是否应用了镜像效果
		this.b_jingxiang = false;
		// 是否应用了翻转效果
		this.b_fanzhuan = false;

        //设置文本属性
        //字颜色
        var text = this.text = new createjs.Text(textStr,font,color);
        text.alpha = alpha;

        //added by YC.Q 2014/11/8
        //支持自动换行
        var mw = text.getMeasuredWidth();

        if ( lineWidth && text.getMeasuredWidth() > lineWidth ){

            text.lineWidth = lineWidth;
        }
        //end added

        this.addChild(this.text);

        var self = this;

        this.userData.set("item_type",DisplayObjectType.TEXT);
        this.userData.set("item_val",textStr);
        this.userData.set("font_size",font.split(" ")[0]);
        this.userData.set("font_family",font.split(" ")[1]);
        this.userData.set("item_color",color);
        this.userData.set("item_opacity",100);
        this.userData.set("x_scale",VS.rvx(1));
        this.userData.set("y_scale",VS.rvy(1));
//        this.text.scaleX = VS.xScale;
//        this.text.scaleY = VS.xScale;

        /**
         * 合成图
         * @type {null}
         */
        this.patternImage = null;

        //重设当前坐标，坐标点在中心点
        this.resetRegPosition();
        var rect = this.getRectBounds();

        this.scaleObjects.push(this.text);

        this.setSelected(false);

        this.setIsHScale(true);
        this.setIsRotation(true);
        this.setIsDelete(true);
        this.setIsScale(true);
        this.isDragging = true;

    };    
	
//	var get_text_width = function(text, font_family, font_size){
//        var sensor = $('<pre style="font-family: ' + font_family + '; font-size: ' + font_size + 'px;">'+ text +'</pre>').css({display: 'none'});
//        $('body').append(sensor);
//        var width = sensor.width();
//        sensor.remove();
//        return width;
//    };
//
//	var get_text_height = function(text, font_family, font_size, line_height){
//
//		var line_height_str = "";
//
//		if (!!line_height)
//		{
//			line_height_str = " line-height: " + line_height + "px;";
//		}
//
//        var sensor = $('<pre style="font-family: ' + font_family + '; font-size: ' + font_size + 'px;' + line_height_str + '">'+ text +'</pre>').css({display: 'none'});
//        $('body').append(sensor);
//        var height = sensor.height();
//        sensor.remove();
//        return height;
//    };

    p.getRectBounds = function(){
		var line_height = null;
		if (!!this.userData.get("line_height") && !!this.userData.get("font_size"))
		{
			line_height = parseInt(this.userData.get("font_size")) + parseInt(this.userData.get("line_height"));
		}
//        var width = get_text_width(this.text.text, this.userData.get("font_family"), this.userData.get("font_size").replace("px", "")),
//            height = get_text_height(this.text.text, this.userData.get("font_family"), this.userData.get("font_size").replace("px", ""), line_height);


        var width = this.text.lineWidth || this.text.getMeasuredWidth(),
            height = this.text.getMeasuredHeight();

        if ( width > this.text.getMeasuredWidth() ){
            width = this.text.getMeasuredWidth();
        }

        var rect = this.text.getBounds();

		var width_r = width * this.text.scaleX;
		var height_r = height * this.text.scaleY;

		var width_0 = width_r;
		var height_0 = height_r;

		if (width_r >= 0)
		{
			if (width_r < 36)
			{
				width_r = 36;
			}
		}
		else
		{
			if (width_r > -36)
			{
				width_r = -36;
			}
		}

		if (height_r >= 0)
		{
			if (height_r < 36)
			{
				height_r = 36;
			}
		}
		else
		{
			if (height_r > -36)
			{
				height_r = -36;
			}
		}

		if (width_r < 0)
		{
			width_r = 0 - width_r;
		}

		if (height_r < 0)
		{
			height_r = 0 - height_r;
		}

		return {
			x : 0,
			y : 0,
			width : width_r,
			height : height_r,
			width_0 : width_0,
			height_0 : height_0
		};
    };

    /**
     * 文字透明度
     * @param value
     */
    p.setTextAlpha = function(value){
        //this.userData.item_transp = value;
        this.text.alpha = value;
        //设置userData数据 item_opacity
        this.userData.set("item_opacity",~~(value * 100));
    };

    /**
     * 文字字体
     * @param value
     */
    p.setFontFamily = function(value){
        this.userData.set("font_family",value);
		this.text.font = this.userData.get("font_size") + " " + this.userData.get("font_family");
    };

    /**
     * 行间距
     * @param value
     */
    p.setLineHeight = function(value){
		var font_size = 12;
		try
		{
			font_size = parseInt(this.userData.get("font_size"));
		}
		catch (e)
		{
		}
        this.userData.set("line_height",value);
		this.text.lineHeight = font_size + parseInt(value);

        //重设注册点位置
        this.resetRegPosition();

        this.resize();
    };

	// 增加文本框
	p.addHandle = function()
	{
		this.selected = false;
        this.drawOuterRect();
        this.drawButtons();
		DisplayObjectManager.currentDisplayObject = null;
		app.makeView.textInputUI.textArae.val(this.text.text);
		app.makeView.showInputText();
	};

    // 水平伸缩
    p.hscaleHandle = function()
    {
    };


    /**
     * 文字大小
     * @param value
     */
    p.setFontSize = function(value){
        var currFontSize = parseInt(this.userData.font_size,10);
        if(value < currFontSize){
            if(this.isMinSize()){
                return;
            }
        }

        //设置userData数据 font_size
        this.userData.set("font_size",value + "px");
        this.text.font = value + "px " + this.userData.get("font_family");

//        this.resetRegPosition();
        //重设注册点位置
        this.resetRegPosition();

        this.resize();

		// 检测是否超出屏幕范围
		this.check_out();
    };


    /**
     * 判断当前缩水的框已到最小
     */
    p.isMinSize = function(){
//        var r = this.getTextRect();
//        var b = this.touchScale.getBounds();
//        if(r.height < b.height || r.width < b.width){
//            return true;
//        }
//        return false;
    };

    /**
     * 设置文本颜色
     * @param color
     */
    p.setTextColor = function(color){
        var obj = $.parseJSON(color);
        this.patternImage = null;
        if(obj.colors.length > 1){
            var r = this.getRectBounds();
            var g = createjs.wkContext.createLinearGradient(0,0, 0, r.height);
            //g.addColorStop(0,"#ff0000");
            //g.addColorStop(1,"#0000ff");
			var stop_pos = 0;
			var stop_length = 1 / (obj.colors.length - 1);
			for (var i = 0; i < obj.colors.length; i++)
			{
				g.addColorStop(stop_pos , obj.colors[i]);

				stop_pos += stop_length;
			}
            this.text.color = g;
        }else{
            this.text.color = obj.colors[0];
            this.userData.set("item_color",obj.colors[0]);
        }

    };

    /**
     * 设置镜像
     * @param dir left 左右镜像
     * top 上下镜像
     * nleft 左右还原
     * nright 上下还原
     */
    p.setTextMirror = function(dir){
        var data = this.userData;

        var mir = data.get("item_mirror") + "";
        var leftMir = mir.indexOf("left") == -1 ? "" : "left",
            topMir = mir.indexOf("top") == -1 ? "" : "top";

		if (dir  == "left" && leftMir == dir)
		{
			dir = "nleft";
		}

		if (dir  == "top" && topMir == dir)
		{
			dir = "ntop";
		}

        switch (dir){
            case "left":
				this.b_jingxiang = true;
                this.text.scaleX = (this.text.scaleX * -1);
                leftMir = "left";
                break;
            case "top":
				this.b_fanzhuan = true;
                this.text.scaleY = (this.text.scaleY * -1);
                topMir = "top";
                break;
            case "nleft":
				this.b_jingxiang = false;
                this.text.scaleX = Math.abs(this.text.scaleX);
                leftMir = "";
                break;
            case "ntop":
				this.b_fanzhuan = false;
                this.text.scaleY = Math.abs(this.text.scaleY);
                topMir = "";
                break;
        }

        var m = leftMir;
        if(m){
            if(topMir){
                m += "," + topMir;
            }
        }else{
            m = topMir;
        }

        data.set("item_mirror",m);
        this.resize();
		this.resetRegPosition();
    };

    //设置行宽，超出自动换行
    p.setLineWidth = function(lineWidth){
      this.text.lineWidth = lineWidth;
      this.userData.set("item_width",lineWidth);
    };

    //

    //设置文本排列方式，left/right/center
    p.setAlign = function(align){

        this.text.textAlign = align;
        this.userData.set("font_halign",align);
		this.resetRegPosition();
    };

    //设置字间距
    p.setLetterSpacing = function(letterSpacing) {
//        console.log("letter");
//        console.log(letterSpacing)
        this.text.letterSpacing = letterSpacing;
        this.userData.set("font_dist",letterSpacing);
    };

    p.setText = function(text){
        this.text.text = text;
        this.userData.set("item_val",text);
        this.resize();
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

    //设置背景
    //style : "rect/round"
    p.setBackground = function(color, alpha, style) {

		return;

        color = color || this.bg.bgColor;
        alpha = alpha || this.bg.bgAlpha;
        style = style || this.bg.bgStyle;

        this.bg.inUse = true;

        var bgShape = this.bgShape;
        var r = this.getRectBounds();

        if ( bgShape==null  ) {
            bgShape = this.bgShape = new createjs.Shape();
            this.addChildAt(bgShape,0);
        }else{
            bgShape.graphics.clear();
        }

        bgShape.graphics.beginFill(color).drawRect(0, 0, r.width, r.height );
        bgShape.alpha = alpha;

        this.bg.bgColor = color;
        this.bg.bgAlpha = alpha;
        this.bg.bgStyle = style;

    };

	// 设置衬底
	p.setBackgroundImage = function(url)
	{
		var self = this;

        if(this.bitmap){
            if(this.getChildIndex(this.bitmap) != -1){
                this.removeChild(this.bitmap);
                this.scaleObjects = [];
            }
            this.bitmap = null;
        }

        //this.userData.set("item_cntype",2);
        //this.userData.set("item_val",url);

        var x_scale = 0.25;
        var y_scale = 0.25;

        utils.loadImage(url,function(img){
            var userData = self.userData;
            self.bitmap = new createjs.MyBitmap(img);
			self.bitmap.userData = fmaobj.elem.create();
            var rect = new createjs.Rectangle(0,0,img.width,img.height);

            rect.targetWidth = img.width;
            rect.targetHeight = img.height;

            self.bitmap.sourceRect = rect;

            self.bitmap.cache(0,0,img.width,img.height);

            //默认缩到
            self.bitmap.scaleX = VS.vx(x_scale);
			self.bitmap.scaleY = VS.vx(y_scale);

            self.addChild(self.bitmap);

            //self.scaleObjects.push(self.bitmap);

            self.resize();
        });
	}

    //背景刷新
    p.refreshBackground = function() {

        if ( this.bg.inUse && !!this.bgShape) {
            var bgShape = this.bgShape;

            bgShape.graphics.clear();

            r = this.getRectBounds();
            bgShape.graphics.beginFill(this.bg.bgColor).drawRect(0, 0, r.width, r.height);

        }
    };

	// 检查是否超出屏幕范围
	p.check_out = function()
	{
		if (this.rotation != 0)
		{
			return;
		}

		var rect = this.getRectBounds();

		// 边框宽度
		var width = rect.width;

		// 左上角坐标
		var x = this.x - rect.width / 2;
		
		// 虚屏宽度
		var screen_width = createjs.wkCanvas.width;

		if (width < screen_width)
		{
			if (this.x - rect.width / 2 < 0)
			{
				this.x = 0 + rect.width / 2;

				x = this.x - rect.width / 2;
			}

			if (x + width > screen_width)
			{
				this.x = screen_width - width + rect.width / 2;
			}
		}
		else
		{
			this.setLineWidth(screen_width);
		}
	}

    p.BaseEdit_resize = p.resize;

    p.resize = function(){
        this.resetRegPosition();
        this.BaseEdit_resize();
        this.refreshBackground();
		this.bitmap_resize();
    };

    p.resetRegPosition = function(){
        var rect = this.getRectBounds();
        this.regX  = rect.width / 2;
        this.regY  = rect.height / 2;

        this.text.regX = rect.width / 2 ;
        this.text.regY = rect.height / 2 ;

        this.text.x = Math.abs(rect.width / 2 * this.text.scaleX);
        this.text.y = Math.abs(rect.height / 2 * this.text.scaleY);

		var text_regX = 0;
		var text_regY = 0;

		if (this.b_jingxiang || this.b_fanzhuan)
		{
			this.text.regX = 0;
			this.text.regY = 0;
		}

		if (this.b_jingxiang && this.b_fanzhuan)
		{
			this.text.x = rect.width;
			this.text.y = rect.height;
		}
		else if (this.b_jingxiang)
		{
			this.text.x = rect.width;
			this.text.y = 0;
		}
		else if (this.b_fanzhuan)
		{
			this.text.x = 0;
			this.text.y = rect.height;
		}

		if (this.userData.get("font_halign") == "center")
		{
			this.text.x += this.text.regX;

			if (this.text.regX == 0)
			{
				this.text.x = rect.width / 2;
			}
		}
		else if (this.userData.get("font_halign") == "right")
		{
			this.text.x += this.text.regX * 2;

			if (this.text.regX == 0)
			{
				this.text.x = rect.width;

				if (this.b_jingxiang)
				{
					this.text.x = 0;
				}
			}
		}

//		console.log("resetRegPosition: "
//			+ this.text.regX + ", " + this.text.regY + ", "
//			+ this.text.x + ", " + this.text.y);
    };

	// 设置文本对齐方式
	p.setTextAlign = function(align){
		this.textAlign = align;
		this.text.textAlign = align;
		this.resetRegPosition();
	}

    p.setTextImage = function(imageOrUri){
        var self = this;
        utils.loadImage(imageOrUri,function(img){
            self.patternImage = img;
            var pattern = createjs.wkContext.createPattern(self.patternImage,"repeat");
            self.text.color = pattern;
        });
    };

    /* mistery and 2014-10-11
    /**
     * 使用掩码时 用来获得  x , y , w , h
     * @returns {{x: number, y: *, w: *, h: *}}
     */
    p.getXYWH = function(){
        return {
            //x : this.x-this.regX,
            //y : this.y+this.regY,
            x : this.x-this.regX,
            y : this.y-this.regY,
            w : this.getRectBounds().width_0,
            h : this.getRectBounds().height_0
        }
    };

    p.setGscale = function(scale){
        this.text.scaleX = VS.vx(this.text.scaleX);
        this.text.scaleY = VS.vx(this.text.scaleY);
        this.resize();
    };

    p.setPosition = function(x,y){
        this.x = x + this.regX;
        this.y = y + this.regY;
        this.userData.set("item_left",VS.rvx(x));
        this.userData.set("item_top",VS.rvx(y));
    };

    p.getTextValue = function(){
        return this.text.text;
    };

    p.setScale = function(scaleX,scaleY){
        this.text.scaleX = scaleX;
        this.text.scaleY = scaleY;
//        console.log("scaleX:" + scaleX)
        this.resize();
    };

	// 计算相对坐标
	p.calc_relative_pos = function()
	{
		if (this.parent_watermark)
		{
			var pos1 = this.parent_watermark.globalToLocal(this.x, this.y);

			this.x_r = pos1.x / this.parent_watermark.userData.get("x_scale");
			this.y_r = pos1.y / this.parent_watermark.userData.get("y_scale");
		}
	}

    /**
     * 缩放
     */
    p.onscale = function(scaleX,scaleY){
        this.resize();
		
		if (this.parent_watermark)
		{
			this.calc_relative_scale();
		}
    };

	// 移动位置回调函数
    p.onmove = function(){
        if(this.patternImage){
            var ctx = createjs.wkContext;
            ctx.save();
            ctx.translate(0,0);


            var pattern = createjs.wkContext.createPattern(this.patternImage,"repeat");
            this.text.color = pattern;
            ctx.restore();
        }
        /* mistery and 2014-10-11 */
        if ( this.maskobj != null ){
            if(this.userData.get("item_id")>2){
                var xywh = this.getXYWH();
                this.maskobj.mask = utils.textRevoke(xywh.x,xywh.y,xywh.w,xywh.h);
				this.maskobj.userData.set("mask_color", "X:" + VS.rvx(xywh.x) + " Y:" + VS.rvy(xywh.y - xywh.h * 1.15));
				this.maskobj.userData.set("mask_width", VS.rvx(xywh.w));
				this.maskobj.userData.set("mask_height", VS.rvy(xywh.h));
            }
        }

		if (this.parent_watermark)
		{
			this.calc_relative_pos();

			this.calc_item_left_top();
		}
    };

	// 旋转回调函数
	p.onrotate = function() {
		if (this.parent_watermark)
		{
			this.calc_relative_rotation();
		}
	}

	// 背景图重新计算大小
	p.bitmap_resize = function()
	{
		if (!this.bitmap)
		{
			return;
		}

		var rect = this.getRectBounds();

		var scaleX = rect.width / 100;
		var scaleY = rect.height / 100;

		this.bitmap.scaleX = scaleX;
		this.bitmap.scaleY = scaleY;
	}
	
	// 计算userData中的item_left与item_top值
	p.calc_item_left_top = function() {
		if (this.parent_watermark)
		{
			var pw = this.parent_watermark;

			// 相对坐标
			var pos1 = pw.globalToLocal(this.x, this.y);

			this.userData.set("item_left", pos1.x / VS.vx(pw.userData.get("x_scale")) - this.regX / VS.vx(this.userData.get("x_scale")));
			this.userData.set("item_top", pos1.y / VS.vy(pw.userData.get("y_scale")) - this.regY / VS.vx(this.userData.get("y_scale")));
		}
	}

	// 计算相对角度
	p.calc_relative_rotation = function() {
		if (this.parent_watermark)
		{
			this.rotation_r = this.rotation - this.parent_watermark.rotation;
		}
	}

	// 计算相对角度
	p.calc_relative_scale = function() {
		if (this.parent_watermark)
		{
			this.scaleX_r = this.userData.get("x_scale") / this.parent_watermark.userData.get("x_scale");
			this.scaleY_r = this.userData.get("y_scale") / this.parent_watermark.userData.get("y_scale");
		}
	};

    //左右缩放
    p.pressMoveHScaleHandle = function(e){

        if(this.isHScale){

            var dx,dy;
            if(this.parent.rotation){
                var g = this.globalToLocal(evt.stageX,evt.stageY);
                var l = this.localToLocal(g.x,g.y,this.parent);
                dx = l.x - (this.x-this.regX);
                dy = l.y - (this.y-this.regY);
            }else {
                dx = e.stageX - (this.x-this.regX);
                dy = e.stageY - (this.y-this.regY);
            }

            this.setLineWidth(VS.rvx(dx));
            this.resize();
        }
    };

    createjs.EditText = EditText;
    return EditText;
});