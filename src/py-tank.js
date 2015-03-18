define("PyTank:ARE.Container", {
    ctor: function (option) {
        this._super();


        this.pyBody = PyBodyFactory.createRect(option);
        this.add(this.pyBody.bitmap);
        this.gun = new Bitmap(option.img);
        this.gun.rect=[165, 0, 17, 39];
        this.gun.originX = 0.5;
        this.gun.originY = 0.6;
        this.gun.y = -5;
        this.add(this.gun);

        this.x = option.x;
        this.y = option.y;
        this.direction = "";
        this.speed = 2;
        this.splitSpeed = this.speed / 1.4;
        this.rttDirMap = { up: 0, up_right: 45, right: 90, right_down: 135, down: 180,down_left:225, left: 270,left_up:315 };
    },
    stop: function () {
        this.direction = "";
    },
    turn: function () {
       
        if (this.direction) this.rotation = this.rttDirMap[this.direction];
    }


});