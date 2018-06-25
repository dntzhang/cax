import cax from '../../src/index.js'

const stage = new cax.Stage(300, 400, 'body')
const bitmap = new cax.Bitmap('./wepay-diy.jpg',()=>{
    cax.To.get(bitmap).animate('rubber').start()
})

bitmap.x = 150
bitmap.y = 200
bitmap.scaleX = 0.6
bitmap.scaleY = 0.6
bitmap.originX = 40
bitmap.originY = 40
bitmap.cursor = 'pointer'
bitmap.on('click', () => {
    alert('微信支付')
})

stage.add(bitmap)


cax.setInterval(() => {
    stage.update()
}, 16)