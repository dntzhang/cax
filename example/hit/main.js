import { Stage, Bitmap } from '../../src/index.js'

let stage = new Stage(480,480,"body")
stage.hitAABB=true

window.s = stage
let img = new Image()
img.onload = function(){

    let bmp = new Bitmap(img)
    stage.add(bmp)
    stage.update()

    bmp.addEventListener('click',function(){
        alert(1)
    })

}

img.src='./omi.png'



