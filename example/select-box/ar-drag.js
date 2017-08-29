/**
 * Created by dntzhang on 2017/4/9.
 */

class Drag {

    constructor(target, option) {
        this.target = target
        this.isMouseDown = false
        this.preX = null
        this.preY = null
        const noop = function(){}
        this.move = option.move||noop
        this.over = option.over||noop
        this.out = option.out||noop
        this.down = option.down||noop
        this.up = option.up ||noop
        this.bindEvent()
    }

    bindEvent() {
        this._uh = this._upHandler.bind(this);
        this._mh = this._moveHandler.bind(this);
        let target = this.target

        target.addEventListener('mouseover', evt => {
            this.over(evt)
        })

        target.addEventListener('mouseout', evt => {
            this.out(evt)
        })

        target.addEventListener('mousedown', evt => {
            this.isMouseDown = true
            this.preX = evt.stageX
            this.preY = evt.stageY
            this.down(evt)
            document.addEventListener('mouseup', this._uh, false)
            document.addEventListener('mousemove',this._mh,false)
        })


    }
    _moveHandler(evt){
        if (this.isMouseDown) {
            this.move({
                dx: evt.stageX - this.preX,
                dy:evt.stageY - this.preY,
                pureEvent:evt,
                target: this.target
            })

            this.preX =  evt.stageX
            this.preY = evt.stageY
        }
    }

    _upHandler(evt) {
        this.isMouseDown = false
        this.up(evt)
        this.preX = null
        this.preY = null
        document.removeEventListener('mousemove', this._mh, false)
        document.removeEventListener('mouseup', this._uh, false)

    }
}

const drag = function(target, option) {
    if(Object.prototype.toString.call(target)!=="[object Array]"){
        target = [target]
    }

    target.forEach(item =>{
        if (!item._hasBindDrag) {
            item._hasBindDrag = true
            new Drag(item, option)
        }
    })

}

export default drag