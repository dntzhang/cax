import { Stage, Graphics } from '../../src/index.js'



let stage = new Stage('#myCanvas')
let curve = new Graphics();
stage.add(curve)
let points = [100,100,200,20,300,200,337,154]

function renderCurve(){

    curve.clear().beginPath()
        .moveTo(points[0],points[1])
        .bezierCurveTo(points[2],points[3],points[4],points[5],points[6],points[7])
        .strokeStyle("#046ab4")
        .lineWidth(2)
        .stroke()
        .beginPath()
        .moveTo(points[0],points[1])
        .lineTo(points[2],points[3])
        .lineTo(points[4],points[5])
        .lineTo(points[6],points[7])
        .strokeStyle('red')
        .stroke()
}

function addPoint(x,y,index){
    let graphics = new Graphics();
    graphics.cursor = 'move'
    graphics.beginPath()
        .arc(x,y,5,0,Math.PI*2)
        .lineWidth(3)
        .stroke()
        .fillStyle('green')
        .fill()
    stage.add(graphics)
    graphics.removeEventListener('drag')
    graphics.addEventListener('drag',function(evt){
        this.x += evt.dx
        this.y += evt.dy
        points[index*2] += evt.dx
        points[index*2+1] += evt.dy
        renderCurve()
        stage.update()
    })


}

renderCurve()
addPoint(points[0],points[1],0)
addPoint(points[2],points[3],1)
addPoint(points[4],points[5],2)
addPoint(points[6],points[7],3)

stage.update()