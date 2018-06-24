import cax from '../../src/index.js'


const stage = new cax.Stage(300, 400, 'body')

const circle = new cax.Circle(40, { fillStyle: 'black' })
circle.cache(0, 0, 40, 40)

circle.x = 150
circle.y = 150



const text = new cax.Text("abc", {
    font: '60px Arial'
})

text.x = 100
text.y = 100
text.scaleX = 0.5
text.cache(0, 0, 80, 60)
stage.add(circle, text)
stage.update()

text.cursor = 'move'
circle.cursor = 'pointer'