import cax from './js/libs/cax'

const BULLET_IMG_SRC = 'images/bullet.png'
const BULLET_WIDTH = 16
const BULLET_HEIGHT = 30

const IMG_WIDTH = 62
const IMG_HEIGHT = 108


export default class Bullet extends cax.Group {
    constructor() {
        super()
        this.bitmap = new cax.Bitmap(BULLET_IMG_SRC)
        this.bitmap.originX = IMG_WIDTH / 2
        this.bitmap.originY = IMG_HEIGHT / 2
        this.add(this.bitmap)
        this.scaleX = this.scaleY = 0.5
        this.speed = 5
    }



    // 每一帧更新子弹位置
    update() {
        this.y -= this.speed

        // 超出屏幕外回收自身
        if (this.y < -this.height) {
            this.destroy()
        }

    }
}
