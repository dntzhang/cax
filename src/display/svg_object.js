import Matrix2D from '../base/matrix2d.js'
import UID from '../base/uid.js'

class SVGObject {
    constructor(type){
        this.alpha = this.scaleX = this.scaleY = 1
        this.x = this.y = this.rotation = this.skewX = this.skewY = this.originX = this.originY = 0
        this.cursor = "default"
        this._matrix = new Matrix2D()
        this._hitMatrix = new Matrix2D()
        this.id = UID.get()
        this.element = document.createElementNS('http://www.w3.org/2000/svg', type)
        this.style = null
    }

    _computeMatrix(){
        this._matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.originX, this.originY)
    }


}

export default SVGObject;