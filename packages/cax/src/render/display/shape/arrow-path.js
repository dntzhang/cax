import Shape from './shape'

class ArrowPath extends Shape {
  constructor (path, option) {
    super()

    this.path = path
    this.option = Object.assign({
      strokeStyle: 'black',
      lineWidth: 1
    }, option)
  }

  draw () {
    const path = this.path
    this.beginPath()
    const len = path.length
    if (len === 2) {
      this.drawArrow(path[0].x, path[0].y, path[1].x, path[1].y, 30, 10)
    } else {
      this.moveTo(path[0].x, path[0].y)
      for (let i = 1; i < len - 1; i++) {
        this.lineTo(path[i].x, path[i].y)
      }
      this.drawArrow(path[len - 2].x, path[len - 2].y, path[len - 1].x, path[len - 1].y, 30, 10)
    }

    this.stroke()
  }

  drawArrow (fromX, fromY, toX, toY, theta, headlen) {

    let angle = Math.atan2(fromY - toY , fromX - toX) * 180 / Math.PI,
      angle1 = (angle + theta) * Math.PI / 180,
      angle2 = (angle - theta) * Math.PI / 180,
      topX = headlen * Math.cos(angle1),
      topY = headlen * Math.sin(angle1),
      botX = headlen * Math.cos(angle2),
      botY = headlen * Math.sin(angle2)

    let arrowX = fromX - topX,
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
    this.strokeStyle(this.option.strokeStyle)
    this.lineWidth(this.option.lineWidth) 
  }
}

export default ArrowPath
