define("ARE.Observable", {
    "statics": {
        "ctor": function () {
            this.methods = ["concat", "every", "filter", "forEach", "indexOf", "join", "lastIndexOf", "map", "pop", "push", "reduce", "reduceRight", "reverse", "shift", "slice", "some", "sort", "splice", "unshift", "valueOf"],
            this.triggerStr = ["concat", "pop", "push", "reverse", "shift", "sort", "splice", "unshift"].join(",");
        },
        "type": function (obj) {
            var typeStr = Object.prototype.toString.call(obj).split(" ")[1];
            return typeStr.substr(0, typeStr.length - 1).toLowerCase();
        },
        "isArray": function (obj) {
            return this.type(obj) == "array";
        },
        "isInArray": function (arr, item) {
            for (var i = arr.length; --i > -1;) {
                if (item === arr[i]) return true;
            }
            return false;
        },
        "isFunction": function (obj) {
            return this.type(obj) == "function";
        },
        "watch": function (target, arr) {
            return new this(target, arr);
        }
    },
    "ctor": function (target, arr) {
        for (var prop in target) {
            if (target.hasOwnProperty(prop)) {
                if ((arr && Observable.isInArray(arr, prop)) || !arr) {
                    this.watch(target, prop);
                }
            }
        }
        if (target.change) throw "naming conflicts！observable will extend 'change' method to your object ."
        var self = this;
        target.change = function (fn) {
            self.propertyChangedHandler = fn;
        }
    },
    "onPropertyChanged": function (prop, value) {
        this.propertyChangedHandler && this.propertyChangedHandler(prop, value);
    },
    "mock": function (target) {
        var self = this;
        Observable.methods.forEach(function (item) {
            target[item] = function () {
                var result = Array.prototype[item].apply(this, Array.prototype.slice.call(arguments));
                for (var cprop in this) {
                    if (this.hasOwnProperty(cprop) && cprop != "_super" && !Observable.isFunction(this[cprop])) {
                        self.watch(this, cprop);
                    }
                }
                if (new RegExp("\\b" + item + "\\b").test(Observable.triggerStr)) {
                    self.onPropertyChanged("array", item);
                }
                return result;
            };
        });
    },
    "watch": function (target, prop) {
        if (prop.substr(0, 2) == "__") return;
        var self = this;
        if (Observable.isFunction(target[prop])) return;

        var currentValue = target["__" + prop] = target[prop];
        Object.defineProperty(target, prop, {
            get: function () {
                return this["__" + prop];
            },
            set: function (value) {
                this["__" + prop] = value;
                self.onPropertyChanged(prop, value);
            }
        });

        if (Observable.isArray(target)) {
            this.mock(target);
        }
        if (typeof currentValue == "object") {
            if (Observable.isArray(currentValue)) {
                this.mock(currentValue);
            }
            for (var cprop in currentValue) {
                if (currentValue.hasOwnProperty(cprop) && cprop != "_super") {
                    this.watch(currentValue, cprop);
                }
            }
        }
    }
})