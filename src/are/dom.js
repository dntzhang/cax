
//begin-------------------ARE.Dom---------------------begin

ARE.Dom = __class.extend({
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

//end-------------------ARE.Dom---------------------end
