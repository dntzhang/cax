import Shape from './shape'

class ArrowPath extends Shape {
  constructor (path) {
    super()

    this.path = path
  }

  draw () {
    const path = this.path
    this.beginPath()
    const len = path.length
    if (len === 2) {
      console.log(1)
      this.drawArrow(path[0].x, path[0].y, path[1].x, path[1].y, 30, 10, 4, 'black')
    } else {
      this.moveTo(path[0].x, path[0].y)
      for (let i = 1; i < len - 1; i++) {
        this.lineTo(path[i].x, path[i].y)
      }
      this.drawArrow(path[len - 2].x, path[len - 2].y, path[len - 1].x, path[len - 1].y, 30, 10, 4, 'black')
    }

    this.stroke()
  }

  drawArrow (fromX, fromY, toX, toY, theta, headlen, width, color) {
    theta = typeof theta !== 'undefined' ? theta : 30
    headlen = typeof theta !== 'undefined' ? headlen : 10
    width = typeof width !== 'undefined' ? width : 1
    color = color || '#000'

    // 计算各角度和对应的P2,P3坐标, - 0.00001防止为0箭头少一半
    var angle = Math.atan2(fromY - toY - 0.00001, fromX - toX) * 180 / Math.PI,
      angle1 = (angle + theta) * Math.PI / 180,
      angle2 = (angle - theta) * Math.PI / 180,
      topX = headlen * Math.cos(angle1),
      topY = headlen * Math.sin(angle1),
      botX = headlen * Math.cos(angle2),
      botY = headlen * Math.sin(angle2)

    var arrowX = fromX - topX,
      arrowY = fromY - topY

    this.moveTo(arrowX, arrowY)
    this.moveTo(fromX, fromY)
    this.lineTo(toX, toY)
    arrowX = toX + topX
    arrowY = toY + topY
    this.moveTo(arrowX, arrowY)
    this.lineTo(toX, toY)
    arrowX = toX + botX
    arrowY = toY + botY
    this.lineTo(arrowX, arrowY)
    this.strokeStyle = color
    this.lineWidth = width
  }
}

export default ArrowPath
