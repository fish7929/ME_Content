// 文件名称: fma_a_help.js
//
// 创 建 人: mistery
// 创建日期: 2014/09/27
// 描    述: 帮助
define([
    "jquery",
    "views/base_view",
    "text!templates/fma_ui_help.html"
],function($, BaseView,fmaTypeTpl){

    var HelpView = app.views.HelpView = BaseView.extend({
        id : "fma_ui_help",
        containerClass : "help_c",
        container : "help_container",
        scrol : "help_scroll",
        movePosition : .86,
        inited : false,
        template : _.template(fmaTypeTpl),
        initialize : function(){
            $(this.el).html(this.template);
        },
        render : function(options){
        },
        remove : function(){
            document.getElementById(this.container).removeEventListener("touchstart");
            document.getElementById(this.container).removeEventListener("touchmove");
            document.getElementById(this.container).removeEventListener("touchend");
            $(this.el).remove();
        },
        pageIn : function(){
        	if(!this.inited)
            	this.init();
        },
        init : function(){
        		this.touchMove();
        		this.positionImg();
        },
        positionImg : function(){
        		var con = $("."+this.containerClass);
        		var container = $("#"+this.container).width();
        		con.each(function(){
					self = $(this);
					$(this).css({"top":"-"+self.index()*self.height()+"px","left":self.index()*self.width()+self.index()*52+container*0.115+"px"});
        		});
        },
        touchMove : function(){
        		//85;
        		var moverX = 0,
        				moverOK = 0,
        				thisLeft = 0,
        				cont = 0,
        				self = this,
        				help_c = document.getElementsByClassName("help_c").length;
        				
        		
        		document.getElementById(this.container).addEventListener("touchstart",function(e){
        				moverX = e.targetTouches[0].pageX;
        				thisLeft = parseInt($("#"+self.scrol).css("left"));
        		},false);
        		document.getElementById(this.container).addEventListener("touchmove",function(e){
        				moverOK = e.targetTouches[0].pageX;
        		},false);
        		document.getElementById(this.container).addEventListener("touchend",function(e){
	        			//console.log(cont + "--" + help_c);
        				if(moverX>moverOK){
	        				if(cont<=help_c-2)
	        					cont++;
	        				else
	        					cont=help_c-1;
	        			}else{
	        				if(cont>=1)
	        					cont--;
	        				else
	        					cont=0;
        				}
        				$("#"+self.scrol).stop().css({"transition":"-webkit-transform .3s","-webkit-transform":"translate3d(-"+cont*111+"%,0px,0px)"});
        		},false);
        		
        }
    });
    return HelpView;
});