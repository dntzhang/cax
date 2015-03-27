
//begin-------------------ARE.ParticleSystem---------------------begin

ARE.ParticleSystem = ARE.Container.extend({
    "ctor": function(option) {
        this._super();
        this.speed = option.speed;
        this.angle = option.angle;
        this.angleRange = option.angleRange;
        this.emitArea = option.emitArea;
        this.gravity = option.gravity;
        this.filter = option.filter;
        this.compositeOperation = "lighter";
        this.emitCount = option.emitCount;
        this.maxCount = option.maxCount || 100;
        this.emitX = option.emitX;
        this.emitY = option.emitY;
        this.textureReady = false,
        self = this;
        if (typeof option.texture === "string") {
            var img = new Image();
            img.onload = function() {
                self.texture = img;
                self.textureReady = true;
            };
            img.src = option.texture;
        } else {
            this.textureReady = true;
            this.texture = option.texture;
        }
        this.tickFPS = 60;
    },
    "emit": function() {
        var angle = (this.angle + ARE.Util.random(-this.angleRange / 2, this.angleRange / 2)) * Math.PI / 180;
        var particle = new ARE.Particle({
    position: new ARE.Vector2(this.emitX + ARE.Util.random(0, this.emitArea[0]), this.emitY + ARE.Util.random(0, this.emitArea[1])),
    velocity: new ARE.Vector2(this.speed * Math.cos(angle), this.speed * Math.sin(angle)),
    texture: this.texture,
    acceleration: this.gravity,
    filter: this.filter
});
        this.add(particle);
    },
    "tick": function() {
        if (this.textureReady) {
            var len = this.children.length;
            if (len < this.maxCount) {
                for (var k = 0; k < this.emitCount; k++) {
                    this.emit();
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
