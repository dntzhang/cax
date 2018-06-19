import Group from '../display/group.js'
import Graphics from '../display/graphics.js'
import Render from './render.js'
import Event from '../base/event.js'
import Sprite from '../display/sprite.js'
import Bitmap from '../display/bitmap.js'
import Text from '../display/text.js'

class HitRender extends Render {
  constructor () {
    super()

    this.canvas = document.createElement('canvas')
    this.canvas.width = 1
    this.canvas.height = 1
    this.ctx = this.canvas.getContext('2d')

    // debug event
    // this.canvas.width = 441
    // this.canvas.height = 441
    // document.body.appendChild(this.canvas)

    this.disableEvents = ['mouseover', 'mouseout', 'mousemove', 'touchmove']
  }

  clear () {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  hitAABB (o, evt, cb) {
    var list = o.children.slice(0),
      l = list.length
    for (var i = l - 1; i >= 0; i--) {
      var child = list[i]
      // if (!this.isbindingEvent(child)) continue;
      var target = this._hitAABB(child, evt, cb)
      if (target) return target
    }
  }

  _hitAABB (o, evt, cb) {
    if (!o.isVisible()) {
      return
    }
    if (o instanceof Group) {
      var list = o.children.slice(0),
        l = list.length
      for (var i = l - 1; i >= 0; i--) {
        var child = list[i]
        var target = this._hitAABB(child, evt)
        if (target) return target
      }
    } else {
      if (o.AABB && this.checkPointInAABB(evt.stageX, evt.stageY, o.AABB)) {
        // this._bubbleEvent(o, type, evt);
        this._dispatchEvent(o, evt)
        return o
      }
    }
  }

  checkPointInAABB (x, y, AABB) {
    var minX = AABB[0]
    if (x < minX) return false
    var minY = AABB[1]
    if (y < minY) return false
    var maxX = minX + AABB[2]
    if (x > maxX) return false
    var maxY = minY + AABB[3]
    if (y > maxY) return false
    return true
  }

  hitPixel (o, evt, cb) {
    let ctx = this.ctx
    let mtx = o._hitMatrix
    let list = o.children.slice(0),
      l = list.length
    for (let i = l - 1; i >= 0; i--) {
      let child = list[i]
      mtx.initialize(1, 0, 0, 1, 0, 0)
      mtx.appendTransform(o.x - evt.stageX, o.y - evt.stageY, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.originX, o.originY)
      if (!this.checkBoundEvent(child)) continue
      ctx.save()
      var target = this._hitPixel(child, evt, mtx, cb)
      ctx.restore()
      if (target) return target
    }
  }

  checkBoundEvent () {
    return true
  }

  _hitPixel (o, evt, mtx, cb) {
    if (!o.isVisible()) return
    let ctx = this.ctx
    ctx.clearRect(0, 0, 2, 2)
    if (mtx) {
      o._hitMatrix.initialize(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty)
    } else {
      o._hitMatrix.initialize(1, 0, 0, 1, 0, 0)
    }
    mtx = o._hitMatrix
    mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.originX, o.originY)
    if (o instanceof Graphics) {
      ctx.globalCompositeOperation = o.complexCompositeOperation
      ctx.globalAlpha = o.complexAlpha
      ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty)
      o.render(ctx)
    } else if (o instanceof Group) {
      var list = o.children.slice(0),
        l = list.length
      for (var i = l - 1; i >= 0; i--) {
        ctx.save()
        var target = this._hitPixel(list[i], evt, mtx, cb)
        if (target) return target
        ctx.restore()
      }
    } else if (o instanceof Sprite && o.rect) {
      ctx.globalCompositeOperation = o.complexCompositeOperation
      ctx.globalAlpha = o.complexAlpha
      ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty)
      o.updateFrame()
      var rect = o.rect
      ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3])
    } else if (o instanceof Bitmap && o.rect) {
      ctx.globalCompositeOperation = o.complexCompositeOperation
      ctx.globalAlpha = o.complexAlpha
      ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty)
      var bRect = o.rect
      ctx.drawImage(o.img, bRect[0], bRect[1], bRect[2], bRect[3], 0, 0, bRect[2], bRect[3])
    } else if (o instanceof Text) {
      ctx.globalCompositeOperation = o.complexCompositeOperation
      ctx.globalAlpha = o.complexAlpha
      ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty)
      ctx.font = o.font
      ctx.fillStyle = o.color
      ctx.textBaseline = o.baseline
      ctx.fillText(o.text, 0, 0)
    }

    if (ctx.getImageData(0, 0, 1, 1).data[3] > 1) {
      this._dispatchEvent(o, evt)
      return o
    }
  }

  _dispatchEvent (obj, evt) {
    if (this.disableEvents.indexOf(evt.type) !== -1) return
    let mockEvt = new Event()
    mockEvt.stageX = evt.stageX
    mockEvt.stageY = evt.stageY
    mockEvt.pureEvent = evt
    mockEvt.type = evt.type
    obj.dispatchEvent(mockEvt)
  }
}

export default HitRender
