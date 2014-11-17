/**
 * 世界页
 * 世界/广场，显示推荐作品
 * @author chenshy
 * @date 2014-08-21
 */
define([
    "jquery",
    "views/base_view",
    "text!templates/fma_ui_square.html",
    "masonry",
    "imagesLoaded"
],function($, BaseView,fmaWorldTpl,wookmark){
	
	var SquareView = app.views.SquareView = BaseView.extend({

		//tagName : "div",
		id : "fma_a_square",
		template : _.template(fmaWorldTpl),
        iScroll : null,
        sectionIScroll : null,
        inited : false,
        dataload : false,
        curpage: 0,
        initialized:false,

		initialize : function(){
            if ( !! this.initialized ){
                return;
            }

            this.initialized = true;
            $(this.el).html(this.template);
            var self = this;

            //热门广场
            this.hotSquare = null;
            //主题广场
            this.topicSquare = null;
            //摇一摇
            this.shakeSquare = null;

            this.currentSquare = null;
            this.currentNavTab = null;

            this.banner = null;
            this.bannerSwipe = null;

            //modified by QC.Y 2014/9/18

            $(document).ready(function() {

                var $container = $("#infinite_scroll");
                $container.masonry({
                    columnWidth: 200,
                    itemSelector: '.warterbox',
                    isAnimated: true,//使用jquery的布局变化  Boolean
                    animationOptions: {
                        //jquery animate属性 渐变效果  Object { queue: false, duration: 500 }
                    },
                    gutterWidth: 0,//列的间隙 Integer
                    isFitWidth: true,// 适应宽度   Boolean
                    isResizableL: true,// 是否可调整大小 Boolean
                    isRTL: false,//使用从右到左的布局 Boolean
                });
            });
            //end modified

	    },
        navTabClick : function(e){
            var li = $(e.target);
            var tab = li.attr("tab");
            var tab2 = this.currentNavTab.attr("tab");
            if(tab != tab2){
                this.currentNavTab.removeClass("square_nav_selected");
                li.addClass("square_nav_selected");
                this.currentNavTab = li;

                var c = null;
                switch (tab){
                    case "1":
                        c = this.hotSquare;
                        break;
                    case "2":
                        c = this.topicSquare;
                        break;
                    case "3":
                        c = this.shakeSquare;
                        break;
                }
                //console.log(this.topicSquare)
                //var self = this;
                this.currentSquare.hide();
                    c.show();

                this.currentSquare = c;
            }
        },
	    render : function(options){

            this.constructor.__super__.render.apply(this,[options]);

            //modified by YC.Q 2014/9/20
//            $(this.el).html(this.template);
//            this.init();

            if(!this.inited){
                this.init();
                this.inited = true;
            }
            //end modifieds
	    },
	    remove : function(){
	    	$(this.el).detach();
	    },
        init : function(){
            var self = this;
            setTimeout(function(){

                $("#tomakebn").click(function(){
                    app.routers.appRouter.navigate("fma/make",{replace:true,trigger:true});
                });

                //选项卡
                self.navTab = $("#square_nav");


                self.hotSquare = $("#hot_square");
                self.topicSquare = $("#topic_square");
                self.shakeSquare = $("#shake_square");

                self.currentSquare = self.hotSquare;
                self.currentNavTab = $("#square_nav > li:first");

                self.navTab = $("#square_nav");
                self.navTab.click(function(e){
//                    console.log("click")

                    self.navTabClick(e);
                });

                $("#infinite_scroll").click(function(e){
                    self.waterScrollClick(e);
                });

            },0);
        },

        pageIn : function(){

            if ( ! this.dataload ){
                this.loadScrollData();
                this.dataload = true;
            }
            else {

                $("#infinite_scroll").masonry('reloadItems');
            }
        },

        loadMasonryData: function(){
            var self = this;
            fma_data.querySalePos(
                3,
                this.curpage * fma_waterpage_size,
                fma_waterpage_size,
                function (arr) {
                    if ( arr.length == 0 ){
                        self.curpage=1;
                    }else {
                        self.appendWaterData(arr);
                    }
                },
                function (err) {
                    //console.log(err.code + ":" + err.message);
                });

        },

        loadScrollData: function(){

            var self = this;
            if(!this.sectionIScroll){
                //照片墙的滚动条
                this.sectionIScroll = new IScroll('#fall_wrapper', {
                    tap:true,
                    click:true,
                    mouseWheel:true, scrollbars:true,
//                    fadeScrollbars:true,
//                    interactiveScrollbars:false,
//                    keyBindings:false,
                    bindToWrapper : true
                });

                self.sectionIScroll.on("scrollLimit",function() {
                    //console.log("scrollLimit");
                    self.loadMasonryData();
                });

            }

            //modified by QY.C 2014/9/18
            //照片墙数据，先暂时这样写吧
            this.loadMasonryData();

            //banner
            fma_data.queryByField("sale_pos", 1, "sale_pos", false, 0, 3, function (data) {
                //                console.log(data)
                self.resetBannerData(data)
            }, function (data) {
                //console.log(data)
            });
            //end modified

        },

        /**
         * 瀑布流数据
         * @param arr
         */
        appendWaterData : function(arr){
            var html_all = "";

            //modified by QY.C 2014/9/18
            //console.log("查到模版数:"+arr.length);

            for(var i=0;i<arr.length;i++){
                var tpl = arr[i];
                var img = fmacapi.tpl_effect_img_url(tpl);

                var html = "<div class='warterbox'>";
                html += "<img tpl_id='"+tpl.get("tpl_id")+"' alt='"+tpl.get("name")+"' src='"+img+"' />";
                html += "</div>";

                html_all += html;
            }

            var self = this;
            var $container = $("#infinite_scroll");
            //console.log("curpage:"+this.curpage);

            var $newElems = $(html_all);
            $container.append($newElems);


            $container.imagesLoaded(function () {
                //console.log(self.curpage);
                if(self.curpage==0){
                    //console.log("0");
                    $container.masonry("appended",$newElems);
                }else{
                    //console.log("1");
                    $container.masonry("appended",$newElems);
                }
                self.sectionIScroll.refresh();
                self.curpage++;
            });
        },

        /**
         * 渲染banner数据
         * @param arr
         */
        resetBannerData : function(arr){
            var html = "";
            var ulHtml = "";
            var p = 100 / arr.length;
            var self = this;
            var count = arr.length;
            var index = 0;
            for(var i=0;i<arr.length;i++){
                var tpl = arr[i];
                var imgUrl = fmacapi.tpl_effect_img_url(tpl);
//                console.log(img)

                var img = new Image();
                var s = "";

                //modified by QY.C 2014/9/19
                img.onload = function(){
                    index++;
                    if(this.width > this.height){
                        s = "100% auto";
                    }else{
                        s = "auto 100%";
                    }

//                    console.log("count:"+count+",index:"+index+"img:"+this.src);
                    html += "<div tpl_id='"+arr[index-1].get("tpl_id")+"' style='background:url("+this.src+") no-repeat center;background-size:"+s+"' >";
                    html += "</div>";

                    if(count == index){
                        self.bannerImageLoaded(html);
                    }
                };
                //end modified

                img.src = imgUrl;

                if(i == 0){
                    ulHtml += "<li class='dotli_selected' style='width: "+p+"%'></li>";
                }else{
                    ulHtml += "<li style='width: "+p+"%'></li>";
                }
                $("#banner_ul").html(ulHtml);
            }


        },

        bannerImageLoaded : function(html){
            $("#banner_scroller").html(html);


            var lis = $("#bannerdot").find("ul > li");

            //banner
            self.banner = $("#banner_wrapper");

            self.bannerSwipe = Swipe(self.banner.get(0),{
                auto: 3000,
                continuous: true,
                callback: function(pos) {

                    var i = lis.size();
                    while (i--) {
                        lis.get(i).className = ' ';
                    }
                    if(lis.get(pos)){
                        lis.get(pos).className = 'dotli_selected';
                    }
                }
            });
        },

        waterScrollClick : function(e){
//            console.log(e.target)
            var tplId = $(e.target).attr("tpl_id");
            var img = $(e.target).attr("src");
//            console.log(img)
            if(tplId){
                utils.tmpImage = img;
                app.routers.appRouter.navigate("fma/reading/" + tplId,{replace:true,trigger:true});
            }
        },
        /**
         * 初始化广场数据
         */
        initData : function(){

        }
	});
	return SquareView;
});
