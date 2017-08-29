import { Graphics, Group, Circle, DisplayObject } from '../../src/index.js'
import drag from './ar-drag.js'

class EditBox extends Group {

    constructor(target) {
        super()
        this.target = target
        this.obj = target.clone()
        this._scaleX = this.obj.scaleX
        this._scaleY = this.obj.scaleY
        this.obj._matrix.appendTransform(target.x, target.y, target.scaleX, target.scaleY, target.rotation, target.skewX, target.skewY, target.originX, target.originY)
        this.obj.initAABB()
        this.rects = this.obj.rectPoints
        this.render()
    }

    render() {
        this.rects.forEach((rect,index)=> {
            let graphics = new Graphics()
            graphics.x = rect.x
            graphics.y = rect.y
            graphics.beginPath()
                .arc(0,0, 20, 0, Math.PI * 2)
                .fillStyle('#f4862c')
                .fill()
                .strokeStyle("#046ab4")
                .lineWidth(6)
                .stroke()
            graphics.cursor = 'move'
            this.add(graphics)

            drag(graphics, {
                move: (evt)=> {
                    evt.target.x += evt.dx
                    evt.target.y += evt.dy

                    // console.log(index)
                    this.rects[index].x += evt.dx
                    this.rects[index].y += evt.dy
                    this.updateByDrag(index)
                },
                down: ()=> {

                },
                up: (evt)=> {
                    this.obj.initAABB()
                    this.rects = this.obj.rectPoints
                    this._scaleX = this.obj.scaleX
                    this._scaleY = this.obj.scaleY

                }
            })
        })
    }

    updateByDrag(index) {
        let a = 1,
            b = 2,
            c = 2,
            d = 3,
            e = 2

        switch (index) {
            case 1:
                a = 0
                b = 3
                c = 2
                d = 3
                e = 3
                break
            case 2:
                a = 0
                b = 3
                c = 0
                d = 1
                e = 0
                break
            case 3:
                a = 1
                b = 2
                c = 0
                d = 1
                e = 1
                break
        }

        let w = this.pDistance(this.rects[index].x, this.rects[index].y, this.rects[a].x, this.rects[a].y, this.rects[b].x, this.rects[b].y)
        let h = this.pDistance(this.rects[index].x, this.rects[index].y, this.rects[c].x, this.rects[c].y, this.rects[d].x, this.rects[d].y)


        let _w = this.obj.width*this._scaleX/2
        let _h = this.obj.height*this._scaleY/2
        this.obj.scaleX =this._scaleX* (w-_w) / _w
        this.obj.scaleY =this._scaleY* (h-_h) / _h


        this.target.scaleX = this.obj.scaleX
        this.target.scaleY = this.obj.scaleY
        this.obj._matrix.identity().appendTransform(this.obj.x, this.obj.y, this.obj.scaleX, this.obj.scaleY, this.obj.rotation, this.obj.skewX, this.obj.skewY, this.obj.originX, this.obj.originY)
        this.obj.initAABB()


        this.children.forEach((child,_index) => {
           // if(_index !== index){
                child.x =this.obj.rectPoints[_index].x
                child.y = this.obj.rectPoints[_index].y
            //}
        })

    }


    pDistance(x, y, x1, y1, x2, y2) {

        var A = x - x1;
        var B = y - y1;
        var C = x2 - x1;
        var D = y2 - y1;

        var dot = A * C + B * D;
        var len_sq = C * C + D * D;
        var param = -1;
        if (len_sq != 0) //in case of 0 length line
            param = dot / len_sq;

        var xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        }
        else if (param > 1) {
            xx = x2;
            yy = y2;
        }
        else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        var dx = x - xx;
        var dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

}

export default EditBox