import DisplayObject from './display_object.js'

class Path extends DisplayObject{
    constructor(d){
        super()
        this.d = d
        this.style = null
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        this.element.setAttribute('d', d)

        //this.element.style.visibility = 'hidden'

    }

}

export default Path