
//begin-------------------ARE.CircleShape---------------------begin

ARE.CircleShape = ARE.DisplayObject.extend({
    "ctor": function(r, color, isHollow) {
        this._super();
        this.r = r || 1;
        this.color = color || "black";
        this.isHollow = isHollow;
        this.width = this.height = 2 * r;
        this.draw();
    },
    "draw": function(ctx) {
        this.cache();
        var ctx = this.cacheCtx;
        ctx.beginPath();
        ctx.arc(this.r, this.r, this.r, 0, Math.PI * 2);
        this.originX = this.originY = .5;
        this.isHollow ? (ctx.strokeStyle = this.color, ctx.stroke()) : (ctx.fillStyle = this.color, ctx.fill());
    }
});

//end-------------------ARE.CircleShape---------------------end
