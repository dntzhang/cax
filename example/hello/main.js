import { Stage, Graphics } from '../../src/index.js'

var stage = new Stage(480,480,"body");
var graphics = new Graphics();
graphics.beginPath()
    .arc(377 , 391 , 140 , 0, Math.PI * 2)
    .closePath()
    .fillStyle('#f4862c')
    .fill()
    .strokeStyle("#046ab4")
    .lineWidth(8)
    .stroke()
    .beginPath()
    .moveTo(298 , 506 )
    .bezierCurveTo(236 , 396 , 302 , 272 , 407 , 254 )
    .strokeStyle("#046ab4")
    .lineWidth(6 )
    .stroke()
    .beginPath()
    .moveTo(328 , 258 )
    .bezierCurveTo(360 , 294 , 451 , 272 , 503 , 332 ).strokeStyle("#046ab4")
    .lineWidth(6)
    .stroke()
    .beginPath()
    .moveTo(282 , 288 )
    .bezierCurveTo(391 , 292 , 481 , 400 , 488 , 474 )
    .strokeStyle("#046ab4")
    .lineWidth(6 )
    .stroke()
    .beginPath()
    .moveTo(242 , 352 )
    .bezierCurveTo(352 , 244 , 319 , 423 , 409 , 527 )
    .strokeStyle("#046ab4")
    .lineWidth(6 )
    .stroke();

graphics.x = graphics.y = 20;
graphics.cursor = 'move'
graphics.originX = 240
graphics.originY = 240

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