import cax from '../../src/index.js'

const stage = new cax.Stage(300, 400, 'body')

const bitmap = new cax.Bitmap('./wepay.png')
bitmap.rect = [0, 0, 170, 140]
bitmap.x = 60
bitmap.y = 60
bitmap.cursor = 'pointer'
bitmap.on('click', () => {
    alert('wepay')
})


const group = new cax.Group()
const rr = new cax.RoundedRect(100, 40, 2, { fillStyle: '#42B035', strokeStyle: '#42B035', lineWidth: 4 })
const text = new cax.Text('Drag Me!', {
    color: 'white',
    font: '20px Arial'
})
text.x = 50 - text.getWidth() / 2
text.y = 40 / 2 - 10
group.add(rr, text)
group.cursor = 'move'
group.on('drag', (evt) => {
    group.x += evt.dx
    group.y += evt.dy
    evt.preventDefault()
})
group.x=100
group.y=250

const caxText = new cax.Text('Hello Cax!', {
    color: '#42B035',
    font: '30px Arial'
})
caxText.shadow = {
    color: '#42B035',
    offsetX: -5,
    offsetY: 5,
    blur: 10
}
caxText.x = 150 - caxText.getWidth() / 2
caxText.y = 200
caxText.on('drag', (evt) => {
    evt.target.x += evt.dx
    evt.target.y += evt.dy
    evt.preventDefault()
})
caxText.cursor = 'move'

stage.add(group, bitmap, caxText)

cax.tick(() => {
    stage.update()
})


// bitmap.on('touchstart', () => {
//     console.log('touchstart')
// })

// bitmap.on('tap', () => {
//     console.log('tap')
// })


// bitmap.on('touchmove', () => {
//     console.log('touchmove')
// })

// bitmap.on('drag', () => {
//     console.log('dragging')
// })

// bitmap.on('touchend', () => {
//     console.log('touchend')
// })


// const ap = new cax.ArrowPath([{ x: 100, y: 200 }, { x: 100, y: 300 }])
// stage.add(ap)

// const ap2 = new cax.ArrowPath([{ x: 100, y: 200 }, { x: 200, y: 200 }])
// stage.add(ap2)



// const ap3 = new cax.ArrowPath([{ x: 100, y: 200 }, { x: 0, y: 200 }])
// stage.add(ap3)


// const ap4 = new cax.ArrowPath([{ x: 100, y: 200 }, { x: 100, y: 100 }])
// stage.add(ap4)