import DisplayObject from './display_object.js'

class Container extends DisplayObject {
    constructor(data) {
        super(data)
        this.children = [];
    }

    add (child){

        this.children.push(child);
        child.parent = this;
    }


}

export default Container;