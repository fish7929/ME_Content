// 文件名称: fma_a_save.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/12
// 描    述: 保存分享
define([
    "jquery",
    "underscore",
    "text!templates/make/fma_ui_save.html",
    "common/render/include",
    "views/base_view"
],function($, _, saveTpl,createjs,BaseView) {
    /**
     * 保存分享
     */
    var SaveView = app.views.SaveView = BaseView.extend({
        id: "make_save",
        className : "page",
        template: _.template(saveTpl),
        /* add old 用来标注 上一次点击分辨率的选择 2014-9-24 18.57 mistery */
        old : "",
        tpl_id : null,
        effect_img_url : null,
        user_id : "memanager",
        local_img_url : null,
        is_saved : false,
        share_type : 0,

        initialize: function () {
            this.$el.html(this.template);
            this.bnSave = null;
            this.bn_share_weixin = null;

            /* add 2014-9-27 18.41 mistery */
            this.buResol = null;
            /* add 2014-9-27 18.41 mistery end */

            var self = this;
            setTimeout(function(){
                //self.bnSave = $("#bn_make_save");
                self.bn_share_weixin = $("bn_share_weixin");

                var tpl_id = TplDataManager.currentTplData.get("key_id");
                $("#bt_save_back").attr("href","#fma/make/"+tpl_id);

                //self.bnSave.click(function(){
                //    self.onSave();
                //});
                self.SaveToAlbum(function() {
                    self.bn_share_weixin.click(function () {
                        self.DoShare(1);
                    });
                });

                //fmantv_machine_id(function(id) {

                    //self.user_id = id;
                    if (!self.is_saved) {
                        //上传到服务器
                        self.onSave(function () {

                            //分享类型5和6(新浪微博及豆瓣)，需要在上传后进行
                            self.DoShare(0);

                        });
                        self.is_saved = true;
                    }
//                },function(err){
//
//                });

            },0);

        },
        /* add ~ 2014-9-27 18.24 mistery */
        // 分辨率
        resolution : function(e){
            if(this.old == e.target) return;
            if(this.old != "")
                $(this.old).css({"background-color":"transparent","color":"#ffffff"});
            $(e.target).css({
                "background-color" : "#ffffff","color" : "#000","opacity" : "0.8"
            });
            this.old = e.target;
        },
        /* add ~ 2014-9-27 18.24 mistery end */

        /* add ~ 2014-9-27 19.12 mistery
            @Parameter opaction 接连数组
        */
        /* add ~ 2014-9-27 19.12 mistery */
        sharesBu : function(){
            var td = $(".save_share_bu > table").find("td");
            var self = this;
            td.click(function(e){
                var type = $(e.target).attr("data-save-type");
                if(!type) return false;
                //console.log("data-save-type : " + type);
                self.DoShare(type);
                //
            });
        },
        /* add ~ 2014-9-27 19.12 mistery end */
        /* add ~ 2014-9-27 19.12 mistery end */

        SetInfo : function(text){
            var info = $("#save_info");
            info.html("<img alt='.' src='images/skin3/make/save/success.png'>"+text);
        },

        SaveToAlbum : function(cb_ok,cb_err){

            var self = this;

            if ( DisplayObjectManager.effect_img == null ){
                this.SetInfo("保存失败了！");
                if ( !!cb_err) cb_err("保存失败了!");
                return;
            }

            var img_str = DisplayObjectManager.effect_img.substring(
                    DisplayObjectManager.effect_img.indexOf(",") + 1);

            //保存至相册
            this.SetInfo("正在保存到相册...");
            fmantv_save_to_album(img_str,function(url){

                self.SetInfo("已保存到相册");
                self.local_img_url = url;
                cb_ok();

            },function(error){

                self.SetInfo("保存失败了:"+error);
                if ( !!cb_err ) cb_err();

            });

        },

        /**
         * 作品保存
         */
        onSave : function(cb_ok,cb_err) {

            var self = this;
            if (DisplayObjectManager.effect_img==null ){
                return;
            }

            var img_str = DisplayObjectManager.effect_img.substring(
                    DisplayObjectManager.effect_img.indexOf(",") + 1);

            //保存到云端
            self.SaveToCloud(img_str,cb_ok,cb_err);

        },

        /**
         * 作品保存
         */
        onSaveOld : function(cb_ok,cb_err) {

            var self = this;
            var chk = $('input[name="re_check"]').get(0);

            if (DisplayObjectManager.effect_img==null ){
                return;
            }

            var img_str = DisplayObjectManager.effect_img.substring(
                    DisplayObjectManager.effect_img.indexOf(",") + 1);

            //如选择“允许编辑推荐，则保存到云端
            if ( !!chk.checked ) {

                //保存到云端
                self.SaveToCloud(img_str,cb_ok,cb_err);

            }else{

                if( !!cb_ok ) cb_ok(self.tpl_id);
            }
        },

        SaveToCloud : function(img_str,cb_ok,cb_err){

            var self = this;

            if(DisplayObjectManager.displayObjects.length > 0){
                //创建作品对象
                var tpl = fmaobj.tpl.create();

                tpl.set("tpl_type",1);

                //创建作品页数据对象
                var tpl_data = fmaobj.tpl_data.create(tpl.get("tpl_id"));//inherit_from

                var tplDetailData = TplDataManager.currentTplData;

                var tpl_id = tplDetailData.get("key_id");
                var tplData = TplDataManager.getTpl(tpl_id);

                if(tplData){
                    tpl.set("name",tplData.get("name"));
                    tpl.set("label",tplData.get("label"));
                }

                //继承自哪个模板
                tpl.set("inherit_from",tpl_id);

                //创建页组 目前只有一页，以后支持多页
                var pagearray = [];
                var c_page = pagearray[0] = tplDetailData.get("pages")[0].clone();
                tpl.set("tpl_width",c_page.get("page_width"));
                tpl.set("tpl_height",c_page.get("page_height"));

                c_page.set("item_object",[]);

                var eleArr = [];

                /**
                 * 图片资源
                 * @type {{}}
                 */
                var tpl_img = {};
                tpl_img.effect_img = img_str;

                //第2个元素改为item在elements数组中的索引，不再是id
                //elem_imgs:[[0,item_index,img_base64_str],[0,item_index,img_base64_str]]
                tpl_img.elem_imgs = [];
                var objs = DisplayObjectManager.displayObjects,len = objs.length;

                for(var i = 0; i < len; i++){
                    var obj = objs[i];

                    if(obj.userData){
                        var userData = obj.userData;
                        //设置层号
                        userData.set("item_layer",(i));

                        //如果是图片对象，查找是否有base64数据
                        if(obj.type == "editbitmap" && obj.imageData){

                            tpl_img.elem_imgs.push([0,i,obj.imageData.substring(obj.imageData.indexOf(",") + 1)]);
                        }

						if (obj.type == "editwatermark" && obj.type2 && obj.type2 == "signature")
					    {
							obj.save_objects(eleArr);
						}
						else
						{
							eleArr.push(userData);
						}
                    }
                }

                if(tpl_img.elem_imgs.length == 0){
                    delete tpl_img.elem_imgs;
                }

                //设置页元素
                pagearray[0].set("item_object",eleArr);
                tpl_data.set("pages",pagearray);
                tpl.set("author_id",self.user_id);

                //保存作品对象
                fmacapi.tpl_save_all(tpl,tpl_data,tpl_img,function(tpl){//success
                    //alert("作品保存成功！");

                    self.SetInfo("作品保存成功");
                    DisplayObjectManager.effect_img = null;
                    DisplayObjectManager.displayObjects = [];
                    self.tpl_id = tpl.get("tpl_id");
                    self.effect_img_url = fmacapi.tpl_effect_img_url(tpl);

                    $("#bt_save_back").attr("href","#fma/make/"+self.tpl_id);

                    if ( !! cb_ok ) cb_ok(self.tpl_id);
					app.routers.appRouter.navigate("fma/make/" + tpl.get("tpl_id"),{replace:true,trigger:true});
                },function(error){
                    alert(error.message);
                    if ( !! cb_err ) cb_err(eror);
                });
            }
        },

        AdjustMeta : function(boolShowNormal){

            var content = boolShowNormal ? "width=device-width, initial-scale=1.0"
                : "width=640, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5, user-scalable=no";

            if ( boolShowNormal ){
                $("#save_top_box").hide();
                $("#save_page_long").hide();
            }else{
                $("#save_page_long").show();
                $("#save_top_box").show();
            }

            //获得meta标签
            var meta = document.getElementsByTagName('meta');
            for(var i=0;i<meta.length;i++) {
                if (meta[i].getAttribute('name') == "viewport") {

                    meta[i].setAttribute("content",content);
                }
            }
        },

        /*
         *  shareType 分享目标类型
         *  5 sina weibo, 6 豆瓣
         *  内容类型：1 文本,2 图片, 3 URL
         */
        DoShareWeb : function(shareType) {

            var self = this;
            //self.effect_img_url = "http://ac-hvyv70z3.qiniudn.com/8SL7Tm6fJDRz1M9fV4j2Wdxwc5QPAkD00JB6PEgO.png";

            //新浪微博和豆瓣，需要web分享
            if ( !!self.effect_img_url) {
                var title = encodeURIComponent("蜂巢.ME");
                var imgurl = encodeURIComponent(self.effect_img_url);
                var appkey="1011472957";
                var url=null;
                var icon=null;

                //alert(imgurl);
                switch(shareType){
                    case "5"://新浪微博
                        icon = "http://t.sina.com.cn/favicon.ico";
                        url = 'http://service.weibo.com/share/share.php?url='
                            + imgurl
                            + '&title=' + title
                            + '&pic=' + imgurl + '&appkey=' + appkey;

                        break;
                    case "6"://豆瓣
                        icon = "http://t.douban.com/favicon.ico";
                        url = "http://www.douban.com/recommend/?url="
                            +imgurl
                            +'&title='+encodeURIComponent('蜂巢.ME')
                            +'&appkey=' + appkey;
                        break;
                }

                if ( url && icon ) {
                    //this.AdjustMeta(true);
                    //$("iframe").attr("src", url);
                    fmantv.call_browser(url);
                }
            }
        },

        /*
         *  shareType 分享目标类型
         *  1 wechat 会话, 2 wechat 朋友圈, 3 qq friend, 4 qq space, 5 sina weibo
         *  内容类型：1 文本,2 图片, 3 URL
         */
        DoShare : function(shareType) {

            var self = this;

            if (shareType == 0){

                //来自上传的回调函数，表明可以进行web分享
                if ( self.share_type == 5 || self.share_type == 6 ){
                    //用户已经设定了此二种分享
                    self.DoShareWeb(self.share_type);
                    self.share_type = 0;
                }

            }else if( shareType ==5 || shareType==6) {

                self.DoShareWeb(shareType);

            } else {
                //分享本地图片至微信或QQ应用
                if (!!self.local_img_url) {

                    //alert("分享地址："+self.effect_img_url);

                    //类型：图片
                    var contentType = 2;

                    //QQ空间
                    if (shareType == 4) {
                        //类型：文本
                        contentType = 1;
                    }

                    fmantv_share(self.user_id, self.local_img_url, contentType, shareType, function () {

                        //alert("分享成功！");
                    }, function (err) {
                        alert("分享失败！原因是:" + err);
                    });
                }
            }
        },


        /*
         *  shareType 分享目标类型
         *  1 wechat 会话, 2 wechat 朋友圈, 3 qq friend, 4 qq space, 5 sina weibo
         *  内容类型：1 文本,2 图片, 3 URL
        */
        DoShare_Old : function(shareType){

            var self = this;

            if ( !! self.effect_img_url ){

                //alert("分享地址："+self.effect_img_url);

                //类型：图片
                var contentType = 2;

                //QQ空间
                if (shareType==4 ){
                    //类型：文本
                    contentType = 1;
                }
                fmantv_share(self.user_id, self.effect_img_url, contentType, shareType, function () {

                    //alert("分享成功！");
                }, function (err) {
                    alert("分享失败！原因是:" + err);
                });

            }else if ( !! self.tpl_id ) {
                fmantv_machine_id(function(id){

                    //console.log(id);
                    self.user_id = id;
                    fma_data.queryByField("tpl_id", self.tpl_id, null, false, 0, 1, function (data) {

                        self.effect_img_url = fmacapi.tpl_effect_img_url(data[0]);
                        //console.log("url:"+self.effect_img_url);
                        self.DoShare(shareType);
                    },function(err){
                        alert("查询作品失败，原因是："+err.message);
                    });

                },function(err){
                    alert("获取用户ID失败，原因是："+err);
                });
            }else{

                self.onSave(function(tpl_id){
                    self.DoShare(shareType);

                });
            }
        },

        render : function(options){
            this.constructor.__super__.render.apply(this,[options]);

            /* mistery 绑定分享时的接连 */
            this.sharesBu();
            /* mistery end */
        },
        pageIn : function(){

            //分享事件
//                $("img").click(function(e){
//                    switch(e.target.dataset["saveType"]){
//                        case "5":
//                $("iframe").attr("src","http://v.t.sina.com.cn/share/share.php?url="
//                +encodeURIComponent(self.effect_img_url)
//                +'&title='+encodeURIComponent('蜂巢.ME')
//                +'&appkey=433903842');
//                    }
//                })

                var self = this;

                $("iframe").on("load",function(){
                    $("#share_div").show();
                });

                $(".share_div_logo").on("click",function(){
                    //debug.error("AdjustMeta:false");
                    self.AdjustMeta(false);
                    $("#share_div ").hide();
                });
        },
        remove : function(){

        }
    });

    return SaveView;
});