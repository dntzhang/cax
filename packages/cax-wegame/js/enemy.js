import cax from './libs/cax'

const ENEMY_IMG_SRC = 'images/enemy.png'

const IMG_WIDTH = 120
const IMG_HEIGHT = 79

const info = wx.getSystemInfoSync()
const screenHeight = info.windowHeight

export default class Enemy extends cax.Group {
  constructor () {
    super()
    this.bitmap = new cax.Bitmap(ENEMY_IMG_SRC)
    this.bitmap.originX = IMG_WIDTH / 2
    this.bitmap.originY = IMG_HEIGHT / 2
    this.add(this.bitmap)

    this.scaleX = this.scaleY = 0.5
    this.speed = 1

    this.width = IMG_WIDTH / 2
    this.height = IMG_WIDTH / 2

    this.spriteOption = {
      framerate: 20,
      imgs: [
        'images/explosion1.png',
        'images/explosion2.png',
        'images/explosion3.png',
        'images/explosion4.png',
        'images/explosion5.png',
        'images/explosion6.png',
        'images/explosion7.png',
        'images/explosion8.png',
        'images/explosion9.png',
        'images/explosion10.png',
        'images/explosion11.png',
        'images/explosion12.png',
        'images/explosion13.png',
        'images/explosion14.png',
        'images/explosion15.png',
        'images/explosion16.png',
        'images/explosion17.png',
        'images/explosion18.png',
        'images/explosion19.png'
      ],
      frames: [
        // x, y, width, height, originX, originY ,imageIndex
        [0, 0, 64, 48, 0, 0, 0],
        [0, 0, 64, 48, 0, 0, 1],
        [0, 0, 64, 48, 0, 0, 2],
        [0, 0, 64, 48, 0, 0, 3],
        [0, 0, 64, 48, 0, 0, 4],
        [0, 0, 64, 48, 0, 0, 5],
        [0, 0, 64, 48, 0, 0, 6],
        [0, 0, 64, 48, 0, 0, 7],
        [0, 0, 64, 48, 0, 0, 8],
        [0, 0, 64, 48, 0, 0, 9],
        [0, 0, 64, 48, 0, 0, 10],
        [0, 0, 64, 48, 0, 0, 11],
        [0, 0, 64, 48, 0, 0, 12],
        [0, 0, 64, 48, 0, 0, 13],
        [0, 0, 64, 48, 0, 0, 14],
        [0, 0, 64, 48, 0, 0, 15],
        [0, 0, 64, 48, 0, 0, 16],
        [0, 0, 64, 48, 0, 0, 17],
        [0, 0, 64, 48, 0, 0, 18]
      ],
      animations: {
        explode: {
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
        }
      },
      currentAnimation: 'explode',
      animationEnd: () => {
        this.destroy()
      }
    }
  }

  explode () {
    this.bitmap.visible = false
    this.exploded = true
    const es = new cax.Sprite(this.spriteOption)
    es.fixed = true
    es.x = this.x - 32
    es.y = this.y - 24
    this.es = es
    this.add(es)
  }

  update () {
    if(this.es){
      this.es.y += this.speed * 2
    }
    this.y += this.speed
    if (this.y > screenHeight) {
      this.destroy()
    }
  }
}
