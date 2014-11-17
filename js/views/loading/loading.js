define([
	"jquery",
	"views/base_view",
	"text!templates/loading/loading.html"
	],function($,BaseView,loadingTpl){

		var LoadingView = app.views.LoadingView = BaseView.extend({
			id : "loading",
			template : _.template(loadingTpl),
			isHelp:false,
			initialize : function(){
			},
			changeView:function(b){
				//undefined:加载,1:跳广场,0:不跳 b,true:help
				if(window.localStorage.isLoadIndex==1&&!b){
					window.location.href  = "#fma/square";
				}else{
					$(this.el).html(this.template).show();
				}
				this.isHelp = b?b:false;			
				if(this.isHelp){
					$(this.el).html(this.template).show();
					$(this.el).find("button").hide();
					$(this.el).find("a").css("visibility","visible");
				}
			},
			render : function(options){
				this.constructor.__super__.render.apply(this,[options]);
			},
			remove : function(){
				$(this.el).remove();
			},
			pageIn : function(){
				//初始化引导图
				new Swipe(document.getElementById('slider'), {
					startSlide: 0,
					speed: 400,
					auto: 0,
					continuous: false,
					disableScroll: false,
					stopPropagation: false,
					callback: function(index, elem) {
				//find and remove "active" class
				$("#slider").find("aside.active").removeClass("active");
				//add class "active";
				$("aside").eq(elem.dataset.index).addClass("active");
			},
			transitionEnd: function(index, elem) {}
		});
				// //绑定返回按钮
				// $("section").on("tap",function(){
				// 	app.routers.appRouter.navigate("#fma/slider",{replace:true,trigger:true});
				// })
			}
		});
		return LoadingView;
	})
		function start(){
			window.localStorage.isLoadIndex = 1;
			window.location.href = "#fma/square";
		}