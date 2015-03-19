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
        var ld = new Loader(), stage = new Stage("#ourCanvas", true);
        ld.loadRes([
            { id: "seabed", src: "../asset/img/seabed.png" }
        ]);
        ld.complete(function () {
            var bmp = new Bitmap(ld.get("seabed"));
            var flipYBmp = bmp.clone();
            flipYBmp.setFilter(0.5, 0.5, 0.5, 1);
            flipYBmp.y = flipYBmp.height * 2+0.5;
            flipYBmp.flipY = true;

            stage.add(bmp,flipYBmp);
        });
    }
})
