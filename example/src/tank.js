var Tank = are.Container.extend({
    ctor: function (option) {
        this._super();

        this.body = new are.Bitmap(option.img);
        this.body.rect=[109, 5, 31, 44];
        this.body.originX = 0.5;
        this.body.originY = 0.5;
        this.add(this.body);

        this.gun = this.body.clone();
        this.gun.rect=[165, 0, 17, 39];
        this.gun.originX = 0.5;
        this.gun.originY = 0.6;
        this.gun.y = -5;
        this.x = 300;
        this.y = 300;
        this.add(this.gun);



        this.direction = "";
        this.speed = 2;
        this.splitSpeed = this.speed / 1.4;
        this.rttDirMap = { up: 0, up_right: 45, right: 90, right_down: 135, down: 180, down_left: 225, left: 270, left_up: 315 };
    },
    tick: function () {
        this.turn(this.direction);
        switch (this.direction) {
            case "up":
                this.y -= this.speed;
                break;
            case "down":
                this.y += this.speed;
                break;
            case "left":
                this.x -= this.speed;
                break;
            case "right":
                this.x += this.speed;
                break;
            case "up_right":
                this.x += this.splitSpeed;
                this.y -= this.splitSpeed;
                break;
            case "right_down":
                this.x += this.splitSpeed;
                this.y += this.splitSpeed;
                break;
            case "down_left":
                this.x -= this.splitSpeed;
                this.y += this.splitSpeed;
                break;
            case "left_up":
                this.x -= this.splitSpeed;
                this.y -= this.splitSpeed;
                break;
        }

    },
    stop: function () {
        this.direction = "";
    },
    turn: function () {

        if (this.direction) this.rotation = this.rttDirMap[this.direction];
    }


});