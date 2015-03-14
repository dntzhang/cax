define("ARE.Transform ", {
    statics: {
        mix: function (element) {
            new this(element);
        }
    },
    ctor: function (element) {
        element.perspective = 400;
        element.scaleX = element.scaleY = element.scaleZ = 1;
        element.x = element.y = element.z = element.rotateX = element.rotateY = element.rotateZ = element.regX = element.regY = element.skewX = element.skewY = element.regX = element.regY = element.regZ = 0;
        element.matrix3D = new Matrix3D();
        var observer = Observable.watch(element, ["x", "y", "z", "scaleX", "scaleY", "scaleZ", "perspective", "rotateX", "rotateY", "rotateZ", "regX", "regY", "regZ"]);

        this.element = element;
        var self = this;
        observer.propertyChangedHandler = function () {
            var mtx = self.element.matrix3D.identity().appendTransform(self.element.perspective, self.element.x, self.element.y, self.element.z, self.element.scaleX, self.element.scaleY, self.element.scaleZ, self.element.rotateX, self.element.rotateY, self.element.rotateZ, self.element.regX, self.element.regY, self.element.regZ);

            self.element.style.transform = self.element.style.msTransform = self.element.style.OTransform = self.element.style.MozTransform = self.element.style.webkitTransform = "matrix3d(" + Array.prototype.slice.call(mtx.elements).join(",") + ")";
        }
    }
})