
//begin-------------------are.Text---------------------begin

are.Text = are.DisplayObject.extend({
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
        var t = new are.Text(this.text, this.font, this.color);
        this.cloneProps(t);
        return t;
    }
});

//end-------------------are.Text---------------------end
