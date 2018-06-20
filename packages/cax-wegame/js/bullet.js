import cax from './libs/cax'

const BULLET_IMG_SRC = 'images/bullet.png'
const IMG_WIDTH = 62
const IMG_HEIGHT = 108

export default class Bullet extends cax.Group {
  constructor () {
    super()
    this.bitmap = new cax.Bitmap(BULLET_IMG_SRC)
    this.bitmap.originX = IMG_WIDTH / 2
    this.bitmap.originY = IMG_HEIGHT / 2
    this.add(this.bitmap)
    this.scaleX = this.scaleY = 0.3
    this.speed = 5

    this.width = IMG_WIDTH / 2
    this.height = IMG_WIDTH / 2
  }

  // 每一帧更新子弹位置
  update () {
    this.y -= this.speed
    // 超出屏幕外回收自身
    if (this.y < -200) {
      this.destroy()
    }
  }

  isCollideWith (sp) {
    if (this.visible && sp.visible) {
      let spX = sp.x
      let spY = sp.y

      return !!(spX >= this.x - this.width / 2 &&
            spX <= this.x + this.width / 2 &&
            spY >= this.y - this.height / 2 &&
            spY <= this.y + this.height / 2)
    }
  }
}
