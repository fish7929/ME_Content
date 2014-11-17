// 文件名称: fma_a_setting_feedback.js
//
// 创 建 人: Farness
// 创建日期: 2014/09/27
// 描    述: 意见反馈
define([
    "jquery",
    "views/base_view",
    "text!templates/setting/fma_ui_setting_feedback.html"
],function($, BaseView,feedBackTpl){

    /**
     * 设置管理中心
     */
    var FeedBackView = app.views.FeedBackView = BaseView.extend({
        id: "feedback",
        className : "page",
        template: _.template(feedBackTpl),
        initialize: function () {
            this.$el.html(this.template);
        },
        render : function(options){
            this.constructor.__super__.render.apply(this,[options]);
            //this.initRenderer();
            this.init();
        },
        pageIn : function(){

        },
        remove : function(){
        },
        init : function(){
        		var self = this;
            document.getElementById("share").onclick = function(){self.saveFeedback();};
        },
        chackInputFeedback : function(cont,email){
        		if(cont.value==null||email.value==null)
        				return false;
        		if(cont.value==cont.placeholder || email.value==cont.placeholder)
        				return false;
        		var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        		if(!reg.test(email.value)){
        				return false;
        		}
        		return true;
        		//onblur="javascript:this.value=this.value.replace(/(^\s*)|(\s*$)/g,'')" onfocus="javascript:this.value=this.value?this.value:'&nbsp;'" 
        		// onblur="javascript:this.value=''" onfocus="javascript:this.value='&nbsp;'" 
        },
        saveFeedback : function(){
        		var context = document.getElementById("feedback_text");
						var email = document.getElementById("email_text");
						
						if(!this.chackInputFeedback(context,email)){
								alert("请更正输入信息!");
								return false;
						}
						
				    var feedback = fmaobj.feedback.create();
				
				    feedback.set("context", context);
				    feedback.set("email", email);
				
				    // 保存对象
				    feedback.save(null, {
				        success: function (feedback) {
				            alert("保存成功！");
				        },
				        error: function (feedback, error) {
				            alert("保存反馈数据失败！");
				        }
				    });
        }
	});

    return FeedBackView;

});