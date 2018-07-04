import cax from '../../src/index.js'


const stage = new cax.Stage(300, 400, '#canvasCtn')

const circle = new cax.Circle(40, { fillStyle: 'red' })



circle.filter('invert(100%)', { x: -40, y: -40, width: 80, height: 80 })

circle.x = 140
circle.y = 40
circle.scaleX = 0.5
circle.rotation = 30

circle.cursor = 'pointer'
const bitmap = new cax.Bitmap('./wepay.png')

bitmap.x = 60
bitmap.y = 110

bitmap.filter('invert(100%)', { x: 0, y: 0, width: 180, height: 130 })
bitmap.rect = [0, 0, 180, 130]
bitmap.cursor = 'move'
bitmap.on('drag', (evt) => {
    evt.target.x += evt.dx
    evt.target.y += evt.dy
})
stage.add(circle, bitmap)


const mario = new cax.Bitmap('./mario-sheet.png')

mario.x = 10
mario.y = 310

mario.filter('blur(10px)', { x: 0, y: 0, width: 280, height: 130 })
mario.cursor = 'move'
mario.on('drag', (evt) => {
    evt.target.x += evt.dx
    evt.target.y += evt.dy
})
stage.add(mario)

let tag = true

document.querySelector('#toggleBtn').addEventListener('click', function () {
    if (tag) {
        mario.unfilter()
        bitmap.unfilter()
        circle.unfilter()
    } else {

        mario.filter('blur(10px)', { x: 0, y: 0, width: 280, height: 130 })
        circle.filter('invert(100%)', { x: -40, y: -40, width: 80, height: 80 })
        bitmap.filter('invert(100%)', { x: 0, y: 0, width: 180, height: 130 })
    }
    tag = !tag
})

cax.tick(() => {
    stage.update()
})