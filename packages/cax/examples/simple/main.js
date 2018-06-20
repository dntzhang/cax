import cax from '../../src/index.js'


const stage = new cax.Stage(600, 400, 'body')

const group = new cax.Group()

const sprite = new cax.Sprite({
    framerate: 7,
    imgs: ['./mario-sheet.png'],
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
            frames: [5, 6, 7, 8, 9]
        },
        win: {
            frames: [12]
        }
    },
    playOnce: false,
    currentAnimation: "walk",
    animationEnd: function () {

    }
});

const rect = new cax.Rect(200, 100, { fillStyle: 'black' })
const text = new cax.Text('Drag Me!', {
    color: 'white',
    font: '20px Arial'
})

const caxText = new cax.Text('Hello Cax!', {
    color: 'red',
    font: '30px Arial'
})

caxText.x = 300
caxText.y = 200

stage.add(caxText)

text.x = 100 - text.getWidth() / 2
text.y = 40

const bitmap = new cax.Bitmap('./wepay.png')
bitmap.rect = [0, 0, 170, 140]
bitmap.x = 200


group.add(rect, text)

group.cursor = 'move'
group.on('drag', (evt) => {
    group.x += evt.dx
    group.y += evt.dy
})


bitmap.cursor = 'pointer'
bitmap.on('click', () => {
    console.log('微信支付')
})


bitmap.on('touchstart', () => {
    console.log('touchstart')
})

bitmap.on('tap', () => {
    console.log('tap')
})


bitmap.on('touchmove', () => {
    console.log('touchmove')
})

bitmap.on('drag', () => {
    console.log('dragging')
})

bitmap.on('touchend', () => {
    console.log('touchend')
})


stage.add(group, bitmap)



stage.add(sprite)
const marioBtimap = new cax.Bitmap('./mario-sheet.png')
stage.add(marioBtimap)
marioBtimap.y = 300
sprite.scaleX = sprite.scaleY = 1.5
sprite.y = 160


const ellipse = new cax.Ellipse(100, 50, {
    fillStyle: '#1BB11B'
})
ellipse.x = 200
ellipse.y = 250
ellipse.originX = 50
ellipse.originY = 25
ellipse.cursor = 'pointer'
stage.add(ellipse)



const ball = new cax.Graphics()
ball.beginPath()
    .arc(377, 391, 140, 0, Math.PI * 2)
    .closePath()
    .fillStyle('#f4862c').fill()
    .strokeStyle("#046ab4").lineWidth(8).stroke()
    .beginPath().moveTo(298, 506).bezierCurveTo(236, 396, 302, 272, 407, 254).strokeStyle("#046ab4").lineWidth(6).stroke()
    .beginPath().moveTo(328, 258).bezierCurveTo(360, 294, 451, 272, 503, 332).strokeStyle("#046ab4").lineWidth(6).stroke()
    .beginPath().moveTo(282, 288).bezierCurveTo(391, 292, 481, 400, 488, 474).strokeStyle("#046ab4").lineWidth(6).stroke()
    .beginPath().moveTo(242, 352).bezierCurveTo(352, 244, 319, 423, 409, 527).strokeStyle("#046ab4").lineWidth(6).stroke();

ball.x = 340
ball.y = -80;
ball.scaleX = ball.scaleY = 0.5

stage.add(ball)


const graphics = new cax.Graphics()
graphics
    .beginPath()
    .arc(0, 0, 10, 0, Math.PI * 2)
    .closePath()
    .fillStyle('#f4862c')
    .fill()
    .strokeStyle('black')
    .stroke()

graphics.x = 100
graphics.y = 200

stage.add(graphics)



cax.setInterval(() => {
    ellipse.rotation++
    stage.update()
    sprite.x += 0.8
}, 16)