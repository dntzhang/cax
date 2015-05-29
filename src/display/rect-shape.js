
//begin-------------------are.RectShape---------------------begin

are.RectShape = are.DisplayObject.extend({
    "ctor": function(width, height, color, isHollow) {
        this._super();
        this.color = color || "black";
        this.isHollow = isHollow;
        this.width = width;
        this.height = height;
        this.originX = this.originY = .5;
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
        this.isHollow ? (ctx.strokeStyle = this.color, ctx.strokeRect(0, 0, this.width, this.height)) : (ctx.fillStyle = this.color, ctx.fillRect(0, 0, this.width, this.height));
    }
});

//end-------------------are.RectShape---------------------end
