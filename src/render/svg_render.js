import Group from '../display/group.js'
import Path from '../display/path.js'
import Render from './render.js'

class SVGRender extends  Render {
    constructor(svg){
        super()
        this.svg = svg
    }

    render(obj){
        if(obj instanceof Path){
            this.renderPath(obj)
        }else if (obj instanceof  Group){

        }
    }

    clear(){

    }


    renderPath(obj) {
        //M = moveto
        //L = lineto
        //H = horizontal lineto
        //V = vertical lineto
        //C = curveto
        //S = smooth curveto
        //Q = quadratic Belzier curve
        //T = smooth quadratic Belzier curveto
        //A = elliptical Arc
        //Z = closepath
        //<path d="M250 150 L150 350 L350 350 Z" />
        obj._computeMatrix()
        obj.element.setAttribute('d', obj.d)
        obj.element.style = obj.style
        obj.element.setAttribute( 'transform', 'matrix(' + obj._matrix.a + ',' + obj._matrix.b + ',' + obj._matrix.c + ',' + obj._matrix.d + ',' + obj._matrix.tx + ',' + obj._matrix.ty + ')' )
        if(!document.body.contains(obj.element)){
            this.svg.appendChild(obj.element)
        }
    }
}

export default SVGRender;