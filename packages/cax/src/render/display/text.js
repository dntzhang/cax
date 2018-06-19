import DisplayObject from './display-object'
import util from '../../common/util'

const measureCtx = util.isWx ? null : document.createElement('canvas').getContext('2d')

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
}

export default Text
