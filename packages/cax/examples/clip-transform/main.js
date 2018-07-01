import cax from '../../src/index.js'

const w = 576
const h = 360
const r = 65
const stage = new cax.Stage(w, h, '#canvasCtn')
const bitmap = new cax.Bitmap('./wepay.png', () => {
    stage.update()
})


const clipPath = new cax.Graphics()
clipPath.x = 40 + Math.random() * 200
clipPath.y = 40 + Math.random() * 200
clipPath.arc(0, 0, r, 0, Math.PI * 2)
bitmap.clip(clipPath)

stage.add(bitmap)

let tag = true

stage.on('click', (evt) => {
    const rt = 576 / (window.innerWidth>800?800:window.innerWidth)
    clipPath.x = evt.stageX * rt
    clipPath.y = evt.stageY * rt
})

let speedX = 1,
    speedY = 1

cax.setInterval(function () {

    clipPath.x += speedX
    clipPath.y += speedY
    if (clipPath.y > h - r) {
        clipPath.y = h - r
        speedY *= -1
    } else if (clipPath.y < r) {
        clipPath.y = r
        speedY *= -1
    }

    if (clipPath.x > w - r) {
        clipPath.x = w - r
        speedX *= -1
    } else if (clipPath.x < r) {
        clipPath.x = r
        speedX *= -1
    }

    stage.update()
}, 15)