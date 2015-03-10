/**
* 资源加载器
*
* @class Loader
* @constructor
*/
//add onerror to audio
//Note: IMAGE, CSS, SCRIPT, SVG can all use TAGS or XHR.
// Never load audio using XHR. WebAudio will provide its own loader.
define("ARE.Loader", {
    ctor: function () {
        this.audios = {};
        this.res = {};
        this.loadedCount = 0;
        this.resCount = -1;

        this.FILE_PATTERN = /(\w+:\/{2})?((?:\w+\.){2}\w+)?(\/?[\S]+\/|\/)?([\w\-%\.]+)(?:\.)(\w+)?(\?\S+)?/i;


        this.ns = 3; //The number of sounds to preload. This depends on how often the sounds need to be played, but if too big it will probably cause lond loading times.
        this.sounds = []; //This will be a matrix of all the sounds

        for (var i = 0; i < this.ns; i++) //We need to have ns different copies of each sound, hence:
            this.sounds.push([]);

        //for (i = 0; i < soundSources.length; i++)
        //    for (j = 0; j < ns; j++)
        //        sounds[j].push(new Audio(sources[i])); //Assuming that you hold your sound sauces in a "sources" array, for example ["bla.wav", "smile.dog" "scream.wav"] 

        this.playing = []; //This will be our play index, so we know which version has been played the last.

        //for (i = 0; i < soundSources.length; i++)
        //    playing[i] = 0;
        this.soundsCount = 0;
    },
    get: function (id) {
        return this.res[id];
    },
    loadRes: function (arr) {
        this.resCount = arr.length;
        for (var i = 0; i < arr.length; i++) {
            if (this._getTypeByExtension(arr[i].src.match(this.FILE_PATTERN)[5]) == "audio") {
                this.loadAudio(arr[i].id, arr[i].src);
            } else {
                this.loadImage(arr[i].id, arr[i].src);
            }
        }

    },
    loadImage: function (id, src) {

        var img = document.createElement("img");


        var self = this;
        img.onload = function () {
            self._handleLoad(this, id);
            img.onreadystatechange = null;
        }
        img.onreadystatechange = function () {

            if (img.readyState == "loaded" || img.readyState == "complete") {
                self._handleLoad(this, id);
                img.onload = null;
            }

        }

        img.onerror = function () {

        }

        img.src = src;
    },
    loadAudio: function (id, src) {

        var tag = document.createElement("audio");
        tag.autoplay = false;
        this.res[id] = tag;



        tag.src = null;
        tag.preload = "auto";
        tag.onerror = function () {

        }
        tag.onstalled = function () {

        };
        var self = this;

        var _audioCanPlayHandler = function () {
            self.playing[id] = 0;
            for (var i = 0; i < self.ns; i++) {
                self.sounds[i][id] = new Audio(src);
            }
            //self.soundsCount++;
            self.loadedCount++;
            self.handleProgress(self.loadedCount, self.resCount);
            self._clean(this);
            this.removeEventListener && this.removeEventListener("canplaythrough", _audioCanPlayHandler, false);
            self.checkComplete();
        }
        // This will tell us when audio is buffered enough to play through, but not when its loaded.
        // The tag doesn't keep loading in Chrome once enough has buffered, and we have decided that behaviour is sufficient.
        tag.addEventListener("canplaythrough", _audioCanPlayHandler, false); // canplaythrough callback doesn't work in Chrome, so we use an event.

        tag.src = src;
        if (tag.load != null) {
            tag.load();
        }
    },
    checkComplete: function () {
        if (this.loadedCount === this.resCount) {
            this.handleComplete();
        }

    },
    complete: function (fn) {

        this.handleComplete = fn;

    },
    progress: function (fn) {

        this.handleProgress = fn;

    },
    playSound: function (id) {
        this.sounds[this.playing[id]][id].play();
        ++this.playing[id]; //Each time a sound is played, increment this so the next time that sound needs to be played, we play a different version of it,

        if (this.playing[id] >= this.ns)
            this.playing[id] = 0;
    },
    _handleLoad: function (currentImg, id) {
        this._clean(currentImg);
        this.res[id] = currentImg;
        this.loadedCount++;
        if (this.handleProgress) this.handleProgress(this.loadedCount, this.resCount);
        this.checkComplete();
    },
    _getTypeByExtension: function (extension) {
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
        }
    },
    _clean: function (tag) {

        tag.onload = null;

        tag.onstalled = null;
        tag.onprogress = null;
        tag.onerror = null;
    }

})
//http://stackoverflow.com/questions/10385779/in-html5-can-i-play-the-same-sound-more-than-once-at-the-same-time 