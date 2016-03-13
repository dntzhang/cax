AlloyPaper.WebGLRenderer = Class.extend({
    "ctor": function(canvas) {
        this.surface = canvas;
        this.snapToPixel = true;
        this.canvasRenderer = new AlloyPaper.CanvasRenderer();
        this.textureCache = {};
        this.textureCanvasCache = {};
        this.initSurface(this.surface);
    },
    "initSurface": function(surface) {
        var options = {
            depth: false,
            alpha: true,
            preserveDrawingBuffer: true,
            antialias: false,
            premultipliedAlpha: true
        };
        var ctx = undefined;
        try {
            ctx = surface.ctx = surface.getContext("webgl", options) || surface.getContext("experimental-webgl", options);
            ctx.viewportWidth = surface.width;
            ctx.viewportHeight = surface.height;
        } catch (e) {}
        if (!ctx) {
            alert("Could not initialise WebGL. Make sure you've updated your browser, or try a different one like Google Chrome.");
        }
        var textureShader = ctx.createShader(ctx.FRAGMENT_SHADER);
        ctx.shaderSource(textureShader, "" + "precision mediump float;\n" + "varying vec3 vTextureCoord;\n" + "varying float vAlpha;\n" + "uniform float uAlpha;\n" + "uniform sampler2D uSampler0;\n" + "void main(void) { \n" + "vec4 color = texture2D(uSampler0, vTextureCoord.st);  \n" + "gl_FragColor = vec4(color.rgb, color.a * vAlpha);\n" + "}");
        ctx.compileShader(textureShader);
        if (!ctx.getShaderParameter(textureShader, ctx.COMPILE_STATUS)) {
            alert(ctx.getShaderInfoLog(textureShader));
        }
        var vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
        ctx.shaderSource(vertexShader, "" + "attribute vec2 aVertexPosition;\n" + "attribute vec3 aTextureCoord;\n" + "attribute float aAlpha;\n" + "uniform bool uSnapToPixel;\n" + "const mat4 pMatrix = mat4(" + 2 / ctx.viewportWidth + ",0,0,0, 0," + -2 / ctx.viewportHeight + ",0,0, 0,0,-2,   0, -1,1,-1,1); \n" + "varying vec3 vTextureCoord;\n" + "varying float vAlpha;\n" + "void main(void) { \n" + "vTextureCoord = aTextureCoord; \n" + "vAlpha = aAlpha; \n" + "gl_Position = pMatrix * vec4(aVertexPosition.x,aVertexPosition.y,0.0, 1.0);\n" + "}");
        ctx.compileShader(vertexShader);
        if (!ctx.getShaderParameter(vertexShader, ctx.COMPILE_STATUS)) {
            alert(ctx.getShaderInfoLog(vertexShader));
        }
        var program = surface.shader = ctx.createProgram();
        ctx.attachShader(program, vertexShader);
        ctx.attachShader(program, textureShader);
        ctx.linkProgram(program);
        if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
        ctx.enableVertexAttribArray(program.vertexPositionAttribute = ctx.getAttribLocation(program, "aVertexPosition"));
        ctx.enableVertexAttribArray(program.uvCoordAttribute = ctx.getAttribLocation(program, "aTextureCoord"));
        ctx.enableVertexAttribArray(program.colorAttribute = ctx.getAttribLocation(program, "aAlpha"));
        program.alphaUniform = ctx.getUniformLocation(program, "uAlpha");
        program.snapToUniform = ctx.getUniformLocation(program, "uSnapToPixel");
        ctx.useProgram(program);
        this._vertexDataCount = 5;
        this._degToRad = Math.PI / 180;
        if (window.Float32Array) {
            this.vertices = new window.Float32Array(this._vertexDataCount * 4);
        } else {
            this.vertices = new Array(this._vertexDataCount * 4);
        }
        this.arrayBuffer = ctx.createBuffer();
        this.indexBuffer = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.arrayBuffer);
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        var byteCount = this._vertexDataCount * 4;
        ctx.vertexAttribPointer(program.vertexPositionAttribute, 2, ctx.FLOAT, 0, byteCount, 0);
        ctx.vertexAttribPointer(program.uvCoordAttribute, 2, ctx.FLOAT, 0, byteCount, 2 * 4);
        ctx.vertexAttribPointer(program.colorAttribute, 1, ctx.FLOAT, 0, byteCount, 4 * 4);
        if (window.Uint16Array) {
            this.indices = new window.Uint16Array(6);
        } else {
            this.indices = new Array(6);
        }
        for (var i = 0, l = this.indices.length; i < l; i += 6) {
            var j = i * 4 / 6;
            this.indices.set([j, j + 1, j + 2, j, j + 2, j + 3], i);
        }
        ctx.bufferData(ctx.ARRAY_BUFFER, this.vertices, ctx.STREAM_DRAW);
        ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, this.indices, ctx.STATIC_DRAW);
        ctx.viewport(0, 0, ctx.viewportWidth, ctx.viewportHeight);
        ctx.colorMask(true, true, true, true);
        ctx.blendFuncSeparate(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA, ctx.SRC_ALPHA, ctx.ONE);
        ctx.enable(ctx.BLEND);
        ctx.disable(ctx.DEPTH_TEST);
        surface.init = true;
        this.ctx = ctx;
    },
    "_initTexture": function(src, ctx) {
        if (!this.textureCache[src.src]) {
            src.glTexture = ctx.createTexture();
            src.glTexture.image = src;
            ctx.activeTexture(ctx.TEXTURE0);
            ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
            ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, src.glTexture.image);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
            this.textureCache[src.src] = src.glTexture;
            ctx.uniform1i(ctx.getUniformLocation(ctx.canvas.shader, "uSampler0"), 0);
        } else {
            src.glTexture = this.textureCache[src.src];
            ctx.activeTexture(ctx.TEXTURE0);
            ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
        }
    },
    "_initCache": function(o, src, ctx) {
        if (!this.textureCanvasCache[o.cacheID]) {
            this.textureCanvasCache[this._preCacheId] = null;
            src.glTexture = ctx.createTexture();
            src.glTexture.image = src;
            ctx.activeTexture(ctx.TEXTURE0);
            ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
            ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, src.glTexture.image);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
            ctx.uniform1i(ctx.getUniformLocation(ctx.canvas.shader, "uSampler0"), 0);
            this.textureCanvasCache[o.cacheID] = src.glTexture;
        } else {
            src.glTexture = this.textureCanvasCache[o.cacheID];
            ctx.activeTexture(ctx.TEXTURE0);
            ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
        }
    },
    "updateCache": function(ctx, o, w, h) {
        ctx.clearRect(0, 0, w + 1, h + 1);
        this.renderCache(ctx, o);
    },
    "renderCache": function(ctx, o) {
        if (!o.isVisible()) {
            return;
        }
        if (o instanceof AlloyPaper.Container || o instanceof AlloyPaper.Stage) {
            var list = o.children.slice(0);
            for (var i = 0, l = list.length; i < l; i++) {
                ctx.save();
                this.canvasRenderer.render(ctx, list[i]);
                ctx.restore();
            }
        } else if (o instanceof AlloyPaper.Bitmap || o instanceof AlloyPaper.Sprite) {
            var rect = o.rect;
            ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
        } else if (o.txtCanvas) {
            ctx.drawImage(o.txtCanvas, 0, 0);
        } else if (o.shapeCanvas) {
            ctx.drawImage(o.shapeCanvas, 0, 0);
        }
    },
    "clear": function() {
        this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
    },
    "renderObj": function(ctx, o) {
        var mtx = o._matrix,
            leftSide = 0,
            topSide = 0,
            rightSide = 0,
            bottomSide = 0;
        var uFrame = 0,
            vFrame = 0,
            u = 1,
            v = 1,
            img = 0;
        if (o.complexCompositeOperation === "lighter") {
            ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
        } else {
            ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
        }
        var mmyCanvas = o.cacheCanvas || o.txtCanvas || o.shapeCanvas;
        if (mmyCanvas) {
            this._initCache(o, mmyCanvas, ctx);
            rightSide = leftSide + mmyCanvas.width;
            bottomSide = topSide + mmyCanvas.height;
        } else if (o instanceof AlloyPaper.Bitmap || o instanceof AlloyPaper.Sprite) {
            var rect = o.rect;
            img = o.img;
            this._initTexture(img, ctx);
            rightSide = leftSide + rect[2];
            bottomSide = topSide + rect[3];
            u = rect[2] / img.width;
            v = rect[3] / img.height;
            uFrame = rect[0] / img.width;
            vFrame = rect[1] / img.height;
        }
        var a = mtx.a,
            b = mtx.b,
            c = mtx.c,
            d = mtx.d,
            tx = mtx.tx,
            ty = mtx.ty,
            lma = leftSide * a,
            lmb = leftSide * b,
            tmc = topSide * c,
            tmd = topSide * d,
            rma = rightSide * a,
            rmb = rightSide * b,
            bmc = bottomSide * c,
            bmd = bottomSide * d;
        var alpha = o.complexAlpha;
        this.vertices.set([lma + tmc + tx, lmb + tmd + ty, uFrame, vFrame, alpha, lma + bmc + tx, lmb + bmd + ty, uFrame, vFrame + v, alpha, rma + bmc + tx, rmb + bmd + ty, uFrame + u, vFrame + v, alpha, rma + tmc + tx, rmb + tmd + ty, uFrame + u, vFrame, alpha], 0);
        ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this.vertices);
        ctx.drawElements(ctx.TRIANGLES, 6, ctx.UNSIGNED_SHORT, 0);
    },
    "clearBackUpCanvasCache": function() {
        this.textureCanvasCache[1] = null;
    }
});