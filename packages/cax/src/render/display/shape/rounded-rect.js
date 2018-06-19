import Shape from './shape'

class RoundedRect extends Shape {
  constructor (width, height, r, option) {
    super()
    this.option = option || {}
    this.r = r
    this.width = width
    this.height = height
  }

  draw () {
    const width = this.width,
      height = this.height,
      r = this.r

    const ax = r,
      ay = 0,
      bx = width,
      by = 0,
      cx = width,
      cy = height,
      dx = 0,
      dy = height,
      ex = 0,
      ey = 0

    this.beginPath()

    this.moveTo(ax, ay)
    this.arcTo(bx, by, cx, cy, r)
    this.arcTo(cx, cy, dx, dy, r)
    this.arcTo(dx, dy, ex, ey, r)
    this.arcTo(ex, ey, ax, ay, r)

    this.stroke()

    this.closePath()
    this.fillStyle('white')
    this.fill()
  }
}

export default RoundedRect
