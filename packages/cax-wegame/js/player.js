import cax from './libs/cax'
import Bullet from './bullet'
import Music from './music'

const info = wx.getSystemInfoSync()
const screenWidth = info.windowWidth
const screenHeight = info.windowHeight

// 玩家相关常量设置
const PLAYER_IMG_SRC = 'images/hero.png'
const IMG_WIDTH = 186
const IMG_HEIGHT = 130

export default class Player extends cax.Group {
  constructor (ctx) {
    super()
    this.music = new Music()
    this.bitmap = new cax.Bitmap(PLAYER_IMG_SRC)
    this.bitmap.originX = IMG_WIDTH / 2
    this.bitmap.originY = IMG_HEIGHT / 2

    this.add(this.bitmap)
    this.x = screenWidth / 2
    this.y = screenHeight - 80

    this.scaleX = this.scaleY = 0.5

    this.preShootTime = Date.now()
    this.bulletGroup = new cax.Group()
  }

  update () {
    this.currentTime = Date.now()
    if (this.currentTime - this.preShootTime > 200) {
      this.shoot()
      this.preShootTime = this.currentTime
    }

    this.bulletGroup.children.forEach(bullet => {
      bullet.update()
    })
  }

  shoot () {
    let bullet = new Bullet()
    bullet.x = this.x
    bullet.y = this.y - 30
    this.music.playShoot()
    this.bulletGroup.add(bullet)
  }

  isCollideWith (sp) {
    let spX = sp.x + sp.width / 2
    let spY = sp.y + sp.height / 2

    return !!(spX >= this.x &&
            spX <= this.x + this.width &&
            spY >= this.y &&
            spY <= this.y + this.height)
  }
}
