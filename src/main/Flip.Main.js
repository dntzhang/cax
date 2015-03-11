kmdjs.config({
    name: "AlloyRenderingEngine",
    baseUrl: "../src",
    classes: [
          { name: "ARE.DisplayObject", url: "are/display" },
          { name: "ARE.Bitmap", url: "are/display" },
          { name: "ARE.Sprite", url: "are/display" },
          { name: "ARE.Stage", url: "are/display" },
          { name: "ARE.Shape", url: "are/display" },
          { name: "ARE.Container", url: "are/display" },
          { name: "ARE.Matrix2D", url: "are/util" },
          { name: "ARE.Loader", url: "are/util" },
          { name: "ARE.UID", url: "are/util" },
          { name: "ARE.CanvasRenderer", url: "are/renderer" },
          { name: "ARE.WebGLRenderer", url: "are/renderer" },
          { name: "ARE.GLMatrix", url: "are/util" },
          { name: "ARE.Keyboard", url: "are/util" },
          { name: "ARE.RAF", url: "are/util" }
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
