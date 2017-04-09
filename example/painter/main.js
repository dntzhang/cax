import { Stage, Graphics, Group, Circle } from '../../src/index.js'
import BezierCurveShape from './bezier-curve-shape.js'

let stage = new Stage(480,480,"body"),
    _boundingClientRect= stage.canvas.getBoundingClientRect(),
    startX,
    startY,
    isMouseDown = false,
    posDiv = document.getElementById('pos'),
    shape = new BezierCurveShape()

stage.add(shape)


window.xx = shape
//不能用stage.addEventListener,因为stage.addEventListener需要舞台有东西才能触发冒泡或者捕获

stage.canvas.addEventListener('mousedown',(evt)=> {
    _boundingClientRect = stage.canvas.getBoundingClientRect()
    startX = evt.clientX - _boundingClientRect.left - stage.borderLeftWidth
    startY = evt.clientY - _boundingClientRect.top - stage.borderTopWidth

    if (shape.points.length > 0&&(startX - shape.points[0]) * (startX - shape.points[0]) + (startY - shape.points[1]) * (startY - shape.points[1]) < 100) {
        shape.closePath()

    }else {
        shape.addCircle(startX, startY)
        isMouseDown = true
    }

    stage.update()
})


stage.canvas.addEventListener('mousemove',(evt)=> {
    const currentX = evt.clientX - _boundingClientRect.left - stage.borderLeftWidth
    const currentY = evt.clientY - _boundingClientRect.top - stage.borderTopWidth
    if (isMouseDown) {
        shape.virtualCurve.visible = false
        shape.updateControlPoints(startX, startY, currentX, currentY)
    } else if(!shape.closed){
        shape.virtualCurve.visible = true
        shape.renderVirtualCurve(currentX, currentY)
    }
    stage.update()
    evt.preventDefault();
    posDiv.innerHTML = currentX + '_' + currentY
})

document.addEventListener('mouseup',(evt)=> {
    isMouseDown = false
})