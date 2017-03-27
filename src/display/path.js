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
        //https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths
        //M = moveto
        //L = lineto
        //H = horizontal lineto
        //V = vertical lineto
        //C = curveto
        //S = smooth curveto
        //Q = quadratic Belzier curve
        //T = smooth quadratic Belzier curveto
        //A = elliptical Arc  暂时未实现，用贝塞尔拟合椭圆
        //Z = closepath
        //以上所有命令均允许小写字母。大写表示绝对定位，小写表示相对定位。
        for (let j = 0, cmdLen = cmds.length; j < cmdLen; j++) {
            let item = cmds[j]
            let action = item[0].toUpperCase()
            let pre =  cmds[j-1]
            switch (action){
                case 'M':
                    ctx.moveTo( item[1], item[2])
                    break
                case 'C':
                    ctx.bezierCurveTo( item[1], item[2], item[3], item[4], item[5], item[6])
                    break
                case 'L':
                    ctx.lineTo( item[1], item[2])
                    break
                case 'H':
                    ctx.lineTo( pre[1], item[2])
                    break
                case 'V':
                    ctx.lineTo( item[1], pre[2])
                    break
                case 'S':
                    ctx.bezierCurveTo( pre[5]+ pre[5] - pre[3] , pre[6]+ pre[6] - pre[4], item[1], item[2], item[3], item[4])
                    break
                case 'Q':
                    ctx.quadraticCurveTo( item[1], item[2],item[3], item[4])
                    break
                case 'T':
                    ctx.quadraticCurveTo(  pre[3]+ pre[3] - pre[1], pre[4]+ pre[4] - pre[2],item[1], item[2])
                    break
                case 'Z':
                    ctx.closePath()
                    break
            }
        }

        ctx.fill();
        ctx.stroke();

        ctx.restore()
    }



}

export default Path