// import './js/libs/weapp-adapter'
// import './js/libs/symbol'

// import Main from './js/main'

// new Main()



import cax from './js/libs/cax'
const stage = new cax.Stage()
const circle = new cax.Circle(100 ,{
    fillStyle:'red',
    strokeStyle:'white'
})
circle.x = 120
circle.y = 120

circle.on('tap', (evt)=>{
    console.log('tap')
})

circle.on('touchstart', (evt)=>{
    console.log('touchstart')
})

circle.on('touchmove', (evt)=>{
    console.log('touchmove')
})

circle.on('touchend', (evt)=>{
    console.log('touchend')
})





stage.add(circle)
stage.update()