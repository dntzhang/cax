import DisplayObject from './display_object.js'
import parse from '../base/path-parser.js'

class Path extends DisplayObject{
    constructor(d , option){
        super()
        this.type = 'path'
        this.d = d
        this.fill = 'black';
        this.stroke = 'black';
        this.strokeWidth = 1

        option&&Object.keys(option).forEach((key)=>{
            this[key] = option[key]
        })

       // this.element.setAttribute('d', d)
    }

    draw(ctx) {

        const cmds = parse(this.d)
        ctx.save()

        ctx.lineWidth = this.strokeWidth
        ctx.strokeStyle = this.stroke
        ctx.fillStyle = this.fill
        ctx.beginPath()

        for (let j = 0, cmdLen = cmds.length; j < cmdLen; j++) {
            let item = cmds[j]
            let action = item[0].toUpperCase()
            if (action == "M") {
                ctx.moveTo.call(ctx, item[1], item[2])
            } else if (action == "C") {
                ctx.bezierCurveTo.call(ctx, item[1], item[2], item[3], item[4], item[5], item[6])
            } else if (action == "L") {
                ctx.lineTo.call(ctx, item[1], item[2])
            }
        }

        ctx.fill();
        ctx.stroke();

        ctx.restore()
    }



}

export default Path