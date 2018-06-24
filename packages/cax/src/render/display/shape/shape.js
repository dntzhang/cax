import Graphics from '../graphics'

class Shape extends Graphics {
  // constructor() {
  //     super()
  // }

  draw () {

  }

  render (ctx) {
    this.clear()
    this.draw()
    super.render(ctx)
  }

  cache (x, y, width, height, debug) {
    x = x || 0
    y = y || 0
    width = width || this.width
    height = height || this.height
    if (typeof wx !== 'undefined' && wx.createCanvas) {
      this.cacheCanvas = wx.createCanvas()
    } else {
      this.cacheCanvas = document.createElement('canvas')
    }
    this.cacheCanvas.width = width
    this.cacheCanvas.height = height
    this.cacheCtx = this.cacheCanvas.getContext('2d')
    this.cacheCtx.setTransform(1, 0, 0, 1, x, y)

    if (debug) {
      this.cacheCtx.save()
      this.cacheCtx.fillStyle = 'red'
      this.cacheCtx.fillRect(0, 0, width, height)
      this.cacheCtx.restore()
    }

    this.render(this.cacheCtx)
  }

  uncache () {
    this.cacheCanvas = null
  }
}

export default Shape
