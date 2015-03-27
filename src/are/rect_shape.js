
//begin-------------------ARE.RectShape---------------------begin

ARE.RectShape = ARE.DisplayObject.extend({
    "ctor": function(width, height, color, isHollow) {
        this._super();
        this.color = color || "black";
        this.isHollow = isHollow;
        this.width = width;
        this.height = height;
        this.originX = this.originY = .5;
        this.draw();
    },
    "draw": function(ctx) {
        this.cache();
        var ctx = this.cacheCtx;
        ctx.beginPath();
        ctx.arc(this.r, this.r, this.r, 0, Math.PI * 2);
        this.isHollow ? (ctx.strokeStyle = this.color, ctx.strokeRect(0, 0, this.width, this.height)) : (ctx.fillStyle = this.color, ctx.fillRect(0, 0, this.width, this.height));
    }
});

//end-------------------ARE.RectShape---------------------end
