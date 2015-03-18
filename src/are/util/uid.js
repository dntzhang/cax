define("ARE.UID", {
    statics: {
        _nextID: 0,
        _nextCacheID:1,
        get: function () {
            return this._nextID++;
        },
        getCacheID: function () {
            return this._nextCacheID++;
        }
    }
})
