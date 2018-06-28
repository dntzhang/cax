import DisplayObject from './display-object.js'
import util from '../../common/util'

class Bitmap extends DisplayObject {
  constructor (img, onLoad) {
    super()
    if (typeof img === 'string') {
      if (Bitmap.cache[img]) {
        if(util.isWeapp){
          this.img = Bitmap.cache[img].img
          this.rect = [0, 0, Bitmap.cache[img].width, Bitmap.cache[img].height]
        }else{
          this.img = Bitmap.cache[img]
          this.rect = [0, 0, this.img.width, this.img.height]
        }
        onLoad && onLoad.call(this)
        this.width = this.img.width
        this.height = this.img.height
      } else if (util.isWeapp) {
        util.getImageInWx(img, (result) => {
          this.img = result.img
          if (!this.rect) {
            this.rect = [0, 0, result.width, result.height]
          }
          onLoad && onLoad.call(this)
          Bitmap.cache[img] = result
        })
      } else {
        this.img = util.isWegame ? wx.createImage() : new window.Image()
        this.visible = false
        this.img.onload = () => {
          this.visible = true
          if (!this.rect) {
            this.rect = [0, 0, this.img.width, this.img.height]
          }
          this.width = this.img.width
          this.height = this.img.height
          onLoad && onLoad.call(this)
          Bitmap.cache[img] = this.img
        }
        this.img.src = img
      }
    } else {
      this.img = img
      this.rect = [0, 0, img.width, img.height]
      this.width = img.width
      this.height = img.height
      Bitmap.cache[img.src] = img
    }
  }

  clone () {
    let bitmap = new Bitmap(this.img)
    bitmap.x = this.x
    bitmap.y = this.y

    bitmap.scaleX = this.scaleX
    bitmap.scaleY = this.scaleY
    bitmap.rotation = this.rotation
    bitmap.skewX = this.skewX
    bitmap.skewY = this.skewY
    bitmap.originX = this.originX
    bitmap.originY = this.originY
    bitmap.width = this.width
    bitmap.height = this.height

    return bitmap
  }
}

Bitmap.cache = {

}

export default Bitmap
