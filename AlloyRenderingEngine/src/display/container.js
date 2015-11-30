
//begin-------------------ARE.Container---------------------begin

ARE.Container = ARE.DisplayObject.extend({
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
                }
            }
        } else {
            if (obj) {
                this.children.push(obj);
                obj.parent = this;
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
                    if (currentObj&&this.children[k].id == currentObj.id) {
                        currentObj.parent = null;
                        this.children.splice(k, 1);
                        break;
                    }
                }
            }
        } else {
            for (var i = childLen; --i >= 0;) {
                if (obj&&this.children[i].id == obj.id) {
                    obj.parent = null;
                    this.children.splice(i, 1);
                    break;
                }
            }
        }
    },
    "clone": function() {
        var o = new ARE.Container();
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
            kid = null;
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

//end-------------------ARE.Container---------------------end
