import cax from '../../src/index.js'


const stage = new cax.Stage(400, 400, '#canvasCtn')

const circle = new cax.Circle(40, { fillStyle: 'black' })

circle.x = 200
circle.y = 250
circle.rotation = 15
circle.cache(0, 0, 40, 40, 1)




const text = new cax.Text("abc", {
    font: '60px Arial'
})

text.x = 100
text.y = 100
//text.scaleX = 0.5
text.cache(0, 0, 80, 60)
stage.add(text,circle)

stage.update()

setInterval(()=>{
    stage.update()
},16)

const gt = new cax.Text("Group Cache", {
    font: '20px Arial'
})
const group = new cax.Group()

group.x =130
group.y =30

const rect = new cax.Rect(140,40, { fillStyle: 'red' })

group.cache(-20,0,100,20 ,1)

group.add(rect, gt)
stage.add(group)
stage.update()


group.cursor = 'move'

group.on('drag',(evt)=>{
    evt.target.x +=evt.dx
    evt.target.y+=evt.dy
})
text.cursor = 'move'
circle.cursor = 'pointer'


let tag = false

document.querySelector('#toggleBtn').addEventListener('click', () => {
    group[(tag ? 'cache' : 'uncache')](-20,0,100,20 ,1)
    text[(tag ? 'cache' : 'uncache')](0, 0, 80, 60)
    circle[(tag ? 'cache' : 'uncache')](0, 0, 40, 40, 1)
    tag =!tag
    stage.update()
})

// cax.setInterval(function(){
//     stage.update()
// },16)