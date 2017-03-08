import { Stage, Graphics } from '../../src/index.js'

var stage = new Stage(480,480,"body");
var graphics = new Graphics();
graphics.beginPath()
    .arc(377 / 4 - 58, 391 / 4 - 58, 140 / 4, 0, Math.PI * 2)
    .closePath()
    .fillStyle('#f4862c')
    .fill()
    .strokeStyle("#046ab4")
    .lineWidth(8 / 4)
    .stroke()
    .beginPath()
    .moveTo(298 / 4 - 58, 506 / 4 - 58)
    .bezierCurveTo(236 / 4 - 58, 396 / 4 - 58, 302 / 4 - 58, 272 / 4 - 58, 407 / 4 - 58, 254 / 4 - 58)
    .strokeStyle("#046ab4")
    .lineWidth(6 / 4)
    .stroke()
    .beginPath()
    .moveTo(328 / 4 - 58, 258 / 4 - 58)
    .bezierCurveTo(360 / 4 - 58, 294 / 4 - 58, 451 / 4 - 58, 272 / 4 - 58, 503 / 4 - 58, 332 / 4 - 58).strokeStyle("#046ab4")
    .lineWidth(6 / 4)
    .stroke()
    .beginPath()
    .moveTo(282 / 4 - 58, 288 / 4 - 58)
    .bezierCurveTo(391 / 4 - 58, 292 / 4 - 58, 481 / 4 - 58, 400 / 4 - 58, 488 / 4 - 58, 474 / 4 - 58)
    .strokeStyle("#046ab4")
    .lineWidth(6 / 4)
    .stroke()
    .beginPath()
    .moveTo(242 / 4 - 58, 352 / 4 - 58)
    .bezierCurveTo(352 / 4 - 58, 244 / 4 - 58, 319 / 4 - 58, 423 / 4 - 58, 409 / 4 - 58, 527 / 4 - 58)
    .strokeStyle("#046ab4")
    .lineWidth(6 / 4)
    .stroke();

graphics.x = graphics.y = 200;
graphics.cursor = 'move'
graphics.originX = 40
graphics.originY = 40

stage.add(graphics);
stage.update();

graphics.addEventListener('click',()=>{
    //didn't exeu alert(2) because  evt.stopPropagation();
    alert(2)
},false);

graphics.addEventListener('click',evt=>{
    console.log('click')
    evt.stopPropagation();
},true)

graphics.addEventListener('mouseover',evt=>{
    //evt.stopPropagation();
    graphics.scaleX = graphics.scaleY = 1.1
    stage.update()
})

graphics.addEventListener('mouseout', evt => {
    graphics.scaleX = graphics.scaleY = 1
    stage.update()
})



let isMouseDown = false
let preX = null
let preY = null

graphics.addEventListener('mousedown',evt=>{
    graphics.scaleX = graphics.scaleY = 1.2
    isMouseDown = true
    preX = evt.stageX
    preY = evt.stageY

    stage.update()
})

document.addEventListener('mousemove',evt => {

    if(isMouseDown&& evt.stageX!== undefined) {

        graphics.x += evt.stageX - preX
        graphics.y += evt.stageY - preY
        stage.update();

        preX = evt.stageX
        preY = evt.stageY
    }
})

document.addEventListener('mouseup',evt=> {
    if(isMouseDown){
        graphics.scaleX = graphics.scaleY = 1.1
    }else{
        graphics.scaleX = graphics.scaleY = 1
    }
    isMouseDown = false
    stage.update()
})

stage.addEventListener('mouseout',evt =>{
    isMouseDown = false
    graphics.scaleX = graphics.scaleY = 1
})

//setInterval(()=>{
//    graphics.rotation++
//    stage.update();
//},16)