
// The base Class implementation (does nothing)
var Class = function () { };

// Create a new Class that inherits from this class
Class.extend = function (prop) {
    var _super = this.prototype;
    var prototype = Object.create(_super);

    // Copy the properties over onto the new prototype
    for (var name in prop) {
        if (name != "statics") {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
              typeof _super[name] == "function"  ?
              (function (name, fn) {
                  return function () {
                      var tmp = this._super;

                      // Add a new ._super() method that is the same method
                      // but on the super-class
                      this._super = _super[name];

                      // The method only need to be bound temporarily, so we
                      // remove it when we're done executing
                      var ret = fn.apply(this, arguments);
                      this._super = tmp;

                      return ret;
                  };
              })(name, prop[name]) :
              prop[name];
        }
    }

    // The dummy class constructor
    function _Class() {
        // All construction is actually done in the init method

            this.ctor.apply(this, arguments);
    }

    //继承父类的静态属性
    for (var key in this) {
        if (this.hasOwnProperty(key) && key != "extend")
            _Class[key] = this[key];
    }

    // Populate our constructed prototype object
    _Class.prototype = prototype;

    _Class.prototype._super = Object.create(_super);
    //静态属性和方法
    if (prop.statics) {
        for (var name in prop.statics) {
            if (prop.statics.hasOwnProperty(name)) {
                _Class[name] = prop.statics[name];
                if (name == "ctor") {
                    //提前执行静态构造函数
                    _Class[name]();
                }
            }

        }
    }

    // Enforce the constructor to be what we expect
    _Class.prototype.constructor = _Class;

    // And make this class extendable
    _Class.extend = Class.extend;

    return _Class;
};

window.Class = Class;