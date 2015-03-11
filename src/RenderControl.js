var rdSlt = document.getElementById("rdSlt");
var webglSupport = (function () { try { var canvas = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))); } catch (e) { return false; } })();
if (!webglSupport) { rdSlt.selectedIndex = 1; }
if (localStorage.webgl) {
    if (localStorage.webgl == "0") {
        rdSlt.selectedIndex = 0;
    } else {
        rdSlt.selectedIndex = 1;
    }
}
rdSlt.onchange = function () {
    var index = rdSlt.selectedIndex; // 选中索引
    var value = rdSlt.options[index].value; // 选中值

    localStorage.webgl = value;

    location.reload();
}