import { Graphics, Group, Circle } from '../../src/index.js'

class BezierCurveShape extends Group {

    constructor() {
        super()

        this.points = []
        this.controlPoints = []

        this.controlLines = new Graphics()
        this.curve = new Graphics()
        this.virtualCurve = new Graphics()
        this.virtualCurve.alpha = 0.5

        this.index = 0
        this.circleGroup = new Group()
        this.add(this.controlLines, this.curve, this.circleGroup, this.virtualCurve)
    }

    updateControlPoints(startX, startY, currentX, currentY) {
        this.controlPoints[this.index] = startX + startX - currentX
        this.controlPoints[this.index + 1] = startY + startY - currentY
        this.controlPoints[this.index + 2] = currentX
        this.controlPoints[this.index + 3] = currentY
        this.draw()
    }

    addCircle(x, y) {
        var c = new Circle(5)
        //c.cursor = 'move'

        this.points.push(x, y)
        this.index = this.controlPoints.length
        c.x = x
        c.y = y
        this.circleGroup.add(c)
    }

    closePath() {
        this.points.push(this.points[0], this.points[1])
        this.controlLines.visible = false
        const index = this.controlPoints.length
        this.controlPoints[index] = this.controlPoints[0]
        this.controlPoints[index + 1] = this.controlPoints[1]

        this.draw()

    }

    draw() {
        this.renderCtrls()
        this.renderCurve()
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
        for (let i = 0, len = points.length; i < len; i += 2) {
            let index = i * 2
            curve.bezierCurveTo(controlPoints[index + 2], controlPoints[index + 3], controlPoints[index + 4], controlPoints[index + 5], points[i + 2], points[i + 3])

        }
        curve.stroke()
    }

    renderVirtualCurve(currentX, currentY) {
        let curve = this.virtualCurve,
            points = this.points,
            controlPoints = this.controlPoints
        const len = points.length,
            cLen = controlPoints.length
        curve.clear()
        curve.moveTo(points[len - 2], points[len - 1])
        curve.bezierCurveTo(controlPoints[cLen-2], controlPoints[cLen-1], currentX, currentY, currentX, currentY)
        curve.stroke()
    }
}

export default BezierCurveShape