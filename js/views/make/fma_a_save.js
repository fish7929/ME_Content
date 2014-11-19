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

        old : "",
        tpl_id : null,
        effect_img_str : null,
        effect_img_url : null,
        user_id : "manager",
        local_img_url : null,
        is_saved : false,
        share_type : 0,
        direct_share : false,

        initialize: function () {
            this.$el.html(this.template);

        },

        setImgUrl: function(url){

            if ( !! url ){

                this.effect_img_url = url;
                this.direct_share = true;

            }
        },

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

            self.effect_img_str = DisplayObjectManager.effect_img.substring(
                    DisplayObjectManager.effect_img.indexOf(",") + 1);

            //保存至相册
            this.SetInfo("正在保存到相册...");
            try {
                fmantv_save_to_album(self.effect_img_str, function (url) {

                    self.SetInfo("已保存到相册");
                    self.local_img_url = url;
                    cb_ok();

                }, function (error) {

                    self.SetInfo("保存失败了:" + error);
                    if (!!cb_err) cb_err();

                });
            }catch(e){
                self.SetInfo("保存没成功:"+ e.message);
            }

        },

        DoShareDirect : function(shareType){

            //直接分享效果图
            var self = this;
            if ( shareType <= 4 ) {
                fmantv_share(self.user_id, self.effect_img_url, 2, shareType, function () {

                    self.SetInfo("分享成功！");
                }, function (err) {
                    self.SetInfo("分享失败！原因是:" + err);
                });
            }else{
                self.DoShareWeb(shareType);
            }

        },

        /*
         *  shareType 分享目标类型
         *  1 wechat 会话, 2 wechat 朋友圈, 3 qq friend, 4 qq space, 5 sina weibo, 6豆瓣
         *  内容类型：1 文本,2 图片, 3 URL
         */
        DoShare : function(shareType) {

            if ( this.direct_share ){

                return this.DoShareDirect(shareType);

            }else {

                var self = this;

                if (shareType >= 4) {

                    //QQ空间、新浪微博、豆瓣都需要分享url类型
                    //所以需要先保存效果图获取URL

                    self.ReadyDataToSave(null);

                    //保存效果图
                    self.SaveEffectImg(function () {

                        //通过本地App分享至QQ空间（需要url链接）
                        self.effect_img_url = fmacapi.tpl_effect_img_url(self.tplobj);

                        //启动云端保存
                        self.SaveToCloud(function () {

                            self.SetInfo("作品发布成功!");
                        }, function (error) {

                            self.SetInfo("作品发布失败了");

                        });

                        if (shareType == 4) {
                            //QQ空间

                            fmantv_share(self.user_id, self.effect_img_url, 2, shareType, function () {

                                self.SetInfo("分享成功！");
                            }, function (err) {
                                self.SetInfo("分享失败！原因是:" + err);
                            });


                        } else {
                            //web分享
                            self.DoShareWeb(shareType);
                        }

                    }, function (err) {

                    });

                } else {

                    //通过本地App分享至微信好友、朋友圈、QQ好友(可使用本地图片)

                    if (!!self.local_img_url) {

                        //类型：图片
                        var contentType = 2;

                        fmantv_share(self.user_id, self.local_img_url, contentType, shareType, function () {

                            self.SetInfo("分享成功！");
                        }, function (err) {
                            self.SetInfo(err);
                        });
                    }

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
                    self.SetInfo("分享成功！");
                }
            }
        },

        SaveEffectImg : function(cb_ok,cb_err){

            var self = this;
            var chk = $('input[name="re_check"]').get(0);

            if ( DisplayObjectManager.effect_img == null ){
                return;
            }

            //保存效果图至云端
            this.SetInfo("正在分享...");
            fmacapi.tpl_save_effect_img(self.tplobj,self.effect_img_str,function(tpl){

                self.effect_img_url = fmacapi.tpl_effect_img_url(self.tplobj);
                cb_ok();

            },function(error){

                self.SetInfo("分享失败了!");
                if ( !!cb_err ) cb_err();

            });

        },

        ReadyDataToSave : function(img_str){

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

                self.tplobj = tpl;
                self.tpldata = tpl_data;
                self.tpl_img = tpl_img;
            }

        },

        //保存到云端
        SaveToCloud : function(cb_ok,cb_err){

            var self = this;
            var chk = $('input[name="re_check"]').get(0);

            if (DisplayObjectManager.effect_img==null ){
                return;
            }

            //如选择“允许编辑推荐，并且作品数据已准备好，则保存到云端
            if ( !!chk.checked && this.tplobj && this.tpldata ) {
                //保存作品对象
                self.tpl_img.effect_img = null;
                fmacapi.tpl_save_all(self.tplobj, self.tpldata, self.tpl_img, function (tpl) {//success
                    //alert("作品保存成功！");

                    self.SetInfo("作品发布成功");
                    DisplayObjectManager.effect_img = null;
                    DisplayObjectManager.displayObjects = [];
                    self.tpl_id = tpl.get("tpl_id");

                    $("#bt_save_back").attr("href", "#fma/make/" + self.tpl_id);

                    if (!!cb_ok) cb_ok(self.tpl_id);
                }, function (error) {
                    if (!!cb_err) cb_err(error);
                });
            }else{
                if(!!cb_err) cb_err({message:"没有可保存的数据"});
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

        render : function(options){
            this.constructor.__super__.render.apply(this,[options]);

            if ( this.direct_share ){
                //由阅读页指定直接分享
                this.SetInfo("请选择分享目标");

                //绑定分享时的接连
                this.sharesBu();

            }else{

                var self = this;
                setTimeout(function() {

                    var tpl_id = TplDataManager.currentTplData.get("key_id");
                    $("#bt_save_back").attr("href", "#fma/make/" + tpl_id);

                    //首先保存到相册
                    self.SaveToAlbum(function () {

                        //获取本机ID(用于未来与用户ID捆绑
                        fmantv_machine_id(function () {

                        }, function () {

                        });

                        //绑定分享时的接连
                        self.sharesBu();

                    });
                },0);
            }

        },
        pageIn : function(){

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