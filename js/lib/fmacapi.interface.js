/////////////////////////////////////////////////////
//
//   fmacapi.interface.js
//  (蜂巢Web App用户前端功能接口)
//  ----------------------------------
//
//   Project      : 蜂巢移动应用V1.0
//   Module	    : Web用户前端功能接口
//   Module Version : 1.0
//   By           : YC.Q
//   When		  : 2014.8.26
//   Updated by   :
//   Updated when : 2014.9.17
//   Title        :
//   Copyright    : 上海精灵天下数字技术有限公司
//
//   reviewed:
//
/////////////////////////////////////////////////////


/////////////////////////////////////////////////////
//
//  公共对象及接口
//
/////////////////////////////////////////////////////

fmacapi_RegisterNameSpace('fmaobj');

/////////////////////////////////////////////////////
//
//  模版与作品相关的对象定义(fmaobj命名空间)
//
/////////////////////////////////////////////////////


/**
 * 页元素对象
 */
fmaobj.elem = {

    create:function() {

        var element = new (fmacloud.Object.extend("element"));

        element.set("item_type", 0);
        element.set("item_top", 0);
        element.set("item_left", 0);
        element.set("item_width", 0);
        element.set("item_height", 0);
        element.set("item_cntype", 0);
        element.set("item_val", 'none');
        element.set("item_layer", 0);
        element.set("item_color", 'FFFFFF');
        element.set("item_opacity", 0);
        element.set("item_angle", false);
        element.set("rotate_angle", 0);
        element.set("rotate_pos", "0.0");
        element.set("item_mirror", 'null');
        element.set("use_mask", false);
        element.set("mask_color", '0');
        element.set("mask_width", 0);
        element.set("mask_height", 0);
        element.set("item_filter", 'none');
        element.set("item_filter_val", 'none');
        element.set("font_size", '12');
        element.set("font_family", '宋体');
        element.set("restart_play", false);
        element.set("auto_play", false);
        element.set("lock_level", 0);
        element.set("font_dist", 0);
        element.set("font_halign", 'left');
        element.set("font_valight", 'top');
        element.set("font_frame", false);
        element.set("frame_color", '#ffffff');
        element.set("frame_pixes", 0);
        element.set("frame_style", 1);
        element.set("x_scale",1.0);
        element.set("y_scale",1.0);

		// 新增加变量
        element.set("line_height", 3);			// 行高
        element.set("direction", "");			// 方向 "", "/", "水平", "竖直"

        return element;
    }

};

/**
 * 页对象
 */
fmaobj.page = {

    create:function(){

        var page = new (fmacloud.Object.extend("page"));

        page.set("page_no",1);
        page.set("size_type",1);
        page.set("page_width",0);
        page.set("page_height",0);
        page.set("color_off",false);
        page.set("color_code",'0');
        page.set("color_transp",0);
        page.set("img_off",false);
        page.set("img_reshow",false);
        page.set("line_off",false);
        page.set("line_witch",0);
        page.set("line_color",'0');
        page.set("line_radius",'none');
        page.set("filter",'none');
        page.set("filter_val",'none');
        page.set("item_int",0);
        page.set("item_object",[]);

        return page;
    }

};

/**
 * 模版/作品/签章对象
 * tpl_type=0:模版，1-作品，2-签章
 *
 */
fmaobj.tpl = {

    create: function(){

        var tplobj = new (fmacloud.Object.extend("tplobj"));

        tplobj.set("tpl_id",fmacapi_create_uid(""));
        tplobj.set("tpl_no","");
        tplobj.set("tpl_type",0);   //0-模版,1-作品, 2-签章
        tplobj.set("tpl_width",0);
        tplobj.set("tpl_height",0);
        tplobj.set("name","noname");
        tplobj.set("brief","/");
        tplobj.set("approved",0);
        tplobj.set("sale_time",'2014-8-28');
        tplobj.set("using_count",0);
        tplobj.set("author",'ME');
        tplobj.set("tiny_img",'none');
        tplobj.set("effect_img",'none');
        tplobj.set("score_int",100);
        tplobj.set("top_int",10);
        tplobj.set("read_int", 0);
        tplobj.set("share_int", 0);
        tplobj.set("create_time",'2014-8-28');
        tplobj.set("render_version",2.0);
        tplobj.set("editor_recno",0);
        tplobj.set("author_recno",0);
        tplobj.set("sale_pos",0);
        tplobj.set("label",[]);
        tplobj.set("inherit_from","");  //本对象所继承的模版/作品ID

        return tplobj;
    },
    test:function(){alert("test!");}
};

/**
 * 模版的页组数据对象
 * tpl_works_id: 模版或作品的对象ID(fmaobj.tpl.objectId/fmaobj.works.objectId)
 * 通过key_id与模版或作品对象关联：
 *          key_id = fmaobj.tpl.objectId or fmaobj.works.objectId
 *
 */
fmaobj.tpl_data ={

    create: function(tpl_works_id){

        var page_array = new ( fmacloud.Object.extend("pages_data"));

        page_array.set("key_id", (tpl_works_id==null?'none':tpl_works_id));
        page_array.set("pages",new Array());

        return page_array;
    }
};

/**
 * 滤镜对象
 */
fmaobj.filter = {

    create:function(){

        var filter = new (fmacloud.Object.extend("filter"));

        filter.set("filter_no",'none');
        filter.set("filter_name",'none');
        filter.set("filter_type",'none');
        filter.set("create_time",'2014-8-28');
        filter.set("render_version",2.0);
        filter.set("filter_paras",'none');
        filter.set("filter_render",'none');

        return filter;
    }
};


/**
 * 参数对象
 */
fmaobj.params = {

    create:function(){

        var params = new (fmacloud.Object.extend("params"));

        params.set("arg1",null);
        params.set("arg2",null);
        params.set("arg3",null);
        params.set("arg4",null);
        params.set("arg5",null);
        params.set("arg6",null);
        params.set("arg7",null);
        params.set("arg8",null);
        params.set("count",0);

        return params;
    }
};


/////////////////////////////////////////////////////
//
//  fmacapi对象提供的功能接口
//
/////////////////////////////////////////////////////


(function(){

    var fmacapi = function (context) {
            return new fmacapi.fn.init(context);
        },

        env_app = 1,
        env_web = 2;
        offline = false;

    fmacapi.fn = fmacapi.prototype = {

        constructor: fmacapi,
        init: function (context) {
            return this;
        },


/////////////////////////////////////////////////////
//
//  运行时信息
//
/////////////////////////////////////////////////////

        /**
         *得到当前代码运行环境类型
         *返回值: 1 app(当前代码在本机App框架中运行）
         *         2 web(当前代码在独立Web环境中运行）
         */
        env: function () {
             return env_app;
            //return env_web;
        },


/////////////////////////////////////////////////////
//
//  模版/作品/签章相关功能接口
//
/////////////////////////////////////////////////////

        /**
         *模版/作品/签章查询
         *objsel:选择查询模版、作品还是签章，0 - 查询模版；1 - 查询作品; 2-查询签章
         *selector:查询选择器，其取值为：
         *          'editor rec'-编辑推荐（按推荐号排序）
         *          'author rec'-作者推荐（按推荐号排序）
         *          'label:xxx' -根据标签选择(多个标签用冒号隔开）
         *skip: 在符合条件的对象中跳过多少个，用于分页查询
         *limit: 限制获取的对象数
         *@cb_ok(tpl_objs) 调用成功后，异步回调接口返回tpl_objs模版对象数组
         *          即 fmaobj.tpl对象数组
         *@cb_err(err) 调用失败后，异步回调接口返回,err包含错误信息（字符串）
         */
        tpl_query: function (objsel,selector,orderby,isAscending,skip,limit,cb_ok,cb_err) {

            //查询本机模版/作品/签章
            //查询云端模版/作品/签章
            fmacloud.query_tpl_works(objsel,selector,orderby,isAscending,skip,limit,cb_ok,cb_err);
        },

         /**
         *获得模版/作品/签章的页数据
         *tpl_works_id:模版对象或作品对象id：
         *@cb_ok(data_obj) 成功后，异步回调接口返回data_obj模版/作品页数据对象
         *          即 fmaobj.tpl_data或fmaobj.works_data对象
         *@cb_err(err) 调用失败后，异步回调接口返回,err包含错误信息（字符串）
         */
        tpl_get_data: function (tpl_works_id,cb_ok,cb_err) {

            //获取云端数据
            fmacloud.get_tpl_works_data(tpl_works_id,cb_ok,cb_err);
        },

        /**
         *获得模版/作品/签章效果图的url
         */
        tpl_effect_img_url:function(tplobj){

            var url = tplobj.get("effect_img");
            if ( url.substr(0,3)=="AV:"){
                return url.slice(3);
            }else {
                return fms_res_path + fms_res_store
                    + tplobj.get("tpl_id") + "/" + tplobj.get("effect_img");
            }
        },

        /**
         *获得页元素中图片资源的url
         * 为保证代码对未来图片服务器升级切换的适应性
         * 对于图片类元素，建议通过本函数获取图片资源的URL
         */
        tpl_res_img_url:function(tpl_id,cntype,item_val){

            var url=null;
            if (cntype == 2) {
                //链接地址
                url = item_val;
            } else if (cntype == 3) {
                //资源id
                url = fms_res_path + fms_res_store + tpl_id + "/" + item_val;
            } else {
            }

            return url;
        },

        /**
        *保存模版/作品/签章对象及其所有相关图片资源
        *tplobj:模版/作品签章对象(类型为fmaobj.tpl)：
         *tpldata:模版/作品/签章数据对象(类型为fmaobj.tpl_data)
        *tpl_imgs:图片资源数组对象，其格式为：
            var tpl_imgs = {
                effect_img:string,//效果图base64字符串
                elem_imgs:[["elem_id1",img_base64_str],["elem_id2,img_base64_str]]
            };
        *@cb_ok(tplobj) 成功后，异步回调接口返回tpl对象(fmaobj.tpl)
        *@cb_err(tplobj,err) 调用失败后，异步回调接口返回,err包含错误信息（字符串）
             */
        tpl_save_all: function (tplobj,tpldata,tpl_imgs,cb_ok,cb_err) {

            //本机保存
            //云端保存
            return fmacloud.tpl_save_all(tplobj,tpldata,tpl_imgs,cb_ok,cb_err);
        },

        /**
         *保存模版/作品/签章对象
         *tplobj:模版/作品签章对象(类型为fmaobj.tpl)：
         *@cb_ok(tplobj) 成功后，异步回调接口返回tpl对象(fmaobj.tpl)
         *@cb_err(tplobj,err) 调用失败后，异步回调接口返回,err包含错误信息（字符串）
         */
        tpl_save_obj: function (tplobj,cb_ok,cb_err) {

            //本机保存
            //云端保存
             tplobj.save(null, {
                success: cb_ok,
                error: cb_err
            });

        },

        /**
         *保存模版/作品/签章数据
         *tpldata:作品页数据对象(类型为fmaobj.tpl_data)：
         *@cb_ok(worksdata) 成功后，异步回调接口返回原tpl_data作品页数据对象(fmaobj.tpl_data)
         *@cb_err(tpl_data,err) 调用失败后，异步回调接口返回,err包含错误信息（字符串）
         */
        works_save_data: function (tpldata,cb_ok,cb_err) {

            //本机保存
            //云端保存
            tpldata.save(null, {
                success: cb_ok,
                error: cb_err
            });

        },

        /**
         *得到模版/作品上架位置
         * 参数，位置索引：0是普通位置，从1-4分别是：
         *  ["A-1","大图展示区"],["A-2","焦点图"],["A-3","热门瀑布流"],["A-4","主题瀑布流"]
         *返回值：位置的名称数组，例如：var pos = get_upsale_pos(1); alert(pos[0]+pos[1]);
         */
        get_upsale_pos: function(posIndex) {

            if ( posIndex < upsale_pos.length ) {
                return upsale_pos[posIndex];
            }
            else{
                return null;
            }
        },

        /*
         //将$remote_res指定的远程资源文件(URL)(图片、音视频等)复制到本服务器
         //并用本服务器资源号或链接地址替换元素itm_val
         */

        copy_remote_resource: function(params,cb_ok,cb_err){

            var elem = params.get("arg1");
            var remote_url = params.get("arg2");
            var key_id = params.get("arg3");

            var origfilename="";

            if ( elem.get("item_cntype")==2 ) {

                var val = elem.get("item_val");
                var ipos = val.lastIndexOf('/');
                origfilename = val.substr( ipos+1, val.length-ipos-1 );

            } else if ( elem.get("item_cntype")==3 ) {

                origfilename = elem.get("item_val");
            } else {
                return false;
            }

            var pos = remote_url.lastIndexOf('/');
            var filename = remote_url.substr(pos+1,remote_url.length-pos-1 );
            filename = key_id+"."+filename;

            var file = fmacloud.File.withURL(filename, remote_url);
            file.save().then(
                function(){

                    filename = file.name();
                    //elem.set("item_cntype", 2);
                    //elem.set("item_val", file.url());

                    //删除以前的资源文件
                    if ( origfilename != "" )
                    {
                        var origfile = new fmacloud.File(origfilename);
                        origfile.destroy().then(function() {
                        },function(error){});
                    }

                    cb_ok(elem);
                },
                cb_err
            );

            return true;

        },



/////////////////////////////////////////////////////
//
//  本机功能模块
//
/////////////////////////////////////////////////////


        /**
         *接退出程序
         */
        exit_app: function () {
            fmantv.exit_app();
        }
    };

    window.fmacapi = fmacapi.fn;

/////////////////////////////////////////////////////
//
//  以下是私有变量
//
/////////////////////////////////////////////////////

    var upsale_pos = [["",""],["A-1","大图展示区"],["A-2","焦点图"],["A-3","热门瀑布流"],["A-4","主题瀑布流"]];

})();



