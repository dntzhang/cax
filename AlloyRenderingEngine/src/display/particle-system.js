
//begin-------------------ARE.ParticleSystem---------------------begin

ARE.ParticleSystem = ARE.Container.extend({
    "ctor": function(option) {
        this._super();
        this.speed = option.speed;
        this.angle = option.angle;
        this.angleRange = option.angleRange;
        this.emitArea = option.emitArea;
        this.gravity = option.gravity || {
            x: 0,
            y: 0
        };
        this.filter = option.filter;
        this.compositeOperation = "lighter";
        this.emitCount = option.emitCount;
        this.maxCount = option.maxCount || 1e3;
        this.emitX = option.emitX;
        this.emitY = option.emitY;
        var self = this;
        if (typeof option.texture === "string") {
            if (ARE.Bitmap[option.texture]) {
                this.texture = ARE.Bitmap[option.texture];
                this.generateFilterTexture(this.texture);
            } else {
                this.bitmap = new ARE.Bitmap();
                this.bitmap._parent = this;
                this.bitmap.onImageLoad(function() {
                    this._parent.texture = this.img;
                    this._parent.generateFilterTexture(this.img);
                    delete this._parent;
                });
                this.bitmap.useImage(option.texture);
            }
        } else {
            this.texture = option.texture;
            this.generateFilterTexture(option.texture);
        }
        this.totalCount = option.totalCount;
        this.emittedCount = 0;
        this.tickFPS = 60;
        this.hideSpeed = option.hideSpeed || .01;
    },
    "generateFilterTexture": function(texture) {
        var bitmap = new ARE.Bitmap(texture);
        bitmap.filter = this.filter;
        this.filterTexture = bitmap.cacheCanvas;
    },
    "emit": function() {
        var angle = (this.angle + ARE.Util.random(-this.angleRange / 2, this.angleRange / 2)) * Math.PI / 180;
        var halfX = this.emitArea[0] / 2,
            harfY = this.emitArea[1] / 2;
        var particle = new ARE.Particle({
    position: new ARE.Vector2(this.emitX + ARE.Util.random(-halfX, halfX), this.emitY + ARE.Util.random(-harfY, harfY)),
    velocity: new ARE.Vector2(this.speed * Math.cos(angle), this.speed * Math.sin(angle)),
    texture: this.filterTexture,
    acceleration: this.gravity,
    hideSpeed: this.hideSpeed
});
        this.add(particle);
        this.emittedCount++;
    },
    "tick": function() {
        if (this.filterTexture) {
            var len = this.children.length;
            if (this.totalCount && this.emittedCount > this.totalCount) {
                if (len === 0) this.destroy();
            } else {
                if (len < this.maxCount) {
                    for (var k = 0; k < this.emitCount; k++) {
                        this.emit();
                    }
                }
            }
            for (var i = 0; i < len; i++) {
                var item = this.children[i];
                if (item.isVisible()) {
                    item.tick();
                } else {
                    this.remove(item);
                    i--;
                    len--;
                }
            }
        }
    }
});

//end-------------------ARE.ParticleSystem---------------------end
