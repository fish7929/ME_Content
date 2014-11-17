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
        is_reloading : false,

    initialize : function(){

            $(this.el).html(this.template);
            var self = this;

            setTimeout(function(){
                self.bnUse = $("#tpl_use");
                self.bnUse.on("tap",function(){
                    self.onUse();
                });

                $(".make_save_share").on("tap",function(e){
                    self.onSaveOrShare();
                });

                $("#back_to_square").on("tap",function(e){

                    app.routers.appRouter.navigate("#fma/square",{replace:true,trigger:true});
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

            self.swip_first_tpl = tplIndex;
            self.cur_tpl = self.swip_first_tpl;

            self.ResetSwipTpls();
            self.PreloadTpl(function() {
                self.ReloadSwipeTpls(function () {

                    if ( self.bannerSwipe == null ) {
                        self.bannerSwipe = Swipe(banner.get(0), {
                            auto: 0,
                            continuous: false,
                            speed: 0,
                            startSlide: self.cur_tpl - self.swip_first_tpl,
                            transitionEnd: function (pos) {

                                if (self.cur_tpl == self.swip_first_tpl + pos) {
                                    //未切换，直接返回
                                    return;
                                }

                                //如果正在重新加载，则直接返回，避免重入
                                if (self.is_reloading) return;
                                self.is_reloading = true;

                                self.cur_tpl = self.swip_first_tpl + pos;
                                self.tplId = self.tpl_arr[self.cur_tpl].get("tpl_id");

                                if (pos + 1 >= self.swip_tpl_count || pos == 0) {

                                    //到前后边界，需要重新加载
                                    self.PreloadTpl(function () {

                                        self.ReloadSwipeTpls(function () {

                                            self.bannerSwipe.setStartSlide(self.cur_tpl - self.swip_first_tpl);
                                            self.bannerSwipe.setup();

                                            //结束reloading
                                            self.is_reloading = false;

                                        });

                                    }, function (err) {

                                        alert("模版加载失败，原因是：" + err.message);
                                        //结束reloading
                                        self.is_reloading = false;
                                    });
                                } else {
                                    self.is_reloading = false;
                                }
                            }
                        });
                    }else{

                        self.bannerSwipe.setStartSlide(self.cur_tpl - self.swip_first_tpl);
                        self.bannerSwipe.setup();
                    }

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
            if ( self.cur_tpl +1 >= self.tpl_arr.length ){

                fma_data.querySalePos(
                    3,
                        self.cur_tpl+1,
                    10,
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

        ReloadSwipeTpls : function(cb_ok){

            var html = "";
            var self = this;
            var index = 0;

            var i = this.cur_tpl>0?this.cur_tpl-1:0;
            var count = this.cur_tpl+1>=this.tpl_arr.length ?
                this.cur_tpl - i + 1 : (this.cur_tpl+1) - i + 1;
            self.swip_first_tpl = i;
            self.swip_tpl_count = count;

            var html_arr = [];
            for(; i< self.swip_first_tpl+count; i++) {

                var tpl = self.tpl_arr[i];
                var imgUrl = fmacapi.tpl_thumb_img_url(tpl);

                var img = new Image();
                img.tpl_index = i;

                img.onload = function () {
                    index++;

                    var s = "";
                    if (this.width >= this.height) {
                        s = "100% auto";
                    } else {
                        s = "auto 100%";
                    }

                    html = ("<div style='background: url(\""+this.src+"\") no-repeat center;background-size:"+s+"'></div>");
                    //html = ("<div style='background: url(\"images/skin/loading_1.gif\") no-repeat center;"+"'></div>");

                    html_arr[ this.tpl_index - self.swip_first_tpl ] = html;

                    if (count == index) {

                        html = "";
                        for( j=0; j<html_arr.length; j++ ){
                            html += html_arr[j];
                        }

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
            },
                onSaveOrShare : function(){
              var self = this;
              DisplayObjectManager.setAllSelected(false);
            _.delay(function(){
                try {
                    var canvas = $("#makecanvas").get(0);
                    DisplayObjectManager.effect_img = canvas.toDataURL("image/png", 1);
                }catch(e){
                    alert(e.message);
                }
                app.routers.appRouter.navigate("fma/save",{replace:false,trigger:true});
            },1);
//            }
        },
    });
    return DisplayView;
});
