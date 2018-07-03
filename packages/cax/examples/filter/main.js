import cax from '../../src/index.js'


const stage = new cax.Stage(300, 400, '#canvasCtn')

const circle = new cax.Circle(40, { fillStyle: 'red' })



circle.filter('invert(100%)', { x: -40, y: -40, width: 80, height: 80 })

circle.x = 140
circle.y = 80
circle.scaleX = 0.5
circle.rotation = 30

circle.cursor = 'pointer'
const bitmap = new cax.Bitmap('./wepay.png')

bitmap.x = 110
bitmap.y = 110

bitmap.filter('invert(100%)', { x: 0, y: 0, width: 180, height: 130 })
bitmap.cursor = 'move'
bitmap.on('drag', (evt) => {
    evt.target.x += evt.dx
    evt.target.y += evt.dy
})
stage.add(circle, bitmap)

const pureBmp = new cax.Bitmap('./wepay.png')
pureBmp.rect= [0,0,180,130]
pureBmp.x = 10
pureBmp.y = 110


stage.add(pureBmp)

cax.setInterval(() => {

    stage.update()
}, 16)