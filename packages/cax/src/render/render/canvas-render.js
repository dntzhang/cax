import Graphics from '../display/graphics.js'
import Render from './render.js'
import Sprite from '../display/sprite.js'
import Bitmap from '../display/bitmap.js'
import Text from '../display/text.js'

class CanvasRender extends Render {
  constructor (canvasOrContext, width, height) {
    super()
    if (arguments.length === 3) {
      this.ctx = canvasOrContext
      this.width = width
      this.height = height
    } else {
      this.ctx = canvasOrContext.getContext('2d')
      this.width = canvasOrContext.width
      this.height = canvasOrContext.height
    }
  }

  render (obj) {
    const ctx = this.ctx
    ctx.save()
    ctx.globalCompositeOperation = obj.complexCompositeOperation
    ctx.globalAlpha = obj.complexAlpha
    ctx.setTransform(obj._matrix.a, obj._matrix.b, obj._matrix.c, obj._matrix.d, obj._matrix.tx, obj._matrix.ty)
    if (obj instanceof Graphics) {
      obj.render(ctx)
    } else if (obj instanceof Sprite && obj.rect) {
      obj.updateFrame()
      const rect = obj.rect
      ctx.drawImage(obj.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3])
    } else if (obj instanceof Bitmap && obj.rect) {
      const bRect = obj.rect
      ctx.drawImage(obj.img, bRect[0], bRect[1], bRect[2], bRect[3], 0, 0, bRect[2], bRect[3])
    } else if (obj instanceof Text) {
      ctx.font = obj.font
      ctx.fillStyle = obj.color
      ctx.textBaseline = obj.baseline
      ctx.fillText(obj.text, 0, 0)
    }
    ctx.restore()
  }

  clear () {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  hitAABB () {

  }

  hitPixel () {

  }
}

export default CanvasRender
