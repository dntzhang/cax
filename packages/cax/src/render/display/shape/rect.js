import Shape from './shape'

class Rect extends Shape {
  constructor(width, height, option) {
    super()

    this.width = width
    this.height = height
    this.option = option || {}
  }

  draw() {
    if (this.option.fillStyle) {
      this.fillStyle(this.option.fillStyle)
      this.fillRect(0, 0, this.width, this.height)
    }

    if (this.option.strokeStyle) {
      this.strokeStyle(this.option.strokeStyle)
      if (typeof this.option.lineWidth === 'number') {
        this.lineWidth(this.option.lineWidth)
      }
      this.strokeRect(0, 0, this.width, this.height)
    }
  }

  clone() {
    return new Rect(this.width, this.height, {
      fillStyle: this.option.fillStyle,
      strokeStyle: this.option.strokeStyle,
      lineWidth: this.option.lineWidth
    })
  }
}

export default Rect
