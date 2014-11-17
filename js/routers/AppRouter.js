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
'views/fma_a_topic'

], function( $, _,Backbone,
appView,
SettingHome,
SaveView,
SettingAbout,
SettingManager,
SettingFeedBack,
SquareTopic

) {
	//负责主要视图的切换
	var AppRouter = Backbone.Router.extend({
		views : [],
		prePage : null,
		showingPage : null,
		//add mistery 初始化之后的侧边拦对象
		initNavObj : appView.getView("SliderView"),
		// add mistery end
		gotoSlideButton : "[href='#fma/slider']",
		//add mistery
		//遮挡页面 的ID
		pageMaskId : "maskId",
		initialize : function(){
			var self = this;
			//监听窗体隐藏
			$(document).on('pagehide', function (event, ui) {
				if(self.prePage){
					if(self.prePage.remove){
						self.prePage.remove();
					}
					$(event.target).detach();
				}
			});
			
			//监听窗体显示，过场动画完成后触发
			$(document).on('pageshow', function (event, ui) {
				appView.gotoNav($("#"+self.initNavObj.id),$("#pageContent"),true);
				if(self.showingPage){
					if(self.showingPage.pageIn){
						self.showingPage.pageIn();
					}
				}
				// add mistery 绑定其它页面的点击事件   data-url-slider="true"
				self.bindShowNavButton(self.gotoSlideButton);
			});
			
			//add mistery  改变DOM树结构,实现侧边栏效果
			$(document.body).append($("<div id='pageContent'><div id="+ self.pageMaskId +" style='position:absolute;width:100%;height:100%;z-index:10;display:none'></div></div>"));

			//add mistery initNAV in this page
			this.initNav(this.initNavObj);
			//add mistery end
		},
		//路由规则
		routes:{
			"" : "home",
			"fma/square" : "square", //#fmaworld 世界页
			"fma/make/:id" : "make",    //#fmamake 制作页
			"fma/make" : "make",
			"fma/reading/:id" : "reading", //阅读页
			"fma/type" : "type",       //分类页
			"fma/slider" : "slider",
			"fma/setting_home" : "settingHome", //设置页
			"fma/setting_about" : "settingAbout", //关于页 fma_a_setting_manager.js
			"fma/setting_manager" : "settingManager",
			"fma/save" : "save",
			"fma/setting_feedback" : "settingFeedBack",
			"fma/help" : "help",
			"fma/topic/:tag" : "squareTopic"
		},

		home : function(){
			// this.navigate("loading",{replace:true,trigger:true});
			var view = appView.getView("LoadingView");
			view.changeView(false);
			this.changePage(view);
		},

		loading:function(){
			var view = appView.getView("LoadingView");
			this.changePage(view);
		},

		/*广场页*/
		square : function(){
			var view = appView.getView("SquareView");
			this.changePage(view);
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

		changePage : function(page){
        self = this;
        this.prePage = this.showingPage;
        this.showingPage = page;
        $(page.el).attr('data-role', 'page');
        $('#pageContent').append($(page.el));
        if(this.isTopPage()){
        		appView.gotoNav($("#"+self.initNavObj.id),$("#pageContent"),false);
            $.mobile.defaultPageTransition = "none";
        }else{
            $.mobile.defaultPageTransition = "slide"; //fade slide
        }
        $.mobile.changePage($(page.el), {changeHash:true});
        page.render();
    },
    
		initNav : function(page,val){
			$('body').append($(page.el));
			page.render();
			this.bindNavClick("#"+page.id + " a");
		},
		
		bindShowNavButton : function(val){
			var self = this;
			if(!val) return false;
			$(val).unbind("click").click(function(){
					appView.gotoNav($("#"+self.initNavObj.id),$("#pageContent"));
					return false;
			});
		},
		//给侧边拦的 链接绑定 隐藏侧边拦事件
		bindNavClick : function(val){
			var self = this;
			if(!val) return false;
			$(val).click(function(){
				appView.gotoNav($("#"+self.initNavObj.id),$("#pageContent"),true);
			});
			$("#"+self.pageMaskId).click(function(){
				$(self.gotoSlideButton).click();
			});
		},
		
		isTopPage : function(){
				var p = [
					"",
					"loading",		//帮助
					"feedback",				//回馈
					"fma_a_square",		//主题
					"setting_about"		//关于
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
