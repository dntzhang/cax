import DisplayObject from './display_object.js'

class Bitmap extends DisplayObject {
    constructor(img) {
        super();
        this.img = img
        this.rect = [0, 0, img.width, img.height]
    }
}


export default Bitmap