import { Stage, Bitmap } from '../../src/index.js'

let stage = new Stage(480,480,"body")
//var img = new Image()
//img.onload = function(){
//
//    let bmp = new Bitmap(img)
//    stage.add(bmp)
//    stage.update()
//}
//
//img.src='./mariosheet.png'

new Bitmap('./mariosheet.png',function(){
    stage.add(this)
    stage.update()
})

setTimeout(function(){

    new Bitmap('./mariosheet.png',function(){
        this.y=100
        stage.add(this)
        stage.update()
    })

},3000)
