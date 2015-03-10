define("ARE.WebGLRenderer", {
    ctor: function (root) {
        this.root = root;
        this.surface = root.canvas;

        // static properties:
        this.MAX_DEPTH = 1048576;

        // public properties:
        this.snapToPixel = true;

        this.canvasRenderer = new CanvasRenderer();
    },
    getSurface : function(width, height) {
        if (this.surface == null) {
            this.surface = document.createElement("canvas");
        }
        if (width) { this.surface.width = width; }
        if (height) { this.surface.height = height; }
        return this.surface;
    },
    clear : function() {
        if (!this.surface) { return; }
        if(!this.surface.init){
            this.initSurface(this.surface);
        }
    },
    initSurface: function (surface) {
        var ctx = undefined;
        try {
            ctx = surface.ctx = surface.getContext("experimental-webgl", {preserveDrawingBuffer: true});
            ctx.viewportWidth = surface.width;
            ctx.viewportHeight = surface.height;
        } catch (e) {}
		
        if (!ctx) {
            alert("Could not initialise WebGL. Make sure you've updated your browser, or try a different one like Google Chrome.");
        }
		
        // init matricies
        surface.idMatrix = GLMatrix.mat4.create();
        surface.orthMatrix = GLMatrix.mat4.create();
        this._matPool = [];
		
        // create shaders routines
        var textureShader = ctx.createShader(ctx.FRAGMENT_SHADER);
        ctx.shaderSource(textureShader, "" +
				"precision highp float;			\n" +
				
				"varying vec3 vTextureCoord;	\n" +
				"varying float vAlpha;			\n" +
				
				"uniform float uAlpha;			\n" +
                //声明多个sampler可以少调用glActiveTexture、glBindTexture、glEnable(GL_TEXTURE_2D)等，从而提高性能 http://blog.csdn.net/mythma/article/details/38979461
				"uniform sampler2D uSampler0,uSampler1,uSampler2,uSampler3,uSampler4,uSampler5,uSampler6," +
				"uSampler7,uSampler8,uSampler9,uSampler10,uSampler11,uSampler12,uSampler13,uSampler14,uSampler15;\n" +
				
				"void main(void) { 				\n" +
				"	int sampler = int(vTextureCoord.z); 				\n" +
				"	vec4 color;											\n" +
				"	vec2 coord = vec2(vTextureCoord.s, vTextureCoord.t);\n" + 
				"		 if (sampler == 0) { 	color = texture2D(uSampler0, coord); } \n" +
				"	else if (sampler == 1) { 	color = texture2D(uSampler1, coord); } \n" +
				"	else if (sampler == 2) { 	color = texture2D(uSampler2, coord); } \n" +
				"	else if (sampler == 3) { 	color = texture2D(uSampler3, coord); } \n" +
				"	else if (sampler == 4) { 	color = texture2D(uSampler4, coord); } \n" +
				"	else if (sampler == 5) { 	color = texture2D(uSampler5, coord); } \n" +
				"	else if (sampler == 6) { 	color = texture2D(uSampler6, coord); } \n" +
				"	else if (sampler == 7) { 	color = texture2D(uSampler7, coord); } \n" +
				"	else if (sampler == 8) { 	color = texture2D(uSampler8, coord); } \n" +
				"	else if (sampler == 9) { 	color = texture2D(uSampler9, coord); } \n" +
				"	else if (sampler == 10) { 	color = texture2D(uSampler10, coord); } \n" +
				"	else if (sampler == 11) { 	color = texture2D(uSampler11, coord); } \n" +
				"	else if (sampler == 12) { 	color = texture2D(uSampler12, coord); } \n" +
				"	else if (sampler == 13) { 	color = texture2D(uSampler13, coord); } \n" +
				"	else if (sampler == 14) { 	color = texture2D(uSampler14, coord); } \n" +
				"	else if (sampler == 15) { 	color = texture2D(uSampler15, coord); } \n" +
				"	else { 						color = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t)); } \n" + 
				"	gl_FragColor = vec4(color.rgb, color.a * vAlpha);\n" +
				"}");
		
        ctx.compileShader(textureShader);
        if(!ctx.getShaderParameter(textureShader, ctx.COMPILE_STATUS)) { alert(ctx.getShaderInfoLog(textureShader)); }
		
        var vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
        ctx.shaderSource(vertexShader, "" +
				"attribute vec3 aVertexPosition;	\n" +
				"attribute vec3 aTextureCoord;		\n" +
				"attribute float aAlpha;			\n" +
				
				"uniform mat4 uPMatrix;				\n" +
				"uniform bool uSnapToPixel;			\n" +
				
				"varying vec3 vTextureCoord;		\n" +
				"varying float vAlpha;				\n" +
				
				"void main(void) { 					\n" +
				"	vTextureCoord = aTextureCoord; 	\n" +
				"	vAlpha = aAlpha; 				\n" +
				"	gl_Position = uPMatrix * vec4(aVertexPosition, 1.0);	\n" +
				"}");
        ctx.compileShader(vertexShader);
        if(!ctx.getShaderParameter(vertexShader, ctx.COMPILE_STATUS)) { alert(ctx.getShaderInfoLog(vertexShader)); }
		
        // create shader programs
        var program = surface.shader = ctx.createProgram();

        ctx.attachShader(program,	vertexShader);
        ctx.attachShader(program,	textureShader);
        ctx.linkProgram(program);
        if(!ctx.getProgramParameter(program, ctx.LINK_STATUS)) { alert("Could not initialise shaders"); }
        ctx.enableVertexAttribArray(program.vertexPositionAttribute =	ctx.getAttribLocation(program, "aVertexPosition"));
        ctx.enableVertexAttribArray(program.uvCoordAttribute =			ctx.getAttribLocation(program, "aTextureCoord"));
        ctx.enableVertexAttribArray(program.colorAttribute =			ctx.getAttribLocation(program, "aAlpha"));
        program.orthMatrixUniform =	ctx.getUniformLocation(program, "uPMatrix");
		
        program.alphaUniform =		ctx.getUniformLocation(program, "uAlpha");
        program.snapToUniform =		ctx.getUniformLocation(program, "uSnapToPixel");
		
        ctx.useProgram(program);
		
        // setup key variables
        this._vertexDataCount = 7;
        this._root2 = Math.sqrt(2);
        this._index = 0;
        this._textures = [];
        this._cacheTextures = [];
        this._degToRad = Math.PI / 180;
		
        // setup buffers
        if (window.Float32Array) {

            this.vertices = new window.Float32Array(this._vertexDataCount * 4 * 5000);
        } else {
            this.vertices = new Array(this._vertexDataCount * 4 * 5000);
        }
		
        this.arrayBuffer = ctx.createBuffer();
        this.indexBuffer = ctx.createBuffer();

        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.arrayBuffer);
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		
        var byteCount = (this._vertexDataCount * 4);
        ctx.vertexAttribPointer(program.vertexPositionAttribute, 3, ctx.FLOAT, 0, byteCount, 0);		
        ctx.vertexAttribPointer(program.uvCoordAttribute, 3, ctx.FLOAT, 0, byteCount, 12);
        ctx.vertexAttribPointer(program.colorAttribute, 1, ctx.FLOAT, 0, byteCount, 24);

        // Indices are set once and reused.
        if (window.Uint16Array) {
            this.indices = new window.Uint16Array(30000);
        } else {
            this.indices = new Array(30000);
        }
        for (var i = 0, l = this.indices.length; i < l; i += 6) {
            var j = i * 4 / 6;
            this.indices.set([j, j+1, j+2, j, j+2, j+3], i);
        }
		
        ctx.bufferData(ctx.ARRAY_BUFFER, this.vertices, ctx.STREAM_DRAW);
        ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, this.indices, ctx.STATIC_DRAW);
		
        // setup viewport
        GLMatrix.mat4.ortho(0, ctx.viewportWidth, ctx.viewportHeight, 0, -this.MAX_DEPTH, this.MAX_DEPTH, surface.orthMatrix);
        ctx.viewport(0, 0, ctx.viewportWidth, ctx.viewportHeight);
        ctx.colorMask(true, true, true, true);
		
        // setup blending
        ctx.blendFuncSeparate(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA, ctx.SRC_ALPHA, ctx.ONE);
        ctx.enable(ctx.BLEND); ctx.disable(ctx.DEPTH_TEST);
		
        // mark complete
        surface.init = true;
    },
    _initTexture : function(src, ctx){
        if (!src) {
            return;
        }
        var textures = this._textures;
        var textureCount = this._cacheTextures.length + this._textures.length;

        for (var i = 0, l = textures.length; i < l; i++) {
            if (textures[i].image == src) {
                src.glTexture = textures[i];
                return i;
            }
        }
        if (!src.glTexture) {
            src.glTexture = ctx.createTexture();
            src.glTexture.image = src;
			
            ctx.activeTexture(ctx["TEXTURE" + textureCount]);
            ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);

            ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, src.glTexture.image);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
        } else {
            ctx.activeTexture(ctx["TEXTURE" + textureCount]);
            ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
        }

        ctx.uniform1i(ctx.getUniformLocation(ctx.canvas.shader, ("uSampler" + textureCount.toString())), textureCount);
		
        textures.push(src.glTexture);
        return textureCount;
    },
    _initCache : function(o, src, ctx){
        if (!src) {
            return;
        }
        var textures = this._cacheTextures;
        var textureCount = this._cacheTextures.length + this._textures.length;

        for (var i = 0, l = textures.length; i < l; i++) {
            if (o.cacheID&&textures[i]._cacheID == o.cacheID) {
                textures[i]._isUsed = true;
                src.glTexture = textures[i];
                ctx.activeTexture(ctx["TEXTURE" + textureCount]);
                ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
                this._textures.push(src.glTexture);
                return i;
            }
        }
        if (!src.glTexture) {
            src.glTexture = ctx.createTexture();
            src.glTexture.image = src;
			
            ctx.activeTexture(ctx["TEXTURE" + textureCount]);
            ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);

            ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, src.glTexture.image);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
        } else {
            ctx.activeTexture(ctx["TEXTURE" + textureCount]);
            ctx.bindTexture(ctx.TEXTURE_2D, src.glTexture);
        }

        ctx.uniform1i(ctx.getUniformLocation(ctx.canvas.shader, ("uSampler" + textureCount.toString())), textureCount);
        src._cacheID = o.cacheID;
        src.glTexture._isUsed = true;
		
        this._textures.push(src.glTexture);
        textures.push(src.glTexture);
        return textureCount;
    },
    render : function(displayObject, surface) {
        displayObject = displayObject || this.root;
        surface = surface || this.surface;
        var ctx = surface.ctx;
		
        if (this.snapToPixel) {
            ctx.uniform1i(surface.shader.snapToUniform, 1);
        } else {
            ctx.uniform1i(surface.shader.snapToUniform, 0);
        }
		
        GLMatrix.mat4.identity(surface.idMatrix);
        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
        ctx.uniformMatrix4fv(surface.shader.orthMatrixUniform, false, surface.orthMatrix);
		
        if(!surface.init){
            this.initSurface(surface);
        }
        if (displayObject && surface) {
            var docFrag = document.createDocumentFragment();
            this._render(ctx, displayObject, surface.idMatrix, docFrag);
            this._draw(ctx);
        }
		
        this._cleanCache();
    },
    _getCompositeOperation: function (o) {

        if (o.compositeOperation) return o.compositeOperation;
        if (o.parent) return this._getCompositeOperation(o.parent);
    },
    _render: function (ctx, o, matrix, docFrag) {
        var mat4 = GLMatrix.mat4;
        if (!o.isVisible()) { return; }
				
        var testLength = (this._index + 4) * this._vertexDataCount;
        if (this.vertices.length < testLength) {				
            this._draw(ctx);
        }
        var uFrame = 0, vFrame = 0, u = 1, v = 1, img = 0;
        var degToRad = this._degToRad;
        var mvMatrix = this._getMat4();
		
        /* 
		 * The samplerID of the image used. Images are stored in an array in the renderer as well as the samplers.
		 * Should the array hit 16, a draw method is called from inside _initTexture before the image is set, resetting the images.
		 * This lets us use as many images as we want.
		 * If the object has a cacheCanvas, however, that's what we will treat as a texture.
		 */
        var samplerID = 0;
		
        //https://www.opengl.org/sdk/docs/man/html/glBlendFunc.xhtml
        var compositeOperation = this._getCompositeOperation(o);
        if (compositeOperation=== "lighter") {
            ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
            // return;
        } else {
            ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
        }

        var mmyCanvas = o.cacheCanvas || o.txtCanvas;
        // render the element:
        if (mmyCanvas) {
            //this._drawToCache(ctx, o);
            //document.body.appendChild(mmyCanvas)
            samplerID = this._initCache(o, mmyCanvas, ctx);
            mat4.translate(matrix,	[o.x , o.y , 0],	mvMatrix);
           
            mat4.rotateX(mvMatrix,	o.skewX * degToRad);
            mat4.rotateY(mvMatrix,	o.skewY * degToRad);
            mat4.rotateZ(mvMatrix, o.rotation * degToRad);
            mat4.scale(mvMatrix, [o.scaleX * mmyCanvas.width, o.scaleY * mmyCanvas.height, 1]);
            mat4.translate(mvMatrix, [-o.originX, -o.originY, 0]);
        }  else if (o instanceof Container) {
            var list = o.children.slice(0);
            mat4.translate(matrix,	[o.x, o.y , 0], 	mvMatrix);
            
            mat4.rotateX(mvMatrix,	o.skewX * degToRad);
            mat4.rotateY(mvMatrix,	o.skewY * degToRad);
            mat4.rotateZ(mvMatrix, o.rotation * degToRad);
            mat4.scale(mvMatrix, [o.scaleX, o.scaleY, 1]);
            mat4.translate(mvMatrix, [-o.originX, -o.originY, 0]);
            for (var i=0,l=list.length; i<l; i++) {
                this._render(ctx,list[i],mvMatrix);
            }
            this._poolMat4(mvMatrix);
            return;
			
        } else if (o instanceof Bitmap||o instanceof Sprite) {    
            var rect = o.rect;
            img = o.img;
            samplerID = this._initTexture(img, ctx);
           
            u = (rect[2] / img.width);
            v = (rect[3] / img.height);
            uFrame = (rect[0] / img.width);
            vFrame = (rect[1] / img.height);

            mat4.translate(matrix, [o.x , o.y , 0], mvMatrix);
           
            mat4.rotateX(mvMatrix, o.skewX * degToRad);
            mat4.rotateY(mvMatrix, o.skewY * degToRad);
            mat4.rotateZ(mvMatrix, o.rotation * degToRad);
            //先rotate再scale可防止scaleX不等于scaleY时，出现skew
            mat4.scale(mvMatrix, [o.scaleX * rect[2], o.scaleY * rect[3], 1]);
            mat4.translate(mvMatrix, [-o.originX, -o.originY, 0]);
        }

        //else if (o instanceof Shape) {
           
        //} else if (o instanceof Txt) {

        //}

        // Get positions of the 4 vertices. Each object is a square, drawn from the top-left point in a U shape.
        var pos1 = mat4.multiplyVec3(mvMatrix, [0,0,0]);
        var pos2 = mat4.multiplyVec3(mvMatrix, [0,1,0]);
        var pos3 = mat4.multiplyVec3(mvMatrix, [1,1,0]);
        var pos4 = mat4.multiplyVec3(mvMatrix, [1,0,0]);
		
        // Get yonder alpha.
        var alpha = o.alpha;
		
        this.vertices.set(
				[pos1[0], pos1[1],	pos1[2],	uFrame, 		vFrame, 		samplerID,		alpha,
				 pos2[0], pos2[1],	pos2[2], 	uFrame, 		vFrame + v, 	samplerID,		alpha,
				 pos3[0], pos3[1],	pos3[2],	uFrame + u,		vFrame + v, 	samplerID,		alpha,
				 pos4[0], pos4[1], 	pos4[2],	uFrame + u, 	vFrame, 		samplerID,		alpha], this._index * this._vertexDataCount);	

        // Add 4 vertices to the index count.
        this._index += 4;
		
        /*
		 * If we hit our texture limit, we draw. Draw will reset the texture and index values.
		 * This will effectively "reset" the renderer, but because we'll still be getting nodes in order, this won't change.
		 * It will be as though nothing ever happened, and all the nodes preceding this point never existed.
		 * Since they're already drawn, doing this will be no problem.
		 */
        this._poolMat4(mvMatrix);
        if (this._textures.length + this._cacheTextures.length > 31) {
            this._draw(ctx);
        }

       // ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
    },
    _draw : function(ctx) {
        ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this.vertices.subarray(0, this._index * this._vertexDataCount));
        ctx.drawElements(ctx.TRIANGLES, this._index * 1.5, ctx.UNSIGNED_SHORT, 0);
		
        this._index = 0;
        this._textureCount = 0;
        this._textures = [];
    },
    _cleanCache : function() {
        var textures = this._cacheTextures;
        for (var i = 0, l = textures.length; i < l; i++) {
            if (!textures[i]._isUsed) {
                textures.splice(i, 1);
                i--;
                l--;
            } else {
                textures[i]._isUsed = false;
            }
        }
    },
    _getMat4 : function() {
        if (this._matPool.length > 0) {
            return this._matPool.pop();
        } else {
            return GLMatrix.mat4.create();
        }
    },
    _poolMat4 : function(mat) {
        this._matPool.push(mat);
    },
    update : function () {
        this.clear();
        if (this.tickOnUpdate) { this.tickDisplayList(this.root, this.arguments); }
        this.render(this.root, this.surface);
    },
    updateCache: function (ctx, o, w, h) {
        ctx.clearRect(0, 0, w + 1, h + 1);
        this.renderCache(ctx, o);
    },
    renderCache: function (ctx, o) {
        if (!o.isVisible()) { return; }
        // render the element:
        if (o instanceof Container || o instanceof Stage) {
            var list = o.children.slice(0);
            for (var i = 0, l = list.length; i < l; i++) {
                ctx.save();
                this.canvasRenderer.render(ctx, list[i]);
                ctx.restore();
            }
        } else if (o instanceof Bitmap||o instanceof Sprite) {
            var rect = o.rect;
            ctx.drawImage(o.img, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);
        }


    }


})