define([
'jquery',
'underscore',
'backbone',
'views/app',
'views/setting/fma_a_setting_home',
'views/make/fma_a_save',
'views/setting/fma_a_setting_about',
'views/setting/fma_a_setting_manager',
'views/setting/fma_a_setting_feedback',
'views/fma_a_topic',
'views/nav/fma_a_slider'

], function( $, _,Backbone,
appView,
SettingHome,
SaveView,
SettingAbout,
SettingManager,
SettingFeedBack,
SquareTopic,
SliderView

) {
	//负责主要视图的切换
	var AppRouter = Backbone.Router.extend({
		views : [],
		prePage : null,
		showingPage : null,
		initialize : function(){
			var self = this;
			
			var isInit = false;
			//监听窗体显示，过场动画完成后触发
			$(document).on(EventConstant.PAGE_SHOW, function(e){
				console.log(" page show event ");
				if(self.showingPage){
					if(self.showingPage.pageIn){
						self.showingPage.pageIn();
					}
				}
			});
			
			//监听窗体隐藏
			$(document).on(EventConstant.PAGE_HIDE, function(e){
				e.stopPropagation();
				if(e.target.id == "fma_a_square"){
					return false;
				}
				if(self.prePage){
					if(self.prePage.remove){
						self.prePage.remove();
					}
					$(event.target).detach();
				}
			});
			
			//监听侧边拦动画开始之前
			//$(document)
			
			$("#pageContent").on("click",function(e){
				var h = e.target;
				if(h.href != null || h.id == "maskId"){
					if((h+"").indexOf("#fma/slider") > 1){
						appView.gotoNav($("#mainmenu_div"),$("#pageContent"));
						h = null;
						return false;
					}
					if(h.id == "maskId"){
						appView.gotoNav($("#mainmenu_div"),$("#pageContent"),true);
					}
				}
				h = null;
			});
			
			this.initNav(appView.getView("SliderView"), appView.getView("SquareView"));
			
			//监听侧边拦的点击事件
			$("#mainmenu_div a").on("click",function(e){
				appView.gotoNav($("#mainmenu_div"),$("#pageContent"),true);
			});
		},
		//路由规则
		routes:{
			"" : "home",
			"fma/square" : "square", //#fmaworld 世界页
			"fma/make/:id" : "make",    //#fmamake 制作页
			"fma/make" : "make",
			"fma/reading/:id" : "reading", //阅读页
			"fma/type" : "type",       //分类页
			"fma/slider" : "sliderView",
			"fma/setting_home" : "settingHome", //设置页
			"fma/setting_about" : "settingAbout", //关于页 fma_a_setting_manager.js
			"fma/setting_manager" : "settingManager",
			"fma/save" : "save",
			"fma/setting_feedback" : "settingFeedBack",
			"fma/help" : "help",
			"fma/topic/:tag" : "squareTopic"
		},

		home : function(){
//			var view = appView.getView("LoadingView");
//			view.changeView(false);
//			this.changePage(view);
			this.navigate("fma/square",{replace:true,trigger:true});
		},
		
		loading:function(){
			var view = appView.getView("LoadingView");
			this.changePage(view);
		},

		/*广场页*/
		square : function(){
			var view = appView.getView("SquareView");
			this.changePage(view,true);
		},

		/*制作页*/
		make : function(id){
			var view = appView.getView("MakeView");
			view.setTplId(id);
			this.changePage(view);
		},
		/*阅读页*/
		reading : function(id){
			var view = appView.getView("DisplayView");
			view.setTplId(id);
			this.changePage(view);
		},
		/*类型*/
		type : function(){
			var view = appView.getView("TypeView");
			this.changePage(view);
		},
		
//		sliderView : function(){
//			var view = new SliderView();
//			this.changePage(view,"nav");
//		},

		/*设置页首页*/
		settingHome : function(){
			var view = new SettingHome();
			this.changePage(view);
		},
		/*设置页首页*/
		save : function(){
			var view = new SaveView();
			this.changePage(view);
		},
		/**关于页**/
		settingAbout : function(){
			var view = new SettingAbout();
			this.changePage(view);
		},
		/**设置管理中心**/
		settingManager : function(){
			var view = new SettingManager();
			this.changePage(view);
		},

		/** 反馈页 **/
		settingFeedBack : function() {
			var view = new SettingFeedBack();
			this.changePage(view);
		},

		help : function(){
			var view = appView.getView("LoadingView");
			view.changeView(true);
			this.changePage(view);
		},
		
		squareTopic : function(tag){
			var view = new SquareTopic();
			view.setTag(tag);
			this.changePage(view);
		},

		changePage : function(page,bl){
			this.prePage = this.showingPage;
			this.showingPage = page;
			if(!bl) $('#pageContent').append($(page.el));
			if(this.isTopPage()){
				appView.changePage("none","",$(page.el));
			}else{
				appView.changePage("slide","",$(page.el));
			}
			page.render();
		},
    
		initNav : function(page,page2){
			// 默认加载  侧边拦
  		$("body").append($(page.el));
  		page.render();
  		appView.gotoNav($("#mainmenu_div"),$("#pageContent"),true);
  		// 默认加载  广场页
  		$('#pageContent').append($(page2.el));
		},
		// 判断是否和侧边拦有关联
		isTopPage : function(){
			var p = [
				"",
				"loading",				//帮助
				"feedback",				//回馈
				"setting_about",	//关于
				"fma_a_square"		//主题
			],
				self = this,
				a = self.prePage ? self.prePage.id : "",
				c = self.showingPage.id,
				b = [false,false]
			;
		
			for(var i = p.length-1; i ;i--){
				if(a==p[i])
					b[0] = true;
				if(c==p[i])
					b[1] = true;
			}
			return b[0]==b[1]?b[0]:false;
		}
	});
	return AppRouter;
});
