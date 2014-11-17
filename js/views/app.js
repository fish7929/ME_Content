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
        currentView : null,
        viewObjects : {},//存放视图实例对象
        scroller : null,
        mainViews : [],
        history : [],
        sheep : 300,
        navIsShow: false,
		//视图初始化
		initialize: function() {
            //console.log(this.$el.swipe)
            var self = this;
            this.$el.swipe({
                triggerOnTouchEnd : true,
                swipeStatus : function(event, phase, direction, distance, fingers){
                    self.swipeStatus(event, phase, direction, distance, fingers);
                },
                allowPageScroll:"vertical"
            });

            this.scroller = this.$el.find("#appScroller");

            //程序启动时，优先实例化的对象
            var sliderView = new SliderView();
            var sview = new SquareView();
            var makeView = new MakeView();
            // var loadingView = new LoadingView();
//            this.viewObjects["SliderView"] = sliderView;
//            this.viewObjects["SquareView"] = sview;
//            this.viewObjects["MakeView"] = makeView;
//
//            this.scroller.append(sliderView.$el);
//            this.scroller.append(sview.$el);
//            this.scroller.append(makeView.$el);

            this.mainViews = [sliderView,sview,makeView];

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
                style = "translate3d(-50%,-10%,0) scale3d(0.5,0.5,0.5)";
            }

            $("#mainmenu_div").css(
                {"transition":"-webkit-transform "+this.sheep/1000+"s",
                    "-webkit-transform":style
                });
        },
            
		//view:导行拦  pre:侧边拦(广场页面,主题页面等)
			//blo true 导行拦显示,  fales 广场页面显示
        gotoNav : function(view,pre,blo,sheep){
        		if(blo!=null)
        			this.navIsShow = blo;
						if(!this.navIsShow){
								pre.find("#maskId").stop(true,true).show();
		            pre.children().stop(true,true).css(
		                {"transition":"-webkit-transform " + (sheep==null?this.sheep/1000:sheep) + "s",
		                 "-webkit-transform":"translate3d(60%,0,0) perspective(200px) rotateY(-15deg)"
		                });
		            this.fadeMainMenu(true);
		            return this.navIsShow = true;
						}else{
								pre.find("#maskId").stop(true,true).hide();
								pre.children().stop(true,true).css(
										{"transition":"-webkit-transform " + (sheep==null?this.sheep/1000:sheep) + "s"
											,"-webkit-transform":"translate3d(0%,0px,0px)"
										});
		            this.fadeMainMenu(false);
		            return this.navIsShow = false;
	          }
        }
	});

	return new AppView();
});
