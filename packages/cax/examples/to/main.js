import cax from '../../src/index.js'

const stage = new cax.Stage(300, 400, 'body')
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
    .y(340, 2000, cax.easing.elasticInOut)
    .rotation(240, 2000, cax.easing.elasticInOut)
    .begin(() => {
        console.log("Task one has began!")
    })
    .progress(() => {
        console.log("Task one is progressing!")
    })
    .end(() => {
        console.log("Task one has completed!")
    })
    .wait(500)
    .to()
    .rotation(0, 1400, cax.easing.elasticInOut)
    .begin(() => {
        console.log("Task two has began!")
    })
    .progress(() => {
        console.log("Task two is progressing!")
    })
    .end(() => {
        console.log("Task two has completed!")
    })
    .wait(500)
    .to()
    .scaleX(1, 1400, cax.easing.elasticInOut)
    .scaleY(1, 1400, cax.easing.elasticInOut)
    .begin(() => {
        console.log("Task three has began!")
    })
    .progress(() => {
        console.log("Task three is progressing!")
    })
    .end(() => {
        console.log("Task three has completed!")
    })
    .wait(500)
    .to({ x: 160, y: 200 }, 1000, cax.easing.elasticInOut)
    .rotation(360, 1000, cax.easing.elasticInOut)
    .begin(() => {
        console.log("Task four has began!")
    })
    .progress(() => {
        console.log("Task four is progressing!")
    })
    .end(() => {
        console.log("Task four has completed!")
    })
    .start();



cax.setInterval(() => {
    stage.update()
}, 16)