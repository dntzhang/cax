import Container from './container.js'
import CanvasRender from './canvas_render.js'

class Stage extends Container  {
    constructor(width,height,renderTo){
        super();
        this.renderTo = typeof renderTo === "string" ? document.querySelector(renderTo) : renderTo
        this.canvas = document.createElement('canvas')
        this.canvas.width = width
        this.canvas.height = height
        this.renderTo.appendChild(this.canvas)
        this.renderer = new CanvasRender(this.canvas)
    }

    update(){
        this.renderer.clear()
        this.children.forEach( child => {
            this.renderer.render(child)
        })

    }


}

export default Stage;