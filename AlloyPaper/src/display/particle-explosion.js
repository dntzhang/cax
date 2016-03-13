//begin----------------- AlloyPaper.ParticleExplosion -------------------begin
AlloyPaper.ParticleExplosion = AlloyPaper.Container.extend({
    ctor: function (ps, callback) {
        this._super();
        this.ps = ps;
        this.add(ps);
        this.callback = callback;
        this.tickFPS = 0;

        setTimeout(function () {
            this.ps.maxCount = 0;
            this.tickFPS = 60;
        }.bind(this), 1000);
    },
    tick: function () {
        if (this.ps.children.length === 0) {
            this.tickFPS = 0;
            this.parent.remove(this);
            this.callback();

        }
    }
});



//end-----------------AlloyPaper.ParticleExplosion-------------------end