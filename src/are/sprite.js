
//begin-------------------ARE.Sprite---------------------begin

ARE.Sprite = ARE.DisplayObject.extend({
    "ctor": function(option) {
        this._super();
        this.option = option;
        this.x = option.x || 0;
        this.y = option.y || 0;
        this.currentFrameIndex = 0;
        this.animationFrameIndex = 0;
        this.currentAnimation = option.currentAnimation || null;
        this.rect = [0, 0, 10, 10];
        this.visible = false;
        this.bitmaps = [],
        this._loadedCount = 0,
        self = this;
        for (var i = 0, len = this.option.imgs.length; i < len; i++) {
            var bmp = new ARE.Bitmap();
            bmp._sprite = this;
            bmp.onImageLoad(function() {
                bmp._sprite._loadedCount++;
                if (bmp._sprite._loadedCount === len) {
                    bmp._sprite.visible = true;
                    delete bmp._sprite;
                }
            });
            bmp.useImage(this.option.imgs[i]);
            this.bitmaps.push(bmp);
        }
        this.img = this.bitmaps[0].img;
        this.interval = 1e3 / option.framerate;
        this.loop = null;
        this.paused = false;
        this.animationEnd = option.animationEnd || null;
        if (this.currentAnimation) {
            this.gotoAndPlay(this.currentAnimation);
        }
        this.tickAnimationEnd = option.tickAnimationEnd || null;
    },
    "play": function() {
        this.paused = false;
    },
    "stop": function() {
        this.paused = true;
    },
    "reset": function() {
        this.currentFrameIndex = 0;
        this.animationFrameIndex = 0;
    },
    "gotoAndPlay": function(animation, times) {
        this.paused = false;
        this.reset();
        clearInterval(this.loop);
        this.currentAnimation = animation;
        var self = this;
        var playTimes = 0;
        this.loop = setInterval(function() {
            if (!self.paused) {
                var opt = self.option;
                var frames = opt.animations[self.currentAnimation].frames,
                    len = frames.length;
                self.animationFrameIndex++;
                if (self.animationFrameIndex > len - 1) {
                    playTimes++;
                    self.animationFrameIndex = 0;
                    if (self.tickAnimationEnd) {
                        self.tickAnimationEnd();
                    }
                    if (times && playTimes == times) {
                        if (self.animationEnd) self.animationEnd();
                        self.paused = true;
                        clearInterval(self.loop);
                        self.parent.remove(self);
                    }
                }
                self.rect = opt.frames[frames[self.animationFrameIndex]];
                if (self.rect.length > 4) self.img = self.bitmaps[self.rect[4]].img;
            }
        }, this.interval);
    },
    "gotoAndStop": function(animation) {
        this.reset();
        clearInterval(this.loop);
        var self = this;
        self.currentAnimation = animation;
        var opt = self.option;
        var frames = opt.animations[self.currentAnimation].frames,
            len = frames.length;
        self.rect = opt.frames[frames[self.animationFrameIndex]];
        if (self.rect.length > 4) self.img = self.bitmaps[self.rect[4]].img;
    }
});

//end-------------------ARE.Sprite---------------------end
