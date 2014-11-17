// 文件名称: edit_linetext.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/09
// 描    述: 轨迹文字
define([
    'jquery',
    'common/render/baseedit',
    'easeljs'
],function($){
    var EditLineText = function(){
        this.type = "editlinetext";
        this.initialize();
    };

    var p = EditLineText.prototype = new createjs.BaseEdit();

    p.BaseEdit_initialize = p.initialize;

    var mouse = {x:0,y:0,down:false};
    var position = {x:0,y:0};

    p.initialize = function(){
        this.BaseEdit_initialize();
        this.bgShape = new createjs.Shape();
        this.lineShape = new createjs.Shape();

        this.lg = this.bgShape.graphics;

        this.lg.beginFill("rgba(0,0,0,0.01)");
        this.lg.rect(0,0,createjs.wkCanvas.width,createjs.wkCanvas.height);
        this.lg.endFill();

        this.lineRect = {x:0,y:0,width:0,height:0};

        this.textStr = "";

        /*路径对象*/
        this.pathObject = {};

        /**
         * 画线点坐标
         * @type {Array}
         */
        this.coordsX = [];
        this.coordsY = [];

        var self = this;

        //画线事件监听
        this.bgShape.on("mousedown", function(evt) {
            //self.offset = {x:self.x-evt.stageX, y:self.y-evt.stageY};
            self.lineMouseDown(evt);
        });
        this.bgShape.on("pressup",function(evt){
            self.lineMouseUp(evt);
        });
        this.bgShape.on("pressmove", function(evt) {
            self.lineMouseMove(evt);
        });

        var userData = this.userData;
        userData.set("item_type",DisplayObjectType.PATHTEXT);
        userData.set("item_cntype",1);

        this.addChild(this.bgShape);
        this.addChild(this.lineShape);
    };

    /**
     * 鼠标释放，画线结束
     * @param evt
     */
    p.lineMouseUp = function(evt){
        mouse.down = false;
        this.endDraw();
    };

    p.lineMouseMove = function(evt){
        mouse.x = evt.stageX;
        mouse.y = evt.stageY;
        this.coordsX.push(mouse.x);
        this.coordsY.push(mouse.y);
        this.drawLine();
    };

    /**
     * 画线
     */
    p.drawLine = function(){
        if(mouse.down){
            var g = this.lineShape.graphics;
            g.beginStroke("rgba(0,0,0,0.6)");
            g.setStrokeStyle(1);
            g.moveTo(position.x,position.y);
            g.lineTo(mouse.x,mouse.y);
            g.endStroke();

            position.x = mouse.x;
            position.y = mouse.y;
        }
    };

    /**
     * 鼠标移动画线
     * 同时记录移动的坐标点
     * @param evt
     */
    p.lineMouseDown = function(evt){
        mouse.down = true;
        this.coords = [];
        position.x = evt.stageX;
        position.y = evt.stageY;
        this.coordsX.push(position.x);
        this.coordsY.push(position.y);
    };

    /**
     * 画线结束
     */
    p.endDraw = function(){
        var minX = Math.min.apply(Math,this.coordsX);
        var minY = Math.min.apply(Math,this.coordsY);

        var maxX = Math.max.apply(Math,this.coordsX);
        var maxY = Math.max.apply(Math,this.coordsY);

        this.lineRect = {
            x : minX,
            y : minY,
            width : maxX - minX,
            height : maxY - minY
        };
        this.removeChild(this.bgShape);

        this.pathObject.coordsX = this.coordsX;
        this.pathObject.coordsY = this.coordsY;
        this.userData.set("item_val",JSON.stringify(this.pathObject));

        this.isDragging = true;
        this.isDelete = true;
//        this.isScale = true;
//        this.isRotation = true;

//        console.log("enddraw")

        this.resize();
    };

    p.BaseEdit_resize = p.resize;

    p.resize = function(){
        this.BaseEdit_resize();
    };

    /**
     * 设置文本
     * @param text
     */
    p.setLineText = function(text){
        this.textStr = text;
        this.pathObject.text = text;
        this.userData.set("item_val",JSON.stringify(this.pathObject));
    };

    p.getRectBounds = function(){
        return this.lineRect;
    };

    p.Container_draw = p.draw;

    p.draw = function(ctx,ignoreCache){
        this.Container_draw(ctx,ignoreCache);
        this.arcTextHandle(ctx);
    };

    p.arcTextHandle = function(ctx){
        if(this.textStr){
            var rect = this.getRectBounds();
            ctx.font = "50px Arial";
            //ctx.fillText(this.textStr,rect.x,rect.y);
            var cx = this.coordsX;
            var cy = this.coordsY;

            var str = this.textStr;
            if(this.coordsX.length > str.length){
                var offset = ~~(this.coordsX.length / str.length);
                var x = cx[0];
                var y = cy[0];
                for(var i = 0,j = offset;i < str.length;i++,j += offset){
                    var c = str[i];
                    var mx = cx[j];
                    var my = cy[j];

                    var angle = Math.atan2(my - y,mx - x);
                    ctx.save();
                    ctx.translate(x,y);
                    ctx.rotate(angle);
                    ctx.fillText(c,0,0);
                    ctx.restore();

                    x = mx;
                    y = my;

                }
            }
        }
    };

    p.getTextValue = function(){
        if(this.text){
            return this.text.text;
        }
    };

    createjs.EditLineText = EditLineText;

    return EditLineText;
});