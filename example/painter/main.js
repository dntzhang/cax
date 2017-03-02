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

stage.add(graphics);
setInterval(()=>{
    graphics.rotation++
    stage.update();
},16)
