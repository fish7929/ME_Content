// 文件名称: mybitmap.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/09
// 描    述: 可编辑的Bitmap对象
define([
    'jquery',
    'common/render/baseedit',
    'easeljs'
],function($,c){
    var EditBitmap = function(imageOrUri){
        this.type = EditBitmap.TYPE;
        this.initialize(imageOrUri);
    };

    EditBitmap.TYPE = "editbitmap";

    var p = EditBitmap.prototype = new createjs.BaseEdit();

    p.BaseEdit_initialize = p.initialize;

    p.initialize = function(imageOrUri){
        this.BaseEdit_initialize(imageOrUri);

        this.bitmap = null;
        /***
         * 当前图片是否有改变
         * @type {boolean}
         */
        this.imageChanged = false;
        var self = this;
        var userData = this.userData;
        userData.set("item_cntype",2);
        userData.set("item_type",DisplayObjectType.PIC);
        userData.set("item_val",imageOrUri);

//        this.addChild(this.bitmap);
        utils.loadImage(imageOrUri,function(img){
            self.bitmap = new createjs.MyBitmap(img);
            if(self.bitmapTempRect.width){
                var rect = {
                    x : 0,y : 0,
                    width : img.width,height:img.height,
                    targetWidth : self.bitmapTempRect.width,
                    targetHeight : self.bitmapTempRect.height
                };

                userData.set("item_width",VS.rvx(rect.targetWidth));
                userData.set("item_height",VS.rvx(rect.targetHeight));
                self.bitmap.sourceRect = rect;
            }

            self.addChild(self.bitmap);
            self.resize();
        });
    };

    p.bitmapTempRect = {};

    p.setImageRect = function(w,h){
        //rect.x, rect.y, rect.width, rect.height, 0, 0, rect.targetWidth, rect.targetHeight
//        console.log(this.bitmap.sourceRect)
        this.bitmapTempRect.width = VS.vx(w);
        this.bitmapTempRect.height = VS.vy(h);
        var userData = this.userData;
//        this.imageData = createjs.wkCanvas.toDataURL("image/png",1);
        //console.log(this.gScale)
        if(this.bitmap){
            var rect = {
                x : 0,y : 0,
                width : this.bitmap.image.width,height:this.bitmap.image.height,
                targetWidth : this.bitmapTempRect.width,
                targetHeight : this.bitmapTempRect.height
            };
            userData.set("item_width",VS.rvx(rect.targetWidth));
            userData.set("item_height",VS.rvx(rect.targetHeight));
            this.bitmap.sourceRect = rect;
            this.resize();
        }
    };

    /**
     * 设置图片数据
     * @param imgData Base64
     */
    p.setImageData = function(imgData){
        this.imageData = imgData;
        var self = this;
        this.imageChanged = true;
        var userData = this.userData;
        utils.loadImage(imgData,function(img){
            self.bitmap.image = img;
            var wkWidth = createjs.wkCanvas.width,
                wkHeight = createjs.wkCanvas.height;

            var scale = utils.getAutoImageScale(createjs.wkCanvas.width,
                createjs.wkCanvas.height,img.width,img.height);

            var rect = {
                x:0,
                y:0,
                width:img.width,
                height:img.height,
                targetWidth: img.width * scale,
                targetHeight : img.height * scale
            };

            self.x = 0;
            self.y = 0;

            userData.set("item_left",0);
            userData.set("item_top",0);

            self.bitmap.sourceRect = rect;

//            if(rect.targetWidth > wkWidth || rect.targetHeight > wkHeight){
//                self.isDragging = true;
//            }

//            topEvent.trigger(LoadingView.HIDE_LOADING);


            userData.set("item_width",VS.rvx(rect.targetWidth));
            userData.set("item_height",VS.rvx(rect.targetHeight));

            //self.addChild(self.bitmap);
            self.resize();
        });
    };

    p.getRectBounds = function(){
        var b = {x:0,y:0,width:0,height:0};
        if(this.bitmap){
            var rect = this.bitmap.sourceRect;
            b.x = rect.x;
            b.y = rect.y;

            b.width = rect.targetWidth || rect.width;
            b.height = rect.targetHeight || rect.height;
        }
        return b;
    };

    p.setGscale = function(){
//        console.log("gg")
//        if(this.bitmap){
//            var rect = this.bitmap.sourceRect;
//            console.log(rect)
//            rect.x = VS.vx(rect.x);
//            rect.y = VS.vy(rect.y);
//            rect.targetWidth = VS.vx(rect.targetWidth);
//            rect.targetHeight = VS.vy(rect.targetHeight);
//        }
    };

    createjs.EditBitmap = EditBitmap;
    return EditBitmap;
});