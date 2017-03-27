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
        //以上所有命令均允许小写字母。大写表示绝对定位，小写表示相对定位(从上一个点开始)。
        let preX,
            preY

        for (let j = 0, cmdLen = cmds.length; j < cmdLen; j++) {
            let item = cmds[j]
            let action = item[0]
            let preItem = cmds[j-1]

            switch (action){
                case 'M':
                    preX = item[1]
                    preY = item[2]
                    ctx.moveTo( preX, preY)
                    break
                case 'L':
                    preX = item[1]
                    preY = item[2]
                    ctx.lineTo( preX,preY)
                    break
                case 'H':
                    preY =  item[1]
                    ctx.lineTo( preX, item[1])
                    break
                case 'V':
                    preX = item[1]
                    ctx.lineTo( item[1], preY)
                    break
                case 'C':
                    preX = item[5]
                    preY = item[6]
                    ctx.bezierCurveTo( item[1], item[2], item[3], item[4], preX, preY)
                    break
                case 'S':
                    ctx.bezierCurveTo( preX+ preX - preItem[3] ,preY+ preY - preItem[4], item[1], item[2], item[3], item[4])
                    preX = item[3]
                    preY = item[4]
                    break
                case 'Q':
                    preX = item[3]
                    preY = item[4]
                    ctx.quadraticCurveTo( item[1], item[2],preX,preY)
                    break
                case 'T':
                    ctx.quadraticCurveTo( preX+ preX - preItem[1], preY+ preY - preItem[2],item[1], item[2])
                    preX = item[1]
                    preY = item[2]
                    break

                case 'm':
                    preX += item[1]
                    preY += item[2]
                    ctx.moveTo( preX, preY)
                    break
                case 'l':
                    preX += item[1]
                    preY += item[2]
                    ctx.lineTo( item[1], item[2])
                    break
                case 'h':
                    preY += item[1]
                    ctx.lineTo( preX,preY)
                    break
                case 'v':
                    preX += item[1]
                    ctx.lineTo( item[1], preY)
                    break
                case 'c':
                    ctx.bezierCurveTo(preX+ item[1], preY + item[2],preX + item[3],preY + item[4], preX+ item[5], preY +  item[6])
                    preX =  preX + item[5]
                    preY =  preY + item[6]
                    break
                case 's':
                    ctx.bezierCurveTo(preX+ preX+ preX - preItem[3] ,preY+preY+ preY - preItem[4],preX+ item[1],preY+ item[2], preX+item[3],preY+ item[4])
                    preX += item[3]
                    preY += item[4]
                    break
                case 'q':

                    ctx.quadraticCurveTo( preX+item[1], preY+item[2],item[3]+preX,item[4]+preY)
                    preX += item[3]
                    preY += item[4]
                    break
                case 't':

                    ctx.quadraticCurveTo(preX+ preX+ preX - preItem[1], preY+ preY+ preY - preItem[2],preX+ item[1],   preY+item[2])
                    preX += item[1]
                    preY += item[2]
                    break

                case 'Z':
                    ctx.closePath()
                    break
            }
        }

        ctx.fill()
        ctx.stroke()
        ctx.restore()
    }



}

export default Path