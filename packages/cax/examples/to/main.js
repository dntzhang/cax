import cax from '../../src/index.js'

const stage = new cax.Stage(600, 400, 'body')
const bitmap = new cax.Bitmap('./wepay-diy.jpg')

bitmap.x = 200
bitmap.y = -200
bitmap.scaleX = 0.6
bitmap.scaleY = 0.6
bitmap.originX = 40
bitmap.originY = 40
bitmap.cursor = 'pointer'
bitmap.on('click', () => {
    alert('微信支付')
})


stage.add(bitmap)



cax.To.get(bitmap)
    .to()
    .set("y", 240, 2000, cax.easing.elasticInOut)
    .rotation(240, 2000, cax.easing.elasticInOut)
    .end(function () {
        console.log(" task one has completed!")
    })
    .wait(500)
    .to()
    .rotation(0, 1400, cax.easing.elasticInOut)
    .end(function () {
        console.log(" task two has completed!")
    })
    .wait(500)
    .to()
    .scaleX(1, 1400, cax.easing.elasticInOut)
    .scaleY(1, 1400, cax.easing.elasticInOut)
    .end(function () {
        console.log(" task three has completed!")
    })
    .start();



cax.setInterval(() => {
    stage.update()
}, 16)