/**
 * Created by Administrator on 2014/8/27.
 */
// 文件名称: fma_a_display.js
//
// 创 建 人: chenshy
// 创建日期: 2014/08/27
// 描    述: 作品及模版的渲染显示,作品详情页
define([
    "jquery",
    "views/base_view",
    "text!templates/fma_ui_reading.html",
    "tmp/testScript",
    "common/script_parser",
    "common/renderer"
],function($, BaseView,fmaReadingTpl,script,ScriptParser,Renderer){

    var DisplayView = app.views.DisplayView = BaseView.extend({
        id : "fma_ui_reading",
        template : _.template(fmaReadingTpl),
        tpl_arr : null,
        cur_tpl : 0,
        swip_first_tpl : 0,
        swip_tpl_count : 0,
        tplId : null,
        bannerSwipe : null,

    initialize : function(){

            $(this.el).html(this.template);
            var self = this;

            setTimeout(function(){
                self.bnUse = $("#tpl_use");
                self.bnUse.click(function(){
                    self.onUse();
                });
            },0);
        },
        render : function(options,cb_ok){

            this.constructor.__super__.render.apply(this,[options]);
            cb_ok = cb_ok || function(){};
            this.initRenderer(cb_ok);

        },
        initRenderer : function(cb_ok){
            var self = this;
            self.tpl_arr = window.global_tpl_obj_arr;
            setTimeout(function(){
                var item = script;
                self.InitSwipe( self.getIndexById(self.tplId),cb_ok );
            },0);
        },

        getIndexById : function(tpl_id){

            for( i=0; i<this.tpl_arr.length; i++ ){
                if ( this.tpl_arr[i].get("tpl_id") == tpl_id ){
                    return i;
                }
            }

            return 0;
        },

        InitSwipe : function(tplIndex,cb_ok){

            var self = this;
            var banner = $("#reading_wrapper");

            self.cur_tpl = tplIndex;

            self.ResetSwipTpls();
            self.PreloadTpl(function() {
                self.PreloadSwipeTpls(function () {

                    self.bannerSwipe = Swipe(banner.get(0), {
                        auto: 0,
                        continuous: false,
                        speed: 0,
                        startSlide : self.cur_tpl - self.swip_first_tpl,
                        callback: function (pos) {

                            if ( pos+2 >= self.swip_tpl_count ){

                                //到前后边界，需要重新加载
                                self.PreloadTpl(function () {

                                    self.AppendSwipeTpl(function () {

                                        //self.bannerSwipe.setStartSlide(self.cur_tpl - self.swip_first_tpl);
                                        self.bannerSwipe.setup();

                                        self.cur_tpl = self.swip_first_tpl + pos;
                                        self.tplId = self.tpl_arr[self.cur_tpl].get("tpl_id");

                                    });

                                }, function (err) {

                                    alert("模版加载失败，原因是："+err.message);

                                });
                            }else{
                                self.cur_tpl = self.swip_first_tpl + pos;
                                self.tplId = self.tpl_arr[self.cur_tpl].get("tpl_id");
                            }
                        }
                    });

                    if ( cb_ok ) {
                        cb_ok();
                    }

                });
            },function(err){

            });
        },

        ResetSwipTpls : function(){
            $("#reading_scroller").html("");
        },

        PreloadTpl : function(cb_ok,cb_err){

            var self = this;
            if ( self.cur_tpl +2 >= self.tpl_arr.length ){

                fma_data.querySalePos(
                    3,
                        self.cur_tpl+2,
                    1,
                    function (arr) {
                        self.tpl_arr = self.tpl_arr.concat(arr);
                        cb_ok();
                    },
                    cb_err
                );

            }else{
                cb_ok();
            }
        },

        AppendSwipeTpl : function(cb_ok){

            var html = "";

            if ( this.bannerSwipe!=null && this.bannerSwipe.getPos()+2 >= this.bannerSwipe.getNumSlides()) {

                if ( this.cur_tpl+1 < this.tpl_arr.length ) {

                    var tpl = this.tpl_arr[this.cur_tpl + 1];

                    var imgUrl = fmacapi.tpl_effect_img_url(tpl);

                    var img = new Image();

                    img.onload = function () {

                        var s = "";
                        if (this.width >= this.height) {
                            s = "100% auto";
                        } else {
                            s = "auto 100%";
                        }

                        html += ("<div style='background: url(\""+this.src+"\") no-repeat center;background-size:"+s+"'></div>");

                        var $newElems = $(html);
                        $("#reading_scroller").append($newElems);

                        if ( cb_ok != undefined ) {
                            cb_ok();
                        }
                    };

                    img.src = imgUrl;

                }

            }
        },

        PreloadSwipeTpls : function(cb_ok){

            var html = "";
            var self = this;
            var index = 0;

            count = this.tpl_arr.length;
            for(i=0; i< this.tpl_arr.length; i++) {

                var tpl = this.tpl_arr[i];
                var imgUrl = fmacapi.tpl_effect_img_url(tpl);

                var img = new Image();

                img.onload = function () {
                    index++;

                    var s = "";
                    if (this.width >= this.height) {
                        s = "100% auto";
                    } else {
                        s = "auto 100%";
                    }

                    html += ("<div style='background: url(\""+this.src+"\") no-repeat center;background-size:"+s+"'></div>");

                    if (count == index) {

                        $("#reading_scroller").html(html);

                        if ( cb_ok != undefined ) {
                            cb_ok();
                        }
                    }
                };

                img.src = imgUrl;
            }
        },

        ReloadSwipeTpls : function(cb_ok){

            var html = "";
            var self = this;
            var arr = this.tpl_arr;
            var index = 0;

            var i = this.cur_tpl>0?this.cur_tpl-1:0;
            var count = this.cur_tpl+1>=this.tpl_arr.length ?
                this.cur_tpl - i + 1 : (this.cur_tpl+1) - i + 1;
            self.swip_first_tpl = i;
            self.swip_tpl_count = count;

            for(; i< self.swip_first_tpl+count; i++) {

                var tpl = arr[i];
                var imgUrl = fmacapi.tpl_effect_img_url(tpl);

                var img = new Image();

                img.onload = function () {
                    index++;

                    var s = "";
                    if (this.width >= this.height) {
                        s = "100% auto";
                    } else {
                        s = "auto 100%";
                    }

                    html += ("<div style='background: url(\""+this.src+"\") no-repeat center;background-size:"+s+"'></div>");

                    if (count == index) {

                        //var $newElems = $(html);
                        //$("#reading_scroller").append($newElems);
                        $("#reading_scroller").html(html);

                        if ( cb_ok != undefined ) {
                            cb_ok();
                        }
                    }
                };

                img.src = imgUrl;
            }
        },

        onUse : function(){
//            console.log(this.tplId)
            if(this.tplId){
                app.routers.appRouter.navigate("fma/make/" + this.tplId,{replace:true,trigger:true});
            }
        },
        setTplId : function(id){
            this.tplId = id;
        },
        remove : function(){
            this.ResetSwipTpls();
            $(this.el).detach();
        },
        pageIn : function(){

        }
    });
    return DisplayView;
});
