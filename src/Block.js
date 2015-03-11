define("Block:ARE.Container", {
    ctor: function (option) {
        this._super();

    

 
        this.body = PyBodyFactory.createPolygon(option);
      
        this.add(this.body.bitmap);
   
    }

});