define([
	'jquery',
	'iscroll',
    'views/base_view',
    'views/fma_a_square',
    'views/make/fma_a_make',
    'views/fma_a_display',
    'views/fma_a_type',
    'views/nav/fma_a_slider',
    'views/loading/loading'
], function($,IScroll,BaseView,
            SquareView,//世界视图
            MakeView, //作品制作页
            DisplayView, //作品显示
            TypeView,
            SliderView,
            LoadingView
    ) {

	var AppView = BaseView.extend({
//		className: 'wrapper',
        el : "#appContainer",
        viewObjects : {},//存放视图实例对象
        scroller : null,
        mainViews : [],
        sheep : .35,
        navIsShow: false,
        
        //上一次打开的页面
        prePage: null,
        showingPage : null,
        
        //过场动画完成之后是否删除之前的页面 
        aniend_RemovePage: true,
        setAniend_RemovePage: function(val){
        	this.aniend_RemovePage = val;
        },
	//视图初始化
	initialize: function() {
            var self = this;
            this.$el.swipe({
                triggerOnTouchEnd : true,
                swipeStatus : function(event, phase, direction, distance, fingers){
                    self.swipeStatus(event, phase, direction, distance, fingers);
                },
                allowPageScroll:"vertical"
            });

            this.scroller = this.$el.find("#appScroller");
            var sliderView = new SliderView();
            var sview = new SquareView();
            var makeView = new MakeView();
            this.mainViews = [sview,makeView];

	},
        
        /**
        *	name : 跳转效果
        *	reverse : 是否反转
        *	toPage : 目标页面
        *	fromPage : 跳转页面
        */
    changePage : function(name,reverse,toPage){
			this.prePage = this.showingPage;
			this.showingPage = toPage;
			this.animationEnd(toPage);
			this.animationEnd(this.prePage);
			this.transition(name,reverse,toPage,this.prePage);
    },
        /* 添加动画
        
        *	格式:  (slide,fide..) , (reverse,null) , toPage( : in ), fromPage( : out )
        */
    transition : function(name,reverse,to,from){
			//$(to).trigger(EventConstant.ANIMATION_BEFORE,this);
			reverseClass = reverse ? " reverse" : "";
			$(from).addClass(name + " out" + reverseClass);
			$(to).addClass(name + " in" + reverseClass);
			$(to).addClass("show");
			setTimeout(function() {
				$(to).removeClass("hide");
			}, 0)
    },
        /* 动画完成之后 
        	参数2 : name  是在动画完成之后给 OUT 页面的一个 css name
        */
    animationEnd : function(page){
			var self = this;
			$(page).off("webkitAnimationEnd");
			$(page).on("webkitAnimationEnd",function(e){
				// in  out
				var ino = $(this).attr("class");
				if(ino.indexOf(" in") > 0 ){  
					$(this).removeClass();
					$(this).addClass("ui_view_transitioning ui_page");
					//触发 page show 事件
					$(this).trigger(EventConstant.PAGE_SHOW,this);
				}else{
					$(this).removeClass();
					$(this).addClass("ui_view_transitioning ui_page hide");
					//触发  page hide 事件
					$(this).trigger(EventConstant.PAGE_HIDE,this);
				}
			});
    },
        
        
        
        getView : function(viewName){
            if(this.viewObjects[viewName]){
                return this.viewObjects[viewName];
            }
            var viewClass = app.views[viewName];
            if(viewClass){
                var viewObject = new viewClass;
                this.viewObjects[viewName] = viewObject;
                return viewObject;
            }
            return null;
        },
        fadeMainMenu : function(toShow){
            var style = null;
            if ( !!toShow ) {
                style = "translate3d(0px,0px,0px)";
            }
            else {
                style = "translate3d(-50%,-10%,0px) scale3d(.5,.5,.5)";
            }
            $("#mainmenu_div").css(
                {"transition":"-webkit-transform "+this.sheep+"s",
                    "-webkit-transform":style
                });
        },
        
        gotoNav : function(view,pre,blo){
        		if(blo!=null)
        			this.navIsShow = blo?true:false;
						if(!!this.navIsShow){
								pre.find("#maskId").stop(true,true).hide();
								pre.stop(true,true).css(
										{"transition":"-webkit-transform " + this.sheep+"s"
											,"-webkit-transform":"translate3d(0%,0px,0px)"
										});
								this.navIsShow = false;
		            this.fadeMainMenu(this.navIsShow);
		            return this.navIsShow;
						}else{
								pre.find("#maskId").stop(true,true).show();
		            pre.stop(true,true).css(
		                {"transition":"-webkit-transform "+this.sheep+"s",
		                 "-webkit-transform":"translate3d(60%,0,0) perspective(200px) rotateY(-15deg)"
		                });
		            this.navIsShow = true;
		            this.fadeMainMenu(this.navIsShow);
		            return this.navIsShow;
	          }
        },
	//nav:导行拦  other:侧边拦(广场页面,主题页面等)
		//blo true || false  nav的状态
   	gotoNav1 : function(nav,other,blo){
   		this.gotoNavAnimationEnd(nav);
			if(blo != null)
				this.navIsShow = blo;
			if(!this.navIsShow){ // 需要显示
				nav
					.removeClass("sl_animation navHide navHideAni")
						.addClass("sl_animation navShow navShowAni");
				other.find("#maskId").stop(true,true).show();
				other.children()
					.removeClass("sl_animation pageShow pageShowAni")
						.addClass("sl_animation pageHide pageHideAni");
				this.navIsShow = true;
			}else{
				nav
					.removeClass("sl_animation navShow navShowAni")
						.addClass("sl_animation navHide navHideAni");
				other.find("#maskId").stop(true,true).hide();
				other.children()
					.removeClass("sl_animation pageHide pageHideAni")
						.addClass("sl_animation pageShow pageShowAni");
				
				this.navIsShow = false;
			}
  	},
  	gotoNavAnimationEnd : function(page){
			var p = $(page);
			p.off("webkitAnimationEnd");
			p.on("webkitAnimationEnd",function(){
					var t = $(this);
					t.removeClass("navHideAni navShowAni");
			});
  	}
	});

	return new AppView();
});
