import DisplayObject from './display_object.js'

class Group extends DisplayObject {
    constructor(data) {
        super(data)
        this.children = [];
    }

    add(child) {

        const len = arguments.length

        for (let i = 0; i < len; i++) {

            this.children.push(arguments[i]);
            arguments[i].parent = this;
        }
    }

    remove(child) {
        const len = arguments.length
        let cLen = this.children.length

        for (let i = 0; i < len; i++) {

            for (let j = 0; j < cLen; j++) {

                if (child.id == this.children[j].id) {
                    child.parent = null
                    this.children.splice(j, 1)
                    j--
                    cLen--
                }
            }

        }
    }
}


export default Group;
