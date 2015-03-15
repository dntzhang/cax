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
        { name: "ARE.Vector2", url: "are/util" },
        { name: "AlloyRenderingEngine.PyTank" },
        { name: "AlloyRenderingEngine.Block" },
        { name: "AlloyRenderingEngine.PyBodyFactory" }
    ]
});

define("Main", ["ARE"], {
    ctor: function () {
        var ld = new Loader(), tank, stage = new Stage("#ourCanvas", localStorage.webgl == "1");
        var res = this.generateResources("../asset/img/");
        res.push({ id: "atLogo", src: "../asset/img/atLogo.png" });
        ld.loadRes(res);
        var range1 = document.querySelector("#range1");
        var range2 = document.querySelector("#range2");

        stage.scalable(range1.value, range2.value);
        this.resIdMapping = this.generateResIdMapping();
        var self = this;
        ld.complete(function () {
            self.renderTilelayer();

            var bmp = new Bitmap(ld.get("atLogo"));
            //（0.5,0.5）==〉The center is the point of rotation
         
            //bind click event, the event monitor can be accurate to pixel
            bmp.on("click", function () {
                //apply a random filter to the bmp
                bmp.setFilter(Math.random(), Math.random(), Math.random(), 1);
            })
            //add object to stage
            stage.add(bmp);
            bmp.toCenter();
            var step = 0.01;
            //loop
            stage.onTick(function () {
                bmp.rotation += 0.5;
                if (bmp.scaleX > 1.5 || bmp.scaleX < 0.5) {
                    step *= -1;
                }
                bmp.scaleX += step;
                bmp.scaleY += step;
            })
            range1.addEventListener("mouseup", function () {
                stage.scalable(range1.value, range2.value);

            }, false);
            range2.addEventListener("mouseup", function () {
                stage.scalable(range1.value, range2.value);

            }, false);
            range1.addEventListener("change", function () {
                stage.scalable(range1.value, range2.value);

            }, false);
            range2.addEventListener("change", function () {
                stage.scalable(range1.value, range2.value);

            }, false);
        });

        this.ld = ld;
        this.stage = stage;
        this.tileWidth = TileMaps.map1.tilewidth

        this.tileHeight = TileMaps.map1.tileheight;

        this.objects = TileMaps.map1.layers[1].objects;

      

    },
    renderTilelayer: function () {
        var data = TileMaps.map1.layers[0].data, len = data.length;
        for (var i = 0; i < len; i++) {
            var bmp = new Bitmap(this.ld.get("map"));
            var index = data[i] - 1;
            bmp.rect = [(index % 3) * this.tileWidth, Math.floor(index / 3) * this.tileHeight, this.tileWidth, this.tileHeight];
            bmp.x = (i % 20) * this.tileWidth;
            bmp.y = Math.floor(i / 20) * this.tileHeight;
            this.stage.add(bmp);
        }
    },
    renderObj: function () {
        var i = 0, len = this.objects.length;
        for (; i < len; i++) {
            var obj = this.objects[i];
        }
    },
    renderPolygon: function () {

    },
    generateResources: function (baseUrl) {
        this.tileSets = TileMaps.map1.tilesets;
        var result = [];
        var map = {};
        var first = this.tileSets[0];
        map.id = first.name;
        map.src = baseUrl + first.image;
        result.push(map);

        var second = this.tileSets[1];
        for (var i = 0, len = second.tiles.length; i < len; i++) {
            var item = second.tiles[i];
            var block = {};
            block.id = second.name + i;
            block.src = baseUrl + item.image;
            result.push(block);
        }

        return result;
    },
    generateResIdMapping: function () {
        this.tileSets = TileMaps.map1.tilesets;
        var mapping = {};
        var first = this.tileSets[0];
        var second = this.tileSets[1];
        var count = second.firstgid;
        for (var i = 1; i < count; i++) {
            mapping[i] = first.name;
        }

        for (var key in second.tiles) {
            if (second.tiles.hasOwnProperty(key)) {
                var item = second.tiles[key];
                mapping[count] = second.name + key;
                count++;
            }

        }
        return mapping;
    }
})