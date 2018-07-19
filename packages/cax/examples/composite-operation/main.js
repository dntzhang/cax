import cax from '../../src/index.js'
const stage = new cax.Stage(260, 200, '#canvasCtn')
const group = new cax.Group()
group.x = 90
group.y = 60
const bitmap = new cax.Bitmap('./wepay-diy.jpg', () => {
    group.cache(0, 0, 100, 100, 1)
    stage.update()
})


group.cursor = 'pointer'
group.on('click', () => {
    alert('微信支付')
})

group.on('drag', (evt) => {
    evt.target.x += evt.dx
    evt.target.y += evt.dy
})
const bg = new cax.Rect(11200, 1180, { fillStyle: '#DE5347' })
//bg.cursor = 'default'

const rect = new cax.Rect(80, 20, { fillStyle: 'black' })
rect.compositeOperation = 'source-atop'


group.add(bitmap, rect)

stage.add(bg, group)

cax.tick(() => {
    stage.update()
})

let tag = true

document.querySelector('#toggleBtn').addEventListener('click', () => {

    if (tag) {

        group.uncache()
    } else {
        group.cache(0, 0, 100, 100)
    }


    tag = !tag

})