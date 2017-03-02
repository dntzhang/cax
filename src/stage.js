import Container from './container.js'
import CanvasRender from './canvas_render.js'
import HitRender from './hit_render.js'

class Stage extends Container  {
    constructor(width,height,renderTo){
        super();
        this.renderTo = typeof renderTo === 'string' ? document.querySelector(renderTo) : renderTo
        this.canvas = document.createElement('canvas')
        this.canvas.width = width
        this.canvas.height = height
        this.renderTo.appendChild(this.canvas)
        this.renderer = new CanvasRender(this.canvas)

        this.canvas.addEventListener('click', (evt)=>{
            this._handleClick(evt);
        });

        this.borderTopWidth = 0;
        this.borderLeftWidth = 0;

        this.hitAABB = false
        this._hitRender = new HitRender()
    }

    _handleClick(evt){
        var rect = this.canvas.getBoundingClientRect()
        evt.stageX  = evt.clientX - rect.left - this.borderLeftWidth
        evt.stageY = evt.clientY - rect.top - this.borderTopWidth
        this._getObjectUnderPoint(evt)
    }

    _getObjectUnderPoint (evt) {
        if (this.hitAABB) {
            return this._hitRender.hitAABB(this, evt)
        } else {
            return this._hitRender.hitPixel(this, evt)
        }
    }

    update(){
        this.renderer.clear()
        this.children.forEach( child => {
            this.renderer.render(child)
        })
    }
}

export default Stage;