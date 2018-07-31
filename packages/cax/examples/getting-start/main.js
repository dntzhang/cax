import cax from '../../src/index.js'

const stage = new cax.Stage(200, 200, 'body')

cax.loadImgs({
  imgs: ['./wepay-diy.jpg'],
  complete: (imgs) => {
    const img = imgs[0]
    const bitmap = new cax.Bitmap(img)

    bitmap.x = stage.width / 2
    bitmap.y = stage.height / 2
    bitmap.rotation = -10
    bitmap.originX = img.width / 2
    bitmap.originY = img.height / 2
    bitmap.filter('blur(10px)')
    
    stage.add(bitmap)
    stage.update()
  }
})
