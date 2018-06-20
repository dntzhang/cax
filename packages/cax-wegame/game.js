// import './js/libs/weapp-adapter'
// import './js/libs/symbol'

// import Main from './js/main'

// new Main()



import cax from './js/libs/cax'

import Backgroundg from './background'
import Player from './player'

const bg = new Backgroundg()
const player = new Player()
const stage = new cax.Stage()

stage.add(bg, player)

stage.add(player.bulletGroup)

let touchX = null
let touchY = null


wx.onTouchStart(function (e) {
    touchX = e.touches[0].clientX
    touchY = e.touches[0].clientY
})

wx.onTouchMove(function (e) {
    touchX = e.touches[0].clientX
    touchY = e.touches[0].clientY
})






// const circle = new cax.Circle(100, {
//     fillStyle: 'red',
//     strokeStyle: 'white'
// })
// circle.x = 120
// circle.y = 120

// circle.on('tap', (evt) => {
//     console.log('tap')
// })

// circle.on('touchstart', (evt) => {
//     console.log('touchstart')
// })

// circle.on('touchmove', (evt) => {
//     console.log('touchmove')
// })

// circle.on('touchend', (evt) => {
//     console.log('touchend')
// })



// stage.add(circle)



// const sprite = new cax.Sprite({
//     framerate: 7,
//     imgs: [
//         'images/explosion1.png',
//         'images/explosion2.png',
//         'images/explosion3.png',
//         'images/explosion4.png',
//         'images/explosion5.png',
//         'images/explosion6.png',
//         'images/explosion7.png',
//         'images/explosion8.png',
//         'images/explosion9.png',
//         'images/explosion10.png',
//         'images/explosion11.png',
//         'images/explosion12.png',
//         'images/explosion13.png',
//         'images/explosion14.png',
//         'images/explosion15.png',
//         'images/explosion16.png',
//         'images/explosion17.png',
//         'images/explosion18.png',
//         'images/explosion19.png',
//     ],
//     frames: [
//         // x, y, width, height, originX, originY ,imageIndex
//         [0, 0, 64, 48, 0, 0, 0],
//         [0, 0, 64, 48, 0, 0, 1],
//         [0, 0, 64, 48, 0, 0, 2],
//         [0, 0, 64, 48, 0, 0, 3],
//         [0, 0, 64, 48, 0, 0, 4],
//         [0, 0, 64, 48, 0, 0, 5],
//         [0, 0, 64, 48, 0, 0, 6],
//         [0, 0, 64, 48, 0, 0, 7],
//         [0, 0, 64, 48, 0, 0, 8],
//         [0, 0, 64, 48, 0, 0, 9],
//         [0, 0, 64, 48, 0, 0, 10],
//         [0, 0, 64, 48, 0, 0, 11],
//         [0, 0, 64, 48, 0, 0, 12],
//         [0, 0, 64, 48, 0, 0, 13],
//         [0, 0, 64, 48, 0, 0, 14],
//         [0, 0, 64, 48, 0, 0, 15],
//         [0, 0, 64, 48, 0, 0, 16],
//         [0, 0, 64, 48, 0, 0, 17],
//         [0, 0, 64, 48, 0, 0, 18]
//     ],
//     animations: {
//         explode: {
//             frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
//         }
//     },
//     playOnce: true,
//     currentAnimation: "explode"
// });

// stage.add(sprite)

function update() {
    stage.update()
    bg.update()

    player.update()
    if(touchX !== null){
        player.x = touchX 
        player.y = touchY
    }
    
    requestAnimationFrame(update)
}

update()
