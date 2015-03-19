kmdjs.config({
    name: "AlloyRenderingEngine",
    baseUrl: "../src",
    classes: [
        { name: "ARE.Bitmap", url: "are/display/bitmap.js" },
        { name: "ARE.CircleShape", url: "are/display/circle-shape.js" },
        { name: "ARE.Container", url: "are/display/container.js" },
        { name: "ARE.DisplayObject", url: "are/display/display-object.js" },
        { name: "ARE.DomElement", url: "are/display/dom-element.js" },
        { name: "ARE.Particle", url: "are/display/particle.js" },
        { name: "ARE.ParticleSystem", url: "are/display/particle-system.js" },
        { name: "ARE.RectAdjust", url: "are/display/rect-adjust.js" },
        { name: "ARE.RectShape", url: "are/display/rect-shape.js" },
        { name: "ARE.Shape", url: "are/display/shape.js" },
        { name: "ARE.Sprite", url: "are/display/sprite.js" },
        { name: "ARE.Stage", url: "are/display/stage.js" },
        { name: "ARE.Text", url: "are/display/text.js" },
        { name: "ARE.CanvasRenderer", url: "are/renderer/canvas-renderer.js" },
        { name: "ARE.WebGLRenderer", url: "are/renderer/webgl-renderer.js" },
        { name: "ARE.Dom", url: "are/util/dom.js" },
        { name: "ARE.FPS", url: "are/util/fps.js" },
        { name: "ARE.GLMatrix", url: "are/util/glmatrix.js" },
        { name: "ARE.Keyboard", url: "are/util/keyboard.js" },
        { name: "ARE.Loader", url: "are/util/loader.js" },
        { name: "ARE.Matrix2D", url: "are/util/matrix2d.js" },
        { name: "ARE.To", url: "are/util/to.js" },
        { name: "ARE.Observable", url: "are/util/observable.js" },
        { name: "ARE.RAF", url: "are/util/raf.js" },
        { name: "ARE.TWEEN", url: "are/util/tween.js" },
        { name: "ARE.UID", url: "are/util/uid.js" },
        { name: "ARE.Util", url: "are/util/util.js" },
        { name: "ARE.Vector2", url: "are/util/vector2.js" }
    ]
});

define("Main", ["ARE"], {
    ctor: function () {
        var stage = new Stage("#ourCanvas", localStorage.webgl == "1");

        var ps = new ParticleSystem({
            emitX: 200,
            emitY: 340,
            speed: 10,
            angle: -30,
            angleRange: 50,
            emitArea: [1, 1],
            gravity: new Vector2(0, 0),
            texture: "data:image/png;base64\,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJkSURBVHjaxJeJbusgEEW94S1L//83X18M2MSuLd2pbqc4wZGqRLrKBsyZhQHny7Jk73xVL8xpVhWrcmiB5lX+6GJ5YgQ2owbAm8oIwH1VgKZUmGcRqKGGPgtEQQAzGR8hQ59fAmhJHSAagigJ4E7GPWRXOYC6owAd1JM6wDQPADyMWUqZRMqmAojHp1Vn6EQQEgUNMJLnUjMyJsM49wygBkAPw9dVFwXRkncCIIW3GRgoTQUZn6HxCMAFEFd8TwEQ78X4rHbILoAUmeT+RFG4UhQ6MiIAE4W/UsYFjuVjAIa2nIY4q1R0GFtQWG3E84lqw2GO2QOoCKBVu0BAPgDSU0eUDjjQenNkV/AW/pWChhpMTelo1a64AOKM30vk18GzTHXCNtI/Knz3DFBgsUqBGIjTInXRY1yA9xkVoqW5tVq3pDR9A0hfF5BSARmVnh7RMDCaIdcNgbPBkgzn1Bu+SfIEFSpSBmkxyrMicb0fAEuCZrWnN89veA/4XcakrPcjBWzkTuLjlbfTQPOlBhz+HwkqqPXmPQDdrQItxE1moGof1S74j/8txk8EHhTQrAE8qlwfqS5yukm1x/rAJ9Jiaa6nyATqD78aUVBhFo8b1V4DdTXdCW+IxA1zB4JhiOhZMEWO1HqnvdoHZ4FAMIhV9REF8FiUm0jsYPEJx/Fm/N8OhH90HI9YRHesWbXXZwAShU8qThe7H8YAuJmw5yOd989uRINKRTJAhoF8jbqrHKfeCYdIISZfSq26bk/K+yO3YvfKrVgiwQBHnwt8ynPB25+M8hceTt/ybPhnryJ78+tLgAEAuCFyiQgQB30AAAAASUVORK5CYII=",
            filter: [0.8, 0.2, 0.8, 1],
            emitCount: 1,
            maxCount: 100
        });

        stage.add(ps);

        stage.on("mousemove", function (evt) {
            ps.emitX = evt.stageX;
            ps.emitY = evt.stageY;
        })

        var fpsDiv = document.getElementById("fps");



        var bmp = new Bitmap("../asset/img/atLogo.png");
        //（0.5,0.5）==〉The center is the point of rotation
        bmp.originX = 0.5;
        bmp.originY = 0.5;
        bmp.x = 240;
        bmp.y = 240;
        //bind click event, the event monitor can be accurate to pixel
        bmp.on("click", function () {
            //apply a random filter to the bmp
            bmp.setFilter(Math.random(), Math.random(), Math.random(), 1);
        })
        //add object to stage
        stage.add(bmp);

        var step = 0.01;
        //loop
        stage.onTick(function () {
            fpsDiv.innerHTML = FPS.get();
            bmp.rotation += 0.5;
            if (bmp.scaleX > 1 || bmp.scaleX < 0.5) {
                step *= -1;
            }
            bmp.scaleX += step;
            bmp.scaleY += step;
        })


        var shape = new Shape(73, 76);
        shape.beginPath().arc(377 / 4 - 58, 391 / 4 - 58, 140 / 4, 0, Math.PI * 2).closePath()
            .fillStyle('#f4862c').fill()
            .strokeStyle("#046ab4").lineWidth(8 / 4).stroke()
            .beginPath().moveTo(298 / 4 - 58, 506 / 4 - 58).bezierCurveTo(236 / 4 - 58, 396 / 4 - 58, 302 / 4 - 58, 272 / 4 - 58, 407 / 4 - 58, 254 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke()
            .beginPath().moveTo(328 / 4 - 58, 258 / 4 - 58).bezierCurveTo(360 / 4 - 58, 294 / 4 - 58, 451 / 4 - 58, 272 / 4 - 58, 503 / 4 - 58, 332 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke()
            .beginPath().moveTo(282 / 4 - 58, 288 / 4 - 58).bezierCurveTo(391 / 4 - 58, 292 / 4 - 58, 481 / 4 - 58, 400 / 4 - 58, 488 / 4 - 58, 474 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke()
            .beginPath().moveTo(242 / 4 - 58, 352 / 4 - 58).bezierCurveTo(352 / 4 - 58, 244 / 4 - 58, 319 / 4 - 58, 423 / 4 - 58, 409 / 4 - 58, 527 / 4 - 58).strokeStyle("#046ab4").lineWidth(6 / 4).stroke()
            .end();
        shape.x = shape.y = 100;
        stage.add(shape);

        var txt = new Text({
            txt: "Alloy Game Engine",
            fontSize: 25,
            fontFamily: "arial",
            color:"#ffffff"

        });
        txt.x = 120;
        stage.add(txt);

        var ld = new Loader()
        ld.loadRes([
            { id: "kmd", src: "../asset/img/kmd.png" },
            { id: "pig", src: "../asset/img/pig.png" },
            { id: "hero", src: "../asset/img/hero-m.png" }]
            );
        ld.complete(function () {
            var sprite = new Sprite({
                x: 220,
                y: 200,
                framerate: 5,
                imgs: [ld.get("hero"), ld.get("pig")],
                frames: [
                        // x, y, width, height, imageIndex, originX, originY               
                        [64, 64, 64, 64],
                        [128, 64, 64, 64],
                        [192, 64, 64, 64],
                        [256, 64, 64, 64],
                        [320, 64, 64, 64],
                        [384, 64, 64, 64],
                        [448, 64, 64, 64],

                         [0, 192, 64, 64],
                         [64, 192, 64, 64],
                        [128, 192, 64, 64],
                        [192, 192, 64, 64],
                        [256, 192, 64, 64],
                        [320, 192, 64, 64],
                        [384, 192, 64, 64],
                        [448, 192, 64, 64],
                         [448, 192, 64, 64]
                ],
                animations: {
                    walk: {
                        frames: [0, 1, 2, 3, 4, 5, 6],
                        next: "run",
                        speed: 2,
                        loop: false
                    },
                    happy: {
                        frames: [11, 12, 13, 14]
                    },
                    win: {
                        frames: [7, 8, 9, 10]
                    }
                },
                currentAnimation: "walk",
                tickAnimationEnd: function () {
                    console.log("播完一轮");
                },
                animationEnd: function () {
                    alert("播放完成")
                }
            });
            stage.add(sprite);
        });
      
    }
})
