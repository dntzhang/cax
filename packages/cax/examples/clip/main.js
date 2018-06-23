import cax from '../../src/index.js'
import Graphics from '../../src/render/display/graphics.js';

const stage = new cax.Stage(600, 400, 'body')
const bitmap = new cax.Bitmap('./wepay-diy.jpg',()=>{
    
    stage.update()
})

bitmap.x = 300
bitmap.y = 200
bitmap.originX = 40
bitmap.originY = 40
bitmap.cursor = 'pointer'
bitmap.on('click', () => {
    alert('微信支付')
})

const clipPath = new Graphics()
clipPath.arc(40, 40, 25, 0, Math.PI * 2)
bitmap.clip(clipPath, false)

stage.add(bitmap)



// cax.setInterval(() => {
//     stage.update()
// }, 16)