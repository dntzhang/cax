/**
* 资源加载器
*
* @class Loader
* @constructor
*/
define("ARE.Util", {
    statics: {
        random : function (min,max) {
            return min + Math.floor(Math.random() * (max-min+1));
        }
    }
})