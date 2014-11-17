// 文件名称: fma_a_topic.js
//
// 创 建 人: mistery
// 创建日期: 2014/10/27
// 描    述: 主题
define([
    "jquery",
    "views/base_view",
    "text!templates/fma_ui_topic.html",
    "masonry"
],function($, BaseView,fmaTypeTpl,masonry){

    var HelpView = app.views.SquareTopic = BaseView.extend({
        id : "fma_ui_topic",
        tag : "逗比", //标签
        
        container : "topic_content",
        
        dataload : false,
        curpage: 1,
        page_size : 3,
        data_finish : false,
        page_loading : false,
        
        template : _.template(fmaTypeTpl),
        
        initialize : function(){
            $(this.el).html(this.template);
            var self = this;
        },
        render : function(options){
            this.constructor.__super__.render.apply(this,[options]);
	      		this.setTag(decodeURI(this.getTag()));
        },
        remove : function(){
            $(this.el).remove();
        },
        pageIn : function(){
	      		if(!this.getDataLoad()){
	      			this.init();
        			this.setDataLoad(true);
	      		}
        },
        init : function(){
        		this.loadPageData();
        		this.bindReadingClick(this.container);
        		$("#page_title").html("主题 - " + this.getTag());
        },
        loadPageData : function(){
	        	var self = this;
	        	if(!!self.getPageLoading()) return;
	        	if(!!self.getDataFinish()) return;
	        	//fma_data.queryLabel = function(label,skip,limit,cb_ok,cb_err)
        		fma_data.queryLabel(
                self.getTag(),
                    self.getCurPage * self.getPageSize(),
                self.getPageSize(),
                function (arr) {
                		if (arr.length < fma_waterpage_size) {
                        self.setDataFinish(true);
                    }
                    if (arr.length == 0) {
                    		self.setPageLoading(false);
                    } else {
                        self.reWaterData(arr,self.container,2,$(masonry));
                    }
                },
                function (error){
                		console.log(error + " 出错了 ");
                }
            );
        },
        reWaterData : function(arr,container,con,mas){
        		if(!utils.reWaterData(arr,container,con,mas)){
        				console.log("加载数据 失败~@");
        		}
        },
        bindReadingClick : function(val){
        		//console.log("主题页 图片点击事件");
        		$("#"+val).click(function(e){
        				var tpl_id = $(e.target).attr("tpl_id"),
        						tpl_src = $(e.target).attr("src");
        				tpl_id&&tpl_src? app.routers.appRouter.navigate("fma/reading/" + tpl_id,{replace:true,trigger:true}) : false;
        		});
        },
        
        
        /*  get set mistery  */
        setPageLoading : function(val) {this.page_loading = val;},
        setDataFinish : function(val) {this.data_finish = val;},
        setCurPage : function(val) {this.curpage = val;},
        setDataLoad : function(val) {this.dataload = val;},
        setTag : function(val){this.tag = val;},
        setPageSize : function(val) {this.page_size = val;},
        
        getPageLoading : function() {return this.page_loading;},
        getDataFinish : function() {return this.data_finish;},
        getCurPage : function() {return this.curpage;},
        getDataLoad : function() {return this.dataload;},
        getTag : function(){return this.tag;},
        getPageSize : function(){return this.page_size;},
        /*  get set mistery  */
        
    });
    return HelpView;
});