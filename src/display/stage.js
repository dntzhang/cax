import Group from './group.js'
import CanvasRender from '../render/canvas_render.js'
import HitRender from '../render/hit_render.js'
import Event from '../base/event.js'
import SVGRender from '../render/svg_render.js'

class Stage extends Group  {
    constructor(width,height,renderTo,mode){
        super();
        this.renderTo = typeof renderTo === 'string' ? document.querySelector(renderTo) : renderTo
        mode = mode ? mode:  AlloyRender.RenderMode.Canvas

        if(mode === AlloyRender.RenderMode.Canvas) {
            this.canvas = document.createElement('canvas')
            this.canvas.width = width
            this.canvas.height = height
            this.renderTo.appendChild(this.canvas)
            this.renderer = new CanvasRender(this.canvas)

            this.canvas.addEventListener('click', evt => this._handleClick(evt))

            this.canvas.addEventListener("mousemove", evt => this._handleMouseMove(evt))

            this.canvas.addEventListener("mousedown", evt => this._handleMouseDown(evt))

            this.canvas.addEventListener("mouseup", evt => this._handleMouseUp(evt))

            this.canvas.addEventListener("mouseout", evt => this._handleMouseOut(evt))
            //this.canvas.addEventListener("click", this._handleClick.bind(this), false);

            //this.canvas.addEventListener("dblclick", this._handleDblClick.bind(this), false);
            //this.addEvent(this.canvas, "mousewheel", this._handleMouseWheel.bind(this));
            //this.canvas.addEventListener("touchmove", this._handleMouseMove.bind(this), false);
            //this.canvas.addEventListener("touchstart", this._handleMouseDown.bind(this), false);
            //this.canvas.addEventListener("touchend", this._handleMouseUp.bind(this), false);
            //this.canvas.addEventListener("touchcancel", this._handleTouchCancel.bind(this), false);

            this.borderTopWidth = 0
            this.borderLeftWidth = 0

            this.hitAABB = false
            this._hitRender = new HitRender()
            //get rect again when trigger onscroll onresize event!?
            this._boundingClientRect = this.canvas.getBoundingClientRect()
            this._overObject = null
        }else if(mode === AlloyRender.RenderMode.SVG){
            this._initSVGMode(width,height)
        }
    }

    _initSVGMode(width,height){


        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        //debug  'style', 'border: 1px solid black;
        this.svg.setAttribute('style', 'border: 1px solid black;overflow: hidden;');

        this.svg.setAttribute('width', width);
        this.svg.setAttribute('height', height);
        this.svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        this.renderTo.appendChild(this.svg);
        this.renderer = new SVGRender(this.svg);
    }

    _handleClick(evt){
        //this._computeStageXY(evt)
        let obj = this._getObjectUnderPoint(evt)

    }

    _handleMouseDown(evt){
        let obj = this._getObjectUnderPoint(evt)
    }

    _handleMouseUp(evt){
        let obj = this._getObjectUnderPoint(evt)
    }

    _handleMouseOut(evt) {
        this._computeStageXY(evt)
        this.dispatchEvent({
            pureEvent: evt,
            type: 'mouseout',
            stageX: evt.stageX,
            stageY: evt.stageY,
            pureEvent: evt
        })

        //this._overObject&& this._overObject.dispatchEvent({
        //    pureEvent: evt,
        //        type: 'mouseout',
        //        stageX: evt.stageX,
        //        stageY: evt.stageY,
        //        pureEvent: evt
        //})

    }

    _handleMouseMove(evt) {

        let obj = this._getObjectUnderPoint(evt)
        let mockEvt = new Event()
        mockEvt.stageX = evt.stageX
        mockEvt.stageY = evt.stageY
        mockEvt.pureEvent = evt

        if (obj) {
            if (this._overObject === null) {
                mockEvt.type = 'mouseover'
                obj.dispatchEvent(mockEvt)
                this._overObject = obj
                this._setCursor(obj.cursor);
            } else {
                if (obj.id !== this._overObject.id) {
                    mockEvt.type = 'mouseover'
                    obj.dispatchEvent(mockEvt)
                    this._setCursor(obj.cursor)
                    this._overObject.dispatchEvent({
                        pureEvent: evt,
                        type: 'mouseout',
                        stageX: evt.stageX,
                        stageY: evt.stageY,
                        pureEvent: evt
                    })
                    this._overObject = obj
                } else {
                    mockEvt.type = 'mousemove'
                    obj.dispatchEvent(mockEvt)
                }
            }
        } else if (this._overObject) {

            mockEvt.type = 'mouseout'
            this._overObject.dispatchEvent(mockEvt)
            this._overObject = null
            this._setCursor(this.cursor)
        }
    }

    _setCursor(cursor){
        this.canvas.style.cursor = cursor;
    }

    _getObjectUnderPoint (evt) {
        this._computeStageXY(evt)
        if (this.hitAABB) {
            return this._hitRender.hitAABB(this, evt)
        } else {
            return this._hitRender.hitPixel(this, evt)
        }
    }

    _computeStageXY(evt){
        this._boundingClientRect = this.canvas.getBoundingClientRect()
        evt.stageX  = evt.clientX - this._boundingClientRect.left - this.borderLeftWidth
        evt.stageY = evt.clientY - this._boundingClientRect.top - this.borderTopWidth
    }

    update(){
        this.renderer.clear()
        this.children.forEach( child => {
            this.renderer.render(child)
        })
    }
}

export default Stage;