import cax from '../../src/index.js'


const stage = new cax.Stage(300, 400, 'body')

const button = new cax.Button({
    width: 100,
    height: 40,
   // textX:8,
    text: "sfsdf Me!",
    //autoHeight: true
  })
  button.x =100
  button.y =200
  stage.add(button)

cax.setInterval(() => {
    stage.update()
}, 16)