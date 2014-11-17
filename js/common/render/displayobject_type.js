// 文件名称: displayobject_type.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/23
// 描    述: 显示对象类型定义
define(function(){

    /**
     * 事件类型常量定义
     * @type {{}}
     */
    var DisplayObjectType = {};

    /**
     * 图片
     * @type {number}
     */
    DisplayObjectType.PIC = 1;

    /**
     * 文本
     * @type {number}
     */
    DisplayObjectType.TEXT = 2;

    /**
     * 水印
     * @type {number}
     */
    DisplayObjectType.WATERMARK = 3;

    /**
     * 动画
     * @type {number}
     */
    DisplayObjectType.ANIM = 4;

    /**
     * 路径文字
     * @type {number}
     */
    DisplayObjectType.PATHTEXT = 5;

    /**
     * 填充区域
     * @type {number}
     */
    DisplayObjectType.FILLRECT = 6;

    /**
     * 音频
     * @type {number}
     */
    DisplayObjectType.AUDIO = 7;

    /**
     * 视频
     * @type {number}
     */
    DisplayObjectType.VIDEO = 8;

	// 蒙板
    DisplayObjectType.MASKRECT = 9;

	// 边框
    DisplayObjectType.PICFRAME = 10;

    window.DisplayObjectType = DisplayObjectType;
    return DisplayObjectType;
});