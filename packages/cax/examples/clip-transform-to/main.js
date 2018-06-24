import cax from '../../src/index.js'

const w = 576
const h = 360
const r = 170
const stage = new cax.Stage(w, h, '#canvasCtn')
const bitmap = new cax.Bitmap('./wepay.png', () => {
    stage.update()
})


const clipPath = new cax.Graphics()
clipPath.x = 280
clipPath.y = 180
clipPath.arc(0, 0, r, 0, Math.PI * 2)
bitmap.clip(clipPath)

stage.add(bitmap)

let tag = true

stage.on('click', (evt) => {
    clipPath.x = evt.stageX * 576 / window.innerWidth
    clipPath.y = evt.stageY * 576 / window.innerWidth
})

function sineInOut(a) {
    return 0.5 * (1 - Math.cos(Math.PI * a));
}


cax.To.get(clipPath)
    .to().scaleY(0.8, 450, sineInOut).skewX(20, 900, sineInOut)
    .wait(900)
    .cycle().start()

cax.To.get(clipPath)
    .wait(450)
    .to().scaleY(1, 450, sineInOut)
    .wait(900)
    .cycle().start()

cax.To.get(clipPath)
    .wait(900)
    .to().scaleY(0.8, 450, sineInOut).skewX(-20, 900, sineInOut)
    .cycle()
    .start()

cax.To.get(clipPath)
    .wait(1350)
    .to().scaleY(1, 450, sineInOut)
    .cycle()
    .start()


let speedX = 1,
    speedY = 1

cax.setInterval(function () {
    stage.update()
}, 15)