import cax from '../../src/index.js'

const stage = new cax.Stage(300, 400, '#canvasCtn')

const ball = new cax.Graphics()

ball.beginPath()
    .arc(0, 0, 140, 0, Math.PI * 2)
    .closePath()
    .fillStyle('#f4862c').fill()
    .strokeStyle("#046ab4").lineWidth(8).stroke()
    .lineWidth(6)
    .beginPath().moveTo(298 - 377, 506 - 391).bezierCurveTo(236 - 377, 396 - 391, 302 - 377, 272 - 391, 407 - 377, 254 - 391).stroke()
    .beginPath().moveTo(328 - 377, 258 - 391).bezierCurveTo(360 - 377, 294 - 391, 451 - 377, 272 - 391, 503 - 377, 332 - 391).stroke()
    .beginPath().moveTo(282 - 377, 288 - 391).bezierCurveTo(391 - 377, 292 - 391, 481 - 377, 400 - 391, 488 - 377, 474 - 391).stroke()
    .beginPath().moveTo(242 - 377, 352 - 391).bezierCurveTo(352 - 377, 244 - 391, 319 - 377, 423 - 391, 409 - 377, 527 - 391).stroke();

ball.x = 150
ball.y = 200
ball.scaleX = ball.scaleY = 0.4

stage.add(ball)

ball.on('drag', (evt) => {
    evt.target.x += evt.dx
    evt.target.y += evt.dy
    evt.preventDefault()
})

ball.cursor = 'move'

document.querySelector('#addScaleBtn').addEventListener('click', () => {
    ball.scaleX += 0.1
    ball.scaleY += 0.1
})

document.querySelector('#subScaleBtn').addEventListener('click', () => {

    ball.scaleX -= 0.1

    if (ball.scaleX < 0.1) {
        ball.scaleX = ball.scaleY = 0.1
    }
})

cax.tick(stage.update.bind(stage))