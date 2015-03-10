/**
* Dom操作
*
* @class Dom
* @constructor
*/
define("ARE.Dom", {
    statics: {
        get: function (selector) {
            this.element = document.querySelector(selector);
            return this;
        },
        on: function (type, fn) {
            this.element.addEventListener(type, fn, false);
            return this;
        }
    }


});