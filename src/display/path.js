import SVGObject from './svg_object.js'

class Path extends SVGObject{
    constructor(d){
        super('path')
        this.d = d

        this.element.setAttribute('d', d)
    }

}

export default Path