import cax from '../../src/index.js'
const stage = new cax.Stage(260, 200, '#canvasCtn')

cax.loadImg({
    img:'./wepay-diy.jpg',
    complete:function(img){

        const bitmap = new cax.Bitmap(img)
        
        bitmap.x = 130
        bitmap.y = 100
        bitmap.originX = 40
        bitmap.originY = 40
        bitmap.cursor = 'pointer'
        bitmap.on('click', () => {
            alert('微信支付')
        })
        
        bitmap.on('drag',(evt)=>{
            evt.target.x+=evt.dx
            evt.target.y+=evt.dy
        })
        
        
        
        cax.setInterval(()=>{
            stage.update()
        },16)
        
        const clipPath = new cax.Graphics()
        clipPath.x = 40
        clipPath.y = 40
        clipPath.arc(0, 0, 25, 0, Math.PI * 2)
        bitmap.clip(clipPath)
        
        stage.add(bitmap)
        
        let tag = true
        
        document.querySelector('#toggleBtn').addEventListener('click', () => {
            bitmap.clip(tag ? null : clipPath)
            tag =!tag
            stage.update()
        })
    }
})