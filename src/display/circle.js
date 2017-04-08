import DisplayObject from './display_object.js'

class Circle extends DisplayObject{
    constructor(r){
        super()

        this.r = r
        // this.element.setAttribute('d', d)
        this._dp =  Math.PI * 2
    }

    draw(ctx) {

        ctx.beginPath()
        ctx.arc(0,0, this.r, 0, this._dp, false)

        ctx.stroke()

        ctx.beginPath()
        ctx.fillStyle = 'white'
        ctx.arc(0,0, this.r-1, 0, this._dp, false)

        ctx.fill()
    }


}

export default Circle