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
    console.log(111)

    stage.add(rect)

    const rect2 = new cax.Rect(100, 100, {
      fillStyle: 'black'
    })

    // rect.originX = 50
    // rect.originY = 50
    rect2.x = 200
    rect2.y = 100
    rect2.rotation = 30

    rect2.on('touchstart', () => {
      console.log('rect2 touchstart')
    })

    rect2.on('touchmove', (evt) => {
      console.log('rect2 touchmove')
    })

    rect2.on('touchend', () => {
      console.log('rect2 touchend')
    })

    rect2.on('tap', () => {
      console.log('rect2 tap')
    })

    stage.add(rect2)

    stage.update()

    const bitmap = new cax.Bitmap('https://r.photo.store.qq.com/psb?/V137Nysk1nVBJS/09YJstVgoLEi0niIWFcOJCyGmkyDaYLq.tlpDE62Zdc!/r/dDMBAAAAAAAA', () => {
      stage.update()
    })

    bitmap.on('tap', () => {
      console.log('bitmap tap')
    })
    bitmap.scaleX = bitmap.scaleY = 5
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

    setInterval(function () {
      rect.rotation++
      stage.update()
    }, 16)
  }
})
