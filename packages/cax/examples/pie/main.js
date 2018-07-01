import cax from '../../src/index.js'
const { Stage, util, Graphics, To, Group, Text } = cax

const stage = new Stage(640, 400, 'body')


const defaultOption = {
    totalAngle: 0,
    begin: Math.random() * Math.PI * 2
}

function drawPie(data, option) {

    const tooltip = document.createElement('div')
    document.body.appendChild(tooltip)
    tooltip.style.position = 'absolute'
    tooltip.style.width = 'auto'
    tooltip.style.maxWidth = '400px'
    tooltip.style.height = 'auto'
    tooltip.style.padding = '4px 8px'
    tooltip.style.display = 'none'
    tooltip.style.minWidth = '100px'
    tooltip.style.pointerEvents = 'none'
    tooltip.style.transition = 'all .6s'
    tooltip.style.backgroundColor = 'rgba(0,0,0,.5)'
    tooltip.style.color = 'white'
    tooltip.style.textAlign = 'center'

    const { x, y, r } = option

    const textGroup = new Group()
    option = Object.assign({}, defaultOption, option)
    let totalValue = 0
    data.forEach((item) => {
        totalValue += item.value
    })

    let current = option.begin

    const sectors = []
    data.forEach((item, index) => {
        const sector = new Graphics()
        sector.value = item.value
        sector
            .beginPath()
            .moveTo(0, 0)
            .arc(0, 0, r, current, current += option.totalAngle * item / totalValue)
            .closePath()
            .fillStyle(option.color(index))
            .fill()
            .strokeStyle(option.boxColor)
            .lineWidth(2)
            .stroke()
        sector.x = x
        sector.y = y
        sectors.push(sector)
        stage.add(sector)


        if (option.tooltip) {
            sector.hover(function (evt) {
                bounceIn(sector, 1, 1.1)
                tooltip.style.left = (evt.pureEvent.pageX + 5) + 'px'
                tooltip.style.top = (evt.pureEvent.pageY + 5) + 'px'
                tooltip.innerHTML = option.tooltip(data[index])
                tooltip.style.display = 'block'

            }, function (evt) {
                bounceOut(sector, 1.1, 1)
                tooltip.style.display = 'none'

            }, function (evt) {
                tooltip.style.left = (evt.pureEvent.pageX + 5) + 'px'
                tooltip.style.top = (evt.pureEvent.pageY + 5) + 'px'
            })
        }
    })


    To.get(option)
        .to({ totalAngle: Math.PI * 2 }, option.duration, option.easing)
        .progress((object) => {

            current = option.begin
            sectors.forEach((item, index) => {
                item
                    .clear()
                    .beginPath()
                    .moveTo(0, 0)
                    .arc(0, 0, r, current, current += object.totalAngle * item.value / totalValue)
                    .closePath()
                    .fillStyle(option.color(index))
                    .fill()
                    .strokeStyle(option.boxColor)
                    .lineWidth(2)
                    .stroke()
                    .closePath()
            })
        })
        .end((object) => {
            current = option.begin
            let arr = []
            sectors.forEach((item, index) => {
                let center = current + object.totalAngle * item.value / totalValue / 2
                current += object.totalAngle * item.value / totalValue
                arr.push(center)
            })
            textGroup.alpha = 0
            arr.forEach((angle, index) => {
                angle %= Math.PI * 2
                let centerX = x + r * Math.cos(angle)
                let centerY = y + r * Math.sin(angle)

                const currentColor = option.textColor(index)
                const label = option.label(data[index])
                const text = new Text(label, { color: currentColor, font: option.font })

                const g = new Graphics()

                if (angle >= 0 && angle < Math.PI / 2) {
                    g.beginPath().moveTo(centerX, centerY)
                        .lineTo(centerX + 20 * 0.7, centerY + 20 * 0.5)
                        .lineTo(centerX + 20 * 0.7 + 20, centerY + 20 * 0.5)
                        .strokeStyle(currentColor)
                        .stroke()

                    text.x = centerX + 20 * 0.7 + 20 + 3
                    text.y = centerY + 20 * 0.5 + option.textOffsetY
                } else if (angle >= Math.PI / 2 && angle < Math.PI) {
                    g.beginPath().moveTo(centerX, centerY)
                        .lineTo(centerX - 20 * 0.7, centerY + 20 * 0.5)
                        .lineTo(centerX - 20 * 0.7 - 20, centerY + 20 * 0.5)
                        .strokeStyle(currentColor)
                        .stroke()

                    text.x = centerX - 20 * 0.7 - 20 - text.getWidth() - 3
                    text.y = centerY + 20 * 0.5 + option.textOffsetY
                } else if (angle >= Math.PI && angle < Math.PI + Math.PI / 2) {
                    g.beginPath().moveTo(centerX, centerY)
                        .lineTo(centerX - 20 * 0.7, centerY - 20 * 0.5)
                        .lineTo(centerX - 20 * 0.7 - 20, centerY - 20 * 0.5)
                        .strokeStyle(currentColor)
                        .stroke()

                    text.x = centerX - 20 * 0.7 - 20 - text.getWidth() - 3
                    text.y = centerY - 20 * 0.5 + option.textOffsetY
                } else if (angle >= Math.PI + Math.PI / 2 && angle <= Math.PI * 2) {
                    g.beginPath().moveTo(centerX, centerY)
                        .lineTo(centerX + 20 * 0.7, centerY - 20 * 0.5)
                        .lineTo(centerX + 20 * 0.7 + 20, centerY - 20 * 0.5)
                        .strokeStyle(currentColor)
                        .stroke()

                    text.x = centerX + 20 * 0.7 + 20 + 3
                    text.y = centerY - 20 * 0.5 + option.textOffsetY
                }

                textGroup.add(g, text)
            })

            fadeIn(textGroup)
        })
        .start()

    stage.add(textGroup)
    return { begin: option.begin, total: totalValue }
}

function fadeIn(obj) {
    obj.alpha = 0
    To.get(obj).to({ alpha: 1 }, 600).start()
}

function bounceIn(obj, from, to) {
    from = from || 0
    obj.from = from
    To.get(obj).to({ scaleX: to || 1, scaleY: to || 1 }, 300, cax.easing.bounceOut).start()
}

function bounceOut(obj, from, to) {
    from = from || 1
    obj.from = from
    To.get(obj).to({ scaleX: to || 0, scaleY: to || 0 }, 300, cax.easing.bounceOut).start()
}


drawPie([
    { name: 'WeChat', value: util.randomInt(10, 30) },
    { name: 'Canvas', value: util.randomInt(10, 30) },
    { name: 'Cax', value: util.randomInt(10, 30) },
    { name: 'Tencent', value: util.randomInt(10, 30) },
    { name: 'Wepay', value: util.randomInt(10, 30) }
], {
        x: stage.width / 2,
        y: stage.height / 2,
        r: 160,
        color: (index) => {
            return ['#4BC0C0', '#FF6485', '#FFA07A', '#ADACB9', '#A37AC1'][index]
        },
        boxColor: 'white',
        duration: 1000,
        label: (item) => {
            return item.name
        },
        easing: cax.easing.bounceOut,
        textOffsetY: -12,
        font: '20px Arial',
        tooltip: (item) => {
            return item.name + '<br/>' + item.value
        },
        textColor: (index) => {
            return ['#4BC0C0', '#FF6485', '#FFA07A', '#ADACB9', '#A37AC1'][index]
        }
    }
)


if(window.innerWidth <= 500){
    stage.scaleEventPoint(0.5, 0.5)
}

cax.setInterval(() => {
    stage.update()
}, 16)