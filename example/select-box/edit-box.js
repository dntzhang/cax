import { Graphics, Group, Circle, DisplayObject } from '../../src/index.js'
import drag from './ar-drag.js'

function getLen(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

function getAngle(v1, v2) {
    var mr = getLen(v1) * getLen(v2);
    if (mr === 0) return 0;
    var r = dot(v1, v2) / mr;
    if (r > 1) r = 1;
    return Math.acos(r);
}

function cross(v1, v2) {
    return v1.x * v2.y - v2.x * v1.y;
}

function getRotateAngle(v1, v2) {
    var angle = getAngle(v1, v2);
    if (cross(v1, v2) > 0) {
        angle *= -1;
    }

    return angle * 180 / Math.PI;
}

class EditBox extends Group {

    constructor(target) {
        super()
        this.target = target
        this.obj = target.clone()
        this._scaleX = this.obj.scaleX
        this._scaleY = this.obj.scaleY
        this.obj._matrix.appendTransform(target.x, target.y, target.scaleX, target.scaleY, target.rotation, target.skewX, target.skewY, target.originX, target.originY)
        this.obj.initAABB()
        this.rgs = []
        this.rects = this.obj.rectPoints
        this.render()


        this.rotationPoint = this.getRotationPoint(this.obj.rectPoints)
        let graphics = new Graphics()
        graphics.x = this.rotationPoint.x
        graphics.y = this.rotationPoint.y
        graphics.beginPath()
            .arc(0, 0, 5, 0, Math.PI * 2)
            .fillStyle('black')
            .fill()
            .strokeStyle("#046ab4")
            .lineWidth(3)
            .stroke()
        graphics.cursor = 'move'
        this.add(graphics)

        this.rGraphics = graphics

        this.centerX = (this.rects[0].x + this.rects[2].x) / 2
        this.centerY = (this.rects[0].y + this.rects[2].y) / 2


        drag(graphics, {
            move: (evt)=> {
                //evt.target.x += evt.dx
                //evt.target.y += evt.dy
                let angle = getRotateAngle({
                    x: evt.stageX - this.centerX,
                    y: evt.stageY - this.centerY
                }, {
                    x: this.preX - this.centerX,
                    y: this.preY - this.centerY
                })

                target.rotation = this._rotation + angle
                this.obj.rotation = target.rotation

              //  let n = this.n(evt.stageX - this.centerX, evt.stageY - this.centerY)
              //  graphics.x = this.centerX + n[0] * (target.width * target.scaleX / 2 + 40)
               // graphics.y = this.centerY + n[1] * (target.height * target.scaleY / 2 + 40)
                this.updateCtrl()

                this.updateRotationPoint(this.obj.rectPoints)

            },
            down: ()=> {
                this.preX = graphics.x
                this.preY = graphics.y
                this._rotation = target.rotation
            },
            up: (evt)=> {
                this.obj.initAABB()
                this.rects = this.obj.rectPoints
                this._scaleX = this.obj.scaleX
                this._scaleY = this.obj.scaleY

                this._rotation = target.rotation

            }
        })

        this.updateRotationPoint(this.rects)

    }

    n(x, y) {
        var sum = x * x + y * y
        if (sum === 0) return [0, 0]
        var len = Math.sqrt(sum)
        return [x / len, y / len]
    }

    getRotationPoint(rects) {
        let n = this.n( (rects[2].y - rects[1].y), (rects[1].x - rects[2].x))
        let x =(rects[1].x + rects[2].x) / 2 + n[0]*40
        let y =(rects[1].y + rects[2].y) / 2 + n[1]*40
        return {x: x, y: y}
    }

    updateRotationPoint(rects) {

        let p = this.getRotationPoint(rects)
        this.rGraphics.x = p.x
        this.rGraphics.y = p.y
    }



    render() {

        this.rects.forEach((rect, index)=> {
            let graphics = new Graphics()
            graphics.x = rect.x
            graphics.y = rect.y
            graphics.beginPath()
                .arc(0, 0, 5, 0, Math.PI * 2)
                .fillStyle('#f4862c')
                .fill()
                .strokeStyle("#046ab4")
                .lineWidth(3)
                .stroke()
            graphics.cursor = 'move'
            this.add(graphics)
            this.rgs.push(graphics)
            drag(graphics, {
                move: (evt)=> {
                    evt.target.x += evt.dx
                    evt.target.y += evt.dy

                    this.rects[index].x += evt.dx
                    this.rects[index].y += evt.dy
                    this.updateByDrag(index)


                    this.updateRotationPoint(this.obj.rectPoints)
                },
                down: ()=> {

                },
                up: ()=> {
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


        let _w = this.obj.width * this._scaleX / 2
        let _h = this.obj.height * this._scaleY / 2
        this.obj.scaleX = this._scaleX * (w - _w) / _w
        this.obj.scaleY = this._scaleY * (h - _h) / _h


        this.target.scaleX = this.obj.scaleX
        this.target.scaleY = this.obj.scaleY




        this.updateCtrl()

    }

    updateCtrl(){
        this.obj._matrix.identity().appendTransform(this.obj.x, this.obj.y, this.obj.scaleX, this.obj.scaleY, this.obj.rotation, this.obj.skewX, this.obj.skewY, this.obj.originX, this.obj.originY)
        this.obj.initAABB()
        this.rgs.forEach((child, _index) => {
            // if(_index !== index){

                child.x = this.obj.rectPoints[_index].x
                child.y = this.obj.rectPoints[_index].y

            //}
        })

    }


    pDistance(x, y, x1, y1, x2, y2) {

        let A = x - x1;
        let B = y - y1;
        let C = x2 - x1;
        let D = y2 - y1;

        let dot = A * C + B * D;
        let len_sq = C * C + D * D;
        let param = -1;
        if (len_sq != 0) //in case of 0 length line
            param = dot / len_sq;

        let xx, yy;

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

        let dx = x - xx;
        let dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

}

export default EditBox