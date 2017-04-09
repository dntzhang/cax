import Matrix2D from '../base/matrix2d.js'
import EventDispatcher from '../base/event_dispatcher.js'
import UID from '../base/uid.js'

class DisplayObject extends EventDispatcher{
    constructor(){
        super()
        this.alpha = this.complexAlpha = this.scaleX = this.scaleY = 1
        this.x = this.y = this.rotation = this.skewX = this.skewY = this.originX = this.originY = 0
        this.cursor = "default"
        this.visible = true
        this._matrix = new Matrix2D()
        this._hitMatrix = new Matrix2D()
        this.id = UID.get()
    }

    isVisible () {
        return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0
    }
}

export default DisplayObject;