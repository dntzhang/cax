import Graphics from '../graphics.js'

class Rect extends Graphics {
  constructor (width, height, option) {
    super()

    this.width = width
    this.height = height
    this.option = option || {}
  }

  render (ctx) {
    this.clear()

    if (this.option.fillStyle) {
      this.fillStyle(this.option.fillStyle)
      this.fillRect(0, 0, this.width, this.height)
    }

    if (this.option.strokeStyle) {
      this.strokeStyle(this.option.strokeStyle)
      this.strokeRect(0, 0, this.width, this.height)
    }
    super.render(ctx)
  }
}

export default Rect
