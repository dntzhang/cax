/**
 * 容器，继承自DisplayObject
 * @class Container
 * @constructor
 */
define("ARE.Container:ARE.DisplayObject", {
    ctor: function () {
        this._super();
        this.children = [];

        //为了获取更快的验证判断速度和更简洁的验证代码才定义这个属性
        this.baseInstanceof = "Container";
    },
    /**
     * 添加子元素（也支持同时添加多个子元素，那么就传递多个参数）
     * @method add
     * @param {displayObject} 子元素
     */
    add: function (obj) {
        var len=arguments.length;
        if (len > 1) {
            for(var i=0;i<len;i++){
                var item = arguments[i];
                if (item) {
                    this.children.push(item);
                    item.parent = this;
                }
            }
            //this.children.push.apply(this.children, Array.prototype.slice.call(arguments));
        } else {
            if (obj) {
                this.children.push(obj);
                obj.parent = this;
            }
        }
    },
    /**
     * 移除子元素（也支持同时移除多个子元素，那么就传递多个参数）
     * @method remove
     * @param {displayObject} 子元素
     */
    remove: function (obj) {
        var len = arguments.length,childLen= this.children.length;
        if (len > 1) {
            for (var j = 0; j < len; j++) {
                var currentObj = arguments[j];
                for (var k = childLen; --k >= 0;) {
                    if (this.children[k].id == currentObj.id) {
                        currentObj.parent = null;
                        this.children.splice(k, 1);
                        break;
                    }
                }
            }
        } else {
            for (var i = childLen; --i >= 0;) {
                if (this.children[i].id == obj.id) {
                    obj.parent = null;
                    this.children.splice(i, 1);
                    break;
                }
            }
        }
    },
    /**
     * 克隆
     * @method clone
     */
    clone: function () {
        var o = new Container();
        this.cloneProps(o);
        var arr = o.children = [];
        for (var i = this.children.length-1; i >-1; i--) {
            var clone = this.children[i].clone();
            arr.unshift(clone);
        }
        return o;

    },
    /**
     * 移除容器内所有元素
     * @method removeAll
     */
    removeAll: function () {
        var kids = this.children;
        while (kids.length) { kids.pop().parent = null; }
    }
})