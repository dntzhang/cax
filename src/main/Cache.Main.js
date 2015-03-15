kmdjs.config({
    name: "AlloyRenderingEngine",
    baseUrl: "../src",
    classes: [
        { name: "ARE.Bitmap", url: "are/display" },
        { name: "ARE.CircleShape", url: "are/display" },
        { name: "ARE.Container", url: "are/display" },
        { name: "ARE.DisplayObject", url: "are/display" },
        { name: "ARE.DomElement", url: "are/display" },
        { name: "ARE.Particle", url: "are/display" },
        { name: "ARE.ParticleSystem", url: "are/display" },
        { name: "ARE.RectAdjust", url: "are/display" },
        { name: "ARE.RectShape", url: "are/display" },
        { name: "ARE.Shape", url: "are/display" },
        { name: "ARE.Sprite", url: "are/display" },
        { name: "ARE.Stage", url: "are/display" },
        { name: "ARE.Txt", url: "are/display" },
        { name: "ARE.CanvasRenderer", url: "are/renderer" },
        { name: "ARE.WebGLRenderer", url: "are/renderer" },
        { name: "ARE.Dom", url: "are/util" },
        { name: "ARE.FPS", url: "are/util" },
        { name: "ARE.GLMatrix", url: "are/util" },
        { name: "ARE.Keyboard", url: "are/util" },
        { name: "ARE.Loader", url: "are/util" },
        { name: "ARE.Matrix2D", url: "are/util" },
        { name: "ARE.Matrix3D", url: "are/util" },
        { name: "ARE.Observable", url: "are/util" },
        { name: "ARE.RAF", url: "are/util" },
        { name: "ARE.Transform", url: "are/util" },
        { name: "ARE.TWEEN", url: "are/util" },
        { name: "ARE.UID", url: "are/util" },
        { name: "ARE.Util", url: "are/util" },
        { name: "ARE.Vector2", url: "are/util" }
    ]
});

define("Main", ["ARE"], {
    ctor: function () {
        var ld = new Loader(), pgBmp;
        var stage = new Stage("#ourCanvas", localStorage.webgl == "1");

        var shapes = [], radius = 40;
        for (var i = 0; i < 200; i++) {
            var shape = new Shape();
            shape.beginPath().arc(377 / 4 - 58, 391 / 4 - 58, 140 / 4, 0, Math.PI * 2).closePath().fillStyle('#f4862c').fill()
                .strokeStyle("#046ab4").lineWidth(8 / 4).stroke().beginPath().moveTo(298 / 4 - 58, 506 / 4 - 58).bezierCurveTo(236 / 4 - 58, 396 / 4 - 58, 302 / 4 - 58, 272 / 4 - 58, 407 / 4 - 58, 254 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke().beginPath().moveTo(328 / 4 - 58, 258 / 4 - 58).bezierCurveTo(360 / 4 - 58, 294 / 4 - 58, 451 / 4 - 58, 272 / 4 - 58, 503 / 4 - 58, 332 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke().beginPath().moveTo(282 / 4 - 58, 288 / 4 - 58).bezierCurveTo(391 / 4 - 58, 292 / 4 - 58, 481 / 4 - 58, 400 / 4 - 58, 488 / 4 - 58, 474 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke().beginPath().moveTo(242 / 4 - 58, 352 / 4 - 58).bezierCurveTo(352 / 4 - 58, 244 / 4 - 58, 319 / 4 - 58, 423 / 4 - 58, 409 / 4 - 58, 527 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke();
            shape.x = 35 + Math.random() * (stage.width - 105);
            shape.y = 35 + Math.random() * (stage.height - 105);
            shape.velX = Math.random() * 10 - 5;
            shape.velY = Math.random() * 10 - 5;
            shapes.push(shape);
            shape.setBound(radius * 2, radius * 2);
            stage.add(shape);
           
        }

        var fpsDiv = document.getElementById("fps");

        stage.onTick(function () {
            fpsDiv.innerHTML = FPS.get();
            var w = stage.width + radius * 2;
            var h = stage.height + radius * 2;
            for (var i = 0; i < shapes.length; i++) {
                var shape = shapes[i];
                shape.x += shape.velX;
                shape.y += shape.velY;

                if (shape.x > w - 140 || shape.x < 0) shape.velX *= -1;
                if (shape.y > h - 140 || shape.y < 0) shape.velY *= -1;
            }
        });
  


        function toggleCache(value) {
            var l = shapes.length;

            for (var i = 0; i < l; i++) {
                var shape = shapes[i];
                if (value) {
                    shape.cache();
                } else {
                    shape.uncache();
                }
            }
        }
        toggleCache(true);
        window.toggleCache = toggleCache;


    }
})
