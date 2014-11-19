//修改记录
//2014-10-27  
//1：fmantv_save_to_album - 增加成功后返回在相册里的位置
//2：fmantv_share - 增加支持共享本地相册图片

var cst = {
	//os
	OS_WIN:"windows",
	OS_MAC:"mac",
	OS_LINUX:"linux",
	OS_UNIX:"unix",
	
	//error code
	E_OK:0,
	E_NOT_SUPPORT:11,
	E_NOT_INIT:12,	
};

var fmantv_is_inited = false;
function load_js(js){
	var iHead = document.getElementsByTagName('HEAD').item(0);   
	var iScript= document.createElement("script");   
	iScript.type = "text/javascript";   
	iScript.src=js;   
	iHead.appendChild(iScript);  
}	

function get_os_type() {
    var sys_info = navigator.userAgent.toLowerCase();
    var isWindows = (sys_info.indexOf("windows", 0) != -1) ? 1 : 0;
    var isMac = (sys_info.indexOf("mac", 0) != -1) ? 1 : 0;
    var isLinux = (sys_info.indexOf("linux", 0) != -1) ? 1 : 0;
    var isUnix = (sys_info.indexOf("x11", 0) != -1) ? 1 : 0;

    if (isWindows)
        return "windows";
    if (isMac)
        return "mac";
    if (isLinux)
        return "linux";
    else if (isUnix)
        return "unix";

    return "unknown";
}	

var init_retry = 0;
function fmantv_init2(cb_ok, cb_err) {
	if ( typeof(cordova)=="undefined" || !cordova.require("cordova/exec") ) {
		init_retry++;
		
		if ( init_retry>= 100 ) {
			if ( cb_err ) cb_err (cst.E_NOT_INIT);
			return;
		}
		
		setTimeout ( fmantv_init2, 50, cb_ok, cb_err );				
		return;
	}
	
	fmantv_is_inited = true;
   var exec = cordova.require("cordova/exec");        	        
   exec( function () {
			if (cb_ok) cb_ok();
		}, function (err) {
			if (cb_err) cb_err(err);
		}, "gliplug", "fmantv_init", []);						
}

/**
*接口初始化，调用接口前使用
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回	
*/
function fmantv_init (jspath,cb_ok,cb_err) {
	if ( fmantv_is_inited==true ) {
		if ( cb_ok ) cb_ok ( 0);
		return 0;
	}
	
	var os_type = get_os_type ();	
	if ( os_type==cst.OS_WIN ) {
		load_js(jspath+"cordova-ios.js");
	}
	else if ( os_type==cst.OS_MAC || os_type==cst.OS_LINUX ) {
		if ( os_type=="mac" )
			load_js(jspath+"cordova-ios.js");
		else 
			load_js(jspath+"cordova-2.8.0.js");
	}
	
	init_retry = 0;
	return fmantv_init2(cb_ok, cb_err);
}

/**
*接口反初始化，不再调用接口后使用
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回	
*/
function fmantv_uninit (cb_ok,cb_err) {
	if ( fmantv_is_inited==false ){
		if ( cb_ok ) cb_ok();
		return;
	}
	
	if ( typeof(cordova)=='undefined' ) return cst.E_NOT_INIT;        
	var exec = cordova.require("cordova/exec");        	        
	exec( function () {
			if (cb_ok) cb_ok();
		}, function (err) {
			if (cb_err) cb_err(err);
		}, "gliplug", "fmantv_uninit", []);						   
	return 0;
}

/**
 *[Y]
 *保存到相册
 *@base64_data 图片base64 data
 *@cb_ok(url) 调用成功后，异步回调接口返回, url - album local path
 *@cb_err(err) 调用失败后，异步回调接口返回
 */
function fmantv_save_to_album (base64_data,cb_ok,cb_err) {
	if ( fmantv_is_inited==false ){
		if ( cb_err ) cb_err("fmantv未初始化。");
		return;
	}
	
	if ( typeof(cordova)=='undefined' ) return cst.E_NOT_INIT;
	var exec = cordova.require("cordova/exec");
	exec( function (url) {
            if (cb_ok) cb_ok(url);
         /* //dbg
         exec( function () {
              if (cb_ok) cb_ok();
              }, function (err) {
              if (cb_err) cb_err(err);
              }, "gliplug", "fmantv_share", ["sword",url,1, 4]);
          */
         
         }, function (err) {
         if (cb_err) cb_err(err);
         }, "gliplug", "fmantv_save_to_album", [base64_data]);
	return 0;
}

/**
*[Y]
*分享到第3方应用
*@user_id 分享的用户id
*@share_obj 要分享的对象,可以是文本、URL等
*@obj_type 对象类型  1 text, 2 pic, 3 url
*@dst_type 分享目标类型 1 wechat 会话, 2 wechat 朋友圈, 3 qq friend, 4 qq space, 5 sina weibo
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回	
*/
function fmantv_share (user_id, share_obj, obj_type, dst_type, cb_ok,cb_err) {
   if ( fmantv_is_inited==false ) return cst.E_NOT_INIT;
   var exec = cordova.require("cordova/exec");        	        
   exec( function () {
			if (cb_ok) cb_ok();
		}, function (err) {
			if (cb_err) cb_err(err);
		}, "gliplug", "fmantv_share", [user_id,share_obj,obj_type, dst_type]);						   
   return 0;
}

/**
*特效制作
*@page_obj 页对象
*@templet_obj 模板对象
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回	
*@cb_prog(value) 进度 0 ~ 100
*/
function fmantv_model_make (page_obj, templet_obj, cb_ok,cb_err) {
	return cst.E_NOT_SUPPORT;
}

/**
*消息推送
*@message 消息文本
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回	
*/
function mantv_message_send (message, cb_ok,cb_err) {
	return cst.E_NOT_SUPPORT;
}

/**
*设置剪贴板
*@data_obj	数据对象，支持文本，图片，链接，音视频等
*/
function fmantv_pasteboard_set_data (data_obj) {
	return cst.E_NOT_SUPPORT;
}

/**
*读取剪贴板
*@cb_ok(data_obj) 调用成功后，异步回调接口返回, data_obj 数据对象,支持文本，图片，链接，音视频等
*@cb_err(err) 调用失败后，异步回调接口返回	
*/
function fmantv_pasteboard_get_data (cb_ok,cb_err) {
	return cst.E_NOT_SUPPORT;
}

/**
*退出程序
*/
function fmantv_exit_app () {
	return cst.E_NOT_SUPPORT;
}

/**
*得到系统和网络环境状态
*@cb_ok(env_obj) 调用成功后，异步回调接口返回, env_obj 环境对象
*@cb_err(err) 调用失败后，异步回调接口返回	
*/
function fmantv_get_env (cb_ok,cb_err) {
	return cst.E_NOT_SUPPORT;
}

/**
*下载文件到本地
*@url 下载文件的url
*@local_path 下载文件保存的本地路径
*@cb_ok(url, local_path) 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回	
*@cb_prog(value) 下载进度回调函数, value 0 ~ 100
*/
function fmantv_download_file (url, local_path, cb_ok, cb_err, cb_prog) {
	return cst.E_NOT_SUPPORT;
}

/**
*上传文件到服务器
*@url 上传文件的url
*@local_path 上传文件保存的本地路径
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回	
*@cb_prog(value) 上传进度回调函数, value 0 ~ 100
*/
function fmantv_upload_file (url, local_path, cb_ok,cb_err, cb_prog ) {
	return cst.E_NOT_SUPPORT;
}

/**
*生成一个通用数据库
*@size 生成的数据库大小, 5M以下的在html5的localStorage里生成，只能生成一个,其他情况则放到本地里或者云端
*@cb_ok(hand) 调用成功后，异步回调接口返回, hand 生成的数据库句柄
*@cb_err(err) 调用失败后，异步回调接口返回	
*/
function fmantv_db_create (size, cb_ok,cb_err) {
	return cst.E_NOT_SUPPORT;
}

/**
*生成一个数据库表
*@hand 数据库句柄
*@table_name 表名
*@items 字段名数组
*/
function fmantv_db_create_table (hand, table_name, items) {
	return cst.E_NOT_SUPPORT;
}

/**
*插入一条记录
*@hand 数据库句柄
*@table_name 表名
*@record 记录值
*/
function fmantv_db_insert (hand, table_name, record) {
	return cst.E_NOT_SUPPORT;
}

/**
*查询记录
*@hand 数据库句柄
*@table_name 表名
*@condition 条件
*@cb_ok(records) 异步返回查询结果，records 符合条件的结果数组
*/
function fmantv_db_db_query (hand, table_name, condition, cb_ok) {
	return cst.E_NOT_SUPPORT;
}

/**
*删除记录
*@hand 数据库句柄
*@table_name 表名
*@condition 条件
*/
function fmantv_db_delete_rows (hand, table_name, condition) {
	return cst.E_NOT_SUPPORT;
}

/**
*更新数据句柄, 重新加载数据库，返回新的句柄；主要发生在多个模块访问同一个数据库时，但使用不同的句柄。
*@old_hand 数据库句柄
*@cb_ok(new_hand) 成功后的异步回调
*@cb_err(err) 失败后的异步回调
*/
function fmantv_db_flush (old_hand) {
	return cst.E_NOT_SUPPORT;
}

/**
*关闭数据库，操作后原来的数据库句柄无效
*@hand 要关闭的数据库句柄
*/
function fmantv_db_close (hand) {
	return cst.E_NOT_SUPPORT;
}

/**
*用户信息
*@user_id 要查询的用户，当前用户为空
*@cb_ok(info) 成功后的异步回调，info 用户信息对象
*@cb_err(err) 失败后异步回调
*/
function fmantv_user_info (user_id, cb_ok, cb_err) {
	return cst.E_NOT_SUPPORT;
}

/**
*用户登录，以后可以扩展支持在线和离线登录
*@user_id 用户id
*@password 密码
*@verify_code 校验码
*@cb_ok 成功后的异步回调
*@cb_err(err) 失败后的异步回调
*/
function fmantv_user_login (user_id, password, verify_code, cb_ok, cb_err ) {
	return cst.E_NOT_SUPPORT;
}

/**
*当前用户退出登录
*/
function fmantv_user_exit () {
	return cst.E_NOT_SUPPORT;
}

/**
*模板保存
*@templet_id 模板id
*@cb_ok 成功后的异步回调
*@cb_err 失败后的异步回调
*@cb_prog(value) 进度， 0 ~ 100
*/
function fmantv_save_templet (templet_id, cb_ok, cb_err, cb_prog ) {
	return cst.E_NOT_SUPPORT;
}

/**
*读取指定模板
*@templet_id 模板id
*@cb_ok(templet_obj) 调用成功后，异步回调接口返回, templet_obj 模板对象
*@cb_err(err) 调用失败后，异步回调接口返回
*/
function fmantv_read_templet (templet_id, cb_ok, cb_err) {
	return cst.E_NOT_SUPPORT;
}

/**
*查询模板信息
*@start 从指定序号开始查询, 从0计数
*@items 取多少个作品信息
*@cb_ok(infos) 调用成功后，异步回调接口返回, infos 模板信息数组
*@cb_err(err) 调用失败后，异步回调接口返回
*/
function fmantv_query_templet (start, items, cb_ok, cb_err) {
	return cst.E_NOT_SUPPORT;
}

/**
*作品保存 
*@work_id 作品id
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回
*@cb_prog(value) 进度, 0 ~ 100
*/
function fmantv_save_work (work_id, cb_ok, cb_err, cb_prog) {
	return cst.E_NOT_SUPPORT;
}

/**
*读取指定作品
*@work_id 作品id
*@cb_ok(work_obj) 调用成功后，异步回调接口返回, work_obj 作品对象
*@cb_err(err) 调用失败后，异步回调接口返回
*/
function fmantv_read_work (work_id, cb_ok, cb_err) {
	return cst.E_NOT_SUPPORT;
}

/**
*查询全部作品信息
*@start 从指定序号开始查询, 从0计数
*@items 取多少个作品信息
*@cb_ok(infos) 调用成功后，异步回调接口返回, 作品信息数组
*@cb_err(err) 调用失败后，异步回调接口返回
*/
function fmantv_query_all_work (start, items, cb_ok, cb_err) {
	return cst.E_NOT_SUPPORT;
}

/**
*支付 
*@pay_obj 支付对象 
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回
*/
function fmantv_pay (pay_obj, cb_ok, cb_err) {
	return cst.E_NOT_SUPPORT;
}

/**
*得到机器唯一id 
*@cb_ok(id) 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回
*/
function fmantv_machine_id (cb_ok, cb_err) {
   if ( fmantv_is_inited==false ) return cst.E_NOT_INIT;        
   var exec = cordova.require("cordova/exec");        	        
   exec( function (id) {
			if (cb_ok) cb_ok(id);
		}, function (err) {
			if (cb_err) cb_err(err);
		}, "gliplug", "fmantv_machine_id", []);						   
   return 0;
}

/**
*下载程序更新包 
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回
*/
function fmantv_download_package (url, cb_ok, cb_err) {
   if ( fmantv_is_inited==false ) return cst.E_NOT_INIT;        
   var exec = cordova.require("cordova/exec");        	        
   exec( function () {
			if (cb_ok) cb_ok();
		}, function (err) {
			if (cb_err) cb_err(err);
		}, "gliplug", "fmantv_download_package", [url]);						   
   return 0;	
}

/**
*自动更新程序代码 
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回
*/
function fmantv_update (cb_ok, cb_err) {
   if ( fmantv_is_inited==false ) return cst.E_NOT_INIT;        
   var exec = cordova.require("cordova/exec");        	        
   exec( function () {
			if (cb_ok) cb_ok();
		}, function (err) {
			if (cb_err) cb_err(err);
		}, "gliplug", "fmantv_update", []);						   
   return 0;		
}

/**
 *从app调用浏览器打开网页
 *@url 网页地址, 形如 "http://xxx" or "https://xxx"
 *@cb_ok() 调用成功后，异步回调接口返回
 *@cb_err(err) 调用失败后，异步回调接口返回
 */
function fmantv_call_browser(url, cb_ok, cb_err) {
    if ( fmantv_is_inited==false ) return cst.E_NOT_INIT;
    var exec = cordova.require("cordova/exec");
    exec( function () {
         if (cb_ok) cb_ok();
         }, function (err) {
         if (cb_err) cb_err(err);
         }, "gliplug", "fmantv_call_browser", [url]);
    return 0;
}


/**
 *从浏览器返回到app, 调用本接口前可以不用初始化
 *@result , 返回到app的值
 */
function fmantv_backto_app (result) {
    var os_type = get_os_type ();
    if ( os_type=="mac" ) {
        window.location.href = "glime://result=" + result;
    }
    else if ( os_type=="linux"){
        //todo
    }
}

(function(){
    fmantv_init("js/fmantv/",function(){

    },
    function(err){
        //alert("本机模块初始化失败!原因是："+err.message);
    });
}());
