// 文件名称: utils.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/22
// 描    述: 工具类
(function(window){
    var utils = {};
    //图片加载器
    utils.loader = {
        loaded : true,
        loadedCount : 0,
        totalCount : 0,
        images : {},
        loadImage : function(url){
            var image = utils.loader.getImage(url);
            if(image){
                return image;
            }

            this.totalCount++;
            this.loaded = false;
            //$("#loading").show();
            image = new Image();
            image.src = url;
            image.onload = utils.loader.itemLoaded;
            this.images[url] = image;
            return image;
        },
        itemLoaded : function(){
            utils.loader.loadedCount++;
            //$("#loadingmsg").html("已加载 " + utils.loader.loadedCount + "/" + utils.loader.totalCount);
            if(utils.loader.loadedCount === utils.loader.totalCount){
                utils.loader.loaded = true;
                //$("#loading").hide();
                if(utils.loader.onload){
                    utils.loader.onload();
                    utils.loader.onload = undefined;
                }
            }
        },
        getImage : function(url){
            return this.images[url];
        }
    };

    window.utils = utils;

    window.utils.loadedImages = {};

    /**
     * 一个简单的图片加载
     * @param url
     * @param callback
     */
    window.utils.loadImage = function(url,callback){
        var img = window.utils.loadedImages[url];
        if(img){
            callback(img);
        }else{
            var img = new Image();
            img.crossOrigin = '';
            img.src = url;
            img.onload = function(){
                window.utils.loadedImages[url] = img;
                callback(img);
            };
        }
    };

    /**
     * 获取属性值
     * @param e Event对象
     * @param key 属性
     */
    utils.getEventAttr = function(e,key){
        var attrs = e.target.attributes;
        var len = attrs.length;
        for(var i=0;i<len;i++){
            for(var i in attrs[0]){
                if(attrs[0][i] === key){
                    return attrs[0]["value"];
                }
            }
        }
        return null;
    };

    /**
     * 获取缩放信息
     * @param originWidth
     * @param originHeight
     * @param targetWidth
     * @param targetHeight
     */
    utils.getScaleInfo = function(originWidth,originHeight,targetWidth,targetHeight){
        //获取父容器的宽高，编辑的图片的宽高不能大于这个
        var scale = 1;

        var canvasWidth = 0,
            canvasHeight = 0,
            imageWidth = originWidth,
            imageHeight = originHeight;

        //计算缩放比
        //当图片的宽度或者高度超出容器或者小于容器宽高
        //计算宽高缩放比
        //按缩放度最大的进行缩放
        var scaleWidth = targetWidth / imageWidth;
        var scaleHeight = targetHeight / imageHeight;
        if(scaleWidth < scaleHeight){
            canvasWidth = targetWidth;
            canvasHeight = imageHeight * scaleWidth;
            scale = scaleWidth;
        }else{
            canvasHeight = targetHeight;
            canvasWidth = imageWidth * scaleHeight;
            scale = scaleHeight;
        }

        return {
            renderWidth : canvasWidth, //绘图环境的宽度
            renderHeight : canvasHeight,//绘图环境的高度
            imageWidth : imageWidth,//原始图片的宽度
            imageHeight : imageHeight,//原始图片的高度
            scale : scale            //原始图像和绘图环境的缩放比
        };
    };

    //扩展CanvasRenderingContext2D,使其可以绘制虚线
    var moveToFunction = CanvasRenderingContext2D.prototype.moveTo;
    window.CanvasRenderingContext2D.prototype.lastMoveToLocation = {x:0,y:0};
    window.CanvasRenderingContext2D.prototype.moveTo = function(x,y){
        moveToFunction.apply(this,[x,y]);

        this.lastMoveToLocation.x = x;
        this.lastMoveToLocation.y = y;

    };

    /**
     * 绘制虚线方法
     * @param x
     * @param y
     * @param dashLength 一个虚线点的长度
     */
    window.CanvasRenderingContext2D.prototype.dashedLineTo = function(x,y,dashLength){
        //默认5个像素长度
        dashLength = dashLength || 5;
        var startX = this.lastMoveToLocation.x;
        var startY = this.lastMoveToLocation.y;

        var deltaX = x - startX;
        var deltaY = y - startY;
        var numDashes = Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength);

        for(var i = 0;i < numDashes;++i){
            this[i % 2 === 0 ? 'moveTo' : 'lineTo']
            (startX + (deltaX / numDashes) * i,startY + (deltaY / numDashes) * i);
        }

        this.moveTo(x,y);
    };

    /**
     * 绘制虚线矩形
     * @param x
     * @param y
     * @param width
     * @param height
     * @param dashLength 一个虚线点的长度
     */
    window.CanvasRenderingContext2D.prototype.strokeDashedRect = function(x,y,width,height,dashLength){
        //默认5个像素长度
        dashLength = dashLength || 5;
        this.moveTo(x,y);
        this.dashedLineTo(x + width,y,dashLength);
        this.dashedLineTo(x + width, y + height, dashLength);
        this.dashedLineTo(x, y + height,dashLength);
        this.dashedLineTo(x,y,dashLength);
    };


    if (CanvasRenderingContext2D && !CanvasRenderingContext2D.renderText) {
        CanvasRenderingContext2D.prototype.renderText = function (text, x, y, letterSpacing) {
            if (!text || typeof text !== 'string' || text.length === 0) {
                return;
            }

            if (typeof letterSpacing === 'undefined') {
                letterSpacing = 0;
            }

            // letterSpacing of 0 means normal letter-spacing

            var characters = String.prototype.split.call(text, ''),
                index = 0,
                current,
                currentPosition = x,
                align = 1;

            if (this.textAlign === 'right') {
                characters = characters.reverse();
                align = -1;
            } else if (this.textAlign === 'center') {
                var totalWidth = 0;
                for (var i = 0; i < characters.length; i++) {
                    totalWidth += (this.measureText(characters[i]).width + letterSpacing);
                }
                currentPosition = x - (totalWidth / 2);
            }

            while (index < text.length) {
                current = characters[index++];
                this.fillText(current, currentPosition, y);
                currentPosition += (align * (this.measureText(current).width + letterSpacing));
            }
        }
    }

    utils.setCaretPosition = function(ctrl, pos){
        if(ctrl.setSelectionRange){
            ctrl.focus();
            ctrl.setSelectionRange(pos,pos);
        } else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    };

    window.appLog = function(msg){
        document.getElementById("log").innerHTML += msg + "<br>";

    };

    /**
     * 一个延时执行的方法
     * @param func 执行函数
     * @param time 延时时间
     * @param scope 作用域
     */
    utils.delay = function(func,time,scope){
        scope = scope || window;
        setTimeout(function(){
            func.call(scope);
        },time);
    };

    /**
     * 检测一个坐标是否在矩形内
     * @param x
     * @param y
     * @param tx
     * @param ty
     * @param tw
     * @param th
     */
    utils.checkCoordInPoint = function(x,y,rect){
        return x > rect.x && x < rect.x + rect.width
               && y > rect.y && y < rect.y + rect.height;
    };

    utils.createMaskColorLi = function(colorObjects){
        var html = "";
        var mColors = colorObjects;

        for(var i = 0; i < mColors.length; i++){
            var o = mColors[i];
            var bgColors = o.colors;
            var str = JSON.stringify(o);

            var rate = 1 / (bgColors.length - 1);

            html += "<li>";

            if(bgColors.length == 1){
                html += "<div style='background:"+bgColors[0]+"'><div color='"+str+"'></div></div>";
            }else{
                html += "<div style='background:-webkit-gradient(linear ,0 0,0 100%,";

                for(var j = 0;j < bgColors.length;j++){
                    var p = rate * j;
                    html += "color-stop("+p+","+bgColors[j]+"),";
                }

                html = html.substring(0,html.length - 1);
                html += ")'>";
                html += ("<div color='"+str+"'></div></div>");
            }


            html += "</li>";
        }

        return html;
    };

    /**
     * 使imageWidth\imageheight 适应到width和height,并返回缩放系数
     */
    utils.getAutoImageScale = function(width,height,imageWidth,imageHeight){

        //相似比例
        if((width > height && imageWidth > imageHeight) || (width < height && imageWidth < imageHeight)){
            return Math.max(width / imageWidth,height / imageHeight);
        }

        if(height > width){
            return height / imageHeight;
        }

        return width / imageWidth;
    };

    // HEX TO RGB
    window.hexToRgb = function(hex, alpha) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var toString = function () {
            if (this.alpha == undefined) {
                return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
            }
            if (this.alpha > 1) {
                this.alpha = 1;
            } else if (this.alpha < 0) {
                this.alpha = 0;
            }
            return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.alpha + ")";
        }
        if (alpha == undefined) {
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
                toString: toString
            } : null;
        }
        if (alpha > 1) {
            alpha = 1;
        } else if (alpha < 0) {
            alpha = 0;
        }
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            alpha: alpha,
            toString: toString
        } : null;
    }

    window.rgbToHex = function(rgb, g, b) {
        if (g == undefined || b == undefined) {
            if (typeof rgb == "string") {
                var result = /^rgb[a]?\(([\d]+)[ \n]*,[ \n]*([\d]+)[ \n]*,[ \n]*([\d]+)[ \n]*,?[ \n]*([.\d]+)?[ \n]*\)$/i.exec(rgb);
                return rgbToHex(parseInt(result[1]), parseInt(result[2]), parseInt(result[3]));
            }
            if (rgb.r == undefined || rgb.g == undefined || rgb.b == undefined) {
                return null;
            }
            return rgbToHex(rgb.r, rgb.g, rgb.b);
        }
        var r = rgb;
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    };

    utils.isMobile = function(){
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 获取一个文本的宽度，高度
     * @param text 文本字符串
     * @param bold 是否粗体
     * @param font 字体
     * @param size 字大小
     * @returns {*}
     * @constructor
     */
    utils.measureText = function(text, bold, font, size){
        var str = text + ':' + bold + ':' + font + ':' + size;
        if (typeof(__measuretext_cache__) == 'object' && __measuretext_cache__[str]) {
            return __measuretext_cache__[str];
        }

        var div = document.createElement('div');
        div.innerHTML = text;
        div.style.position = 'absolute';
        div.style.top = '-1000px';
        div.style.left = '-1000px';
        div.style.zIndex = 0;
        div.style.fontFamily = font;
        div.style.fontWeight = bold ? 'bold' : 'normal';
        div.style.fontSize = size;
        document.body.appendChild(div);

        var size = [div.offsetWidth, div.offsetHeight];

        document.body.removeChild(div);

        if (typeof(__measuretext_cache__) != 'object') {
            __measuretext_cache__ = [];
        }
        __measuretext_cache__[str] = size;
        return size;
    }

    /* mistery and 2014-10-11
    /**
     * 掩码
     * @param mask -> 掩码对象
     * @param obj  -> 数据对象
     * return mask;
     */
    //var  masks = null;
    var canvas = null;
    utils.textRevoke = function(x,y,width,height){
        //if(! x&&y&&width&&height) return;
        //if(!masks){ console.log("runing mask"); }
		var mask = new createjs.Shape();
        if(!canvas){ canvas = $("#makecanvas");}
        var cw = canvas.width() | 0,
            ch = canvas.height() | 0;
        mask.graphics
            .drawRect(0,0,cw,y-height) //上
            .drawRect(0,y,cw,ch) //下

            .drawRect(0,y-height,x,height) //左
            .drawRect(x+width,y-height,cw-x-width,height) //右
        ;
        return mask;
    }
    
    
    /*  
    		arr : 数据
    		container : 容器ID
    		col : 数据的显示 列数
    		mas : masonry (true | false)
    */
    var water_div_id = 10000;
		utils.reWaterData = function(arr,container,col,mas){
        var html_all = "",
        		html = [],
        		cw = document.getElementById(container).clientWidth/col;
        for(var i=arr.length-1;i>=0;i--){
            var tpl = arr[i],
            img = fmacapi.tpl_thumb_img_url(tpl),
            scrol = cw/tpl.get("tpl_width"),	//比例
						h = (tpl.get("tpl_height") * scrol) * (1-(17/cw));	//图片的高度
						// loadingLazy 延迟加载
            html.push("<div id='water_div_" + (++water_div_id) + "' style='width:"+(cw-1)+"px;height:"+(h+12)+"px;' class='warterbox'>");
            //visibility:hidden;
            html.push("<img style='background-color:#dadada;height:"+h+"px;' tpl_id='"+tpl.get("tpl_id")+"' alt='"+tpl.get("name")+"' class='lm' data-url='"+img+"' src='images/skin/loading_grey_1px.gif' />");
            // 自调用 onload 方法
            //html.push("<img hidden onload=\"this.removeAttribute('hidden');this.parentNode.removeChild(this.nextSibling);this.removeAttribute('onload');\" tpl_id='"+tpl.get("tpl_id")+"' alt='"+tpl.get("name")+"' src='"+img+"' />");
            //html += "<img style='width:50px;height:50px;border:0px;margin:" + (h/2-25) + "px auto;' src='images/skin/loading.gif'>";
            html.push("</div>");
            if(i==0){
            	html_all = html.join('');
			  			html = [];
            }
        };
        if(mas){
	    		var $container = $("#"+container);
	    		var $newElems = $(html_all);
	        if ( $container == undefined ) return false;
	        $container.append(html_all);
	        if(html_all != null){
	            $container.masonry();
	        }else{
	            $container.masonry("appended",$newElems );
	        }
	      	return true;
      	};
      	return html_all;
    }
    
    /*
    	// 页面加载动画
    	 pre  ID 
    	 del  是否删除 (true | false)
    */
    var backTime = null;
    utils.pageLoading = function(pre,del){
    		backTime = null;
    		if(pre == false){
    				var ma = document.getElementById("make_mask");
    				if(ma == null)
		    			return false;
		    		ma.innerHTML = "<div onclick='javascript:this.style.display='none';localhost.href='#fma/square';' style='text-align:center;color:#fff;font-size:30px;position:absolute;top:48%;width:100%;'>加载失败。。。</div>";
	    			return false;
	    	}
	    	if(del){
		    		var p = document.getElementById("pageContent");
		    				if(p == null)
		    					return false;
		    				if(p.childNodes[2].id == "make_mask")
				        	p.removeChild(p.childNodes[2]);
				    return true;
		    }
		    if(document.getElementById("make_mask"))
		    		return false;
    		$("#"+pre).after("<div id='make_mask' onmousedown=onmouseup=onclick='javascript:void(0);' style='position:absolute;width:100%;height:100%;z-index:1000000;background-color:#000;'>" +
        			"<div style='top:48%;' class='mefier'></div>" +
        		"</div>");
    		backTime = setTimeout("utils.pageLoading(false,false)",5000);
    }
})(window);