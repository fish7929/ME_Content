// 文件名称: editpicframe.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/08
// 描    述: 画框显示对象
define([
    'jquery',
    'common/render/baseedit',
    'easeljs'
],function($,c){
    var EditPicFrame = function(){
        this.type = "editpicframe";
        this.initialize();
    };

    var p = EditPicFrame.prototype = new createjs.BaseEdit();

    p.BaseEdit_initialize = p.initialize;

    p.initialize = function(){
        this.BaseEdit_initialize();
        this.bitmap = null;

		this.userData.set("item_opacity",100);

		this.userData.set("item_type",DisplayObjectType.PICFRAME);
    };

	// 取得画框大小
	function get_target_size(canvas_width, canvas_height, scale)
	{
		var result = new Object();

		result.width = canvas_width;
		result.height = canvas_height;

//		if (canvas_width / canvas_height > scale)
//		{
//			result.width = canvas_height * scale;
//		}
//		else
//		{
//			result.height = canvas_width / scale;
//		}

		return result;
	}

    /**
     * 设置画框的图片路径
     * @param url
     * @param scale_x1 长宽比_x
     * @param scale_x2 长宽比_y
     */
    p.setImageUrl = function(url, scale_x1, scale_y1){
        var self = this;

		var scale_num = 1;

		try
		{
			scale_num = scale_x1 / scale_y1;
		}
		catch (e)
		{
		}

        if(this.bitmap){
            if(this.getChildIndex(this.bitmap) != -1){
                this.removeChild(this.bitmap);
            }
            this.bitmap = null;
        }

        utils.loadImage(url,function(img){
            self.bitmap = new createjs.MyBitmap(img);
            var rect = new createjs.Rectangle(0,0,img.width,img.height);

			var target_size = get_target_size(createjs.wkCanvas.width, createjs.wkCanvas.height, scale_num);

            rect.targetWidth = target_size.width;
            rect.targetHeight = target_size.height;

			if (createjs.wkCanvas.width > target_size.width)
			{
				self.bitmap.x = (createjs.wkCanvas.width - target_size.width) / 2;
			}
			else if (createjs.wkCanvas.height > target_size.height)
			{
				self.bitmap.y = (createjs.wkCanvas.height - target_size.height) / 2;
			}

            self.bitmap.sourceRect = rect;
            self.addChild(self.bitmap);

			self.userData.set("item_cntype", 2);
			self.userData.set("item_width", scale_x1);
			self.userData.set("item_height", scale_y1);
			self.userData.set("item_val", url);
        });
    };

    createjs.EditPicFrame = EditPicFrame;

    return EditPicFrame;

});