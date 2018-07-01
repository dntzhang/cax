import cax from '../../src/index.js'

const w = 576
const h = 360
const r = 700
const stage = new cax.Stage(w, h, '#canvasCtn')
const group = new cax.Group()
const bitmap = new cax.Bitmap('./wepay.png')
const payBmp = new cax.Bitmap('./pay.png')

const clipPath = new cax.Graphics()
clipPath.x = 280
clipPath.y = 180
clipPath.arc(0, 0, r, 0, Math.PI * 2)
group.clip(clipPath)
bitmap.visible = false
group.add(bitmap, payBmp)
stage.add(group)


stage.on('click', (evt) => {
    const rt = 576 / (window.innerWidth > 800 ? 800 : window.innerWidth)
    clipPath.x = evt.stageX * rt
    clipPath.y = evt.stageY * rt
})

let flag = false

cax.To.get(clipPath)
    .to().scaleY(0.0001, 1000).scaleX(0.0001, 1000)
    .end(()=>{
        bitmap.visible = !flag
        payBmp.visible = flag
        flag = !flag
    })
    .wait(100)
    .to().scaleY(1, 1000).scaleX(1, 1000)
    .wait(1900)
    .cycle().start()


cax.setInterval(function () {
    stage.update()
}, 15)