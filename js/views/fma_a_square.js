// 全局定义变量
var g_variable = new Object();

// 平台
g_variable.platform = "IOS";

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
    "lib/jquery.infinitescroll",
    "imagesLoaded"
],function($, BaseView,fmaWorldTpl,wookmark){
	
	var SquareView = app.views.SquareView = BaseView.extend({

		//tagName : "div",
		id : "fma_a_square",
		template : _.template(fmaWorldTpl),
        iScroll : null,
        sectionIScroll : null,
        inited : false,

        /* add 2014-9-26 ~ 16.50 mistery */
        setInteval_flips : null,
        /* add 2014-9-26 ~ 16.50 mistery end */
        /**
         * change 将 tpl对象定义为 高一级的局部变量  便与随机翻转图片
         */
        tpl_ids : null,

        dataload : [false,false],
        curpage: [0,0],
        data_finish : [false,false],
        page_loading : [false,false],
        area:[{"id":'#infinite_scroll',"type":3},
                {"id":'#topic_square',"type":4}],
        scrollId : "fall_wrapper",
        
        initScrollPosition : $("#pageContent").attr("data-position") || 0,
		initialize : function(){
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

            window.global_tpl_obj_arr = [];

            document.addEventListener('touchmove', function (e){

                var target = e.target;
//                debug.error("name:"+target.tagName+",id:"+target.id);
//                if ( target.type != "range"
//                    && target.tagName != "IMG"
//                    && target.tagName != "DIV"){
//
//                    e.preventDefault();
//                }
                var tname = target.tagName;
                while (target.id == undefined || target.id=="") {
                    target = target.parentNode;
                }

                var targetId = target.id;
//                debug.error("targetname:"+ tname + ",id:" + targetId);

                if (e.target.type != "range") {
                    switch (targetId) {
                        case "infinite_scroll":
                        case "topic_square":
                        case "infinite_scroll_topic":
                            break;
                        default:
                        		if( targetId.substr(0,9)!="water_div"){
                                e.preventDefault();
                            }
                            break;
                    }
                }
            },
            false);
	    },

        pageIn : function(){
        		$(this.el).find("img").css({"visibility":"initial"});
            if ( ! this.dataload[this.getCurSquareIndex()] ){
                this.loadScrollData();
                this.dataload[this.getCurSquareIndex()] = true;
            }
            else {
                $(this.getCurAreaId()).masonry('reloadItems');
            }
            
           	$("#"+self.scrollId).scrollTop(self.initScrollPosition);
        },
	    render : function(options){

            this.constructor.__super__.render.apply(this,[options]);

            if(!this.inited){
                this.init();
                this.inited = true;
            }

            /* add mistery */
            this.initData();
            /* add mistery end */
	    },
	    remove : function(){
	    	$("#pageContent").attr("data-position",this.initScrollPosition);
	    	//$(this.el).detach();
	    	$(this.el).find("img").css({"visibility":"hidden"});
	    },
        init : function(){
            var self = this;
            setTimeout(function(){

                $(".tomakebn img").on("tap",function(){
                    app.routers.appRouter.navigate("fma/make/"+(parseInt(Math.random()*10)>=5?"94ae33cda0e990c7":"d19c4b38114cd2d1"),{replace:true,trigger:true});
                });

                //选项卡
                self.navTab = $("#square_nav");

                
                self.hotSquare = $("#hot_square");
                //焦点图
                self.hotSquareTop = $("#hot_square .banner");
                /* change 2014-9-26 mistery
                $("#hot_square") -> $("#hot_square .banner") */
              	
                /* add 2014-9-26 ~ 15.49 mistery */
                self.hotSquareTop.on("click",function(e){
                    var cur_tpl_id = $(e.target).attr("tpl_id");
                    app.routers.appRouter.navigate("fma/make/"+cur_tpl_id,{replace:true,trigger:true});
                });
                /* add 2014-9-26 ~ 15.49 mistery end */

                self.topicSquare = $("#topic_square");
                self.shakeSquare = $("#shake_square");

                self.currentSquare = self.hotSquare;
                self.currentNavTab = $("#square_nav > li:first");

                self.navTab = $("#square_nav");
                self.navTab.on("click",function(e){
                    self.navTabClick(e);
                });

                $("#infinite_scroll").on("click",function(e){
                    self.waterScrollClick(e);
                });
                
                $("#infinite_scroll_topic").on("click",function(e){
                		self.topicClick(e);
                });
                
            },0);
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
                
                this.currentSquare.css({"display":"none"});
                c.css({"display":"block"});
                
                this.currentSquare = c;
                
                if ( this.currentSquare == this.topicSquare ){
                    this.pageIn();
                }
                // add mistery 
                c!=this.hotSquare?this.removePullUpId(this.scrollId):this.loadImgByPullUpId(this.scrollId,"pullUp");
           			
            }
            
        },

        getCurSquareIndex : function() {
	     return 0;
            //var tab = this.currentNavTab.attr("tab");
            //return tab==2?1:0;
        },

        getCurAreaId : function(){

            return this.area[this.getCurSquareIndex()].id;
        },

        getCurTplType : function(){

            return this.area[this.getCurSquareIndex()].type;
        },

        getCurPageNo : function(){
            return this.curpage[this.getCurSquareIndex()];
        },

        setCurPageNo : function(pageno){
            this.curpage[this.getCurSquareIndex()] = pageno;
        },

        loadMasonryData: function(){

            var self = this;

            //如果正在加载新页的过程中，则忽略请求，不予处理
            if ( !! self.page_loading[self.getCurSquareIndex()] ) return;

            //如果数据已全部加载完成，则不予处理
            if ( !! self.data_finish[self.getCurSquareIndex()] ) return;

            //设置正在加载新页的标记(防重入)
            self.page_loading[self.getCurSquareIndex()] = true;

            fma_data.querySalePos(
                this.getCurTplType(),
                    this.getCurPageNo() * fma_waterpage_size,
                fma_waterpage_size,
                function (arr) {

                    //console.log("==============");
                    //console.log("page:"+self.getCurPageNo()+"arr.length:"+arr.length);
                    //for(i=0;i<arr.length;i++){
                    //    console.log("  "+arr[i].get("tpl_id"));
                    //}
                    
                    if (arr.length < fma_waterpage_size) {
                        self.data_finish[self.getCurSquareIndex()] = true;
                    }

                    if (arr.length == 0) {
                        //self.setCurPageNo( 1 );
                        self.page_loading[self.getCurSquareIndex()] = false;

                    } else {
                        window.global_tpl_obj_arr = window.global_tpl_obj_arr.concat(arr);
                        self.appendWaterData(arr);
                    }
                },
                function (err) {

                    alert("查询模版失败，原因是："+err.message);
                });
        },

        loadScrollData: function(){

            var self = this;
//            if(!this.sectionIScroll){
//                //照片墙的滚动条
//
//                this.sectionIScroll = new IScroll('#fall_wrapper', {
//                    tap:true,
//                    click:true,
//                    mouseWheel:true, scrollbars:false,
////                    fadeScrollbars:true,
////                    interactiveScrollbars:false,
////                    keyBindings:false,
//                    bindToWrapper : true
//                    //momentum: false,
//                    //useTransition: true
//                    //useTransform: false
//
//                });
//
//                self.sectionIScroll.on("scrollLimit",function() {
//                    self.loadMasonryData();
//                });
//
//            }

            //modified by QY.C 2014/9/18
            //照片墙数据，先暂时这样写吧
            this.loadMasonryData();

            if ( this.currentSquare == this.hotSquare ) {

                //banner
                fma_data.queryByField("sale_pos", 2, "sale_pos", false, 0, 3, function (data) {

					//console.log("banner:"+data.length);
                    self.resetBannerData(data);
					
                }, function (data) {

                });
                //end modified
            }

        },

        /**
         * 瀑布流数据
         * @param arr
         */
        appendWaterData : function(arr){
            var html_all = utils.reWaterData(arr,"infinite_scroll",3,null);
            var $newElems = $(html_all);
            var self = this;
            var $container = $(this.getCurAreaId());
            if ( $container == undefined ){
                alert("id:"+this.getCurAreaId());
            }
            $container.append($newElems);
            if(self.getCurPageNo()==0){
                $container.masonry();
            }else{
                $container.masonry("appended",$newElems );
            }
            self.setCurPageNo( self.getCurPageNo()+1 );
            //完成新页加载
            self.page_loading[self.getCurSquareIndex()] = false;
            
            // lazy img
           	$(".lm").loadingLazy({
	    					container : $("#fall_wrapper"),
	    					callback : function(e){
	    							$(this).removeClass("lm");
	    					}
	    			});
	    			
        },

        /* add 2014-9-26 ~ 16.24 mistery */
        /**
         * 广场图片随机翻转
         * @param selected 选择器
         * @param content 背面显示的内容
         * @param href 翻转后卡片的链接地址
         * @param opaction css式样
         * @param times 背面的持续时间
         */
        flips : function(selected,content,href,opaction,times){
            if(!selected) return;
            var se = $(selected).parent(),img = se.find("img"),i_h = img.height(),
                i_w = img.width(),p = se.find("p");
            p.on("click",function(){
                app.routers.appRouter.navigate(href, {replace:true,trigger:true});
            }).css({
                "width" : i_w, "height" : i_h, "background" : "rgb(108, 114, 160)", "color" : "#ccc"
            }).find("b").css({
                "width" : i_w > i_h ? "initial" : "2em"
            }).html(content);
            for(var pro in opaction){
                if(pro == "transition")
                    img.css(pro,opaction[pro]);
                p.css(pro,opaction[pro]);
            };

            img.css({"-webkit-transform" : "rotateY(180deg)"});
            p.css({"-webkit-transform" : "rotateY(0deg)"});
            var a = setTimeout(function(){
                img.css({"-webkit-transform" : "rotateY(0deg)"});
                p.css({"-webkit-transform" : "rotateY(-180deg)"});
            },times ? times*1000 : 3000)

        },
        /* add 2014-9-26 ~ 16.24 mistery end */


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

                    html += "<div tpl_id='"+arr[index-1].get("tpl_id")+"' style='background:url("+this.src+") no-repeat center;background-size:"+s+"' >";
                    html += "</div>";

                    if(count == index){
                        self.bannerImageLoaded(html);
                    }
                };
                //end modified

                img.src = imgUrl;

                if(i == 0){
                    ulHtml += "<li class='dotli_selected' style='width: "+p+"%'><span></span></li>";
                    //banner_point
                }else{
                    ulHtml += "<li class='dotli_select' style='width: "+p+"%'><span></span></li>";
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
                        lis.get(i).className = 'dotli_select';
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

        /* add setinterval  */

        beginSetInterval : function(times){
            /* add 2014-9-26 mistery   定时器  */
            var self = this;
            if($("#infinite_scroll")==null) return false;
                self.setInteval_flips =
                    setInterval(function(){
                        var imgtpl_id1 = Math.abs(Math.round(Math.random()*self.tpl_ids.length-1));
                        //console.log(imgtpl_id1 + "--" + imgtpl_id2);
                        var href = "fma/type";
                        self.flips(
                                "[tpl_id='"+self.tpl_ids[imgtpl_id1].one+"']",
                            self.tpl_ids[imgtpl_id1].two,
                            href,
                            {background:"#009E96",color:"#fff"},
                            8
                        );
                    },times);
            /* add 2014-9-26 mistery    定时器    end */
        },

        /**
         * 初始化广场数据
         */
        initData : function(){
            //this.beginSetInterval(7500);
            this.loadImgByPullUpId(this.scrollId,"pullUp");
        },
        /* add mistery waterLoadImage */
        loadImgByPullUpId : function(scrolls,show){
            //console.log(scrolls+" scroll 事件");
            var scrollUp = document.getElementById(scrolls),
            	isShow = document.getElementById(show),
            	pageCount = document.getElementById("pageContent");
            	self = this;
            scrollUp.onscroll = function(e){
            		self.initScrollPosition = this.scrollTop;
                if(this.scrollTop+this.clientHeight < this.scrollHeight-isShow.clientHeight) return false;
                if(!self.data_finish[self.getCurSquareIndex()]){
                	self.loadMasonryData();
                }else{
            			this.onscroll = function(e){
		            		self.initScrollPosition = this.scrollTop;
            			};
            			document.getElementById("pullUp").getElementsByTagName("span")[0].innerHTML = "没有更多内容了";
            		}
            };
            //this.loadMasonryData();
        },
        
        removePullUpId : function(scrolls){
        		var scrollUp = document.getElementById(scrolls);
        		scrollUp.onscroll = null;
        },
        
        topicClick : function(e){
        		var tag = $(e.target).attr("alt");
            if(tag){
                app.routers.appRouter.navigate("fma/topic/" + tag,{replace:true,trigger:true});
            }
        }
	});
	return SquareView;
});
