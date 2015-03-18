define("ARE.Matrix2D", {
    statics:{
        DEG_TO_RAD:Math.PI/180
    },
    ctor: function (a, b, c, d, tx, ty) {
        this.a = (a == null) ? 1 : a;
        this.b = b || 0;
        this.c = c || 0;
        this.d = (d == null) ? 1 : d;
        this.tx = tx || 0;
        this.ty = ty || 0;
        return this;
    },
    identity : function() {
         this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        return this;
    },
    appendTransform : function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY,flipX,flipY) {
        if (rotation%360) {
            var r = rotation*Matrix2D.DEG_TO_RAD;
            var cos = Math.cos(r);
            var sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }

        if (skewX || skewY) {
            // TODO: can this be combined into a single append?
            skewX *= Matrix2D.DEG_TO_RAD;
            skewY *= Matrix2D.DEG_TO_RAD;
            //skew'essence  is half part of rotate
            //这里不使用tan是因为tan会产生比较大的数,skew变形太厉害...
            // this.append(1, Math.tan(skewY), Math.tan(skewX),1, x, y);
            //先平移--〉扭曲(顺序不能反，不然平移的比例会受扭曲的影响,A*B!=B*A) ->旋转 -〉缩放
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
            this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
        } else {
            this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
        }

        if (regX || regY) {
            // prepend the registration offset:
            this.tx -= regX*this.a+regY*this.c; 
            this.ty -= regX*this.b+regY*this.d;
        }
        //Unable to flip the original position,because the obj's height/width was unknow here
        if( flipX ){
            this.a *= -1
            this.c *= -1;
        }
        if (flipY) {
            this.b *= -1
            this.d *= -1;
        }
        return this;
    },
    append : function(a, b, c, d, tx, ty) {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;

        this.a  = a*a1+b*c1;
        this.b  = a*b1+b*d1;
        this.c  = c*a1+d*c1;
        this.d  = c*b1+d*d1;
        this.tx = tx*a1+ty*c1+this.tx;
        this.ty = tx*b1+ty*d1+this.ty;
        return this;
    },
    reinitialize: function (a, k, b, d, c, f, h, i, j) {
        this.initialize(a, k, b, d, c, f); this.alpha = h || 1; this.shadow = i; this.compositeOperation = j;
        return this
    },
    initialize: function (a, k, b, d, c, f) {
        if (a != null) this.a = a; this.b = k || 0; this.c = b || 0; if (d != null) this.d = d; this.tx = c || 0; this.ty = f || 0; return this
    }


})