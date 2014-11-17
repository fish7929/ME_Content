var fma_data = {};

fma_data.queryByField = function(field,value,orderby,isAscending,skip,limit,cb_ok,cb_err){
    //查询云端模版/作品
    var tpl_works = fmacloud.Object.extend("tplobj");
    var query = new fmacloud.Query(tpl_works);

    query.skip(skip);
    query.limit(limit);

    var failed = false;

    if ( orderby != null ){
        if ( isAscending ){
            query.ascending(orderby);
        } else{
            query.descending(orderby);
        }
    }

    query.equalTo(field,value);

   // query.containsAll(field,value);

    if ( ! failed )
    {
        query.find({success:cb_ok,error:cb_err});
    }else{
        cb_err(fmacloud.Error(fmacloud.Error.REQUEST_NOT_SUPPORTED,""));
    }
};

fma_data.querySalePos = function(sale_pos_value,skip,limit,cb_ok,cb_err){

    var tpl_works = fmacloud.Object.extend("tplobj");
    var query = new fmacloud.Query(tpl_works);

    query.skip(skip);
    query.limit(limit);

    query.containedIn("tpl_type",[3,0,1]);
    query.greaterThan("approved",0);
    query.containedIn("sale_pos",[sale_pos_value,0]);
    query.descending("updatedAt");

    query.find({success:cb_ok,error:cb_err});
};

fma_data.queryLabel = function(label,skip,limit,cb_ok,cb_err){

    var tpl_works = fmacloud.Object.extend("tplobj");
    var query = new fmacloud.Query(tpl_works);

    query.skip(skip);
    query.limit(limit);

    query.lessThanOrEqualTo("tpl_type",1);
    query.greaterThan("approved",0);
    query.contains("label",label);
    query.descending("updatedAt");

    query.find({success:cb_ok,error:cb_err});
};

