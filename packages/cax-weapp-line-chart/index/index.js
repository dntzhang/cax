import cax from '../cax/index'
const info = wx.getSystemInfoSync()
Page({
  onLoad: function (options) {

    renderLineChart([
      {
        date: '7.19',
        value: 0
      },
      {
        date: '7.20',
        value: 50
      }, {
        date: '7.21',
        value: 10
      }, {
        date: '7.22',
        value: 17
      }, {
        date: '7.23',
        value: 100
      }, {
        date: '7.24',
        value: 25
      }

    ], {
        padding: 0.1,
        height: 300,
        width: info.windowWidth,
        xInterval: info.windowWidth / 7
      }, this)
  }
})


function renderLineChart(data, option, component) {


  const stage = new cax.Stage(option.width, option.height, 'myCanvas', component)
  const pd = info.windowWidth * option.padding

  const gw = (info.windowWidth - pd * 2)


  let max = data.slice(0).sort((a, b) => {
    return b.value - a.value
  })[0].value
  max = max + max * 0.3
  const leftBottom = [pd, option.height - 30]
  const dh = Math.round(option.height / 3.5)

  const gird = new cax.Graphics()
  for (let i = 0; i < 3; i++) {
    gird.beginPath().strokeStyle('#C8C8C8').moveTo(leftBottom[0], leftBottom[1] - dh * i).lineTo(leftBottom[0] + gw, leftBottom[1] - dh * i).stroke()
  }




  for (let i = 0; i < 4; i++) {
    const t = new cax.Text(Math.round(max / 3 * i))
    t.x = leftBottom[0] - 10
    t.y = leftBottom[1] - i * dh - 6
    t.textAlign = 'right'
    stage.add(t)
  }

  stage.add(gird)


  data.forEach((item, index) => {
    item._x = leftBottom[0] + index * option.xInterval
    item._y = leftBottom[1] - item.value / max * 3 * dh
  })

  gird.beginPath().strokeStyle('#509863')
  data.forEach((item, index) => {

    gird[index === 0 ? 'moveTo' : 'lineTo'](item._x, item._y).stroke()

  })

  const fillG = new cax.Graphics()

  fillG.beginPath().fillStyle('#509863')
  data.forEach((item, index) => {
    fillG[index === 0 ? 'moveTo' : 'lineTo'](item._x, item._y)
  })

  fillG.lineTo(data[data.length - 1]._x, leftBottom[1])
  fillG.closePath().fill()
  fillG.alpha = 0.5
  stage.add(fillG)

  data.forEach((item) => {
    gird.beginPath().fillStyle('#509863').arc(item._x, item._y, 1.5, 0, Math.PI * 2).fill()
  })

  data.forEach((item, index) => {
    if(index>0){
      const t = new cax.Text(item.date)
      t.x = leftBottom[0] +option.xInterval*index
      t.y = leftBottom[1] 
      t.textAlign = 'center'
      stage.add(t)
    }
  })

//tooptip逻辑写在下面
  stage.on('touchstart',function(evt){
    console.log('touchstart')
  })

  stage.on('touchend',function(evt){
    console.log('touchend')
  })

  stage.on('touchmove',function(evt){
    console.log(evt)
    console.log('touchmove')
  })

  console.log(stage)
  cax.tick(() => {

    stage.update()
  })

}
