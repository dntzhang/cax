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
          { name: "ARE.RAF", url: "are/util" },
          { name: "ARE.Keyboard", url: "are/util" },
          { name: "ARE.Txt", url: "are/display" }
    ]
});

define("Main", ["ARE"], {
    ctor: function () {
        var stage = new Stage("#ourCanvas", localStorage.webgl == "1");
        var txt = new Txt({
            txt: "Alloy Rendering Engine",
            fontSize: 25,
            fontFamily: "arial"

        });
        stage.add(txt);

    }
})
