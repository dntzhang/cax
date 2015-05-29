
//begin-------------------are.CircleShape---------------------begin

are.CircleShape = are.DisplayObject.extend({
    "ctor": function(r, color, isHollow) {
        this._super();
        this.r = r || 1;
        this.color = color || "black";
        this.isHollow = isHollow;
        this.width = this.height = 2 * r;
        this.shapeCanvas = document.createElement("canvas");
        this.shapeCanvas.width = this.width;
        this.shapeCanvas.height = this.height;
        this.shapeCtx = this.shapeCanvas.getContext("2d");
        this.draw();
        this.cacheID = are.UID.getCacheID();
    },
    "draw": function(ctx) {
        var ctx = this.shapeCtx;
        ctx.beginPath();
        ctx.arc(this.r, this.r, this.r, 0, Math.PI * 2);
        this.originX = this.originY = .5;
        this.isHollow ? (ctx.strokeStyle = this.color, ctx.stroke()) : (ctx.fillStyle = this.color, ctx.fill());
    }
});

//end-------------------are.CircleShape---------------------end
