import cax from '../../src/index.js'
const stage = new cax.Stage(260, 200, '#canvasCtn')
const bitmap = new cax.Bitmap('./wepay-diy.jpg', () => {
    stage.update()
})

bitmap.x = 130
bitmap.y = 100
bitmap.originX = 40
bitmap.originY = 40
bitmap.cursor = 'pointer'
bitmap.on('click', () => {
    alert('微信支付')
})

const clipPath = new cax.Graphics()
clipPath.arc(40, 40, 25, 0, Math.PI * 2)
bitmap.clip(clipPath)

stage.add(bitmap)

let tag = true

document.querySelector('#toggleBtn').addEventListener('click', () => {
    bitmap.clip(tag ? null : clipPath)
    tag =!tag
    stage.update()
})