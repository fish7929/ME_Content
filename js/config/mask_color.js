// 文件名称: mask_color.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/03
// 描    述: 蒙罩颜色值定义，需要加颜色改此文件
// 该文件对应背景颜色修改
define(function(){
    /**
     * 颜色值数组
     * 数组里只有一个颜色值表示单色，
     * 多个颜色值表渐变
     * @type {*[]}
     */
    var colors = [
        {colors:["#FFFFFF"]}, 
        {colors:["#CCCCCC"]},
        {colors:["#999999"]},
        {colors:["#666666"]},
        {colors:["#333333"]},
        {colors:["#000000"]},
        {colors:["#FF004C"]},
        {colors:["#FF0126"]},
        {colors:["#FE0000"]},
        {colors:["#FF2600"]},
        {colors:["#FE4D00"]},
        {colors:["#FF7300"]},
        {colors:["#80FF00"]},
        {colors:["#59FE01"]},
        {colors:["#33FF00"]},
        {colors:["#0EFF00"]},
        {colors:["#00FF19"]},
        {colors:["#00FF41"]},
        {colors:["#00FE67"]},
        {colors:["#01FF8D"]},
        {colors:["#00FFB3"]},
        {colors:["#00FED9"]},
        {colors:["#01FFFF"]},
        {colors:["#00D9FF"]},
        {colors:["#01B2FE"]},
        {colors:["#008CFF"]},
        {colors:["#0166FF"]},
        {colors:["#0041FF"]},
        {colors:["#001AFF"]},
        {colors:["#0D00FF"]},
        {colors:["#FE9900"]},
        {colors:["#FFBE00"]},
        {colors:["#FEE600"]},
        {colors:["#F2FF00"]},
        {colors:["#CCFF00"]},
        {colors:["#A5FF01"]},
        {colors:["#3300FF"]},
        {colors:["#5A00FE"]},
        {colors:["#7F00FF"]},
        {colors:["#A601FE"]},
        {colors:["#CC00FF"]},
        {colors:["#F000FF"]},
        {colors:["#FF00E4"]},
        {colors:["#FF00BE"]},
        {colors:["#FF0198"]},
        {colors:["#FE0072"]},

        //渐变
        {colors:["#15294D","#156387","#20A7C7","#52C3D1","#A8C3BA"]},
        {colors:["#121F54","#303A84","#5C5EB8","#A789D5","#F1BED8"]},
        {colors:["#152151","#2B3979","#5A61AE","#8D83C9","#C4A1D3"]},
        {colors:["#00082C","#012457","#014583","#0082B7","#00B4C8"]},
        {colors:["#C50302","#FD130A","#FD3F2F","#FD7159","#FA9A79"]},
        {colors:["#72BED0","#9DCED8","#C5DBDF","#E0E3DA","#F8E7D0"]},
        {colors:["#4B39B7","#7063B2","#8183A8","#7F8E9A","#568785"]},
        {colors:["#C12EAC","#C94FB4","#CA73B6","#C992B5","#D29EAB"]},
        {colors:["#0F3037","#1F4E4E","#3E796B","#81AA7E","#CCD689"]},
        {colors:["#D24F86","#E15E89","#EF7087","#FB8379","#FE966A"]},
        {colors:["#015F8B","#0078B4","#269DD2","#73BEE2","#9EBEDD"]},
        {colors:["#42255F","#744977","#B46C73","#D07E6F","#DD6648"]},
        {colors:["#41245E","#714777","#B26B73","#D07E6F","#DD6648"]},
        {colors:["#41245E","#724877","#B26A73","#D17E6F","#DD6648"]},
        {colors:["#3176B2","#5A9FC7","#A0CBD7","#E3E5D4","#E7BF8D"]},
        {colors:["#6B27BA","#5C8CD0","#85D1D2","#C6D4B2","#F4CD67"]},
        {colors:["#270D6D","#523CBC","#8A73FB","#D3ACFF","#F1DDFF"]},
        {colors:["#124755","#38686F","#6F8E8D","#BAB3A0","#F2C189"]},
        {colors:["#343D88","#43519C","#4B58A2","#7071AE","#896E93"]},
        {colors:["#343D88","#43519C","#4B58A2","#7071AE","#896E93"]},
        {colors:["#0F1B4C","#434DA3","#7A75CE","#B698DA","#F7BFD7"]}
    ];

    return colors;
});