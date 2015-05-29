
//begin-------------------are.Keyboard---------------------begin

are.Keyboard = Class.extend({
    "statics": {
        "ctor": function() {
            var KeyboardJS = {},
                locales = {},
                locale, map, macros, activeKeys = [],
                bindings = [],
                activeBindings = [],
                activeMacros = [],
                aI, usLocale;
            usLocale = {
                map: {
                    "3": ["cancel"],
                    "8": ["backspace"],
                    "9": ["tab"],
                    "12": ["clear"],
                    "13": ["enter"],
                    "16": ["shift"],
                    "17": ["ctrl"],
                    "18": ["alt", "menu"],
                    "19": ["pause", "break"],
                    "20": ["capslock"],
                    "27": ["escape", "esc"],
                    "32": ["space", "spacebar"],
                    "33": ["pageup"],
                    "34": ["pagedown"],
                    "35": ["end"],
                    "36": ["home"],
                    "37": ["left"],
                    "38": ["up"],
                    "39": ["right"],
                    "40": ["down"],
                    "41": ["select"],
                    "42": ["printscreen"],
                    "43": ["execute"],
                    "44": ["snapshot"],
                    "45": ["insert", "ins"],
                    "46": ["delete", "del"],
                    "47": ["help"],
                    "91": ["command", "windows", "win", "super", "leftcommand", "leftwindows", "leftwin", "leftsuper"],
                    "92": ["command", "windows", "win", "super", "rightcommand", "rightwindows", "rightwin", "rightsuper"],
                    "145": ["scrolllock", "scroll"],
                    "186": ["semicolon", ";"],
                    "187": ["equal", "equalsign", "="],
                    "188": ["comma", ","],
                    "189": ["dash", "-"],
                    "190": ["period", "."],
                    "191": ["slash", "forwardslash", "/"],
                    "192": ["graveaccent", "`"],
                    "219": ["openbracket", "["],
                    "220": ["backslash", "\\"],
                    "221": ["closebracket", "]"],
                    "222": ["apostrophe", "'"],
                    "48": ["zero", "0"],
                    "49": ["one", "1"],
                    "50": ["two", "2"],
                    "51": ["three", "3"],
                    "52": ["four", "4"],
                    "53": ["five", "5"],
                    "54": ["six", "6"],
                    "55": ["seven", "7"],
                    "56": ["eight", "8"],
                    "57": ["nine", "9"],
                    "96": ["numzero", "num0"],
                    "97": ["numone", "num1"],
                    "98": ["numtwo", "num2"],
                    "99": ["numthree", "num3"],
                    "100": ["numfour", "num4"],
                    "101": ["numfive", "num5"],
                    "102": ["numsix", "num6"],
                    "103": ["numseven", "num7"],
                    "104": ["numeight", "num8"],
                    "105": ["numnine", "num9"],
                    "106": ["nummultiply", "num*"],
                    "107": ["numadd", "num+"],
                    "108": ["numenter"],
                    "109": ["numsubtract", "num-"],
                    "110": ["numdecimal", "num."],
                    "111": ["numdivide", "num/"],
                    "144": ["numlock", "num"],
                    "112": ["f1"],
                    "113": ["f2"],
                    "114": ["f3"],
                    "115": ["f4"],
                    "116": ["f5"],
                    "117": ["f6"],
                    "118": ["f7"],
                    "119": ["f8"],
                    "120": ["f9"],
                    "121": ["f10"],
                    "122": ["f11"],
                    "123": ["f12"]
                },
                macros: [["shift + `", ["tilde", "~"]], ["shift + 1", ["exclamation", "exclamationpoint", "!"]], ["shift + 2", ["at", "@"]], ["shift + 3", ["number", "#"]], ["shift + 4", ["dollar", "dollars", "dollarsign", "$"]], ["shift + 5", ["percent", "%"]], ["shift + 6", ["caret", "^"]], ["shift + 7", ["ampersand", "and", "&"]], ["shift + 8", ["asterisk", "*"]], ["shift + 9", ["openparen", "("]], ["shift + 0", ["closeparen", ")"]], ["shift + -", ["underscore", "_"]], ["shift + =", ["plus", "+"]], ["shift + (", ["opencurlybrace", "opencurlybracket", "{"]], ["shift + )", ["closecurlybrace", "closecurlybracket", "}"]], ["shift + \\", ["verticalbar", "|"]], ["shift + ;", ["colon", ":"]], ["shift + '", ["quotationmark", '"']], ["shift + !,", ["openanglebracket", "<"]], ["shift + .", ["closeanglebracket", ">"]], ["shift + /", ["questionmark", "?"]]]
            };
            for (aI = 65; aI <= 90; aI += 1) {
                usLocale.map[aI] = String.fromCharCode(aI + 32);
                usLocale.macros.push(["shift + " + String.fromCharCode(aI + 32) + ", capslock + " + String.fromCharCode(aI + 32), [String.fromCharCode(aI)]]);
            }
            registerLocale("us", usLocale);
            getSetLocale("us");
            enable();
            KeyboardJS.enable = enable;
            KeyboardJS.disable = disable;
            KeyboardJS.activeKeys = getActiveKeys;
            KeyboardJS.releaseKey = removeActiveKey;
            KeyboardJS.pressKey = addActiveKey;
            KeyboardJS.on = createBinding;
            KeyboardJS.clear = removeBindingByKeyCombo;
            KeyboardJS.clear.key = removeBindingByKeyName;
            KeyboardJS.locale = getSetLocale;
            KeyboardJS.locale.register = registerLocale;
            KeyboardJS.macro = createMacro;
            KeyboardJS.macro.remove = removeMacro;
            KeyboardJS.key = {};
            KeyboardJS.key.name = getKeyName;
            KeyboardJS.key.code = getKeyCode;
            KeyboardJS.combo = {};
            KeyboardJS.combo.active = isSatisfiedCombo;
            KeyboardJS.combo.parse = parseKeyCombo;
            KeyboardJS.combo.stringify = stringifyKeyCombo;

            function enable() {
                if (window.addEventListener) {
                    window.document.addEventListener("keydown", keydown, false);
                    window.document.addEventListener("keyup", keyup, false);
                    window.addEventListener("blur", reset, false);
                    window.addEventListener("webkitfullscreenchange", reset, false);
                    window.addEventListener("mozfullscreenchange", reset, false);
                } else if (window.attachEvent) {
                    window.document.attachEvent("onkeydown", keydown);
                    window.document.attachEvent("onkeyup", keyup);
                    window.attachEvent("onblur", reset);
                }
            }
            function disable() {
                reset();
                if (window.removeEventListener) {
                    window.document.removeEventListener("keydown", keydown, false);
                    window.document.removeEventListener("keyup", keyup, false);
                    window.removeEventListener("blur", reset, false);
                    window.removeEventListener("webkitfullscreenchange", reset, false);
                    window.removeEventListener("mozfullscreenchange", reset, false);
                } else if (window.detachEvent) {
                    window.document.detachEvent("onkeydown", keydown);
                    window.document.detachEvent("onkeyup", keyup);
                    window.detachEvent("onblur", reset);
                }
            }
            function reset(event) {
                activeKeys = [];
                pruneMacros();
                pruneBindings(event);
            }
            function keydown(event) {
                var keyNames, keyName, kI;
                keyNames = getKeyName(event.keyCode);
                if (keyNames.length < 1) {
                    return;
                }
                event.isRepeat = false;
                for (kI = 0; kI < keyNames.length; kI += 1) {
                    keyName = keyNames[kI];
                    if (getActiveKeys().indexOf(keyName) != -1) event.isRepeat = true;
                    addActiveKey(keyName);
                }
                executeMacros();
                executeBindings(event);
            }
            function keyup(event) {
                var keyNames, kI;
                keyNames = getKeyName(event.keyCode);
                if (keyNames.length < 1) {
                    return;
                }
                for (kI = 0; kI < keyNames.length; kI += 1) {
                    removeActiveKey(keyNames[kI]);
                }
                pruneMacros();
                pruneBindings(event);
            }
            function getKeyName(keyCode) {
                return map[keyCode] || [];
            }
            function getKeyCode(keyName) {
                var keyCode;
                for (keyCode in map) {
                    if (!map.hasOwnProperty(keyCode)) {
                        continue;
                    }
                    if (map[keyCode].indexOf(keyName) > -1) {
                        return keyCode;
                    }
                }
                return false;
            }
            function createMacro(combo, injectedKeys) {
                if (typeof combo !== "string" && (typeof combo !== "object" || typeof combo.push !== "function")) {
                    throw new Error("Cannot create macro. The combo must be a string or array.");
                }
                if (typeof injectedKeys !== "object" || typeof injectedKeys.push !== "function") {
                    throw new Error("Cannot create macro. The injectedKeys must be an array.");
                }
                macros.push([combo, injectedKeys]);
            }
            function removeMacro(combo) {
                var macro, mI;
                if (typeof combo !== "string" && (typeof combo !== "object" || typeof combo.push !== "function")) {
                    throw new Error("Cannot remove macro. The combo must be a string or array.");
                }
                for (mI = 0; mI < macros.length; mI += 1) {
                    macro = macros[mI];
                    if (compareCombos(combo, macro[0])) {
                        removeActiveKey(macro[1]);
                        macros.splice(mI, 1);
                        break;
                    }
                }
            }
            function executeMacros() {
                var mI, combo, kI;
                for (mI = 0; mI < macros.length; mI += 1) {
                    combo = parseKeyCombo(macros[mI][0]);
                    if (activeMacros.indexOf(macros[mI]) === -1 && isSatisfiedCombo(combo)) {
                        activeMacros.push(macros[mI]);
                        for (kI = 0; kI < macros[mI][1].length; kI += 1) {
                            addActiveKey(macros[mI][1][kI]);
                        }
                    }
                }
            }
            function pruneMacros() {
                var mI, combo, kI;
                for (mI = 0; mI < activeMacros.length; mI += 1) {
                    combo = parseKeyCombo(activeMacros[mI][0]);
                    if (isSatisfiedCombo(combo) === false) {
                        for (kI = 0; kI < activeMacros[mI][1].length; kI += 1) {
                            removeActiveKey(activeMacros[mI][1][kI]);
                        }
                        activeMacros.splice(mI, 1);
                        mI -= 1;
                    }
                }
            }
            function createBinding(keyCombo, keyDownCallback, keyUpCallback) {
                var api = {},
                    binding, subBindings = [],
                    bindingApi = {},
                    kI, subCombo;
                if (typeof keyCombo === "string") {
                    keyCombo = parseKeyCombo(keyCombo);
                }
                for (kI = 0; kI < keyCombo.length; kI += 1) {
                    binding = {};
                    subCombo = stringifyKeyCombo([keyCombo[kI]]);
                    if (typeof subCombo !== "string") {
                        throw new Error("Failed to bind key combo. The key combo must be string.");
                    }
                    binding.keyCombo = subCombo;
                    binding.keyDownCallback = [];
                    binding.keyUpCallback = [];
                    if (keyDownCallback) {
                        binding.keyDownCallback.push(keyDownCallback);
                    }
                    if (keyUpCallback) {
                        binding.keyUpCallback.push(keyUpCallback);
                    }
                    bindings.push(binding);
                    subBindings.push(binding);
                }
                api.clear = clear;
                api.on = on;
                return api;

                function clear() {
                    var bI;
                    for (bI = 0; bI < subBindings.length; bI += 1) {
                        bindings.splice(bindings.indexOf(subBindings[bI]), 1);
                    }
                }
                function on(eventName) {
                    var api = {},
                        callbacks, cI, bI;
                    if (typeof eventName !== "string") {
                        throw new Error("Cannot bind callback. The event name must be a string.");
                    }
                    if (eventName !== "keyup" && eventName !== "keydown") {
                        throw new Error('Cannot bind callback. The event name must be a "keyup" or "keydown".');
                    }
                    callbacks = Array.prototype.slice.apply(arguments, [1]);
                    for (cI = 0; cI < callbacks.length; cI += 1) {
                        if (typeof callbacks[cI] === "function") {
                            if (eventName === "keyup") {
                                for (bI = 0; bI < subBindings.length; bI += 1) {
                                    subBindings[bI].keyUpCallback.push(callbacks[cI]);
                                }
                            } else if (eventName === "keydown") {
                                for (bI = 0; bI < subBindings.length; bI += 1) {
                                    subBindings[bI].keyDownCallback.push(callbacks[cI]);
                                }
                            }
                        }
                    }
                    api.clear = clear;
                    return api;

                    function clear() {
                        var cI, bI;
                        for (cI = 0; cI < callbacks.length; cI += 1) {
                            if (typeof callbacks[cI] === "function") {
                                if (eventName === "keyup") {
                                    for (bI = 0; bI < subBindings.length; bI += 1) {
                                        subBindings[bI].keyUpCallback.splice(subBindings[bI].keyUpCallback.indexOf(callbacks[cI]), 1);
                                    }
                                } else {
                                    for (bI = 0; bI < subBindings.length; bI += 1) {
                                        subBindings[bI].keyDownCallback.splice(subBindings[bI].keyDownCallback.indexOf(callbacks[cI]), 1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            function removeBindingByKeyCombo(keyCombo) {
                var bI, binding, keyName;
                for (bI = 0; bI < bindings.length; bI += 1) {
                    binding = bindings[bI];
                    if (compareCombos(keyCombo, binding.keyCombo)) {
                        bindings.splice(bI, 1);
                        bI -= 1;
                    }
                }
            }
            function removeBindingByKeyName(keyName) {
                var bI, kI, binding;
                if (keyName) {
                    for (bI = 0; bI < bindings.length; bI += 1) {
                        binding = bindings[bI];
                        for (kI = 0; kI < binding.keyCombo.length; kI += 1) {
                            if (binding.keyCombo[kI].indexOf(keyName) > -1) {
                                bindings.splice(bI, 1);
                                bI -= 1;
                                break;
                            }
                        }
                    }
                } else {
                    bindings = [];
                }
            }
            function executeBindings(event) {
                var bI, sBI, binding, bindingKeys, remainingKeys, cI, killEventBubble, kI, bindingKeysSatisfied, index, sortedBindings = [],
                    bindingWeight;
                remainingKeys = [].concat(activeKeys);
                for (bI = 0; bI < bindings.length; bI += 1) {
                    bindingWeight = extractComboKeys(bindings[bI].keyCombo).length;
                    if (!sortedBindings[bindingWeight]) {
                        sortedBindings[bindingWeight] = [];
                    }
                    sortedBindings[bindingWeight].push(bindings[bI]);
                }
                for (sBI = sortedBindings.length - 1; sBI >= 0; sBI -= 1) {
                    if (!sortedBindings[sBI]) {
                        continue;
                    }
                    for (bI = 0; bI < sortedBindings[sBI].length; bI += 1) {
                        binding = sortedBindings[sBI][bI];
                        bindingKeys = extractComboKeys(binding.keyCombo);
                        bindingKeysSatisfied = true;
                        for (kI = 0; kI < bindingKeys.length; kI += 1) {
                            if (remainingKeys.indexOf(bindingKeys[kI]) === -1) {
                                bindingKeysSatisfied = false;
                                break;
                            }
                        }
                        if (bindingKeysSatisfied && isSatisfiedCombo(binding.keyCombo)) {
                            activeBindings.push(binding);
                            for (kI = 0; kI < bindingKeys.length; kI += 1) {
                                index = remainingKeys.indexOf(bindingKeys[kI]);
                                if (index > -1) {
                                    remainingKeys.splice(index, 1);
                                    kI -= 1;
                                }
                            }
                            for (cI = 0; cI < binding.keyDownCallback.length; cI += 1) {
                                if (binding.keyDownCallback[cI](event, getActiveKeys(), binding.keyCombo) === false) {
                                    killEventBubble = true;
                                }
                            }
                            if (killEventBubble === true) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }
            function pruneBindings(event) {
                var bI, cI, binding, killEventBubble;
                for (bI = 0; bI < activeBindings.length; bI += 1) {
                    binding = activeBindings[bI];
                    if (isSatisfiedCombo(binding.keyCombo) === false) {
                        for (cI = 0; cI < binding.keyUpCallback.length; cI += 1) {
                            if (binding.keyUpCallback[cI](event, getActiveKeys(), binding.keyCombo) === false) {
                                killEventBubble = true;
                            }
                        }
                        if (killEventBubble === true) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        activeBindings.splice(bI, 1);
                        bI -= 1;
                    }
                }
            }
            function compareCombos(keyComboArrayA, keyComboArrayB) {
                var cI, sI, kI;
                keyComboArrayA = parseKeyCombo(keyComboArrayA);
                keyComboArrayB = parseKeyCombo(keyComboArrayB);
                if (keyComboArrayA.length !== keyComboArrayB.length) {
                    return false;
                }
                for (cI = 0; cI < keyComboArrayA.length; cI += 1) {
                    if (keyComboArrayA[cI].length !== keyComboArrayB[cI].length) {
                        return false;
                    }
                    for (sI = 0; sI < keyComboArrayA[cI].length; sI += 1) {
                        if (keyComboArrayA[cI][sI].length !== keyComboArrayB[cI][sI].length) {
                            return false;
                        }
                        for (kI = 0; kI < keyComboArrayA[cI][sI].length; kI += 1) {
                            if (keyComboArrayB[cI][sI].indexOf(keyComboArrayA[cI][sI][kI]) === -1) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
            function isSatisfiedCombo(keyCombo) {
                var cI, sI, stage, kI, stageOffset = 0,
                    index, comboMatches;
                keyCombo = parseKeyCombo(keyCombo);
                for (cI = 0; cI < keyCombo.length; cI += 1) {
                    comboMatches = true;
                    stageOffset = 0;
                    for (sI = 0; sI < keyCombo[cI].length; sI += 1) {
                        stage = [].concat(keyCombo[cI][sI]);
                        for (kI = stageOffset; kI < activeKeys.length; kI += 1) {
                            index = stage.indexOf(activeKeys[kI]);
                            if (index > -1) {
                                stage.splice(index, 1);
                                stageOffset = kI;
                            }
                        }
                        if (stage.length !== 0) {
                            comboMatches = false;
                            break;
                        }
                    }
                    if (comboMatches) {
                        return true;
                    }
                }
                return false;
            }
            function extractComboKeys(keyCombo) {
                var cI, sI, kI, keys = [];
                keyCombo = parseKeyCombo(keyCombo);
                for (cI = 0; cI < keyCombo.length; cI += 1) {
                    for (sI = 0; sI < keyCombo[cI].length; sI += 1) {
                        keys = keys.concat(keyCombo[cI][sI]);
                    }
                }
                return keys;
            }
            function parseKeyCombo(keyCombo) {
                var s = keyCombo,
                    i = 0,
                    op = 0,
                    ws = false,
                    nc = false,
                    combos = [],
                    combo = [],
                    stage = [],
                    key = "";
                if (typeof keyCombo === "object" && typeof keyCombo.push === "function") {
                    return keyCombo;
                }
                if (typeof keyCombo !== "string") {
                    throw new Error('Cannot parse "keyCombo" because its type is "' + typeof keyCombo + '". It must be a "string".');
                }
                while (s.charAt(i) === " ") {
                    i += 1;
                }
                while (true) {
                    if (s.charAt(i) === " ") {
                        while (s.charAt(i) === " ") {
                            i += 1;
                        }
                        ws = true;
                    } else if (s.charAt(i) === ",") {
                        if (op || nc) {
                            throw new Error("Failed to parse key combo. Unexpected , at character index " + i + ".");
                        }
                        nc = true;
                        i += 1;
                    } else if (s.charAt(i) === "+") {
                        if (key.length) {
                            stage.push(key);
                            key = "";
                        }
                        if (op || nc) {
                            throw new Error("Failed to parse key combo. Unexpected + at character index " + i + ".");
                        }
                        op = true;
                        i += 1;
                    } else if (s.charAt(i) === ">") {
                        if (key.length) {
                            stage.push(key);
                            key = "";
                        }
                        if (stage.length) {
                            combo.push(stage);
                            stage = [];
                        }
                        if (op || nc) {
                            throw new Error("Failed to parse key combo. Unexpected > at character index " + i + ".");
                        }
                        op = true;
                        i += 1;
                    } else if (i < s.length - 1 && s.charAt(i) === "!" && (s.charAt(i + 1) === ">" || s.charAt(i + 1) === "," || s.charAt(i + 1) === "+")) {
                        key += s.charAt(i + 1);
                        op = false;
                        ws = false;
                        nc = false;
                        i += 2;
                    } else if (i < s.length && s.charAt(i) !== "+" && s.charAt(i) !== ">" && s.charAt(i) !== "," && s.charAt(i) !== " ") {
                        if (op === false && ws === true || nc === true) {
                            if (key.length) {
                                stage.push(key);
                                key = "";
                            }
                            if (stage.length) {
                                combo.push(stage);
                                stage = [];
                            }
                            if (combo.length) {
                                combos.push(combo);
                                combo = [];
                            }
                        }
                        op = false;
                        ws = false;
                        nc = false;
                        while (i < s.length && s.charAt(i) !== "+" && s.charAt(i) !== ">" && s.charAt(i) !== "," && s.charAt(i) !== " ") {
                            key += s.charAt(i);
                            i += 1;
                        }
                    } else {
                        i += 1;
                        continue;
                    }
                    if (i >= s.length) {
                        if (key.length) {
                            stage.push(key);
                            key = "";
                        }
                        if (stage.length) {
                            combo.push(stage);
                            stage = [];
                        }
                        if (combo.length) {
                            combos.push(combo);
                            combo = [];
                        }
                        break;
                    }
                }
                return combos;
            }
            function stringifyKeyCombo(keyComboArray) {
                var cI, ccI, output = [];
                if (typeof keyComboArray === "string") {
                    return keyComboArray;
                }
                if (typeof keyComboArray !== "object" || typeof keyComboArray.push !== "function") {
                    throw new Error("Cannot stringify key combo.");
                }
                for (cI = 0; cI < keyComboArray.length; cI += 1) {
                    output[cI] = [];
                    for (ccI = 0; ccI < keyComboArray[cI].length; ccI += 1) {
                        output[cI][ccI] = keyComboArray[cI][ccI].join(" + ");
                    }
                    output[cI] = output[cI].join(" > ");
                }
                return output.join(" ");
            }
            function getActiveKeys() {
                return [].concat(activeKeys);
            }
            function addActiveKey(keyName) {
                if (keyName.match(/\s/)) {
                    throw new Error("Cannot add key name " + keyName + " to active keys because it contains whitespace.");
                }
                if (activeKeys.indexOf(keyName) > -1) {
                    return;
                }
                activeKeys.push(keyName);
            }
            function removeActiveKey(keyName) {
                var keyCode = getKeyCode(keyName);
                if (keyCode === "91" || keyCode === "92") {
                    activeKeys = [];
                } else {
                    activeKeys.splice(activeKeys.indexOf(keyName), 1);
                }
            }
            function registerLocale(localeName, localeMap) {
                if (typeof localeName !== "string") {
                    throw new Error("Cannot register new locale. The locale name must be a string.");
                }
                if (typeof localeMap !== "object") {
                    throw new Error("Cannot register " + localeName + " locale. The locale map must be an object.");
                }
                if (typeof localeMap.map !== "object") {
                    throw new Error("Cannot register " + localeName + " locale. The locale map is invalid.");
                }
                if (!localeMap.macros) {
                    localeMap.macros = [];
                }
                locales[localeName] = localeMap;
            }
            function getSetLocale(localeName) {
                if (localeName) {
                    if (typeof localeName !== "string") {
                        throw new Error("Cannot set locale. The locale name must be a string.");
                    }
                    if (!locales[localeName]) {
                        throw new Error("Cannot set locale to " + localeName + " because it does not exist. If you would like to submit a " + localeName + " locale map for KeyboardJS please submit it at https://github.com/RobertWHurst/KeyboardJS/issues.");
                    }
                    map = locales[localeName].map;
                    macros = locales[localeName].macros;
                    locale = localeName;
                }
                return locale;
            }
            this.Keyboard = KeyboardJS;
        },
        "on": function(keyCombo, onDownCallback, onUpCallback) {
            this.Keyboard.on(keyCombo, onDownCallback, onUpCallback);
        },
        "getActiveKeys": function() {
            return this.Keyboard.activeKeys();
        }
    }
});

//end-------------------are.Keyboard---------------------end
