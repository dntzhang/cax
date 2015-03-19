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
        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        var b2AABB = Box2D.Collision.b2AABB;
        var b2BodyDef = Box2D.Dynamics.b2BodyDef;
        var b2Body = Box2D.Dynamics.b2Body;
        var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
        var b2Fixture = Box2D.Dynamics.b2Fixture;
        var b2World = Box2D.Dynamics.b2World;
        var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
        var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
        var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
        var worldScale = 30;
        var world = new b2World(new b2Vec2(0, 30), true), bodies = [];

        var  stage = new Stage("#ourCanvas", localStorage.webgl == "1");
      
           
            stage.onTick(function () {
                world.Step(1 / 60, 10, 10);
                world.DrawDebugData();
                updateBodies();
                world.ClearForces();

            })
            stage.onClick(function (evt) {
                Math.random() > 0.5 ?
                createBall(Math.random() * 40 + 20, evt.stageX, evt.stageY, b2Body.b2_dynamicBody) :
                createBox(Math.random() * 40 + 40, Math.random() * 40 + 40, evt.stageX, evt.stageY, b2Body.b2_dynamicBody);
            })
            init();

        


        function updateBodies() {
            for (var i = 0, len = bodies.length; i < len; i++) {
                var body = bodies[i];
                var p = body.GetPosition();
                var r = body.GetAngle();
                body.bitmap.x = p.x * 30;
                body.bitmap.y = p.y * 30;

                body.bitmap.rotation = r * 180 / Math.PI;
            }
        }

        function init() {
            debugDraw();
            createBox(640, 30, 320, 480, b2Body.b2_staticBody);
            createBox(640, 30, 320, 0, b2Body.b2_staticBody);
            createBox(30, 480, 0, 240, b2Body.b2_staticBody);
            createBox(30, 480, 640, 240, b2Body.b2_staticBody);

            for (var i = 0; i < 10; i++) {
                Math.random() > 0.5 ?
           createBall(Math.random() * 40 + 20, Math.random()*560+40, 100, b2Body.b2_dynamicBody):
           createBox(Math.random() * 40 + 40, Math.random() * 40 + 40, Math.random() * 560 + 40, 0, b2Body.b2_dynamicBody);
            
            }
        }

      

        function createBox(width, height, pX, pY, type) {
            var bodyDef = new b2BodyDef;
            bodyDef.type = type;
            bodyDef.position.Set(pX / worldScale, pY / worldScale);
            var polygonShape = new b2PolygonShape;
            polygonShape.SetAsBox(width / 2 / worldScale, height / 2 / worldScale);
            var fixtureDef = new b2FixtureDef;
            fixtureDef.density = 1.0;
            fixtureDef.friction = 0.5;
            fixtureDef.restitution = 0.5;
            fixtureDef.shape = polygonShape;
            var body = world.CreateBody(bodyDef);
            bodies.push(body);
            body.bitmap = new Bitmap("../asset/img/box.jpg");
            body.bitmap.originX = body.bitmap.originY = 0.5;
            body.bitmap.scaleX = width / 200;
            body.bitmap.scaleY = height / 200;
            stage.add(body.bitmap)
            body.CreateFixture(fixtureDef);
        }
        function createBall(r, pX, pY, type) {
            var bodyDef = new b2BodyDef;
            bodyDef.type = type;
            bodyDef.position.Set(pX / worldScale, pY / worldScale);
            var polygonShape = new b2CircleShape;
            polygonShape.SetRadius(r / worldScale);
            var fixtureDef = new b2FixtureDef;
            fixtureDef.density = 1.0;
            fixtureDef.friction = 0.5;
            fixtureDef.restitution = 0.5;
            fixtureDef.shape = polygonShape;
            var body = world.CreateBody(bodyDef);
            bodies.push(body);
            body.bitmap = new Bitmap("../asset/img/basketball.png");
            body.bitmap.originX = body.bitmap.originY = 0.5;
            body.bitmap.scaleX =  body.bitmap.scaleY = r*2 / 128;
            stage.add(body.bitmap)
            body.CreateFixture(fixtureDef);
        }


        function debugDraw() {
            var debugDraw = new b2DebugDraw();
            debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
            debugDraw.SetDrawScale(30.0);
            debugDraw.SetFillAlpha(0.5);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            world.SetDebugDraw(debugDraw);
        }





    }
})
