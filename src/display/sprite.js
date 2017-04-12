import DisplayObject from './display_object.js'

class Sprite extends DisplayObject {
    constructor(option) {
        super();
        this.option = option;
        this.x = option.x || 0;
        this.y = option.y || 0;
        this.currentFrameIndex = 0;
        this.animationFrameIndex = 0;
        this.currentAnimation = option.currentAnimation || null;
        this.rect = [0, 0, 10, 10];



        this.img = this.option.imgs[0];
        this.interval = 1e3 / option.framerate;
        this.loop = null;
        this.paused = false;
        this.animationEnd = option.animationEnd || null;
        if (this.currentAnimation) {
            this.gotoAndPlay(this.currentAnimation);
        }
        this.tickAnimationEnd = option.tickAnimationEnd || null;
    }

    play() {
        this.paused = false;
    }

    pause() {
        this.paused = true;
    }

    reset() {
        this.currentFrameIndex = 0;
        this.animationFrameIndex = 0;
    }


    updateFrame (){
        let opt = this.option;
        this.dt = new Date() - this.startTime
        let frames = opt.animations[this.currentAnimation].frames
        const len = frames.length
        this.rect = opt.frames[frames[ Math.floor(this.dt/this.interval%len)]]
        const rectLen = this.rect.length

        rectLen > 4 && (this.originX = this.rect[2] * this.rect[4]);
        rectLen > 5 && (this.originY = this.rect[3] * this.rect[5]);
        rectLen > 6 && (this.img = this.bitmaps[this.rect[6]].img);

    }

    gotoAndPlay(animation) {
        this.paused = false;
        this.reset();
        clearInterval(this.loop);
        this.currentAnimation = animation;
        this.startTime = new Date()
    }

    gotoAndStop(animation) {
        this.reset();
        clearInterval(this.loop);
        var self = this;
        self.currentAnimation = animation;
        var opt = self.option;
        var frames = opt.animations[self.currentAnimation].frames;
        self.rect = opt.frames[frames[self.animationFrameIndex]];
        self.width = self.rect[2];
        self.height = self.rect[3];
        var rect = self.rect,
            rectLen = rect.length;
        rectLen > 4 && (self.originX = rect[2] * rect[4]);
        rectLen > 5 && (self.originY = rect[3] * rect[5]);
        rectLen > 6 && (self.img = self.bitmaps[rect[6]].img);
    }
}

export default Sprite


//var sprite = new Sprite({
//    x: 200,
//    y: 200,
//    framerate: 5,
//    imgs: [ld.get("hero"), ld.get("pig")],
//    frames: [
//        // x, y, width, height, originX, originY ,imageIndex
//        [64, 64, 64, 64],
//        [128, 64, 64, 64],
//        [192, 64, 64, 64],
//        [256, 64, 64, 64],
//        [320, 64, 64, 64],
//        [384, 64, 64, 64],
//        [448, 64, 64, 64],
//
//        [0, 192, 64, 64],
//        [64, 192, 64, 64],
//        [128, 192, 64, 64],
//        [192, 192, 64, 64],
//        [256, 192, 64, 64],
//        [320, 192, 64, 64],
//        [384, 192, 64, 64],
//        [448, 192, 64, 64],
//        [448, 192, 64, 64]
//    ],
//    animations: {
//        walk: {
//            frames: [0, 1, 2, 3, 4, 5, 6],
//            next: "run",
//            speed: 2,
//            loop: false
//        },
//        happy: {
//            frames: [11, 12, 13, 14]
//        },
//        win: {
//            frames: [7, 8, 9, 10]
//        }
//    },
//    currentAnimation: "walk",
//    tickAnimationEnd: function () {
//        //alert("播完一轮");
//    },
//    animationEnd: function () {
//        //alert("播放完成")
//    }
//});