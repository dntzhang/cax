/**
* 粒子系统
*
* @class ParticleSystem
* @constructor
*/
define("ARE.ParticleSystem:ARE.Container", {
    ctor: function (option) {
        this._super();
        //发射速度
        this.speed = option.speed;
        //发射角度
        this.angle = option.angle;
        //发射范围
        this.angleRange = option.angleRange;
        //发射区域width、height
        this.emitArea = option.emitArea;
        //重力场
        this.gravity = option.gravity;

        //粒子容器
        this.filter = option.filter;
        this.compositeOperation = "lighter";

        this.emitCount = option.emitCount;

        this.maxCount = option.maxCount || 100;

        this.emitX = option.emitX;
        this.emitY = option.emitY;

        this.textureReady = false, self = this;
        if (typeof option.texture === "string") {
            var img = new Image();
            img.onload = function () {
                self.texture = img;
                self.textureReady = true;
            }
            img.src = option.texture;
        } else {
            //粒子纹理
            this.textureReady = true;
            this.texture = option.texture;
        }

        this.tickFPS = 60;
    },
    emit: function () {
        var angle = (this.angle + Util.random(-this.angleRange / 2, this.angleRange / 2)) * Math.PI / 180;

        var particle = new Particle({
            position: new Vector2(this.emitX + Util.random(0, this.emitArea[0]), this.emitY + Util.random(0, this.emitArea[1])),
            velocity: new Vector2(this.speed * Math.cos(angle), this.speed * Math.sin(angle)),
            texture: this.texture,
            acceleration: this.gravity,
            filter: this.filter
        });
        this.add(particle);
    },
    tick: function () {
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
})