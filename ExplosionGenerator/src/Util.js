; (function () {
    var Util = {};

    Util.random = function (min,max) {
        return min + Math.floor(Math.random() * (max-min+1));
    }

    Util.downloadFile = function (code, fileName) {
        if (window.URL.createObjectURL) {
            var fileParts = [code];
            var bb = new Blob(fileParts, {
                type: "text/plain"
            });
            var dnlnk = window.URL.createObjectURL(bb);
            var dlLink = document.createElement("a");
            dlLink.setAttribute("href", dnlnk);
            dlLink.innerHTML = "aaaaaaaaaa"
            dlLink.setAttribute("download", fileName);
            document.body.appendChild(dlLink);
            dlLink.click();
            setTimeout(function () {
                document.body.removeChild(dlLink);
            }, 10)
        }
    }
    

    Util.downloadBlob=function(blob, fileName) {
        if (window.URL.createObjectURL) {
            var dnlnk = window.URL.createObjectURL(blob);
            var dlLink = document.createElement("a");
            dlLink.setAttribute("href", dnlnk);
            dlLink.setAttribute("download", fileName);
            document.body.appendChild(dlLink);
            dlLink.click();
            setTimeout(function () {
                document.body.removeChild(dlLink);
            }, 10)
        }
    }

    PE.Util = Util;
})();