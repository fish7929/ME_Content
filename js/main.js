//js库配置
//加载所需的依赖包
//全局对象引用
window.app = {
    views : {},
    routers : {},
    models : {}
};
require.config({
    //开发模式下给地址加动态参数
    //防止缓存
    urlArgs: "bust=" + (new Date()).getTime(),
	shim: {
		underscore: {
			exports : '_'
		},
		backbone: {
			deps : [
				'underscore',
				'jquery'
			],
			exports : 'Backbone'
		},
		backboneLocalstorage : {
			deps : ['backbone'],
			exports: 'Store'
		},
        touchSwipe : {
            deps : ['jquery'],
            exports : "jquery"
        },
        swipejs : {
            deps : ['jquery'],
            exports : 'jquery'
        },
        jqtap : {
            deps : ['jquery'],
            exports : 'jquery'
        }
	},
	paths: {
		jquery: 'lib/jquery',
		iscroll: "lib/iscroll",
        utils : "utils/utils",
		underscore: 'lib/underscore',
		backbone: 'lib/backbone/backbone',
		backboneLocalstorage: 'lib/backbone/backbone.localStorage',
		text: 'lib/require/text',
        easeljs : "lib/easeljs-0.7.1.min",
        fastClick : "lib/fastclick",
        touchSwipe : "lib/jquery.touchSwipe",
        swipejs : 'lib/swipe',
        masonry : "lib/jquery.masonry",
        infinitescroll : "lib/jquery.infinitescroll",
        imagesLoaded : "lib/jquery.imagesloaded",
        jqmobile : "lib/jquery-mobile/jquery.mobile-1.4.4"
//        jqTouch : "lib/jquery.mobile"
//        jqtap : "lib/jquery.tap"

	}
});

window.screenInfo = {};

//应用程序入口
require([
    'jquery',
    'routers/AppRouter',
    'utils',
    "touchSwipe",
    "common/vs",
    "common/displayobject_manager",
    "common/render/include",
    'swipejs'
], function($,AppRouter,ut,fastClick) {

    if(!window.topEvent){
        window.topEvent = $({});
    }

    $(document).bind("mobileinit", function () {
        $.mobile.ajaxEnabled = false;
        $.mobile.linkBindingEnabled = false;
        $.mobile.hashListeningEnabled = false;
        $.mobile.pushStateEnabled = false;
        $.event.special.tap.tapholdThreshold = 1200;

//        $.event.special.swipe.horizontalDistanceThreshold = 100; // 修改触发 swipe 事件的最小水平拖曳距离为 100(px)
//        $.event.special.swipe.verticalDistanceThreshold = 120; // 修改触发 swipe 事件的最大垂直拖曳距离为 120 (px)
    });

    window.onerror = function(message, url, line) {
        if (!url) return;
        var msg = {};

        //记录客户端环境
        msg.ua = window.navigator.userAgent;

        //只记录message里的message属性就好了，
        //错误信息可能会比较晦涩，有些信息完全无用，应酌情过滤
        msg.message = message.message;
        msg.url = url;
        msg.line = line;
        msg.page = window.location.href;

        var s = [];

        var str = ""

        //将错误信息转换成字符串
        for (var key in msg) {
            str += (key + '=' + msg[key] + "\n");
        }
        alert(str)
    };

    require(['jqmobile'],function(){
        $(document).ready(function(){
//            require(['views/loading/loading_view']);
            app.routers.appRouter = new AppRouter();
//        fastClick.attach(document.body);
//        console.log($.mobile)
            Backbone.history.start();
            //console.log(this)
            var height = $(this).height();
            //保存屏幕的原始宽高信息
            window.screenInfo.screenWidth = $(this).width;
            window.screenInfo.screenHeight = height;
            $(window).resize(function(){
                window.currentHeight = $(this).height();
                //console.log("wheight:" + window.innerHeight,"currentHeight:" + window.currentHeight);
                window.heightDiff = height - window.currentHeight;
                topEvent.trigger("windowresize",{currHeight:window.currentHeight,imHeight:window.heightDiff});
            });
        });

        //jquery mobile在初始化时 会把body下原有的元素删除，所以在这里加进去
        var log = $("<div id='log' style='position: absolute;top: 0;top: 0;pointer-events:none" +
            "z-index: 999;color: #ffffff;font-size:26px'></div>");

        var images = $("<div id='loadImage' style='display: none'>"+
                       "<img id='xuanzhuan' src='images/skin/xuanzhuan.png'>"+
                       "<img id='guanbi' src='images/skin/cha.png'>"+
                       "<img id='addtext' src='images/skin/xinzeng.png'>"+
                       "</div>");

        $(document.body).append(log);
        $(document.body).append(images);
    });
});
