
//begin-------------------are.Container---------------------begin

are.Container = are.DisplayObject.extend({
    "ctor": function() {
        this._super();
        this.children = [];
        this.baseInstanceof = "Container";
    },
    "add": function(obj) {
        var len = arguments.length;
        if (len > 1) {
            for (var i = 0; i < len; i++) {
                var item = arguments[i];
                if (item) {
                    this.children.push(item);
                    item.parent = this;
                    if (item instanceof are.DomElement) {
                        are.Stage.domSurface.appendChild(item.element);
                        item.element.style.visibility = "visible";
                        var style = window.getComputedStyle(item.element, null);
                        item.width = parseInt(style.width);
                        item.height = parseInt(style.height);
                    }
                }
            }
        } else {
            if (obj) {
                this.children.push(obj);
                obj.parent = this;
                if (obj instanceof are.DomElement) {
                    are.Stage.domSurface.appendChild(obj.element);
                    obj.element.style.visibility = "visible";
                    var style = window.getComputedStyle(obj.element, null);
                    obj.width = parseInt(style.width);
                    obj.height = parseInt(style.height);
                }
            }
        }
    },
    "remove": function(obj) {
        var len = arguments.length,
            childLen = this.children.length;
        if (len > 1) {
            for (var j = 0; j < len; j++) {
                var currentObj = arguments[j];
                for (var k = childLen; --k >= 0;) {
                    if (this.children[k].id == currentObj.id) {
                        currentObj.parent = null;
                        this.children.splice(k, 1);
                        if (currentObj instanceof are.DomElement) {
                            are.Stage.domSurface.removeChild(currentObj.element);
                        }
                        break;
                    }
                }
            }
        } else {
            for (var i = childLen; --i >= 0;) {
                if (this.children[i].id == obj.id) {
                    obj.parent = null;
                    this.children.splice(i, 1);
                    if (obj instanceof are.DomElement) {
                        are.Stage.domSurface.removeChild(obj.element);
                    }
                    break;
                }
            }
        }
    },
    "clone": function() {
        var o = new are.Container();
        this.cloneProps(o);
        var arr = o.children = [];
        for (var i = this.children.length - 1; i > -1; i--) {
            var clone = this.children[i].clone();
            arr.unshift(clone);
        }
        return o;
    },
    "removeAll": function() {
        var kids = this.children;
        while (kids.length) {
            kids.pop().parent = null;
        }
    },
    "destroy": function() {
        this._super();
        var kids = this.children;
        while (kids.length) {
            var kid = kids.pop();
            kid.destroy();
        }
    },
    "swapChildrenAt": function(index1, index2) {
        var kids = this.children;
        var o1 = kids[index1];
        var o2 = kids[index2];
        if (!o1 || !o2) {
            return;
        }
        kids[index1] = o2;
        kids[index2] = o1;
    },
    "swapChildren": function(child1, child2) {
        var kids = this.children;
        var index1, index2;
        for (var i = 0, l = kids.length; i < l; i++) {
            if (kids[i] == child1) {
                index1 = i;
            }
            if (kids[i] == child2) {
                index2 = i;
            }
            if (index1 != null && index2 != null) {
                break;
            }
        }
        if (i == l) {
            return;
        }
        kids[index1] = child2;
        kids[index2] = child1;
    },
    "swapToTop": function(child) {
        this.swapChildren(child, this.children[this.children.length - 1]);
    }
});

//end-------------------are.Container---------------------end
