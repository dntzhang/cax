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
        var pgBmp, stage = new Stage("#ourCanvas", localStorage.webgl == "1");
        stage.debug = true;

        var ps = new ParticleSystem({
            emitX: 200,
            emitY: 200,
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
    }
})
