import { Graphics, Group, Circle } from '../../src/index.js'
import drag from './ar-drag.js'

class BezierCurveShape extends Group {

    constructor() {
        super()

        this.points = []
        this.controlPoints = []

        this.controlLines = new Graphics()
        this.curve = new Graphics()
        this.virtualCurve = new Graphics()
        this.virtualCurve.alpha = 0.5

        this.closed = false
        this.index = 0
        this.circleGroup = new Group()
        this.ctrlCircleGroup = new Group()
        this.add(this.curve, this.controlLines, this.virtualCurve, this.ctrlCircleGroup, this.circleGroup)

        this.willAdjust = false


        this.curve.addEventListener('click', evt =>{
            this.toggle()
        })

        this.dragDisabled = true

        drag(this.curve, {
            move: (evt)=> {
                //this.curve.x += evt.dx
                //this.curve.y += evt.dy
                if(!this.dragDisabled) {
                    this.updatePoints(evt.dx, evt.dy)
                    this.draw()
                }
            },
            down: ()=> {
                this.willAdjust = true
            },
            up: ()=> {
                this.willAdjust = false
            }

        })

        this.isEditing = false
    }

    updatePoints(dx,dy) {
        this.points.forEach((item,index)=>{
            if(index%2 === 0 ){
                this.points[index] +=dx
                this.points[index+1] +=dy
            }
        })

        this.controlPoints.forEach((item,index)=>{
            if(index%2 === 0 ){
                this.controlPoints[index] +=dx
                this.controlPoints[index+1] +=dy
            }
        })

        this.ctrlCircleGroup.children.forEach(item=>{
            item.x += dx
            item.y +=dy
        })

        this.circleGroup.children.forEach(item=>{
            item.x += dx
            item.y +=dy
        })
    }

    toggle() {
        if (this.isEditing) {
            this.controlLines.visible = true
            this.ctrlCircleGroup.visible = true
            this.circleGroup.visible = true
        } else {
            this.controlLines.visible = false
            this.ctrlCircleGroup.visible = false
            this.circleGroup.visible = false
        }
        this.isEditing = !this.isEditing
    }

    updateControlPoints(startX, startY, currentX, currentY) {
        if (this.closed) return
        this.controlPoints[this.index] = startX + startX - currentX
        this.controlPoints[this.index + 1] = startY + startY - currentY
        this.controlPoints[this.index + 2] = currentX
        this.controlPoints[this.index + 3] = currentY
        this.draw()
    }

    addCircle(x, y) {
        if (this.closed || this.willAdjust) return
        var c = new Circle(5)
        c.cursor = 'move'
        var cc1 = new Circle(4)
        var cc2 = new Circle(4)
        this.points.push(x, y)
        this.index = this.controlPoints.length
        c.x = x
        c.y = y
        cc1.x = x
        cc1.y = y
        cc2.x = x
        cc2.y = y
        cc1.cursor = 'move'
        cc2.cursor = 'move'
        this.circleGroup.add(c)
        this.ctrlCircleGroup.add(cc1, cc2)


    }

    bindCircleEvent() {
        let c = this.circleGroup.children[this.circleGroup.children.length - 1]
        let cc1 = this.ctrlCircleGroup.children[this.ctrlCircleGroup.children.length - 2]
        let cc2 = this.ctrlCircleGroup.children[this.ctrlCircleGroup.children.length - 1]
        drag(c, {
            move: (evt)=> {
                c.x += evt.dx
                c.y += evt.dy

                const index = this.circleGroup.children.indexOf(c)

                //this.ctrlCircleGroup.children[index * 2].x += evt.dx
                //this.ctrlCircleGroup.children[index * 2].y += evt.dy
                //this.ctrlCircleGroup.children[index * 2 + 1].x += evt.dx
                //this.ctrlCircleGroup.children[index * 2 + 1].y += evt.dy
                this.points[index * 2] += evt.dx
                this.points[index * 2 + 1] += evt.dy

                this.controlPoints[index * 4] += evt.dx
                this.controlPoints[index * 4 + 1] += evt.dy
                this.controlPoints[index * 4 + 2] += evt.dx
                this.controlPoints[index * 4 + 3] += evt.dy

                if (this.closed && index === 0) {
                    this.points[this.points.length - 2] += evt.dx
                    this.points[this.points.length - 1] += evt.dy
                }
                this.draw()
            },
            down: ()=> {
                this.willAdjust = true
            },
            up: ()=> {
                this.willAdjust = false
            }

        })

        drag([cc1, cc2], {
            move: (evt)=> {
                evt.target.x += evt.dx
                evt.target.y += evt.dy

                let index = this.ctrlCircleGroup.children.indexOf(evt.target)


                if (index % 2 === 0) {
                    this.controlPoints[index * 2] += evt.dx
                    this.controlPoints[index * 2 + 1] += evt.dy
                    this.controlPoints[index * 2 + 2] -= evt.dx
                    this.controlPoints[index * 2 + 3] -= evt.dy



                    //this.ctrlCircleGroup.children[index].x += evt.dx
                    //this.ctrlCircleGroup.children[index].y += evt.dy
                    //this.ctrlCircleGroup.children[index + 1].x -= evt.dx
                    //this.ctrlCircleGroup.children[index + 1].y -= evt.dy
                } else {
                    index--
                    this.controlPoints[index * 2] -= evt.dx
                    this.controlPoints[index * 2 + 1] -= evt.dy
                    this.controlPoints[index * 2 + 2] += evt.dx
                    this.controlPoints[index * 2 + 3] += evt.dy


                    //this.ctrlCircleGroup.children[index].x -= evt.dx
                    //this.ctrlCircleGroup.children[index].y -= evt.dy
                    //this.ctrlCircleGroup.children[index + 1].x += evt.dx
                    //this.ctrlCircleGroup.children[index + 1].y += evt.dy
                }


                this.draw()
            },
            down: ()=> {
                this.willAdjust = true
            },
            up: ()=> {
                this.willAdjust = false
            }
        })

    }

    closePath() {
        if (this.closed) return
        this.circleGroup.visible = false
        this.ctrlCircleGroup.visible = false
        this.points.push(this.points[0], this.points[1])
        this.controlLines.visible = false
        this.closed = true

        this.virtualCurve.visible = false
        this.draw()

    }

    draw() {
        this.updateCircleGroup()
        this.renderCtrls()
        this.renderCurve()
    }

    updateCircleGroup() {
        let children = this.ctrlCircleGroup.children,
            len = children.length
        for (let i = 0; i < len; i += 2) {

            children[i].x = this.controlPoints[i * 2]
            children[i].y = this.controlPoints[i * 2 + 1]
            children[i + 1].x = this.controlPoints[i * 2 + 2]
            children[i + 1].y = this.controlPoints[i * 2 + 3]
        }
    }

    renderCtrls() {
        let graphics = this.controlLines,
            cps = this.controlPoints

        graphics.clear()
        for (let i = 0, len = cps.length; i < len; i += 4) {
            graphics.beginPath()
            graphics.moveTo(cps[i], cps[i + 1])
            graphics.lineTo(cps[i + 2], cps[i + 3])

            graphics.stroke()
        }
    }

    renderCurve() {
        let curve = this.curve,
            points = this.points,
            controlPoints = this.controlPoints
        curve.clear()
        curve.moveTo(points[0], points[1])
        for (let i = 0, len = points.length-2; i < len; i += 2) {
            let index = i * 2
            if(this.closed&&i+2 === points.length-2){
                curve.bezierCurveTo(controlPoints[index + 2], controlPoints[index + 3], controlPoints[0], controlPoints[1],  points[i + 2], points[i + 3])
            }else {
                curve.bezierCurveTo(controlPoints[index + 2], controlPoints[index + 3], controlPoints[index + 4], controlPoints[index + 5], points[i + 2], points[i + 3])
            }

        }
        curve.stroke()
       // curve.closePath()
        curve.fillStyle('white')
        curve.fill()
    }

    renderVirtualCurve(currentX, currentY) {
        let curve = this.virtualCurve,
            points = this.points,
            controlPoints = this.controlPoints
        const len = points.length,
            cLen = controlPoints.length
        curve.clear()
        curve.moveTo(points[len - 2], points[len - 1])
        curve.bezierCurveTo(controlPoints[cLen - 2], controlPoints[cLen - 1], currentX, currentY, currentX, currentY)
        curve.stroke()


    }
}

export default BezierCurveShape