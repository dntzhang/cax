define("PyBodyFactory",["ARE"], {
    statics: {
        ctor: function () {

            this.b2Vec2 = Box2D.Common.Math.b2Vec2;
            this.b2AABB = Box2D.Collision.b2AABB;
            this.b2BodyDef = Box2D.Dynamics.b2BodyDef;
            this.b2Body = Box2D.Dynamics.b2Body;
            this.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
            this.b2Fixture = Box2D.Dynamics.b2Fixture;
            this.b2World = Box2D.Dynamics.b2World;
            this.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
            this.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
            this.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
            this.b2Separator = Box2D.Box2DSeparator.b2Separator;
            this.worldScale = 30;
        },
        createRect: function (option) {
            var pX = option.x, pY = option.y, width = option.width, height = option.height, type = option.type, world = option.world, img = option.img, stage = option.stage, rect = option.imgRect;
            var bodyDef = new this.b2BodyDef;
            bodyDef.type = type;
            bodyDef.position.Set(pX / this.worldScale, pY / this.worldScale);
            var polygonShape = new this.b2PolygonShape;
            polygonShape.SetAsBox(width / 2 / this.worldScale, height / 2 / this.worldScale);
            var fixtureDef = new this.b2FixtureDef;
            fixtureDef.density = 1.0;
            fixtureDef.friction = 0.5;
            fixtureDef.restitution = 0.5;
            fixtureDef.shape = polygonShape;
            var body = world.CreateBody(bodyDef);
            
            body.bitmap = new Bitmap(img);
            body.bitmap.scaleX = width / rect[2];
            body.bitmap.scaleY = height / rect[3];
            body.bitmap.setRect(rect);
            body.bitmap.originX = body.bitmap.originY = 0.5;
            stage&&stage.add(body.bitmap)
            body.CreateFixture(fixtureDef);
            return body;
        },
        createCircle: function (option) {
            var pX = option.x, pY = option.y, r = option.r, type = option.type, world = option.world, img = option.img, stage = option.stage, rect = option.imgRect;
            var bodyDef = new this.b2BodyDef;
            bodyDef.type = type;
            bodyDef.position.Set(pX / this.worldScale, pY / this.worldScale);
            var polygonShape = new this.b2CircleShape;
            polygonShape.SetRadius(r / this.worldScale);
            var fixtureDef = new this.b2FixtureDef;
            fixtureDef.density = 1.0;
            fixtureDef.friction = 0.5;
            fixtureDef.restitution = 0.5;
            fixtureDef.shape = polygonShape;
            var body = world.CreateBody(bodyDef);
   
            body.bitmap = new Bitmap(img);
            body.bitmap.originX = body.bitmap.originY = 0.5;
            body.bitmap.scaleX = body.bitmap.scaleY = r * 2 / rect[2];
            body.bitmap.setRect(rect);
            stage && stage.add(body.bitmap)
            body.CreateFixture(fixtureDef);
            return body;
        },
        createPolygon: function (option) {
            var x = option.x, y = option.y, verticesList = option.verticesList, type = option.type, world = option.world, stage = option.stage, img = option.img, rect = option.imgRect;
            var bodyDef = new this.b2BodyDef;
            var fixDef = new this.b2FixtureDef();
                bodyDef.type = type;
                bodyDef.position.Set(x / this.worldScale, y / this.worldScale);



                for (var k = 0; k < verticesList.length; k++) {
                    verticesList[k].x /= this.worldScale;
                    verticesList[k].y /= this.worldScale;
                }

                var separator = new this.b2Separator();
                var body = world.CreateBody(bodyDef);
                var validate = separator.Validate(verticesList);
                if (validate == 2) {
                    verticesList.reverse();
                    separator.Separate(body, fixDef, verticesList);
                } else if (validate == 0) {
                    separator.Separate(body, fixDef, verticesList);
                }

                body.bitmap = new Bitmap(img);
                //body.bitmap.originX = body.bitmap.originY = 0.5;
                //body.bitmap.scaleX = width / rect[2];
                //body.bitmap.scaleY = height / rect[3];
                body.bitmap.setRect(rect);
                stage && stage.add(body.bitmap)
                return body;
        },
        correctingVertexList: function (vertexList) {
            var firstVertex = vertexList[0],
                minX = firstVertex.x,
                minY = firstVertex.y,
                i = 1,
                len = vertexList.length;
                    for (; i < len; i++) {
                        var vertex = vertexList[i];
                        vertex.x < minX && (minX = vertex.x);
                        vertex.y < minY && (minY = vertex.y);
                    }
                    i = 0;
                    for (; i < len; i++) {
                        var vertex = vertexList[i];
                        vertex.x -= minX;
                        vertex.y -= minY;
                    }
                }
    }
})