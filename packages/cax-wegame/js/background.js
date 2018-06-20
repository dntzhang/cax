import cax from './libs/cax'

const info = wx.getSystemInfoSync()
const screenWidth = info.windowWidth
const screenHeight = info.windowHeight

const BG_IMG_SRC = 'images/bg.jpg'
const BG_WIDTH = 512
const BG_HEIGHT = 512


export default class BackGround extends cax.Group {
    constructor() {
        super()

        this.bgUp = new cax.Bitmap(BG_IMG_SRC)
        this.bgDown = new cax.Bitmap(BG_IMG_SRC)

        this.bgDown.y = screenHeight * -1
        this.bgUp.y = -1

        this.bgDown.scaleX = this.bgUp.scaleX = screenWidth / BG_WIDTH
        this.bgDown.scaleY = this.bgUp.scaleY = screenHeight / BG_HEIGHT

        this.add(this.bgUp, this.bgDown)

    }

    update() {
        this.bgDown.y += 2
        this.bgUp.y += 2

        if (this.bgUp.y >= screenHeight) {
            this.bgUp.y = this.bgDown.y - screenHeight
        }

        if (this.bgDown.y >= screenHeight) {
            this.bgDown.y = this.bgUp.y - screenHeight
        }

    }
}