// import { Graphics, Group, Circle, DisplayObject } from '../../src/index.js'
const {Group,Stage,Bitmap,Sprite,Graphics} = AlloyRender
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
        this.cb = null;
        this.target = target
        this.obj = target.clone()
        this._scaleX = this.obj.scaleX
        this._scaleY = this.obj.scaleY
        this.obj._matrix.appendTransform(target.x, target.y, target.scaleX, target.scaleY, target.rotation, target.skewX, target.skewY, target.originX, target.originY)
        this.obj.initAABB()
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

                let rotation = this._rotation + angle
                this.obj.rotation = rotation
                this.callback();

                // let n = this.n(evt.stageX - this.centerX, evt.stageY - this.centerY)
                // graphics.x = this.centerX + n[0] * (target.width * target.scaleX / 2 + 40)
                // graphics.y = this.centerY + n[1] * (target.height * target.scaleY / 2 + 40)

                this.updateCtrl()
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

        this.handleTranslate();
    }

    n(x, y) {
        var sum = x * x + y * y
        if (sum === 0) return [0, 0]
        var len = Math.sqrt(sum)
        return [x / len, y / len]
    }

    getRotationPoint(rects) {
        this.centerX = (rects[0].x + rects[2].x) / 2;
        this.centerY = (rects[0].y + rects[2].y) / 2;

        let vec = [rects[1].x - rects[0].x,
                   rects[1].y - rects[0].y];

        let scale = 0.6;

        let x = this.centerX + vec[0] * scale;
        let y = this.centerY + vec[1] * scale;
        return {x: x, y: y}
    }

    updateRotationPoint(rects) {
        let p = this.getRotationPoint(rects)
        this.rGraphics.x = p.x
        this.rGraphics.y = p.y
    }

    remove() {

        let evt = ["mousedown", "mouseover", "mouseout"];

        evt.forEach(e => {
            if(this.target._listeners[e] != void 0) {
                let listeners = this.target.drag.listener[e];
                listeners.forEach(listener => {
                    this.target.removeEventListener(e, listener, false);
                    this.target.removeEventListener(e, listener, true);
                })
            }
        })

        this.target._hasBindDrag = false;
        console.log(this.target)
    }

    handleTranslate() {
        this.isTargetDown = false;
        let lastStageX = 0, lastStageY = 0;
        let lastObjX, lastObjY;
        this.target.cursor = 'move'
        drag(this.target, {
            move: evt => {
                if(this.isTargetDown) {
                    let xMove = evt.stageX - lastStageX,
                        yMove = evt.stageY - lastStageY;

                    this.obj.x = lastObjX + xMove;
                    this.obj.y = lastObjY + yMove;

                    this.updateCtrl();
                    this.callback();
                }
            },

            down: evt => {
                this.isTargetDown = true;
                lastStageX = evt.stageX;
                lastStageY = evt.stageY;
                lastObjX = this.obj.x;
                lastObjY = this.obj.y;
            },

            up: () => {
                this.isTargetDown = false;
            }
        })
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

        this.callback();

        this.updateCtrl()

    }

    callback() {
        let state = {};
        state.scaleX = this.obj.scaleX;
        state.scaleY = this.obj.scaleY;
        state.originX = this.obj.originX;
        state.originY = this.obj.originY;
        state.x      = this.obj.x;
        state.y      = this.obj.y;
        state.rotation = this.obj.rotation;
        this.cb(state);
    }

    updateRPoint() {
        let pos = this.getRotationPoint(this.obj.rectPoints);
        this.rGraphics.x = pos.x;
        this.rGraphics.y = pos.y;
    }

    updateCtrl(){
        this.obj._matrix.identity().appendTransform(this.obj.x, this.obj.y, this.obj.scaleX, this.obj.scaleY, this.obj.rotation, this.obj.skewX, this.obj.skewY, this.obj.originX, this.obj.originY)
        this.obj.initAABB()
        this.children.forEach((child, _index) => {
            // if(_index !== index){
            if (_index < 4) {
                child.x = this.obj.rectPoints[_index].x
                child.y = this.obj.rectPoints[_index].y
            }
            //}
        })

        this.updateRPoint()
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


    onChange(cb) {
        this.cb = cb;
    }

}

export default EditBox
