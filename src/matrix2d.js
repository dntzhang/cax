
const DEG_TO_RAD =  0.017453292519943295

class Matrix2D {
    constructor(a, b, c, d, tx, ty){
        this.a = a == null ? 1 : a
        this.b = b || 0
        this.c = c || 0
        this.d = d == null ? 1 : d
        this.tx = tx || 0
        this.ty = ty || 0
        return this
    }

    identity() {
        this.a = this.d = 1
        this.b = this.c = this.tx = this.ty = 0
        return this
    }

    appendTransform (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        if (rotation % 360) {
            var r = rotation * DEG_TO_RAD
            var cos = Math.cos(r)
            var sin = Math.sin(r)
        } else {
            cos = 1
            sin = 0
        }
        if (skewX || skewY) {
            skewX *= AlloyPaper.Matrix2D.DEG_TO_RAD
            skewY *= AlloyPaper.Matrix2D.DEG_TO_RAD
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y)
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0)
        } else {
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y)
        }
        if (regX || regY) {
            this.tx -= regX * this.a + regY * this.c
            this.ty -= regX * this.b + regY * this.d
        }
        return this
    }

    append(a, b, c, d, tx, ty) {
        var a1 = this.a
        var b1 = this.b
        var c1 = this.c
        var d1 = this.d
        this.a = a * a1 + b * c1
        this.b = a * b1 + b * d1
        this.c = c * a1 + d * c1
        this.d = c * b1 + d * d1
        this.tx = tx * a1 + ty * c1 + this.tx
        this.ty = tx * b1 + ty * d1 + this.ty
        return this
    }

    initialize(a, b, c, d, tx, ty) {
        this.a = a
        this.b = b
        this.c = c
        this.d = d
        this.tx = tx
        this.ty = ty
        return this
    }

    setValues(a, b, c, d, tx, ty) {
        this.a = a == null ? 1 : a
        this.b = b || 0
        this.c = c || 0
        this.d = d == null ? 1 : d
        this.tx = tx || 0
        this.ty = ty || 0
        return this
    }

    copy(matrix) {
        return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty)
    }
}


export default Matrix2D;