// 文件名称: eventconstant.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/10
// 描    述: 事件类型常量定义
define(function(){

    /**
     * 事件类型常量定义
     * @type {{}}
     */
    var EventConstant = {};

    /**
     * 显示对象单击
     * @type {string}
     */
    EventConstant.DISPLAYOBJECT_CLICK = "DISPLAYOBJECT_CLICK";

    /**
     * 显示对象双击
     * @type {string}
     */
    EventConstant.DISPLAYOBJECT_DBLCLICK = "DISPLAYOBJECT_DBLCLICK";

    /**
     * 显示对象新增事件
     * @type {string}
     */
    EventConstant.DISPLAYOBJECT_ADDED = "DISPLAYOBJECT_ADDED";

    /**
     * 显示对象水平缩放事件
     * @type {string}
     */
    EventConstant.DISPLAYOBJECT_HSCALE = "DISPLAYOBJECT_HSCALE";

    /**
     * 显示对象删除事件
     * @type {string}
     */
    EventConstant.DISPLAYOBJECT_REMOVED = "DISPLAYOBJECT_REMOVED";

    /**
     * 文字编辑界面显示事件
     * @type {string}
     */
    EventConstant.SHOW_TEXT_EDIT = "SHOW_TEXT_EDIT";

    /**
     * 显示水印编辑界面事件
     * @type {string}
     */
    EventConstant.SHOW_WATERMARK_EDIT = "SHOW_WATERMARK_EDIT";

    /**
     * 显示文字输入界面
     * @type {string}
     */
    EventConstant.SHOW_TEXT_INPUT = "SHOW_TEXT_INPUT";

    window.EventConstant = EventConstant;

    return EventConstant;
});