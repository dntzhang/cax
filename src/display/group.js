import DisplayObject from './display_object.js'

class Group extends DisplayObject {
    constructor(data) {
        super(data)
        this.children = [];
    }

    add(child) {

        const len = arguments.length

        for (let i = 0;i<len;i++){

            this.children.push(arguments[i]);
            arguments[i].parent = this;
        }
    }



}


export default Group;
