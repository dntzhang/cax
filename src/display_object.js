import Matrix2D from './matrix2d.js'
import EventDispatcher from './event_dispatcher.js'
import UID from './uid.js'

class DisplayObject extends EventDispatcher{
    constructor(){
        super()
        this.alpha = this.scaleX = this.scaleY = 1
        this.x = this.y = this.rotation = this.skewX = this.skewY = this.originX = this.originY = 0
        this.cursor = "default"
        this._matrix = new Matrix2D()
        this._hitMatrix = new Matrix2D()
        this.id = UID.get()
    }

    _computeMatrix(){
        this._matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.originX, this.originY)
    }
}

export default DisplayObject;