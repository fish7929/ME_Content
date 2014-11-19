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
        lastChangeImageType : -1,//记录最后一次改变和类型，1：前景，2背景
        init : function(renderer){
            if(this.inited){
                this.reset(renderer);
            }else{
                this.inited = true;
                //console.log(renderer)
                this.renderer = renderer;
                var self = this;

                /**
                 * 监听文本点击事件
                 */
                topEvent.bind(EventConstant.DISPLAYOBJECT_CLICK, function (e, data) {
                    //console.log("click");
                    DisplayObjectManager.displayObjectClick(data);
                    self.hideComponent();
                });

                /**
                 * 监听显示对象双击事件
                 */
                topEvent.bind(EventConstant.DISPLAYOBJECT_DBLCLICK, function (e, data) {
                    DisplayObjectManager.displayObjectDblClick(data);
                    self.hideComponent();
                });

                /**
                 * 监听显示对象删除
                 */
                topEvent.bind(EventConstant.DISPLAYOBJECT_REMOVED, function (e, data) {
                    DisplayObjectManager.remove(data);
                    self.hideComponent();
                });

                var self = this;

                //前景后景切换
                topEvent.bind(EventConstant.FORE_BACK_CHANGE, function(e, data){
                    var foreBg = self.getForeDisplayObject();
                    var backBg = self.getBackDisplayObject();
                    //前景
                    this.lastChangeImageType = data;
                    if(data == 1){
//                        if(foreBg){
//                            alert(foreBg.isImage);
//                        }
                        if(foreBg && foreBg.isImage){
                            // alert("gg")
                            self.setDragging(foreBg,true);
                        }
                        self.setDragging(backBg,false);
                    }else{
                        self.setDragging(foreBg,false);
//                        console.log(backBg.type);
                        if(backBg){
                            self.setDragging(backBg,true);
                            //console.log(2);
                        }
                    }
                });

                //监听显示对象的hold事件
                topEvent.bind(EventConstant.DISPLAYOBJECT_TAPHOLD,function(e,data){
                    //console.log(data)
                    self.holdHandler(data);
                });

                //监听改变层号事件
                topEvent.bind(EventConstant.CHANGE_DISPLAYOBJECT_LAYER,function(e,obj,type){
                    self.changeObjectLayer(obj,type);
                });
            }
        },

        setDragging : function(obj,b){
            if(obj){
                //console.log("ddd");
                obj.setIsDragging(b);
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
                case "editbitmap":
                case "maskrect":

                    break;
            }

            topEvent.trigger(EventConstant.SHOW_OR_HIDE_MENU,obj);
        },

        hideComponent : function(){
            var upDown = this.renderer.upDownComponent;
            upDown.hide();
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
        },
        /**
         * 获得背景显示对象
         * 背景显示对象就为最底层
         */
        getBackDisplayObject : function () {
            return this.getObject(0);
        },

        /**
         * 获得蒙层显示对象
         * 应当在第二层
         * @returns {*}
         */
        getForeDisplayObject : function(){
            var o = this.getObject(1);
//            console.log(o)
            if(o && o.type == "maskrect"){
                return o;
            }
            return null;
        },
        holdHandler : function(obj){
            var upDown = this.renderer.upDownComponent;
            if(obj.type == 'maskrect' || obj.type == 'editbitmap'){
                topEvent.trigger(EventConstant.SHOW_PHOTO_CHANGE,obj);
                upDown.hide();
            }else{
                //console.log("hodeee");
                upDown.setOperationObject(obj);
                this.renderer.addObject(upDown,this.displayObjects.length);
            }
        },
        /**
         * 改变显示对象层号
         * @param obj 需要改变的对象
         * @param type 类型 up:向上一层，down:向下一层
         */
        changeObjectLayer : function(obj,type){
            var index = this.getObjectIndex(obj);
            if(type == 'down'){
                index = index - 1;
//                console.log(index);
                if(index < 2){
                    if(index == 1){
                        var o = this.getForeDisplayObject();
                        if(o && o.type == createjs.EditMaskRect.TYPE){
                            return;
                        }
                    }else{
                        return;
                    }
                }

            }else{
                index = index + 1;
                if(index > this.displayObjects.length){
                    return;
                }
            }

            this.moveObjectLayer(obj,type);
        },

        moveObjectLayer : function(obj,type){
            var len = this.displayObjects.length;
            for(var i = 0;i < len;i++){
                var o = this.displayObjects[i];
                if(o == obj){
                    var tempObject;
                    var index;
                    if(type == 'up'){
                        index = i+1;
                        if(index > len - 1){
                            return;
                        }
                    }else{
                        index = i - 1;
                        if(index < 0){
                            return;
                        }
                    }
                    tempObject = this.displayObjects[index];
                    this.displayObjects[i] = tempObject;
                    this.displayObjects[index] = obj;
                    this.renderer.swapChildren(obj,tempObject);
                    break;
                }
            }
        },

        /**
         * 获取显示对象的层号
         * @param object
         */
        getObjectIndex : function(object){
            for(var i = 0;i < this.displayObjects.length;i++){
                if(object === this.displayObjects[i]){
                    return i;
                }
            }
            return  -1;
        }
    };

    window.DisplayObjectManager = DisplayObjectManager;
    return DisplayObjectManager;
});