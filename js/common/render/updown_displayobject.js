// 文件名称: updown_displayobject
//
// 创 建 人: chenshy
// 创建日期: 2014/11/15 15:39
// 描    述: 改变层号的显示对象
define([
    'jquery',
    'easeljs'
],function($,c){
    var UpDownComponent  = function(){
        this.type = createjs.UpDownComponent.TYPE;
        this.initialize();
    };

    var p = UpDownComponent.prototype = new createjs.Container();

    p.Container_initialize = p.initialize;

    p.initialize = function(){
        this.upButton = null;
        this.upButtonHelper = null;
        this.downButton = null;
        this.downButtonHelper = null;
        this.tempMove = null;

        //当前操作的对象
        this.operationObject = null;

        var self = this;
        var spriteSheet;
        utils.loadImage("images/skin/make/xia-1.png",function(img) {
            spriteSheet = new createjs.SpriteSheet({
                images: [img],
                frames: {width:84, height:55},
                animations: { out: 0, over: 1, down: 1 }
            });

            self.downButton = new createjs.Sprite(spriteSheet, "up");
            self.addChild(self.downButton).set({x:0, y:0});
            self.downButtonHelper = new createjs.ButtonHelper(self.downButton);

            self.downButton.on("click", function() {
                topEvent.trigger(EventConstant.CHANGE_DISPLAYOBJECT_LAYER,[self.operationObject,"down"]);
            });
        });

        utils.loadImage("images/skin/make/sh-2.png",function(img) {
            spriteSheet = new createjs.SpriteSheet({
                images: [img],
                frames: {width:84, height:55},
                animations: { out: 0, over: 1, down: 1 }
            });
            self.upButton = new createjs.Sprite(spriteSheet, "up");
            self.addChild(self.upButton).set({x:84, y:0});
            self.upButtonHelper = new createjs.ButtonHelper(self.upButton);
            self.upButton.on("click", function() {
                topEvent.trigger(EventConstant.CHANGE_DISPLAYOBJECT_LAYER,[self.operationObject,"up"]);
            });
        });
    };

    p.setOperationObject = function(obj){
//        console.log(obj);
        if(this.operationObject){
            this.operationObject.onmove = this.tempMove;
            this.tempMove = null;
            this.operationObject = null;
        }
        this.operationObject = obj;
        this.tempMove = this.operationObject.onmove;
        var self = this;
        this.operationObject.onmove = function(x,y){
            self.tempMove.call(self.operationObject,x,y);
            self.onOperationObjectMove(x,y);
        };
        this.updateCurrPosition();
    };

    p.updateCurrPosition = function(){
        var x = this.operationObject.x;
        var y = this.operationObject.y;
        var rect = this.operationObject.getRectBounds();
        if(rect){
            var w = 168;
            x = x - w / 2;
            y = y - rect.height;

        }
            this.x = x;
            this.y = y;
    };

    p.onOperationObjectMove = function(x,y){
        this.updateCurrPosition();
    };

    p.hide = function(){
        if(this.parent){
            this.parent.removeChild(this);
        }
        if(this.operationObject){
            this.operationObject.onmove = this.tempMove;
            this.tempMove = null;
            this.operationObject = null;
        }
    };

    createjs.UpDownComponent = UpDownComponent;

    createjs.UpDownComponent.TYPE = "UpDownComponent";

    return UpDownComponent;
});