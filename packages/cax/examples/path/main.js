import cax from '../../src/index.js'

const stage = new cax.Stage(300, 400, 'body')
// const path = new cax.Path('M4.645,45.577c-0.017-0.383-0.029-0.767-0.029-1.154c0-13.997,11.387-25.385,25.385-25.385 s25.385,11.387,25.385,25.385c0,0.387-0.012,0.771-0.029,1.154h4.616C59.985,45.193,60,44.81,60,44.423c0-16.569-13.431-30-30-30 s-30,13.431-30,30c0,0.387,0.015,0.77,0.029,1.154H4.645z',{
//     strokeStyle:'black',
//    // fillStyle:'black'
// })

const path = new cax.Path('M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80',{
        strokeStyle:'black',
       // fillStyle:'black'
    })

//path.x = 100
stage.add(path)
stage.update()
