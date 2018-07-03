import Group from '../group'
import Text from '../text'
import RoundedRect from '../shape/rounded-rect'

class Button extends Group {
  constructor (option) {
    super()
    this.width = option.width
    this.roundedRect = new RoundedRect(option.width, option.height, option.borderRadius, {
      strokeStyle: option.borderColor || 'black',
      fillStyle: option.backgroundColor || '#F5F5F5',
    })
    this.text = new Text(option.text, {
      font: option.font,
      color: option.color
    })

    this.text.x = option.width / 2 - this.text.getWidth() / 2 * this.text.scaleX + (option.textX || 0)
    this.text.y = option.height / 2 - 10 + 5 * this.text.scaleY + (option.textY  || 0)
    this.add(this.roundedRect, this.text)
  }
}

export default Button
