import DisplayObject from './display-object'
import util from '../../common/util'

const measureCtx = (util.isWeapp || util.isWegame) ? null : document.createElement('canvas').getContext('2d')

class Text extends DisplayObject {
  constructor (text, option) {
    super()

    this.text = text
    option = option || {}
    this.font = option.font
    this.color = option.color

    this.baseline = option.baseline || 'top'
  }

  getWidth () {
    measureCtx.font = this.font
    return measureCtx.measureText(this.text).width
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
    this.cacheCtx.fillStyle = this.color
    this.cacheCtx.font = this.font
    this.cacheCtx.textBaseline = this.baseline

    if (debug) {
      this.cacheCtx.save()
      this.cacheCtx.fillStyle = 'red'
      this.cacheCtx.fillRect(0, 0, width, height)
      this.cacheCtx.restore()
    }

    this.cacheCtx.fillText(this.text, 0, 0)
  }

  uncache () {
    this.cacheCanvas = null
  }
}

export default Text
