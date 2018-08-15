import cax from '../cax/index'

class Tooltip extends cax.Group{
    constructor(date, money){
        super()
        this.box = new cax.Graphics()
        this.box.beginPath().fillStyle('#808080').fillRect(0,0,120,50).fill()


        this.point = new cax.Graphics()
        this.point.x = 10
        this.point.y = 35
        this.point.beginPath().fillStyle('#509863').arc(0,0,5,0,Math.PI*2).fill()
        this.add(this.box,this.point)


        this.date = new cax.Text(date,{
            color: 'white'
        })

        this.date.x = 20
        this.date.y = 12
       
        this.money = new cax.Text('收入: ￥'+money,{
            color: 'white'
        })

        this.money.x = 20
        this.money.y = 27
        this.add(this.date,this.money)

    }

    update(date, money){
        this.date.text = date
        this.money.text ='收入: ￥'+ money
    }
}

export default Tooltip