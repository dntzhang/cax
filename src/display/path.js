import DisplayObject from './display_object.js'

class Path extends DisplayObject{
    constructor(d , option){
        super()
        this.type = 'path'
        this.d = d
        this.fill = 'black';
        this.stroke = 'black';
        this.strokeWidth = 1

        option&&Object.keys(option).forEach((key)=>{
            this[key] = option[key]
        })

       // this.element.setAttribute('d', d)
    }



}

export default Path