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
        { name: "ARE.Txt", url: "are/display/txt.js" },
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
        var ld = new Loader(), bmp;
        var stage = new Stage("#ourCanvas", localStorage.webgl == "1");
        ld.loadRes([
            { id: "atLogo", src: "../asset/img/atLogo.png" }
        ]);
        ld.complete(function () {
            var bmp = new Bitmap(ld.get("atLogo"));
            bmp.originX = 0.5;
            bmp.originY = 0.5;
            bmp.scaleX = bmp.scaleY = 0.5;
            bmp.rotation = 0;
            bmp.x = stage.width / 2;
            bmp.y = -100;

            stage.add(bmp);

            To.get(bmp)
               .to()
               .y(240, 2000, To.elasticInOut)
               .rotation(240, 2000, To.elasticInOut)
               .end(function () {
                   //console.log(" task one has completed!")
               })
               .wait(500)
               .to()
               .rotation(0, 1400, To.elasticInOut)
               .end(function () {
                   //console.log(" task two has completed!")
               })
               .wait(500)
               .to()
               .scaleX(1, 1400, To.elasticInOut)
               .scaleY(1, 1400, To.elasticInOut)
               .end(function () {
                   //console.log(" task three has completed!")
               })
               .start();
        });

    }
})
