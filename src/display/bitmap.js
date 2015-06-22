
//begin-------------------ARE.Bitmap---------------------begin

ARE.Bitmap = ARE.DisplayObject.extend({
    "ctor": function(img) {
        this._super();
        if (arguments.length === 0) return;
        if (typeof img == "string") {
            this._initWithSrc(img);
        } else {
            this._init(img);
        }
    },
    "_initWithSrc": function(img) {
        var cacheImg = ARE.Bitmap[img];
        if (cacheImg) {
            this._init(cacheImg);
        } else {
            var self = this;
            this.textureReady = false;
            this.img = document.createElement("img");
            this.img.onload = function() {
                if (!self.rect) self.rect = [0, 0, self.img.width, self.img.height];
                self.width = self.rect[2];
                self.height = self.rect[3];
                self.regX = self.width * self.originX;
                self.regY = self.height * self.originY;
                ARE.Bitmap[img] = self.img;
                self.textureReady = true;
                self.imageLoadHandle && self.imageLoadHandle();
                if (self.filter) self.filter = self.filter;
            };
            this.img.src = img;
        }
    },
    "_init": function(img) {
        if (!img) return;
        this.img = img;
        this.width = img.width;
        this.height = img.height;
        Object.defineProperty(this, "rect", {
            get: function() {
                return this["__rect"];
            },
            set: function(value) {
                this["__rect"] = value;
                this.width = value[2];
                this.height = value[3];
                this.regX = value[2] * this.originX;
                this.regY = value[3] * this.originY;
            }
        });
        this.rect = [0, 0, img.width, img.height];
    },
    "useImage": function(img) {
        if (typeof img == "string") {
            this._initWithSrc(img);
        } else {
            this._init(img);
            this.imageLoadHandle && this.imageLoadHandle();
        }
    },
    "onImageLoad": function(fn) {
        this.imageLoadHandle = fn;
    },
    "clone": function() {
        var o = new ARE.Bitmap(this.img);
        o.rect = this.rect.slice(0);
        this.cloneProps(o);
        return o;
    },
    "flipX": function() {},
    "flipY": function() {}
});

//end-------------------ARE.Bitmap---------------------end
