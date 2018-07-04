import cax from '../../src/index.js'



const stage = new cax.Stage(600, 400, '#canvasCtn')

const radius = 50
const rings = 40

const colors = ["#828b20", "#b0ac31", "#cbc53d", "#fad779", "#f9e4ad", "#faf2db", "#563512", "#9b4a0b", "#d36600", "#fe8a00", "#f9a71f"]

for (let i = 0; i < 200; i++) {

    const shape = new cax.Graphics()
    for (var j = rings; j > 0; j--) {
        shape.beginPath().fillStyle(colors[Math.random() * colors.length | 0]).arc(0,0,radius * j / rings,0,Math.PI*2).fill()
    }
    shape.x = Math.random() * 600
    shape.y = Math.random() * 400
    shape.velX = Math.random() * 10 - 5
    shape.velY = Math.random() * 10 - 5


    stage.add(shape);
}




cax.tick(function () {

    var w = 600 + radius * 2;
    var h = 400 + radius * 2;

    for (var i = 0; i < 200; i++) {
        var shape = stage.children[i];
        shape.x = (shape.x + radius + shape.velX + w) % w - radius;
        shape.y = (shape.y + radius + shape.velY + h) % h - radius;
    }

    stage.update();
})



let tag = true

document.querySelector('#toggleBtn').addEventListener('click', () => {

    for (var i = 0; i < 200; i++) {
        var shape = stage.children[i];
        if (tag) {
            shape.cache(-radius, -radius, radius * 2, radius * 2)
        } else {
            shape.uncache()
        }
    }

    tag =!tag

})