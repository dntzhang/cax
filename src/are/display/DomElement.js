/**
 * Dom元素
 * @class DomElement
 * @constructor
 * @param {selector} selector
 */
define("ARE.DomElement", {
    ctor: function (selector) {

        this.element = typeof selector == 'string' ? document.querySelector(selector) : selector;
        var element = this.element;
        element.perspective = 400;
        element.scaleX = element.scaleY = element.scaleZ = 1;
        element.x = element.y = element.z = element.rotateX = element.rotateY = element.rotateZ = element.regX = element.regY = element.skewX = element.skewY = element.regX = element.regY = element.regZ = 0;
        element.matrix3D = new Matrix3D();
      
        this.perspective = 400;
        this.scaleX = this.scaleY = this.scaleZ = 1;
        this.x = this.y = this.z = this.rotateX = this.rotateY = this.rotateZ = this.regX = this.regY = this.skewX = this.skewY = this.regX = this.regY = this.regZ = 0;

        var observer = Observable.watch(this, ["x", "y", "z", "scaleX", "scaleY", "scaleZ", "perspective", "rotateX", "rotateY", "rotateZ", "regX", "regY", "regZ"]);

        var self = this;
      
        observer.propertyChangedHandler = function () {
           
            var mtx = self.element.matrix3D.identity().appendTransform(self.perspective, self.x, self.y, self.z, self.scaleX, self.scaleY, self.scaleZ, self.rotateX, self.rotateY, self.rotateZ, self.regX, self.regY, self.regZ);

            self.element.style.transform = self.element.style.msTransform = self.element.style.OTransform = self.element.style.MozTransform = self.element.style.webkitTransform = "matrix3d(" + Array.prototype.slice.call(mtx.elements).join(",") + ")";
        }

        Object.defineProperty(this, "visible", {
            set: function (value) {
                this._visible = value;
                if (this._visible) {
                    this.element.style.display = "block";
                } else {
                    this.element.style.display = "none";
                }
            },
            get: function () {
                return this._visible;
            }
        });

        Object.defineProperty(this, "alpha", {
            set: function (value) {
                this._opacity = value;
                this.element.style.opacity = value;
            },
            get: function () {
                return this._opacity;
            }
        });
        this.visible = true;
        this.alpha = 1;
        this.element.style.display = "none";
    },
    isVisible: function () {
        return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
    }
 


})