import cax from '../../src/index.js'
const stage = new cax.Stage(260, 200, '#canvasCtn')
const group = new cax.Group()
const bitmap = new cax.Bitmap('./wepay-diy.jpg', () => {
    stage.update()
})

group.x = 130
group.y = 100
bitmap.originX = 40
bitmap.originY = 40
bitmap.cursor = 'pointer'
bitmap.on('click', () => {
    alert('微信支付')
})

const clipPath = new cax.Graphics()
clipPath.x = 0
clipPath.y = 0
clipPath.arc(0, 0, 25, 0, Math.PI * 2)

const text = new cax.Text('Hello Cax Clip!')
text.x = -30
group.add(bitmap, text)

group.clip(clipPath)
stage.add(group)
group.cursor = 'move'
group.on('drag',(evt)=>{
    evt.target.x+=evt.dx
    evt.target.y+=evt.dy
})
let tag = true
group.on('click',(evt)=>{
   console.log(1)
})

cax.setInterval(()=>{
    stage.update()
},16)

document.querySelector('#toggleBtn').addEventListener('click', () => {
    group.clip(tag ? null : clipPath)
    tag = !tag
    stage.update()
})