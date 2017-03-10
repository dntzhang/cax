import Path from '../path.js'

class SVGPath extends Path{
    constructor(d , option){
        super(d , option)
        // this.element.setAttribute('d', d)
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    }

    _toStyleString (){
        return 'fill:'+this.fill+';stroke:'+this.stroke+';stroke-width:'+this.strokeWidth;
    }

    addEventListener(type, listener, useCapture){
        this.element.addEventListener(type, listener, useCapture)
    }

    removeEventListener(type, listener, useCapture) {
        this.element.removeEventListener(type, listener, useCapture)
    }

}

export default SVGPath