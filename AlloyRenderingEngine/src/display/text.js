
//begin-------------------ARE.Text---------------------begin

ARE.Text = ARE.DisplayObject.extend({
    "ctor": function(value, font, color) {
        this._super();
        this.value = value;
        this.font = font;
        this.color = color;
        this.textAlign = "left";
        this.textBaseline = "top";
    },
    "draw": function(ctx) {
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.textAlign = this.textAlign || "left";
        ctx.textBaseline = this.textBaseline || "top";
        ctx.fillText(this.value, 0, 0);
    },
    "clone": function() {
        var t = new ARE.Text(this.text, this.font, this.color);
        this.cloneProps(t);
        return t;
    },
    "getWidth": function () {
        var measureCtx = document.createElement("canvas").getContext("2d");
        measureCtx.font = this.font;
        var width = measureCtx.measureText(this.value).width;
        measureCtx = null;
        return width;
    }
});

//end-------------------ARE.Text---------------------end
