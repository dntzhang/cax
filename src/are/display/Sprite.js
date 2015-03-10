/**
 * 精灵，继承自DisplayObject，具体的使用例子如下：
 *
 *             var sprite = new Sprite({
 *                x: 200,
 *                y: 200,
 *                framerate: 5,
 *                imgs: [ld.get("hero"), ld.get("pig")],
 *                frames: [
 *                        // x, y, width, height, imageIndex, originX, originY               
 *                        [64, 64, 64, 64],
 *                        [128, 64, 64, 64],
 *                        [192, 64, 64, 64],
 *                        [256, 64, 64, 64],
 *                        [320, 64, 64, 64],
 *                        [384, 64, 64, 64],
 *                        [448, 64, 64, 64],
 *						   [0, 192, 64, 64],
 *						   [64, 192, 64, 64],
 *                        [128, 192, 64, 64],
 *                        [192, 192, 64, 64],
 *                        [256, 192, 64, 64],
 *                        [320, 192, 64, 64],
 *                        [384, 192, 64, 64],
 *                        [448, 192, 64, 64],
 *						   [448, 192, 64, 64]
 *                ],
 *                animations: {
 *                    walk: {
 *                        frames: [0, 1, 2, 3, 4, 5, 6],
 *                        next: "run",
 *                        speed: 2,
 *                        loop: false
 *                    },
 *                    happy: {
 *                        frames: [11, 12, 13, 14]
 *                    },
 *                    win: {
 *                        frames: [7, 8, 9, 10]
 *                    }
 *                },
 *                currentAnimation: "walk",
 *                tickAnimationEnd: function () {
 *                    console.log("播完一轮");
 *                },
 *                animationEnd: function () {
 *                    alert("播放完成")
 *                }
 *            });
 *            stage.add(sprite);
 *
 * @class Sprite
 * @constructor
 * @param {option} option
 */
define("ARE.Sprite:ARE.DisplayObject", {
    ctor: function (option) {
        this._super();

        this.option = option;
        this.x = option.x || 0;
        this.y = option.y || 0;
        //当前frame处于整个frames的index;
        this.currentFrameIndex = 0;
        //当前frame处于该动画frames的index;
        this.animationFrameIndex = 0;
        //当前处于的动画
        this.currentAnimation = option.currentAnimation||null;
        //当前帧所处的矩形区域
        this.rect = [0, 0, 10, 10];
        //当前播放的图片
        this.img = this.option.imgs[0];
      
        //播放的时间间隔
        this.interval = 1000 / option.framerate;
        //播放的函数循环
        this.loop = null

        this.paused = false;

        this.animationEnd =option.animationEnd||null;

        if (this.currentAnimation) {
            this.gotoAndPlay(this.currentAnimation);
        }

        this.tickAnimationEnd = option.tickAnimationEnd || null;
    },
    /**
     * 继续播放（一般在暂停的时候可以调用该函数可继续）
     * @method play
     */
    play: function () {
        this.paused = false;
    },
    /**
     * 暂停播放（一般在播放的时候可以调用该函数可暂停）
     * @method stop
     */
    stop: function () {
        this.paused = true;
    },
    reset: function () {
        //当前frame处于整个frames的index;
        this.currentFrameIndex = 0;
        //当前frame处于该动画frames的index;
        this.animationFrameIndex = 0;
    },
    /**
     * 跳到某个动画并播放一定次数
     * @method gotoAndPlay
     * @param {string} animation 播放的动画名称
     * @param {num} times 播放的次数，该参数可选，不传的时候代表循环播放
     */
    gotoAndPlay: function (animation, times) {
        this.paused = false;
        this.reset();
        RAF.clearRequestInterval(this.loop);
        this.currentAnimation = animation;
      
        var self = this;
        var playTimes = 0;
        this.loop = RAF.requestInterval(function () {
      
            if (!self.paused) {
                var opt = self.option;
           
                var frames = opt.animations[self.currentAnimation].frames, len = frames.length;
  
                self.animationFrameIndex++;
                if (self.animationFrameIndex > len - 1) {
                    playTimes++;
                    self.animationFrameIndex = 0;
                    if (self.tickAnimationEnd) { self.tickAnimationEnd(); }
                    if (times && playTimes == times) {
                        if (self.animationEnd) self.animationEnd();
                        self.paused = true;
                        RAF.clearRequestInterval(self.loop);
                        self.parent.remove(self);
                    }
                }

                self.rect = opt.frames[frames[self.animationFrameIndex]];
                if (self.rect.length > 4) self.img = opt.imgs[self.rect[4]];
            }
        }, this.interval);

    },
    /**
     * 跳到某个动画的第一帧并停止
     * @method gotoAndStop
     * @param {string} animation 播放的动画名称
     */
    gotoAndStop: function (animation) {
        this.reset();
        RAF.clearRequestInterval(this.loop);
        var self = this;
        self.currentAnimation = animation;
        var opt = self.option;
        var frames = opt.animations[self.currentAnimation].frames, len = frames.length;
        self.rect = opt.frames[frames[self.animationFrameIndex]];
        if (self.rect.length > 4) self.img = opt.imgs[self.rect[4]];
    
    }


})
