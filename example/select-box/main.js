import { Stage, Bitmap, Graphics, Group, Circle } from '../../src/index.js'
import SelectBox from  './edit-box.js'

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

var bitmap = new Bitmap('./test.png',()=> {
    stage.add(bitmap)
    bitmap.x = 200
    bitmap.y = 200
    bitmap.rotation = 45
    bitmap.originX = bitmap.width / 2
    bitmap.originY = bitmap.height / 2

    var sb = new SelectBox(bitmap)


    stage.add(sb)
})



setInterval(function(){
    stage.update()
},16)