import Matrix2D from '../base/matrix2d.js'
import EventDispatcher from '../base/event_dispatcher.js'
import UID from '../base/uid.js'

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

}

export default DisplayObject;