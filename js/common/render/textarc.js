this.createjs=this.createjs||{};

(function () {

    var TextArc = function (text, font, color, radius) {
        this.initialize(text, font, color, radius);
    }

    TextArc.prototype = new createjs.Text();

    TextArc.prototype.Text_initialize = TextArc.prototype.initialize;

    TextArc.prototype.initialize = function (text, font, color, radius) {
        this.Text_initialize(text, font, color);
        this.radius = radius;
        this.textBaseline = "center";
    }

    TextArc.prototype.Text_drawTextLine = TextArc.prototype._drawTextLine;

    TextArc.prototype._drawTextLine = function (ctx, text, y) {
        var wordWidth = ctx.measureText(text).width;
        var angle = 2 * Math.asin(wordWidth / ( 2 * this.radius ));
        ctx.save();
        ctx.rotate(-1 * angle / 2);
        ctx.rotate(-1 * (angle / text.length) / 2);
        for (var i = 0; i < text.length; i++) {
            ctx.rotate(angle / text.length);
            ctx.save();
            ctx.translate(0, -1 * this.radius);
            this.Text_drawTextLine(ctx, text[i], y);
            ctx.restore();
        }
        ctx.restore();
    }

    createjs.TextArc = TextArc;
}());