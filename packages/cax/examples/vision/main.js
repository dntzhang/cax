import cax from '../../src/index.js'
import Bitmap from '../../src/render/display/bitmap.js';


const stage = new cax.Stage(300, 400, '#canvasCtn')


class Player extends cax.Group {
    constructor() {
        super()

        this.sprite = new cax.Sprite({

            framerate: 5,
            imgs: ['./hero-m.png'],
            frames: [
                // x, y, width, height, originX, originY ,imageIndex              
                [64, 64, 64, 64],
                [128, 64, 64, 64],
                [192, 64, 64, 64],
                [256, 64, 64, 64],
                [320, 64, 64, 64],
                [384, 64, 64, 64],
                [448, 64, 64, 64],

                [0, 192, 64, 64],
                [64, 192, 64, 64],
                [128, 192, 64, 64],
                [192, 192, 64, 64],
                [256, 192, 64, 64],
                [320, 192, 64, 64],
                [384, 192, 64, 64],
                [448, 192, 64, 64],
                [448, 192, 64, 64]
            ],
            animations: {
                walk: {
                    frames: [0, 1, 2, 3, 4, 5, 6],
                    next: "run",
                    speed: 2,
                    loop: false
                },
                happy: {
                    frames: [11, 12, 13, 14]
                },
                win: {
                    frames: [7, 8, 9, 10]
                }
            },
            currentAnimation: "walk"
        })


        this.visionGroup = new cax.Group()
        this.visionGroup.fixed = true 
        this.add(this.visionGroup, this.sprite)

        this.preTime = Date.now()
    }

    update() {
        if(!this.sprite.visible){
            this.sprite.updateFrame()
        }
        this.x--
        if (Date.now() - this.preTime > 100) {
            this.addVision()
            this.preTime = Date.now()
        }
        if (this.x < -100) {
            this.x = 310
        }


    }

    addVision() {
        if(this.sprite.rect){
            const vision = new Bitmap('./hero-m.png')
            vision.rect = this.sprite.rect.slice(0)
            vision.alpha = 0.4
            vision.x = this.x + 5
            vision.y = this.y
            this.visionGroup.add(vision)

            cax.To.get(vision).to({ alpha: 0 }, 1000).end((obj) => {
                obj.destroy()
            }).start()
        }
    }

}

const player = new Player()
stage.add(player)

player.x = 200
player.y = 200

cax.setInterval(() => {
    player.update()
    stage.update()
}, 16)


let tag = false

document.querySelector('#toggleBtn').addEventListener('click', () => { 
    player.sprite.visible = tag
    tag =!tag
    stage.update()
})