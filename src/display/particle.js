
//begin-------------------are.Particle---------------------begin

are.Particle = are.Bitmap.extend({
    "ctor": function(option) {
        this._super(option.texture);
        this.originX = .5;
        this.originY = .5;
        this.position = option.position;
        this.x = this.position.x;
        this.y = this.position.y;
        this.rotation = option.rotation || 0;
        this.velocity = option.velocity;
        this.acceleration = option.acceleration || new are.Vector2(0, 0);
        this.rotatingSpeed = option.rotatingSpeed || 0;
        this.rotatingAcceleration = option.rotatingAcceleration || 0;
        this.hideSpeed = option.hideSpeed || .01;
        this.zoomSpeed = option.hideSpeed || .01;
        this.isAlive = true;
        this.img = option.texture;
        this.img.src = "";
    },
    "tick": function() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity.multiply(.1));
        this.rotatingSpeed += this.rotatingAcceleration;
        this.rotation += this.rotatingSpeed;
        this.alpha -= this.hideSpeed;
        this.x = this.position.x;
        this.y = this.position.y;
        this.alpha = this.alpha;
    }
});

//end-------------------are.Particle---------------------end
