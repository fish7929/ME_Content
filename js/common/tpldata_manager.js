// 文件名称: tpldata_manager.js
//
// 创 建 人: chenshy
// 创建日期: 2014/09/25
// 描    述: 模板数据的管理容器，主要管理用户正在操作的模板数据，如用户正在制作的模板
define(["jquery"],function($){

    if(window.TplDataManager){
        return window.TplDataManager;
    }

    /**
     * 显示对象的管理器
     *
     */
    var TplDataManager = {
        currentTplData : null, //当前选中的模板数据
        tplDatas : []
    };

    TplDataManager.addTpls = function(obj){
        var arr = TplDataManager.tplDatas;
        if(obj instanceof Array){
            for(var i=0;i < obj.length;i++){
                var o = obj[i];
                if(arr.indexOf(o) == -1){
                    arr.push(o);
                }
            }
        }else{
            if(arr.indexOf(obj) == -1){
                arr.push(obj);
            }
        }
    };

    TplDataManager.getTpl = function(tplId){
        var arr = TplDataManager.tplDatas;
        for(var i = 0;i < arr.length;i++){
            var o = arr[i];
            var _tplId = o.get("tpl_id");
            if(tplId == _tplId){
                return o;
            }
        }

        return null;
    };

    window.TplDataManager = TplDataManager;

    return TplDataManager;
});