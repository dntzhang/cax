import { Stage, Graphics, Group, Circle } from '../../src/index.js'
import BezierCurveShape from './bezier-curve-shape.js'

let stage = new Stage(480,480,"body"),
    _boundingClientRect= stage.canvas.getBoundingClientRect(),
    startX,
    startY,
    isMouseDown = false,
    posDiv = document.getElementById('pos'),
    shape = null

//
const BZDRAWING = 'bz-drawing'
const BZCLOSED = 'bz-closed'
const BZSTART = 'bz-start'
const DRAG = 'drag'

stage.currentAction = BZDRAWING

window.stage = stage

stage.beginDrag = function(){

    stage.currentAction = DRAG

    stage.children.forEach(child=>{
        child.dragDisabled = false
    })
}

stage.beginDraw = function(){

    stage.currentAction = BZDRAWING

    stage.children.forEach(child=>{
        child.dragDisabled = true
    })
}

//不能用stage.addEventListener,因为stage.addEventListener需要舞台有东西才能触发冒泡或者捕获

stage.canvas.addEventListener('mousedown',(evt)=> {
    if(stage.currentAction === DRAG )return
    _boundingClientRect = stage.canvas.getBoundingClientRect()
    startX = evt.clientX - _boundingClientRect.left - stage.borderLeftWidth
    startY = evt.clientY - _boundingClientRect.top - stage.borderTopWidth


    if (shape&&shape.points.length > 2&&(startX - shape.points[0]) * (startX - shape.points[0]) + (startY - shape.points[1]) * (startY - shape.points[1]) < 100) {
        shape.closePath()


    }else {
        if(shape===null) {
            shape = new BezierCurveShape()
            stage.add(shape)
        }
        shape.addCircle(startX, startY)
        shape.updateControlPoints(startX, startY, startX, startY)
        isMouseDown = true
    }

    stage.update()
})


stage.canvas.addEventListener('mousemove',(evt)=> {
    if(stage.currentAction === DRAG )return
    const currentX = evt.clientX - _boundingClientRect.left - stage.borderLeftWidth
    const currentY = evt.clientY - _boundingClientRect.top - stage.borderTopWidth
    if(shape) {
        if (isMouseDown) {
            if (!shape.willAdjust) {
                shape.virtualCurve.visible = false
                shape.updateControlPoints(startX, startY, currentX, currentY)
            }
        } else if (!shape.closed) {
            shape.virtualCurve.visible = true
            shape.renderVirtualCurve(currentX, currentY)
        }
    }
    stage.update()
    evt.preventDefault();
    posDiv.innerHTML = currentX + '_' + currentY
})

document.addEventListener('mouseup',(evt)=> {
    if(stage.currentAction === DRAG )return
    isMouseDown = false
    shape.bindCircleEvent()
    if(shape.closed){
        shape = null
    }
})


setInterval(function(){
    stage.update()
},16)