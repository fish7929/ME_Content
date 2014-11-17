// 文件名称: displayobject_manager.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/16
// 描    述: 显示对象的管理器
define(["jquery"],function($){

    if(window.DisplayObjectManager){
        return window.DisplayObjectManager;
    }

    /**
     * 显示对象的管理器
     *
     */
    var DisplayObjectManager = {
        displayObjects : [],//存放所有的显示对象
        currentDisplayObject : null,//当前选中的显示对象
        effect_img:null,
        inited : false,
        init : function(renderer){
            if(this.inited){
                this.reset(renderer);
            }else{
                this.inited = true;
                //console.log(renderer)
                this.renderer = renderer;

                /**
                 * 监听文本点击事件
                 */
                topEvent.bind(EventConstant.DISPLAYOBJECT_CLICK, function (e, data) {
                    DisplayObjectManager.displayObjectClick(data);
                });

                /**
                 * 监听显示对象双击事件
                 */
                topEvent.bind(EventConstant.DISPLAYOBJECT_DBLCLICK, function (e, data) {
                    DisplayObjectManager.displayObjectDblClick(data);
                });

                /**
                 * 监听显示对象删除
                 */
                topEvent.bind(EventConstant.DISPLAYOBJECT_REMOVED, function (e, data) {
                    DisplayObjectManager.remove(data);
                });
            }
        },

        saveToImage : function(){
            this.effect_img = this.renderer.toDataUrl();
        },

        reset : function(renderer){
            this.renderer = renderer;
            this.displayObjects = [];
            this.currentDisplayObject = null;
        },

        add : function(obj,index){
            index = (index === undefined) ? this.getNewIndex() : index;
            this.renderer.addObject(obj,index);
            this.displayObjects.splice(index, 0, obj);
        },

        /* 创建新对象时，获取一个位置*/
        getNewIndex : function(){
            //如果当前的选中的对象，新的位置在选中的对象之上
            if(this.currentDisplayObject){
                for(var i = 0;i < this.displayObjects;i++){
                    if(this.currentDisplayObject == this.displayObjects[i]){
                        return i + 1;
                    }
                }
            }
            return this.displayObjects.length;
        },

        /**
         * 删除显示对象
         * @param data
         */
        remove : function(displayObject){
            var len = this.displayObjects.length;
            for(var i = 0; i < len; i++){
                if(this.displayObjects[i] == displayObject){
                    this.displayObjects.splice(i,1);
                    break;
                }
            }
        },

        scaleObject : function(displayObject){

            displayObject.x = VS.vx(displayObject.x);
            displayObject.y = VS.vy(displayObject.y);
            displayObject.width = VS.vx(displayObject.width);
            displayObject.height = VS.vy(displayObject.height);

            if(displayObject.setGscale){
                displayObject.setGscale();
            }
        },

        scaleObjects : function(objects){
            for(var i = 0;i < objects.length;i++){
				if (!objects[i])
				{
					//alert("found it!");
					continue;
				}
                this.scaleObject(objects[i]);
            }
        },

		// 添加签章子控件
		add_signature_children : function(objects, current_index, item_text) {
			// group_ID整除100后的结果
			var group_ID_root = Math.floor(item_text.userData.get("group_ID") / 100);

			for	(var i = 0; i < current_index; i++)
			{
				var obj = objects[i];

				// group_ID整除100后的结果
				var group_ID_root_2 = Math.floor(obj.userData.get("group_ID") / 100);

				if (group_ID_root_2 == group_ID_root && obj.userData.get("group_ID") % 100 == 0)
				{
					obj.add_object(item_text.userData.clone());					

					item_text.is_deleted = true;

					break;
				}
			}
		},

        addObjects : function(objects){
            for(var i=0;i < objects.length;i++){
                var item = objects[i];

				if (!item)
				{
					continue;
				}
				
				if (item.userData.get("item_type") == 2 && item.userData.get("group_ID") != 0 && item.userData.get("group_ID") % 100 != 0)		// 签章子控件
				{
					this.add_signature_children(objects, i, item);

					continue;
				}

                this.renderer.addObject(item);
                this.displayObjects.push(item);
				if (item.on_added)
				{
					item.on_added();
				}
            }
        },

        /**
         * 设置选中对象
         * @param displayObject
         */
        setCurrentDisplayObject : function(displayObject){
            if(this.currentDisplayObject){
                if(this.currentDisplayObject.setSelected){
                    this.currentDisplayObject.setSelected(false);
                }
            }

            this.currentDisplayObject = displayObject;

            if(this.currentDisplayObject.setSelected){
                this.currentDisplayObject.setSelected(true);
            }
        },

        /**
         * 显示对象单击事件
         * @param obj
         */
        displayObjectClick : function(obj){
            if (this.currentDisplayObject && this.currentDisplayObject.getSelected) {
                this.currentDisplayObject.setSelected(false);
            }

            //DisplayObjectManager.clickedObject = true;

//            console.log(obj)
            this.currentDisplayObject = obj;

            if(this.currentDisplayObject.type != createjs.EditBitmap.TYPE){
                DisplayObjectManager.clickedObject = true;
            }

            if(this.currentDisplayObject.setSelected){
                this.currentDisplayObject.setSelected(true);
            }

            var type = obj.type;

            switch (type){
                case "edittext"://显示文本编辑
                    topEvent.trigger(EventConstant.SHOW_TEXT_EDIT,obj);
                    break;
                case "editwatermark"://显示水印编辑
                    topEvent.trigger(EventConstant.SHOW_WATERMARK_EDIT,obj);
                    break;
            }
        },

        /**
         * 显示对象双击事件
         */
        displayObjectDblClick : function(obj){
            //alert(obj)
            if (this.currentDisplayObject && this.currentDisplayObject.getSelected) {
                this.currentDisplayObject.setSelected(false);
            }

            this.currentDisplayObject = obj;
           if(this.currentDisplayObject.type != createjs.EditBitmap.TYPE){
               DisplayObjectManager.clickedObject = true;
           }

            if(this.currentDisplayObject.setSelected){
                this.currentDisplayObject.setSelected(true);
            }

            var type = obj.type;

            switch (type){
                case "edittext":
                case "editlinetext":
                    topEvent.trigger(EventConstant.SHOW_TEXT_INPUT,obj);
                    break;
            }
        },
        setAllSelected : function(b){
            var arr = this.displayObjects;
            this.currentDisplayObject = null;
            for(var i = 0;i < arr.length;i++){
                var o = arr[i];
                o.setSelected(b);
            }
        },
        /**
         * 检查显示对象是否是某个类型
         * @param type
         * @returns {boolean}
         */
        currentDisplayObjectIsType : function(type){
            if(!DisplayObjectManager.currentDisplayObject){
                return false;
            }

            if(DisplayObjectManager.currentDisplayObject.type == type){
                return true;
            }

            return false;
        },
        /*
         * 获取第n个显示对象
         */
        getObject : function(n){

            if ( n < this.displayObjects.length ){
                return this.displayObjects[n];
            }else{
                return null;
            }
        }
    };

    window.DisplayObjectManager = DisplayObjectManager;

    return DisplayObjectManager;
});