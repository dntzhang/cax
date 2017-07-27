import DisplayObject from './display_object.js'


class Bitmap extends DisplayObject {
    constructor(img, onLoad) {
        super();
        if(typeof img === 'string'){

            if( Bitmap.cache[img]){
                this.img = Bitmap.cache[img]
                this.rect = [0, 0, this.img.width, this.img.height]
                onLoad && onLoad.call(this)
                this.width = this.img.width
                this.height = this.img.height
            }else {
                this.img = new Image()
                this.visible = false
                this.img.onload = ()=> {
                    this.visible = true
                    this.rect = [0, 0, this.img.width, this.img.height]
                    this.width = this.img.width
                    this.height = this.img.height
                    onLoad && onLoad.call(this)
                    Bitmap.cache[img] = this.img

                }
                this.img.src = img

            }
        }else {
            this.img = img
            this.rect = [0, 0, img.width, img.height]
            this.width = img.width
            this.height = img.height
            Bitmap.cache[img.src] = img
        }
    }
}

Bitmap.cache = {

}

export default Bitmap