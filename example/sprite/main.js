import { Stage, Sprite } from '../../src/index.js'

var stage = new Stage(480,480,"body")

var img = new Image()

img.onload = ()=> {

    var sprite = new Sprite({
        framerate: 7,
        imgs: [img],
        frames: [
            // x, y, width, height, originX, originY ,imageIndex
            [0, 0, 32, 32],
            [32 * 1, 0, 32, 32],
            [32 * 2, 0, 32, 32],
            [32 * 3, 0, 32, 32],
            [32 * 4, 0, 32, 32],
            [32 * 5, 0, 32, 32],
            [32 * 6, 0, 32, 32],
            [32 * 7, 0, 32, 32],
            [32 * 8, 0, 32, 32],
            [32 * 9, 0, 32, 32],
            [32 * 10, 0, 32, 32],
            [32 * 11, 0, 32, 32],
            [32 * 12, 0, 32, 32],
            [32 * 13, 0, 32, 32],
            [32 * 14, 0, 32, 32]
        ],
        animations: {
            walk: {
                frames: [0, 1]
            },
            happy: {
                frames: [11, 12, 13, 14]
            },
            win: {
                frames: [7, 8, 9, 10]
            }
        },
        currentAnimation: "walk",
        tickAnimationEnd: function () {
            //alert("播完一轮");
        },
        animationEnd: function () {
            //alert("播放完成")
        }
    });

    stage.add(sprite)

    sprite.scaleX = sprite.scaleY = 1.5
    sprite.y = 160

    setInterval(()=> {
        stage.update()
        sprite.x += 0.8
    }, 16)
}

img.src = './mariosheet.png'
