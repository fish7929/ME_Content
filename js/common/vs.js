define(function(){
    /**
     * 虚拟屏幕对象
     * @type {{}}
     */
    var VS = window.VS = {
        width : 0,
        height : 0,
        tplWidth : 0,
        tplHeight : 0,
        xScale : 0,
        yScale : 0,
        canvasWidth : 0,
        canvasHeight : 0
    };

    /**
     * 初始化屏屏
     * @param width 图形区域宽度
     * @param height 图形区域高度
     * @param tplWidth 模板宽度
     * @param tplHeight 模板高度
     */
    VS.init = function(width,height,tplWidth,tplHeight){
        var scale = 1;

        tplWidth = tplWidth || this.tplWidth;
        tplHeight = tplHeight || this.tplHeight;

        var canvasWidth = 0,
            canvasHeight = 0,
            imageWidth = tplWidth,
            imageHeight = tplHeight;

        //计算缩放比
        //当图片的宽度或者高度超出容器或者小于容器宽高
        //计算宽高缩放比
        //按缩放度最大的进行缩放
        var scaleWidth = width / imageWidth;
        var scaleHeight = height / imageHeight;
        if(scaleWidth < scaleHeight){
            canvasWidth = width;
            canvasHeight = imageHeight * scaleWidth;
            scale = scaleWidth;
        }else{
            canvasHeight = height;
            canvasWidth = imageWidth * scaleHeight;
            scale = scaleHeight;
        }
//        console.log("scaleWidth:"+scaleWidth+"/"+scaleHeight+
//           "\r\ncanvasWidth:"+ canvasWidth + "/"+canvasHeight+
//            "\r\nwidth:"+width+"/"+height+
//            "\r\nimageWidth:"+imageWidth+"/"+imageHeight);

        this.width = width;
        this.height = height;

        /**
         * canvas的宽高
         * @type {number}
         */
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        /**
         * 模板宽高
         */
        this.tplWidth = tplWidth;
        this.tplHeight = tplHeight;

        /**
         * 缩放系数
         * @type {number}
         */
        this.xScale = scale;
        this.yScale = scale;
        //alert("width:"+width+",height:"+height+",scale:"+scale);
    };

    /**
     * 缩放x方向上的一个值
     * @param value
     */
    VS.vx = function(value){
        return value * this.xScale;
    };

    /**
     * 缩放y方向上的一个值
     * @param value
     */
    VS.vy = function(value){
        return value * this.yScale;
    };

    VS.rvx = function(value){
        return value / this.xScale;
    };

    VS.rvy = function(value){
        return value / this.yScale;
    };

    return VS;
});