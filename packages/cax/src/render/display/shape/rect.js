import Graphics from '../graphics.js'

class Rect extends Graphics {
  constructor (width, height, option) {
    super()

    this.width = width
    this.height = height
    option = option || {}
    this.empty = option.empty
    this.color = option.color
    this.border = option.border
  }

  render (ctx) {
    this.clear()
    if (!this.empty) {
      this.fillStyle(this.color)
      this.fillRect(0, 0, this.width, this.height)
    } else {
      this.strokeStyle(this.color)
      this.strokeRect(0, 0, this.width, this.height)
    }
    super.render(ctx)
  }
}

export default Rect
