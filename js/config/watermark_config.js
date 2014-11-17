// 文件名称: watermark_config.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/05
// 描    述: 水印配置文件
define(function(){
    /**
     * 水印配置，增加水印修改此文件
     * @type {*[]}
     */
    var frames = {
        keys : ["signature","stamp", "shape"],
        labels : ["签章","贴纸","形状"],
        "signature" : [ //签章
           {
               url : "images/skin3/pic_frame_list.png"
           }
        ],
        "stamp" : [ //印花,
           {
               url : "images/skin3/pic_frame_list.png"
           },
            {
                url : "images/watermark/stamp/1.png"
            },
            {
                url : "images/watermark/stamp/2.png"
            },
            {
                url : "images/watermark/stamp/3.png"
            },
            {
                url : "images/watermark/stamp/4.png"
            },
            {
                url : "images/watermark/stamp/5.png"
            },
            {
                url : "images/watermark/stamp/6.png"
            },
            {
                url : "images/watermark/stamp/7.png"
            },
            {
                url : "images/watermark/stamp/8.png"
            },
            {
                url : "images/watermark/stamp/9.png"
            }
        ],
		"shape" : [ //形状
           {
               url : "images/skin3/pic_frame_list.png"
           }
        ]
    };

    return frames;
});