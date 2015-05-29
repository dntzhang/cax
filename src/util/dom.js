
//begin-------------------are.Dom---------------------begin

are.Dom = Class.extend({
    "statics": {
        "get": function(selector) {
            this.element = document.querySelector(selector);
            return this;
        },
        "on": function(type, fn) {
            this.element.addEventListener(type, fn, false);
            return this;
        }
    }
});

//end-------------------are.Dom---------------------end
