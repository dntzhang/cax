import { Stage, Graphics, Group, Circle } from '../../src/index.js'

var stage = new Stage(480,480,"body")

//不能用stage.addEventListener,因为stage.addEventListener需要舞台有东西才能触发冒泡或者捕获

let _boundingClientRect= stage.canvas.getBoundingClientRect(),
    startX,
    startY,
    isMouseDown = false,
    currentGraphics =  new Graphics(),
    curve =  new Graphics()

let group = new Group()
stage.add(group)
group.add(curve,currentGraphics)


let points = []
let controlPoints = []

let controlPointsIndex = 0
let pos = document.getElementById('pos')
stage.canvas.addEventListener('mousedown',(evt)=> {
    _boundingClientRect = stage.canvas.getBoundingClientRect()
    startX = evt.clientX - _boundingClientRect.left - stage.borderLeftWidth
    startY = evt.clientY - _boundingClientRect.top - stage.borderTopWidth

    if (points.length > 0&&(startX - points[0]) * (startX - points[0]) + (startY - points[1]) * (startY - points[1]) < 100) {
        //闭合自己
        points.push(points[0], points[1])
        currentGraphics.visible = false
        controlPointsIndex = controlPoints.length
        controlPoints[controlPointsIndex] = controlPoints[0]
        controlPoints[controlPointsIndex + 1] = controlPoints[1]

        renderCurve(curve, points, controlPoints)

    }else {

        var c = new Circle(5)
        //c.cursor = 'move'

        points.push(startX, startY)

        c.x = startX
        c.y = startY
        group.add(c)
        isMouseDown = true


        controlPointsIndex = controlPoints.length
    }

    stage.update()
})


stage.canvas.addEventListener('mousemove',(evt)=> {
    const currentX = evt.clientX - _boundingClientRect.left - stage.borderLeftWidth
    const currentY = evt.clientY - _boundingClientRect.top - stage.borderTopWidth
    if (isMouseDown) {
        controlPoints[controlPointsIndex] = startX + startX - currentX
        controlPoints[controlPointsIndex + 1] = startY + startY - currentY
        controlPoints[controlPointsIndex + 2] = currentX
        controlPoints[controlPointsIndex + 3] = currentY

        renderCtrls(currentGraphics, controlPoints)
        renderCurve(curve, points, controlPoints)
        stage.update()
    }

    evt.preventDefault();
    pos.innerHTML = currentX + '_' + currentY
})

document.addEventListener('mouseup',(evt)=> {
    isMouseDown = false


})

const renderCurve = (curve, points, controlPoints) => {
    curve.clear()
    curve.moveTo(points[0], points[1])
    for (let i = 0, len = points.length; i < len; i += 2) {
        let index = i * 2
        curve.bezierCurveTo(controlPoints[index + 2], controlPoints[index + 3], controlPoints[index + 4], controlPoints[index + 5], points[i + 2], points[i + 3])

    }
    curve.stroke()
}

const renderCtrls = (graphics, cps)=> {
    graphics.clear()
    for (let i = 0, len = cps.length; i < len; i += 4) {
        graphics.beginPath()
        graphics.moveTo(cps[i], cps[i + 1])
        graphics.lineTo(cps[i + 2], cps[i + 3])

        graphics.stroke()
    }

}