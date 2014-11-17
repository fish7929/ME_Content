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

        bnFooteron: null,//脚部显示按钮
        section: null,
        header:  null,
        footer: null,
        footHeight: 112,

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

        //保存分享按钮
        bnSaveOrShare : null,

        initialize: function () {
            $(this.el).html(this.template);
        },

        init: function () {
            //初始化事件
            //脚部菜单显示开关
            this.bnFooteron = $("#defaulton");

			app.makeView = this;

            /**
             * 当前正在显示的菜单
             * @type {null}
             */
            this.currentShow = null;

            /**
             * 画线按钮
             * @type {*|jQuery|HTMLElement}
             */
            this.bnDrawLine = $("#drawline");

            this.header = $("#makeheader");
            this.footer = new Footer(this);
            this.Default = new Default(this);
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

            var self = this;

            var canvas = $("#makecanvas");

            canvas.on("taphold", {
                duration: 100
            }, function () {
                self.onTaphold();
            });

            canvas.on("tap", function () {

                if (self.isFullPreview) {
                    self.showHeader();
                    self.showFooter();
                    self.isFullPreview = false;
                    self.scaleSmallCanvas.apply(self);
                } else {
                    setTimeout(function () {
                        if (!DisplayObjectManager.clickedObject) {
                            DisplayObjectManager.setAllSelected(false);
                            self.hideAllFooterMenu();
                            self.hideHeader();
                            self.isFullPreview = true;
                            self.scaleNormalCanvas.apply(self);
                        }
                        DisplayObjectManager.clickedObject = false;
                    }, 100);
                }
            });

            var hide = function () {
                self.footer.show();
                self.footer.currentShow = self.footer;
            };

            //console.log(this.maskUI)

            this.maskUI.onhide = hide;
            this.picFrame.onhide = hide;
            this.waterMark.onhide = hide;
            this.picScroll.onhide = hide;
            this.textInputUI.onhide = hide;
            this.fontUI.onhide = hide;

            this.picScroll.onHide = function () {
                //self.setSectionHeight(-150);
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
            this.bnFooteron.on("click",function () {
                self.showFooter();
            });

            this.bnSaveOrShare.unbind("tap").on("tap", function (e) {
                e.stopPropagation();
                self.onSaveOrShare();
            });

            $("#pic_list_div").on("touchmove", function (e) {
                e.preventDefault();
            })

            //            this.bnBackToSquare.on("click",function(){
            //               self.onBackToSquare();
            //            });

            //文字输入确定按钮事件
            this.inputBnOk.on("click",function () {
                self.createNewText();
            });

            this.bnDrawLine.on("tap", function () {
                //self.onDrawLine();
				app.makeView.showInputText();
            });

            this.inited = true;
        },

        //缩放canvas
        scaleSmallCanvas: function () {
            //设备高度
            var deviceHeight = screen.height * window.devicePixelRatio;
            //缩放比
            var scale = (deviceHeight - 100 - this.footHeight) / deviceHeight;
            //不缩放的情况
            if (this.canvas.height < deviceHeight * scale) {
                return;
            }
            var canvasHeight = this.canvas.height * scale * 0.95;
            var top = ~ (deviceHeight - canvasHeight) / 2 + 100;
            move("#makecanvas").scale(scale * .95).y(top).end();
        },
        scaleNormalCanvas:function(){
            move("#makecanvas").scale(1).y(0).end();
        },

        //顶部菜单的显示隐藏
        showHeader: function () {
            this.header.show();
        },

        //底部菜单的显示隐藏
        showFooter: function () {
            this.Default.hide();
            this.footer.show();
            //    this.showHeader();
        },

        //显示文本编辑
        showTextEdit: function () {
            $("#footeron").css({display: "none"});
            $("#cmpClose").css({display: "block"});
            $(".font_ui").find(".active").removeClass("active");
            $("#font_ui").css("visibility","hidden")
            this.fontUI.show();
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
            this.showHeader();
        },

        /**
         * 显示水印编辑界面
         */
        showWaterMarkEdit: function () {
            $("#footeron").css({display: "none"});
            $("#watermarkedit_on").css({display: "block"});
            this.waterMarkEdit.show();
            this.showHeader();
        },

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
                this.hideAllFooterMenu();
                this.showTextEdit();
            } else if (this.opObject.type == "editwatermark") {
                this.hideAllFooterMenu();
                this.waterMark.show();
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
                this.hideAllFooterMenu();
                this.showInputText();
            }
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

        //显示输入框
        showInputText: function () {
            this.textInputUI.show();
        },

        setSectionHeight: function (height) {
            this.section.css({"height": this.section.height() + height});
            this.initRenderer();
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
                
                /* add mistery */
		            utils.pageLoading(self.id,true);
            }, 0);

            //    if (!boolKeepMenu) {
            //        this.hideMenu();
            //        this.footer.show();
            //        this.Default.hide();
            //        this.showHeader();
            //    }
            //判断是不是直接进入制作页
            if (this.tplId === "d19c4b38114cd2d1" || this.tplId === "94ae33cda0e990c7") {
                self.hideAllFooterMenu();
                self.picScroll.show();
            };

        },

        hideHeader: function(){
            //console.log("hideheader");
            this.header.removeClass("showmakeheader");
            this.header.addClass("hidemakeheader");
        },


        hideWaterMark: function () {
            $("#footeron").css({display: "block"});
            $("#watermark_on").css({display: "none"});
            this.waterMark.hide();
        },

        hideWaterMarkEdit: function () {
            $("#footeron").css({display: "block"});
            $("#watermarkedit_on").css({display: "none"});
            this.waterMarkEdit.hide();
            this.displayFooter();
        },

        onDrawLine: function () {
            if (!this.drawing) {
//                console.log("drawline")
                var dr = new createjs.EditLineText();
                DisplayObjectManager.add(dr);
            }
        },

        hideAllFooterMenu : function(){
            this.maskUI.hide();
            //this.textInputUI.hide();
            this.picFrame.hide();
            this.waterMark.hide();
            this.waterMarkEdit.hide();
            this.picScroll.hide();
            this.fontUI.hide();
            this.footer.hide();
        },

        hideMenu : function(){
            this.hideAllFooterMenu();
            this.hideHeader();
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

        render: function (options) {
        		utils.pageLoading(this.id);
            this.constructor.__super__.render.apply(this, [options]);
            var self = this;
            if (!this.inited) {
                setTimeout(function () {
                    self.init();
                }, 0);
            }

            setTimeout(function(){
                if(!self.tplId){
                    self.initRenderer(testScript);
                }
            },0);
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
        /**
         * 页面移除时释放
         */
        remove: function () {
            this.$el.detach();
            if (this.renderer) {
                //console.log("render")
                this.renderer.dispose();
                this.renderer = null;
            }
            this.displayObjects = [];

            this.context.fillStyle = "#292b2d";
            this.context.fillRect(0,0,this.canvas.width, this.canvas.height);

//            this.inited = false;
        },
        pageIn: function () {
            var self = this;
            if (this.tplId) {
                var href = this.tplId === "d19c4b38114cd2d1" || this.tplId === "94ae33cda0e990c7" ? "#fma/square" : "#fma/reading/" + this.tplId;
                $("#back_to_reading").attr("href", href);
                fmacapi.tpl_get_data(this.tplId, function (data) {
                    //console.log(data);
                    self.initRenderer(data);
                },function(){});
            }
            //返回一级菜单事件
            $(".back_menu>nav>nav").on("click", function () {
                self.hideAllFooterMenu();
                self.showFooter();
				DisplayObjectManager.setAllSelected(false);
            })

            //选择画框/水印，关闭按钮事件
            $("#pic_list_close").on("click", function (e) {
                $("#pic_list_div").hide();
                //清除背景模糊
                    $("body").find(".filter40").removeClass("filter40");
            })

            $("#pic_list_div>section").on("touchmove",function(e){
                e.stopPropagation();
            })
        }
    });
    return MakeView;
});