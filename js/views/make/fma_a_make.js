// 文件名称: fma_a_make.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/21
// 描    述: 作品制作模块
define([
    "jquery",
    "views/base_view",
    "text!templates/fma_ui_make.html",
    "utils",
    "common/script_parser",
    "common/renderer",
    "tmp/testScript",
    "views/make/pic_scroll",
    "views/make/font_ui",
    "views/make/pic_frame",
    "views/make/watermark",
    "common/render/include",
    "views/make/mask_ui",
    "views/make/text_input_ui",
    "views/make/watermark_edit",
    "views/make/footer",
    "views/make/default",
    "views/make/photo_select",
    "common/tpldata_manager",
    "lib/move"
],function($,BaseView,fmaMakeTpl,ut,ScriptParser,Renderer,testScript,PicScroll,
           FontUI,PicFrame,
           WaterMark,createjs,MaskUI,TextInputUI,WaterMarkEdit,
           Footer,Default,PhotoSelect,tpldata_manager,move){

    var MakeView;
    MakeView = app.views.MakeView = BaseView.extend({
        //tagName : "div",
        id: "fma_a_make",
        template: _.template(fmaMakeTpl),

        originImage: null,//原始图片
        renderer: null,//渲染器
        scriptParser: null,
        offscreenStage: null,//离屏canvas
        offscreenRenderer: null,//离屏canvas绘图环境
        canvas: null,
        context: null,
        imageScale: 1,
        fontUI: null,//字体UI
        jsonObject: {}, //脚本
        inited: false,

        //bnFooteron: null,//脚部显示按钮
        section: null,
        header:  null,
        footer: null,

        picScroll: null,
        maskUI: null,//蒙罩UI
        textInputUI: null,//文本输入UI
        waterMarkEdit: null,//水印编辑界面

        inputBnOk: null, //输入框确定按钮
        displayObjects: [],
        originDisplayObjects: [],
        frameScroll: null, //框滚动
        waterMark: null,//水印滚动
        isMouseDown: false,
        moveTimeSpace: 0,

        draggingObject: null,//当前正在拖动的对象
        opObject: null,//当前正在操作的对象
        allowDragging: true,//当前环境是否允许拖动
        bnDrawLine: null,
        //当前是否处于画线状态
        drawing: false,
        //是全屏预览状态(所有菜单都被隐藏)
        isFullPreview: true,
        //非全屏状态下的画布缩放比例
        canvas_scale: 1,

        //保存分享按钮
        bnSaveOrShare : null,

        //当前工作菜单
        curMenu : null,
        curMenuEl : null,
        //正在切换菜单的过程中
        isSwitchingMenu : false,

        //是否保留数据
        KeepData : false,
		//判断水印显示
		type2 : null,
        initialize: function () {
            $(this.el).html(this.template);
        },

    ////////////////////////////////////////////////////////
    //
    // 初始化
    //
    ////////////////////////////////////////////////////////

        init: function () {
            //初始化事件
            //脚部菜单显示开关
            //this.bnFooteron = $("#defaulton");

			app.makeView = this;

            /**
             * 画线按钮
             * @type {*|jQuery|HTMLElement}
             */
            this.bnDrawLine = $("#drawline");

            this.header = $("#makeheader");
            this.footer = new Footer(this);
            //this.Default = new Default(this);
            this.section = $("#makesection");
            this.picScroll = new PicScroll(this);

            this.inputDiv = $("#input_div");
            this.inputBnOk = $("#input_div > a");

            //画框
            this.picFrame = new PicFrame(this);
            $(this.el).append(this.picFrame.el);
            this.picFrame.initScroll();

            this.fontUI = new FontUI(this);
            $(this.el).append(this.fontUI.el);
            this.fontUI.initScroll();

            this.waterMark = new WaterMark(this);
            $(this.el).append(this.waterMark.el);
            this.waterMark.initScroll();

            //蒙罩
            this.maskUI = new MaskUI(this);
            $(this.el).append(this.maskUI.el);
            this.maskUI.initScroll();

            //蒙罩
            this.textInputUI = new TextInputUI(this);
            $(document.body).append(this.textInputUI.el);
            this.textInputUI.initScroll();

            //水印编辑界面
            this.waterMarkEdit = new WaterMarkEdit(this);
            $(this.el).append(this.waterMarkEdit.el);
            this.waterMarkEdit.initScroll();

            //相机选择界面
            this.photoSelect = new PhotoSelect(this);
            this.$el.append(this.photoSelect.el);

//            this.bnBackToSquare = $("#back_to_square");
            this.bnSaveOrShare = $(".make_save_share");

            //设置默认的当前菜单
            this.setCurMenu( this.isDirectMake()? this.picScroll : this.footer);
            this.MenuReset(this.header,"top");

            var self = this;

//            canvas.on("taphold", {
//                duration: 100
//            }, function () {
//                self.onTaphold();
//            });

            var makesection = $("#makesection");
            makesection.on("tap",function(e){

                var canvas = $("#makecanvas");
                var secwidth = makesection.width();
                var secheight = makesection.height();
                var marginX = (secwidth-canvas.width()*self.canvas_scale)/2;
                var marginY = (secheight-canvas.height()*self.canvas_scale)/2;

                if ( ! self.isFullPreview &&
                    (e.pageX <  marginX ||
                    e.pageX > secwidth-marginX ||
                      e.pageY < marginY ||
                        e.pageY > secheight-marginY) &&
                    e.pageY > self.header.height() &&
                    e.pageY < secheight - self.curMenuEl.height() ) {

                    topEvent.trigger(EventConstant.SHOW_OR_HIDE_MENU,e);

                }

            });

            topEvent.bind(EventConstant.SHOW_PHOTO_CHANGE,function(e,data){
                self.onTaphold();
            });

            topEvent.bind(EventConstant.SHOW_OR_HIDE_MENU,function (e,data) {
				self.type2 = data.type2;
				if(self.type2 == "watermark"){
					self.type2 = "stamp";
				}
	
                if (self.isFullPreview) {
                    self.isFullPreview = false;
                    self.showCurMenu();
					//点击不同类型水印，选中不同类型
					if (self.type2){
						self.waterMark.changeWaterMark(self.type2);
					}
                } else {
                    setTimeout(function () {
                        if (!DisplayObjectManager.clickedObject) {
                            DisplayObjectManager.setAllSelected(false);
                            self.isFullPreview = true;
                            self.hideCurMenu();
                            self.scaleNormalCanvas.apply(self);
                        }
                        DisplayObjectManager.clickedObject = false;
						//点击不同类型水印，选中不同类型
						if (self.type2){
							self.waterMark.changeWaterMark(self.type2);
						}
                        //隐藏二级菜单,文字切换再次点击的时候
                        $("#font_ui").css({visibility:"hidden"});
						
                    }, 100);
                }
            });

            //console.log(this.maskUI)
            var hide = function(){
              self.onhide();
            };

            this.maskUI.onhide = hide;
            this.picFrame.onhide = hide;
            this.waterMark.onhide = hide;
            this.picScroll.onhide = hide;
            this.fontUI.onhide = hide;

            this.textInputUI.onhide = function(){

                if (self.opObject && self.opObject.getSelected
                        && self.opObject.type == "edittext" ) {

                    self.startSwitchMenu();
                    self.showTextEdit();
                    self.endSwitchMenu();

                }else{
                    self.onhide();
                }
            };

            /**
             * 监听文本点击事件
             */
            topEvent.bind(EventConstant.DISPLAYOBJECT_CLICK, function (e, data) {
                self.clickHandle(e, data);
            });

            /**
             * 监听显示对象双击事件
             */
            topEvent.bind(EventConstant.DISPLAYOBJECT_DBLCLICK, function (e, data) {
                self.dblClickHandle(e, data);
            });

            /**
             * 监听显示对象删除
             */
            topEvent.bind(EventConstant.DISPLAYOBJECT_REMOVED, function (e, data) {
                self.displayObjectRemoved(e, data);
            });

            //事件监听
            //this.bnFooteron.on("click",function () {
            //    self.showFooter();
            //});

            this.bnSaveOrShare.unbind("mouseup").on("mouseup", function (e) {
                e.stopPropagation();
                self.onSaveOrShare();
            });

            $("#pic_list_div").on("touchmove", function (e) {
                e.preventDefault();
            });

            //            this.bnBackToSquare.on("click",function(){
            //               self.onBackToSquare();
            //            });

            //文字输入确定按钮事件
            this.inputBnOk.on("mouseup",function () {
                self.createNewText();
            });

            this.bnDrawLine.on("mouseup", function () {
                //self.onDrawLine();
				app.makeView.showInputText();
            });

            this.inited = true;
        },

        onhide : function () {

            var self = this;
            //如果不是正在切换菜单，则将当前菜单设置为footer
            if ( ! self.isSwitchingMenu ) {

                if (!self.isFullPreview) {

                    self.showFooter();
                }

                self.footer.currentShow = self.footer;
            }
        },

        initRenderer: function (script,boolKeepMenu) {
            var self = this;
            if (self.renderer) {
                this.renderer.dispose();
                this.renderer = null;
                self.displayObjects = [];
            }

            TplDataManager.currentTplData = script;

            setTimeout(function () {
                var items;
                items = script.get("pages");

                var item = items[0];
                var itemWidth = item.get("page_width") || 640;
                var itemHeight = item.get("page_height") || 1136;

                //图形界面 的最大宽度和高度
                var sectionWidth = $("#makesection").width();
                var sectionHeight = $("#makesection").height();

                VS.init(sectionWidth,sectionHeight,itemWidth, itemHeight);

                var canvas = $("#makecanvas").attr("width", VS.canvasWidth).attr("height", VS.canvasHeight)
                    .css({"marginTop": (sectionHeight - VS.canvasHeight) / 2}).get(0);

                self.canvas = canvas;
                self.context = canvas.getContext("2d");

                //初始化
                var renderer = new Renderer(canvas);
                self.scriptParser = new ScriptParser(script);

                DisplayObjectManager.init(renderer);

                var displayObjects = self.scriptParser.getDisplayObjects();
                self.renderer = renderer;

                DisplayObjectManager.scaleObjects(displayObjects);
                DisplayObjectManager.addObjects(displayObjects);

                utils.endPageLoading();
            }, 0);
        },

    ////////////////////////////////////////////////////////
    //
    // 实用功能
    //
    ////////////////////////////////////////////////////////

        //是否直接进入制作页
        isDirectMake: function(){

            return this.tplId === "d19c4b38114cd2d1" || this.tplId === "94ae33cda0e990c7";
        },

        /**
         * 删除显示对象
         * @param e
         * @param data
         * @private
         */
        displayObjectRemoved: function (e, data) {
            var len = this.displayObjects.length;
            for (var i = 0; i < len; i++) {
                if (this.displayObjects[i] == data) {
                    this.displayObjects.splice(i, 1);
                    break;
                }
            }
        },

        createNewText: function () {

        },

        /**
         * 创建新对象时，获取一个位置
         */
        getNewIndex: function () {
            //如果当前的选中的对象，新的位置在选中的对象之上
            if (this.opObject) {
                for (var i = 0; i < this.displayObjects; i++) {
                    if (this.opObject == this.displayObjects[i]) {
                        return i + 1;
                    }
                }
            }
            return this.displayObjects.length;
        },

        /**
         * 添加显示对象，自动判断位置
         */
        autoAddDisplayObject: function (obj) {
            var index = this.getNewIndex();
            this.addDisplayObject(obj, index);
        },

        /**
         * 添加一个对象到指定位置
         * @param displayObject
         * @param index
         */
        addDisplayObject: function (displayObject, index) {
            if (index) {
                this.renderer.addObject(displayObject, index);
                this.displayObjects.splice(index, 0, displayObject);
            } else {

                this.renderer.addObject(displayObject);
                this.displayObjects.push(displayObject);
            }
        },

    ////////////////////////////////////////////////////////
    //
    // UI事件处理
    //
    ////////////////////////////////////////////////////////


        /**
         * 文本点击事件
         * @param e
         * @param data
         */
        clickHandle: function (e, data) {
            if (this.opObject && this.opObject.getSelected) {
                this.opObject.setSelected(false);
            }

            this.opObject = data;

            if(this.opObject.setSelected){
                this.opObject.setSelected(true);
            }
            if (this.opObject.type == "edittext") {

                if ( this.getCurMenu() != this.fontUI ){

                    this.startSwitchMenu();
                    this.hideCurMenu();
                    this.showTextEdit();
                    this.endSwitchMenu();
                }

            } else if (this.opObject.type == "editwatermark") {

                this.showWaterMark();
            }
        },

        /**
         * 双击事件
         * @param e
         * @param data
         */
        dblClickHandle: function (e, data) {
            if (this.opObject && this.opObject.getSelected) {
                this.opObject.setSelected(false);
            }

            this.opObject = data;

            this.opObject.setSelected(true);
            if (this.opObject.type == "edittext" || this.opObject.type == "editlinetext") {

                this.showInputText();
            }
        },

        //路径文字
        onDrawLine: function () {
            if (!this.drawing) {
//                console.log("drawline")
                var dr = new createjs.EditLineText();
                DisplayObjectManager.add(dr);
            }
        },

        render: function (options) {
            if ( this.KeepData ) {

                $(this.el).show();

            }else {
                utils.beginPageLoading(this.id,"#fma/reading/" + this.tplId);
                this.constructor.__super__.render.apply(this, [options]);
                var self = this;
                if (!this.inited) {
                    setTimeout(function () {
                        self.init();
                    }, 0);
                }

                setTimeout(function () {
                    if (!self.tplId) {
                        self.initRenderer(testScript,true);
                        //console.log("ddd");
                    }

                }, 0);
            }


        },

        /*
         *返回到广场
         */
        onBackToSquare : function(){

            //清除canvas
            this.context.fillStyle = "#292b2d";
            this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
            app.routers.appRouter.navigate("fma/square",{replace:true,trigger:true});
        },

        /**
         * 保存分享
         */
        onSaveOrShare : function(){
              var self = this;
              DisplayObjectManager.setAllSelected(false);
            _.delay(function(){
                try {
                    var canvas = $("#makecanvas").get(0);
                    DisplayObjectManager.effect_img = canvas.toDataURL("image/png", 1);
                }catch(e){
                    alert(e.message);
                }

                self.KeepData = true;
                app.routers.appRouter.navigate("fma/save",{replace:false,trigger:true});
            },1);
//            }
        },

        onTaphold : function(){
            var curObj = DisplayObjectManager.currentDisplayObject;

            if ( curObj == null ){
                curObj = DisplayObjectManager.getObject(0);//获取背景元素
                DisplayObjectManager.setCurrentDisplayObject(curObj);
            }

            if(curObj && curObj.type == "editbitmap"){

                this.photoSelect.show(function(img){
                    curObj.setImageData(img);
                });
            }
        },

        setTplId : function(id){
            this.tplId = id;
        },

    ////////////////////////////////////////////////////////
    //
    // 视图事件处理
    //
    ////////////////////////////////////////////////////////

        /**
         * 页面移除时释放
         */
        remove: function () {

            if ( this.KeepData ) {
                $(this.el).hide();
            }else{
                this.$el.detach();
                if (this.renderer) {
                    //console.log("render")
                    this.renderer.dispose();
                    this.renderer = null;
                }
                this.displayObjects = [];

                this.context.fillStyle = "#292b2d";
                this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }

//            this.inited = false;
        },

        pageIn: function () {

            if ( this.KeepData ) {

                this.KeepData = false;

            }else {

                var self = this;
                if (this.tplId) {
                    $("#back_to_reading").attr("href", "#fma/reading/" + this.tplId);
                    fmacapi.tpl_get_data(this.tplId, function (data) {

                        self.initRenderer(data);
                    }, function () {
                    });
                }
                //返回一级菜单事件
                $(".back_menu>nav>nav").on("tap", function () {

                    self.hideCurMenu();
                    self.showFooter();
                    DisplayObjectManager.setAllSelected(false);
                });

                //选择画框/水印，关闭按钮事件
                $("#pic_list_close").on("tap", function (e) {
                    $("#pic_list_div").hide();
                    //清除背景模糊
                    $("body").find(".filter40").removeClass("filter40");
                });

                $("#pic_list_div>section").on("touchmove", function (e) {
                    e.stopPropagation();
                });
            }
        },


    ////////////////////////////////////////////////////////
    //
    // 功能菜单显示封装
    //
    ////////////////////////////////////////////////////////


        //顶部菜单的显示
        showHeader: function () {
            this.MenuIn(this.header);
        },

        hideHeader: function(){
            this.MenuOut(this.header);
        },

        //底部菜单的显示
        showFooter: function () {

            this.setCurMenu(this.footer);
            this.showCurMenu();
        },

        //显示文本编辑菜单
        showTextEdit: function () {

            if ( this.getCurMenu() == this.fontUI ) {
                return;
            }

            //$("#footeron").css({display: "none"});
            $("#cmpClose").css({display: "block"});
            $(".font_ui").find(".active").removeClass("active");
            //$("#font_ui").css("visibility","hidden")

            this.fontUI.set_font_size(parseInt(this.opObject.userData.get("font_size")));
            this.fontUI.set_alpha(parseInt(this.opObject.userData.get("item_opacity")) / 100);
            if (this.opObject.userData.get("line_height"))
            {
                this.fontUI.set_row_spacing(parseInt(this.opObject.userData.get("line_height")));
            }
            else
            {
                this.fontUI.set_row_spacing(1);
            }

            this.setCurMenu(this.fontUI);
            this.showCurMenu();
        },

        /**
         * 显示水印编辑菜单
         */
        showWaterMark : function(){

            this.switchCurMenuTo(this.waterMark);
        },

        //显示文字输入菜单
        showInputText: function () {

            this.switchCurMenuTo(this.textInputUI);
        },


    ////////////////////////////////////////////////////////
    //
    // Canvas缩放
    //
    ////////////////////////////////////////////////////////


        //缩放canvas与菜单适应
        scaleSmallCanvas: function () {

			return;

            //设备高度
            var deviceHeight = document.body.clientHeight;

            //顶部菜单高度
            //只有一级菜单才显示顶部菜单
            var headerHeight = this.getCurMenu()==this.footer? this.header.height():0;

            //底部菜单高度
            var footerHeight = this.getCurMenuEl().height();

            //初始canvas高度
            var origCanvasHeight = this.canvas.height;

            //缩放后的canvas高度
            var newCanvasHeight = deviceHeight - (headerHeight + footerHeight);

            //缩放比例及顶部位置
            var scale;
            var top = headerHeight;

            if ( newCanvasHeight < origCanvasHeight ){
                //缩放并移动
                scale = newCanvasHeight/origCanvasHeight;

                //减去缩放本身产生的位移
                top -= (origCanvasHeight-newCanvasHeight)/2;

            }else{
                //无需缩放,但需移动位置
                scale = 1;
                top += (newCanvasHeight-deviceHeight)/2;
            }

            //缩放对移位的补偿
            top /= scale;
            this.canvas_scale = scale;

            move("#makecanvas").scale(scale).y(top).end();
        },
        //恢复Canvas
        scaleNormalCanvas:function(){
            move("#makecanvas").scale(1).y(0).end();
        },
        //Canvas特殊切换效果
        scaleSpecialCanvas:function(callback){

            move("#makecanvas")
                .translate(0,document.body.clientHeight)
                .rotate(180)
                .scale(0.01)
                .then(callback)
                .end();
        },

    ////////////////////////////////////////////////////////
    //
    // 当前工作菜单及相关处理
    //
    ////////////////////////////////////////////////////////

        //设置当前工作菜单,仅设置指向对象而不改变显示
        setCurMenu: function (menu){

            this.curMenu = menu;
        },

        //获取当前工作菜单
        getCurMenu: function(){

            return this.curMenu;
        },

        //获取当前工作菜单的div对象
        getCurMenuEl: function(){

            return this.curMenuEl;
        },

        //切换当前工作菜单至指定的菜单，并改变显示
        switchCurMenuTo:function(curMenu){

            if ( this.getCurMenu() != curMenu ){

                this.startSwitchMenu();
                this.hideCurMenu();
                this.setCurMenu(curMenu);
                this.showCurMenu();
                this.endSwitchMenu();
            }
        },

        //设置菜单切换状态
        startSwitchMenu:function(){
            this.isSwitchingMenu = true;
        },
        //结束菜单切换状态
        endSwitchMenu:function(){
            this.isSwitchingMenu = false;
        },

        //显示当前工作菜单并调整画布缩放
        showCurMenu:function(){

            this.curMenu.show();
            if ( this.curMenu == this.footer){
                if(this.header.offset().top<0) {
                    this.showHeader();
                }
            }else {
                if(this.header.offset().top>=0) {
                    this.hideHeader();
                }
            }

            if ( this.curMenu != this.textInputUI ){

                this.scaleSmallCanvas.apply(this);
            }
        },

        //隐藏当前工作菜单
        hideCurMenu:function(){

            this.curMenu.hide();
            if(this.header.offset().top>=0) {
                this.hideHeader();
            }
        },

        //重置指定菜单，使之停靠到指定位置(top,bottom)
        MenuReset : function(menuel,position){

            position = position || "bottom";
            if (position == "bottom") {
                menuel.css("top", document.body.clientHeight +"px");
            }else{
                menuel.css("top",-menuel.height()+"px");
            }
        },

        //显示指定菜单
        MenuIn : function(menuel){

            var dy = menuel==this.header ? menuel.height() :  -menuel.height();

            menuel.stop(true,true).css(
                {"transition":"-webkit-transform 0.3s",
                    "-webkit-transform":"translate3d(0px,"+dy+"px,0px)"
                });

            if ( menuel != this.header ) {
                this.curMenuEl  = menuel;
            }
        },

        //隐藏指定菜单
        MenuOut : function(menuel){

            menuel.stop(true,true).css(
                {"transition":"-webkit-transform 0.3s",
                    "-webkit-transform":"translate3d(0px,0px,0px)"
                });

        }

    });
    return MakeView;
});