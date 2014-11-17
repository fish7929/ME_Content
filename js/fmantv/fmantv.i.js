//本机功能模块
var fmantv = function () {};

/**
*[Y]
*接口初始化，调用接口前使用
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回	
*/
fmantv.init = function (js_path,cb_ok,cb_err) {
	fmantv_init (js_path,cb_ok,cb_err);
}

/**
*[Y]
*接口反初始化，不再调用接口后使用
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回	
*/
fmantv.uninit = function (cb_ok,cb_err) {
	fmantv_uninit (cb_ok,cb_err);
}

/**
 *[Y]
 *保存到相册
 *@base64_data 图片base64 data
 *@cb_ok() 调用成功后，异步回调接口返回
 *@cb_err(err) 调用失败后，异步回调接口返回
 */
fmantv.save_to_album = function (base64_data,cb_ok,cb_err) {
	fmantv_save_to_album (base64_data,cb_ok,cb_err);
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
fmantv.share = function (user_id, share_obj, obj_type, dst_type, cb_ok,cb_err) {
	fmantv_share (user_id, share_obj, obj_type, dst_type, cb_ok,cb_err);
}

/**
*特效制作
*@page_obj 页对象
*@templet_obj 模板对象
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回	
*@cb_prog(value) 进度 0 ~ 100
*/
fmantv.model_make = function (page_obj, templet_obj, cb_ok,cb_err) {
	fmantv_model_make (page_obj, templet_obj, cb_ok,cb_err);
}

/**
*消息推送
*@message 消息文本
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回	
*/
fmantv.message_send = function (message, cb_ok,cb_err) {
	fmantv_message_send (message, cb_ok,cb_err);
}

/**
*设置剪贴板
*@data_obj	数据对象，支持文本，图片，链接，音视频等
*/
fmantv.pasteboard_set_data = function (data_obj) {
	fmantv_pasteboard_set_data (data_obj);
}

/**
*读取剪贴板
*@cb_ok(data_obj) 调用成功后，异步回调接口返回, data_obj 数据对象,支持文本，图片，链接，音视频等
*@cb_err(err) 调用失败后，异步回调接口返回	
*/
fmantv.pasteboard_get_data = function (cb_ok,cb_err) {
	fmantv_pasteboard_get_data (cb_ok,cb_err);
}

/**
*接退出程序
*/
fmantv.exit_app = function () {
	fmantv_exit_app ();
}

/**
*得到系统和网络环境状态
*@cb_ok(env_obj) 调用成功后，异步回调接口返回, env_obj 环境对象
*@cb_err(err) 调用失败后，异步回调接口返回	
*/
fmantv.get_env = function (cb_ok,cb_err) {
	fmantv_get_env (cb_ok,cb_err);
}

/**
*下载文件到本地
*@url 下载文件的url
*@local_path 下载文件保存的本地路径
*@cb_ok(url, local_path) 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回	
*@cb_prog(value) 下载进度回调函数, value 0 ~ 100
*/
fmantv.download_file = function (url, local_path, cb_ok, cb_err, cb_prog) {
	fmantv_download_file (url, local_path, cb_ok, cb_err, cb_prog);
}

/**
*上传文件到服务器
*@url 上传文件的url
*@local_path 上传文件保存的本地路径
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回	
*@cb_prog(value) 上传进度回调函数, value 0 ~ 100
*/
fmantv.upload_file = function (url, local_path, cb_ok,cb_err, cb_prog ) {
	fmantv_upload_file (url, local_path, cb_ok,cb_err, cb_prog );
}

/**
*生成一个通用数据库
*@size 生成的数据库大小, 5M以下的在html5的localStorage里生成，只能生成一个,其他情况则放到本地里或者云端
*@cb_ok(hand) 调用成功后，异步回调接口返回, hand 生成的数据库句柄
*@cb_err(err) 调用失败后，异步回调接口返回	
*/
fmantv.db_create = function (size, cb_ok,cb_err) {
	fmantv_db_create (size, cb_ok,cb_err);
}

/**
*生成一个数据库表
*@hand 数据库句柄
*@table_name 表名
*@items 字段名数组
*/
fmantv.db_create_table = function (hand, table_name, items) {
	fmantv_db_create_table (hand, table_name, items);
}

/**
*插入一条记录
*@hand 数据库句柄
*@table_name 表名
*@record 记录值
*/
fmantv.db_insert = function (hand, table_name, record) {
	fmantv_db_insert (hand, table_name, record);
}

/**
*查询记录
*@hand 数据库句柄
*@table_name 表名
*@condition 条件
*@cb_ok(records) 异步返回查询结果，records 符合条件的结果数组
*/
fmantv.db_db_query = function (hand, table_name, condition, cb_ok) {
	fmantv_db_db_query (hand, table_name, condition, cb_ok);
}

/**
*删除记录
*@hand 数据库句柄
*@table_name 表名
*@condition 条件
*/
fmantv.db_delete_rows = function (hand, table_name, condition) {
	fmantv_db_delete_rows (hand, table_name, condition);
}

/**
*更新数据句柄, 重新加载数据库，返回新的句柄；主要发生在多个模块访问同一个数据库时，但使用不同的句柄。
*@old_hand 数据库句柄
*@cb_ok(new_hand) 成功后的异步回调
*@cb_err(err) 失败后的异步回调
*/
fmantv.db_flush = function (old_hand) {
	fmantv_db_flush (old_hand);
}

/**
*关闭数据库，操作后原来的数据库句柄无效
*@hand 要关闭的数据库句柄
*/
fmantv.db_close = function (hand) {	
	fmantv_db_close (hand);
}

/**
*用户信息
*@user_id 要查询的用户，当前用户为空
*@cb_ok(info) 成功后的异步回调，info 用户信息对象
*@cb_err(err) 失败后异步回调
*/
fmantv.user_info = function (user_id, cb_ok, cb_err) {
	fmantv_user_info (user_id, cb_ok, cb_err);
}

/**
*用户登录，以后可以扩展支持在线和离线登录
*@user_id 用户id
*@password 密码
*@verify_code 校验码
*@cb_ok 成功后的异步回调
*@cb_err(err) 失败后的异步回调
*/
fmantv.user_login = function (user_id, password, verify_code, cb_ok, cb_err ) {
	fmantv_user_login (user_id, password, verify_code, cb_ok, cb_err );
}

/**
*当前用户退出登录
*/
fmantv.user_exit = function () {
	fmantv_user_exit ();
}

/**
*模板保存
*@templet_id 模板id
*@cb_ok 成功后的异步回调
*@cb_err 失败后的异步回调
*@cb_prog(value) 进度， 0 ~ 100
*/
fmantv.save_templet = function (templet_id, cb_ok, cb_err, cb_prog ) {
	fmantv_save_templet (templet_id, cb_ok, cb_err, cb_prog );
}

/**
*读取指定模板
*@templet_id 模板id
*@cb_ok(templet_obj) 调用成功后，异步回调接口返回, templet_obj 模板对象
*@cb_err(err) 调用失败后，异步回调接口返回
*/
fmantv.read_templet = function (templet_id, cb_ok, cb_err) {
	fmantv_read_templet (templet_id, cb_ok, cb_err);
}

/**
*查询模板信息
*@start 从指定序号开始查询, 从0计数
*@items 取多少个作品信息
*@cb_ok(infos) 调用成功后，异步回调接口返回, infos 模板信息数组
*@cb_err(err) 调用失败后，异步回调接口返回
*/
fmantv.query_templet = function (start, items, cb_ok, cb_err) {
	fmantv_query_templet (start, items, cb_ok, cb_err);
}

/**
*作品保存 
*@work_id 作品id
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回
*@cb_prog(value) 进度, 0 ~ 100
*/
fmantv.save_work = function (work_id, cb_ok, cb_err, cb_prog) {	
	fmantv_save_work (work_id, cb_ok, cb_err, cb_prog);
}

/**
*读取指定作品
*@work_id 作品id
*@cb_ok(work_obj) 调用成功后，异步回调接口返回, work_obj 作品对象
*@cb_err(err) 调用失败后，异步回调接口返回
*/
fmantv.read_work = function (work_id, cb_ok, cb_err) {
	fmantv_read_work (work_id, cb_ok, cb_err);
}

/**
*查询全部作品信息
*@start 从指定序号开始查询, 从0计数
*@items 取多少个作品信息
*@cb_ok(infos) 调用成功后，异步回调接口返回, 作品信息数组
*@cb_err(err) 调用失败后，异步回调接口返回
*/
fmantv.query_all_work = function (start, items, cb_ok, cb_err) {
	fmantv_query_all_work (start, items, cb_ok, cb_err);
}

/**
*支付 
*@pay_obj 支付对象 
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回
*/
fmantv.pay = function (pay_obj, cb_ok, cb_err) {
	fmantv_pay (pay_obj, cb_ok, cb_err);
}

/**
*[Y]
*得到机器唯一id 
*@cb_ok(id) 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回
*/
fmantv.machine_id = function (cb_ok, cb_err) {
	fmantv_machine_id (cb_ok, cb_err);
}

/**
*[Y]
*下载程序更新包 
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回
*/
fmantv.download_package = function (url, cb_ok, cb_err) {
	fmantv_download_package (url, cb_ok, cb_err);
}

/**
*[Y]
*自动更新程序代码, NOT support.
*@cb_ok() 调用成功后，异步回调接口返回
*@cb_err(err) 调用失败后，异步回调接口返回
*/
fmantv.update = function (cb_ok, cb_err) {
	fmantv_update(cb_ok, cb_err);
}

/**
 *从app调用浏览器打开网页
 *@url 网页地址, 形如 "http://xxx" or "https://xxx"
 *@cb_ok() 调用成功后，异步回调接口返回
 *@cb_err(err) 调用失败后，异步回调接口返回
 */
fmantv.call_browser = function (url, cb_ok, cb_err) {
    fmantv_call_browser(url, cb_ok, cb_err);
}

/**
 *从浏览器返回到app, 调用本接口前可以不用初始化
 *@result , 返回到app的值
 */
fmantv.backto_app = function (result) {
    fmantv_backto_app(result);
}

