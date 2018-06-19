import parse from '../../base/path-parser.js'
import Shape from './shape'

class Path extends Shape {
  constructor (d, option) {
    super()
    this.type = 'path'
    this.d = d
    this.fillColor = 'black'
    this.strokeColor = 'white'
    this.strokeWidth = 1

    option && Object.keys(option).forEach((key) => {
      this[key] = option[key]
    })
  }

  draw () {
    const cmds = parse(this.d)
    this.lineWidth(this.strokeWidth)
    this.strokeStyle(this.strokeColor)
    this.fillStyle(this.fillColor)
    this.beginPath()
    // https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths
    // M = moveto
    // L = lineto
    // H = horizontal lineto
    // V = vertical lineto
    // C = curveto
    // S = smooth curveto
    // Q = quadratic Belzier curve
    // T = smooth quadratic Belzier curveto
    // A = elliptical Arc  暂时未实现，用贝塞尔拟合椭圆
    // Z = closepath
    // 以上所有命令均允许小写字母。大写表示绝对定位，小写表示相对定位(从上一个点开始)。
    let preX,
      preY

    // 缺少t T 和 a A,以后可以参考我写的 pasition https://github.com/AlloyTeam/pasition/blob/master/src/index.js
    for (let j = 0, cmdLen = cmds.length; j < cmdLen; j++) {
      let item = cmds[j]
      let action = item[0]
      let preItem = cmds[j - 1]

      switch (action) {
        case 'M':
          preX = item[1]
          preY = item[2]
          this.moveTo(preX, preY)
          break
        case 'L':
          preX = item[1]
          preY = item[2]
          this.lineTo(preX, preY)
          break
        case 'H':
          preX = item[1]
          this.lineTo(preX, preY)
          break
        case 'V':
          preY = item[1]
          this.lineTo(preX, preY)
          break
        case 'C':
          preX = item[5]
          preY = item[6]
          this.bezierCurveTo(item[1], item[2], item[3], item[4], preX, preY)
          break
        case 'S':

          if (preItem[0] === 'C' || preItem[0] === 'c') {
            this.bezierCurveTo(preX, preY, preX + preItem[5] - preItem[3], preY + preItem[6] - preItem[4], item[1], item[2], item[3], item[4])
          } else if (preItem[0] === 'S' || preItem[0] === 's') {
            this.bezierCurveTo(preX, preY, preX + preItem[3] - preItem[1], preY + preItem[4] - preItem[2], item[1], item[2], item[3], item[4])
          }
          preX = item[3]
          preY = item[4]
          break

        case 'Q':
          preX = item[3]
          preY = item[4]
          this.quadraticCurveTo(item[1], item[2], preX, preY)
          break

        case 'm':
          preX += item[1]
          preY += item[2]
          this.moveTo(preX, preY)
          break
        case 'l':
          preX += item[1]
          preY += item[2]
          this.lineTo(preX, preY)
          break
        case 'h':
          preX += item[1]
          this.lineTo(preX, preY)
          break
        case 'v':
          preY += item[1]
          this.lineTo(preX, preY)
          break
        case 'c':
          this.bezierCurveTo(preX + item[1], preY + item[2], preX + item[3], preY + item[4], preX + item[5], preY + item[6])
          preX = preX + item[5]
          preY = preY + item[6]
          break
        case 's':
          if (preItem[0] === 'C' || preItem[0] === 'c') {
            this.bezierCurveTo(preX, preY, preX + preItem[5] - preItem[3], preY + preItem[6] - preItem[4], preX + item[1], preY + item[2], preX + item[3], preY + item[4])
          } else if (preItem[0] === 'S' || preItem[0] === 's') {
            this.bezierCurveTo(preX, preY, preX + preItem[3] - preItem[1], preY + preItem[4] - preItem[2], preX + item[1], preY + item[2], preX + item[3], preY + item[4])
          }

          preX += item[3]
          preY += item[4]
          break
        case 'q':

          this.quadraticCurveTo(preX + item[1], preY + item[2], item[3] + preX, item[4] + preY)
          preX += item[3]
          preY += item[4]
          break
        // case 't':

        //   this.quadraticCurveTo(preX + preX + preX - preItem[1], preY + preY + preY - preItem[2], preX + item[1], preY + item[2])
        //   preX += item[1]
        //   preY += item[2]
        //   break
        // case 'T':
        //   this.quadraticCurveTo(preX + preX - preItem[1], preY + preY - preItem[2], item[1], item[2])
        //   preX = item[1]
        //   preY = item[2]
        //   break
        case 'Z':
          this.closePath()
          break
      }
    }

    this.fill()
    this.stroke()
  }
}

export default Path
