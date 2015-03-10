kmdjs.config({
    name: "BuildARE",
    baseUrl: "../src",
    classes: [
          { name: "ARE.DisplayObject", url: "are/display" },
          { name: "ARE.Bitmap", url: "are/display" },
          { name: "ARE.Sprite", url: "are/display" },
          { name: "ARE.Stage", url: "are/display" },
          { name: "ARE.Shape", url: "are/display" },
          { name: "ARE.Container", url: "are/display" },
          { name: "ARE.Txt", url: "are/display" },
          { name: "ARE.Matrix2D", url: "are/util" },
          { name: "ARE.Loader", url: "are/util" },
          { name: "ARE.UID", url: "are/util" },
          { name: "ARE.CanvasRenderer", url: "are/renderer" },
          { name: "ARE.WebGLRenderer", url: "are/renderer" },
          { name: "ARE.GLMatrix", url: "are/util" },
          { name: "ARE.RAF", url: "are/util" },
          { name: "ARE.FPS", url: "are/util" },
          { name: "ARE.Particle", url: "are/display" },
          { name: "ARE.Util", url: "are/util" },
          { name: "ARE.Vector2", url: "are/util" },
          { name: "ARE.Keyboard", url: "are/util" },
          { name: "ARE.ParticleSystem", url: "are/display" }
    ]
});

define("Main", ["ARE"], {
    ctor: function () {
        DisplayObject; Bitmap; Sprite; Stage; Shape; Container; Txt; Matrix2D; Loader; UID; CanvasRenderer; WebGLRenderer; GLMatrix; RAF; FPS; Particle; Util; Vector2; ParticleSystem; Keyboard;
    }
})
