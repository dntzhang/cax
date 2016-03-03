
//begin-------------------ARE.Loader---------------------begin

ARE.Loader = Class.extend({
    "ctor": function() {
        this.audios = {};
        this.res = {};
        this.loadedCount = 0;
        this.resCount = -1;
        this.FILE_PATTERN = /(\w+:\/{2})?((?:\w+\.){2}\w+)?(\/?[\S]+\/|\/)?([\w\-%\.]+)(?:\.)(\w+)?(\?\S+)?/i;
        this.ns = 6;
        this.sounds = [];
        for (var i = 0; i < this.ns; i++) this.sounds.push([]);
        this.playing = [];
        this.soundsCount = 0;
    },
    "get": function(id) {
        return this.res[id];
    },
    "loadRes": function(arr) {
        this.resCount = arr.length;
        for (var i = 0; i < arr.length; i++) {
            var type=this._getTypeByExtension(arr[i].src.match(this.FILE_PATTERN)[5]);
            if (type === "audio") {
                this.loadAudio(arr[i].id, arr[i].src);
            } else if (type === "js") {
                this.loadScript(arr[i].src);
            } else if (type === "img") {
                this.loadImage(arr[i].id, arr[i].src);
            }
        }
    },
    "loadImage": function(id, src) {
        var img = document.createElement("img");
        var self = this;
        img.onload = function() {
            self._handleLoad(this, id);
            img.onreadystatechange = null;
        };
        img.onreadystatechange = function() {
            if (img.readyState == "loaded" || img.readyState == "complete") {
                self._handleLoad(this, id);
                img.onload = null;
            }
        };
        img.onerror = function() {};
        img.src = src;
    },
    "loadAudio": function(id, src) {
        var tag = document.createElement("audio");
        tag.autoplay = false;
        this.res[id] = tag;
        tag.src = null;
        tag.preload = "auto";
        tag.onerror = function() {};
        tag.onstalled = function() {};
        var self = this;
        var _audioCanPlayHandler = function() {
            self.playing[id] = 0;
            for (var i = 0; i < self.ns; i++) {
                self.sounds[i][id] = new Audio(src);
            }
            self.loadedCount++;
            self.handleProgress&&self.handleProgress(self.loadedCount, self.resCount);
            self._clean(this);
            this.removeEventListener && this.removeEventListener("canplaythrough", _audioCanPlayHandler, false);
            self.checkComplete();
        };
        tag.addEventListener("canplaythrough", _audioCanPlayHandler, false);
        tag.src = src;
        if (tag.load != null) {
            tag.load();
        }
    },
    "loadScript": function (url) {
        var script = document.createElement("script")
        script.type = "text/javascript";
        var self = this;
        if (script.readyState) {  //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" ||
                        script.readyState == "complete") {
                    script.onreadystatechange = null;
                    self._handleLoad();
                }
            };
        } else {  //Others
            script.onload = function () {
                self._handleLoad();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    },
    "checkComplete": function() {
        if (this.loadedCount === this.resCount) {
            this.handleComplete();
        }
    },
    "complete": function(fn) {
        this.handleComplete = fn;
    },
    "progress": function(fn) {
        this.handleProgress = fn;
    },
    "playSound": function (id, volume) {
        var sound = this.sounds[this.playing[id]][id];
        sound.volume = volume === undefined ? 1 : volume;
        sound.play();
        ++this.playing[id];
        if (this.playing[id] >= this.ns) this.playing[id] = 0;
    },
    "_handleLoad": function (currentImg, id) {
        if (currentImg) {
            this._clean(currentImg);
            this.res[id] = currentImg;        
        }
        this.loadedCount++;
        if (this.handleProgress) this.handleProgress(this.loadedCount, this.resCount);
        this.checkComplete();
    },
    "_getTypeByExtension": function(extension) {
        switch (extension) {
        case "jpeg":
        case "jpg":
        case "gif":
        case "png":
        case "webp":
        case "bmp":
            return "img";
        case "ogg":
        case "mp3":
        case "wav":
            return "audio";
        case "js":
            return "js";
        }
    },
    "_clean": function(tag) {
        tag.onload = null;
        tag.onstalled = null;
        tag.onprogress = null;
        tag.onerror = null;
    }
});

//end-------------------ARE.Loader---------------------end
