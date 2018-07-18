import Group from '../group'
import Text from '../text'
import RoundedRect from '../shape/rounded-rect'

class Button extends Group {
  constructor(option) {
    super()
    this.width = option.width

    let textHeight = 0
    this.text = new Text(option.text, {
      font: option.font,
      color: option.color
    })
    const textWidth = this.text.getWidth()
    const textGroup = new Group()

    if (textWidth > option.width) {
      const step = Math.round(option.text.length * (option.width) / textWidth / 2)

      const textList = this.stringSplit(option.text, step)
      const lineHeight = option.lineHeight || 12
      textHeight = textList.length * lineHeight + 6

      textList.forEach((text, index) => {
        this.text = new Text(text, {
          font: option.font,
          color: option.color
        })

        this.text.x = option.width / 2 - this.text.getWidth() / 2 * this.text.scaleX + (option.textX || 0)
        this.text.y = Math.max(textHeight, option.height) / 2 - 10 + 5 * this.text.scaleY + (option.textY || 0) + index * 12 - textHeight / 2 + lineHeight / 2
        textGroup.add(this.text)
      })
    } else {


      this.text.x = option.width / 2 - this.text.getWidth() / 2 * this.text.scaleX + (option.textX || 0)
      this.text.y = option.height / 2 - 10 + 5 * this.text.scaleY + (option.textY || 0)
      textGroup.add(this.text)
    }


    this.roundedRect = new RoundedRect(option.width, option.autoHeight ? Math.max(textHeight, option.height) : option.height, option.borderRadius, {
      strokeStyle: option.borderColor || 'black',
      fillStyle: option.backgroundColor || '#F5F5F5',
    })

    this.add(this.roundedRect)
    this.add(textGroup)
  }

  stringSplit(str, len) {
    let arr = [],
      offset = 0,
      char_length = 0
    for (let i = 0; i < str.length; i++) {
      let son_str = str.charAt(i)
      encodeURI(son_str).length > 2 ? char_length += 1 : char_length += 0.5
      if (char_length >= len || (char_length < len && i === str.length - 1)) {
        let sub_len = char_length == len ? i + 1 : i
        arr.push(str.substr(offset, sub_len - offset + ((char_length < len && i === str.length - 1) ? 1 : 0)))
        offset = i + 1
        char_length = 0
      }
    }
    return arr
  }
}

export default Button
