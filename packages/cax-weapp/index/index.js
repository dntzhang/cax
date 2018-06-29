import cax from '../cax/index'

Page({
  onLoad: function (options) {
    const info = wx.getSystemInfoSync()
    const stage = new cax.Stage(info.windowWidth, info.windowHeight / 2, 'myCanvas', this)

    const rect = new cax.Rect(100, 100, {
      fillStyle: 'black'
    })

    rect.originX = 50
    rect.originY = 50
    rect.x = 100
    rect.y = 100
    rect.rotation = 30

    rect.on('touchstart', () => {
      console.log('rect touchstart')
    })

    rect.on('touchmove', () => {
      console.log('rect touchmove')
    })

    rect.on('touchend', () => {
      console.log('rect touchend')
    })

    rect.on('tap', () => {
      console.log('rect tap')
    })


    stage.add(rect)

    const button = new cax.Button({ width: 100, height: 40, text: "I am button!" }) 
    button.y = 170
    button.x = 20
    stage.add(button)
    

   

    const bitmap = new cax.Bitmap('/images/wx.png')

   

    bitmap.on('tap', () => {
      console.log('bitmap tap')
    })
    
    stage.add(bitmap)
 

    const sprite = new cax.Sprite({
      framerate: 7,
      imgs: ['https://r.photo.store.qq.com/psb?/V137Nysk1nVBJS/09YJstVgoLEi0niIWFcOJCyGmkyDaYLq.tlpDE62Zdc!/r/dDMBAAAAAAAA'],
      frames: [
        // x, y, width, height, originX, originY ,imageIndex
        [0, 0, 32, 32],
        [32 * 1, 0, 32, 32],
        [32 * 2, 0, 32, 32],
        [32 * 3, 0, 32, 32],
        [32 * 4, 0, 32, 32],
        [32 * 5, 0, 32, 32],
        [32 * 6, 0, 32, 32],
        [32 * 7, 0, 32, 32],
        [32 * 8, 0, 32, 32],
        [32 * 9, 0, 32, 32],
        [32 * 10, 0, 32, 32],
        [32 * 11, 0, 32, 32],
        [32 * 12, 0, 32, 32],
        [32 * 13, 0, 32, 32],
        [32 * 14, 0, 32, 32]
      ],
      animations: {
        walk: {
          frames: [0, 1]
        },
        happy: {
          frames: [11, 12, 13, 14]
        },
        win: {
          frames: [7, 8, 9, 10]
        }
      },
      currentAnimation: 'walk',
      animationEnd: function () {
      }
    })

    sprite.x = 100
    sprite.y = 100
    stage.add(sprite)

   

    const stage2 = new cax.Stage(info.windowWidth, info.windowHeight / 2, 'myCanvas2', this)

    const button2 = new cax.Button({ width: 100, height: 40, text: "I am in stage2!" }) 
    button2.y = 170
    button2.x = 20
    stage2.add(button2)
    const bitmap2 = new cax.Bitmap('/images/wx.png')
    bitmap2.y=100
    stage2.add(bitmap2)

    cax.To.get(rect).to().x(200, 2000, cax.easing.elasticInOut).start()




    setInterval(function () {
      rect.rotation++
      stage.update()
      stage2.update()
    }, 16)

  }
})
