/**
 * Created by Administrator on 2014/8/27.
 */
// 文件名称: pic_scroll.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/27
// 描    述: 图滚动
define([
    "jquery",
    "utils",
    "config/template_config"
],function($, utils,tplConfig){

    /**
     * 图片滚动控件
     * 暂时还不能复用
     */
    var PicScroll = function(parent){
        this.container = $("#makepic");
        this.container.addClass("hidemakepic make_menu_bgcolor");

        this.initedData = false;

        //关闭按钮
        this.closeBtn = $("#makepic_on");

        this.typeScrollDiv = $("#pic_type_scroller");
        this.picScrollDiv = $("#pic_scroller");

        //模板类型ul
        var typeUl = this.typeUl = $("#pic_type_scroller > ul:first");
        //初始化标签
        var html = createTypeLi(tplConfig.labels);
        typeUl.html(html);

        //计算类型li的宽度，要重设滚动 条的宽度
        var w =  typeUl.find("li:first");
        //默认选中第一个标签
        w.addClass("pic_type_li_selected");
        this.currentSelectTypeLi = w;
        var liWidth = w.width();
        //console.log(tplConfig.labels.length)
        this.typeScrollDiv.css({width:(130 * (tplConfig.labels.length)) +123+ "px"});

        this.parentView = parent;
        this.parentView.MenuReset(this.container);

        //类型滚动条
        this.typeScroll = new IScroll('#pic_type_wrapper', {
            scrollX: true, scrollY: false, mouseWheel: true,
            tap : true,
            bounce : false,
            click : true
        });

        /**
         * 模板列表UL
         * @type {*|jQuery|HTMLElement}
         */
        var tplUl = this.tplUl = $("#pic_scroller > ul:first");

        //图片滚动条
        this.picScroll = new IScroll('#pic_wrapper', {
            scrollX: true, scrollY: false, mouseWheel: true,
            tap : true,
            bounce : false,
            click:true
        });

        //模板ul
        var picUI = this.picUL = $("#pic_scroller > ul:first");
        var self = this;


        //类型点击事件
        typeUl.click(function(e){
            onTypeTabClick.call(self,e);
        });

        //模板点击事件
        picUI.click(function(e){
            onTplClick.call(self,e);
        });

        //事件监听
        this.closeBtn.click(function(){
            self.hide();
        });

        this.onHide = function(){};
    };

    /**
     * 模板类型选中事件
     * @param e
     */
    function onTypeTabClick(e){
        var li = $(e.target);
        var label = li.attr("label");
        //console.log(label)
        if(label){
            //console.log(label)
            if(this.currentSelectTypeLi){
                this.currentSelectTypeLi.removeClass("pic_type_li_selected");
                //this.currentSelectTab.addClass("watermark_type_noselected");
            }
            this.currentSelectTypeLi = li;
            this.currentSelectTypeLi.addClass("pic_type_li_selected");
            changeTplByType.call(this,label);
        }
    }

    /**
     * 模板类型改变时
     * @param label
     */
    function changeTplByType(label){
        var arr = [];
        var self = this;
        //modified by QY.C 2014/9/18
        fmacapi.tpl_query(fma_type_tpl,"label:" + label, null,null,0, 8, function(arr){
            self.onDataHandle(arr);
        }, function(){});
        //arr = getTplByLabel(label);
        //self.onDataHandle(arr);
        //end modified
    }

    function getTplByLabel(label){
        var arr = tplConfig.results;
        var returnArr = [];
        for(var i = 0;i < arr.length;i++){
            var ls = arr[i];
            if(ls.label.indexOf(label) != -1){
                returnArr.push(ls);
            }
        }

        return returnArr;
    }

    function onTplClick(e){
        var div = $(e.target);

        var tplId = div.attr("tpl_id");
        if(tplId){
            //console.log(tplId)
            var self = this;
            fmacapi.tpl_get_data(tplId,function(data){
                //console.log(data);
                self.parentView.scaleSpecialCanvas(function(){

                    handleTplData.call(self,data);
                    div.parents("ul").find(".active").removeClass("active");
                    div.addClass("active");
                    self.parentView.scaleSmallCanvas();

                });
            },function(){});
        }
    }

    function handleTplData(data){
        TplDataManager.currentTplData = data;
//        this.parentView.currentSelectTplData = data;
//        var pages = data.get("pages");
        this.parentView.initRenderer(data,true);
//        console.log(data)
    }

    PicScroll.prototype.getHeight = function(){
        return this.container.height();
    };

    PicScroll.prototype.show = function(){
        //this.container.removeClass("hidemakepic");
        //this.container.addClass("showmakepic");
        this.parentView.MenuIn(this.container);
        this.closeBtn.css({display:"block"});
        var self = this;
        this.typeScroll.refresh();
        this.picScroll.refresh();
        if(!this.initedData){//:经典电影:快播
            //调用云端
            //modified by QC.Y 2014/9/18
            fmacapi.tpl_query(fma_type_tpl,"all",null,null, 0, 8, function(arr){
                self.onDataHandle(arr);

//                console.log(arr)
            }, function(){});
            //end modified
            //暂用本地
            //self.onDataHandle(tplConfig);
//            var label = this.currentSelectTypeLi.attr("label");
//            changeTplByType.call(this,label);
//            this.initedData = true;
        }
    };

    /**
     * 动态创建类型列表
     * @param arr
     * @returns {string}
     */
    function createTypeLi(arr){
        var html = "";
        for(var i = 0; i < arr.length; i++){
            html += "<li label='"+arr[i]+"'>"+arr[i]+"</li>"
        }

        return html;
    }

    /**
     * 动态创建模板列表
     * @param arr
     */
    function createTplLi(arr){
        var html = "";
        for(var i = 0; i < arr.length; i++){
            var tp = arr[i];

            var img = tp.effect_img || fmacapi.tpl_effect_img_url(tp);
            var id = tp.tpl_id || tp.get("tpl_id");
            html += "<li><div style='background: url(\""+img+"\") no-repeat center;background-size: cover;'>" +
                "<div class='tpldiv' tpl_id='"+id+"'></div></div></li>";
        }

        return html;
    }

    PicScroll.prototype.onDataHandle = function(arr){
        var html = createTplLi(arr);
        TplDataManager.addTpls(arr);
        this.tplUl.html(html);

        this.resetPicScroll();

    };

    PicScroll.prototype.resetPicScroll = function(){
        var lis = this.tplUl.find("li");
        var size = lis.size();
        var w = lis.eq(0).width();

        this.picScrollDiv.css({width:(w * size) + "px"});

//        console.log(li)
        this.picScroll.refresh();
    };

    PicScroll.prototype.hide = function(){
        this.onHide();
//        this.container.removeClass("showmakepic");
//        this.container.addClass("hidemakepic");
        this.parentView.MenuOut(this.container);
        this.closeBtn.css({display:"none"});
        if(this.onhide){
            this.onhide();
        }
    };

//    <li class="pic_type_li_selected">二次元</li>
//    <li class="pic_type_li_selected">三次元</li>
//    <li class="pic_type_li_selected">GG</li>
//    <li class="pic_type_li_selected">Q</li>

//    <li><div><div class="pic_li_selected"></div></div></li>
//    <li><div><div ></div></div></li>

    return PicScroll;
});