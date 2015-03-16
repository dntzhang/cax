/* KMD.js Kill AMD and CMD
 * By 当耐特 http://weibo.com/iamleizhang
 * Github: https://github.com/kmdjs/kmdjs
 * blog: http://www.cnblogs.com/iamzhanglei/
 * Team: http://alloyteam.github.io/
 * Many thanks to https://github.com/mishoo/UglifyJS2 
 * MIT Licensed.
 */
; (function () {


function isType(type) {
    return function (obj) {
        return Object.prototype.toString.call(obj) === '[object ' + type + ']'
    }
}

var isObject = isType('Object')
var isString = isType('String')
var isArray = Array.isArray || isType('Array')
var isFunction = isType('Function')
var isBoolean = isType('Boolean')

function remove(arr, item) {
    for (var i = arr.length - 1; i > -1; i--) {
        if (arr[i] == item) {
            arr.splice(i, 1);
            //   break;
        }
    }
}
function each(arry, action) {
    for (var i = arry.length - 1; i > -1; i--) {
        var result = action(arry[i],i);
        if (isBoolean(result) && !result) break;
    }
}

function lastIndexOf(str, word) {
    if (str.lastIndexOf) return str.lastIndexOf(word);
    var len = word.length;
    for (var i = str.length - 1 - len; i > -1; i--) {
        if (word === str.substr(i, len)) {
            return i;
        }
    }
    return -1;
}
function isInArray(arr, item) {
    for (var i = 0, j = arr.length; i < j; i++) {
        if (arr[i] == item) {
            return true;
        }
    }
    return false;
}

function log(msg) {
    try { console.log(msg); } catch (ex) { }
}
if ('function' !== typeof Array.prototype.reduce) {
    Array.prototype.reduce = function (callback, opt_initialValue) {
        'use strict';
        if (null === this || 'undefined' === typeof this) {
            // At the moment all modern browsers, that support strict mode, have
            // native implementation of Array.prototype.reduce. For instance, IE8
            // does not support strict mode, so this check is actually useless.
            throw new TypeError(
                'Array.prototype.reduce called on null or undefined');
        }
        if ('function' !== typeof callback) {
            throw new TypeError(callback + ' is not a function');
        }
        var index, value,
            length = this.length >>> 0,
            isValueSet = false;
        if (1 < arguments.length) {
            value = opt_initialValue;
            isValueSet = true;
        }
        for (index = 0; length > index; ++index) {
            if (this.hasOwnProperty(index)) {
                if (isValueSet) {
                    value = callback(value, this[index], index, this);
                }
                else {
                    value = this[index];
                    isValueSet = true;
                }
            }
        }
        if (!isValueSet) {
            throw new TypeError('Reduce of empty array with no initial value');
        }
        return value;
    };
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun /*, thisArg */) {
        "use strict";

        if (this === void 0 || this === null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function")
            throw new TypeError();

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t))
                    res.push(val);
            }
        }

        return res;
    };
}
var JSON=typeof JSON !== 'object' ? {} : JSON;
(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate()) + 'T' +
                    f(this.getUTCHours()) + ':' +
                    f(this.getUTCMinutes()) + ':' +
                    f(this.getUTCSeconds()) + 'Z'
                : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
            Boolean.prototype.toJSON = function () {
                return this.valueOf();
            };
    }

    var cx,
        escapable,
        gap,
        indent,
        meta,
        rep;


    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

        // Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

                // If the type is 'object', we might be dealing with an object or an array or
                // null.

            case 'object':

                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.

                if (!value) {
                    return 'null';
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0
                        ? '[]'
                        : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0
                    ? '{}'
                    : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return str('', { '': value });
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function (text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with '()' and 'new'
            // because they can cause invocation, and '=' because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
            // replace all simple value tokens with ']' characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or ']' or
            // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({ '': j }, '')
                    : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());


// 实现 ECMA-262, Edition 5, 15.4.4.19
// 参考: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {

        var T, A, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. 将O赋值为调用map方法的数组.
        var O = Object(this);

        // 2.将len赋值为数组O的长度.
        var len = O.length >>> 0;

        // 4.如果callback不是函数,则抛出TypeError异常.
        if ({}.toString.call(callback) != "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. 如果参数thisArg有值,则将T赋值为thisArg;否则T为undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. 创建新数组A,长度为原数组O长度len
        A = new Array(len);

        // 7. 将k赋值为0
        k = 0;

        // 8. 当 k < len 时,执行循环.
        while (k < len) {

            var kValue, mappedValue;

            //遍历O,k为原数组索引
            if (k in O) {

                //kValue为索引k对应的值.
                kValue = O[k];

                // 执行callback,this指向T,参数有三个.分别是kValue:值,k:索引,O:原数组.
                mappedValue = callback.call(T, kValue, k, O);

                // 返回值添加到新书组A中.
                A[k] = mappedValue;
            }
            // k自增1
            k++;
        }

        // 9. 返回新数组A
        return A;
    };
}
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        if (this === undefined || this === null) {
            throw new TypeError('"this" is null or not defined');
        }

        var length = this.length >>> 0; // Hack to convert object.length to a UInt32

        fromIndex = +fromIndex || 0;

        if (Math.abs(fromIndex) === Infinity) {
            fromIndex = 0;
        }

        if (fromIndex < 0) {
            fromIndex += length;
            if (fromIndex < 0) {
                fromIndex = 0;
            }
        }

        for (; fromIndex < length; fromIndex++) {
            if (this[fromIndex] === searchElement) {
                return fromIndex;
            }
        }

        return -1;
    };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function (callback, thisArg) {

        var T, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as the this value and
                // argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}
if (typeof Object.create != 'function') {
    (function () {
        var F = function () { };
        Object.create = function (o) {
            if (arguments.length > 1) {
                throw Error('Second argument not supported');
            }
            if (o === null) {
                return {};
                //throw Error('Cannot set a null [[Prototype]]');
            }
            if (typeof o != 'object') {
                throw TypeError('Argument must be an object');
            }
            F.prototype = o;
            return new F();
        };
    })();
};


if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}


(function (view) {
    "use strict";

    view.URL = view.URL || view.webkitURL;

    if (view.Blob && view.URL) {
        try {
            new Blob;
            return;
        } catch (e) { }
    }

    // Internally we use a BlobBuilder implementation to base Blob off of
    // in order to support older browsers that only have BlobBuilder
    var BlobBuilder = view.BlobBuilder || view.WebKitBlobBuilder || view.MozBlobBuilder || (function (view) {
        var
              get_class = function (object) {
                  return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
              }
            , FakeBlobBuilder = function BlobBuilder() {
                this.data = [];
            }
            , FakeBlob = function Blob(data, type, encoding) {
                this.data = data;
                this.size = data.length;
                this.type = type;
                this.encoding = encoding;
            }
            , FBB_proto = FakeBlobBuilder.prototype
            , FB_proto = FakeBlob.prototype
            , FileReaderSync = view.FileReaderSync
            , FileException = function (type) {
                this.code = this[this.name = type];
            }
            , file_ex_codes = (
                  "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR "
                + "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR"
            ).split(" ")
            , file_ex_code = file_ex_codes.length
            , real_URL = view.URL || view.webkitURL || view
            , real_create_object_URL = real_URL.createObjectURL
            , real_revoke_object_URL = real_URL.revokeObjectURL
            , URL = real_URL
            , btoa = view.btoa
            , atob = view.atob

            , ArrayBuffer = view.ArrayBuffer
            , Uint8Array = view.Uint8Array
        ;
        FakeBlob.fake = FB_proto.fake = true;
        while (file_ex_code--) {
            FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
        }
        if (!real_URL.createObjectURL) {
            URL = view.URL = {};
        }
        URL.createObjectURL = function (blob) {
            var
                  type = blob.type
                , data_URI_header
            ;
            if (type === null) {
                type = "application/octet-stream";
            }
            if (blob instanceof FakeBlob) {
                data_URI_header = "data:" + type;
                if (blob.encoding === "base64") {
                    return data_URI_header + ";base64," + blob.data;
                } else if (blob.encoding === "URI") {
                    return data_URI_header + "," + decodeURIComponent(blob.data);
                } if (btoa) {
                    return data_URI_header + ";base64," + btoa(blob.data);
                } else {
                    return data_URI_header + "," + encodeURIComponent(blob.data);
                }
            } else if (real_create_object_URL) {
                return real_create_object_URL.call(real_URL, blob);
            }
        };
        URL.revokeObjectURL = function (object_URL) {
            if (object_URL.substring(0, 5) !== "data:" && real_revoke_object_URL) {
                real_revoke_object_URL.call(real_URL, object_URL);
            }
        };
        FBB_proto.append = function (data/*, endings*/) {
            var bb = this.data;
            // decode data to a binary string
            if (Uint8Array && (data instanceof ArrayBuffer || data instanceof Uint8Array)) {
                var
                      str = ""
                    , buf = new Uint8Array(data)
                    , i = 0
                    , buf_len = buf.length
                ;
                for (; i < buf_len; i++) {
                    str += String.fromCharCode(buf[i]);
                }
                bb.push(str);
            } else if (get_class(data) === "Blob" || get_class(data) === "File") {
                if (FileReaderSync) {
                    var fr = new FileReaderSync;
                    bb.push(fr.readAsBinaryString(data));
                } else {
                    // async FileReader won't work as BlobBuilder is sync
                    throw new FileException("NOT_READABLE_ERR");
                }
            } else if (data instanceof FakeBlob) {
                if (data.encoding === "base64" && atob) {
                    bb.push(atob(data.data));
                } else if (data.encoding === "URI") {
                    bb.push(decodeURIComponent(data.data));
                } else if (data.encoding === "raw") {
                    bb.push(data.data);
                }
            } else {
                if (typeof data !== "string") {
                    data += ""; // convert unsupported types to strings
                }
                // decode UTF-16 to binary string
                bb.push(unescape(encodeURIComponent(data)));
            }
        };
        FBB_proto.getBlob = function (type) {
            if (!arguments.length) {
                type = null;
            }
            return new FakeBlob(this.data.join(""), type, "raw");
        };
        FBB_proto.toString = function () {
            return "[object BlobBuilder]";
        };
        FB_proto.slice = function (start, end, type) {
            var args = arguments.length;
            if (args < 3) {
                type = null;
            }
            return new FakeBlob(
                  this.data.slice(start, args > 1 ? end : this.data.length)
                , type
                , this.encoding
            );
        };
        FB_proto.toString = function () {
            return "[object Blob]";
        };
        FB_proto.close = function () {
            this.size = 0;
            delete this.data;
        };
        return FakeBlobBuilder;
    }(view));

    view.Blob = function (blobParts, options) {
        var type = options ? (options.type || "") : "";
        var builder = new BlobBuilder();
        if (blobParts) {
            for (var i = 0, len = blobParts.length; i < len; i++) {
                builder.append(blobParts[i]);
            }
        }
        return builder.getBlob(type);
    };
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content || this));
var isView = !1, isBuild = !1, isCombine = !1,isSplit=!1;
var initializing = false, fnTest = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;

// The base Class implementation (does nothing)
var __class = function () { };

// Create a new __class that inherits from this class
__class.extend = function (prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
        if (name != "statics") {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
              typeof _super[name] == "function" && fnTest.test(prop[name]) ?
              (function (name, fn) {
                  return function () {
                      var tmp = this._super;

                      // Add a new ._super() method that is the same method
                      // but on the super-class
                      this._super = _super[name];

                      // The method only need to be bound temporarily, so we
                      // remove it when we're done executing
                      var ret = fn.apply(this, arguments);
                      this._super = tmp;

                      return ret;
                  };
              })(name, prop[name]) :
              prop[name];
        }
    }

    // The dummy class constructor
    function __class() {
        // All construction is actually done in the init method
        if (!initializing && this.ctor)
            this.ctor.apply(this, arguments);
    }

    //继承父类的静态属性
    for (var key in this) {
        if (this.hasOwnProperty(key) && key != "extend")
            __class[key] = this[key];
    }
    //覆盖父类的静态属性
    //if (prop.statics) {
    //    for (var item in prop.statics) {
    //        if (prop.statics.hasOwnProperty(item))
    //            __class[item] = prop.statics[item];
    //    }
    //}
  

    // Populate our constructed prototype object
    __class.prototype = prototype;


    //覆盖父类的静态属性
    if (prop.statics) {
        for (var name in prop.statics) {
            if (prop.statics.hasOwnProperty(name)) {
                __class[name] = prop.statics[name];
                if (name == "ctor") {
                    if ((!isView) && (!isBuild) && (!isCombine) && (!isSplit)) __class[name]();
                }
            }

        }
    }

    // Enforce the constructor to be what we expect
    __class.prototype.constructor = __class;

    // And make this class extendable
    __class.extend = arguments.callee;

    //add implementation method
    __class.implement = function (prop) {
        for (var name in prop) {
            prototype[name] = prop[name];
        }
    };
    return __class;
};
function js_beautify(js_source_text, options) {

    var input, output, token_text, last_type, last_text, last_last_text, last_word, flags, flag_store, indent_string;
    var whitespace, wordchar, punct, parser_pos, line_starters, digits;
    var prefix, token_type, do_block_just_closed;
    var wanted_newline, just_added_newline, n_newlines;


    // Some interpreters have unexpected results with foo = baz || bar;
    options = options ? options : {};
    var opt_braces_on_own_line = options.braces_on_own_line ? options.braces_on_own_line : false;
    var opt_indent_size = options.indent_size ? options.indent_size : 4;
    var opt_indent_char = options.indent_char ? options.indent_char : ' ';
    var opt_preserve_newlines = typeof options.preserve_newlines === 'undefined' ? true : options.preserve_newlines;
    var opt_indent_level = options.indent_level ? options.indent_level : 0; // starting indentation
    var opt_space_after_anon_function = options.space_after_anon_function === 'undefined' ? false : options.space_after_anon_function;
    var opt_keep_array_indentation = typeof options.keep_array_indentation === 'undefined' ? true : options.keep_array_indentation;

    just_added_newline = false;

    // cache the source's length.
    var input_length = js_source_text.length;

    function trim_output() {
        while (output.length && (output[output.length - 1] === ' ' || output[output.length - 1] === indent_string)) {
            output.pop();
        }
    }

    function print_newline(ignore_repeated) {

        flags.eat_next_space = false;
        if (opt_keep_array_indentation && is_array(flags.mode)) {
            return;
        }

        ignore_repeated = typeof ignore_repeated === 'undefined' ? true : ignore_repeated;

        flags.if_line = false;
        trim_output();

        if (!output.length) {
            return; // no newline on start of file
        }

        if (output[output.length - 1] !== "\n" || !ignore_repeated) {
            just_added_newline = true;
            output.push("\n");
        }
        for (var i = 0; i < flags.indentation_level; i += 1) {
            output.push(indent_string);
        }
    }



    function print_single_space() {
        if (flags.eat_next_space) {
            flags.eat_next_space = false;
            return;
        }
        var last_output = ' ';
        if (output.length) {
            last_output = output[output.length - 1];
        }
        if (last_output !== ' ' && last_output !== '\n' && last_output !== indent_string) { // prevent occassional duplicate space
            output.push(' ');
        }
    }


    function print_token() {
        just_added_newline = false;
        flags.eat_next_space = false;
        output.push(token_text);
    }

    function indent() {
        flags.indentation_level += 1;
    }


    function remove_indent() {
        if (output.length && output[output.length - 1] === indent_string) {
            output.pop();
        }
    }

    function set_mode(mode) {
        if (flags) {
            flag_store.push(flags);
        }
        flags = {
            mode: mode,
            var_line: false,
            var_line_tainted: false,
            var_line_reindented: false,
            in_html_comment: false,
            if_line: false,
            in_case: false,
            eat_next_space: false,
            indentation_baseline: -1,
            indentation_level: (flags ? flags.indentation_level + ((flags.var_line && flags.var_line_reindented) ? 1 : 0) : opt_indent_level)
        };
    }

    function is_expression(mode) {
        return mode === '[EXPRESSION]' || mode === '[INDENTED-EXPRESSION]' || mode === '(EXPRESSION)';
    }

    function is_array(mode) {
        return mode === '[EXPRESSION]' || mode === '[INDENTED-EXPRESSION]';
    }

    function restore_mode() {
        do_block_just_closed = flags.mode === 'DO_BLOCK';
        if (flag_store.length > 0) {
            flags = flag_store.pop();
        }
    }


    function in_array(what, arr) {
        for (var i = 0; i < arr.length; i += 1) {
            if (arr[i] === what) {
                return true;
            }
        }
        return false;
    }

    // Walk backwards from the colon to find a '?' (colon is part of a ternary op)
    // or a '{' (colon is part of a class literal).  Along the way, keep track of
    // the blocks and expressions we pass so we only trigger on those chars in our
    // own level, and keep track of the colons so we only trigger on the matching '?'.


    function is_ternary_op() {
        var level = 0,
            colon_count = 0;
        for (var i = output.length - 1; i >= 0; i--) {
            switch (output[i]) {
                case ':':
                    if (level === 0) {
                        colon_count++;
                    }
                    break;
                case '?':
                    if (level === 0) {
                        if (colon_count === 0) {
                            return true;
                        } else {
                            colon_count--;
                        }
                    }
                    break;
                case '{':
                    if (level === 0) {
                        return false;
                    }
                    level--;
                    break;
                case '(':
                case '[':
                    level--;
                    break;
                case ')':
                case ']':
                case '}':
                    level++;
                    break;
            }
        }
    }

    function get_next_token() {
        n_newlines = 0;

        if (parser_pos >= input_length) {
            return ['', 'TK_EOF'];
        }

        wanted_newline = false;

        var c = input.charAt(parser_pos);
        parser_pos += 1;


        var keep_whitespace = opt_keep_array_indentation && is_array(flags.mode);

        if (keep_whitespace) {

            //
            // slight mess to allow nice preservation of array indentation and reindent that correctly
            // first time when we get to the arrays:
            // var a = [
            // ....'something'
            // we make note of whitespace_count = 4 into flags.indentation_baseline
            // so we know that 4 whitespaces in original source match indent_level of reindented source
            //
            // and afterwards, when we get to
            //    'something,
            // .......'something else'
            // we know that this should be indented to indent_level + (7 - indentation_baseline) spaces
            //
            var whitespace_count = 0;

            while (in_array(c, whitespace)) {

                if (c === "\n") {
                    trim_output();
                    output.push("\n");
                    just_added_newline = true;
                    whitespace_count = 0;
                } else {
                    if (c === '\t') {
                        whitespace_count += 4;
                    } else {
                        whitespace_count += 1;
                    }
                }

                if (parser_pos >= input_length) {
                    return ['', 'TK_EOF'];
                }

                c = input.charAt(parser_pos);
                parser_pos += 1;

            }
            if (flags.indentation_baseline === -1) {
                flags.indentation_baseline = whitespace_count;
            }

            if (just_added_newline) {
                for (var i = 0; i < flags.indentation_level + 1; i += 1) {
                    output.push(indent_string);
                }
                if (flags.indentation_baseline !== -1) {
                    for (var i = 0; i < whitespace_count - flags.indentation_baseline; i++) {
                        output.push(' ');
                    }
                }
            }

        } else {
            while (in_array(c, whitespace)) {

                if (c === "\n") {
                    n_newlines += 1;
                }


                if (parser_pos >= input_length) {
                    return ['', 'TK_EOF'];
                }

                c = input.charAt(parser_pos);
                parser_pos += 1;

            }

            if (opt_preserve_newlines) {
                if (n_newlines > 1) {
                    for (var i = 0; i < n_newlines; i += 1) {
                        print_newline(i === 0);
                        just_added_newline = true;
                    }
                }
            }
            wanted_newline = n_newlines > 0;
        }


        if (in_array(c, wordchar)) {
            if (parser_pos < input_length) {
                while (in_array(input.charAt(parser_pos), wordchar)) {
                    c += input.charAt(parser_pos);
                    parser_pos += 1;
                    if (parser_pos === input_length) {
                        break;
                    }
                }
            }

            // small and surprisingly unugly hack for 1E-10 representation
            if (parser_pos !== input_length && c.match(/^[0-9]+[Ee]$/) && (input.charAt(parser_pos) === '-' || input.charAt(parser_pos) === '+')) {

                var sign = input.charAt(parser_pos);
                parser_pos += 1;

                var t = get_next_token(parser_pos);
                c += sign + t[0];
                return [c, 'TK_WORD'];
            }

            if (c === 'in') { // hack for 'in' operator
                return [c, 'TK_OPERATOR'];
            }
            if (wanted_newline && last_type !== 'TK_OPERATOR' && !flags.if_line && (opt_preserve_newlines || last_text !== 'var')) {
                print_newline();
            }
            return [c, 'TK_WORD'];
        }

        if (c === '(' || c === '[') {
            return [c, 'TK_START_EXPR'];
        }

        if (c === ')' || c === ']') {
            return [c, 'TK_END_EXPR'];
        }

        if (c === '{') {
            return [c, 'TK_START_BLOCK'];
        }

        if (c === '}') {
            return [c, 'TK_END_BLOCK'];
        }

        if (c === ';') {
            return [c, 'TK_SEMICOLON'];
        }

        if (c === '/') {
            var comment = '';
            // peek for comment /* ... */
            var inline_comment = true;
            if (input.charAt(parser_pos) === '*') {
                parser_pos += 1;
                if (parser_pos < input_length) {
                    while (!(input.charAt(parser_pos) === '*' && input.charAt(parser_pos + 1) && input.charAt(parser_pos + 1) === '/') && parser_pos < input_length) {
                        c = input.charAt(parser_pos);
                        comment += c;
                        if (c === '\x0d' || c === '\x0a') {
                            inline_comment = false;
                        }
                        parser_pos += 1;
                        if (parser_pos >= input_length) {
                            break;
                        }
                    }
                }
                parser_pos += 2;
                if (inline_comment) {
                    return ['/*' + comment + '*/', 'TK_INLINE_COMMENT'];
                } else {
                    return ['/*' + comment + '*/', 'TK_BLOCK_COMMENT'];
                }
            }
            // peek for comment // ...
            if (input.charAt(parser_pos) === '/') {
                comment = c;
                while (input.charAt(parser_pos) !== "\x0d" && input.charAt(parser_pos) !== "\x0a") {
                    comment += input.charAt(parser_pos);
                    parser_pos += 1;
                    if (parser_pos >= input_length) {
                        break;
                    }
                }
                parser_pos += 1;
                if (wanted_newline) {
                    print_newline();
                }
                return [comment, 'TK_COMMENT'];
            }

        }

        if (c === "'" || // string
        c === '"' || // string
        (c === '/' && ((last_type === 'TK_WORD' && in_array(last_text, ['return', 'do'])) || (last_type === 'TK_START_EXPR' || last_type === 'TK_START_BLOCK' || last_type === 'TK_END_BLOCK' || last_type === 'TK_OPERATOR' || last_type === 'TK_EQUALS' || last_type === 'TK_EOF' || last_type === 'TK_SEMICOLON')))) { // regexp
            var sep = c;
            var esc = false;
            var resulting_string = c;

            if (parser_pos < input_length) {
                if (sep === '/') {
                    //
                    // handle regexp separately...
                    //
                    var in_char_class = false;
                    while (esc || in_char_class || input.charAt(parser_pos) !== sep) {
                        resulting_string += input.charAt(parser_pos);
                        if (!esc) {
                            esc = input.charAt(parser_pos) === '\\';
                            if (input.charAt(parser_pos) === '[') {
                                in_char_class = true;
                            } else if (input.charAt(parser_pos) === ']') {
                                in_char_class = false;
                            }
                        } else {
                            esc = false;
                        }
                        parser_pos += 1;
                        if (parser_pos >= input_length) {
                            // incomplete string/rexp when end-of-file reached. 
                            // bail out with what had been received so far.
                            return [resulting_string, 'TK_STRING'];
                        }
                    }

                } else {
                    //
                    // and handle string also separately
                    //
                    while (esc || input.charAt(parser_pos) !== sep) {
                        resulting_string += input.charAt(parser_pos);
                        if (!esc) {
                            esc = input.charAt(parser_pos) === '\\';
                        } else {
                            esc = false;
                        }
                        parser_pos += 1;
                        if (parser_pos >= input_length) {
                            // incomplete string/rexp when end-of-file reached. 
                            // bail out with what had been received so far.
                            return [resulting_string, 'TK_STRING'];
                        }
                    }
                }



            }

            parser_pos += 1;

            resulting_string += sep;

            if (sep === '/') {
                // regexps may have modifiers /regexp/MOD , so fetch those, too
                while (parser_pos < input_length && in_array(input.charAt(parser_pos), wordchar)) {
                    resulting_string += input.charAt(parser_pos);
                    parser_pos += 1;
                }
            }
            return [resulting_string, 'TK_STRING'];
        }

        if (c === '#') {
            // Spidermonkey-specific sharp variables for circular references
            // https://developer.mozilla.org/En/Sharp_variables_in_JavaScript
            // http://mxr.mozilla.org/mozilla-central/source/js/src/jsscan.cpp around line 1935
            var sharp = '#';
            if (parser_pos < input_length && in_array(input.charAt(parser_pos), digits)) {
                do {
                    c = input.charAt(parser_pos);
                    sharp += c;
                    parser_pos += 1;
                } while (parser_pos < input_length && c !== '#' && c !== '=');
                if (c === '#') {
                    // 
                } else if (input.charAt(parser_pos) == '[' && input.charAt(parser_pos + 1) === ']') {
                    sharp += '[]';
                    parser_pos += 2;
                } else if (input.charAt(parser_pos) == '{' && input.charAt(parser_pos + 1) === '}') {
                    sharp += '{}';
                    parser_pos += 2;
                }
                return [sharp, 'TK_WORD'];
            }
        }

        if (c === '<' && input.substring(parser_pos - 1, parser_pos + 3) === '<!--') {
            parser_pos += 3;
            flags.in_html_comment = true;
            return ['<!--', 'TK_COMMENT'];
        }

        if (c === '-' && flags.in_html_comment && input.substring(parser_pos - 1, parser_pos + 2) === '-->') {
            flags.in_html_comment = false;
            parser_pos += 2;
            if (wanted_newline) {
                print_newline();
            }
            return ['-->', 'TK_COMMENT'];
        }

        if (in_array(c, punct)) {
            while (parser_pos < input_length && in_array(c + input.charAt(parser_pos), punct)) {
                c += input.charAt(parser_pos);
                parser_pos += 1;
                if (parser_pos >= input_length) {
                    break;
                }
            }

            if (c === '=') {
                return [c, 'TK_EQUALS'];
            } else {
                return [c, 'TK_OPERATOR'];
            }
        }

        return [c, 'TK_UNKNOWN'];
    }

    //----------------------------------
    indent_string = '';
    while (opt_indent_size > 0) {
        indent_string += opt_indent_char;
        opt_indent_size -= 1;
    }

    input = js_source_text;

    last_word = ''; // last 'TK_WORD' passed
    last_type = 'TK_START_EXPR'; // last token type
    last_text = ''; // last token text
    last_last_text = ''; // pre-last token text
    output = [];

    do_block_just_closed = false;

    whitespace = "\n\r\t ".split('');
    wordchar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$'.split('');
    digits = '0123456789'.split('');

    punct = '+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! !! , : ? ^ ^= |= ::'.split(' ');

    // words which should always start on new line.
    line_starters = 'continue,try,throw,return,var,if,switch,case,default,for,while,break,function'.split(',');

    // states showing if we are currently in expression (i.e. "if" case) - 'EXPRESSION', or in usual block (like, procedure), 'BLOCK'.
    // some formatting depends on that.
    flag_store = [];
    set_mode('BLOCK');

    parser_pos = 0;
    while (true) {
        var t = get_next_token(parser_pos);
        token_text = t[0];
        token_type = t[1];
        if (token_type === 'TK_EOF') {
            break;
        }

        switch (token_type) {

            case 'TK_START_EXPR':

                if (token_text === '[') {

                    if (last_type === 'TK_WORD' || last_text === ')') {
                        // this is array index specifier, break immediately
                        // a[x], fn()[x]
                        if (in_array(last_text, line_starters)) {
                            print_single_space();
                        }
                        set_mode('(EXPRESSION)');
                        print_token();
                        break;
                    }

                    if (flags.mode === '[EXPRESSION]' || flags.mode === '[INDENTED-EXPRESSION]') {
                        if (last_last_text === ']' && last_text === ',') {
                            // ], [ goes to new line
                            if (flags.mode === '[EXPRESSION]') {
                                flags.mode = '[INDENTED-EXPRESSION]';
                                if (!opt_keep_array_indentation) {
                                    indent();
                                }
                            }
                            set_mode('[EXPRESSION]');
                            if (!opt_keep_array_indentation) {
                                print_newline();
                            }
                        } else if (last_text === '[') {
                            if (flags.mode === '[EXPRESSION]') {
                                flags.mode = '[INDENTED-EXPRESSION]';
                                if (!opt_keep_array_indentation) {
                                    indent();
                                }
                            }
                            set_mode('[EXPRESSION]');

                            if (!opt_keep_array_indentation) {
                                print_newline();
                            }
                        } else {
                            set_mode('[EXPRESSION]');
                        }
                    } else {
                        set_mode('[EXPRESSION]');
                    }



                } else {
                    set_mode('(EXPRESSION)');
                }

                if (last_text === ';' || last_type === 'TK_START_BLOCK') {
                    print_newline();
                } else if (last_type === 'TK_END_EXPR' || last_type === 'TK_START_EXPR' || last_type === 'TK_END_BLOCK') {
                    // do nothing on (( and )( and ][ and ]( ..
                } else if (last_type !== 'TK_WORD' && last_type !== 'TK_OPERATOR') {
                    print_single_space();
                } else if (last_word === 'function') {
                    // function() vs function ()
                    if (opt_space_after_anon_function) {
                        print_single_space();
                    }
                } else if (in_array(last_text, line_starters) || last_text === 'catch') {
                    print_single_space();
                }
                print_token();

                break;

            case 'TK_END_EXPR':
                if (token_text === ']') {
                    if (opt_keep_array_indentation) {
                        if (last_text === '}') {
                            // trim_output();
                            // print_newline(true);
                            remove_indent();
                            print_token();
                            restore_mode();
                            break;
                        }
                    } else {
                        if (flags.mode === '[INDENTED-EXPRESSION]') {
                            if (last_text === ']') {
                                restore_mode();
                                print_newline();
                                print_token();
                                break;
                            }
                        }
                    }
                }
                restore_mode();
                print_token();
                break;

            case 'TK_START_BLOCK':

                if (last_word === 'do') {
                    set_mode('DO_BLOCK');
                } else {
                    set_mode('BLOCK');
                }
                if (opt_braces_on_own_line) {
                    if (last_type !== 'TK_OPERATOR') {
                        print_newline(true);
                    }
                    print_token();
                    indent();
                } else {
                    if (last_type !== 'TK_OPERATOR' && last_type !== 'TK_START_EXPR') {
                        if (last_type === 'TK_START_BLOCK') {
                            print_newline();
                        } else {
                            print_single_space();
                        }
                    }
                    indent();
                    print_token();
                }

                break;

            case 'TK_END_BLOCK':
                restore_mode();
                if (opt_braces_on_own_line) {
                    print_newline();
                    if (flags.var_line_reindented) {
                        output.push(indent_string);
                    }
                    print_token();
                } else {
                    if (last_type === 'TK_START_BLOCK') {
                        // nothing
                        if (just_added_newline) {
                            remove_indent();
                        } else {
                            // {}
                            trim_output();
                        }
                    } else {
                        print_newline();
                        if (flags.var_line_reindented) {
                            output.push(indent_string);
                        }
                    }
                    print_token();
                }
                break;

            case 'TK_WORD':

                // no, it's not you. even I have problems understanding how this works
                // and what does what.
                if (do_block_just_closed) {
                    // do {} ## while ()
                    print_single_space();
                    print_token();
                    print_single_space();
                    do_block_just_closed = false;
                    break;
                }

                if (token_text === 'function') {
                    if ((just_added_newline || last_text == ';') && last_text !== '{') {
                        // make sure there is a nice clean space of at least one blank line
                        // before a new function definition
                        n_newlines = just_added_newline ? n_newlines : 0;

                        for (var i = 0; i < 2 - n_newlines; i++) {
                            print_newline(false);
                        }

                    }
                }
                if (token_text === 'case' || token_text === 'default') {
                    if (last_text === ':') {
                        // switch cases following one another
                        remove_indent();
                    } else {
                        // case statement starts in the same line where switch
                        flags.indentation_level--;
                        print_newline();
                        flags.indentation_level++;
                    }
                    print_token();
                    flags.in_case = true;
                    break;
                }

                prefix = 'NONE';

                if (last_type === 'TK_END_BLOCK') {
                    if (!in_array(token_text.toLowerCase(), ['else', 'catch', 'finally'])) {
                        prefix = 'NEWLINE';
                    } else {
                        if (opt_braces_on_own_line) {
                            prefix = 'NEWLINE';
                        } else {
                            prefix = 'SPACE';
                            print_single_space();
                        }
                    }
                } else if (last_type === 'TK_SEMICOLON' && (flags.mode === 'BLOCK' || flags.mode === 'DO_BLOCK')) {
                    prefix = 'NEWLINE';
                } else if (last_type === 'TK_SEMICOLON' && is_expression(flags.mode)) {
                    prefix = 'SPACE';
                } else if (last_type === 'TK_STRING') {
                    prefix = 'NEWLINE';
                } else if (last_type === 'TK_WORD') {
                    prefix = 'SPACE';
                } else if (last_type === 'TK_START_BLOCK') {
                    prefix = 'NEWLINE';
                } else if (last_type === 'TK_END_EXPR') {
                    print_single_space();
                    prefix = 'NEWLINE';
                }

                if (last_type !== 'TK_END_BLOCK' && in_array(token_text.toLowerCase(), ['else', 'catch', 'finally'])) {
                    print_newline();
                } else if (in_array(token_text, line_starters) || prefix === 'NEWLINE') {
                    if (last_text === 'else') {
                        // no need to force newline on else break
                        print_single_space();
                    } else if ((last_type === 'TK_START_EXPR' || last_text === '=' || last_text === ',') && token_text === 'function') {
                        // no need to force newline on 'function': (function
                        // DONOTHING
                    } else if (last_text === 'return' || last_text === 'throw') {
                        // no newline between 'return nnn'
                        print_single_space();
                    } else if (last_type !== 'TK_END_EXPR') {
                        if ((last_type !== 'TK_START_EXPR' || token_text !== 'var') && last_text !== ':') {
                            // no need to force newline on 'var': for (var x = 0...)
                            if (token_text === 'if' && last_word === 'else' && last_text !== '{') {
                                // no newline for } else if {
                                print_single_space();
                            } else {
                                print_newline();
                            }
                        }
                    } else {
                        if (in_array(token_text, line_starters) && last_text !== ')') {
                            print_newline();
                        }
                    }
                } else if (prefix === 'SPACE') {
                    print_single_space();
                }
                print_token();
                last_word = token_text;

                if (token_text === 'var') {
                    flags.var_line = true;
                    flags.var_line_reindented = false;
                    flags.var_line_tainted = false;
                }

                if (token_text === 'if' || token_text === 'else') {
                    flags.if_line = true;
                }

                break;

            case 'TK_SEMICOLON':

                print_token();
                flags.var_line = false;
                flags.var_line_reindented = false;
                break;

            case 'TK_STRING':

                if (last_type === 'TK_START_BLOCK' || last_type === 'TK_END_BLOCK' || last_type === 'TK_SEMICOLON') {
                    print_newline();
                } else if (last_type === 'TK_WORD') {
                    print_single_space();
                }
                print_token();
                break;

            case 'TK_EQUALS':
                if (flags.var_line) {
                    // just got an '=' in a var-line, different formatting/line-breaking, etc will now be done
                    flags.var_line_tainted = true;
                }
                print_single_space();
                print_token();
                print_single_space();
                break;

            case 'TK_OPERATOR':

                var space_before = true;
                var space_after = true;

                if (flags.var_line && token_text === ',' && (is_expression(flags.mode))) {
                    // do not break on comma, for(var a = 1, b = 2)
                    flags.var_line_tainted = false;
                }

                if (flags.var_line) {
                    if (token_text === ',') {
                        if (flags.var_line_tainted) {
                            print_token();
                            print_newline();
                            output.push(indent_string);
                            flags.var_line_reindented = true;
                            flags.var_line_tainted = false;
                            break;
                        } else {
                            flags.var_line_tainted = false;
                        }
                        // } else if (token_text === ':') {
                        // hmm, when does this happen? tests don't catch this
                        // flags.var_line = false;
                    }
                }

                if (last_text === 'return' || last_text === 'throw') {
                    // "return" had a special handling in TK_WORD. Now we need to return the favor
                    print_single_space();
                    print_token();
                    break;
                }

                if (token_text === ':' && flags.in_case) {
                    print_token(); // colon really asks for separate treatment
                    print_newline();
                    flags.in_case = false;
                    break;
                }

                if (token_text === '::') {
                    // no spaces around exotic namespacing syntax operator
                    print_token();
                    break;
                }

                if (token_text === ',') {
                    if (flags.var_line) {
                        if (flags.var_line_tainted) {
                            print_token();
                            print_newline();
                            flags.var_line_tainted = false;
                        } else {
                            print_token();
                            print_single_space();
                        }
                    } else if (last_type === 'TK_END_BLOCK' && flags.mode !== "(EXPRESSION)") {
                        print_token();
                        print_newline();
                    } else {
                        if (flags.mode === 'BLOCK') {
                            print_token();
                            print_newline();
                        } else {
                            // EXPR or DO_BLOCK
                            print_token();
                            print_single_space();
                        }
                    }
                    break;
                    // } else if (in_array(token_text, ['--', '++', '!']) || (in_array(token_text, ['-', '+']) && (in_array(last_type, ['TK_START_BLOCK', 'TK_START_EXPR', 'TK_EQUALS']) || in_array(last_text, line_starters) || in_array(last_text, ['==', '!=', '+=', '-=', '*=', '/=', '+', '-'])))) { 
                } else if (in_array(token_text, ['--', '++', '!']) || (in_array(token_text, ['-', '+']) && (in_array(last_type, ['TK_START_BLOCK', 'TK_START_EXPR', 'TK_EQUALS', 'TK_OPERATOR']) || in_array(last_text, line_starters)))) {
                    // unary operators (and binary +/- pretending to be unary) special cases

                    space_before = false;
                    space_after = false;

                    if (last_text === ';' && is_expression(flags.mode)) {
                        // for (;; ++i)
                        //        ^^^
                        space_before = true;
                    }
                    if (last_type === 'TK_WORD' && in_array(last_text, line_starters)) {
                        space_before = true;
                    }

                    if (flags.mode === 'BLOCK' && (last_text === '{' || last_text === ';')) {
                        // { foo; --i }
                        // foo(); --bar;
                        print_newline();
                    }
                } else if (token_text === '.') {
                    // decimal digits or object.property
                    space_before = false;

                } else if (token_text === ':') {
                    if (!is_ternary_op()) {
                        space_before = false;
                    }
                }
                if (space_before) {
                    print_single_space();
                }

                print_token();

                if (space_after) {
                    print_single_space();
                }

                if (token_text === '!') {
                    // flags.eat_next_space = true;
                }

                break;

            case 'TK_BLOCK_COMMENT':

                var lines = token_text.split(/\x0a|\x0d\x0a/);

                if (/^\/\*\*/.test(token_text)) {
                    // javadoc: reformat and reindent
                    print_newline();
                    output.push(lines[0]);
                    for (var i = 1; i < lines.length; i++) {
                        print_newline();
                        output.push(' ');
                        output.push(lines[i].replace(/^\s\s*|\s\s*$/, ''));
                    }

                } else {
                    // simple block comment: leave intact
                    if (lines.length > 1) {
                        // multiline comment block starts with a new line
                        print_newline();
                        trim_output();
                    } else {
                        // single-line /* comment */ stays where it is
                        print_single_space();
                    }
                    for (var i = 0; i < lines.length; i++) {
                        output.push(lines[i]);
                        output.push('\n');
                    }

                }
                print_newline();
                break;

            case 'TK_INLINE_COMMENT':

                print_single_space();
                print_token();
                if (is_expression(flags.mode)) {
                    print_single_space();
                } else {
                    print_newline();
                }
                break;

            case 'TK_COMMENT':

                // print_newline();
                if (wanted_newline) {
                    print_newline();
                } else {
                    print_single_space();
                }
                print_token();
                print_newline();
                break;

            case 'TK_UNKNOWN':
                print_token();
                break;
        }

        last_last_text = last_text;
        last_type = token_type;
        last_text = token_text;
    }

    return output.join('').replace(/[\n ]+$/, '');

}
Function.prototype.extend = function () {
    function a() { }
    a.prototype = this.prototype;
    return new a()
};
Array.prototype.size = function () {
    return this.length
};
Array.prototype.contains = function (a) {
    return this.indexOf(a) != -1
};
Array.prototype.containsAll = function (b) {
    for (var a = 0; a < b.length; a++) {
        if (!this.contains(b[a])) {
            return false
        }
    }
    return true
};
Array.prototype.isEmpty = function () {
    return this.length == 0
};
Array.prototype.clone = function () {
    var b = new Array(this.length);
    for (var a = 0; a < this.length; a++) {
        b[a] = this[a]
    }
    return b
};
Array.prototype.clear = function () {
    this.length = 0
};
Array.prototype.add = function (a, b) {
    if (arguments.length == 2) {
        this.splice(a, 0, b)
    } else {
        this.push(a)
    }
};
Array.prototype.addAll = function (b, d) {
    if (arguments.length == 2) {
        var e = this.length,
		a = d.length;
        this.length += a;
        for (var c = e - 1; c >= b; c--) {
            this[c + a] = this[c]
        }
        for (var c = 0; c < a; c++) {
            this[c + b] = d[c]
        }
    } else {
        for (var c = 0; c < b.length; c++) {
            this.push(b[c])
        }
    }
};
Array.prototype.remove = function (b) {
    var a = this.indexOf(b);
    if (a != -1) {
        this.splice(a, 1);
        return true
    }
    return false
};
Array.prototype.removeAll = function (b) {
    for (var a = 0; a < b.length; a++) {
        this.remove(b[a])
    }
};
Array.prototype.retainAll = function (b) {
    for (var a = this.length - 1; a >= 0; a--) {
        if (!b.contains(this[a])) {
            this.splice(a, 1)
        }
    }
};
if (typeof CanvasRenderingContext2D != "undefined") {
    if (!CanvasRenderingContext2D.prototype.measureText) {
        CanvasRenderingContext2D.prototype.measureText = function (a) {
            this.mozTextStyle = this.font;
            return {
                width: this.mozMeasureText(a)
            }
        }
    }
    if (!CanvasRenderingContext2D.prototype.fillText) {
        CanvasRenderingContext2D.prototype.fillText = function (b, a, c) {
            this.mozTextStyle = this.font;
            this.save();
            this.translate(a, c);
            this.mozDrawText(b);
            this.restore()
        }
    }
}
function Tree() {
    this.clear()
}
Tree._Node = function (a, b) {
    this.outgoing = [];
    this.incoming = [];
    this.children = [];
    this.tree = a;
    this.index = a.nodes.length;
    this.parent = b;
    a.nodes.add(this)
};
Tree._Node.prototype.addChild = function () {
    var a = new Tree._Node(this.tree, this);
    this.children.add(a);
    return a
};
Tree._Node.prototype.removeChild = function (c) {
    this.children.remove(c);
    c.clearEdges();
    c.clearChildren();
    this.tree.nodes.splice(c.index, 1);
    for (var a = c.index, b = this.tree.nodes.length; a < b; a++) {
        this.tree.nodes[a].index = a
    }
};
Tree._Node.prototype.clearChildren = function () {
    for (var a = 0; a < this.children.length; a++) {
        this.removeChild(this.children[a])
    }
};
Tree._Node.prototype.addEdge = function (a) {
    a.incoming.push(this);
    this.outgoing.push(a)
};
Tree._Node.prototype.removeEdge = function (a) {
    if (a.incoming.remove(this)) {
        this.outgoing.remove(a);
        return true
    }
    return false
};
Tree._Node.prototype.clearEdges = function () {
    for (var a = 0; a < this.incoming.length; a++) {
        this.incoming[a].outgoing.remove(this)
    }
    for (var a = 0; a < this.outgoing.length; a++) {
        this.outgoing[a].incoming.remove(this)
    }
    this.incoming = [];
    this.outgoing = []
};
Tree._Node.prototype.ancestors = function () {
    var b = [];
    var c = this,
	a = this.parent;
    while (a != null) {
        b.add(c);
        c = a;
        a = a.parent
    }
    b.add(c);
    return b
};
Tree.prototype.clear = function () {
    this.nodes = [];
    this.root = new Tree._Node(this, null)
};
Tree.prototype.leastCommonAncestor = function (f, d) {
    if (f == d) {
        return f
    }
    var e = f.ancestors();
    var c = d.ancestors();
    var g = e.pop();
    var h = c.pop();
    var i = null;
    while (g == h) {
        i = g;
        g = e.pop();
        h = c.pop()
    }
    return i
};
function Vector(a, b) {
    this.x = a;
    this.y = b
}
Vector.prototype.distance = function (a, d) {
    var c = this.x - a;
    var b = this.y - d;
    return Math.sqrt(c * c + b * b)
};
Vector.prototype.perp = function () {
    return new Vector(-this.y, this.x)
};
Vector.prototype.dot = function (a) {
    return this.x * a.x + this.y * a.y
};
Vector.prototype.cross = function (a) {
    return this.x * a.y - this.y * a.x
};
Vector.prototype.toString = function () {
    return "(" + this.x + ", " + this.y + ")"
};
function Path() { }
Path.Segment = function (b, a) {
    this.type = b;
    this.points = a
};
Path.SEG_MOVE = 1;
Path.SEG_LINE = 2;
Path.SEG_BEZIER = 3;
Path.prototype._path = function (c) {
    c.beginPath();
    var a = this.segments();
    for (var b = 0; b < a.length; b++) {
        var d = a[b];
        switch (d.type) {
            case Path.SEG_MOVE:
                var f = d.points[0];
                c.moveTo(f.x, f.y);
                break;
            case Path.SEG_LINE:
                var f = d.points[0];
                c.lineTo(f.x, f.y);
                break;
            case Path.SEG_BEZIER:
                var f = d.points[0];
                var g = d.points[1];
                var e = d.points[2];
                c.bezierCurveTo(g.x, g.y, e.x, e.y, f.x, f.y);
                break
        }
    }
};
Path.prototype.fill = function (a) {
    this._path(a);
    a.fill();
    return this
};
Path.prototype.stroke = function (a) {
    this._path(a);
    a.stroke();
    return this
};
Path.prototype.contains = function (b, a, c) {
    this._path(b);
    return b.isPointInPath(a, c)
};
Path.prototype.segments = function () {
    if (!this._segments) {
        this._segments = []
    }
    return this._segments
};
Path.prototype.moveTo = function (a, b) {
    this.segments().add(new Path.Segment(Path.SEG_MOVE, [new Vector(a, b)]));
    return this
};
Path.prototype.lineTo = function (a, b) {
    this.segments().add(new Path.Segment(Path.SEG_LINE, [new Vector(a, b)]));
    return this
};
Path.prototype.bezierCurveTo = function (c, b, e, d, a, f) {
    this.segments().add(new Path.Segment(Path.SEG_BEZIER, [new Vector(a, f), new Vector(c, b), new Vector(e, d)]));
    return this
};
Path.prototype.intersects = function (n, c) {
    var k = this._clone().flatten(c)._segments;
    var h = n._clone().flatten(c)._segments;
    for (var e = 0; e < k.length; e++) {
        if (k[e].type != Path.SEG_LINE) {
            continue
        }
        var m = k[e - 1].points[0];
        var l = k[e].points[0];
        for (var d = 0; d < h.length; d++) {
            if (h[d].type != Path.SEG_LINE) {
                continue
            }
            var g = h[d - 1].points[0];
            var f = h[d].points[0];
            if (Line.intersect(m, l, g, f)) {
                return true
            }
        }
    }
    return false
};
Path.prototype.transform = function (e) {
    var b = this.segments();
    for (var c = 0; c < b.length; c++) {
        var d = b[c];
        for (var a = 0; a < d.points.length; a++) {
            d.points[a] = e.transform(d.points[a])
        }
    }
    return this
};
Path.prototype.flat = function () {
    var a = this.segments();
    for (var b = 0; b < a.length; b++) {
        if (a[b].type == Path.SEG_BEZIER) {
            return false
        }
    }
    return true
};
Path.prototype.flatten = function (d) {
    var e = this;
    if (this.flat()) {
        return this
    }
    if (!d) {
        d = 1
    }
    function g(q, p, o, n) {
        var t = new Line(q.x, q.y, n.x, n.y);
        if ((t.distance(p.x, p.y) <= d) && (t.distance(o.x, o.y) <= d)) {
            e.lineTo(n.x, n.y)
        } else {
            var l = q;
            var h = Path._weightCurve(Path._bezierLeft[1], q, p, o, n);
            var r = Path._weightCurve(Path._bezierLeft[2], q, p, o, n);
            var k = Path._weightCurve(Path._bezierLeft[3], q, p, o, n);
            g(l, h, r, k);
            var j = k;
            var s = Path._weightCurve(Path._bezierRight[1], q, p, o, n);
            var m = Path._weightCurve(Path._bezierRight[2], q, p, o, n);
            var i = n;
            g(j, s, m, i)
        }
    }
    var a = this.segments();
    this._segments = [];
    for (var b = 0; b < a.length; b++) {
        var c = a[b];
        switch (c.type) {
            case Path.SEG_BEZIER:
                var f = a[b - 1];
                g(f.points[0], c.points[1], c.points[2], c.points[0]);
                break;
            default:
                this._segments.add(c);
                break
        }
    }
    return this
};
Path.prototype.split = function (c, b) {
    var g = this._clone().flatten(b)._segments;
    function l(n, j, i) {
        return new Vector(n.x * (1 - i) + j.x * i, n.y * (1 - i) + j.y * i)
    }
    var k = 0;
    var d = new Array(g.length);
    d[0] = 0;
    for (var f = 1; f < g.length; f++) {
        var q = g[f - 1].points[0];
        var m = g[f].points[0];
        d[f] = k += q.distance(m.x, m.y)
    }
    for (var f = 1; f < g.length; f++) {
        d[f] /= k
    }
    var s = new Array(c);
    var q = g[0].points[0],
	a = q;
    for (var f = 0, e = 1; f < c; f++) {
        var r = new Path().moveTo(a.x, a.y);
        var h = (f + 1) / c;
        while (d[e] < h) {
            q = g[e++].points[0];
            r.lineTo(q.x, q.y)
        }
        var m = g[e].points[0];
        if (d[e] == h) {
            q = g[e++].points[0];
            a = m
        } else {
            var o = (h - d[e - 1]) / (d[e] - d[e - 1]);
            a = l(q, m, o)
        }
        r.lineTo(a.x, a.y);
        s[f] = r
    }
    return s
};
Path.prototype.clear = function () {
    this.segments().clear();
    return this
};
Path.prototype._clone = function (a) {
    var b = new Path();
    b._segments = this.segments();
    return b
};
Path._weightCurve = function (a, e, d, c, b) {
    return new Vector(a[0] * e.x + a[1] * d.x + a[2] * c.x + a[3] * b.x, a[0] * e.y + a[1] * d.y + a[2] * c.y + a[3] * b.y)
};
Path._bezierLeft = [[8 / 8, 0 / 8, 0 / 8, 0 / 8], [4 / 8, 4 / 8, 0 / 8, 0 / 8], [2 / 8, 4 / 8, 2 / 8, 0 / 8], [1 / 8, 3 / 8, 3 / 8, 1 / 8]];
Path._bezierRight = [[1 / 8, 3 / 8, 3 / 8, 1 / 8], [0 / 8, 2 / 8, 4 / 8, 2 / 8], [0 / 8, 0 / 8, 4 / 8, 4 / 8], [0 / 8, 0 / 8, 0 / 8, 8 / 8]];
function AffineTransform() {
    this._matrix = [1, 0, 0, 0, 1, 0]
}
AffineTransform.prototype.rotate = function (c) {
    var b = Math.cos(c);
    var a = Math.sin(c);
    var d = this._matrix.clone();
    this._matrix[0] = d[0] * b - d[1] * a;
    this._matrix[1] = d[0] * a + d[1] * b;
    this._matrix[3] = d[3] * b - d[4] * a;
    this._matrix[4] = d[3] * a + d[4] * b;
    return this
};
AffineTransform.prototype.scale = function (a, b) {
    if (arguments.length == 1) {
        b = a
    }
    this._matrix[0] = this._matrix[0] * a;
    this._matrix[1] = this._matrix[1] * b;
    this._matrix[3] = this._matrix[3] * a;
    this._matrix[4] = this._matrix[4] * b;
    return this
};
AffineTransform.prototype.shear = function (a, c) {
    var b = this._matrix.clone();
    this._matrix[0] = b[0] + b[1] * c;
    this._matrix[1] = b[0] * a + b[1];
    this._matrix[3] = b[3] + b[4] * c;
    this._matrix[4] = b[3] * a + b[4];
    return this
};
AffineTransform.prototype.translate = function (a, b) {
    this._matrix[2] = this._matrix[0] * a + this._matrix[1] * b + this._matrix[2];
    this._matrix[5] = this._matrix[3] * a + this._matrix[4] * b + this._matrix[5];
    return this
};
AffineTransform.prototype.transform = function (a) {
    return new Vector(this._matrix[0] * a.x + this._matrix[1] * a.y + this._matrix[2], this._matrix[3] * a.x + this._matrix[4] * a.y + this._matrix[5])
};
function BasisSpline() {
    Path.call(this);
    this._points = []
}
BasisSpline.prototype = Path.extend();
BasisSpline.prototype.add = function (a, b) {
    this._points.push(new Vector(a, b));
    this._segments = null;
    return this
};
BasisSpline.prototype.addAll = function (a) {
    this._points.addAll(a);
    this._segments = null;
    return this
};
BasisSpline.prototype.clear = function () {
    this._points = [];
    this._segments = null;
    return this
};
BasisSpline.prototype.straighten = function (g) {
    var h = this._points;
    var f = h.length - 1;
    var b = h[f].x - h[0].x;
    var a = h[f].y - h[0].y;
    for (var c = 1; c < f; c++) {
        var d = h[c];
        d.x = g * d.x + (1 - g) * (h[0].x + c * b / f);
        d.y = g * d.y + (1 - g) * (h[0].y + c * a / f)
    }
    this._segments = null;
    return this
};
BasisSpline.prototype.points = function () {
    return this._points
};
BasisSpline.prototype.segments = function () {
    if (this._segments) {
        return this._segments
    }
    this._segments = [];
    var d = this._points;
    if (!d) {
        var c = Function.stacktrace();
        throw c
    }
    switch (d.length) {
        case 0:
            break;
        case 1:
            this.moveTo(d[0].x, d[0].y);
            break;
        case 2:
            this.moveTo(d[0].x, d[0].y);
            this.lineTo(d[1].x, d[1].y);
            break;
        default:
            this.moveTo(d[0].x, d[0].y);
            var h = d[0];
            var g = h;
            var f = h;
            var e = d[1];
            this._basisCurveTo(h, g, f, e);
            for (var b = 2; b < d.length; b++) {
                h = g;
                g = f;
                f = e;
                e = d[b];
                this._basisCurveTo(h, g, f, e)
            }
            for (var a = 0; a < 2; a++) {
                h = g;
                g = f;
                f = e;
                this._basisCurveTo(h, g, f, e)
            }
            break
    }
    return this._segments
};
BasisSpline._basisToBezier = [[1 / 6, 4 / 6, 1 / 6, 0 / 6], [0 / 6, 4 / 6, 2 / 6, 0 / 6], [0 / 6, 2 / 6, 4 / 6, 0 / 6], [0 / 6, 1 / 6, 4 / 6, 1 / 6]];
BasisSpline.prototype._basisCurveTo = function (g, f, e, d) {
    var c = Path._weightCurve(BasisSpline._basisToBezier[1], g, f, e, d);
    var b = Path._weightCurve(BasisSpline._basisToBezier[2], g, f, e, d);
    var a = Path._weightCurve(BasisSpline._basisToBezier[3], g, f, e, d);
    this.bezierCurveTo(c.x, c.y, b.x, b.y, a.x, a.y)
};
function Circle(a, c, b) {
    this.center = new Vector(a, c);
    this.radius = b
}
Circle.prototype._path = function (a) {
    a.beginPath();
    a.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false)
};
Circle.prototype.fill = function (a) {
    this._path(a);
    a.fill();
    return this
};
Circle.prototype.stroke = function (a) {
    this._path(a);
    a.stroke();
    return this
};
Circle.prototype.distance = function (a, b) {
    return this.center.distance(a, b) - this.radius
};
Circle.prototype.diameter = function () {
    return 2 * this.radius
};
Circle.prototype.circumference = function () {
    return 2 * Math.PI * this.radius
};
Circle.prototype.area = function () {
    return Math.PI * this.radius * this.radius
};
function Line(b, d, a, c) {
    Path.call(this);
    this._segments = [new Path.Segment(Path.SEG_MOVE, [new Vector(b, d)]), new Path.Segment(Path.SEG_LINE, [new Vector(a, c)])]
}
Line.prototype = Path.extend();
Line.prototype.distance = function (a, g) {
    var d = this.start(),
	f = this.end();
    var c = f.x - d.x,
	b = f.y - d.y;
    return ((c == 0) && (b == 0)) ? d.distance(a, g) : Math.abs(c * (d.y - g) - b * (d.x - a)) / Math.sqrt(c * c + b * b)
};
Line.prototype.start = function () {
    return this._segments[0].points[0]
};
Line.prototype.end = function () {
    return this._segments[1].points[0]
};
Line.prototype.length = function () {
    return this.start().distance(this.end())
};
Line.intersect = function (p, o, i, g) {
    var n = new Vector(g.x - i.x, g.y - i.y);
    var m = new Vector(p.y - o.y, o.x - p.x);
    var l = new Vector(p.x - i.x, p.y - i.y);
    var k = l.dot(n.perp());
    var h = n.dot(m);
    if (h > 0) {
        if ((k < 0) || (k > h)) {
            return false
        }
    } else {
        if ((k > 0) || (k < h)) {
            return false
        }
    }
    var j = l.dot(m);
    if (h > 0) {
        if ((j < 0) || (j > h)) {
            return false
        }
    } else {
        if ((j > 0) || (j < h)) {
            return false
        }
    }
    return true
};
function Rectangle(a, d, b, c) {
    this.x = a;
    this.y = d;
    this.width = b;
    this.height = c
}
Rectangle.prototype._path = function (a) {
    a.beginPath();
    a.moveTo(this.x, this.y);
    a.lineTo(this.x + this.width, this.y);
    a.lineTo(this.x + this.width, this.y + this.height);
    a.lineTo(this.x, this.y + this.height);
    a.closePath()
};
Rectangle.prototype.fill = function (a) {
    this._path(a);
    a.fill();
    return this
};
Rectangle.prototype.stroke = function (a) {
    this._path(a);
    a.stroke();
    return this
};
Rectangle.prototype.circumference = function () {
    return 2 * (this.width + this.height)
};
Rectangle.prototype.area = function () {
    return this.width * this.height
};
function BundledEdgeRouter(a, b) {
    this.beta = 0.85;
    this.tree = a;
    this.layout = b;
    this.splines = null
}
BundledEdgeRouter.prototype._spline = function (d, c) {
    var h = this.tree.nodes[d],
	a = this.tree.nodes[c];
    var g = this.tree.leastCommonAncestor(h, a);
    var f = [];
    f.add(this.transformPoint(this.layout.position(d)));
    while (h != g) {
        h = h.parent;
        f.add(this.transformPoint(this.layout.position(h.index)))
    }
    var b = f.size();
    while (a != g) {
        f.add(b, this.transformPoint(this.layout.position(a.index)));
        a = a.parent
    }
    var e = new BasisSpline().addAll(f).straighten(this.beta);
    e._start = d;
    e._end = c;
    return e
};
BundledEdgeRouter.prototype.init = function () {
    this.splines = [];
    for (var b = 0; b < this.tree.nodes.length; b++) {
        for (var a = 0; a < this.tree.nodes[b].outgoing.length; a++) {
            this.splines.add(this._spline(b, this.tree.nodes[b].outgoing[a].index))
        }
    }
};
BundledEdgeRouter.prototype.draw = function (b) {
    for (var a = 0; a < this.splines.length; a++) {
        this.drawSpline(b, a)
    }
};
BundledEdgeRouter.prototype.drawSpline = function (b, a) {
    this.splines[a].stroke(b)
};
BundledEdgeRouter.prototype.transformPoint = function (a) {
    return a
};
function CircleLayout(a) {
    this.endAngle = 2 * Math.PI;
    this.startAngle = 0;
    this.startRadius = 0;
    this.tree = a
}
CircleLayout.prototype.init = function () {
    this._positions = [];
    this._angles = [];
    var f = this;
    var h = new Array(this.tree.nodes.length);
    var e = new Array(this.tree.nodes.length);
    var b = 0;
    var i = 1;
    function g(l, m) {
        if (m > b) {
            b = m
        }
        e[l.index] = m;
        if ((m > 0) || (l.children.length > 1)) {
            m++
        }
        var k = (l.children.length == 0) ? 1 : 0;
        for (var j = 0; j < l.children.length; j++) {
            k += g(l.children[j], m)
        }
        if (k == l.children.length) {
            k++
        }
        h[l.index] = k;
        return k
    }
    function c(j) {
        if (!f.sort) {
            return j
        }
        j = j.clone();
        j.sort(f.sort);
        return j
    }
    function a(r, s, l) {
        d(r, (s + l) / 2);
        var q = (l - s) / h[r.index];
        var p = c(r.children);
        for (var o = 0, m = 0; m < p.length; m++) {
            var n = o + h[p[m].index];
            a(p[m], s + o * q, s + n * q);
            o = n
        }
    }
    function d(l, n) {
        n -= Math.PI / 2;
        var m = e[l.index];
        var k = (m == 0) ? 0 : (f.startRadius + radiusScale * m);
        var j = Math.cos(n) * k;
        var o = Math.sin(n) * k;
        f._positions[l.index] = new Vector(j, o);
        f._angles[l.index] = n
    }
    g(this.tree.root, 0);
    radiusScale = (1 - this.startRadius) / b;
    a(this.tree.root, this.startAngle, this.endAngle)
};
CircleLayout.prototype.position = function (a) {
    return this._positions[a]
};
CircleLayout.prototype.angle = function (a) {
    return this._angles[a]
};
CircleLayout.prototype.outline = function () {
    var c = this;
    var a = this.tree.nodes.clone();
    a.sort(function (g, f) {
        return c.angle(g.index) - c.angle(f.index)
    });
    var e = new Path();
    for (var b = 0; b < a.length; b++) {
        if (a[b].children.length == 0) {
            var d = this.position(a[b].index);
            if (e.segments().length == 0) {
                e.moveTo(d.x, d.y)
            } else {
                e.lineTo(d.x, d.y)
            }
        }
    }
    return e
};
function Color() { }
Color.Rgb = function (f, e, c, d) {
    this.r = f;
    this.g = e;
    this.b = c;
    this.a = d
};
Color.Rgb.prototype.rgb = function () {
    return this
};
Color.Rgb.prototype.toString = function () {
    return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")"
};
Color.white = new Color.Rgb(255, 255, 255, 1);
Color.red = new Color.Rgb(255, 0, 0, 1);
Color.green = new Color.Rgb(0, 255, 0, 1);
Color.blue = new Color.Rgb(0, 0, 255, 1);
Color.black = new Color.Rgb(0, 0, 0, 1);
function Gradient(b, a) {
    this.start = b.rgb();
    this.end = a.rgb()
}
Gradient.prototype.color = function (a) {
    return new Color.Rgb(Math.round(this.start.r * (1 - a) + this.end.r * a), Math.round(this.start.g * (1 - a) + this.end.g * a), Math.round(this.start.b * (1 - a) + this.end.b * a), this.start.a * (1 - a) + this.end.a * a)
};
function RadialLabeler(a, b) {
    this.tree = a;
    this.layout = b
}
RadialLabeler.prototype._drawNode = function (d, c) {
    var e = this.transformPoint(this.layout.position(c));
    d.save();
    d.translate(e.x, e.y);
    d.fillStyle = this.style(this.tree.nodes[c]) || d.fillStyle;
    var b = this.transformAngle(this.layout.angle(c));
    var f = this.name(this.tree.nodes[c]);
    if (this._upsideDown(b)) {
        d.rotate(b + Math.PI);
        d.fillText(f, -d.measureText(f).width - 2, 2)
    } else {
        d.rotate(b);
        d.fillText(f, 2, 2)
    }
    d.restore()
};
RadialLabeler.prototype._upsideDown = function (a) {
    a %= 2 * Math.PI;
    if (a < 0) {
        a += 2 * Math.PI
    }
    return (a > Math.PI / 2) && (a < 1.5 * Math.PI)
};
RadialLabeler.prototype.draw = function (b) {
    if (!b.fillText) {
        return
    }
    for (var a = 0; a < this.tree.nodes.length; a++) {
        if (this.tree.nodes[a].children.length == 0) {
            this._drawNode(b, a)
        }
    }
};
RadialLabeler.prototype.name = function (a) {
    return a.index
};
RadialLabeler.prototype.style = function (a) {
    return null
};
RadialLabeler.prototype.transformPoint = function (a) {
    return a
};
RadialLabeler.prototype.transformAngle = function (a) {
    return a
};
RadialLabeler.prototype.nodeAt = function (a, g) {
    var d = 0,
	b = Infinity;
    for (var e = 1; e < this.tree.nodes.length; e++) {
        var f = this.transformPoint(this.layout.position(e));
        var c = f.distance(a, g);
        if (c < b) {
            d = e;
            b = c
        }
    }
    return this.tree.nodes[d]
};
function DependencyTree() {
    Tree.call(this);
    this._map = {}
}
DependencyTree.prototype = Tree.extend();
DependencyTree.prototype.get = function (a) {
    if (this._map[a]) {
        return this._map[a]
    }
    var b = a.lastIndexOf(".");
    var c = (b == -1) ? this.root : this.get(a.substring(0, b));
    var d = c.addChild();
    d.name = a.substring(b + 1);
    d.fullName = a;
    this._map[a] = d;
    return d
};
function DependencyTreeControl(d,m, e, q ) {
    var data = d;
    var J = m.getContext("2d");
    var O = document.createElement("canvas").getContext("2d");
    O.canvas.width = m.width;
    O.canvas.height = m.height;
    O.canvas.style.display = "none";
    document.body.appendChild(O.canvas);
    var A = new DependencyTree();
    for (var H = 0; H < data.length; H++) {
        var D = A.get(data[H].name);
        for (var E = 0; E < data[H].deps.length; E++) {
            D.addEdge(A.get(data[H].deps[E]))
        }
    }
    var v = m.width,
	I = m.height,
	y = 80;
    var r = 0;
    var p = new AffineTransform().translate(v / 2, I / 2).scale(Math.min(v, I) / 2 - y);
    var M = new CircleLayout(A);
    M.startRadius = 0.6;
    M.sort = function (h, g) {
        return (h.name == g.name) ? 0 : ((h.name > g.name) ? 1 : -1)
    };
    M.init();
    var N = new RadialLabeler(A, M);
    N.transformAngle = function (b) {
        return b + r
    };
    N.transformPoint = function (b) {
        return p.transform(b)
    };
    N.name = function (b) {
        return b.name
    };
    N.style = function (b) {
        return b._style
    };
    var k = new BundledEdgeRouter(A, M);
    k.transformPoint = function (b) {
        return p.transform(b)
    };
    k.init();
    var s = DependencyTreeControl._light;
    var d = new Gradient(s.edgeStart, s.edgeEnd);
    var a = 1;
    var z = 8;
    var u = new Array(k.splines.length);
    for (var H = 0; H < u.length; H++) {
        u[H] = k.splines[H].flatten().split(z)
    }
    k.draw = function (w) {
        w.save();
        w.translate(v / 2, I / 2);
        w.rotate(r);
        w.translate(-v / 2, -I / 2);
        w.globalCompositeOperation = s.edgeComposite;
        w.strokeStyle = s.edgeInactive;
        for (var b = 0; b < this.splines.length; b++) {
            var P = this.splines[b];
            if (!P._active) {
                P.stroke(w)
            }
        }
        for (var h = 0, R = z; h < R; h++) {
            var Q = d.color((h + 0.5) / R);
            Q.a = a;
            w.strokeStyle = Q.toString();
            for (var b = 0; b < this.splines.length; b++) {
                if (this.splines[b]._active) {
                    u[b][h].stroke(w)
                }
            }
        }
        w.restore()
    };
    function x() {
        var Q = new Array(A.nodes.length);
        var h = new Array(A.nodes.length);
        for (var j = 0; j < A.nodes.length; j++) {
            Q[j] = h[j] = 0
        }
        var g = 0;
        var b;
        if (K != null) {
            b = new Line(K.start().x, K.start().y, K.end().x, K.end().y).transform(new AffineTransform().translate(v / 2, I / 2).rotate(r).translate(-v / 2, -I / 2))
        }
        for (var j = 0; j < k.splines.length; j++) {
            var P = k.splines[j];
            P._active = !b || b.intersects(P);
            if (P._active) {
                g++;
                h[P._start]++;
                Q[P._end]++
            }
        }
        for (var j = 0; j < A.nodes.length; j++) {
            var w = A.nodes[j].parent;
            while (w != null) {
                Q[w.index] += Q[j];
                h[w.index] += h[j];
                w = w.parent
            }
        }
        a = 0.17 + 0.83 / Math.sqrt(g);
        for (var j = 0; j < A.nodes.length; j++) {
            A.nodes[j]._style = ((Q[j] > 0) && (h[j] == 0)) ? s.labelEnd : (((h[j] > 0) && (Q[j] == 0)) ? s.labelStart : (((Q[j] + h[j]) > 0) ? s.labelActive : s.labelInactive))
        }
    }
    function o(b) {
        b = b || q._node;
        q.style.color = b._style;
        q.innerHTML = b.fullName;
        q._node = b
    }
    var B = 0;
    var f = 1;
    var G = 2;
    var n = M.outline().transform(p);
    var t = B;
    var L = 0;
    var C = null;
    var K = null;
    window.addEventListener("mousedown",
	function (h) {
	    if (h.button != 0) {
	        return
	    }
	    var b = h.pageX - m.offsetLeft;
	    var i = h.pageY - m.offsetTop;
	    C = new Vector(b, i);
	    O.clearRect(0, 0, v, I);
	    O.drawImage(m, 0, 0, v, I);
	    if (n.contains(J, b, i)) {
	        t = G;
	        if (K != null) {
	            var g = K.start(),
				h = K.end();
	            if (C.distance(g.x, g.y) < 4) {
	                C = h
	            } else {
	                if (C.distance(h.x, h.y) < 4) {
	                    C = g
	                }
	            }
	        }
	        h.preventDefault();
	        return
	    }
	    t = f;
	    L = 0;
	    h.preventDefault()
	},
	false);
    window.addEventListener("mousemove",
	function (w) {
	    var b = w.pageX - m.offsetLeft;
	    var P = w.pageY - m.offsetTop;
	    switch (t) {
	        case B:
	            o(N.nodeAt(b, P));
	            if (K != null) {
	                var g = K.start(),
                    w = K.end();
	                var j = new Vector(b, P);
	                if ((j.distance(g.x, g.y) < 4) || (j.distance(w.x, w.y) < 4)) {
	                    document.body.style.cursor = "move";
	                    break
	                }
	            }
	            document.body.style.cursor = n.contains(J, b, P) ? "crosshair" : "move";
	            break;
	        case G:
	            J.clearRect(0, 0, v, I);
	            J.drawImage(O.canvas, 0, 0, v, I);
	            K = new Line(C.x, C.y, b, P);
	            l();
	            break;
	        case f:
	            var i = new Vector(b - v / 2, P - I / 2);
	            var h = new Vector(C.x - v / 2, C.y - I / 2);
	            L = Math.atan2(h.cross(i), h.dot(i));
	            J.clearRect(0, 0, v, I);
	            J.save();
	            J.translate(v / 2, I / 2);
	            J.rotate(L);
	            J.translate(-v / 2, -I / 2);
	            J.drawImage(O.canvas, 0, 0, v, I);
	            J.restore();
	            break
	    }
	},
	false);
    window.addEventListener("mouseup",
	function (g) {
	    var b = g.pageX - m.offsetLeft;
	    var h = g.pageY - m.offsetTop;
	    switch (t) {
	        case G:
	            if (C.distance(b, h) < 3) {
	                K = null
	            }
	            x();
	            F();
	            break;
	        case f:
	            r += L;
	            if (K != null) {
	                K.transform(new AffineTransform().translate(v / 2, I / 2).rotate(-L).translate(-v / 2, -I / 2))
	            }
	            p = new AffineTransform().translate(v / 2, I / 2).scale(Math.min(v, I) / 2 - y).rotate(-r);
	            n = M.outline().transform(p);
	            F();
	            break
	    }
	    document.body.style.cursor = "auto";
	    t = B
	},
	false);
    window.addEventListener("keydown",
	function (b) {
	    if (t != B) {
	        return
	    }
	    switch (b.keyCode) {
	        case 73:
	            s = s.next;
	            d.start = s.edgeStart;
	            d.end = s.edgeEnd;
	            x();
	            o();
	            F();
	            break
	    }
	},
	false);
    function l() {
        if (!K) {
            return
        }
        J.strokeStyle = s.intersectStroke;
        J.fillStyle = s.intersectFill;
        K.stroke(J);
        new Circle(K.start().x, K.start().y, 2.5).fill(J).stroke(J);
        new Circle(K.end().x, K.end().y, 2.5).fill(J).stroke(J)
    }
    function c() {
        var g = e.getContext("2d");
        var b = g.canvas.width,
		P = g.canvas.height;
        g.clearRect(0, 0, b, P);
        var Q = g.createLinearGradient(20, 0, b - 20, 0);
        Q.addColorStop(0, d.start.toString());
        Q.addColorStop(1, d.end.toString());
        g.fillStyle = Q;
        g.fillRect(20, 13, b - 35, 2);
        g.font = "7pt Sans-Serif";
        g.fillStyle = s.labelStart;
        g.fillText("A", 10, 17);
        g.fillStyle = s.labelEnd;
        g.fillText("B", b - 12, 17);
        var j = "depends on";
        var i = g.measureText(j).width;
        g.fillStyle = s.intersectStroke;
        g.fillText(j, (b - i) / 2, 10)
    }
    function F() {
        document.body.style.background = s.background;
        J.clearRect(0, 0, v, I);
        k.draw(J);
        l();
        N.draw(J);
        c()
    }
    this.init = function () {
        J.lineWidth = 3;
        J.font = "22pt Sans-Serif";
        x();
        F()
    }
}
DependencyTreeControl._light = {
    background: "white",
    edgeComposite: "darker",
    edgeStart: Color.green,
    edgeEnd: Color.red,
    edgeInactive: "rgba(0, 0, 0, .02)",
    labelStart: "rgb(0, 128, 0)",
    labelEnd: "rgb(128, 0, 0)",
    labelActive: "black",
    labelInactive: "rgba(0, 0, 0, .2)",
    intersectStroke: "black",
    intersectFill: "white"
};
DependencyTreeControl._dark = {
    background: "black",
    edgeComposite: "lighter",
    edgeStart: Color.green,
    edgeEnd: Color.red,
    edgeInactive: "rgba(192, 192, 192, .02)",
    labelStart: "rgb(0, 192, 0)",
    labelEnd: "rgb(192, 0, 0)",
    labelActive: "rgb(192, 192, 192)",
    labelInactive: "rgba(192, 192, 192, .2)",
    intersectStroke: "white",
    intersectFill: "black"
};
DependencyTreeControl._alt = {
    background: "white",
    edgeComposite: "darker",
    edgeStart: new Color.Rgb(28, 0, 252, 1),
    edgeEnd: new Color.Rgb(249, 128, 22, 1),
    edgeInactive: "rgba(0, 0, 0, .02)",
    labelStart: "rgb(28, 0, 252)",
    labelEnd: "rgb(176, 91, 16)",
    labelActive: "black",
    labelInactive: "rgba(0, 0, 0, .2)",
    intersectStroke: "black",
    intersectFill: "white"
};
DependencyTreeControl._altDark = {
    background: "black",
    edgeComposite: "lighter",
    edgeStart: new Color.Rgb(53, 0, 252, 1),
    edgeEnd: new Color.Rgb(249, 128, 22, 1),
    edgeInactive: "rgba(192, 192, 192, .02)",
    labelStart: "rgb(64, 0, 255)",
    labelEnd: "rgb(176, 91, 16)",
    labelActive: "rgb(192, 192, 192)",
    labelInactive: "rgba(192, 192, 192, .2)",
    intersectStroke: "white",
    intersectFill: "black"
};
DependencyTreeControl._mono = {
    background: "rgb(128, 128, 128)",
    edgeComposite: "source-over",
    edgeStart: Color.white,
    edgeEnd: Color.black,
    edgeInactive: "rgba(0, 0, 0, .02)",
    labelStart: "white",
    labelEnd: "black",
    labelActive: "#333333",
    labelInactive: "rgba(0, 0, 0, .2)",
    intersectStroke: "black",
    intersectFill: "white"
};
DependencyTreeControl._light.next = DependencyTreeControl._dark;
DependencyTreeControl._dark.next = DependencyTreeControl._alt;
DependencyTreeControl._alt.next = DependencyTreeControl._altDark;
DependencyTreeControl._altDark.next = DependencyTreeControl._mono;
DependencyTreeControl._mono.next = DependencyTreeControl._light;


var doc = document, data = {};
var head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement
var baseElement = head.getElementsByTagName("base")[0]

var currentlyAddingScript
var interactiveScript

function request(url, callback, charset) {
    var node = doc.createElement("script")

    if (charset) {
        var cs = isFunction(charset) ? charset(url) : charset
        if (cs) {
            node.charset = cs
        }
    }

    addOnload(node, callback, url)

    node.async = true
    node.src = url

    // For some cache cases in IE 6-8, the script executes IMMEDIATELY after
    // the end of the insert execution, so use `currentlyAddingScript` to
    // hold current node, for deriving url in `define` call
    currentlyAddingScript = node

    // ref: #185 & http://dev.jquery.com/ticket/2709
    baseElement ?
        head.insertBefore(node, baseElement) :
        head.appendChild(node)

    currentlyAddingScript = null
}

function addOnload(node, callback, url) {
    var supportOnload = "onload" in node

    if (supportOnload) {
        node.onload = onload
        node.onerror = function () {
            throw "bad request!" + "__" + url + "  404 (Not Found) ";
            //emit("error", { uri: url, node: node })
            //onload(true)
        }
    }
    else {
        node.onreadystatechange = function () {
            if (/loaded|complete/.test(node.readyState)) {
                onload()
            }
        }
    }

    function onload(error) {
        // Ensure only run once and handle memory leak in IE
        node.onload = node.onerror = node.onreadystatechange = null

        // Remove the script to reduce memory leak
        if (!data.debug) {
            head.removeChild(node)
        }

        // Dereference the node
        node = null

        callback(error)
    }
}

function getCurrentScript() {
    if (currentlyAddingScript) {
        return currentlyAddingScript
    }

    // For IE6-9 browsers, the script onload event may not fire right
    // after the script is evaluated. Kris Zyp found that it
    // could query the script nodes and the one that is in "interactive"
    // mode indicates the current script
    // ref: http://goo.gl/JHfFW
    if (interactiveScript && interactiveScript.readyState === "interactive") {
        return interactiveScript
    }

    var scripts = head.getElementsByTagName("script")

    for (var i = scripts.length - 1; i >= 0; i--) {
        var script = scripts[i]
        if (script.readyState === "interactive") {
            interactiveScript = script
            return interactiveScript
        }
    }
}
﻿!function (n, e) {
    "use strict"; function t(n) { for (var e = Object.create(null), t = 0; t < n.length; ++t) e[n[t]] = !0; return e } function r(n, e) { return Array.prototype.slice.call(n, e || 0) } function i(n) { return n.split("") } function o(n, e) { for (var t = e.length; --t >= 0;) if (e[t] == n) return !0; return !1 } function a(n, e) { for (var t = 0, r = e.length; r > t; ++t) if (n(e[t])) return e[t] } function u(n, e) { if (0 >= e) return ""; if (1 == e) return n; var t = u(n, e >> 1); return t += t, 1 & e && (t += n), t } function s(n, e) { Error.call(this, n), this.msg = n, this.defs = e } function c(n, e, t) { n === !0 && (n = {}); var r = n || {}; if (t) for (var i in r) r.hasOwnProperty(i) && !e.hasOwnProperty(i) && s.croak("`" + i + "` is not a supported option", e); for (var i in e) e.hasOwnProperty(i) && (r[i] = n && n.hasOwnProperty(i) ? n[i] : e[i]); return r } function f(n, e) { for (var t in e) e.hasOwnProperty(t) && (n[t] = e[t]); return n } function l() { } function p(n, e) { n.indexOf(e) < 0 && n.push(e) } function d(n, e) { return n.replace(/\{(.+?)\}/g, function (n, t) { return e[t] }) } function h(n, e) { for (var t = n.length; --t >= 0;) n[t] === e && n.splice(t, 1) } function _(n, e) { function t(n, t) { for (var r = [], i = 0, o = 0, a = 0; i < n.length && o < t.length;) r[a++] = e(n[i], t[o]) <= 0 ? n[i++] : t[o++]; return i < n.length && r.push.apply(r, n.slice(i)), o < t.length && r.push.apply(r, t.slice(o)), r } function r(n) { if (n.length <= 1) return n; var e = Math.floor(n.length / 2), i = n.slice(0, e), o = n.slice(e); return i = r(i), o = r(o), t(i, o) } return n.length < 2 ? n.slice() : r(n) } function m(n, e) { return n.filter(function (n) { return e.indexOf(n) < 0 }) } function v(n, e) { return n.filter(function (n) { return e.indexOf(n) >= 0 }) } function g(n) { function e(n) { if (1 == n.length) return t += "return str === " + JSON.stringify(n[0]) + ";"; t += "switch(str){"; for (var e = 0; e < n.length; ++e) t += "case " + JSON.stringify(n[e]) + ":"; t += "return true}return false;" } n instanceof Array || (n = n.split(" ")); var t = "", r = []; n: for (var i = 0; i < n.length; ++i) { for (var o = 0; o < r.length; ++o) if (r[o][0].length == n[i].length) { r[o].push(n[i]); continue n } r.push([n[i]]) } if (r.length > 3) { r.sort(function (n, e) { return e.length - n.length }), t += "switch(str.length){"; for (var i = 0; i < r.length; ++i) { var a = r[i]; t += "case " + a[0].length + ":", e(a) } t += "}" } else e(n); return new Function("str", t) } function b(n, e) { for (var t = n.length; --t >= 0;) if (!e(n[t])) return !1; return !0 } function y() { this._values = Object.create(null), this._size = 0 } function A(n, e, t, r) { arguments.length < 4 && (r = W), e = e ? e.split(/\s+/) : []; var i = e; r && r.PROPS && (e = e.concat(r.PROPS)); for (var o = "return function AST_" + n + "(props){ if (props) { ", a = e.length; --a >= 0;) o += "this." + e[a] + " = props." + e[a] + ";"; var u = r && new r; (u && u.initialize || t && t.initialize) && (o += "this.initialize();"), o += "}}"; var s = new Function(o)(); if (u && (s.prototype = u, s.BASE = r), r && r.SUBCLASSES.push(s), s.prototype.CTOR = s, s.PROPS = e || null, s.SELF_PROPS = i, s.SUBCLASSES = [], n && (s.prototype.TYPE = s.TYPE = n), t) for (a in t) t.hasOwnProperty(a) && (/^\$/.test(a) ? s[a.substr(1)] = t[a] : s.prototype[a] = t[a]); return s.DEFMETHOD = function (n, e) { this.prototype[n] = e }, s } function w(n, e) { n.body instanceof Y ? n.body._walk(e) : n.body.forEach(function (n) { n._walk(e) }) } function E(n) { this.visit = n, this.stack = [] } function D(n) { return n >= 97 && 122 >= n || n >= 65 && 90 >= n || n >= 170 && qt.letter.test(String.fromCharCode(n)) } function F(n) { return n >= 48 && 57 >= n } function S(n) { return F(n) || D(n) } function C(n) { return qt.non_spacing_mark.test(n) || qt.space_combining_mark.test(n) } function k(n) { return qt.connector_punctuation.test(n) } function x(n) { return !St(n) && /^[a-z_$][a-z0-9_$]*$/i.test(n) } function B(n) { return 36 == n || 95 == n || D(n) } function T(n) { var e = n.charCodeAt(0); return B(e) || F(e) || 8204 == e || 8205 == e || C(n) || k(n) } function $(n) { return /^[a-z_$][a-z0-9_$]*$/i.test(n) } function O(n) { return xt.test(n) ? parseInt(n.substr(2), 16) : Bt.test(n) ? parseInt(n.substr(1), 8) : Tt.test(n) ? parseFloat(n) : void 0 } function M(n, e, t, r) { this.message = n, this.line = e, this.col = t, this.pos = r, this.stack = (new Error).stack } function N(n, e, t, r, i) { throw new M(n, t, r, i) } function R(n, e, t) { return n.type == e && (null == t || n.value == t) } function q(n, e, t) { function r() { return D.text.charAt(D.pos) } function i(n, e) { var t = D.text.charAt(D.pos++); if (n && !t) throw Ht; return "\n" == t ? (D.newline_before = D.newline_before || !e, ++D.line, D.col = 0) : ++D.col, t } function o(n) { for (; n-- > 0;) i() } function a(n) { return D.text.substr(D.pos, n.length) == n } function u(n, e) { var t = D.text.indexOf(n, D.pos); if (e && -1 == t) throw Ht; return t } function s() { D.tokline = D.line, D.tokcol = D.col, D.tokpos = D.pos } function c(n, t, r) { D.regex_allowed = "operator" == n && !Pt(t) || "keyword" == n && Ct(t) || "punc" == n && Mt(t), C = "punc" == n && "." == t; var i = { type: n, value: t, line: D.tokline, col: D.tokcol, pos: D.tokpos, endpos: D.pos, nlb: D.newline_before, file: e }; if (!r) { i.comments_before = D.comments_before, D.comments_before = []; for (var o = 0, a = i.comments_before.length; a > o; o++) i.nlb = i.nlb || i.comments_before[o].nlb } return D.newline_before = !1, new L(i) } function f() { for (; Ot(r()) ;) i() } function l(n) { for (var e, t = "", o = 0; (e = r()) && n(e, o++) ;) t += i(); return t } function p(n) { N(n, e, D.tokline, D.tokcol, D.tokpos) } function d(n) { var e = !1, t = !1, r = !1, i = "." == n, o = l(function (o, a) { var u = o.charCodeAt(0); switch (u) { case 120: case 88: return r ? !1 : r = !0; case 101: case 69: return r ? !0 : e ? !1 : e = t = !0; case 45: return t || 0 == a && !n; case 43: return t; case t = !1, 46: return i || r || e ? !1 : i = !0 } return S(u) }); n && (o = n + o); var a = O(o); return isNaN(a) ? void p("Invalid syntax: " + o) : c("num", a) } function h(n) { var e = i(!0, n); switch (e.charCodeAt(0)) { case 110: return "\n"; case 114: return "\r"; case 116: return "	"; case 98: return "\b"; case 118: return ""; case 102: return "\f"; case 48: return "\x00"; case 120: return String.fromCharCode(_(2)); case 117: return String.fromCharCode(_(4)); case 10: return ""; default: return e } } function _(n) { for (var e = 0; n > 0; --n) { var t = parseInt(i(!0), 16); isNaN(t) && p("Invalid hex-character pattern in string"), e = e << 4 | t } return e } function m(n) { var e, t = D.regex_allowed, r = u("\n"); return -1 == r ? (e = D.text.substr(D.pos), D.pos = D.text.length) : (e = D.text.substring(D.pos, r), D.pos = r), D.comments_before.push(c(n, e, !0)), D.regex_allowed = t, E() } function v() { for (var n, e, t = !1, o = "", a = !1; null != (n = r()) ;) if (t) "u" != n && p("Expecting UnicodeEscapeSequence -- uXXXX"), n = h(), T(n) || p("Unicode char: " + n.charCodeAt(0) + " is not valid in identifier"), o += n, t = !1; else if ("\\" == n) a = t = !0, i(); else { if (!T(n)) break; o += i() } return Dt(o) && a && (e = o.charCodeAt(0).toString(16).toUpperCase(), o = "\\u" + "0000".substr(e.length) + e + o.slice(1)), o } function g(n) { function e(n) { if (!r()) return n; var t = n + r(); return $t(t) ? (i(), e(t)) : n } return c("operator", e(n || i())) } function b() { switch (i(), r()) { case "/": return i(), m("comment1"); case "*": return i(), x() } return D.regex_allowed ? $("") : g("/") } function y() { return i(), F(r().charCodeAt(0)) ? d(".") : c("punc", ".") } function A() { var n = v(); return C ? c("name", n) : Ft(n) ? c("atom", n) : Dt(n) ? $t(n) ? c("operator", n) : c("keyword", n) : c("name", n) } function w(n, e) { return function (t) { try { return e(t) } catch (r) { if (r !== Ht) throw r; p(n) } } } function E(n) { if (null != n) return $(n); if (f(), s(), t) { if (a("<!--")) return o(4), m("comment3"); if (a("-->") && D.newline_before) return o(3), m("comment4") } var e = r(); if (!e) return c("eof"); var u = e.charCodeAt(0); switch (u) { case 34: case 39: return k(); case 46: return y(); case 47: return b() } return F(u) ? d() : Nt(e) ? c("punc", i()) : kt(e) ? g() : 92 == u || B(u) ? A() : void p("Unexpected character '" + e + "'") } var D = { text: n.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/\uFEFF/g, ""), filename: e, pos: 0, tokpos: 0, line: 1, tokline: 0, col: 0, tokcol: 0, newline_before: !1, regex_allowed: !1, comments_before: [] }, C = !1, k = w("Unterminated string constant", function () { for (var n = i(), e = ""; ;) { var t = i(!0); if ("\\" == t) { var r = 0, o = null; t = l(function (n) { if (n >= "0" && "7" >= n) { if (!o) return o = n, ++r; if ("3" >= o && 2 >= r) return ++r; if (o >= "4" && 1 >= r) return ++r } return !1 }), t = r > 0 ? String.fromCharCode(parseInt(t, 8)) : h(!0) } else if (t == n) break; e += t } return c("string", e) }), x = w("Unterminated multiline comment", function () { var n = D.regex_allowed, e = u("*/", !0), t = D.text.substring(D.pos, e), r = t.split("\n"), i = r.length; D.pos = e + 2, D.line += i - 1, i > 1 ? D.col = r[i - 1].length : D.col += r[i - 1].length, D.col += 2; var o = D.newline_before = D.newline_before || t.indexOf("\n") >= 0; return D.comments_before.push(c("comment2", t, !0)), D.regex_allowed = n, D.newline_before = o, E() }), $ = w("Unterminated regular expression", function (n) { for (var e, t = !1, r = !1; e = i(!0) ;) if (t) n += "\\" + e, t = !1; else if ("[" == e) r = !0, n += e; else if ("]" == e && r) r = !1, n += e; else { if ("/" == e && !r) break; "\\" == e ? t = !0 : n += e } var o = v(); return c("regexp", new RegExp(n, o)) }); return E.context = function (n) { return n && (D = n), D }, E } function H(n, e) { function t(n, e) { return R(I.token, n, e) } function r() { return I.peeked || (I.peeked = I.input()) } function i() { return I.prev = I.token, I.peeked ? (I.token = I.peeked, I.peeked = null) : I.token = I.input(), I.in_directives = I.in_directives && ("string" == I.token.type || t("punc", ";")), I.token } function o() { return I.prev } function u(n, e, t, r) { var i = I.input.context(); N(n, i.filename, null != e ? e : i.tokline, null != t ? t : i.tokcol, null != r ? r : i.tokpos) } function s(n, e) { u(e, n.line, n.col) } function f(n) { null == n && (n = I.token), s(n, "Unexpected token: " + n.type + " (" + n.value + ")") } function l(n, e) { return t(n, e) ? i() : void s(I.token, "Unexpected token " + I.token.type + " «" + I.token.value + "», expected " + n + " «" + e + "»") } function p(n) { return l("punc", n) } function d() { return !e.strict && (I.token.nlb || t("eof") || t("punc", "}")) } function h() { t("punc", ";") ? i() : d() || f() } function _() { p("("); var n = De(!0); return p(")"), n } function m(n) { return function () { var e = I.token, t = n(), r = o(); return t.start = e, t.end = r, t } } function v() { (t("operator", "/") || t("operator", "/=")) && (I.peeked = null, I.token = I.input(I.token.value.substr(1))) } function g() { var n = M(ut); a(function (e) { return e.name == n.name }, I.labels) && u("Label " + n.name + " defined twice"), p(":"), I.labels.push(n); var e = U(); return I.labels.pop(), e instanceof te || n.references.forEach(function (e) { e instanceof Ae && (e = e.label.start, u("Continue label `" + n.name + "` refers to non-IterationStatement.", e.line, e.col, e.pos)) }), new ee({ body: e, label: n }) } function b(n) { return new K({ body: (n = De(!0), h(), n) }) } function y(n) { var e, t = null; d() || (t = M(ct, !0)), null != t ? (e = a(function (n) { return n.name == t.name }, I.labels), e || u("Undefined label " + t.name), t.thedef = e) : 0 == I.in_loop && u(n.TYPE + " not inside a loop or switch"), h(); var r = new n({ label: t }); return e && e.references.push(r), r } function A() { p("("); var n = null; return !t("punc", ";") && (n = t("keyword", "var") ? (i(), L(!0)) : De(!0, !0), t("operator", "in")) ? (n instanceof Te && n.definitions.length > 1 && u("Only one variable declaration allowed in for..in loop"), i(), E(n)) : w(n) } function w(n) { p(";"); var e = t("punc", ";") ? null : De(!0); p(";"); var r = t("punc", ")") ? null : De(!0); return p(")"), new ae({ init: n, condition: e, step: r, body: j(U) }) } function E(n) { var e = n instanceof Te ? n.definitions[0].name : null, t = De(!0); return p(")"), new ue({ init: n, name: e, object: t, body: j(U) }) } function D() { var n = _(), e = U(), r = null; return t("keyword", "else") && (i(), r = U()), new we({ condition: n, body: e, alternative: r }) } function F() { p("{"); for (var n = []; !t("punc", "}") ;) t("eof") && f(), n.push(U()); return i(), n } function S() { p("{"); for (var n, e = [], r = null, a = null; !t("punc", "}") ;) t("eof") && f(), t("keyword", "case") ? (a && (a.end = o()), r = [], a = new Se({ start: (n = I.token, i(), n), expression: De(!0), body: r }), e.push(a), p(":")) : t("keyword", "default") ? (a && (a.end = o()), r = [], a = new Fe({ start: (n = I.token, i(), p(":"), n), body: r }), e.push(a)) : (r || f(), r.push(U())); return a && (a.end = o()), i(), e } function C() { var n = F(), e = null, r = null; if (t("keyword", "catch")) { var a = I.token; i(), p("("); var s = M(at); p(")"), e = new ke({ start: a, argname: s, body: F(), end: o() }) } if (t("keyword", "finally")) { var a = I.token; i(), r = new xe({ start: a, body: F(), end: o() }) } return e || r || u("Missing catch/finally blocks"), new Ce({ body: n, bcatch: e, bfinally: r }) } function k(n, e) { for (var r = []; r.push(new Oe({ start: I.token, name: M(e ? tt : et), value: t("operator", "=") ? (i(), De(!1, n)) : null, end: o() })), t("punc", ",") ;) i(); return r } function x() { var n, e = I.token; switch (e.type) { case "name": case "keyword": n = O(st); break; case "num": n = new dt({ start: e, end: e, value: e.value }); break; case "string": n = new pt({ start: e, end: e, value: e.value }); break; case "regexp": n = new ht({ start: e, end: e, value: e.value }); break; case "atom": switch (e.value) { case "false": n = new wt({ start: e, end: e }); break; case "true": n = new Et({ start: e, end: e }); break; case "null": n = new mt({ start: e, end: e }) } } return i(), n } function B(n, e, r) { for (var o = !0, a = []; !t("punc", n) && (o ? o = !1 : p(","), !e || !t("punc", n)) ;) a.push(t("punc", ",") && r ? new bt({ start: I.token, end: I.token }) : De(!1)); return i(), a } function T() { var n = I.token; switch (i(), n.type) { case "num": case "string": case "name": case "operator": case "keyword": case "atom": return n.value; default: f() } } function $() { var n = I.token; switch (i(), n.type) { case "name": case "operator": case "keyword": case "atom": return n.value; default: f() } } function O(n) { var e = I.token.value; return new ("this" == e ? ft : n)({ name: String(e), start: I.token, end: I.token }) } function M(n, e) { if (!t("name")) return e || u("Name expected"), null; var r = O(n); return i(), r } function H(n, e, t) { return "++" != e && "--" != e || P(t) || u("Invalid use of " + e + " operator"), new n({ operator: e, expression: t }) } function z(n) { return _e(le(!0), 0, n) } function P(n) { return e.strict ? n instanceof ft ? !1 : n instanceof qe || n instanceof Ze : !0 } function j(n) { ++I.in_loop; var e = n(); return --I.in_loop, e } e = c(e, { strict: !1, filename: null, toplevel: null, expression: !1, html5_comments: !0 }); var I = { input: "string" == typeof n ? q(n, e.filename, e.html5_comments) : n, token: null, prev: null, peeked: null, in_function: 0, in_directives: !0, in_loop: 0, labels: [] }; I.token = i(); var U = m(function () { var n; switch (v(), I.token.type) { case "string": var e = I.in_directives, a = b(); return e && a.body instanceof pt && !t("punc", ",") ? new G({ value: a.body.value }) : a; case "num": case "regexp": case "operator": case "atom": return b(); case "name": return R(r(), "punc", ":") ? g() : b(); case "punc": switch (I.token.value) { case "{": return new Z({ start: I.token, body: F(), end: o() }); case "[": case "(": return b(); case ";": return i(), new Q; default: f() } case "keyword": switch (n = I.token.value, i(), n) { case "break": return y(ye); case "continue": return y(Ae); case "debugger": return h(), new X; case "do": return new ie({ body: j(U), condition: (l("keyword", "while"), n = _(), h(), n) }); case "while": return new oe({ condition: _(), body: j(U) }); case "for": return A(); case "function": return V(he); case "if": return D(); case "return": return 0 == I.in_function && u("'return' outside of function"), new ve({ value: t("punc", ";") ? (i(), null) : d() ? null : (n = De(!0), h(), n) }); case "switch": return new Ee({ expression: _(), body: j(S) }); case "throw": return I.token.nlb && u("Illegal newline after 'throw'"), new ge({ value: (n = De(!0), h(), n) }); case "try": return C(); case "var": return n = L(), h(), n; case "const": return n = W(), h(), n; case "with": return new se({ expression: _(), body: U() }); default: f() } } }), V = function (n) { var e = n === he, r = t("name") ? M(e ? it : ot) : null; return e && !r && f(), p("("), new n({ name: r, argnames: function (n, e) { for (; !t("punc", ")") ;) n ? n = !1 : p(","), e.push(M(rt)); return i(), e }(!0, []), body: function (n, e) { ++I.in_function, I.in_directives = !0, I.in_loop = 0, I.labels = []; var t = F(); return --I.in_function, I.in_loop = n, I.labels = e, t }(I.in_loop, I.labels) }) }, L = function (n) { return new Te({ start: o(), definitions: k(n, !1), end: o() }) }, W = function () { return new $e({ start: o(), definitions: k(!1, !0), end: o() }) }, Y = function () { var n = I.token; l("operator", "new"); var e, r = J(!1); return t("punc", "(") ? (i(), e = B(")")) : e = [], ce(new Ne({ start: n, expression: r, args: e, end: o() }), !0) }, J = function (n) { if (t("operator", "new")) return Y(); var e = I.token; if (t("punc")) { switch (e.value) { case "(": i(); var r = De(!0); return r.start = e, r.end = I.token, p(")"), ce(r, n); case "[": return ce(ne(), n); case "{": return ce(re(), n) } f() } if (t("keyword", "function")) { i(); var a = V(de); return a.start = e, a.end = o(), ce(a, n) } return Vt[I.token.type] ? ce(x(), n) : void f() }, ne = m(function () { return p("["), new We({ elements: B("]", !e.strict, !0) }) }), re = m(function () { p("{"); for (var n = !0, r = []; !t("punc", "}") && (n ? n = !1 : p(","), e.strict || !t("punc", "}")) ;) { var a = I.token, u = a.type, s = T(); if ("name" == u && !t("punc", ":")) { if ("get" == s) { r.push(new Je({ start: a, key: x(), value: V(pe), end: o() })); continue } if ("set" == s) { r.push(new Ke({ start: a, key: x(), value: V(pe), end: o() })); continue } } p(":"), r.push(new Ge({ start: a, key: s, value: De(!1), end: o() })) } return i(), new Ye({ properties: r }) }), ce = function (n, e) { var r = n.start; if (t("punc", ".")) return i(), ce(new He({ start: r, expression: n, property: $(), end: o() }), e); if (t("punc", "[")) { i(); var a = De(!0); return p("]"), ce(new ze({ start: r, expression: n, property: a, end: o() }), e) } return e && t("punc", "(") ? (i(), ce(new Me({ start: r, expression: n, args: B(")"), end: o() }), !0)) : n }, le = function (n) { var e = I.token; if (t("operator") && zt(e.value)) { i(), v(); var r = H(je, e.value, le(n)); return r.start = e, r.end = o(), r } for (var a = J(n) ; t("operator") && Pt(I.token.value) && !I.token.nlb;) a = H(Ie, I.token.value, a), a.start = e, a.end = I.token, i(); return a }, _e = function (n, e, r) { var o = t("operator") ? I.token.value : null; "in" == o && r && (o = null); var a = null != o ? It[o] : null; if (null != a && a > e) { i(); var u = _e(le(!0), a, r); return _e(new Ue({ start: n.start, left: n, operator: o, right: u, end: u.end }), e, r) } return n }, me = function (n) { var e = I.token, r = z(n); if (t("operator", "?")) { i(); var a = De(!1); return p(":"), new Ve({ start: e, condition: r, consequent: a, alternative: De(!1, n), end: o() }) } return r }, be = function (n) { var e = I.token, r = me(n), a = I.token.value; if (t("operator") && jt(a)) { if (P(r)) return i(), new Le({ start: e, left: r, operator: a, right: be(n), end: o() }); u("Invalid assignment") } return r }, De = function (n, e) { var o = I.token, a = be(e); return n && t("punc", ",") ? (i(), new Re({ start: o, car: a, cdr: De(!0, e), end: r() })) : a }; return e.expression ? De(!0) : function () { for (var n = I.token, r = []; !t("eof") ;) r.push(U()); var i = o(), a = e.toplevel; return a ? (a.body = a.body.concat(r), a.end = i) : a = new fe({ start: n, body: r, end: i }), a }() } function z(n, e) { E.call(this), this.before = n, this.after = e } function P(n, e, t) { this.name = t.name, this.orig = [t], this.scope = n, this.references = [], this.global = !1, this.mangled_name = null, this.undeclared = !1, this.constant = !1, this.index = e } function j(n) { function e(n, e) { return n.replace(/[\u0080-\uffff]/g, function (n) { var t = n.charCodeAt(0).toString(16); if (t.length <= 2 && !e) { for (; t.length < 2;) t = "0" + t; return "\\x" + t } for (; t.length < 4;) t = "0" + t; return "\\u" + t }) } function t(t) { var r = 0, i = 0; return t = t.replace(/[\\\b\f\n\r\t\x22\x27\u2028\u2029\0]/g, function (n) { switch (n) { case "\\": return "\\\\"; case "\b": return "\\b"; case "\f": return "\\f"; case "\n": return "\\n"; case "\r": return "\\r"; case "\u2028": return "\\u2028"; case "\u2029": return "\\u2029"; case '"': return ++r, '"'; case "'": return ++i, "'"; case "\x00": return "\\x00" } return n }), n.ascii_only && (t = e(t)), r > i ? "'" + t.replace(/\x27/g, "\\'") + "'" : '"' + t.replace(/\x22/g, '\\"') + '"' } function r(e) { var r = t(e); return n.inline_script && (r = r.replace(/<\x2fscript([>\/\t\n\f\r ])/gi, "<\\/script$1")), r } function i(t) { return t = t.toString(), n.ascii_only && (t = e(t, !0)), t } function o(e) { return u(" ", n.indent_start + A - e * n.indent_level) } function a() { return k.charAt(k.length - 1) } function s() { n.max_line_len && w > n.max_line_len && f("\n") } function f(e) { e = String(e); var t = e.charAt(0); if (C && (t && !(";}".indexOf(t) < 0) || /[;]$/.test(k) || (n.semicolons || x(t) ? (F += ";", w++, D++) : (F += "\n", D++, E++, w = 0), n.beautify || (S = !1)), C = !1, s()), !n.beautify && n.preserve_line && q[q.length - 1]) for (var r = q[q.length - 1].start.line; r > E;) F += "\n", D++, E++, w = 0, S = !1; if (S) { var i = a(); (T(i) && (T(t) || "\\" == t) || /^[\+\-\/]$/.test(t) && t == i) && (F += " ", w++, D++), S = !1 } var o = e.split(/\r?\n/), u = o.length - 1; E += u, 0 == u ? w += o[u].length : w = (o[u] ? o[u].length : 0), D += e.length, k = e, F += e } function p() { C = !1, f(";") } function d() { return A + n.indent_level } function h(n) { var e; return f("{"), M(), O(d(), function () { e = n() }), $(), f("}"), e } function _(n) { f("("); var e = n(); return f(")"), e } function m(n) { f("["); var e = n(); return f("]"), e } function v() { f(","), B() } function b() { f(":"), n.space_colon && B() } function y() { return F } n = c(n, { indent_start: 0, indent_level: 4, quote_keys: !1, space_colon: !0, ascii_only: !1, unescape_regexps: !1, inline_script: !1, width: 80, max_line_len: 32e3, beautify: !1, source_map: null, bracketize: !1, semicolons: !0, comments: !1, preserve_line: !1, screw_ie8: !1, preamble: null }, !0); var A = 0, w = 0, E = 1, D = 0, F = "", S = !1, C = !1, k = null, x = g("( [ + * / - , ."), B = n.beautify ? function () { f(" ") } : function () { S = !0 }, $ = n.beautify ? function (e) { n.beautify && f(o(e ? .5 : 0)) } : l, O = n.beautify ? function (n, e) { n === !0 && (n = d()); var t = A; A = n; var r = e(); return A = t, r } : function (n, e) { return e() }, M = n.beautify ? function () { f("\n") } : l, N = n.beautify ? function () { f(";") } : function () { C = !0 }, R = n.source_map ? function (e, t) { try { e && n.source_map.add(e.file || "?", E, w, e.line, e.col, t || "name" != e.type ? t : e.value) } catch (r) { W.warn("Couldn't figure out mapping for {file}:{line},{col} → {cline},{ccol} [{name}]", { file: e.file, line: e.line, col: e.col, cline: E, ccol: w, name: t || "" }) } } : l; n.preamble && f(n.preamble.replace(/\r\n?|[\n\u2028\u2029]|\s*$/g, "\n")); var q = []; return { get: y, toString: y, indent: $, indentation: function () { return A }, current_width: function () { return w - A }, should_break: function () { return n.width && this.current_width() >= n.width }, newline: M, print: f, space: B, comma: v, colon: b, last: function () { return k }, semicolon: N, force_semicolon: p, to_ascii: e, print_name: function (n) { f(i(n)) }, print_string: function (n) { f(r(n)) }, next_indent: d, with_indent: O, with_block: h, with_parens: _, with_square: m, add_mapping: R, option: function (e) { return n[e] }, line: function () { return E }, col: function () { return w }, pos: function () { return D }, push_node: function (n) { q.push(n) }, pop_node: function () { return q.pop() }, stack: function () { return q }, parent: function (n) { return q[q.length - 2 - (n || 0)] } } } function I(n, e) { return this instanceof I ? (z.call(this, this.before, this.after), void (this.options = c(n, { sequences: !e, properties: !e, dead_code: !e, drop_debugger: !e, unsafe: !1, unsafe_comps: !1, conditionals: !e, comparisons: !e, evaluate: !e, booleans: !e, loops: !e, unused: !e, hoist_funs: !e, keep_fargs: !1, hoist_vars: !1, if_return: !e, join_vars: !e, cascade: !e, side_effects: !e, pure_getters: !1, pure_funcs: null, negate_iife: !e, screw_ie8: !1, drop_console: !1, angular: !1, warnings: !0, global_defs: {} }, !0))) : new I(n, e) } function U(n) { function e(e, i, o, a, u, s) { if (r) { var c = r.originalPositionFor({ line: a, column: u }); if (null === c.source) return; e = c.source, a = c.line, u = c.column, s = c.name } t.addMapping({ generated: { line: i + n.dest_line_diff, column: o }, original: { line: a + n.orig_line_diff, column: u }, source: e, name: s }) } n = c(n, { file: null, root: null, orig: null, orig_line_diff: 0, dest_line_diff: 0 }); var t = new MOZ_SourceMap.SourceMapGenerator({ file: n.file, sourceRoot: n.root }), r = n.orig && new MOZ_SourceMap.SourceMapConsumer(n.orig); return { add: e, get: function () { return t }, toString: function () { return t.toString() } } } e.UglifyJS = n, s.prototype = Object.create(Error.prototype), s.prototype.constructor = s, s.croak = function (n, e) { throw new s(n, e) }; var V = function () { function n(n, o, a) { function u() { var u = o(n[s], s), l = u instanceof r; return l && (u = u.v), u instanceof e ? (u = u.v, u instanceof t ? f.push.apply(f, a ? u.v.slice().reverse() : u.v) : f.push(u)) : u !== i && (u instanceof t ? c.push.apply(c, a ? u.v.slice().reverse() : u.v) : c.push(u)), l } var s, c = [], f = []; if (n instanceof Array) if (a) { for (s = n.length; --s >= 0 && !u() ;); c.reverse(), f.reverse() } else for (s = 0; s < n.length && !u() ; ++s); else for (s in n) if (n.hasOwnProperty(s) && u()) break; return f.concat(c) } function e(n) { this.v = n } function t(n) { this.v = n } function r(n) { this.v = n } n.at_top = function (n) { return new e(n) }, n.splice = function (n) { return new t(n) }, n.last = function (n) { return new r(n) }; var i = n.skip = {}; return n }(); y.prototype = { set: function (n, e) { return this.has(n) || ++this._size, this._values["$" + n] = e, this }, add: function (n, e) { return this.has(n) ? this.get(n).push(e) : this.set(n, [e]), this }, get: function (n) { return this._values["$" + n] }, del: function (n) { return this.has(n) && (--this._size, delete this._values["$" + n]), this }, has: function (n) { return "$" + n in this._values }, each: function (n) { for (var e in this._values) n(this._values[e], e.substr(1)) }, size: function () { return this._size }, map: function (n) { var e = []; for (var t in this._values) e.push(n(this._values[t], t.substr(1))); return e } }; var L = A("Token", "type value line col pos endpos nlb comments_before file", {}, null), W = A("Node", "start end", { clone: function () { return new this.CTOR(this) }, $documentation: "Base class of all AST nodes", $propdoc: { start: "[AST_Token] The first token of this node", end: "[AST_Token] The last token of this node" }, _walk: function (n) { return n._visit(this) }, walk: function (n) { return this._walk(n) } }, null); W.warn_function = null, W.warn = function (n, e) { W.warn_function && W.warn_function(d(n, e)) }; var Y = A("Statement", null, { $documentation: "Base class of all statements" }), X = A("Debugger", null, { $documentation: "Represents a debugger statement" }, Y), G = A("Directive", "value scope", { $documentation: 'Represents a directive, like "use strict";', $propdoc: { value: "[string] The value of this directive as a plain string (it's not an AST_String!)", scope: "[AST_Scope/S] The scope that this directive affects" } }, Y), K = A("SimpleStatement", "body", { $documentation: "A statement consisting of an expression, i.e. a = 1 + 2", $propdoc: { body: "[AST_Node] an expression node (should not be instanceof AST_Statement)" }, _walk: function (n) { return n._visit(this, function () { this.body._walk(n) }) } }, Y), J = A("Block", "body", { $documentation: "A body of statements (usually bracketed)", $propdoc: { body: "[AST_Statement*] an array of statements" }, _walk: function (n) { return n._visit(this, function () { w(this, n) }) } }, Y), Z = A("BlockStatement", null, { $documentation: "A block statement" }, J), Q = A("EmptyStatement", null, { $documentation: "The empty statement (empty block or simply a semicolon)", _walk: function (n) { return n._visit(this) } }, Y), ne = A("StatementWithBody", "body", { $documentation: "Base class for all statements that contain one nested body: `For`, `ForIn`, `Do`, `While`, `With`", $propdoc: { body: "[AST_Statement] the body; this should always be present, even if it's an AST_EmptyStatement" }, _walk: function (n) { return n._visit(this, function () { this.body._walk(n) }) } }, Y), ee = A("LabeledStatement", "label", { $documentation: "Statement with a label", $propdoc: { label: "[AST_Label] a label definition" }, _walk: function (n) { return n._visit(this, function () { this.label._walk(n), this.body._walk(n) }) } }, ne), te = A("IterationStatement", null, { $documentation: "Internal class.  All loops inherit from it." }, ne), re = A("DWLoop", "condition", { $documentation: "Base class for do/while statements", $propdoc: { condition: "[AST_Node] the loop condition.  Should not be instanceof AST_Statement" }, _walk: function (n) { return n._visit(this, function () { this.condition._walk(n), this.body._walk(n) }) } }, te), ie = A("Do", null, { $documentation: "A `do` statement" }, re), oe = A("While", null, { $documentation: "A `while` statement" }, re), ae = A("For", "init condition step", { $documentation: "A `for` statement", $propdoc: { init: "[AST_Node?] the `for` initialization code, or null if empty", condition: "[AST_Node?] the `for` termination clause, or null if empty", step: "[AST_Node?] the `for` update clause, or null if empty" }, _walk: function (n) { return n._visit(this, function () { this.init && this.init._walk(n), this.condition && this.condition._walk(n), this.step && this.step._walk(n), this.body._walk(n) }) } }, te), ue = A("ForIn", "init name object", { $documentation: "A `for ... in` statement", $propdoc: { init: "[AST_Node] the `for/in` initialization code", name: "[AST_SymbolRef?] the loop variable, only if `init` is AST_Var", object: "[AST_Node] the object that we're looping through" }, _walk: function (n) { return n._visit(this, function () { this.init._walk(n), this.object._walk(n), this.body._walk(n) }) } }, te), se = A("With", "expression", { $documentation: "A `with` statement", $propdoc: { expression: "[AST_Node] the `with` expression" }, _walk: function (n) { return n._visit(this, function () { this.expression._walk(n), this.body._walk(n) }) } }, ne), ce = A("Scope", "directives variables functions uses_with uses_eval parent_scope enclosed cname", { $documentation: "Base class for all statements introducing a lexical scope", $propdoc: { directives: "[string*/S] an array of directives declared in this scope", variables: "[Object/S] a map of name -> SymbolDef for all variables/functions defined in this scope", functions: "[Object/S] like `variables`, but only lists function declarations", uses_with: "[boolean/S] tells whether this scope uses the `with` statement", uses_eval: "[boolean/S] tells whether this scope contains a direct call to the global `eval`", parent_scope: "[AST_Scope?/S] link to the parent scope", enclosed: "[SymbolDef*/S] a list of all symbol definitions that are accessed from this scope or any subscopes", cname: "[integer/S] current index for mangling variables (used internally by the mangler)" } }, J), fe = A("Toplevel", "globals", { $documentation: "The toplevel scope", $propdoc: { globals: "[Object/S] a map of name -> SymbolDef for all undeclared names" }, wrap_enclose: function (n) { var e = this, t = [], r = []; n.forEach(function (n) { var e = n.lastIndexOf(":"); t.push(n.substr(0, e)), r.push(n.substr(e + 1)) }); var i = "(function(" + r.join(",") + "){ '$ORIG'; })(" + t.join(",") + ")"; return i = H(i), i = i.transform(new z(function (n) { return n instanceof G && "$ORIG" == n.value ? V.splice(e.body) : void 0 })) }, wrap_commonjs: function (n, e) { var t = this, r = []; e && (t.figure_out_scope(), t.walk(new E(function (n) { n instanceof nt && n.definition().global && (a(function (e) { return e.name == n.name }, r) || r.push(n)) }))); var i = "(function(exports, global){ global['" + n + "'] = exports; '$ORIG'; '$EXPORTS'; }({}, (function(){return this}())))"; return i = H(i), i = i.transform(new z(function (n) { if (n instanceof K && (n = n.body, n instanceof pt)) switch (n.getValue()) { case "$ORIG": return V.splice(t.body); case "$EXPORTS": var e = []; return r.forEach(function (n) { e.push(new K({ body: new Le({ left: new ze({ expression: new st({ name: "exports" }), property: new pt({ value: n.name }) }), operator: "=", right: new st(n) }) })) }), V.splice(e) } })) } }, ce), le = A("Lambda", "name argnames uses_arguments", { $documentation: "Base class for functions", $propdoc: { name: "[AST_SymbolDeclaration?] the name of this function", argnames: "[AST_SymbolFunarg*] array of function arguments", uses_arguments: "[boolean/S] tells whether this function accesses the arguments array" }, _walk: function (n) { return n._visit(this, function () { this.name && this.name._walk(n), this.argnames.forEach(function (e) { e._walk(n) }), w(this, n) }) } }, ce), pe = A("Accessor", null, { $documentation: "A setter/getter function.  The `name` property is always null." }, le), de = A("Function", null, { $documentation: "A function expression" }, le), he = A("Defun", null, { $documentation: "A function definition" }, le), _e = A("Jump", null, { $documentation: "Base class for “jumps” (for now that's `return`, `throw`, `break` and `continue`)" }, Y), me = A("Exit", "value", { $documentation: "Base class for “exits” (`return` and `throw`)", $propdoc: { value: "[AST_Node?] the value returned or thrown by this statement; could be null for AST_Return" }, _walk: function (n) { return n._visit(this, this.value && function () { this.value._walk(n) }) } }, _e), ve = A("Return", null, { $documentation: "A `return` statement" }, me), ge = A("Throw", null, { $documentation: "A `throw` statement" }, me), be = A("LoopControl", "label", { $documentation: "Base class for loop control statements (`break` and `continue`)", $propdoc: { label: "[AST_LabelRef?] the label, or null if none" }, _walk: function (n) { return n._visit(this, this.label && function () { this.label._walk(n) }) } }, _e), ye = A("Break", null, { $documentation: "A `break` statement" }, be), Ae = A("Continue", null, { $documentation: "A `continue` statement" }, be), we = A("If", "condition alternative", { $documentation: "A `if` statement", $propdoc: { condition: "[AST_Node] the `if` condition", alternative: "[AST_Statement?] the `else` part, or null if not present" }, _walk: function (n) { return n._visit(this, function () { this.condition._walk(n), this.body._walk(n), this.alternative && this.alternative._walk(n) }) } }, ne), Ee = A("Switch", "expression", { $documentation: "A `switch` statement", $propdoc: { expression: "[AST_Node] the `switch` “discriminant”" }, _walk: function (n) { return n._visit(this, function () { this.expression._walk(n), w(this, n) }) } }, J), De = A("SwitchBranch", null, { $documentation: "Base class for `switch` branches" }, J), Fe = A("Default", null, { $documentation: "A `default` switch branch" }, De), Se = A("Case", "expression", { $documentation: "A `case` switch branch", $propdoc: { expression: "[AST_Node] the `case` expression" }, _walk: function (n) { return n._visit(this, function () { this.expression._walk(n), w(this, n) }) } }, De), Ce = A("Try", "bcatch bfinally", { $documentation: "A `try` statement", $propdoc: { bcatch: "[AST_Catch?] the catch block, or null if not present", bfinally: "[AST_Finally?] the finally block, or null if not present" }, _walk: function (n) { return n._visit(this, function () { w(this, n), this.bcatch && this.bcatch._walk(n), this.bfinally && this.bfinally._walk(n) }) } }, J), ke = A("Catch", "argname", {
        $documentation: "A `catch` node; only makes sense as part of a `try` statement", $propdoc: { argname: "[AST_SymbolCatch] symbol for the exception" }, _walk: function (n) {
            return n._visit(this, function () {
                this.argname._walk(n), w(this, n)
            })
        }
    }, J), xe = A("Finally", null, { $documentation: "A `finally` node; only makes sense as part of a `try` statement" }, J), Be = A("Definitions", "definitions", { $documentation: "Base class for `var` or `const` nodes (variable declarations/initializations)", $propdoc: { definitions: "[AST_VarDef*] array of variable definitions" }, _walk: function (n) { return n._visit(this, function () { this.definitions.forEach(function (e) { e._walk(n) }) }) } }, Y), Te = A("Var", null, { $documentation: "A `var` statement" }, Be), $e = A("Const", null, { $documentation: "A `const` statement" }, Be), Oe = A("VarDef", "name value", { $documentation: "A variable declaration; only appears in a AST_Definitions node", $propdoc: { name: "[AST_SymbolVar|AST_SymbolConst] name of the variable", value: "[AST_Node?] initializer, or null of there's no initializer" }, _walk: function (n) { return n._visit(this, function () { this.name._walk(n), this.value && this.value._walk(n) }) } }), Me = A("Call", "expression args", { $documentation: "A function call expression", $propdoc: { expression: "[AST_Node] expression to invoke as function", args: "[AST_Node*] array of arguments" }, _walk: function (n) { return n._visit(this, function () { this.expression._walk(n), this.args.forEach(function (e) { e._walk(n) }) }) } }), Ne = A("New", null, { $documentation: "An object instantiation.  Derives from a function call since it has exactly the same properties" }, Me), Re = A("Seq", "car cdr", { $documentation: "A sequence expression (two comma-separated expressions)", $propdoc: { car: "[AST_Node] first element in sequence", cdr: "[AST_Node] second element in sequence" }, $cons: function (n, e) { var t = new Re(n); return t.car = n, t.cdr = e, t }, $from_array: function (n) { if (0 == n.length) return null; if (1 == n.length) return n[0].clone(); for (var e = null, t = n.length; --t >= 0;) e = Re.cons(n[t], e); for (var r = e; r;) { if (r.cdr && !r.cdr.cdr) { r.cdr = r.cdr.car; break } r = r.cdr } return e }, to_array: function () { for (var n = this, e = []; n;) { if (e.push(n.car), n.cdr && !(n.cdr instanceof Re)) { e.push(n.cdr); break } n = n.cdr } return e }, add: function (n) { for (var e = this; e;) { if (!(e.cdr instanceof Re)) { var t = Re.cons(e.cdr, n); return e.cdr = t } e = e.cdr } }, _walk: function (n) { return n._visit(this, function () { this.car._walk(n), this.cdr && this.cdr._walk(n) }) } }), qe = A("PropAccess", "expression property", { $documentation: 'Base class for property access expressions, i.e. `a.foo` or `a["foo"]`', $propdoc: { expression: "[AST_Node] the “container” expression", property: "[AST_Node|string] the property to access.  For AST_Dot this is always a plain string, while for AST_Sub it's an arbitrary AST_Node" } }), He = A("Dot", null, { $documentation: "A dotted property access expression", _walk: function (n) { return n._visit(this, function () { this.expression._walk(n) }) } }, qe), ze = A("Sub", null, { $documentation: 'Index-style property access, i.e. `a["foo"]`', _walk: function (n) { return n._visit(this, function () { this.expression._walk(n), this.property._walk(n) }) } }, qe), Pe = A("Unary", "operator expression", { $documentation: "Base class for unary expressions", $propdoc: { operator: "[string] the operator", expression: "[AST_Node] expression that this unary operator applies to" }, _walk: function (n) { return n._visit(this, function () { this.expression._walk(n) }) } }), je = A("UnaryPrefix", null, { $documentation: "Unary prefix expression, i.e. `typeof i` or `++i`" }, Pe), Ie = A("UnaryPostfix", null, { $documentation: "Unary postfix expression, i.e. `i++`" }, Pe), Ue = A("Binary", "left operator right", { $documentation: "Binary expression, i.e. `a + b`", $propdoc: { left: "[AST_Node] left-hand side expression", operator: "[string] the operator", right: "[AST_Node] right-hand side expression" }, _walk: function (n) { return n._visit(this, function () { this.left._walk(n), this.right._walk(n) }) } }), Ve = A("Conditional", "condition consequent alternative", { $documentation: "Conditional expression using the ternary operator, i.e. `a ? b : c`", $propdoc: { condition: "[AST_Node]", consequent: "[AST_Node]", alternative: "[AST_Node]" }, _walk: function (n) { return n._visit(this, function () { this.condition._walk(n), this.consequent._walk(n), this.alternative._walk(n) }) } }), Le = A("Assign", null, { $documentation: "An assignment expression — `a = b + 5`" }, Ue), We = A("Array", "elements", { $documentation: "An array literal", $propdoc: { elements: "[AST_Node*] array of elements" }, _walk: function (n) { return n._visit(this, function () { this.elements.forEach(function (e) { e._walk(n) }) }) } }), Ye = A("Object", "properties", { $documentation: "An object literal", $propdoc: { properties: "[AST_ObjectProperty*] array of properties" }, _walk: function (n) { return n._visit(this, function () { this.properties.forEach(function (e) { e._walk(n) }) }) } }), Xe = A("ObjectProperty", "key value", { $documentation: "Base class for literal object properties", $propdoc: { key: "[string] the property name converted to a string for ObjectKeyVal.  For setters and getters this is an arbitrary AST_Node.", value: "[AST_Node] property value.  For setters and getters this is an AST_Function." }, _walk: function (n) { return n._visit(this, function () { this.value._walk(n) }) } }), Ge = A("ObjectKeyVal", null, { $documentation: "A key: value object property" }, Xe), Ke = A("ObjectSetter", null, { $documentation: "An object setter property" }, Xe), Je = A("ObjectGetter", null, { $documentation: "An object getter property" }, Xe), Ze = A("Symbol", "scope name thedef", { $propdoc: { name: "[string] name of this symbol", scope: "[AST_Scope/S] the current scope (not necessarily the definition scope)", thedef: "[SymbolDef/S] the definition of this symbol" }, $documentation: "Base class for all symbols" }), Qe = A("SymbolAccessor", null, { $documentation: "The name of a property accessor (setter/getter function)" }, Ze), nt = A("SymbolDeclaration", "init", { $documentation: "A declaration symbol (symbol in var/const, function name or argument, symbol in catch)", $propdoc: { init: "[AST_Node*/S] array of initializers for this declaration." } }, Ze), et = A("SymbolVar", null, { $documentation: "Symbol defining a variable" }, nt), tt = A("SymbolConst", null, { $documentation: "A constant declaration" }, nt), rt = A("SymbolFunarg", null, { $documentation: "Symbol naming a function argument" }, et), it = A("SymbolDefun", null, { $documentation: "Symbol defining a function" }, nt), ot = A("SymbolLambda", null, { $documentation: "Symbol naming a function expression" }, nt), at = A("SymbolCatch", null, { $documentation: "Symbol naming the exception in catch" }, nt), ut = A("Label", "references", { $documentation: "Symbol naming a label (declaration)", $propdoc: { references: "[AST_LoopControl*] a list of nodes referring to this label" }, initialize: function () { this.references = [], this.thedef = this } }, Ze), st = A("SymbolRef", null, { $documentation: "Reference to some symbol (not definition/declaration)" }, Ze), ct = A("LabelRef", null, { $documentation: "Reference to a label symbol" }, Ze), ft = A("This", null, { $documentation: "The `this` symbol" }, Ze), lt = A("Constant", null, { $documentation: "Base class for all constants", getValue: function () { return this.value } }), pt = A("String", "value", { $documentation: "A string literal", $propdoc: { value: "[string] the contents of this string" } }, lt), dt = A("Number", "value", { $documentation: "A number literal", $propdoc: { value: "[number] the numeric value" } }, lt), ht = A("RegExp", "value", { $documentation: "A regexp literal", $propdoc: { value: "[RegExp] the actual regexp" } }, lt), _t = A("Atom", null, { $documentation: "Base class for atoms" }, lt), mt = A("Null", null, { $documentation: "The `null` atom", value: null }, _t), vt = A("NaN", null, { $documentation: "The impossible value", value: 0 / 0 }, _t), gt = A("Undefined", null, { $documentation: "The `undefined` value", value: void 0 }, _t), bt = A("Hole", null, { $documentation: "A hole in an array", value: void 0 }, _t), yt = A("Infinity", null, { $documentation: "The `Infinity` value", value: 1 / 0 }, _t), At = A("Boolean", null, { $documentation: "Base class for booleans" }, _t), wt = A("False", null, { $documentation: "The `false` atom", value: !1 }, At), Et = A("True", null, { $documentation: "The `true` atom", value: !0 }, At); E.prototype = { _visit: function (n, e) { this.stack.push(n); var t = this.visit(n, e ? function () { e.call(n) } : l); return !t && e && e.call(n), this.stack.pop(), t }, parent: function (n) { return this.stack[this.stack.length - 2 - (n || 0)] }, push: function (n) { this.stack.push(n) }, pop: function () { return this.stack.pop() }, self: function () { return this.stack[this.stack.length - 1] }, find_parent: function (n) { for (var e = this.stack, t = e.length; --t >= 0;) { var r = e[t]; if (r instanceof n) return r } }, has_directive: function (n) { return this.find_parent(ce).has_directive(n) }, in_boolean_context: function () { for (var n = this.stack, e = n.length, t = n[--e]; e > 0;) { var r = n[--e]; if (r instanceof we && r.condition === t || r instanceof Ve && r.condition === t || r instanceof re && r.condition === t || r instanceof ae && r.condition === t || r instanceof je && "!" == r.operator && r.expression === t) return !0; if (!(r instanceof Ue) || "&&" != r.operator && "||" != r.operator) return !1; t = r } }, loopcontrol_target: function (n) { var e = this.stack; if (n) for (var t = e.length; --t >= 0;) { var r = e[t]; if (r instanceof ee && r.label.name == n.name) return r.body } else for (var t = e.length; --t >= 0;) { var r = e[t]; if (r instanceof Ee || r instanceof te) return r } } }; var Dt = "break case catch const continue debugger default delete do else finally for function if in instanceof new return switch throw try typeof var void while with", Ft = "false null true", St = "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized this throws transient volatile yield " + Ft + " " + Dt, Ct = "return new delete throw else case"; Dt = g(Dt), St = g(St), Ct = g(Ct), Ft = g(Ft); var kt = g(i("+-*&%=<>!?|~^")), xt = /^0x[0-9a-f]+$/i, Bt = /^0[0-7]+$/, Tt = /^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i, $t = g(["in", "instanceof", "typeof", "new", "void", "delete", "++", "--", "+", "-", "!", "~", "&", "|", "^", "*", "/", "%", ">>", "<<", ">>>", "<", ">", "<=", ">=", "==", "===", "!=", "!==", "?", "=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&=", "&&", "||"]), Ot = g(i("  \n\r	\f​᠎             　")), Mt = g(i("[{(,.;:")), Nt = g(i("[]{}(),;:")), Rt = g(i("gmsiy")), qt = { letter: new RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0523\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0621-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971\\u0972\\u097B-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D28\\u0D2A-\\u0D39\\u0D3D\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC\\u0EDD\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8B\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10D0-\\u10FA\\u10FC\\u1100-\\u1159\\u115F-\\u11A2\\u11A8-\\u11F9\\u1200-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u1676\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19A9\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u2094\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2C6F\\u2C71-\\u2C7D\\u2C80-\\u2CE4\\u2D00-\\u2D25\\u2D30-\\u2D65\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31B7\\u31F0-\\u31FF\\u3400\\u4DB5\\u4E00\\u9FC3\\uA000-\\uA48C\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA65F\\uA662-\\uA66E\\uA67F-\\uA697\\uA717-\\uA71F\\uA722-\\uA788\\uA78B\\uA78C\\uA7FB-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA90A-\\uA925\\uA930-\\uA946\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAC00\\uD7A3\\uF900-\\uFA2D\\uFA30-\\uFA6A\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"), non_spacing_mark: new RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065E\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0900-\\u0902\\u093C\\u0941-\\u0948\\u094D\\u0951-\\u0955\\u0962\\u0963\\u0981\\u09BC\\u09C1-\\u09C4\\u09CD\\u09E2\\u09E3\\u0A01\\u0A02\\u0A3C\\u0A41\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81\\u0A82\\u0ABC\\u0AC1-\\u0AC5\\u0AC7\\u0AC8\\u0ACD\\u0AE2\\u0AE3\\u0B01\\u0B3C\\u0B3F\\u0B41-\\u0B44\\u0B4D\\u0B56\\u0B62\\u0B63\\u0B82\\u0BC0\\u0BCD\\u0C3E-\\u0C40\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0CBC\\u0CBF\\u0CC6\\u0CCC\\u0CCD\\u0CE2\\u0CE3\\u0D41-\\u0D44\\u0D4D\\u0D62\\u0D63\\u0DCA\\u0DD2-\\u0DD4\\u0DD6\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F71-\\u0F7E\\u0F80-\\u0F84\\u0F86\\u0F87\\u0F90-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102D-\\u1030\\u1032-\\u1037\\u1039\\u103A\\u103D\\u103E\\u1058\\u1059\\u105E-\\u1060\\u1071-\\u1074\\u1082\\u1085\\u1086\\u108D\\u109D\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B7-\\u17BD\\u17C6\\u17C9-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u1922\\u1927\\u1928\\u1932\\u1939-\\u193B\\u1A17\\u1A18\\u1A56\\u1A58-\\u1A5E\\u1A60\\u1A62\\u1A65-\\u1A6C\\u1A73-\\u1A7C\\u1A7F\\u1B00-\\u1B03\\u1B34\\u1B36-\\u1B3A\\u1B3C\\u1B42\\u1B6B-\\u1B73\\u1B80\\u1B81\\u1BA2-\\u1BA5\\u1BA8\\u1BA9\\u1C2C-\\u1C33\\u1C36\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE0\\u1CE2-\\u1CE8\\u1CED\\u1DC0-\\u1DE6\\u1DFD-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA67C\\uA67D\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA825\\uA826\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA951\\uA980-\\uA982\\uA9B3\\uA9B6-\\uA9B9\\uA9BC\\uAA29-\\uAA2E\\uAA31\\uAA32\\uAA35\\uAA36\\uAA43\\uAA4C\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uABE5\\uABE8\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"), space_combining_mark: new RegExp("[\\u0903\\u093E-\\u0940\\u0949-\\u094C\\u094E\\u0982\\u0983\\u09BE-\\u09C0\\u09C7\\u09C8\\u09CB\\u09CC\\u09D7\\u0A03\\u0A3E-\\u0A40\\u0A83\\u0ABE-\\u0AC0\\u0AC9\\u0ACB\\u0ACC\\u0B02\\u0B03\\u0B3E\\u0B40\\u0B47\\u0B48\\u0B4B\\u0B4C\\u0B57\\u0BBE\\u0BBF\\u0BC1\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCC\\u0BD7\\u0C01-\\u0C03\\u0C41-\\u0C44\\u0C82\\u0C83\\u0CBE\\u0CC0-\\u0CC4\\u0CC7\\u0CC8\\u0CCA\\u0CCB\\u0CD5\\u0CD6\\u0D02\\u0D03\\u0D3E-\\u0D40\\u0D46-\\u0D48\\u0D4A-\\u0D4C\\u0D57\\u0D82\\u0D83\\u0DCF-\\u0DD1\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0F3E\\u0F3F\\u0F7F\\u102B\\u102C\\u1031\\u1038\\u103B\\u103C\\u1056\\u1057\\u1062-\\u1064\\u1067-\\u106D\\u1083\\u1084\\u1087-\\u108C\\u108F\\u109A-\\u109C\\u17B6\\u17BE-\\u17C5\\u17C7\\u17C8\\u1923-\\u1926\\u1929-\\u192B\\u1930\\u1931\\u1933-\\u1938\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A19-\\u1A1B\\u1A55\\u1A57\\u1A61\\u1A63\\u1A64\\u1A6D-\\u1A72\\u1B04\\u1B35\\u1B3B\\u1B3D-\\u1B41\\u1B43\\u1B44\\u1B82\\u1BA1\\u1BA6\\u1BA7\\u1BAA\\u1C24-\\u1C2B\\u1C34\\u1C35\\u1CE1\\u1CF2\\uA823\\uA824\\uA827\\uA880\\uA881\\uA8B4-\\uA8C3\\uA952\\uA953\\uA983\\uA9B4\\uA9B5\\uA9BA\\uA9BB\\uA9BD-\\uA9C0\\uAA2F\\uAA30\\uAA33\\uAA34\\uAA4D\\uAA7B\\uABE3\\uABE4\\uABE6\\uABE7\\uABE9\\uABEA\\uABEC]"), connector_punctuation: new RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]") }; M.prototype.toString = function () { return this.message + " (line: " + this.line + ", col: " + this.col + ", pos: " + this.pos + ")\n\n" + this.stack }; var Ht = {}, zt = g(["typeof", "void", "delete", "--", "++", "!", "~", "-", "+"]), Pt = g(["--", "++"]), jt = g(["=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&="]), It = function (n, e) { for (var t = 0; t < n.length; ++t) for (var r = n[t], i = 0; i < r.length; ++i) e[r[i]] = t + 1; return e }([["||"], ["&&"], ["|"], ["^"], ["&"], ["==", "===", "!=", "!=="], ["<", ">", "<=", ">=", "in", "instanceof"], [">>", "<<", ">>>"], ["+", "-"], ["*", "/", "%"]], {}), Ut = t(["for", "do", "while", "switch"]), Vt = t(["atom", "num", "string", "regexp", "name"]); z.prototype = new E, function (n) { function e(e, t) { e.DEFMETHOD("transform", function (e, r) { var i, o; return e.push(this), e.before && (i = e.before(this, t, r)), i === n && (e.after ? (e.stack[e.stack.length - 1] = i = this.clone(), t(i, e), o = e.after(i, r), o !== n && (i = o)) : (i = this, t(i, e))), e.pop(), i }) } function t(n, e) { return V(n, function (n) { return n.transform(e, !0) }) } e(W, l), e(ee, function (n, e) { n.label = n.label.transform(e), n.body = n.body.transform(e) }), e(K, function (n, e) { n.body = n.body.transform(e) }), e(J, function (n, e) { n.body = t(n.body, e) }), e(re, function (n, e) { n.condition = n.condition.transform(e), n.body = n.body.transform(e) }), e(ae, function (n, e) { n.init && (n.init = n.init.transform(e)), n.condition && (n.condition = n.condition.transform(e)), n.step && (n.step = n.step.transform(e)), n.body = n.body.transform(e) }), e(ue, function (n, e) { n.init = n.init.transform(e), n.object = n.object.transform(e), n.body = n.body.transform(e) }), e(se, function (n, e) { n.expression = n.expression.transform(e), n.body = n.body.transform(e) }), e(me, function (n, e) { n.value && (n.value = n.value.transform(e)) }), e(be, function (n, e) { n.label && (n.label = n.label.transform(e)) }), e(we, function (n, e) { n.condition = n.condition.transform(e), n.body = n.body.transform(e), n.alternative && (n.alternative = n.alternative.transform(e)) }), e(Ee, function (n, e) { n.expression = n.expression.transform(e), n.body = t(n.body, e) }), e(Se, function (n, e) { n.expression = n.expression.transform(e), n.body = t(n.body, e) }), e(Ce, function (n, e) { n.body = t(n.body, e), n.bcatch && (n.bcatch = n.bcatch.transform(e)), n.bfinally && (n.bfinally = n.bfinally.transform(e)) }), e(ke, function (n, e) { n.argname = n.argname.transform(e), n.body = t(n.body, e) }), e(Be, function (n, e) { n.definitions = t(n.definitions, e) }), e(Oe, function (n, e) { n.name = n.name.transform(e), n.value && (n.value = n.value.transform(e)) }), e(le, function (n, e) { n.name && (n.name = n.name.transform(e)), n.argnames = t(n.argnames, e), n.body = t(n.body, e) }), e(Me, function (n, e) { n.expression = n.expression.transform(e), n.args = t(n.args, e) }), e(Re, function (n, e) { n.car = n.car.transform(e), n.cdr = n.cdr.transform(e) }), e(He, function (n, e) { n.expression = n.expression.transform(e) }), e(ze, function (n, e) { n.expression = n.expression.transform(e), n.property = n.property.transform(e) }), e(Pe, function (n, e) { n.expression = n.expression.transform(e) }), e(Ue, function (n, e) { n.left = n.left.transform(e), n.right = n.right.transform(e) }), e(Ve, function (n, e) { n.condition = n.condition.transform(e), n.consequent = n.consequent.transform(e), n.alternative = n.alternative.transform(e) }), e(We, function (n, e) { n.elements = t(n.elements, e) }), e(Ye, function (n, e) { n.properties = t(n.properties, e) }), e(Xe, function (n, e) { n.value = n.value.transform(e) }) }(), P.prototype = { unmangleable: function (n) { return this.global && !(n && n.toplevel) || this.undeclared || !(n && n.eval) && (this.scope.uses_eval || this.scope.uses_with) }, mangle: function (n) { if (!this.mangled_name && !this.unmangleable(n)) { var e = this.scope; !n.screw_ie8 && this.orig[0] instanceof ot && (e = e.parent_scope), this.mangled_name = e.next_mangled(n, this) } } }, fe.DEFMETHOD("figure_out_scope", function (n) { n = c(n, { screw_ie8: !1 }); var e = this, t = e.parent_scope = null, r = null, i = 0, o = new E(function (e, a) { if (n.screw_ie8 && e instanceof ke) { var u = t; return t = new ce(e), t.init_scope_vars(i), t.parent_scope = u, a(), t = u, !0 } if (e instanceof ce) { e.init_scope_vars(i); var u = e.parent_scope = t, s = r; return r = t = e, ++i, a(), --i, t = u, r = s, !0 } if (e instanceof G) return e.scope = t, p(t.directives, e.value), !0; if (e instanceof se) for (var c = t; c; c = c.parent_scope) c.uses_with = !0; else if (e instanceof Ze && (e.scope = t), e instanceof ot) r.def_function(e); else if (e instanceof it) (e.scope = r.parent_scope).def_function(e); else if (e instanceof et || e instanceof tt) { var f = r.def_variable(e); f.constant = e instanceof tt, f.init = o.parent().value } else e instanceof at && (n.screw_ie8 ? t : r).def_variable(e) }); e.walk(o); var a = null, u = e.globals = new y, o = new E(function (n, t) { if (n instanceof le) { var r = a; return a = n, t(), a = r, !0 } if (n instanceof st) { var i = n.name, s = n.scope.find_variable(i); if (s) n.thedef = s; else { var c; if (u.has(i) ? c = u.get(i) : (c = new P(e, u.size(), n), c.undeclared = !0, c.global = !0, u.set(i, c)), n.thedef = c, "eval" == i && o.parent() instanceof Me) for (var f = n.scope; f && !f.uses_eval; f = f.parent_scope) f.uses_eval = !0; a && "arguments" == i && (a.uses_arguments = !0) } return n.reference(), !0 } }); e.walk(o) }), ce.DEFMETHOD("init_scope_vars", function (n) { this.directives = [], this.variables = new y, this.functions = new y, this.uses_with = !1, this.uses_eval = !1, this.parent_scope = null, this.enclosed = [], this.cname = -1, this.nesting = n }), ce.DEFMETHOD("strict", function () { return this.has_directive("use strict") }), le.DEFMETHOD("init_scope_vars", function () { ce.prototype.init_scope_vars.apply(this, arguments), this.uses_arguments = !1 }), st.DEFMETHOD("reference", function () { var n = this.definition(); n.references.push(this); for (var e = this.scope; e && (p(e.enclosed, n), e !== n.scope) ;) e = e.parent_scope; this.frame = this.scope.nesting - n.scope.nesting }), ce.DEFMETHOD("find_variable", function (n) { return n instanceof Ze && (n = n.name), this.variables.get(n) || this.parent_scope && this.parent_scope.find_variable(n) }), ce.DEFMETHOD("has_directive", function (n) { return this.parent_scope && this.parent_scope.has_directive(n) || (this.directives.indexOf(n) >= 0 ? this : null) }), ce.DEFMETHOD("def_function", function (n) { this.functions.set(n.name, this.def_variable(n)) }), ce.DEFMETHOD("def_variable", function (n) { var e; return this.variables.has(n.name) ? (e = this.variables.get(n.name), e.orig.push(n)) : (e = new P(this, this.variables.size(), n), this.variables.set(n.name, e), e.global = !this.parent_scope), n.thedef = e }), ce.DEFMETHOD("next_mangled", function (n) { var e = this.enclosed; n: for (; ;) { var t = Lt(++this.cname); if (x(t) && !(n.except.indexOf(t) >= 0)) { for (var r = e.length; --r >= 0;) { var i = e[r], o = i.mangled_name || i.unmangleable(n) && i.name; if (t == o) continue n } return t } } }), de.DEFMETHOD("next_mangled", function (n, e) { for (var t = e.orig[0] instanceof rt && this.name && this.name.definition() ; ;) { var r = le.prototype.next_mangled.call(this, n, e); if (!t || t.mangled_name != r) return r } }), ce.DEFMETHOD("references", function (n) { return n instanceof Ze && (n = n.definition()), this.enclosed.indexOf(n) < 0 ? null : n }), Ze.DEFMETHOD("unmangleable", function (n) { return this.definition().unmangleable(n) }), Qe.DEFMETHOD("unmangleable", function () { return !0 }), ut.DEFMETHOD("unmangleable", function () { return !1 }), Ze.DEFMETHOD("unreferenced", function () { return 0 == this.definition().references.length && !(this.scope.uses_eval || this.scope.uses_with) }), Ze.DEFMETHOD("undeclared", function () { return this.definition().undeclared }), ct.DEFMETHOD("undeclared", function () { return !1 }), ut.DEFMETHOD("undeclared", function () { return !1 }), Ze.DEFMETHOD("definition", function () { return this.thedef }), Ze.DEFMETHOD("global", function () { return this.definition().global }), fe.DEFMETHOD("_default_mangler_options", function (n) { return c(n, { except: [], eval: !1, sort: !1, toplevel: !1, screw_ie8: !1 }) }), fe.DEFMETHOD("mangle_names", function (n) { n = this._default_mangler_options(n); var e = -1, t = [], r = new E(function (i, o) { if (i instanceof ee) { var a = e; return o(), e = a, !0 } if (i instanceof ce) { var u = (r.parent(), []); return i.variables.each(function (e) { n.except.indexOf(e.name) < 0 && u.push(e) }), n.sort && u.sort(function (n, e) { return e.references.length - n.references.length }), void t.push.apply(t, u) } if (i instanceof ut) { var s; do s = Lt(++e); while (!x(s)); return i.mangled_name = s, !0 } return n.screw_ie8 && i instanceof at ? void t.push(i.definition()) : void 0 }); this.walk(r), t.forEach(function (e) { e.mangle(n) }) }), fe.DEFMETHOD("compute_char_frequency", function (n) { n = this._default_mangler_options(n); var e = new E(function (e) { e instanceof lt ? Lt.consider(e.print_to_string()) : e instanceof ve ? Lt.consider("return") : e instanceof ge ? Lt.consider("throw") : e instanceof Ae ? Lt.consider("continue") : e instanceof ye ? Lt.consider("break") : e instanceof X ? Lt.consider("debugger") : e instanceof G ? Lt.consider(e.value) : e instanceof oe ? Lt.consider("while") : e instanceof ie ? Lt.consider("do while") : e instanceof we ? (Lt.consider("if"), e.alternative && Lt.consider("else")) : e instanceof Te ? Lt.consider("var") : e instanceof $e ? Lt.consider("const") : e instanceof le ? Lt.consider("function") : e instanceof ae ? Lt.consider("for") : e instanceof ue ? Lt.consider("for in") : e instanceof Ee ? Lt.consider("switch") : e instanceof Se ? Lt.consider("case") : e instanceof Fe ? Lt.consider("default") : e instanceof se ? Lt.consider("with") : e instanceof Ke ? Lt.consider("set" + e.key) : e instanceof Je ? Lt.consider("get" + e.key) : e instanceof Ge ? Lt.consider(e.key) : e instanceof Ne ? Lt.consider("new") : e instanceof ft ? Lt.consider("this") : e instanceof Ce ? Lt.consider("try") : e instanceof ke ? Lt.consider("catch") : e instanceof xe ? Lt.consider("finally") : e instanceof Ze && e.unmangleable(n) ? Lt.consider(e.name) : e instanceof Pe || e instanceof Ue ? Lt.consider(e.operator) : e instanceof He && Lt.consider(e.property) }); this.walk(e), Lt.sort() }); var Lt = function () { function n() { r = Object.create(null), t = i.split("").map(function (n) { return n.charCodeAt(0) }), t.forEach(function (n) { r[n] = 0 }) } function e(n) { var e = "", r = 54; do e += String.fromCharCode(t[n % r]), n = Math.floor(n / r), r = 64; while (n > 0); return e } var t, r, i = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789"; return e.consider = function (n) { for (var e = n.length; --e >= 0;) { var t = n.charCodeAt(e); t in r && ++r[t] } }, e.sort = function () { t = _(t, function (n, e) { return F(n) && !F(e) ? 1 : F(e) && !F(n) ? -1 : r[e] - r[n] }) }, e.reset = n, n(), e.get = function () { return t }, e.freq = function () { return r }, e }(); fe.DEFMETHOD("scope_warnings", function (n) { n = c(n, { undeclared: !1, unreferenced: !0, assign_to_global: !0, func_arguments: !0, nested_defuns: !0, eval: !0 }); var e = new E(function (t) { if (n.undeclared && t instanceof st && t.undeclared() && W.warn("Undeclared symbol: {name} [{file}:{line},{col}]", { name: t.name, file: t.start.file, line: t.start.line, col: t.start.col }), n.assign_to_global) { var r = null; t instanceof Le && t.left instanceof st ? r = t.left : t instanceof ue && t.init instanceof st && (r = t.init), r && (r.undeclared() || r.global() && r.scope !== r.definition().scope) && W.warn("{msg}: {name} [{file}:{line},{col}]", { msg: r.undeclared() ? "Accidental global?" : "Assignment to global", name: r.name, file: r.start.file, line: r.start.line, col: r.start.col }) } n.eval && t instanceof st && t.undeclared() && "eval" == t.name && W.warn("Eval is used [{file}:{line},{col}]", t.start), n.unreferenced && (t instanceof nt || t instanceof ut) && t.unreferenced() && W.warn("{type} {name} is declared but not referenced [{file}:{line},{col}]", { type: t instanceof ut ? "Label" : "Symbol", name: t.name, file: t.start.file, line: t.start.line, col: t.start.col }), n.func_arguments && t instanceof le && t.uses_arguments && W.warn("arguments used in function {name} [{file}:{line},{col}]", { name: t.name ? t.name.name : "anonymous", file: t.start.file, line: t.start.line, col: t.start.col }), n.nested_defuns && t instanceof he && !(e.parent() instanceof ce) && W.warn('Function {name} declared in nested statement "{type}" [{file}:{line},{col}]', { name: t.name.name, type: e.parent().TYPE, file: t.start.file, line: t.start.line, col: t.start.col }) }); this.walk(e) }), function () {
        function n(n, e) { n.DEFMETHOD("_codegen", e) } function e(n, e) { n.DEFMETHOD("needs_parens", e) } function t(n) { var e = n.parent(); return e instanceof Pe ? !0 : e instanceof Ue && !(e instanceof Le) ? !0 : e instanceof Me && e.expression === this ? !0 : e instanceof Ve && e.condition === this ? !0 : e instanceof qe && e.expression === this ? !0 : void 0 } function r(n, e, t) { var r = n.length - 1; n.forEach(function (n, i) { n instanceof Q || (t.indent(), n.print(t), i == r && e || (t.newline(), e && t.newline())) }) } function i(n, e) { n.length > 0 ? e.with_block(function () { r(n, !1, e) }) : e.print("{}") } function o(n, e) { if (e.option("bracketize")) return void h(n.body, e); if (!n.body) return e.force_semicolon(); if (n.body instanceof ie && !e.option("screw_ie8")) return void h(n.body, e); for (var t = n.body; ;) if (t instanceof we) { if (!t.alternative) return void h(n.body, e); t = t.alternative } else { if (!(t instanceof ne)) break; t = t.body } s(n.body, e) } function a(n, e, t) { if (t) try { n.walk(new E(function (n) { if (n instanceof Ue && "in" == n.operator) throw e })), n.print(e) } catch (r) { if (r !== e) throw r; n.print(e, !0) } else n.print(e) } function u(n) { return [92, 47, 46, 43, 42, 63, 40, 41, 91, 93, 123, 125, 36, 94, 58, 124, 33, 10, 13, 0, 65279, 8232, 8233].indexOf(n) < 0 } function s(n, e) { e.option("bracketize") ? !n || n instanceof Q ? e.print("{}") : n instanceof Z ? n.print(e) : e.with_block(function () { e.indent(), n.print(e), e.newline() }) : !n || n instanceof Q ? e.force_semicolon() : n.print(e) } function c(n) { for (var e = n.stack(), t = e.length, r = e[--t], i = e[--t]; t > 0;) { if (i instanceof Y && i.body === r) return !0; if (!(i instanceof Re && i.car === r || i instanceof Me && i.expression === r && !(i instanceof Ne) || i instanceof He && i.expression === r || i instanceof ze && i.expression === r || i instanceof Ve && i.condition === r || i instanceof Ue && i.left === r || i instanceof Ie && i.expression === r)) return !1; r = i, i = e[--t] } } function f(n, e) { return 0 == n.args.length && !e.option("beautify") } function p(n) { for (var e = n[0], t = e.length, r = 1; r < n.length; ++r) n[r].length < t && (e = n[r], t = e.length); return e } function d(n) { var e, t = n.toString(10), r = [t.replace(/^0\./, ".").replace("e+", "e")]; return Math.floor(n) === n ? (n >= 0 ? r.push("0x" + n.toString(16).toLowerCase(), "0" + n.toString(8)) : r.push("-0x" + (-n).toString(16).toLowerCase(), "-0" + (-n).toString(8)), (e = /^(.*?)(0+)$/.exec(n)) && r.push(e[1] + "e" + e[2].length)) : (e = /^0?\.(0+)(.*)$/.exec(n)) && r.push(e[2] + "e-" + (e[1].length + e[2].length), t.substr(t.indexOf("."))), p(r) } function h(n, e) { return n instanceof Z ? void n.print(e) : void e.with_block(function () { e.indent(), n.print(e), e.newline() }) } function _(n, e) { n.DEFMETHOD("add_source_map", function (n) { e(this, n) }) } function m(n, e) { e.add_mapping(n.start) } W.DEFMETHOD("print", function (n, e) { function t() { r.add_comments(n), r.add_source_map(n), i(r, n) } var r = this, i = r._codegen; n.push_node(r), e || r.needs_parens(n) ? n.with_parens(t) : t(), n.pop_node() }), W.DEFMETHOD("print_to_string", function (n) { var e = j(n); return this.print(e), e.get() }), W.DEFMETHOD("add_comments", function (n) {
            var e = n.option("comments"), t = this; if (e) {
                var r = t.start; if (r && !r._comments_dumped) {
                    r._comments_dumped = !0; var i = r.comments_before || []; t instanceof me && t.value && t.value.walk(new E(function (n) {
                        return n.start && n.start.comments_before && (i = i.concat(n.start.comments_before), n.start.comments_before = []), n instanceof de || n instanceof We || n instanceof Ye ? !0 : void 0
                    })), e.test ? i = i.filter(function (n) { return e.test(n.value) }) : "function" == typeof e && (i = i.filter(function (n) { return e(t, n) })), i.forEach(function (e) { /comment[134]/.test(e.type) ? (n.print("//" + e.value + "\n"), n.indent()) : "comment2" == e.type && (n.print("/*" + e.value + "*/"), r.nlb ? (n.print("\n"), n.indent()) : n.space()) })
                }
            }
        }), e(W, function () { return !1 }), e(de, function (n) { return c(n) }), e(Ye, function (n) { return c(n) }), e(Pe, function (n) { var e = n.parent(); return e instanceof qe && e.expression === this }), e(Re, function (n) { var e = n.parent(); return e instanceof Me || e instanceof Pe || e instanceof Ue || e instanceof Oe || e instanceof qe || e instanceof We || e instanceof Xe || e instanceof Ve }), e(Ue, function (n) { var e = n.parent(); if (e instanceof Me && e.expression === this) return !0; if (e instanceof Pe) return !0; if (e instanceof qe && e.expression === this) return !0; if (e instanceof Ue) { var t = e.operator, r = It[t], i = this.operator, o = It[i]; if (r > o || r == o && this === e.right) return !0 } }), e(qe, function (n) { var e = n.parent(); if (e instanceof Ne && e.expression === this) try { this.walk(new E(function (n) { if (n instanceof Me) throw e })) } catch (t) { if (t !== e) throw t; return !0 } }), e(Me, function (n) { var e, t = n.parent(); return t instanceof Ne && t.expression === this ? !0 : this.expression instanceof de && t instanceof qe && t.expression === this && (e = n.parent(1)) instanceof Le && e.left === t }), e(Ne, function (n) { var e = n.parent(); return f(this, n) && (e instanceof qe || e instanceof Me && e.expression === this) ? !0 : void 0 }), e(dt, function (n) { var e = n.parent(); return this.getValue() < 0 && e instanceof qe && e.expression === this ? !0 : void 0 }), e(vt, function (n) { var e = n.parent(); return e instanceof qe && e.expression === this ? !0 : void 0 }), e(Le, t), e(Ve, t), n(G, function (n, e) { e.print_string(n.value), e.semicolon() }), n(X, function (n, e) { e.print("debugger"), e.semicolon() }), ne.DEFMETHOD("_do_print_body", function (n) { s(this.body, n) }), n(Y, function (n, e) { n.body.print(e), e.semicolon() }), n(fe, function (n, e) { r(n.body, !0, e), e.print("") }), n(ee, function (n, e) { n.label.print(e), e.colon(), n.body.print(e) }), n(K, function (n, e) { n.body.print(e), e.semicolon() }), n(Z, function (n, e) { i(n.body, e) }), n(Q, function (n, e) { e.semicolon() }), n(ie, function (n, e) { e.print("do"), e.space(), n._do_print_body(e), e.space(), e.print("while"), e.space(), e.with_parens(function () { n.condition.print(e) }), e.semicolon() }), n(oe, function (n, e) { e.print("while"), e.space(), e.with_parens(function () { n.condition.print(e) }), e.space(), n._do_print_body(e) }), n(ae, function (n, e) { e.print("for"), e.space(), e.with_parens(function () { n.init ? (n.init instanceof Be ? n.init.print(e) : a(n.init, e, !0), e.print(";"), e.space()) : e.print(";"), n.condition ? (n.condition.print(e), e.print(";"), e.space()) : e.print(";"), n.step && n.step.print(e) }), e.space(), n._do_print_body(e) }), n(ue, function (n, e) { e.print("for"), e.space(), e.with_parens(function () { n.init.print(e), e.space(), e.print("in"), e.space(), n.object.print(e) }), e.space(), n._do_print_body(e) }), n(se, function (n, e) { e.print("with"), e.space(), e.with_parens(function () { n.expression.print(e) }), e.space(), n._do_print_body(e) }), le.DEFMETHOD("_do_print", function (n, e) { var t = this; e || n.print("function"), t.name && (n.space(), t.name.print(n)), n.with_parens(function () { t.argnames.forEach(function (e, t) { t && n.comma(), e.print(n) }) }), n.space(), i(t.body, n) }), n(le, function (n, e) { n._do_print(e) }), me.DEFMETHOD("_do_print", function (n, e) { n.print(e), this.value && (n.space(), this.value.print(n)), n.semicolon() }), n(ve, function (n, e) { n._do_print(e, "return") }), n(ge, function (n, e) { n._do_print(e, "throw") }), be.DEFMETHOD("_do_print", function (n, e) { n.print(e), this.label && (n.space(), this.label.print(n)), n.semicolon() }), n(ye, function (n, e) { n._do_print(e, "break") }), n(Ae, function (n, e) { n._do_print(e, "continue") }), n(we, function (n, e) { e.print("if"), e.space(), e.with_parens(function () { n.condition.print(e) }), e.space(), n.alternative ? (o(n, e), e.space(), e.print("else"), e.space(), s(n.alternative, e)) : n._do_print_body(e) }), n(Ee, function (n, e) { e.print("switch"), e.space(), e.with_parens(function () { n.expression.print(e) }), e.space(), n.body.length > 0 ? e.with_block(function () { n.body.forEach(function (n, t) { t && e.newline(), e.indent(!0), n.print(e) }) }) : e.print("{}") }), De.DEFMETHOD("_do_print_body", function (n) { this.body.length > 0 && (n.newline(), this.body.forEach(function (e) { n.indent(), e.print(n), n.newline() })) }), n(Fe, function (n, e) { e.print("default:"), n._do_print_body(e) }), n(Se, function (n, e) { e.print("case"), e.space(), n.expression.print(e), e.print(":"), n._do_print_body(e) }), n(Ce, function (n, e) { e.print("try"), e.space(), i(n.body, e), n.bcatch && (e.space(), n.bcatch.print(e)), n.bfinally && (e.space(), n.bfinally.print(e)) }), n(ke, function (n, e) { e.print("catch"), e.space(), e.with_parens(function () { n.argname.print(e) }), e.space(), i(n.body, e) }), n(xe, function (n, e) { e.print("finally"), e.space(), i(n.body, e) }), Be.DEFMETHOD("_do_print", function (n, e) { n.print(e), n.space(), this.definitions.forEach(function (e, t) { t && n.comma(), e.print(n) }); var t = n.parent(), r = t instanceof ae || t instanceof ue, i = r && t.init === this; i || n.semicolon() }), n(Te, function (n, e) { n._do_print(e, "var") }), n($e, function (n, e) { n._do_print(e, "const") }), n(Oe, function (n, e) { if (n.name.print(e), n.value) { e.space(), e.print("="), e.space(); var t = e.parent(1), r = t instanceof ae || t instanceof ue; a(n.value, e, r) } }), n(Me, function (n, e) { n.expression.print(e), n instanceof Ne && f(n, e) || e.with_parens(function () { n.args.forEach(function (n, t) { t && e.comma(), n.print(e) }) }) }), n(Ne, function (n, e) { e.print("new"), e.space(), Me.prototype._codegen(n, e) }), Re.DEFMETHOD("_do_print", function (n) { this.car.print(n), this.cdr && (n.comma(), n.should_break() && (n.newline(), n.indent()), this.cdr.print(n)) }), n(Re, function (n, e) { n._do_print(e) }), n(He, function (n, e) { var t = n.expression; t.print(e), t instanceof dt && t.getValue() >= 0 && (/[xa-f.]/i.test(e.last()) || e.print(".")), e.print("."), e.add_mapping(n.end), e.print_name(n.property) }), n(ze, function (n, e) { n.expression.print(e), e.print("["), n.property.print(e), e.print("]") }), n(je, function (n, e) { var t = n.operator; e.print(t), (/^[a-z]/i.test(t) || /[+-]$/.test(t) && n.expression instanceof je && /^[+-]/.test(n.expression.operator)) && e.space(), n.expression.print(e) }), n(Ie, function (n, e) { n.expression.print(e), e.print(n.operator) }), n(Ue, function (n, e) { n.left.print(e), e.space(), e.print(n.operator), "<" == n.operator && n.right instanceof je && "!" == n.right.operator && n.right.expression instanceof je && "--" == n.right.expression.operator ? e.print(" ") : e.space(), n.right.print(e) }), n(Ve, function (n, e) { n.condition.print(e), e.space(), e.print("?"), e.space(), n.consequent.print(e), e.space(), e.colon(), n.alternative.print(e) }), n(We, function (n, e) { e.with_square(function () { var t = n.elements, r = t.length; r > 0 && e.space(), t.forEach(function (n, t) { t && e.comma(), n.print(e), t === r - 1 && n instanceof bt && e.comma() }), r > 0 && e.space() }) }), n(Ye, function (n, e) { n.properties.length > 0 ? e.with_block(function () { n.properties.forEach(function (n, t) { t && (e.print(","), e.newline()), e.indent(), n.print(e) }), e.newline() }) : e.print("{}") }), n(Ge, function (n, e) { var t = n.key; e.option("quote_keys") ? e.print_string(t + "") : ("number" == typeof t || !e.option("beautify") && +t + "" == t) && parseFloat(t) >= 0 ? e.print(d(t)) : (St(t) ? e.option("screw_ie8") : $(t)) ? e.print_name(t) : e.print_string(t), e.colon(), n.value.print(e) }), n(Ke, function (n, e) { e.print("set"), e.space(), n.key.print(e), n.value._do_print(e, !0) }), n(Je, function (n, e) { e.print("get"), e.space(), n.key.print(e), n.value._do_print(e, !0) }), n(Ze, function (n, e) { var t = n.definition(); e.print_name(t ? t.mangled_name || t.name : n.name) }), n(gt, function (n, e) { e.print("void 0") }), n(bt, l), n(yt, function (n, e) { e.print("1/0") }), n(vt, function (n, e) { e.print("0/0") }), n(ft, function (n, e) { e.print("this") }), n(lt, function (n, e) { e.print(n.getValue()) }), n(pt, function (n, e) { e.print_string(n.getValue()) }), n(dt, function (n, e) { e.print(d(n.getValue())) }), n(ht, function (n, e) { var t = n.getValue().toString(); e.option("ascii_only") ? t = e.to_ascii(t) : e.option("unescape_regexps") && (t = t.split("\\\\").map(function (n) { return n.replace(/\\u[0-9a-fA-F]{4}|\\x[0-9a-fA-F]{2}/g, function (n) { var e = parseInt(n.substr(2), 16); return u(e) ? String.fromCharCode(e) : n }) }).join("\\\\")), e.print(t); var r = e.parent(); r instanceof Ue && /^in/.test(r.operator) && r.left === n && e.print(" ") }), _(W, l), _(G, m), _(X, m), _(Ze, m), _(_e, m), _(ne, m), _(ee, l), _(le, m), _(Ee, m), _(De, m), _(Z, m), _(fe, l), _(Ne, m), _(Ce, m), _(ke, m), _(xe, m), _(Be, m), _(lt, m), _(Xe, function (n, e) { e.add_mapping(n.start, n.key) })
    }(), I.prototype = new z, f(I.prototype, { option: function (n) { return this.options[n] }, warn: function () { this.options.warnings && W.warn.apply(W, arguments) }, before: function (n, e) { if (n._squeezed) return n; var t = !1; return n instanceof ce && (n = n.hoist_declarations(this), t = !0), e(n, this), n = n.optimize(this), t && n instanceof ce && (n.drop_unused(this), e(n, this)), n._squeezed = !0, n } }), function () {
        function n(n, e) { n.DEFMETHOD("optimize", function (n) { var t = this; if (t._optimized) return t; var r = e(t, n); return r._optimized = !0, r === t ? r : r.transform(n) }) } function e(n, e, t) { return t || (t = {}), e && (t.start || (t.start = e.start), t.end || (t.end = e.end)), new n(t) } function t(n, t, r) { if (t instanceof W) return t.transform(n); switch (typeof t) { case "string": return e(pt, r, { value: t }).optimize(n); case "number": return e(isNaN(t) ? vt : dt, r, { value: t }).optimize(n); case "boolean": return e(t ? Et : wt, r).optimize(n); case "undefined": return e(gt, r).optimize(n); default: if (null === t) return e(mt, r).optimize(n); if (t instanceof RegExp) return e(ht, r).optimize(n); throw new Error(d("Can't handle constant of type: {type}", { type: typeof t })) } } function r(n) { if (null === n) return []; if (n instanceof Z) return n.body; if (n instanceof Q) return []; if (n instanceof Y) return [n]; throw new Error("Can't convert thing to statement array") } function i(n) { return null === n ? !0 : n instanceof Q ? !0 : n instanceof Z ? 0 == n.body.length : !1 } function u(n) { return n instanceof Ee ? n : (n instanceof ae || n instanceof ue || n instanceof re) && n.body instanceof Z ? n.body : n } function s(n, t) { function i(n) { function r(n, t) { return e(K, n, { body: e(Le, n, { operator: "=", left: e(He, t, { expression: e(st, t, t), property: "$inject" }), right: e(We, n, { elements: n.argnames.map(function (n) { return e(pt, n, { value: n.name }) }) }) }) }) } return n.reduce(function (n, e) { n.push(e); var i = e.start, o = i.comments_before; if (o && o.length > 0) { var a = o.pop(); /@ngInject/.test(a.value) && (e instanceof he ? n.push(r(e, e.name)) : e instanceof Be ? e.definitions.forEach(function (e) { e.value && e.value instanceof le && n.push(r(e.value, e.name)) }) : t.warn("Unknown statement marked with @ngInject [{file}:{line},{col}]", i)) } return n }, []) } function o(n) { var e = []; return n.reduce(function (n, t) { return t instanceof Z ? (_ = !0, n.push.apply(n, o(t.body))) : t instanceof Q ? _ = !0 : t instanceof G ? e.indexOf(t.value) < 0 ? (n.push(t), e.push(t.value)) : _ = !0 : n.push(t), n }, []) } function a(n, t) { var i = t.self(), o = i instanceof le, a = []; n: for (var s = n.length; --s >= 0;) { var c = n[s]; switch (!0) { case o && c instanceof ve && !c.value && 0 == a.length: _ = !0; continue n; case c instanceof we: if (c.body instanceof ve) { if ((o && 0 == a.length || a[0] instanceof ve && !a[0].value) && !c.body.value && !c.alternative) { _ = !0; var f = e(K, c.condition, { body: c.condition }); a.unshift(f); continue n } if (a[0] instanceof ve && c.body.value && a[0].value && !c.alternative) { _ = !0, c = c.clone(), c.alternative = a[0], a[0] = c.transform(t); continue n } if ((0 == a.length || a[0] instanceof ve) && c.body.value && !c.alternative && o) { _ = !0, c = c.clone(), c.alternative = a[0] || e(ve, c, { value: e(gt, c) }), a[0] = c.transform(t); continue n } if (!c.body.value && o) { _ = !0, c = c.clone(), c.condition = c.condition.negate(t), c.body = e(Z, c, { body: r(c.alternative).concat(a) }), c.alternative = null, a = [c.transform(t)]; continue n } if (1 == a.length && o && a[0] instanceof K && (!c.alternative || c.alternative instanceof K)) { _ = !0, a.push(e(ve, a[0], { value: e(gt, a[0]) }).transform(t)), a = r(c.alternative).concat(a), a.unshift(c); continue n } } var l = m(c.body), p = l instanceof be ? t.loopcontrol_target(l.label) : null; if (l && (l instanceof ve && !l.value && o || l instanceof Ae && i === u(p) || l instanceof ye && p instanceof Z && i === p)) { l.label && h(l.label.thedef.references, l), _ = !0; var d = r(c.body).slice(0, -1); c = c.clone(), c.condition = c.condition.negate(t), c.body = e(Z, c, { body: r(c.alternative).concat(a) }), c.alternative = e(Z, c, { body: d }), a = [c.transform(t)]; continue n } var l = m(c.alternative), p = l instanceof be ? t.loopcontrol_target(l.label) : null; if (l && (l instanceof ve && !l.value && o || l instanceof Ae && i === u(p) || l instanceof ye && p instanceof Z && i === p)) { l.label && h(l.label.thedef.references, l), _ = !0, c = c.clone(), c.body = e(Z, c.body, { body: r(c.body).concat(a) }), c.alternative = e(Z, c.alternative, { body: r(c.alternative).slice(0, -1) }), a = [c.transform(t)]; continue n } a.unshift(c); break; default: a.unshift(c) } } return a } function s(n, e) { var t = !1, r = n.length, i = e.self(); return n = n.reduce(function (n, r) { if (t) c(e, r, n); else { if (r instanceof be) { var o = e.loopcontrol_target(r.label); r instanceof ye && o instanceof Z && u(o) === i || r instanceof Ae && u(o) === i ? r.label && h(r.label.thedef.references, r) : n.push(r) } else n.push(r); m(r) && (t = !0) } return n }, []), _ = n.length != r, n } function f(n, t) { function r() { i = Re.from_array(i), i && o.push(e(K, i, { body: i })), i = [] } if (n.length < 2) return n; var i = [], o = []; return n.forEach(function (n) { n instanceof K ? i.push(n.body) : (r(), o.push(n)) }), r(), o = l(o, t), _ = o.length != n.length, o } function l(n, t) { function r(n) { i.pop(); var e = o.body; return e instanceof Re ? e.add(n) : e = Re.cons(e, n), e.transform(t) } var i = [], o = null; return n.forEach(function (n) { if (o) if (n instanceof ae) { var t = {}; try { o.body.walk(new E(function (n) { if (n instanceof Ue && "in" == n.operator) throw t })), !n.init || n.init instanceof Be ? n.init || (n.init = o.body, i.pop()) : n.init = r(n.init) } catch (a) { if (a !== t) throw a } } else n instanceof we ? n.condition = r(n.condition) : n instanceof se ? n.expression = r(n.expression) : n instanceof me && n.value ? n.value = r(n.value) : n instanceof me ? n.value = r(e(gt, n)) : n instanceof Ee && (n.expression = r(n.expression)); i.push(n), o = n instanceof K ? n : null }), i } function p(n) { var e = null; return n.reduce(function (n, t) { return t instanceof Be && e && e.TYPE == t.TYPE ? (e.definitions = e.definitions.concat(t.definitions), _ = !0) : t instanceof ae && e instanceof Be && (!t.init || t.init.TYPE == e.TYPE) ? (_ = !0, n.pop(), t.init ? t.init.definitions = e.definitions.concat(t.init.definitions) : t.init = e, n.push(t), e = t) : (e = t, n.push(t)), n }, []) } function d(n) { n.forEach(function (n) { n instanceof K && (n.body = function t(n) { return n.transform(new z(function (n) { if (n instanceof Me && n.expression instanceof de) return e(je, n, { operator: "!", expression: n }); if (n instanceof Me) n.expression = t(n.expression); else if (n instanceof Re) n.car = t(n.car); else if (n instanceof Ve) { var r = t(n.condition); if (r !== n.condition) { n.condition = r; var i = n.consequent; n.consequent = n.alternative, n.alternative = i } } return n })) }(n.body)) }) } var _; do _ = !1, t.option("angular") && (n = i(n)), n = o(n), t.option("dead_code") && (n = s(n, t)), t.option("if_return") && (n = a(n, t)), t.option("sequences") && (n = f(n, t)), t.option("join_vars") && (n = p(n, t)); while (_); return t.option("negate_iife") && d(n, t), n } function c(n, e, t) { n.warn("Dropping unreachable code [{file}:{line},{col}]", e.start), e.walk(new E(function (e) { return e instanceof Be ? (n.warn("Declarations in unreachable code! [{file}:{line},{col}]", e.start), e.remove_initializers(), t.push(e), !0) : e instanceof he ? (t.push(e), !0) : e instanceof ce ? !0 : void 0 })) } function f(n, e) { return n.print_to_string().length > e.print_to_string().length ? e : n } function m(n) { return n && n.aborts() } function v(n, t) { function i(i) { i = r(i), n.body instanceof Z ? (n.body = n.body.clone(), n.body.body = i.concat(n.body.body.slice(1)), n.body = n.body.transform(t)) : n.body = e(Z, n.body, { body: i }).transform(t), v(n, t) } var o = n.body instanceof Z ? n.body.body[0] : n.body; o instanceof we && (o.body instanceof ye && t.loopcontrol_target(o.body.label) === n ? (n.condition = n.condition ? e(Ue, n.condition, { left: n.condition, operator: "&&", right: o.condition.negate(t) }) : o.condition.negate(t), i(o.alternative)) : o.alternative instanceof ye && t.loopcontrol_target(o.alternative.label) === n && (n.condition = n.condition ? e(Ue, n.condition, { left: n.condition, operator: "&&", right: o.condition }) : o.condition, i(o.body))) } function A(n, e) { var t = e.option("pure_getters"); e.options.pure_getters = !1; var r = n.has_side_effects(e); return e.options.pure_getters = t, r } function w(n, t) { return t.option("booleans") && t.in_boolean_context() ? e(Et, n) : n } n(W, function (n) { return n }), W.DEFMETHOD("equivalent_to", function (n) { return this.print_to_string() == n.print_to_string() }), function (n) { var e = ["!", "delete"], t = ["in", "instanceof", "==", "!=", "===", "!==", "<", "<=", ">=", ">"]; n(W, function () { return !1 }), n(je, function () { return o(this.operator, e) }), n(Ue, function () { return o(this.operator, t) || ("&&" == this.operator || "||" == this.operator) && this.left.is_boolean() && this.right.is_boolean() }), n(Ve, function () { return this.consequent.is_boolean() && this.alternative.is_boolean() }), n(Le, function () { return "=" == this.operator && this.right.is_boolean() }), n(Re, function () { return this.cdr.is_boolean() }), n(Et, function () { return !0 }), n(wt, function () { return !0 }) }(function (n, e) { n.DEFMETHOD("is_boolean", e) }), function (n) { n(W, function () { return !1 }), n(pt, function () { return !0 }), n(je, function () { return "typeof" == this.operator }), n(Ue, function (n) { return "+" == this.operator && (this.left.is_string(n) || this.right.is_string(n)) }), n(Le, function (n) { return ("=" == this.operator || "+=" == this.operator) && this.right.is_string(n) }), n(Re, function (n) { return this.cdr.is_string(n) }), n(Ve, function (n) { return this.consequent.is_string(n) && this.alternative.is_string(n) }), n(Me, function (n) { return n.option("unsafe") && this.expression instanceof st && "String" == this.expression.name && this.expression.undeclared() }) }(function (n, e) { n.DEFMETHOD("is_string", e) }), function (n) { function e(n, e) { if (!e) throw new Error("Compressor must be passed"); return n._eval(e) } W.DEFMETHOD("evaluate", function (e) { if (!e.option("evaluate")) return [this]; try { var r = this._eval(e); return [f(t(e, r, this), this), r] } catch (i) { if (i !== n) throw i; return [this] } }), n(Y, function () { throw new Error(d("Cannot evaluate a statement [{file}:{line},{col}]", this.start)) }), n(de, function () { throw n }), n(W, function () { throw n }), n(lt, function () { return this.getValue() }), n(je, function (t) { var r = this.expression; switch (this.operator) { case "!": return !e(r, t); case "typeof": if (r instanceof de) return "function"; if (r = e(r, t), r instanceof RegExp) throw n; return typeof r; case "void": return void e(r, t); case "~": return ~e(r, t); case "-": if (r = e(r, t), 0 === r) throw n; return -r; case "+": return +e(r, t) } throw n }), n(Ue, function (t) { var r = this.left, i = this.right; switch (this.operator) { case "&&": return e(r, t) && e(i, t); case "||": return e(r, t) || e(i, t); case "|": return e(r, t) | e(i, t); case "&": return e(r, t) & e(i, t); case "^": return e(r, t) ^ e(i, t); case "+": return e(r, t) + e(i, t); case "*": return e(r, t) * e(i, t); case "/": return e(r, t) / e(i, t); case "%": return e(r, t) % e(i, t); case "-": return e(r, t) - e(i, t); case "<<": return e(r, t) << e(i, t); case ">>": return e(r, t) >> e(i, t); case ">>>": return e(r, t) >>> e(i, t); case "==": return e(r, t) == e(i, t); case "===": return e(r, t) === e(i, t); case "!=": return e(r, t) != e(i, t); case "!==": return e(r, t) !== e(i, t); case "<": return e(r, t) < e(i, t); case "<=": return e(r, t) <= e(i, t); case ">": return e(r, t) > e(i, t); case ">=": return e(r, t) >= e(i, t); case "in": return e(r, t) in e(i, t); case "instanceof": return e(r, t) instanceof e(i, t) } throw n }), n(Ve, function (n) { return e(this.condition, n) ? e(this.consequent, n) : e(this.alternative, n) }), n(st, function (t) { var r = this.definition(); if (r && r.constant && r.init) return e(r.init, t); throw n }) }(function (n, e) { n.DEFMETHOD("_eval", e) }), function (n) { function t(n) { return e(je, n, { operator: "!", expression: n }) } n(W, function () { return t(this) }), n(Y, function () { throw new Error("Cannot negate a statement") }), n(de, function () { return t(this) }), n(je, function () { return "!" == this.operator ? this.expression : t(this) }), n(Re, function (n) { var e = this.clone(); return e.cdr = e.cdr.negate(n), e }), n(Ve, function (n) { var e = this.clone(); return e.consequent = e.consequent.negate(n), e.alternative = e.alternative.negate(n), f(t(this), e) }), n(Ue, function (n) { var e = this.clone(), r = this.operator; if (n.option("unsafe_comps")) switch (r) { case "<=": return e.operator = ">", e; case "<": return e.operator = ">=", e; case ">=": return e.operator = "<", e; case ">": return e.operator = "<=", e } switch (r) { case "==": return e.operator = "!=", e; case "!=": return e.operator = "==", e; case "===": return e.operator = "!==", e; case "!==": return e.operator = "===", e; case "&&": return e.operator = "||", e.left = e.left.negate(n), e.right = e.right.negate(n), f(t(this), e); case "||": return e.operator = "&&", e.left = e.left.negate(n), e.right = e.right.negate(n), f(t(this), e) } return t(this) }) }(function (n, e) { n.DEFMETHOD("negate", function (n) { return e.call(this, n) }) }), function (n) { n(W, function () { return !0 }), n(Q, function () { return !1 }), n(lt, function () { return !1 }), n(ft, function () { return !1 }), n(Me, function (n) { var e = n.option("pure_funcs"); return e ? e.indexOf(this.expression.print_to_string()) < 0 : !0 }), n(J, function (n) { for (var e = this.body.length; --e >= 0;) if (this.body[e].has_side_effects(n)) return !0; return !1 }), n(K, function (n) { return this.body.has_side_effects(n) }), n(he, function () { return !0 }), n(de, function () { return !1 }), n(Ue, function (n) { return this.left.has_side_effects(n) || this.right.has_side_effects(n) }), n(Le, function () { return !0 }), n(Ve, function (n) { return this.condition.has_side_effects(n) || this.consequent.has_side_effects(n) || this.alternative.has_side_effects(n) }), n(Pe, function (n) { return "delete" == this.operator || "++" == this.operator || "--" == this.operator || this.expression.has_side_effects(n) }), n(st, function () { return !1 }), n(Ye, function (n) { for (var e = this.properties.length; --e >= 0;) if (this.properties[e].has_side_effects(n)) return !0; return !1 }), n(Xe, function (n) { return this.value.has_side_effects(n) }), n(We, function (n) { for (var e = this.elements.length; --e >= 0;) if (this.elements[e].has_side_effects(n)) return !0; return !1 }), n(He, function (n) { return n.option("pure_getters") ? this.expression.has_side_effects(n) : !0 }), n(ze, function (n) { return n.option("pure_getters") ? this.expression.has_side_effects(n) || this.property.has_side_effects(n) : !0 }), n(qe, function (n) { return !n.option("pure_getters") }), n(Re, function (n) { return this.car.has_side_effects(n) || this.cdr.has_side_effects(n) }) }(function (n, e) { n.DEFMETHOD("has_side_effects", e) }), function (n) { function e() { var n = this.body.length; return n > 0 && m(this.body[n - 1]) } n(Y, function () { return null }), n(_e, function () { return this }), n(Z, e), n(De, e), n(we, function () { return this.alternative && m(this.body) && m(this.alternative) }) }(function (n, e) { n.DEFMETHOD("aborts", e) }), n(G, function (n) { return n.scope.has_directive(n.value) !== n.scope ? e(Q, n) : n }), n(X, function (n, t) { return t.option("drop_debugger") ? e(Q, n) : n }), n(ee, function (n, t) { return n.body instanceof ye && t.loopcontrol_target(n.body.label) === n.body ? e(Q, n) : 0 == n.label.references.length ? n.body : n }), n(J, function (n, e) { return n.body = s(n.body, e), n }), n(Z, function (n, t) { switch (n.body = s(n.body, t), n.body.length) { case 1: return n.body[0]; case 0: return e(Q, n) } return n }), ce.DEFMETHOD("drop_unused", function (n) { var t = this; if (n.option("unused") && !(t instanceof fe) && !t.uses_eval) { var r = [], i = new y, a = this, u = new E(function (e, o) { if (e !== t) { if (e instanceof he) return i.add(e.name.name, e), !0; if (e instanceof Be && a === t) return e.definitions.forEach(function (e) { e.value && (i.add(e.name.name, e.value), e.value.has_side_effects(n) && e.value.walk(u)) }), !0; if (e instanceof st) return p(r, e.definition()), !0; if (e instanceof ce) { var s = a; return a = e, o(), a = s, !0 } } }); t.walk(u); for (var s = 0; s < r.length; ++s) r[s].orig.forEach(function (n) { var e = i.get(n.name); e && e.forEach(function (n) { var e = new E(function (n) { n instanceof st && p(r, n.definition()) }); n.walk(e) }) }); var c = new z(function (i, a, u) { if (i instanceof le && !(i instanceof pe) && !n.option("keep_fargs")) for (var s = i.argnames, f = s.length; --f >= 0;) { var l = s[f]; if (!l.unreferenced()) break; s.pop(), n.warn("Dropping unused function argument {name} [{file}:{line},{col}]", { name: l.name, file: l.start.file, line: l.start.line, col: l.start.col }) } if (i instanceof he && i !== t) return o(i.name.definition(), r) ? i : (n.warn("Dropping unused function {name} [{file}:{line},{col}]", { name: i.name.name, file: i.name.start.file, line: i.name.start.line, col: i.name.start.col }), e(Q, i)); if (i instanceof Be && !(c.parent() instanceof ue)) { var p = i.definitions.filter(function (e) { if (o(e.name.definition(), r)) return !0; var t = { name: e.name.name, file: e.name.start.file, line: e.name.start.line, col: e.name.start.col }; return e.value && e.value.has_side_effects(n) ? (e._unused_side_effects = !0, n.warn("Side effects in initialization of unused variable {name} [{file}:{line},{col}]", t), !0) : (n.warn("Dropping unused variable {name} [{file}:{line},{col}]", t), !1) }); p = _(p, function (n, e) { return !n.value && e.value ? -1 : !e.value && n.value ? 1 : 0 }); for (var d = [], f = 0; f < p.length;) { var h = p[f]; h._unused_side_effects ? (d.push(h.value), p.splice(f, 1)) : (d.length > 0 && (d.push(h.value), h.value = Re.from_array(d), d = []), ++f) } return d = d.length > 0 ? e(Z, i, { body: [e(K, i, { body: Re.from_array(d) })] }) : null, 0 != p.length || d ? 0 == p.length ? d : (i.definitions = p, d && (d.body.unshift(i), i = d), i) : e(Q, i) } if (i instanceof ae && (a(i, this), i.init instanceof Z)) { var m = i.init.body.slice(0, -1); return i.init = i.init.body.slice(-1)[0].body, m.push(i), u ? V.splice(m) : e(Z, i, { body: m }) } return i instanceof ce && i !== t ? i : void 0 }); t.transform(c) } }), ce.DEFMETHOD("hoist_declarations", function (n) { var t = n.option("hoist_funs"), r = n.option("hoist_vars"), i = this; if (t || r) { var o = [], u = [], s = new y, c = 0, f = 0; i.walk(new E(function (n) { return n instanceof ce && n !== i ? !0 : n instanceof Te ? (++f, !0) : void 0 })), r = r && f > 1; var l = new z(function (n) { if (n !== i) { if (n instanceof G) return o.push(n), e(Q, n); if (n instanceof he && t) return u.push(n), e(Q, n); if (n instanceof Te && r) { n.definitions.forEach(function (n) { s.set(n.name.name, n), ++c }); var a = n.to_assignments(), f = l.parent(); return f instanceof ue && f.init === n ? null == a ? n.definitions[0].name : a : f instanceof ae && f.init === n ? a : a ? e(K, n, { body: a }) : e(Q, n) } if (n instanceof ce) return n } }); if (i = i.transform(l), c > 0) { var p = []; if (s.each(function (n, e) { i instanceof le && a(function (e) { return e.name == n.name.name }, i.argnames) ? s.del(e) : (n = n.clone(), n.value = null, p.push(n), s.set(e, n)) }), p.length > 0) { for (var d = 0; d < i.body.length;) { if (i.body[d] instanceof K) { var _, m, v = i.body[d].body; if (v instanceof Le && "=" == v.operator && (_ = v.left) instanceof Ze && s.has(_.name)) { var g = s.get(_.name); if (g.value) break; g.value = v.right, h(p, g), p.push(g), i.body.splice(d, 1); continue } if (v instanceof Re && (m = v.car) instanceof Le && "=" == m.operator && (_ = m.left) instanceof Ze && s.has(_.name)) { var g = s.get(_.name); if (g.value) break; g.value = m.right, h(p, g), p.push(g), i.body[d].body = v.cdr; continue } } if (i.body[d] instanceof Q) i.body.splice(d, 1); else { if (!(i.body[d] instanceof Z)) break; var b = [d, 1].concat(i.body[d].body); i.body.splice.apply(i.body, b) } } p = e(Te, i, { definitions: p }), u.push(p) } } i.body = o.concat(u, i.body) } return i }), n(K, function (n, t) { return t.option("side_effects") && !n.body.has_side_effects(t) ? (t.warn("Dropping side-effect-free statement [{file}:{line},{col}]", n.start), e(Q, n)) : n }), n(re, function (n, t) { var r = n.condition.evaluate(t); if (n.condition = r[0], !t.option("loops")) return n; if (r.length > 1) { if (r[1]) return e(ae, n, { body: n.body }); if (n instanceof oe && t.option("dead_code")) { var i = []; return c(t, n.body, i), e(Z, n, { body: i }) } } return n }), n(oe, function (n, t) { return t.option("loops") ? (n = re.prototype.optimize.call(n, t), n instanceof oe && (v(n, t), n = e(ae, n, n).transform(t)), n) : n }), n(ae, function (n, t) { var r = n.condition; if (r && (r = r.evaluate(t), n.condition = r[0]), !t.option("loops")) return n; if (r && r.length > 1 && !r[1] && t.option("dead_code")) { var i = []; return n.init instanceof Y ? i.push(n.init) : n.init && i.push(e(K, n.init, { body: n.init })), c(t, n.body, i), e(Z, n, { body: i }) } return v(n, t), n }), n(we, function (n, t) { if (!t.option("conditionals")) return n; var r = n.condition.evaluate(t); if (n.condition = r[0], r.length > 1) if (r[1]) { if (t.warn("Condition always true [{file}:{line},{col}]", n.condition.start), t.option("dead_code")) { var o = []; return n.alternative && c(t, n.alternative, o), o.push(n.body), e(Z, n, { body: o }).transform(t) } } else if (t.warn("Condition always false [{file}:{line},{col}]", n.condition.start), t.option("dead_code")) { var o = []; return c(t, n.body, o), n.alternative && o.push(n.alternative), e(Z, n, { body: o }).transform(t) } i(n.alternative) && (n.alternative = null); var a = n.condition.negate(t), u = f(n.condition, a) === a; if (n.alternative && u) { u = !1, n.condition = a; var s = n.body; n.body = n.alternative || e(Q), n.alternative = s } if (i(n.body) && i(n.alternative)) return e(K, n.condition, { body: n.condition }).transform(t); if (n.body instanceof K && n.alternative instanceof K) return e(K, n, { body: e(Ve, n, { condition: n.condition, consequent: n.body.body, alternative: n.alternative.body }) }).transform(t); if (i(n.alternative) && n.body instanceof K) return u ? e(K, n, { body: e(Ue, n, { operator: "||", left: a, right: n.body.body }) }).transform(t) : e(K, n, { body: e(Ue, n, { operator: "&&", left: n.condition, right: n.body.body }) }).transform(t); if (n.body instanceof Q && n.alternative && n.alternative instanceof K) return e(K, n, { body: e(Ue, n, { operator: "||", left: n.condition, right: n.alternative.body }) }).transform(t); if (n.body instanceof me && n.alternative instanceof me && n.body.TYPE == n.alternative.TYPE) return e(n.body.CTOR, n, { value: e(Ve, n, { condition: n.condition, consequent: n.body.value || e(gt, n.body).optimize(t), alternative: n.alternative.value || e(gt, n.alternative).optimize(t) }) }).transform(t); if (n.body instanceof we && !n.body.alternative && !n.alternative && (n.condition = e(Ue, n.condition, { operator: "&&", left: n.condition, right: n.body.condition }).transform(t), n.body = n.body.body), m(n.body) && n.alternative) { var l = n.alternative; return n.alternative = null, e(Z, n, { body: [n, l] }).transform(t) } if (m(n.alternative)) { var p = n.body; return n.body = n.alternative, n.condition = u ? a : n.condition.negate(t), n.alternative = null, e(Z, n, { body: [n, p] }).transform(t) } return n }), n(Ee, function (n, t) { if (0 == n.body.length && t.option("conditionals")) return e(K, n, { body: n.expression }).transform(t); for (; ;) { var r = n.body[n.body.length - 1]; if (r) { var i = r.body[r.body.length - 1]; if (i instanceof ye && u(t.loopcontrol_target(i.label)) === n && r.body.pop(), r instanceof Fe && 0 == r.body.length) { n.body.pop(); continue } } break } var o = n.expression.evaluate(t); n: if (2 == o.length) try { if (n.expression = o[0], !t.option("dead_code")) break n; var a = o[1], s = !1, c = !1, f = !1, l = !1, p = !1, d = new z(function (r, i, o) { if (r instanceof le || r instanceof K) return r; if (r instanceof Ee && r === n) return r = r.clone(), i(r, this), p ? r : e(Z, r, { body: r.body.reduce(function (n, e) { return n.concat(e.body) }, []) }).transform(t); if (r instanceof we || r instanceof Ce) { var u = s; return s = !c, i(r, this), s = u, r } if (r instanceof ne || r instanceof Ee) { var u = c; return c = !0, i(r, this), c = u, r } if (r instanceof ye && this.loopcontrol_target(r.label) === n) return s ? (p = !0, r) : c ? r : (l = !0, o ? V.skip : e(Q, r)); if (r instanceof De && this.parent() === n) { if (l) return V.skip; if (r instanceof Se) { var d = r.expression.evaluate(t); if (d.length < 2) throw n; return d[1] === a || f ? (f = !0, m(r) && (l = !0), i(r, this), r) : V.skip } return i(r, this), r } }); d.stack = t.stack.slice(), n = n.transform(d) } catch (h) { if (h !== n) throw h } return n }), n(Se, function (n, e) { return n.body = s(n.body, e), n }), n(Ce, function (n, e) { return n.body = s(n.body, e), n }), Be.DEFMETHOD("remove_initializers", function () { this.definitions.forEach(function (n) { n.value = null }) }), Be.DEFMETHOD("to_assignments", function () { var n = this.definitions.reduce(function (n, t) { if (t.value) { var r = e(st, t.name, t.name); n.push(e(Le, t, { operator: "=", left: r, right: t.value })) } return n }, []); return 0 == n.length ? null : Re.from_array(n) }), n(Be, function (n) { return 0 == n.definitions.length ? e(Q, n) : n }), n(de, function (n, e) { return n = le.prototype.optimize.call(n, e), e.option("unused") && n.name && n.name.unreferenced() && (n.name = null), n }), n(Me, function (n, r) {
            if (r.option("unsafe")) {
                var i = n.expression; if (i instanceof st && i.undeclared()) switch (i.name) {
                    case "Array": if (1 != n.args.length) return e(We, n, { elements: n.args }).transform(r); break; case "Object": if (0 == n.args.length) return e(Ye, n, { properties: [] }); break; case "String": if (0 == n.args.length) return e(pt, n, { value: "" }); if (n.args.length <= 1) return e(Ue, n, { left: n.args[0], operator: "+", right: e(pt, n, { value: "" }) }).transform(r); break; case "Number": if (0 == n.args.length) return e(dt, n, { value: 0 }); if (1 == n.args.length) return e(je, n, { expression: n.args[0], operator: "+" }).transform(r); case "Boolean": if (0 == n.args.length) return e(wt, n); if (1 == n.args.length) return e(je, n, { expression: e(je, null, { expression: n.args[0], operator: "!" }), operator: "!" }).transform(r); break; case "Function": if (b(n.args, function (n) { return n instanceof pt })) try {
                        var o = "(function(" + n.args.slice(0, -1).map(function (n) { return n.value }).join(",") + "){" + n.args[n.args.length - 1].value + "})()", a = H(o); a.figure_out_scope({ screw_ie8: r.option("screw_ie8") }); var u = new I(r.options); a = a.transform(u), a.figure_out_scope({ screw_ie8: r.option("screw_ie8") }), a.mangle_names();
                        var s; try { a.walk(new E(function (n) { if (n instanceof le) throw s = n, a })) } catch (c) { if (c !== a) throw c } var l = s.argnames.map(function (t, r) { return e(pt, n.args[r], { value: t.print_to_string() }) }), o = j(); return Z.prototype._codegen.call(s, s, o), o = o.toString().replace(/^\{|\}$/g, ""), l.push(e(pt, n.args[n.args.length - 1], { value: o })), n.args = l, n
                    } catch (c) { if (!(c instanceof M)) throw console.log(c), c; r.warn("Error parsing code passed to new Function [{file}:{line},{col}]", n.args[n.args.length - 1].start), r.warn(c.toString()) }
                } else { if (i instanceof He && "toString" == i.property && 0 == n.args.length) return e(Ue, n, { left: e(pt, n, { value: "" }), operator: "+", right: i.expression }).transform(r); if (i instanceof He && i.expression instanceof We && "join" == i.property) { var p = 0 == n.args.length ? "," : n.args[0].evaluate(r)[1]; if (null != p) { var d = i.expression.elements.reduce(function (n, e) { if (e = e.evaluate(r), 0 == n.length || 1 == e.length) n.push(e); else { var i = n[n.length - 1]; if (2 == i.length) { var o = "" + i[1] + p + e[1]; n[n.length - 1] = [t(r, o, i[0]), o] } else n.push(e) } return n }, []); if (0 == d.length) return e(pt, n, { value: "" }); if (1 == d.length) return d[0][0]; if ("" == p) { var h; return h = d[0][0] instanceof pt || d[1][0] instanceof pt ? d.shift()[0] : e(pt, n, { value: "" }), d.reduce(function (n, t) { return e(Ue, t[0], { operator: "+", left: n, right: t[0] }) }, h).transform(r) } var _ = n.clone(); return _.expression = _.expression.clone(), _.expression.expression = _.expression.expression.clone(), _.expression.expression.elements = d.map(function (n) { return n[0] }), f(n, _) } } }
            } return r.option("side_effects") && n.expression instanceof de && 0 == n.args.length && !J.prototype.has_side_effects.call(n.expression, r) ? e(gt, n).transform(r) : r.option("drop_console") && n.expression instanceof qe && n.expression.expression instanceof st && "console" == n.expression.expression.name && n.expression.expression.undeclared() ? e(gt, n).transform(r) : n.evaluate(r)[0]
        }), n(Ne, function (n, t) { if (t.option("unsafe")) { var r = n.expression; if (r instanceof st && r.undeclared()) switch (r.name) { case "Object": case "RegExp": case "Function": case "Error": case "Array": return e(Me, n, n).transform(t) } } return n }), n(Re, function (n, t) { if (!t.option("side_effects")) return n; if (!n.car.has_side_effects(t)) { var r; if (!(n.cdr instanceof st && "eval" == n.cdr.name && n.cdr.undeclared() && (r = t.parent()) instanceof Me && r.expression === n)) return n.cdr } if (t.option("cascade")) { if (n.car instanceof Le && !n.car.left.has_side_effects(t)) { if (n.car.left.equivalent_to(n.cdr)) return n.car; if (n.cdr instanceof Me && n.cdr.expression.equivalent_to(n.car.left)) return n.cdr.expression = n.car, n.cdr } if (!n.car.has_side_effects(t) && !n.cdr.has_side_effects(t) && n.car.equivalent_to(n.cdr)) return n.car } return n.cdr instanceof je && "void" == n.cdr.operator && !n.cdr.expression.has_side_effects(t) ? (n.cdr.operator = n.car, n.cdr) : n.cdr instanceof gt ? e(je, n, { operator: "void", expression: n.car }) : n }), Pe.DEFMETHOD("lift_sequences", function (n) { if (n.option("sequences") && this.expression instanceof Re) { var e = this.expression, t = e.to_array(); return this.expression = t.pop(), t.push(this), e = Re.from_array(t).transform(n) } return this }), n(Ie, function (n, e) { return n.lift_sequences(e) }), n(je, function (n, t) { n = n.lift_sequences(t); var r = n.expression; if (t.option("booleans") && t.in_boolean_context()) { switch (n.operator) { case "!": if (r instanceof je && "!" == r.operator) return r.expression; break; case "typeof": return t.warn("Boolean expression always true [{file}:{line},{col}]", n.start), e(Et, n) } r instanceof Ue && "!" == n.operator && (n = f(n, r.negate(t))) } return n.evaluate(t)[0] }), Ue.DEFMETHOD("lift_sequences", function (n) { if (n.option("sequences")) { if (this.left instanceof Re) { var e = this.left, t = e.to_array(); return this.left = t.pop(), t.push(this), e = Re.from_array(t).transform(n) } if (this.right instanceof Re && this instanceof Le && !A(this.left, n)) { var e = this.right, t = e.to_array(); return this.right = t.pop(), t.push(this), e = Re.from_array(t).transform(n) } } return this }); var D = g("== === != !== * & | ^"); n(Ue, function (n, t) { var r = t.has_directive("use asm") ? l : function (e, r) { if (r || !n.left.has_side_effects(t) && !n.right.has_side_effects(t)) { e && (n.operator = e); var i = n.left; n.left = n.right, n.right = i } }; if (D(n.operator) && (n.right instanceof lt && !(n.left instanceof lt) && (n.left instanceof Ue && It[n.left.operator] >= It[n.operator] || r(null, !0)), /^[!=]==?$/.test(n.operator))) { if (n.left instanceof st && n.right instanceof Ve) { if (n.right.consequent instanceof st && n.right.consequent.definition() === n.left.definition()) { if (/^==/.test(n.operator)) return n.right.condition; if (/^!=/.test(n.operator)) return n.right.condition.negate(t) } if (n.right.alternative instanceof st && n.right.alternative.definition() === n.left.definition()) { if (/^==/.test(n.operator)) return n.right.condition.negate(t); if (/^!=/.test(n.operator)) return n.right.condition } } if (n.right instanceof st && n.left instanceof Ve) { if (n.left.consequent instanceof st && n.left.consequent.definition() === n.right.definition()) { if (/^==/.test(n.operator)) return n.left.condition; if (/^!=/.test(n.operator)) return n.left.condition.negate(t) } if (n.left.alternative instanceof st && n.left.alternative.definition() === n.right.definition()) { if (/^==/.test(n.operator)) return n.left.condition.negate(t); if (/^!=/.test(n.operator)) return n.left.condition } } } if (n = n.lift_sequences(t), t.option("comparisons")) switch (n.operator) { case "===": case "!==": (n.left.is_string(t) && n.right.is_string(t) || n.left.is_boolean() && n.right.is_boolean()) && (n.operator = n.operator.substr(0, 2)); case "==": case "!=": n.left instanceof pt && "undefined" == n.left.value && n.right instanceof je && "typeof" == n.right.operator && t.option("unsafe") && (n.right.expression instanceof st && n.right.expression.undeclared() || (n.right = n.right.expression, n.left = e(gt, n.left).optimize(t), 2 == n.operator.length && (n.operator += "="))) } if (t.option("booleans") && t.in_boolean_context()) switch (n.operator) { case "&&": var i = n.left.evaluate(t), o = n.right.evaluate(t); if (i.length > 1 && !i[1] || o.length > 1 && !o[1]) return t.warn("Boolean && always false [{file}:{line},{col}]", n.start), e(wt, n); if (i.length > 1 && i[1]) return o[0]; if (o.length > 1 && o[1]) return i[0]; break; case "||": var i = n.left.evaluate(t), o = n.right.evaluate(t); if (i.length > 1 && i[1] || o.length > 1 && o[1]) return t.warn("Boolean || always true [{file}:{line},{col}]", n.start), e(Et, n); if (i.length > 1 && !i[1]) return o[0]; if (o.length > 1 && !o[1]) return i[0]; break; case "+": var i = n.left.evaluate(t), o = n.right.evaluate(t); if (i.length > 1 && i[0] instanceof pt && i[1] || o.length > 1 && o[0] instanceof pt && o[1]) return t.warn("+ in boolean context always true [{file}:{line},{col}]", n.start), e(Et, n) } if (t.option("comparisons")) { if (!(t.parent() instanceof Ue) || t.parent() instanceof Le) { var a = e(je, n, { operator: "!", expression: n.negate(t) }); n = f(n, a) } switch (n.operator) { case "<": r(">"); break; case "<=": r(">=") } } return "+" == n.operator && n.right instanceof pt && "" === n.right.getValue() && n.left instanceof Ue && "+" == n.left.operator && n.left.is_string(t) ? n.left : (t.option("evaluate") && "+" == n.operator && (n.left instanceof lt && n.right instanceof Ue && "+" == n.right.operator && n.right.left instanceof lt && n.right.is_string(t) && (n = e(Ue, n, { operator: "+", left: e(pt, null, { value: "" + n.left.getValue() + n.right.left.getValue(), start: n.left.start, end: n.right.left.end }), right: n.right.right })), n.right instanceof lt && n.left instanceof Ue && "+" == n.left.operator && n.left.right instanceof lt && n.left.is_string(t) && (n = e(Ue, n, { operator: "+", left: n.left.left, right: e(pt, null, { value: "" + n.left.right.getValue() + n.right.getValue(), start: n.left.right.start, end: n.right.end }) })), n.left instanceof Ue && "+" == n.left.operator && n.left.is_string(t) && n.left.right instanceof lt && n.right instanceof Ue && "+" == n.right.operator && n.right.left instanceof lt && n.right.is_string(t) && (n = e(Ue, n, { operator: "+", left: e(Ue, n.left, { operator: "+", left: n.left.left, right: e(pt, null, { value: "" + n.left.right.getValue() + n.right.left.getValue(), start: n.left.right.start, end: n.right.left.end }) }), right: n.right.right }))), n.right instanceof Ue && n.right.operator == n.operator && ("*" == n.operator || "&&" == n.operator || "||" == n.operator) ? (n.left = e(Ue, n.left, { operator: n.operator, left: n.left, right: n.right.left }), n.right = n.right.right, n.transform(t)) : n.evaluate(t)[0]) }), n(st, function (n, r) { if (n.undeclared()) { var i = r.option("global_defs"); if (i && i.hasOwnProperty(n.name)) return t(r, i[n.name], n); switch (n.name) { case "undefined": return e(gt, n); case "NaN": return e(vt, n); case "Infinity": return e(yt, n) } } return n }), n(gt, function (n, t) { if (t.option("unsafe")) { var r = t.find_parent(ce), i = r.find_variable("undefined"); if (i) { var o = e(st, n, { name: "undefined", scope: r, thedef: i }); return o.reference(), o } } return n }); var F = ["+", "-", "/", "*", "%", ">>", "<<", ">>>", "|", "^", "&"]; n(Le, function (n, e) { return n = n.lift_sequences(e), "=" == n.operator && n.left instanceof st && n.right instanceof Ue && n.right.left instanceof st && n.right.left.name == n.left.name && o(n.right.operator, F) && (n.operator = n.right.operator + "=", n.right = n.right.right), n }), n(Ve, function (n, t) { if (!t.option("conditionals")) return n; if (n.condition instanceof Re) { var r = n.condition.car; return n.condition = n.condition.cdr, Re.cons(r, n) } var i = n.condition.evaluate(t); if (i.length > 1) return i[1] ? (t.warn("Condition always true [{file}:{line},{col}]", n.start), n.consequent) : (t.warn("Condition always false [{file}:{line},{col}]", n.start), n.alternative); var o = i[0].negate(t); f(i[0], o) === o && (n = e(Ve, n, { condition: o, consequent: n.alternative, alternative: n.consequent })); var a = n.consequent, u = n.alternative; if (a instanceof Le && u instanceof Le && a.operator == u.operator && a.left.equivalent_to(u.left)) return e(Le, n, { operator: a.operator, left: a.left, right: e(Ve, n, { condition: n.condition, consequent: a.right, alternative: u.right }) }); if (a instanceof Me && u.TYPE === a.TYPE && a.args.length == u.args.length && a.expression.equivalent_to(u.expression)) { if (0 == a.args.length) return e(Re, n, { car: n.condition, cdr: a }); if (1 == a.args.length) return a.args[0] = e(Ve, n, { condition: n.condition, consequent: a.args[0], alternative: u.args[0] }), a } return a instanceof Ve && a.alternative.equivalent_to(u) ? e(Ve, n, { condition: e(Ue, n, { left: n.condition, operator: "&&", right: a.condition }), consequent: a.consequent, alternative: u }) : n }), n(At, function (n, t) { if (t.option("booleans")) { var r = t.parent(); return r instanceof Ue && ("==" == r.operator || "!=" == r.operator) ? (t.warn("Non-strict equality against boolean: {operator} {value} [{file}:{line},{col}]", { operator: r.operator, value: n.value, file: r.start.file, line: r.start.line, col: r.start.col }), e(dt, n, { value: +n.value })) : e(je, n, { operator: "!", expression: e(dt, n, { value: 1 - n.value }) }) } return n }), n(ze, function (n, t) { var r = n.property; if (r instanceof pt && t.option("properties")) { if (r = r.getValue(), St(r) ? t.option("screw_ie8") : $(r)) return e(He, n, { expression: n.expression, property: r }); var i = parseFloat(r); isNaN(i) || i.toString() != r || (n.property = e(dt, n.property, { value: i })) } return n }), n(We, w), n(Ye, w), n(ht, w)
    }(), function () { function n(n) { var r = "prefix" in n ? n.prefix : "UnaryExpression" == n.type ? !0 : !1; return new (r ? je : Ie)({ start: e(n), end: t(n), operator: n.operator, expression: i(n.argument) }) } function e(n) { return new L({ file: n.loc && n.loc.source, line: n.loc && n.loc.start.line, col: n.loc && n.loc.start.column, pos: n.start, endpos: n.start }) } function t(n) { return new L({ file: n.loc && n.loc.source, line: n.loc && n.loc.end.line, col: n.loc && n.loc.end.column, pos: n.end, endpos: n.end }) } function r(n, r, a) { var u = "function From_Moz_" + n + "(M){\n"; return u += "return new mytype({\nstart: my_start_token(M),\nend: my_end_token(M)", a && a.split(/\s*,\s*/).forEach(function (n) { var e = /([a-z0-9$_]+)(=|@|>|%)([a-z0-9$_]+)/i.exec(n); if (!e) throw new Error("Can't understand property map: " + n); var t = "M." + e[1], r = e[2], i = e[3]; if (u += ",\n" + i + ": ", "@" == r) u += t + ".map(from_moz)"; else if (">" == r) u += "from_moz(" + t + ")"; else if ("=" == r) u += t; else { if ("%" != r) throw new Error("Can't understand operator in propmap: " + n); u += "from_moz(" + t + ").body" } }), u += "\n})}", u = new Function("mytype", "my_start_token", "my_end_token", "from_moz", "return(" + u + ")")(r, e, t, i), o[n] = u } function i(n) { a.push(n); var e = null != n ? o[n.type](n) : null; return a.pop(), e } var o = { TryStatement: function (n) { return new Ce({ start: e(n), end: t(n), body: i(n.block).body, bcatch: i(n.handlers ? n.handlers[0] : n.handler), bfinally: n.finalizer ? new xe(i(n.finalizer)) : null }) }, CatchClause: function (n) { return new ke({ start: e(n), end: t(n), argname: i(n.param), body: i(n.body).body }) }, ObjectExpression: function (n) { return new Ye({ start: e(n), end: t(n), properties: n.properties.map(function (n) { var r = n.key, o = "Identifier" == r.type ? r.name : r.value, a = { start: e(r), end: t(n.value), key: o, value: i(n.value) }; switch (n.kind) { case "init": return new Ge(a); case "set": return a.value.name = i(r), new Ke(a); case "get": return a.value.name = i(r), new Je(a) } }) }) }, SequenceExpression: function (n) { return Re.from_array(n.expressions.map(i)) }, MemberExpression: function (n) { return new (n.computed ? ze : He)({ start: e(n), end: t(n), property: n.computed ? i(n.property) : n.property.name, expression: i(n.object) }) }, SwitchCase: function (n) { return new (n.test ? Se : Fe)({ start: e(n), end: t(n), expression: i(n.test), body: n.consequent.map(i) }) }, Literal: function (n) { var r = n.value, i = { start: e(n), end: t(n) }; if (null === r) return new mt(i); switch (typeof r) { case "string": return i.value = r, new pt(i); case "number": return i.value = r, new dt(i); case "boolean": return new (r ? Et : wt)(i); default: return i.value = r, new ht(i) } }, UnaryExpression: n, UpdateExpression: n, Identifier: function (n) { var r = a[a.length - 2]; return new ("this" == n.name ? ft : "LabeledStatement" == r.type ? ut : "VariableDeclarator" == r.type && r.id === n ? "const" == r.kind ? tt : et : "FunctionExpression" == r.type ? r.id === n ? ot : rt : "FunctionDeclaration" == r.type ? r.id === n ? it : rt : "CatchClause" == r.type ? at : "BreakStatement" == r.type || "ContinueStatement" == r.type ? ct : st)({ start: e(n), end: t(n), name: n.name }) } }; r("Node", W), r("Program", fe, "body@body"), r("Function", de, "id>name, params@argnames, body%body"), r("EmptyStatement", Q), r("BlockStatement", Z, "body@body"), r("ExpressionStatement", K, "expression>body"), r("IfStatement", we, "test>condition, consequent>body, alternate>alternative"), r("LabeledStatement", ee, "label>label, body>body"), r("BreakStatement", ye, "label>label"), r("ContinueStatement", Ae, "label>label"), r("WithStatement", se, "object>expression, body>body"), r("SwitchStatement", Ee, "discriminant>expression, cases@body"), r("ReturnStatement", ve, "argument>value"), r("ThrowStatement", ge, "argument>value"), r("WhileStatement", oe, "test>condition, body>body"), r("DoWhileStatement", ie, "test>condition, body>body"), r("ForStatement", ae, "init>init, test>condition, update>step, body>body"), r("ForInStatement", ue, "left>init, right>object, body>body"), r("DebuggerStatement", X), r("FunctionDeclaration", he, "id>name, params@argnames, body%body"), r("VariableDeclaration", Te, "declarations@definitions"), r("VariableDeclarator", Oe, "id>name, init>value"), r("ThisExpression", ft), r("ArrayExpression", We, "elements@elements"), r("FunctionExpression", de, "id>name, params@argnames, body%body"), r("BinaryExpression", Ue, "operator=operator, left>left, right>right"), r("AssignmentExpression", Le, "operator=operator, left>left, right>right"), r("LogicalExpression", Ue, "operator=operator, left>left, right>right"), r("ConditionalExpression", Ve, "test>condition, consequent>consequent, alternate>alternative"), r("NewExpression", Ne, "callee>expression, arguments@args"), r("CallExpression", Me, "callee>expression, arguments@args"); var a = null; W.from_mozilla_ast = function (n) { var e = a; a = []; var t = i(n); return a = e, t } }(), n.array_to_hash = t, n.slice = r, n.characters = i, n.member = o, n.find_if = a, n.repeat_string = u, n.DefaultsError = s, n.defaults = c, n.merge = f, n.noop = l, n.MAP = V, n.push_uniq = p, n.string_template = d, n.remove = h, n.mergeSort = _, n.set_difference = m, n.set_intersection = v, n.makePredicate = g, n.all = b, n.Dictionary = y, n.DEFNODE = A, n.AST_Token = L, n.AST_Node = W, n.AST_Statement = Y, n.AST_Debugger = X, n.AST_Directive = G, n.AST_SimpleStatement = K, n.walk_body = w, n.AST_Block = J, n.AST_BlockStatement = Z, n.AST_EmptyStatement = Q, n.AST_StatementWithBody = ne, n.AST_LabeledStatement = ee, n.AST_IterationStatement = te, n.AST_DWLoop = re, n.AST_Do = ie, n.AST_While = oe, n.AST_For = ae, n.AST_ForIn = ue, n.AST_With = se, n.AST_Scope = ce, n.AST_Toplevel = fe, n.AST_Lambda = le, n.AST_Accessor = pe, n.AST_Function = de, n.AST_Defun = he, n.AST_Jump = _e, n.AST_Exit = me, n.AST_Return = ve, n.AST_Throw = ge, n.AST_LoopControl = be, n.AST_Break = ye, n.AST_Continue = Ae, n.AST_If = we, n.AST_Switch = Ee, n.AST_SwitchBranch = De, n.AST_Default = Fe, n.AST_Case = Se, n.AST_Try = Ce, n.AST_Catch = ke, n.AST_Finally = xe, n.AST_Definitions = Be, n.AST_Var = Te, n.AST_Const = $e, n.AST_VarDef = Oe, n.AST_Call = Me, n.AST_New = Ne, n.AST_Seq = Re, n.AST_PropAccess = qe, n.AST_Dot = He, n.AST_Sub = ze, n.AST_Unary = Pe, n.AST_UnaryPrefix = je, n.AST_UnaryPostfix = Ie, n.AST_Binary = Ue, n.AST_Conditional = Ve, n.AST_Assign = Le, n.AST_Array = We, n.AST_Object = Ye, n.AST_ObjectProperty = Xe, n.AST_ObjectKeyVal = Ge, n.AST_ObjectSetter = Ke, n.AST_ObjectGetter = Je, n.AST_Symbol = Ze, n.AST_SymbolAccessor = Qe, n.AST_SymbolDeclaration = nt, n.AST_SymbolVar = et, n.AST_SymbolConst = tt, n.AST_SymbolFunarg = rt, n.AST_SymbolDefun = it, n.AST_SymbolLambda = ot, n.AST_SymbolCatch = at, n.AST_Label = ut, n.AST_SymbolRef = st, n.AST_LabelRef = ct, n.AST_This = ft, n.AST_Constant = lt, n.AST_String = pt, n.AST_Number = dt, n.AST_RegExp = ht, n.AST_Atom = _t, n.AST_Null = mt, n.AST_NaN = vt, n.AST_Undefined = gt, n.AST_Hole = bt, n.AST_Infinity = yt, n.AST_Boolean = At, n.AST_False = wt, n.AST_True = Et, n.TreeWalker = E, n.KEYWORDS = Dt, n.KEYWORDS_ATOM = Ft, n.RESERVED_WORDS = St, n.KEYWORDS_BEFORE_EXPRESSION = Ct, n.OPERATOR_CHARS = kt, n.RE_HEX_NUMBER = xt, n.RE_OCT_NUMBER = Bt, n.RE_DEC_NUMBER = Tt, n.OPERATORS = $t, n.WHITESPACE_CHARS = Ot, n.PUNC_BEFORE_EXPRESSION = Mt, n.PUNC_CHARS = Nt, n.REGEXP_MODIFIERS = Rt, n.UNICODE = qt, n.is_letter = D, n.is_digit = F, n.is_alphanumeric_char = S, n.is_unicode_combining_mark = C, n.is_unicode_connector_punctuation = k, n.is_identifier = x, n.is_identifier_start = B, n.is_identifier_char = T, n.is_identifier_string = $, n.parse_js_number = O, n.JS_Parse_Error = M, n.js_error = N, n.is_token = R, n.EX_EOF = Ht, n.tokenizer = q, n.UNARY_PREFIX = zt, n.UNARY_POSTFIX = Pt, n.ASSIGNMENT = jt, n.PRECEDENCE = It, n.STATEMENTS_WITH_LABELS = Ut, n.ATOMIC_START_TOKEN = Vt, n.parse = H, n.TreeTransformer = z, n.SymbolDef = P, n.base54 = Lt, n.OutputStream = j, n.Compressor = I, n.SourceMap = U
}({}, function () { return this }());
// jslint.js
// 2011-02-28

/*
Copyright (c) 2002 Douglas Crockford  (www.JSLint.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

The Software shall be used for Good, not Evil.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
    JSLINT is a global function. It takes two parameters.

        var myResult = JSLINT(source, option);

    The first parameter is either a string or an array of strings. If it is a
    string, it will be split on '\n' or '\r'. If it is an array of strings, it
    is assumed that each string represents one line. The source can be a
    JavaScript text, or HTML text, or a JSON text, or a CSS text.

    The second parameter is an optional object of options which control the
    operation of JSLINT. Most of the options are booleans: They are all
    optional and have a default value of false. One of the options, predef,
    can be an array of names, which will be used to declare global variables,
    or an object whose keys are used as global names, with a boolean value
    that determines if they are assignable.

    If it checks out, JSLINT returns true. Otherwise, it returns false.

    If false, you can inspect JSLINT.errors to find out the problems.
    JSLINT.errors is an array of objects containing these members:

    {
        line      : The line (relative to 0) at which the lint was found
        character : The character (relative to 0) at which the lint was found
        reason    : The problem
        evidence  : The text line in which the problem occurred
        raw       : The raw message before the details were inserted
        a         : The first detail
        b         : The second detail
        c         : The third detail
        d         : The fourth detail
    }

    If a fatal error was found, a null will be the last element of the
    JSLINT.errors array.

    You can request a Function Report, which shows all of the functions
    and the parameters and vars that they use. This can be used to find
    implied global variables and other problems. The report is in HTML and
    can be inserted in an HTML <body>.

        var myReport = JSLINT.report(errors_only);

    If errors_only is true, then the report will be limited to only errors.

    You can request a data structure which contains JSLint's results.

        var myData = JSLINT.data();

    It returns a structure with this form:

    {
        errors: [
            {
                line: NUMBER,
                character: NUMBER,
                reason: STRING,
                evidence: STRING
            }
        ],
        functions: [
            name: STRING,
            line: NUMBER,
            last: NUMBER,
            param: [
                TOKEN
            ],
            closure: [
                STRING
            ],
            var: [
                STRING
            ],
            exception: [
                STRING
            ],
            outer: [
                STRING
            ],
            unused: [
                STRING
            ],
            global: [
                STRING
            ],
            label: [
                STRING
            ]
        ],
        globals: [
            STRING
        ],
        member: {
            STRING: NUMBER
        },
        unuseds: [
            {
                name: STRING,
                line: NUMBER
            }
        ],
        implieds: [
            {
                name: STRING,
                line: NUMBER
            }
        ],
        urls: [
            STRING
        ],
        json: BOOLEAN
    }

    Empty arrays will not be included.

    You can obtain the parse tree that JSLint constructed while parsing. The
    latest tree is kept in JSLINT.tree. A nice stringication can be produced
    with

        JSON.stringify(JSLINT.tree, [
            'value',  'arity', 'name',  'first',
            'second', 'third', 'block', 'else'
        ], 4));

*/

/*jslint
    evil: true, nomen: false, onevar: false, regexp: false, strict: true
*/

/*members "\b", "\t", "\n", "\f", "\r", "!=", "!==", "\"", "%", "'",
    "(begin)", "(breakage)", "(context)", "(end)", "(error)", "(global)",
    "(identifier)", "(line)", "(loopage)", "(name)", "(onevar)",
    "(params)", "(scope)", "(statement)", "(token)", "(verb)", ")", "*",
    "+", "-", "/", ";", "<", "</", "<=", "==", "===", ">", ">=", ADSAFE,
    ActiveXObject, Array, Boolean, COM, CScript, Canvas, CustomAnimation,
    Date, Debug, E, Enumerator, Error, EvalError, FadeAnimation, Flash,
    FormField, Frame, Function, HotKey, Image, JSON, LN10, LN2, LOG10E,
    LOG2E, MAX_VALUE, MIN_VALUE, Math, MenuItem, MoveAnimation,
    NEGATIVE_INFINITY, Number, Object, Option, PI, POSITIVE_INFINITY, Point,
    RangeError, Rectangle, ReferenceError, RegExp, ResizeAnimation,
    RotateAnimation, SQRT1_2, SQRT2, ScrollBar, String, Style, SyntaxError,
    System, Text, TextArea, Timer, TypeError, URIError, URL, VBArray,
    WScript, Web, Window, XMLDOM, XMLHttpRequest, "\\", a, a_function,
    a_label, a_not_allowed, a_not_defined, a_scope, abbr, acronym,
    activeborder, activecaption, address, adsafe, adsafe_a,
    adsafe_autocomplete, adsafe_bad_id, adsafe_div, adsafe_fragment,
    adsafe_go, adsafe_html, adsafe_id, adsafe_id_go, adsafe_lib,
    adsafe_lib_second, adsafe_missing_id, adsafe_name_a, adsafe_placement,
    adsafe_prefix_a, adsafe_script, adsafe_source, adsafe_subscript_a,
    adsafe_tag, alert, aliceblue, all, already_defined, and, animator,
    antiquewhite, appleScript, applet, apply, approved, appworkspace, aqua,
    aquamarine, area, arguments, arity, article, aside, assign,
    assign_exception, assignment_function_expression, at, attribute_case_a,
    audio, autocomplete, avoid_a, azure, b, background,
    "background-attachment", "background-color", "background-image",
    "background-position", "background-repeat", bad_assignment, bad_color_a,
    bad_constructor, bad_entity, bad_html, bad_id_a, bad_in_a,
    bad_invocation, bad_name_a, bad_new, bad_number, bad_operand, bad_type,
    bad_url, bad_wrap, base, bdo, beep, beige, big, bisque, bitwise, black,
    blanchedalmond, block, blockquote, blue, blueviolet, body, border,
    "border-bottom", "border-bottom-color", "border-bottom-style",
    "border-bottom-width", "border-collapse", "border-color", "border-left",
    "border-left-color", "border-left-style", "border-left-width",
    "border-right", "border-right-color", "border-right-style",
    "border-right-width", "border-spacing", "border-style", "border-top",
    "border-top-color", "border-top-style", "border-top-width",
    "border-width", bottom, br, braille, brown, browser, burlywood, button,
    buttonface, buttonhighlight, buttonshadow, buttontext, bytesToUIString,
    c, cadetblue, call, callee, caller, canvas, cap, caption,
    "caption-side", captiontext, case, center, charAt, charCodeAt,
    character, chartreuse, chocolate, chooseColor, chooseFile, chooseFolder,
    cite, clear, clearInterval, clearTimeout, clip, closeWidget, closure,
    cm, code, col, colgroup, color, combine_var, command, comments, concat,
    conditional_assignment, confirm, confusing_a, confusing_regexp, console,
    constructor, constructor_name_a, content, continue, control_a,
    convertPathToHFS, convertPathToPlatform, coral, cornflowerblue,
    cornsilk, "counter-increment", "counter-reset", create, crimson, css,
    cursor, cyan, d, dangerous_comment, dangling_a, darkblue, darkcyan,
    darkgoldenrod, darkgray, darkgreen, darkkhaki, darkmagenta,
    darkolivegreen, darkorange, darkorchid, darkred, darksalmon,
    darkseagreen, darkslateblue, darkslategray, darkturquoise, darkviolet,
    data, datalist, dd, debug, decodeURI, decodeURIComponent, deeppink,
    deepskyblue, default, defineClass, del, deleted, deserialize, details,
    devel, dfn, dialog, dimgray, dir, direction, display, disrupt, div, dl,
    do, document, dodgerblue, dt, duplicate_a, edge, edition, else, em,
    embed, embossed, empty, "empty-cells", empty_block, empty_case,
    empty_class, encodeURI, encodeURIComponent, entityify, errors, es5,
    escape, eval, event, evidence, evil, ex, exception, exec, expected_a,
    expected_a_at_b_c, expected_a_b, expected_a_b_from_c_d, expected_at_a,
    expected_attribute_a, expected_attribute_value_a, expected_class_a,
    expected_fraction_a, expected_id_a, expected_identifier_a,
    expected_identifier_a_reserved, expected_lang_a, expected_linear_a,
    expected_media_a, expected_name_a, expected_nonstandard_style_attribute,
    expected_number_a, expected_operator_a, expected_percent_a,
    expected_positive_a, expected_pseudo_a, expected_selector_a,
    expected_small_a, expected_space_a_b, expected_string_a,
    expected_style_attribute, expected_style_pattern, expected_tagname_a,
    fieldset, figure, filesystem, firebrick, first, float, floor,
    floralwhite, focusWidget, font, "font-family", "font-size",
    "font-size-adjust", "font-stretch", "font-style", "font-variant",
    "font-weight", footer, for, for_if, forestgreen, forin, form, fragment,
    frame, frames, frameset, from, fromCharCode, fuchsia, fud, funct,
    function, function_block, function_eval, function_loop,
    function_statement, function_strict, functions, g, gainsboro, gc,
    get_set, ghostwhite, global, globals, gold, goldenrod, gray, graytext,
    green, greenyellow, h1, h2, h3, h4, h5, h6, handheld, hasOwnProperty,
    head, header, height, help, hgroup, highlight, highlighttext, history,
    honeydew, hotpink, hr, "hta:application", html, html_confusion_a,
    html_handlers, i, iTunes, id, identifier, identifier_function, iframe,
    img, immed, implied_evil, implieds, in, inactiveborder, inactivecaption,
    inactivecaptiontext, include, indent, indexOf, indianred, indigo, infix_in,
    infobackground, infotext, init, input, ins, insecure_a, isAlpha,
    isApplicationRunning, isArray, isDigit, isFinite, isNaN, ivory, join,
    jslint, json, kbd, keygen, keys, khaki, konfabulatorVersion, label,
    label_a_b, labeled, lang, lavender, lavenderblush, lawngreen, lbp,
    leading_decimal_a, led, left, legend, lemonchiffon, length,
    "letter-spacing", li, lib, lightblue, lightcoral, lightcyan,
    lightgoldenrodyellow, lightgreen, lightpink, lightsalmon, lightseagreen,
    lightskyblue, lightslategray, lightsteelblue, lightyellow, lime,
    limegreen, line, "line-height", linen, link, "list-style",
    "list-style-image", "list-style-position", "list-style-type", load,
    loadClass, location, log, m, magenta, map, margin, "margin-bottom",
    "margin-left", "margin-right", "margin-top", mark, "marker-offset",
    maroon, match, "max-height", "max-width", maxerr, maxlen, md5,
    mediumaquamarine, mediumblue, mediumorchid, mediumpurple,
    mediumseagreen, mediumslateblue, mediumspringgreen, mediumturquoise,
    mediumvioletred, member, menu, menutext, message, meta, meter,
    midnightblue, "min-height", "min-width", mintcream, missing_a,
    missing_a_after_b, missing_option, missing_property, missing_space_a_b,
    missing_url, missing_use_strict, mistyrose, mixed, mm, moccasin, mode,
    move_invocation, move_var, name, name_function, nav, navajowhite,
    navigator, navy, nested_comment, newcap, next, noframes, nomen,
    noscript, not, not_a_constructor, not_a_function, not_a_label,
    not_a_scope, not_greater, nud, object, ol, oldlace, olive, olivedrab,
    on, onevar, opacity, open, openURL, opera, optgroup, option, orange,
    orangered, orchid, outer, outline, "outline-color", "outline-style",
    "outline-width", output, overflow, "overflow-x", "overflow-y", p,
    padding, "padding-bottom", "padding-left", "padding-right",
    "padding-top", "page-break-after", "page-break-before", palegoldenrod,
    palegreen, paleturquoise, palevioletred, papayawhip, param,
    parameter_a_get_b, parameter_set_a, paren, parent, parseFloat, parseInt,
    passfail, pc, peachpuff, peru, pink, play, plum, plusplus, pop,
    popupMenu, position, postcomments, postscript, powderblue, pre, predef,
    preferenceGroups, preferences, prev, print, progress, projection,
    prompt, prototype, pt, purple, push, px, q, quit, quote, quotes, radix,
    random, range, raw, readFile, readUrl, read_only, reason, red,
    redefinition_a, regexp, reloadWidget, replace, report, reserved,
    reserved_a, resolvePath, resumeUpdates, rhino, right, rosybrown,
    royalblue, rp, rt, ruby, runCommand, runCommandInBg, saddlebrown, safe,
    salmon, samp, sandybrown, saveAs, savePreferences, scanned_a_b, screen,
    script, scrollbar, seagreen, seal, search, seashell, second, section,
    select, serialize, setInterval, setTimeout, shift,
    showWidgetPreferences, sienna, silver, skyblue, slash_equal, slateblue,
    slategray, sleep, slice, small, snow, sort, source, span, spawn, speak,
    speech, split, springgreen, src, stack, statement, statement_block,
    steelblue, stopping, strange_loop, strict, strong, style, styleproperty,
    sub, subscript, substr, sup, supplant, suppressUpdates, switch, sync,
    system, table, "table-layout", tag_a_in_b, tan, tbody, td, teal,
    tellWidget, test, "text-align", "text-decoration", "text-indent",
    "text-shadow", "text-transform", textarea, tfoot, th, thead, third,
    thistle, threeddarkshadow, threedface, threedhighlight,
    threedlightshadow, threedshadow, thru, time, title, toLowerCase,
    toString, toUpperCase, toint32, token, tomato, too_long, too_many, top,
    tr, trailing_decimal_a, tree, tt, tty, turquoise, tv, type, u, ul,
    unclosed, unclosed_comment, unclosed_regexp, undef, unescape,
    unescaped_a, unexpected_a, unexpected_char_a_b, unexpected_comment,
    unexpected_member_a, unexpected_space_a_b, "unicode-bidi",
    unnecessary_initialize, unnecessary_use, unreachable_a_b,
    unrecognized_style_attribute_a, unrecognized_tag_a, unsafe, unused,
    unwatch, updateNow, url, urls, use_array, use_braces, use_object,
    used_before_a, value, valueOf, var, var_a_not, version,
    "vertical-align", video, violet, visibility, was, watch,
    weird_assignment, weird_condition, weird_new, weird_program,
    weird_relation, weird_ternary, wheat, while, white, "white-space",
    whitesmoke, widget, width, window, windowframe, windows, windowtext,
    "word-spacing", "word-wrap", wrap, wrap_immediate, wrap_regexp,
    write_is_wrong, yahooCheckLogin, yahooLogin, yahooLogout, yellow,
    yellowgreen, "z-index", "}"
*/

// We build the application inside a function so that we produce only a single
// global variable. That function will be invoked immediately, and its return
// value is the JSLINT function itself. That function is also an object that
// can contain data and other functions.

var JSLINT = (function () {
    "use strict";

    var adsafe_id,      // The widget's ADsafe id.
        adsafe_may,     // The widget may load approved scripts.
        adsafe_top,     // At the top of the widget script.
        adsafe_went,    // ADSAFE.go has been called.
        anonname,       // The guessed name for anonymous functions.
        approved,       // ADsafe approved urls.

// These are operators that should not be used with the ! operator.

        bang = {
            '<': true,
            '<=': true,
            '==': true,
            '===': true,
            '!==': true,
            '!=': true,
            '>': true,
            '>=': true,
            '+': true,
            '-': true,
            '*': true,
            '/': true,
            '%': true
        },

// These are property names that should not be permitted in the safe subset.

        banned = {
            'arguments': true,
            callee: true,
            caller: true,
            constructor: true,
            'eval': true,
            prototype: true,
            stack: true,
            unwatch: true,
            valueOf: true,
            watch: true
        },


// These are the JSLint boolean options.

        bool_options = {
            adsafe: true, // if ADsafe should be enforced
            bitwise: true, // if bitwise operators should not be allowed
            browser: true, // if the standard browser globals should be predefined
            cap: true, // if upper case HTML should be allowed
            'continue': true, // if the continuation statement should be tolerated
            css: true, // if CSS workarounds should be tolerated
            debug: true, // if debugger statements should be allowed
            devel: true, // if logging should be allowed (console, alert, etc.)
            es5: true, // if ES5 syntax should be allowed
            evil: true, // if eval should be allowed
            forin: true, // if for in statements need not filter
            fragment: true, // if HTML fragments should be allowed
            newcap: true, // if constructor names must be capitalized
            nomen: true, // if names should be checked
            on: true, // if HTML event handlers should be allowed
            onevar: true, // if only one var statement per function should be allowed
            passfail: true, // if the scan should stop on first error
            plusplus: true, // if increment/decrement should not be allowed
            regexp: true, // if the . should not be allowed in regexp literals
            rhino: true, // if the Rhino environment globals should be predefined
            undef: true, // if variables should be declared before used
            safe: true, // if use of some browser features should be restricted
            windows: true, // if MS Windows-specigic globals should be predefined
            strict: true, // require the "use strict"; pragma
            sub: true, // if all forms of subscript notation are tolerated
            white: true, // if strict whitespace rules apply
            widget: true  // if the Yahoo Widgets globals should be predefined
        },

// browser contains a set of global names that are commonly provided by a
// web browser environment.

        browser = {
            clearInterval: false,
            clearTimeout: false,
            document: false,
            event: false,
            frames: false,
            history: false,
            Image: false,
            location: false,
            name: false,
            navigator: false,
            Option: false,
            parent: false,
            screen: false,
            setInterval: false,
            setTimeout: false,
            XMLHttpRequest: false
        },
        bundle = {
            a_function: "'{a}' is a function.",
            a_label: "'{a}' is a statement label.",
            a_not_allowed: "'{a}' is not allowed.",
            a_not_defined: "'{a}' is not defined.",
            a_scope: "'{a}' used out of scope.",
            adsafe: "ADsafe violation.",
            adsafe_a: "ADsafe violation: '{a}'.",
            adsafe_autocomplete: "ADsafe autocomplete violation.",
            adsafe_bad_id: "ADSAFE violation: bad id.",
            adsafe_div: "ADsafe violation: Wrap the widget in a div.",
            adsafe_fragment: "ADSAFE: Use the fragment option.",
            adsafe_go: "ADsafe violation: Missing ADSAFE.go.",
            adsafe_html: "Currently, ADsafe does not operate on whole HTML documents. It operates on <div> fragments and .js files.",
            adsafe_id: "ADsafe violation: id does not match.",
            adsafe_id_go: "ADsafe violation: Missing ADSAFE.id or ADSAFE.go.",
            adsafe_lib: "ADsafe lib violation.",
            adsafe_lib_second: "ADsafe: The second argument to lib must be a function.",
            adsafe_missing_id: "ADSAFE violation: missing ID_.",
            adsafe_name_a: "ADsafe name violation: '{a}'.",
            adsafe_placement: "ADsafe script placement violation.",
            adsafe_prefix_a: "ADsafe violation: An id must have a '{a}' prefix",
            adsafe_script: "ADsafe script violation.",
            adsafe_source: "ADsafe unapproved script source.",
            adsafe_subscript_a: "ADsafe subscript '{a}'.",
            adsafe_tag: "ADsafe violation: Disallowed tag '{a}'.",
            already_defined: "'{a}' is already defined.",
            and: "The '&&' subexpression should be wrapped in parens.",
            assign_exception: "Do not assign to the exception parameter.",
            assignment_function_expression: "Expected an assignment or function call and instead saw an expression.",
            attribute_case_a: "Attribute '{a}' not all lower case.",
            avoid_a: "Avoid '{a}'.",
            bad_assignment: "Bad assignment.",
            bad_color_a: "Bad hex color '{a}'.",
            bad_constructor: "Bad constructor.",
            bad_entity: "Bad entity.",
            bad_html: "Bad HTML string",
            bad_id_a: "Bad id: '{a}'.",
            bad_in_a: "Bad for in variable '{a}'.",
            bad_invocation: "Bad invocation.",
            bad_name_a: "Bad name: '{a}'.",
            bad_new: "Do not use 'new' for side effects.",
            bad_number: "Bad number '{a}'.",
            bad_operand: "Bad operand.",
            bad_type: "Bad type.",
            bad_url: "Bad url string.",
            bad_wrap: "Do not wrap function literals in parens unless they are to be immediately invoked.",
            combine_var: "Combine this with the previous 'var' statement.",
            conditional_assignment: "Expected a conditional expression and instead saw an assignment.",
            confusing_a: "Confusing use of '{a}'.",
            confusing_regexp: "Confusing regular expression.",
            constructor_name_a: "A constructor name '{a}' should start with an uppercase letter.",
            control_a: "Unexpected control character '{a}'.",
            css: "A css file should begin with @charset 'UTF-8';",
            dangling_a: "Unexpected dangling '_' in '{a}'.",
            dangerous_comment: "Dangerous comment.",
            deleted: "Only properties should be deleted.",
            duplicate_a: "Duplicate '{a}'.",
            empty_block: "Empty block.",
            empty_case: "Empty case.",
            empty_class: "Empty class.",
            evil: "eval is evil.",
            expected_a: "Expected '{a}'.",
            expected_a_b: "Expected '{a}' and instead saw '{b}'.",
            expected_a_b_from_c_d: "Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.",
            expected_at_a: "Expected an at-rule, and instead saw @{a}.",
            expected_a_at_b_c: "Expected '{a}' at column {b}, not column {c}.",
            expected_attribute_a: "Expected an attribute, and instead saw [{a}].",
            expected_attribute_value_a: "Expected an attribute value and instead saw '{a}'.",
            expected_class_a: "Expected a class, and instead saw .{a}.",
            expected_fraction_a: "Expected a number between 0 and 1 and instead saw '{a}'",
            expected_id_a: "Expected an id, and instead saw #{a}.",
            expected_identifier_a: "Expected an identifier and instead saw '{a}'.",
            expected_identifier_a_reserved: "Expected an identifier and instead saw '{a}' (a reserved word).",
            expected_linear_a: "Expected a linear unit and instead saw '{a}'.",
            expected_lang_a: "Expected a lang code, and instead saw :{a}.",
            expected_media_a: "Expected a CSS media type, and instead saw '{a}'.",
            expected_name_a: "Expected a name and instead saw '{a}'.",
            expected_nonstandard_style_attribute: "Expected a non-standard style attribute and instead saw '{a}'.",
            expected_number_a: "Expected a number and instead saw '{a}'.",
            expected_operator_a: "Expected an operator and instead saw '{a}'.",
            expected_percent_a: "Expected a percentage and instead saw '{a}'",
            expected_positive_a: "Expected a positive number and instead saw '{a}'",
            expected_pseudo_a: "Expected a pseudo, and instead saw :{a}.",
            expected_selector_a: "Expected a CSS selector, and instead saw {a}.",
            expected_small_a: "Expected a small number and instead saw '{a}'",
            expected_space_a_b: "Expected exactly one space between '{a}' and '{b}'.",
            expected_string_a: "Expected a string and instead saw {a}.",
            expected_style_attribute: "Excepted a style attribute, and instead saw '{a}'.",
            expected_style_pattern: "Expected a style pattern, and instead saw '{a}'.",
            expected_tagname_a: "Expected a tagName, and instead saw {a}.",
            for_if: "The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype.",
            function_block: "Function statements should not be placed in blocks. " +
                "Use a function expression or move the statement to the top of " +
                "the outer function.",
            function_eval: "The Function constructor is eval.",
            function_loop: "Don't make functions within a loop.",
            function_statement: "Function statements are not invocable. " +
                "Wrap the whole function invocation in parens.",
            function_strict: "Use the function form of \"use strict\".",
            get_set: "get/set are ES5 features.",
            html_confusion_a: "HTML confusion in regular expression '<{a}'.",
            html_handlers: "Avoid HTML event handlers.",
            identifier_function: "Expected an identifier in an assignment and instead saw a function invocation.",
            implied_evil: "Implied eval is evil. Pass a function instead of a string.",
            infix_in: "Unexpected 'in'. Compare with undefined, or use the hasOwnProperty method instead.",
            insecure_a: "Insecure '{a}'.",
            isNaN: "Use the isNaN function to compare with NaN.",
            label_a_b: "Label '{a}' on '{b}' statement.",
            lang: "lang is deprecated.",
            leading_decimal_a: "A leading decimal point can be confused with a dot: '.{a}'.",
            missing_a: "Missing '{a}'.",
            missing_a_after_b: "Missing '{a}' after '{b}'.",
            missing_option: "Missing option value.",
            missing_property: "Missing property name.",
            missing_space_a_b: "Missing space between '{a}' and '{b}'.",
            missing_url: "Missing url.",
            missing_use_strict: "Missing \"use strict\" statement.",
            mixed: "Mixed spaces and tabs.",
            move_invocation: "Move the invocation into the parens that contain the function.",
            move_var: "Move 'var' declarations to the top of the function.",
            name_function: "Missing name in function statement.",
            nested_comment: "Nested comment.",
            not: "Nested not.",
            not_a_constructor: "Do not use {a} as a constructor.",
            not_a_function: "'{a}' is not a function.",
            not_a_label: "'{a}' is not a label.",
            not_a_scope: "'{a}' is out of scope.",
            not_greater: "'{a}' should not be greater than '{b}'.",
            parameter_a_get_b: "Unexpected parameter '{a}' in get {b} function.",
            parameter_set_a: "Expected parameter (value) in set {a} function.",
            radix: "Missing radix parameter.",
            read_only: "Read only.",
            redefinition_a: "Redefinition of '{a}'.",
            reserved_a: "Reserved name '{a}'.",
            scanned_a_b: "{a} ({b}% scanned).",
            slash_equal: "A regular expression literal can be confused with '/='.",
            statement_block: "Expected to see a statement and instead saw a block.",
            stopping: "Stopping. ",
            strange_loop: "Strange loop.",
            strict: "Strict violation.",
            subscript: "['{a}'] is better written in dot notation.",
            tag_a_in_b: "A '<{a}>' must be within '<{b}>'.",
            too_long: "Line too long.",
            too_many: "Too many errors.",
            trailing_decimal_a: "A trailing decimal point can be confused with a dot: '.{a}'.",
            type: "type is unnecessary.",
            unclosed: "Unclosed string.",
            unclosed_comment: "Unclosed comment.",
            unclosed_regexp: "Unclosed regular expression.",
            unescaped_a: "Unescaped '{a}'.",
            unexpected_a: "Unexpected '{a}'.",
            unexpected_char_a_b: "Unexpected character '{a}' in {b}.",
            unexpected_comment: "Unexpected comment.",
            unexpected_member_a: "Unexpected /*member {a}.",
            unexpected_space_a_b: "Unexpected space between '{a}' and '{b}'.",
            unnecessary_initialize: "It is not necessary to initialize '{a}' to 'undefined'.",
            unnecessary_use: "Unnecessary \"use strict\".",
            unreachable_a_b: "Unreachable '{a}' after '{b}'.",
            unrecognized_style_attribute_a: "Unrecognized style attribute '{a}'.",
            unrecognized_tag_a: "Unrecognized tag '<{a}>'.",
            unsafe: "Unsafe character.",
            url: "JavaScript URL.",
            use_array: "Use the array literal notation [].",
            use_braces: "Spaces are hard to count. Use {{a}}.",
            use_object: "Use the object literal notation {}.",
            used_before_a: "'{a}' was used before it was defined.",
            var_a_not: "Variable {a} was not declared correctly.",
            weird_assignment: "Weird assignment.",
            weird_condition: "Weird condition.",
            weird_new: "Weird construction. Delete 'new'.",
            weird_program: "Weird program.",
            weird_relation: "Weird relation.",
            weird_ternary: "Weird ternary.",
            wrap_immediate: "Wrap an immediate function invocation in parentheses " +
                "to assist the reader in understanding that the expression " +
                "is the result of a function, and not the function itself.",
            wrap_regexp: "Wrap the /regexp/ literal in parens to disambiguate the slash operator.",
            write_is_wrong: "document.write can be a form of eval."
        },
        comments_off,
        css_attribute_data,
        css_any,

        css_colorData = {
            "aliceblue": true,
            "antiquewhite": true,
            "aqua": true,
            "aquamarine": true,
            "azure": true,
            "beige": true,
            "bisque": true,
            "black": true,
            "blanchedalmond": true,
            "blue": true,
            "blueviolet": true,
            "brown": true,
            "burlywood": true,
            "cadetblue": true,
            "chartreuse": true,
            "chocolate": true,
            "coral": true,
            "cornflowerblue": true,
            "cornsilk": true,
            "crimson": true,
            "cyan": true,
            "darkblue": true,
            "darkcyan": true,
            "darkgoldenrod": true,
            "darkgray": true,
            "darkgreen": true,
            "darkkhaki": true,
            "darkmagenta": true,
            "darkolivegreen": true,
            "darkorange": true,
            "darkorchid": true,
            "darkred": true,
            "darksalmon": true,
            "darkseagreen": true,
            "darkslateblue": true,
            "darkslategray": true,
            "darkturquoise": true,
            "darkviolet": true,
            "deeppink": true,
            "deepskyblue": true,
            "dimgray": true,
            "dodgerblue": true,
            "firebrick": true,
            "floralwhite": true,
            "forestgreen": true,
            "fuchsia": true,
            "gainsboro": true,
            "ghostwhite": true,
            "gold": true,
            "goldenrod": true,
            "gray": true,
            "green": true,
            "greenyellow": true,
            "honeydew": true,
            "hotpink": true,
            "indianred": true,
            "indigo": true,
            "ivory": true,
            "khaki": true,
            "lavender": true,
            "lavenderblush": true,
            "lawngreen": true,
            "lemonchiffon": true,
            "lightblue": true,
            "lightcoral": true,
            "lightcyan": true,
            "lightgoldenrodyellow": true,
            "lightgreen": true,
            "lightpink": true,
            "lightsalmon": true,
            "lightseagreen": true,
            "lightskyblue": true,
            "lightslategray": true,
            "lightsteelblue": true,
            "lightyellow": true,
            "lime": true,
            "limegreen": true,
            "linen": true,
            "magenta": true,
            "maroon": true,
            "mediumaquamarine": true,
            "mediumblue": true,
            "mediumorchid": true,
            "mediumpurple": true,
            "mediumseagreen": true,
            "mediumslateblue": true,
            "mediumspringgreen": true,
            "mediumturquoise": true,
            "mediumvioletred": true,
            "midnightblue": true,
            "mintcream": true,
            "mistyrose": true,
            "moccasin": true,
            "navajowhite": true,
            "navy": true,
            "oldlace": true,
            "olive": true,
            "olivedrab": true,
            "orange": true,
            "orangered": true,
            "orchid": true,
            "palegoldenrod": true,
            "palegreen": true,
            "paleturquoise": true,
            "palevioletred": true,
            "papayawhip": true,
            "peachpuff": true,
            "peru": true,
            "pink": true,
            "plum": true,
            "powderblue": true,
            "purple": true,
            "red": true,
            "rosybrown": true,
            "royalblue": true,
            "saddlebrown": true,
            "salmon": true,
            "sandybrown": true,
            "seagreen": true,
            "seashell": true,
            "sienna": true,
            "silver": true,
            "skyblue": true,
            "slateblue": true,
            "slategray": true,
            "snow": true,
            "springgreen": true,
            "steelblue": true,
            "tan": true,
            "teal": true,
            "thistle": true,
            "tomato": true,
            "turquoise": true,
            "violet": true,
            "wheat": true,
            "white": true,
            "whitesmoke": true,
            "yellow": true,
            "yellowgreen": true,

            "activeborder": true,
            "activecaption": true,
            "appworkspace": true,
            "background": true,
            "buttonface": true,
            "buttonhighlight": true,
            "buttonshadow": true,
            "buttontext": true,
            "captiontext": true,
            "graytext": true,
            "highlight": true,
            "highlighttext": true,
            "inactiveborder": true,
            "inactivecaption": true,
            "inactivecaptiontext": true,
            "infobackground": true,
            "infotext": true,
            "menu": true,
            "menutext": true,
            "scrollbar": true,
            "threeddarkshadow": true,
            "threedface": true,
            "threedhighlight": true,
            "threedlightshadow": true,
            "threedshadow": true,
            "window": true,
            "windowframe": true,
            "windowtext": true
        },

        css_border_style,
        css_break,

        css_lengthData = {
            '%': true,
            'cm': true,
            'em': true,
            'ex': true,
            'in': true,
            'mm': true,
            'pc': true,
            'pt': true,
            'px': true
        },

        css_media,
        css_overflow,

        devel = {
            alert: false,
            confirm: false,
            console: false,
            Debug: false,
            opera: false,
            prompt: false
        },

        escapes = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '/': '\\/',
            '\\': '\\\\'
        },

        funct,          // The current function

        functionicity = [
            'closure', 'exception', 'global', 'label', 'outer', 'unused', 'var'
        ],

        functions,      // All of the functions
        global,         // The global scope
        html_tag = {
            a: {},
            abbr: {},
            acronym: {},
            address: {},
            applet: {},
            area: { empty: true, parent: ' map ' },
            article: {},
            aside: {},
            audio: {},
            b: {},
            base: { empty: true, parent: ' head ' },
            bdo: {},
            big: {},
            blockquote: {},
            body: { parent: ' html noframes ' },
            br: { empty: true },
            button: {},
            canvas: { parent: ' body p div th td ' },
            caption: { parent: ' table ' },
            center: {},
            cite: {},
            code: {},
            col: { empty: true, parent: ' table colgroup ' },
            colgroup: { parent: ' table ' },
            command: { parent: ' menu ' },
            datalist: {},
            dd: { parent: ' dl ' },
            del: {},
            details: {},
            dialog: {},
            dfn: {},
            dir: {},
            div: {},
            dl: {},
            dt: { parent: ' dl ' },
            em: {},
            embed: {},
            fieldset: {},
            figure: {},
            font: {},
            footer: {},
            form: {},
            frame: { empty: true, parent: ' frameset ' },
            frameset: { parent: ' html frameset ' },
            h1: {},
            h2: {},
            h3: {},
            h4: {},
            h5: {},
            h6: {},
            head: { parent: ' html ' },
            header: {},
            hgroup: {},
            hr: { empty: true },
            'hta:application':
                      { empty: true, parent: ' head ' },
            html: { parent: '*' },
            i: {},
            iframe: {},
            img: { empty: true },
            input: { empty: true },
            ins: {},
            kbd: {},
            keygen: {},
            label: {},
            legend: { parent: ' details fieldset figure ' },
            li: { parent: ' dir menu ol ul ' },
            link: { empty: true, parent: ' head ' },
            map: {},
            mark: {},
            menu: {},
            meta: { empty: true, parent: ' head noframes noscript ' },
            meter: {},
            nav: {},
            noframes: { parent: ' html body ' },
            noscript: { parent: ' body head noframes ' },
            object: {},
            ol: {},
            optgroup: { parent: ' select ' },
            option: { parent: ' optgroup select ' },
            output: {},
            p: {},
            param: { empty: true, parent: ' applet object ' },
            pre: {},
            progress: {},
            q: {},
            rp: {},
            rt: {},
            ruby: {},
            samp: {},
            script: { empty: true, parent: ' body div frame head iframe p pre span ' },
            section: {},
            select: {},
            small: {},
            span: {},
            source: {},
            strong: {},
            style: { parent: ' head ', empty: true },
            sub: {},
            sup: {},
            table: {},
            tbody: { parent: ' table ' },
            td: { parent: ' tr ' },
            textarea: {},
            tfoot: { parent: ' table ' },
            th: { parent: ' tr ' },
            thead: { parent: ' table ' },
            time: {},
            title: { parent: ' head ' },
            tr: { parent: ' table tbody thead tfoot ' },
            tt: {},
            u: {},
            ul: {},
            'var': {},
            video: {}
        },

        ids,            // HTML ids
        implied,        // Implied globals
        in_block,
        indent,
        json_mode,
        lines,
        lookahead,
        member,
        members_only,
        nexttoken,
        option,
        predefined,     // Global variables defined by option
        prereg,
        prevtoken,
        regexp_flag = {
            g: true,
            i: true,
            m: true
        },
        rhino = {
            defineClass: false,
            deserialize: false,
            gc: false,
            help: false,
            load: false,
            loadClass: false,
            print: false,
            quit: false,
            readFile: false,
            readUrl: false,
            runCommand: false,
            seal: false,
            serialize: false,
            spawn: false,
            sync: false,
            toint32: false,
            version: false
        },

        scope,      // The current scope
        semicolon_coda = {
            ';': true,
            '"': true,
            '\'': true,
            ')': true
        },
        src,
        stack,

// standard contains the global names that are provided by the
// ECMAScript standard.

        standard = {
            Array: false,
            Boolean: false,
            Date: false,
            decodeURI: false,
            decodeURIComponent: false,
            encodeURI: false,
            encodeURIComponent: false,
            Error: false,
            'eval': false,
            EvalError: false,
            Function: false,
            hasOwnProperty: false,
            isFinite: false,
            isNaN: false,
            JSON: false,
            Math: false,
            Number: false,
            Object: false,
            parseInt: false,
            parseFloat: false,
            RangeError: false,
            ReferenceError: false,
            RegExp: false,
            String: false,
            SyntaxError: false,
            TypeError: false,
            URIError: false
        },

        standard_member = {
            E: true,
            LN2: true,
            LN10: true,
            LOG2E: true,
            LOG10E: true,
            MAX_VALUE: true,
            MIN_VALUE: true,
            NEGATIVE_INFINITY: true,
            PI: true,
            POSITIVE_INFINITY: true,
            SQRT1_2: true,
            SQRT2: true
        },

        strict_mode,
        syntax = {},
        tab,
        token,
        urls,
        var_mode,
        warnings,

// widget contains the global names which are provided to a Yahoo
// (fna Konfabulator) widget.

        widget = {
            alert: true,
            animator: true,
            appleScript: true,
            beep: true,
            bytesToUIString: true,
            Canvas: true,
            chooseColor: true,
            chooseFile: true,
            chooseFolder: true,
            closeWidget: true,
            COM: true,
            convertPathToHFS: true,
            convertPathToPlatform: true,
            CustomAnimation: true,
            escape: true,
            FadeAnimation: true,
            filesystem: true,
            Flash: true,
            focusWidget: true,
            form: true,
            FormField: true,
            Frame: true,
            HotKey: true,
            Image: true,
            include: true,
            isApplicationRunning: true,
            iTunes: true,
            konfabulatorVersion: true,
            log: true,
            md5: true,
            MenuItem: true,
            MoveAnimation: true,
            openURL: true,
            play: true,
            Point: true,
            popupMenu: true,
            preferenceGroups: true,
            preferences: true,
            print: true,
            prompt: true,
            random: true,
            Rectangle: true,
            reloadWidget: true,
            ResizeAnimation: true,
            resolvePath: true,
            resumeUpdates: true,
            RotateAnimation: true,
            runCommand: true,
            runCommandInBg: true,
            saveAs: true,
            savePreferences: true,
            screen: true,
            ScrollBar: true,
            showWidgetPreferences: true,
            sleep: true,
            speak: true,
            Style: true,
            suppressUpdates: true,
            system: true,
            tellWidget: true,
            Text: true,
            TextArea: true,
            Timer: true,
            unescape: true,
            updateNow: true,
            URL: true,
            Web: true,
            widget: true,
            Window: true,
            XMLDOM: true,
            XMLHttpRequest: true,
            yahooCheckLogin: true,
            yahooLogin: true,
            yahooLogout: true
        },

        windows = {
            ActiveXObject: false,
            CScript: false,
            Debug: false,
            Enumerator: false,
            System: false,
            VBArray: false,
            WScript: false
        },

//  xmode is used to adapt to the exceptions in html parsing.
//  It can have these states:
//      false   .js script file
//      html
//      outer
//      script
//      style
//      scriptstring
//      styleproperty

        xmode,
        xquote,

// Regular expressions. Some of these are stupidly long.

// unsafe comment or string
        ax = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i,
// unsafe characters that are silently deleted by one or more browsers
        cx = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/,
// token
        tx = /^\s*([(){}\[.,:;'"~\?\]#@]|==?=?|\/(\*(jslint|members?|global)?|=|\/)?|\*[\/=]?|\+(?:=|\++)?|-(?:=|-+)?|%=?|&[&=]?|\|[|=]?|>>?>?=?|<([\/=!]|\!(\[|--)?|<=?)?|\^=?|\!=?=?|[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+([xX][0-9a-fA-F]+|\.[0-9]*)?([eE][+\-]?[0-9]+)?)/,
// html token
        hx = /^\s*(['"=>\/&#]|<(?:\/|\!(?:--)?)?|[a-zA-Z][a-zA-Z0-9_\-:]*|[0-9]+|--)/,
// characters in strings that need escapement
        nx = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/,
        nxg = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
// outer html token
        ox = /[>&]|<[\/!]?|--/,
// star slash
        lx = /\*\/|\/\*/,
// identifier
        ix = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/,
// javascript url
        jx = /^(?:javascript|jscript|ecmascript|vbscript|mocha|livescript)\s*:/i,
// url badness
        ux = /&|\+|\u00AD|\.\.|\/\*|%[^;]|base64|url|expression|data|mailto/i,
// style
        sx = /^\s*([{:#%.=,>+\[\]@()"';]|\*=?|\$=|\|=|\^=|~=|[a-zA-Z_][a-zA-Z0-9_\-]*|[0-9]+|<\/|\/\*)/,
        ssx = /^\s*([@#!"'};:\-%.=,+\[\]()*_]|[a-zA-Z][a-zA-Z0-9._\-]*|\/\*?|\d+(?:\.\d+)?|<\/)/,
// attributes characters
        qx = /[^a-zA-Z0-9+\-_\/ ]/,
// query characters for ids
        dx = /[\[\]\/\\"'*<>.&:(){}+=#]/,

        rx = {
            outer: hx,
            html: hx,
            style: sx,
            styleproperty: ssx
        };


    function return_this() {
        return this;
    }

    function F() { }     // Used by Object.create

    // Provide critical ES5 functions to ES3.

    if (typeof Array.isArray !== 'function') {
        Array.isArray = function (o) {
            return Object.prototype.toString.apply(o) === '[object Array]';
        };
    }

    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            F.prototype = o;
            return new F();
        };
    }

    if (typeof Object.keys !== 'function') {
        Object.keys = function (o) {
            var a = [], k;
            for (k in o) {
                if (Object.prototype.hasOwnProperty.call(o, k)) {
                    a.push(k);
                }
            }
            return a;
        };
    }

    // Substandard methods

    if (typeof String.prototype.entityify !== 'function') {
        String.prototype.entityify = function () {
            return this
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        };
    }

    if (typeof String.prototype.isAlpha !== 'function') {
        String.prototype.isAlpha = function () {
            return (this >= 'a' && this <= 'z\uffff') ||
                (this >= 'A' && this <= 'Z\uffff');
        };
    }

    if (typeof String.prototype.isDigit !== 'function') {
        String.prototype.isDigit = function () {
            return (this >= '0' && this <= '9');
        };
    }

    if (typeof String.prototype.supplant !== 'function') {
        String.prototype.supplant = function (o) {
            return this.replace(/\{([^{}]*)\}/g, function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            });
        };
    }

    if (typeof String.prototype.name !== 'function') {
        String.prototype.name = function () {

            // If the string looks like an identifier, then we can return it as is.
            // If the string contains no control characters, no quote characters, and no
            // backslash characters, then we can simply slap some quotes around it.
            // Otherwise we must also replace the offending characters with safe
            // sequences.

            if (ix.test(this)) {
                return this;
            }
            if (nx.test(this)) {
                return '"' + this.replace(nxg, function (a) {
                    var c = escapes[a];
                    if (c) {
                        return c;
                    }
                    return '\\u' + ('0000' + a.charCodeAt().toString(16)).slice(-4);
                }) + '"';
            }
            return '"' + this + '"';
        };
    }


    function combine(t, o) {
        var n;
        for (n in o) {
            if (Object.prototype.hasOwnProperty.call(o, n)) {
                t[n] = o[n];
            }
        }
    }

    function assume() {
        if (!option.safe) {
            if (option.rhino) {
                combine(predefined, rhino);
            }
            if (option.devel) {
                combine(predefined, devel);
            }
            if (option.browser) {
                combine(predefined, browser);
            }
            if (option.windows) {
                combine(predefined, windows);
            }
            if (option.widget) {
                combine(predefined, widget);
            }
        }
    }


    // Produce an error warning.

    function quit(message, line, character) {
        throw {
            name: 'JSLintError',
            line: line,
            character: character,
            message: bundle.scanned_a_b.supplant({
                a: message,
                b: Math.floor((line / lines.length) * 100)
            })
        };
    }

    function warn(message, offender, a, b, c, d) {
        var character, line, warning;
        offender = offender || nexttoken;  // `~
        line = offender.line || 0;
        character = offender.from || 0;
        warning = {
            id: '(error)',
            raw: message,
            evidence: lines[line - 1] || '',
            line: line,
            character: character,
            a: a || offender.value,
            b: b,
            c: c,
            d: d
        };
        warning.reason = message.supplant(warning);
        JSLINT.errors.push(warning);
        if (option.passfail) {
            quit(bundle.stopping, line, character);
        }
        warnings += 1;
        if (warnings >= option.maxerr) {
            quit(bundle.too_many, line, character);
        }
        return warning;
    }

    function warn_at(message, line, character, a, b, c, d) {
        return warn(message, {
            line: line,
            from: character
        }, a, b, c, d);
    }

    function fail(message, offender, a, b, c, d) {
        var warning = warn(message, offender, a, b, c, d);
        quit(bundle.stopping, warning.line, warning.character);
    }

    function fail_at(message, line, character, a, b, c, d) {
        return fail(message, {
            line: line,
            from: character
        }, a, b, c, d);
    }

    function expected_at(at) {
        if (option.white && nexttoken.from !== at) {
            warn(bundle.expected_a_at_b_c, nexttoken, nexttoken.value, at,
                nexttoken.from);
        }
    }

    function aint(it, name, expected) {

        if (it[name] !== expected) {
            warn(bundle.expected_a_b, it, expected, it[name]);
            return true;
        } else {
            return false;
        }
    }



    // lexical analysis and token construction

    var lex = (function lex() {
        var character, comments, from, line, source_row, older_token = {};

        // Private lex methods

        function collect_comment(comment) {
            if (older_token.line !== line) {
                if (comments) {
                    comments.push(comment);
                } else {
                    comments = [comment];
                }
            } else {
                if (older_token.postcomments) {
                    older_token.postcomments.push(comment);
                } else {
                    older_token.postcomments = [comment];
                }
            }
        }

        function next_line() {
            var at;
            if (line >= lines.length) {
                return false;
            }
            character = 1;
            source_row = lines[line];
            line += 1;
            at = source_row.search(/ \t/);
            if (at >= 0) {
                warn_at(bundle.mixed, line, at + 1);
            }
            source_row = source_row.replace(/\t/g, tab);
            at = source_row.search(cx);
            if (at >= 0) {
                warn_at(bundle.unsafe, line, at);
            }
            if (option.maxlen && option.maxlen < source_row.length) {
                warn_at(bundle.too_long, line, source_row.length);
            }
            return true;
        }

        // Produce a token object.  The token inherits from a syntax symbol.

        function it(type, value, quote) {
            var id, the_token;
            if (type === '(string)' || type === '(range)') {
                if (jx.test(value)) {
                    warn_at(bundle.url, line, from);
                }
            }
            the_token = Object.create(syntax[(
                type === '(punctuator)' ||
                    (type === '(identifier)' && Object.prototype.hasOwnProperty.call(syntax, value)) ?
                value :
                type
            )] || syntax['(error)']);
            if (type === '(identifier)') {
                the_token.identifier = true;
              //  if (value === '__iterator__' || value === '__proto__') {
                    if (value === '__iterator__' ) {
                    fail_at(bundle.reserved_a, line, from, value);
                } else if (option.nomen &&
                        (value.charAt(0) === '_' ||
                        value.charAt(value.length - 1) === '_')) {
                    warn_at(bundle.dangling_a, line, from, value);
                }
            }
            if (value !== undefined) {
                the_token.value = value;
            }
            if (quote) {
                the_token.quote = quote;
            }
            if (comments) {
                the_token.comments = comments;
                comments = null;
            }
            the_token.line = line;
            the_token.from = from;
            the_token.thru = character;
            the_token.prev = older_token;
            id = the_token.id;
            prereg = id && (
                ('(,=:[!&|?{};'.indexOf(id.charAt(id.length - 1)) >= 0) ||
                id === 'return'
            );
            older_token.next = the_token;
            older_token = the_token;
            return the_token;
        }

        // Public lex methods

        return {
            init: function (source) {
                if (typeof source === 'string') {
                    lines = source
                        .replace(/\r\n/g, '\n')
                        .replace(/\r/g, '\n')
                        .split('\n');
                } else {
                    lines = source;
                }
                line = 0;
                next_line();
                from = 1;
            },

            range: function (begin, end) {
                var c, value = '';
                from = character;
                if (source_row.charAt(0) !== begin) {
                    fail_at(bundle.expected_a_b, line, character, begin, source_row.charAt(0));
                }
                for (; ;) {
                    source_row = source_row.slice(1);
                    character += 1;
                    c = source_row.charAt(0);
                    switch (c) {
                        case '':
                            fail_at(bundle.missing_a, line, character, c);
                            break;
                        case end:
                            source_row = source_row.slice(1);
                            character += 1;
                            return it('(range)', value);
                        case xquote:
                        case '\\':
                            warn_at(bundle.unexpected_a, line, character, c);
                            break;
                    }
                    value += c;
                }
            },

            // token -- this is called by advance to get the next token.

            token: function () {
                var b, c, captures, digit, depth, flag, high, i, j, length, low, quote, t;

                function match(x) {
                    var exec = x.exec(source_row), first;
                    if (exec) {
                        length = exec[0].length;
                        first = exec[1];
                        c = first.charAt(0);
                        source_row = source_row.substr(length);
                        from = character + length - first.length;
                        character += length;
                        return first;
                    }
                }

                function string(x) {
                    var c, j, r = '';

                    if (json_mode && x !== '"') {
                        warn_at(bundle.expected_a, line, character, '"');
                    }

                    if (xquote === x || (xmode === 'scriptstring' && !xquote)) {
                        return it('(punctuator)', x);
                    }

                    function esc(n) {
                        var i = parseInt(source_row.substr(j + 1, n), 16);
                        j += n;
                        if (i >= 32 && i <= 126 &&
                                i !== 34 && i !== 92 && i !== 39) {
                            warn_at(bundle.unexpected_a, line, character, '\\');
                        }
                        character += n;
                        c = String.fromCharCode(i);
                    }
                    j = 0;
                    for (; ;) {
                        while (j >= source_row.length) {
                            j = 0;
                            if (xmode !== 'html' || !next_line()) {
                                fail_at(bundle.unclosed, line, from);
                            }
                        }
                        c = source_row.charAt(j);
                        if (c === x) {
                            character += 1;
                            source_row = source_row.substr(j + 1);
                            return it('(string)', r, x);
                        }
                        if (c < ' ') {
                            if (c === '\n' || c === '\r') {
                                break;
                            }
                            warn_at(bundle.control_a,
                                line, character + j, source_row.slice(0, j));
                        } else if (c === xquote) {
                            warn_at(bundle.bad_html, line, character + j);
                        } else if (c === '<') {
                            if (option.safe && xmode === 'html') {
                                warn_at(bundle.adsafe_a, line, character + j, c);
                            } else if (source_row.charAt(j + 1) === '/' && (xmode || option.safe)) {
                                warn_at(bundle.expected_a_b, line, character,
                                    '<\\/', '</');
                            } else if (source_row.charAt(j + 1) === '!' && (xmode || option.safe)) {
                                warn_at(bundle.unexpected_a, line, character, '<!');
                            }
                        } else if (c === '\\') {
                            if (xmode === 'html') {
                                if (option.safe) {
                                    warn_at(bundle.adsafe_a, line, character + j, c);
                                }
                            } else if (xmode === 'styleproperty') {
                                j += 1;
                                character += 1;
                                c = source_row.charAt(j);
                                if (c !== x) {
                                    warn_at(bundle.unexpected_a, line, character, '\\');
                                }
                            } else {
                                j += 1;
                                character += 1;
                                c = source_row.charAt(j);
                                switch (c) {
                                    case xquote:
                                        warn_at(bundle.bad_html, line, character + j);
                                        break;
                                    case '\\':
                                    case '"':
                                    case '/':
                                        break;
                                    case '\'':
                                        if (json_mode) {
                                            warn_at(bundle.unexpected_a, line, character, '\\\'');
                                        }
                                        break;
                                    case 'b':
                                        c = '\b';
                                        break;
                                    case 'f':
                                        c = '\f';
                                        break;
                                    case 'n':
                                        c = '\n';
                                        break;
                                    case 'r':
                                        c = '\r';
                                        break;
                                    case 't':
                                        c = '\t';
                                        break;
                                    case 'u':
                                        esc(4);
                                        break;
                                    case 'v':
                                        if (json_mode) {
                                            warn_at(bundle.unexpected_a, line, character, '\\v');
                                        }
                                        c = '\v';
                                        break;
                                    case 'x':
                                        if (json_mode) {
                                            warn_at(bundle.unexpected_a, line, character, '\\x');
                                        }
                                        esc(2);
                                        break;
                                    default:
                                        warn_at(bundle.unexpected_a, line, character, '\\');
                                }
                            }
                        }
                        r += c;
                        character += 1;
                        j += 1;
                    }
                }

                for (; ;) {
                    while (!source_row) {
                        if (!next_line()) {
                            return it('(end)');
                        }
                    }
                    while (xmode === 'outer') {
                        i = source_row.search(ox);
                        if (i === 0) {
                            break;
                        } else if (i > 0) {
                            character += 1;
                            source_row = source_row.slice(i);
                            break;
                        } else {
                            if (!next_line()) {
                                return it('(end)', '');
                            }
                        }
                    }
                    t = match(rx[xmode] || tx);
                    if (!t) {
                        t = '';
                        c = '';
                        while (source_row && source_row < '!') {
                            source_row = source_row.substr(1);
                        }
                        if (source_row) {
                            if (xmode === 'html') {
                                return it('(error)', source_row.charAt(0));
                            } else {
                                fail_at(bundle.unexpected_a,
                                    line, character, source_row.substr(0, 1));
                            }
                        }
                    } else {

                        //      identifier

                        if (c.isAlpha() || c === '_' || c === '$') {
                            return it('(identifier)', t);
                        }

                        //      number

                        if (c.isDigit()) {
                            if (xmode !== 'style' &&
                                    xmode !== 'styleproperty' &&
                                    source_row.substr(0, 1).isAlpha()) {
                                warn_at(bundle.expected_space_a_b,
                                    line, character, c, source_row.charAt(0));
                            }
                            if (c === '0') {
                                digit = t.substr(1, 1);
                                if (digit.isDigit()) {
                                    if (token.id !== '.' && xmode !== 'styleproperty') {
                                        warn_at(bundle.unexpected_a,
                                            line, character, t);
                                    }
                                } else if (json_mode && (digit === 'x' || digit === 'X')) {
                                    warn_at(bundle.unexpected_a, line, character, '0x');
                                }
                            }
                            if (t.substr(t.length - 1) === '.') {
                                warn_at(bundle.trailing_decimal_a, line,
                                    character, t);
                            }
                            if (xmode !== 'style') {
                                digit = +t;
                                if (!isFinite(digit)) {
                                    warn_at(bundle.bad_number, line, character, t);
                                }
                                t = digit;
                            }
                            return it('(number)', t);
                        }
                        switch (t) {

                            //      string

                            case '"':
                            case "'":
                                return string(t);

                                //      // comment

                            case '//':
                                if (comments_off || src || (xmode && xmode !== 'script')) {
                                    warn_at(bundle.unexpected_comment, line, character);
                                } else if (xmode === 'script' && /<\source_row*\//i.test(source_row)) {
                                    warn_at(bundle.unexpected_a, line, character, '<\/');
                                } else if ((option.safe || xmode === 'script') && ax.test(source_row)) {
                                    warn_at(bundle.dangerous_comment, line, character);
                                }
                                collect_comment(source_row);
                                source_row = '';
                                break;

                                //      /* comment

                            case '/*':
                                if (comments_off || src || (xmode && xmode !== 'script' && xmode !== 'style' && xmode !== 'styleproperty')) {
                                    warn_at(bundle.unexpected_comment, line, character);
                                }
                                if (option.safe && ax.test(source_row)) {
                                    warn_at(bundle.dangerous_comment, line, character);
                                }
                                for (; ;) {
                                    i = source_row.search(lx);
                                    if (i >= 0) {
                                        break;
                                    }
                                    collect_comment(source_row);
                                    if (!next_line()) {
                                        fail_at(bundle.unclosed_comment, line, character);
                                    } else {
                                        if (option.safe && ax.test(source_row)) {
                                            warn_at(bundle.dangerous_comment, line, character);
                                        }
                                    }
                                }
                                character += i + 2;
                                if (source_row.substr(i, 1) === '/') {
                                    fail_at(bundle.nested_comment, line, character);
                                }
                                collect_comment(source_row.substr(0, i));
                                source_row = source_row.substr(i + 2);
                                break;

                            case '':
                                break;
                                //      /
                            case '/':
                                if (token.id === '/=') {
                                    fail_at(
                                        bundle.slash_equal,
                                        line,
                                        from
                                    );
                                }
                                if (prereg) {
                                    depth = 0;
                                    captures = 0;
                                    length = 0;
                                    for (; ;) {
                                        b = true;
                                        c = source_row.charAt(length);
                                        length += 1;
                                        switch (c) {
                                            case '':
                                                fail_at(bundle.unclosed_regexp, line, from);
                                                return;
                                            case '/':
                                                if (depth > 0) {
                                                    warn_at(bundle.unescaped_a,
                                                        line, from + length, '/');
                                                }
                                                c = source_row.substr(0, length - 1);
                                                flag = Object.create(regexp_flag);
                                                while (flag[source_row.charAt(length)] === true) {
                                                    flag[source_row.charAt(length)] = false;
                                                    length += 1;
                                                }
                                                if (source_row.charAt(length).isAlpha()) {
                                                    fail_at(bundle.unexpected_a,
                                                        line, from, source_row.charAt(length));
                                                }
                                                character += length;
                                                source_row = source_row.substr(length);
                                                quote = source_row.charAt(0);
                                                if (quote === '/' || quote === '*') {
                                                    fail_at(bundle.confusing_regexp,
                                                        line, from);
                                                }
                                                return it('(regexp)', c);
                                            case '\\':
                                                c = source_row.charAt(length);
                                                if (c < ' ') {
                                                    warn_at(bundle.control_a,
                                                        line, from + length, String(c));
                                                } else if (c === '<') {
                                                    warn_at(
                                                        bundle.unexpected_a,
                                                        line,
                                                        from + length,
                                                        '\\'
                                                    );
                                                }
                                                length += 1;
                                                break;
                                            case '(':
                                                depth += 1;
                                                b = false;
                                                if (source_row.charAt(length) === '?') {
                                                    length += 1;
                                                    switch (source_row.charAt(length)) {
                                                        case ':':
                                                        case '=':
                                                        case '!':
                                                            length += 1;
                                                            break;
                                                        default:
                                                            warn_at(
                                                                bundle.expected_a_b,
                                                                line,
                                                                from + length,
                                                                ':',
                                                                source_row.charAt(length)
                                                            );
                                                    }
                                                } else {
                                                    captures += 1;
                                                }
                                                break;
                                            case '|':
                                                b = false;
                                                break;
                                            case ')':
                                                if (depth === 0) {
                                                    warn_at(bundle.unescaped_a,
                                                        line, from + length, ')');
                                                } else {
                                                    depth -= 1;
                                                }
                                                break;
                                            case ' ':
                                                j = 1;
                                                while (source_row.charAt(length) === ' ') {
                                                    length += 1;
                                                    j += 1;
                                                }
                                                if (j > 1) {
                                                    warn_at(bundle.use_braces,
                                                        line, from + length, j);
                                                }
                                                break;
                                            case '[':
                                                c = source_row.charAt(length);
                                                if (c === '^') {
                                                    length += 1;
                                                    if (option.regexp) {
                                                        warn_at(bundle.insecure_a,
                                                            line, from + length, c);
                                                    } else if (source_row.charAt(length) === ']') {
                                                        fail_at(bundle.unescaped_a,
                                                            line, from + length, '^');
                                                    }
                                                }
                                                quote = false;
                                                if (c === ']') {
                                                    warn_at(bundle.empty_class, line,
                                                        from + length - 1);
                                                    quote = true;
                                                }
                                                klass: do {
                                                    c = source_row.charAt(length);
                                                    length += 1;
                                                    switch (c) {
                                                        case '[':
                                                        case '^':
                                                            warn_at(bundle.unescaped_a,
                                                                line, from + length, c);
                                                            quote = true;
                                                            break;
                                                        case '-':
                                                            if (quote) {
                                                                quote = false;
                                                            } else {
                                                                warn_at(bundle.unescaped_a,
                                                                    line, from + length, '-');
                                                                quote = true;
                                                            }
                                                            break;
                                                        case ']':
                                                            if (!quote) {
                                                                warn_at(bundle.unescaped_a,
                                                                    line, from + length - 1, '-');
                                                            }
                                                            break klass;
                                                        case '\\':
                                                            c = source_row.charAt(length);
                                                            if (c < ' ') {
                                                                warn_at(
                                                                    bundle.control_a,
                                                                    line,
                                                                    from + length,
                                                                    String(c)
                                                                );
                                                            } else if (c === '<') {
                                                                warn_at(
                                                                    bundle.unexpected_a,
                                                                    line,
                                                                    from + length,
                                                                    '\\'
                                                                );
                                                            }
                                                            length += 1;
                                                            quote = true;
                                                            break;
                                                        case '/':
                                                            warn_at(bundle.unescaped_a,
                                                                line, from + length - 1, '/');
                                                            quote = true;
                                                            break;
                                                        case '<':
                                                            if (xmode === 'script') {
                                                                c = source_row.charAt(length);
                                                                if (c === '!' || c === '/') {
                                                                    warn_at(
                                                                        bundle.html_confusion_a,
                                                                        line,
                                                                        from + length,
                                                                        c
                                                                    );
                                                                }
                                                            }
                                                            quote = true;
                                                            break;
                                                        default:
                                                            quote = true;
                                                    }
                                                } while (c);
                                                break;
                                            case '.':
                                                if (option.regexp) {
                                                    warn_at(bundle.insecure_a, line,
                                                        from + length, c);
                                                }
                                                break;
                                            case ']':
                                            case '?':
                                            case '{':
                                            case '}':
                                            case '+':
                                            case '*':
                                                warn_at(bundle.unescaped_a, line,
                                                    from + length, c);
                                                break;
                                            case '<':
                                                if (xmode === 'script') {
                                                    c = source_row.charAt(length);
                                                    if (c === '!' || c === '/') {
                                                        warn_at(
                                                            bundle.html_confusion_a,
                                                            line,
                                                            from + length,
                                                            c
                                                        );
                                                    }
                                                }
                                                break;
                                        }
                                        if (b) {
                                            switch (source_row.charAt(length)) {
                                                case '?':
                                                case '+':
                                                case '*':
                                                    length += 1;
                                                    if (source_row.charAt(length) === '?') {
                                                        length += 1;
                                                    }
                                                    break;
                                                case '{':
                                                    length += 1;
                                                    c = source_row.charAt(length);
                                                    if (c < '0' || c > '9') {
                                                        warn_at(
                                                            bundle.expected_number_a,
                                                            line,
                                                            from + length,
                                                            c
                                                        );
                                                    }
                                                    length += 1;
                                                    low = +c;
                                                    for (; ;) {
                                                        c = source_row.charAt(length);
                                                        if (c < '0' || c > '9') {
                                                            break;
                                                        }
                                                        length += 1;
                                                        low = +c + (low * 10);
                                                    }
                                                    high = low;
                                                    if (c === ',') {
                                                        length += 1;
                                                        high = Infinity;
                                                        c = source_row.charAt(length);
                                                        if (c >= '0' && c <= '9') {
                                                            length += 1;
                                                            high = +c;
                                                            for (; ;) {
                                                                c = source_row.charAt(length);
                                                                if (c < '0' || c > '9') {
                                                                    break;
                                                                }
                                                                length += 1;
                                                                high = +c + (high * 10);
                                                            }
                                                        }
                                                    }
                                                    if (source_row.charAt(length) !== '}') {
                                                        warn_at(
                                                            bundle.expected_a_b,
                                                            line,
                                                            from + length,
                                                            '}',
                                                            c
                                                        );
                                                    } else {
                                                        length += 1;
                                                    }
                                                    if (source_row.charAt(length) === '?') {
                                                        length += 1;
                                                    }
                                                    if (low > high) {
                                                        warn_at(
                                                            bundle.not_greater,
                                                            line,
                                                            from + length,
                                                            low,
                                                            high
                                                        );
                                                    }
                                                    break;
                                            }
                                        }
                                    }
                                    c = source_row.substr(0, length - 1);
                                    character += length;
                                    source_row = source_row.substr(length);
                                    return it('(regexp)', c);
                                }
                                return it('(punctuator)', t);

                                //      punctuator

                            case '<!--':
                                length = line;
                                c = character;
                                for (; ;) {
                                    i = source_row.indexOf('--');
                                    if (i >= 0) {
                                        break;
                                    }
                                    i = source_row.indexOf('<!');
                                    if (i >= 0) {
                                        fail_at(bundle.nested_comment,
                                            line, character + i);
                                    }
                                    if (!next_line()) {
                                        fail_at(bundle.unclosed_comment, length, c);
                                    }
                                }
                                length = source_row.indexOf('<!');
                                if (length >= 0 && length < i) {
                                    fail_at(bundle.nested_comment,
                                        line, character + length);
                                }
                                character += i;
                                if (source_row.charAt(i + 2) !== '>') {
                                    fail_at(bundle.expected_a, line, character, '-->');
                                }
                                character += 3;
                                source_row = source_row.slice(i + 3);
                                break;
                            case '#':
                                if (xmode === 'html' || xmode === 'styleproperty') {
                                    for (; ;) {
                                        c = source_row.charAt(0);
                                        if ((c < '0' || c > '9') &&
                                                (c < 'a' || c > 'f') &&
                                                (c < 'A' || c > 'F')) {
                                            break;
                                        }
                                        character += 1;
                                        source_row = source_row.substr(1);
                                        t += c;
                                    }
                                    if (t.length !== 4 && t.length !== 7) {
                                        warn_at(bundle.bad_color_a, line,
                                            from + length, t);
                                    }
                                    return it('(color)', t);
                                }
                                return it('(punctuator)', t);

                            default:
                                if (xmode === 'outer' && c === '&') {
                                    character += 1;
                                    source_row = source_row.substr(1);
                                    for (; ;) {
                                        c = source_row.charAt(0);
                                        character += 1;
                                        source_row = source_row.substr(1);
                                        if (c === ';') {
                                            break;
                                        }
                                        if (!((c >= '0' && c <= '9') ||
                                                (c >= 'a' && c <= 'z') ||
                                                c === '#')) {
                                            fail_at(bundle.bad_entity, line, from + length,
                                                character);
                                        }
                                    }
                                    break;
                                }
                                return it('(punctuator)', t);
                        }
                    }
                }
            }
        };
    }());


    function add_label(t, type) {

        if (option.safe && funct['(global)'] &&
                typeof predefined[t] !== 'boolean') {
            warn(bundle.adsafe_a, token, t);
        } else if (t === 'hasOwnProperty') {
            warn(bundle.bad_name_a, token, t);
        }

        // Define t in the current function in the current scope.

        if (Object.prototype.hasOwnProperty.call(funct, t) && !funct['(global)']) {
            warn(funct[t] === true ?
                bundle.used_before_a :
                bundle.already_defined,
                nexttoken, t);
        }
        funct[t] = type;
        if (funct['(global)']) {
            global[t] = funct;
            if (Object.prototype.hasOwnProperty.call(implied, t)) {
                warn(bundle.used_before_a, nexttoken, t);
                delete implied[t];
            }
        } else {
            scope[t] = funct;
        }
    }


    function peek(distance) {

        // Peek ahead to a future token. The distance is how far ahead to look. The
        // default is the next token.

        var found, slot = 0;

        distance = distance || 0;
        while (slot <= distance) {
            found = lookahead[slot];
            if (!found) {
                found = lookahead[slot] = lex.token();
            }
            slot += 1;
        }
        return found;
    }


    function discard(it) {

        // The token will not be included in the parse tree, so move the comments
        // that are attached to the token to tokens that are in the tree.

        var next, prev;
        it = it || token;
        if (it.postcomments) {
            next = it.next || peek();
            next.comments = next.comments ?
                next.comments.concat(it.postcomments) :
                it.postcomments;
        }
        if (it.comments) {
            prev = it.prev;
            while (prev.postcomments === null) {
                prev = prev.prev;
            }
            if (prev.postcomments) {
                prev.postcomments = prev.postcomments.concat(it.comments);
            } else {
                prev.postcomments = it.comments;
            }
        }
        it.comments = null;
        it.postcomments = null;
    }


    function advance(id, match) {

        // Produce the next token, also looking for programming errors.

        if (indent) {

            // In indentation checking was requested, then inspect all of the line breakings.
            // The var statement is tricky because the names might be aligned or not. We
            // look at the first line break after the var to determine the programmer's
            // intention.

            if (var_mode && nexttoken.line !== token.line) {
                if ((var_mode !== indent || !nexttoken.edge) &&
                        nexttoken.from === indent.at -
                        (nexttoken.edge ? option.indent : 0)) {
                    var dent = indent;
                    for (; ;) {
                        dent.at -= option.indent;
                        if (dent === var_mode) {
                            break;
                        }
                        dent = dent.was;
                    }
                    dent.open = false;
                }
                var_mode = false;
            }
            if (indent.open) {

                // If the token is an edge.

                if (nexttoken.edge) {
                    if (nexttoken.edge === 'label') {
                        expected_at(1);
                    } else if (nexttoken.edge === 'case') {
                        expected_at(indent.at - option.indent);
                    } else if (indent.mode !== 'array' || nexttoken.line !== token.line) {
                        expected_at(indent.at);
                    }

                    // If the token is not an edge, but is the first token on the line.

                } else if (nexttoken.line !== token.line &&
                        nexttoken.from < indent.at + (indent.mode ===
                        'expression' ? 0 : option.indent)) {
                    expected_at(indent.at + option.indent);
                }
            } else if (nexttoken.line !== token.line) {
                if (nexttoken.edge) {
                    expected_at(indent.at);
                } else {
                    indent.wrap = true;
                    if (indent.mode === 'statement' || indent.mode === 'var') {
                        expected_at(indent.at + option.indent);
                    } else if (nexttoken.from < indent.at + (indent.mode ===
                            'expression' ? 0 : option.indent)) {
                        expected_at(indent.at + option.indent);
                    }
                }
            }
        }

        switch (token.id) {
            case '(number)':
                if (nexttoken.id === '.') {
                    warn(bundle.trailing_decimal_a);
                }
                break;
            case '-':
                if (nexttoken.id === '-' || nexttoken.id === '--') {
                    warn(bundle.confusing_a);
                }
                break;
            case '+':
                if (nexttoken.id === '+' || nexttoken.id === '++') {
                    warn(bundle.confusing_a);
                }
                break;
        }
        if (token.arity === 'string' || token.identifier) {
            anonname = token.value;
        }

        if (id && nexttoken.id !== id) {
            if (match) {
                warn(bundle.expected_a_b_from_c_d, nexttoken, id,
                    match.id, match.line, nexttoken.value);
            } else if (!nexttoken.identifier || nexttoken.value !== id) {
                warn(bundle.expected_a_b, nexttoken, id, nexttoken.value);
            }
        }
        prevtoken = token;
        token = nexttoken;
        nexttoken = lookahead.shift() || lex.token();
        if (token.id === '(end)') {
            discard();
        }
    }


    function do_option() {
        var command = this.id,
            filter,
            name,
            object,
            old_comments_off = comments_off,
            old_option_white = option.white,
            value;
        comments_off = true;
        option.white = false;
        if (lookahead.length > 0 || this.postcomments || nexttoken.comments) {
            warn(bundle.unexpected_a, this);
        }
        switch (command) {
            case '/*members':
            case '/*member':
                command = '/*members';
                if (!members_only) {
                    members_only = {};
                }
                object = members_only;
                break;
            case '/*jslint':
                if (option.safe) {
                    warn(bundle.adsafe_a, this);
                }
                filter = bool_options;
                object = option;
                break;
            case '/*global':
                if (option.safe) {
                    warn(bundle.adsafe_a, this);
                }
                object = predefined;
                break;
            default:
                fail("What?");
        }
        loop: for (; ;) {
            for (; ;) {
                if (nexttoken.id === '*/') {
                    break loop;
                }
                if (nexttoken.id !== ',') {
                    break;
                }
                advance();
            }
            if (nexttoken.arity !== 'string' && !nexttoken.identifier) {
                fail(bundle.unexpected_a, nexttoken);
            }
            name = nexttoken;
            advance();
            if (nexttoken.id === ':') {
                advance(':');
                if (object === members_only) {
                    fail(bundle.expected_a_b, name, '*/', ':');
                }
                if (name.value === 'indent' && command === '/*jslint') {
                    value = +nexttoken.value;
                    if (typeof value !== 'number' || !isFinite(value) || value < 0 ||
                            Math.floor(value) !== value) {
                        fail(bundle.expected_small_a);
                    }
                    if (value > 0) {
                        old_option_white = true;
                    }
                    object.indent = value;
                } else if (name.value === 'maxerr' && command === '/*jslint') {
                    value = +nexttoken.value;
                    if (typeof value !== 'number' || !isFinite(value) || value <= 0 ||
                            Math.floor(value) !== value) {
                        fail(bundle.expected_small_a, nexttoken);
                    }
                    object.maxerr = value;
                } else if (name.value === 'maxlen' && command === '/*jslint') {
                    value = +nexttoken.value;
                    if (typeof value !== 'number' || !isFinite(value) || value < 0 ||
                            Math.floor(value) !== value) {
                        fail(bundle.expected_small_a);
                    }
                    object.maxlen = value;
                } else if (nexttoken.id === 'true') {
                    if (name.value === 'white' && command === '/*jslint') {
                        old_option_white = object.white = true;
                    } else {
                        object[name.value] = true;
                    }
                } else if (nexttoken.id === 'false') {
                    if (name.value === 'white' && command === '/*jslint') {
                        old_option_white = object.white = false;
                    } else {
                        object[name.value] = false;
                    }
                } else {
                    fail(bundle.unexpected_a);
                }
                advance();
            } else {
                if (command === '/*jslint') {
                    fail(bundle.missing_option, nexttoken);
                }
                object[name.value] = false;
            }
        }
        if (filter) {
            assume();
        }
        comments_off = old_comments_off;
        advance('*/');
        option.white = old_option_white;
    }


    // Indentation intention

    function edge(mode) {
        nexttoken.edge = !indent || (indent.open && (mode || true));
    }


    function step_in(mode) {
        var open, was;
        if (typeof mode === 'number') {
            indent = {
                at: mode,
                open: true,
                was: was
            };
        } else if (!indent) {
            indent = {
                at: 1,
                mode: 'statement',
                open: true
            };
        } else {
            was = indent;
            open = mode === 'var' ||
                (nexttoken.line !== token.line && mode !== 'statement');
            indent = {
                at: (open || mode === 'control' ?
                    was.at + option.indent : was.at) +
                    (was.wrap ? option.indent : 0),
                mode: mode,
                open: open,
                was: was
            };
            if (mode === 'var' && open) {
                var_mode = indent;
            }
        }
    }

    function step_out(id, t) {
        if (id) {
            if (indent && indent.open) {
                indent.at -= option.indent;
                edge();
            }
            advance(id, t);
        }
        if (indent) {
            indent = indent.was;
        }
    }

    // Functions for conformance of whitespace.

    function one_space(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (right.id !== '(end)' && option.white &&
                (token.line !== right.line ||
                token.thru + 1 !== right.from)) {
            warn(bundle.expected_space_a_b, right, token.value, right.value);
        }
    }

    function one_space_only(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (right.id !== '(end)' && (left.line !== right.line ||
                (option.white && left.thru + 1 !== right.from))) {
            warn(bundle.expected_space_a_b, right, left.value, right.value);
        }
    }

    function no_space(left, right) {
        left = left || token;
        right = right || nexttoken;
        if ((option.white || xmode === 'styleproperty' || xmode === 'style') &&
                left.thru !== right.from && left.line === right.line) {
            warn(bundle.unexpected_space_a_b, right, left.value, right.value);
        }
    }

    function no_space_only(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (right.id !== '(end)' && (left.line !== right.line ||
                (option.white && left.thru !== right.from))) {
            warn(bundle.unexpected_space_a_b, right, left.value, right.value);
        }
    }

    function spaces(left, right) {
        if (option.white) {
            left = left || token;
            right = right || nexttoken;
            if (left.thru === right.from && left.line === right.line) {
                warn(bundle.missing_space_a_b, right, left.value, right.value);
            }
        }
    }

    function comma() {
        if (nexttoken.id !== ',') {
            warn_at(bundle.expected_a_b, token.line, token.thru, ',', nexttoken.value);
        } else {
            if (option.white) {
                no_space_only();
            }
            advance(',');
            discard();
            spaces();
        }
    }


    function semicolon() {
        if (nexttoken.id !== ';') {
            warn_at(bundle.expected_a_b, token.line, token.thru, ';', nexttoken.value);
        } else {
            if (option.white) {
                no_space_only();
            }
            advance(';');
            discard();
            if (semicolon_coda[nexttoken.id] !== true) {
                spaces();
            }
        }
    }

    function use_strict() {
        if (nexttoken.value === 'use strict') {
            if (strict_mode) {
                warn(bundle.unnecessary_use);
            }
            edge();
            advance();
            semicolon();
            strict_mode = true;
            option.newcap = true;
            option.undef = true;
            return true;
        } else {
            return false;
        }
    }


    function are_similar(a, b) {
        if (a === b) {
            return true;
        }
        if (Array.isArray(a)) {
            if (Array.isArray(b) && a.length === b.length) {
                var i;
                for (i = 0; i < a.length; i += 1) {
                    if (!are_similar(a[i], b[i])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        if (Array.isArray(b)) {
            return false;
        }
        if (a.arity === b.arity && a.value === b.value) {
            switch (a.arity) {
                case 'prefix':
                case 'suffix':
                case undefined:
                    return are_similar(a.first, b.first);
                case 'infix':
                    return are_similar(a.first, b.first) &&
                        are_similar(a.second, b.second);
                case 'ternary':
                    return are_similar(a.first, b.first) &&
                        are_similar(a.second, b.second) &&
                        are_similar(a.third, b.third);
                case 'function':
                case 'regexp':
                    return false;
                default:
                    return true;
            }
        } else {
            if (a.id === '.' && b.id === '[' && b.arity === 'infix') {
                return a.second.value === b.second.value && b.second.arity === 'string';
            } else if (a.id === '[' && a.arity === 'infix' && b.id === '.') {
                return a.second.value === b.second.value && a.second.arity === 'string';
            }
        }
        return false;
    }


    // This is the heart of JSLINT, the Pratt parser. In addition to parsing, it
    // is looking for ad hoc lint patterns. We add .fud to Pratt's model, which is
    // like .nud except that it is only used on the first token of a statement.
    // Having .fud makes it much easier to define statement-oriented languages like
    // JavaScript. I retained Pratt's nomenclature.

    // .nud     Null denotation
    // .fud     First null denotation
    // .led     Left denotation
    //  lbp     Left binding power
    //  rbp     Right binding power

    // They are elements of the parsing method called Top Down Operator Precedence.

    function expression(rbp, initial) {

        // rbp is the right binding power.
        // initial indicates that this is the first expression of a statement.

        var left;
        if (nexttoken.id === '(end)') {
            fail(bundle.unexpected_a, token, nexttoken.id);
        }
        advance();
        if (option.safe && typeof predefined[token.value] === 'boolean' &&
                (nexttoken.id !== '(' && nexttoken.id !== '.')) {
            warn(bundle.adsafe, token);
        }
        if (initial) {
            anonname = 'anonymous';
            funct['(verb)'] = token.value;
        }
        if (initial === true && token.fud) {
            left = token.fud();
        } else {
            if (token.nud) {
                left = token.nud();
            } else {
                if (nexttoken.arity === 'number' && token.id === '.') {
                    warn(bundle.leading_decimal_a, token,
                        nexttoken.value);
                    advance();
                    return token;
                } else {
                    fail(bundle.expected_identifier_a, token, token.id);
                }
            }
            while (rbp < nexttoken.lbp) {
                advance();
                if (token.led) {
                    left = token.led(left);
                } else {
                    fail(bundle.expected_operator_a, token, token.id);
                }
            }
        }
        return left;
    }


    // Functional constructors for making the symbols that will be inherited by
    // tokens.

    function symbol(s, p) {
        var x = syntax[s];
        if (!x || typeof x !== 'object') {
            syntax[s] = x = {
                id: s,
                lbp: p,
                value: s
            };
        }
        return x;
    }


    function delim(s) {
        return symbol(s, 0);
    }


    function postscript(x) {
        x.postscript = true;
        return x;
    }

    function ultimate(s) {
        var x = symbol(s, 0);
        x.from = 1;
        x.thru = 1;
        x.line = 0;
        x.edge = true;
        try { s.value = s; } catch (e) { };
        return postscript(x);
    }


    function stmt(s, f) {
        var x = delim(s);
        x.identifier = x.reserved = true;
        x.fud = f;
        return x;
    }

    function labeled_stmt(s, f) {
        var x = stmt(s, f);
        x.labeled = true;
    }

    function disrupt_stmt(s, f) {
        var x = stmt(s, f);
        x.disrupt = true;
    }


    function reserve_name(x) {
        var c = x.id.charAt(0);
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
            x.identifier = x.reserved = true;
        }
        return x;
    }


    function prefix(s, f) {
        var x = symbol(s, 150);
        reserve_name(x);
        x.nud = (typeof f === 'function') ? f : function () {
            if (s === 'typeof') {
                one_space();
            } else {
                no_space_only();
            }
            this.first = expression(150);
            this.arity = 'prefix';
            if (this.id === '++' || this.id === '--') {
                if (option.plusplus) {
                    warn(bundle.unexpected_a, this);
                } else if ((!this.first.identifier || this.first.reserved) &&
                        this.first.id !== '.' && this.first.id !== '[') {
                    warn(bundle.bad_operand, this);
                }
            }
            return this;
        };
        return x;
    }


    function type(s, arity, nud) {
        var x = delim(s);
        x.arity = arity;
        if (nud) {
            x.nud = nud;
        }
        return x;
    }


    function reserve(s, f) {
        var x = delim(s);
        x.identifier = x.reserved = true;
        if (typeof f === 'function') {
            x.nud = f;
        }
        return x;
    }


    function reservevar(s, v) {
        return reserve(s, function () {
            if (typeof v === 'function') {
                v(this);
            }
            return this;
        });
    }


    function infix(s, p, f, w) {
        var x = symbol(s, p);
        reserve_name(x);
        x.led = function (left) {
            this.arity = 'infix';
            if (!w) {
                spaces(prevtoken, token);
                spaces();
            }
            if (typeof f === 'function') {
                return f(left, this);
            } else {
                this.first = left;
                this.second = expression(p);
                return this;
            }
        };
        return x;
    }

    function expected_relation(node, message) {
        if (node.assign) {
            warn(message || bundle.conditional_assignment, node);
        }
        return node;
    }

    function expected_condition(node, message) {
        switch (node.id) {
            case '[':
            case '-':
                if (node.arity !== 'infix') {
                    warn(message || bundle.weird_condition, node);
                }
                break;
            case 'false':
            case 'function':
            case 'Infinity':
            case 'NaN':
            case 'null':
            case 'true':
            case 'undefined':
            case 'void':
            case '(number)':
            case '(regexp)':
            case '(string)':
            case '{':
                warn(message || bundle.weird_condition, node);
                break;
        }
        return node;
    }

    function check_relation(node) {
        switch (node.arity) {
            case 'prefix':
                switch (node.id) {
                    case '{':
                    case '[':
                        warn(bundle.unexpected_a, node);
                        break;
                    case '!':
                        warn(bundle.confusing_a, node);
                        break;
                }
                break;
            case 'function':
            case 'regexp':
                warn(bundle.unexpected_a, node);
                break;
            default:
                if (node.id === 'NaN') {
                    warn(bundle.isNaN, node);
                }
        }
        return node;
    }


    function relation(s, eqeq) {
        var x = infix(s, 100, function (left, that) {
            check_relation(left);
            if (eqeq) {
                warn(bundle.expected_a_b, that, eqeq, that.id);
            }
            var right = expression(100);
            if (are_similar(left, right) ||
                    ((left.arity === 'string' || left.arity === 'number') &&
                    (right.arity === 'string' || right.arity === 'number'))) {
                warn(bundle.weird_relation, that);
            }
            that.first = left;
            that.second = check_relation(right);
            return that;
        });
        return x;
    }


    function assignop(s, bit) {
        var x = infix(s, 20, function (left, that) {
            var l;
            if (option.bitwise && bit) {
                warn(bundle.unexpected_a, that);
            }
            that.first = left;
            if (predefined[left.value] === false &&
                    scope[left.value]['(global)'] === true) {
                warn(bundle.read_only, left);
            } else if (left['function']) {
                warn(bundle.a_function, left);
            }
            if (option.safe) {
                l = left;
                do {
                    if (typeof predefined[l.value] === 'boolean') {
                        warn(bundle.adsafe, l);
                    }
                    l = l.first;
                } while (l);
            }
            if (left) {
                if (left === syntax['function']) {
                    warn(bundle.identifier_function, token);
                }
                if (left.id === '.' || left.id === '[') {
                    if (!left.first || left.first.value === 'arguments') {
                        warn(bundle.bad_assignment, that);
                    }
                    that.second = expression(19);
                    if (that.id === '=' && are_similar(that.first, that.second)) {
                        warn(bundle.weird_assignment, that);
                    }
                    return that;
                } else if (left.identifier && !left.reserved) {
                    if (funct[left.value] === 'exception') {
                        warn(bundle.assign_exception, left);
                    }
                    that.second = expression(19);
                    if (that.id === '=' && are_similar(that.first, that.second)) {
                        warn(bundle.weird_assignment, that);
                    }
                    return that;
                }
            }
            fail(bundle.bad_assignment, that);
        });
        x.assign = true;
        return x;
    }


    function bitwise(s, p) {
        return infix(s, p, function (left, that) {
            if (option.bitwise) {
                warn(bundle.unexpected_a, that);
            }
            that.first = left;
            that.second = expression(p);
            return that;
        });
    }


    function suffix(s, f) {
        var x = symbol(s, 150);
        x.led = function (left) {
            no_space_only(prevtoken, token);
            if (option.plusplus) {
                warn(bundle.unexpected_a, this);
            } else if ((!left.identifier || left.reserved) &&
                    left.id !== '.' && left.id !== '[') {
                warn(bundle.bad_operand, this);
            }
            this.first = left;
            this.arity = 'suffix';
            return this;
        };
        return x;
    }


    function optional_identifier() {
        if (nexttoken.identifier) {
            advance();
            if (option.safe && banned[token.value]) {
                warn(bundle.adsafe_a, token);
            } else if (token.reserved && !option.es5) {
                warn(bundle.expected_identifier_a_reserved, token);
            }
            return token.value;
        }
    }


    function identifier() {
        var i = optional_identifier();
        if (i) {
            return i;
        }
        if (token.id === 'function' && nexttoken.id === '(') {
            warn(bundle.name_function);
        } else {
            fail(bundle.expected_identifier_a);
        }
    }


    function statement(no_indent) {

        // Usually a statement starts a line. Exceptions include the var statement in the
        // initialization part of a for statement, and an if after an else.

        var label, old_scope = scope, the_statement;

        // We don't like the empty statement.

        if (nexttoken.id === ';') {
            warn(bundle.unexpected_a);
            semicolon();
            return;
        }

        // Is this a labeled statement?

        if (nexttoken.identifier && !nexttoken.reserved && peek().id === ':') {
            edge('label');
            label = nexttoken;
            advance();
            discard();
            advance(':');
            discard();
            scope = Object.create(old_scope);
            add_label(label.value, 'label');
            if (nexttoken.labeled !== true) {
                warn(bundle.label_a_b, nexttoken, label.value, nexttoken.value);
            }
            if (jx.test(label.value + ':')) {
                warn(bundle.url, label);
            }
            nexttoken.label = label;
        }

        // Parse the statement.

        edge();
        step_in('statement');
        the_statement = expression(0, true);
        if (the_statement) {

            // Look for the final semicolon.

            if (the_statement.arity === 'statement') {
                if (the_statement.id === 'switch' ||
                        (the_statement.block && the_statement.id !== 'do')) {
                    spaces();
                } else {
                    semicolon();
                }
            } else {

                // If this is an expression statement, determine if it is acceptble.
                // We do not like
                //      new Blah();
                // statments. If it is to be used at all, new should only be used to make
                // objects, not side effects. The expression statements we do like do
                // assignment or invocation or delete.

                if (the_statement.id === '(') {
                    if (the_statement.first.id === 'new') {
                        warn(bundle.bad_new);
                    }
                } else if (!the_statement.assign &&
                        the_statement.id !== 'delete' &&
                        the_statement.id !== '++' &&
                        the_statement.id !== '--') {
                    warn(bundle.assignment_function_expression, token);
                }
                semicolon();
            }
        }
        step_out();
        scope = old_scope;
        return the_statement;
    }


    function statements() {
        var array = [], disruptor, the_statement;

        // A disrupt statement may not be followed by any other statement.
        // If the last statement is disrupt, then the sequence is disrupt.

        while (nexttoken.postscript !== true) {
            if (nexttoken.id === ';') {
                warn(bundle.unexpected_a, nexttoken);
                semicolon();
            } else {
                if (disruptor) {
                    warn(bundle.unreachable_a_b, nexttoken, nexttoken.value,
                        disruptor.value);
                    disruptor = null;
                }
                the_statement = statement();
                if (the_statement) {
                    array.push(the_statement);
                    if (the_statement.disrupt) {
                        disruptor = the_statement;
                        array.disrupt = true;
                    }
                }
            }
        }
        return array;
    }


    function block(ordinary) {

        // array block is array sequence of statements wrapped in braces.
        // ordinary is false for function bodies and try blocks.
        // ordinary is true for if statements, while, etc.

        var array,
            curly = nexttoken,
            old_inblock = in_block,
            old_scope = scope,
            old_strict_mode = strict_mode;

        in_block = ordinary;
        scope = Object.create(scope);
        spaces();
        if (nexttoken.id === '{') {
            advance('{');
            step_in();
            if (!ordinary && !use_strict() && !old_strict_mode &&
                    option.strict && funct['(context)']['(global)']) {
                warn(bundle.missing_use_strict);
            }
            array = statements();
            strict_mode = old_strict_mode;
            step_out('}', curly);
            discard();
        } else if (!ordinary) {
            fail(bundle.expected_a_b, nexttoken, '{', nexttoken.value);
        } else {
            warn(bundle.expected_a_b, nexttoken, '{', nexttoken.value);
            array = [statement()];
            array.disrupt = array[0].disrupt;
        }
        funct['(verb)'] = null;
        scope = old_scope;
        in_block = old_inblock;
        if (ordinary && array.length === 0) {
            warn(bundle.empty_block);
        }
        return array;
    }


    function tally_member(name) {
        if (members_only && typeof members_only[name] !== 'boolean') {
            warn(bundle.unexpected_member_a, token, name);
        }
        if (typeof member[name] === 'number') {
            member[name] += 1;
        } else {
            member[name] = 1;
        }
    }


    function note_implied(token) {
        var name = token.value, line = token.line, a = implied[name];
        if (typeof a === 'function') {
            a = false;
        }
        if (!a) {
            a = [line];
            implied[name] = a;
        } else if (a[a.length - 1] !== line) {
            a.push(line);
        }
    }


    // ECMAScript parser

    syntax['(identifier)'] = {
        type: '(identifier)',
        lbp: 0,
        identifier: true,
        nud: function () {
            var v = this.value,
                s = scope[v],
                f;
            if (typeof s === 'function') {

                // Protection against accidental inheritance.

                s = undefined;
            } else if (typeof s === 'boolean') {
                f = funct;
                funct = functions[0];
                add_label(v, 'var');
                s = funct;
                funct = f;
            }

            // The name is in scope and defined in the current function.

            if (funct === s) {

                //      Change 'unused' to 'var', and reject labels.

                switch (funct[v]) {
                    case 'unused':
                        funct[v] = 'var';
                        break;
                    case 'unction':
                        funct[v] = 'function';
                        this['function'] = true;
                        break;
                    case 'function':
                        this['function'] = true;
                        break;
                    case 'label':
                        warn(bundle.a_label, token, v);
                        break;
                }

                // The name is not defined in the function.  If we are in the global scope,
                // then we have an undefined variable.

            } else if (funct['(global)']) {
                if (option.undef && typeof predefined[v] !== 'boolean') {
                    warn(bundle.a_not_defined, token, v);
                }
                note_implied(token);

                // If the name is already defined in the current
                // function, but not as outer, then there is a scope error.

            } else {
                switch (funct[v]) {
                    case 'closure':
                    case 'function':
                    case 'var':
                    case 'unused':
                        warn(bundle.a_scope, token, v);
                        break;
                    case 'label':
                        warn(bundle.a_label, token, v);
                        break;
                    case 'outer':
                    case 'global':
                        break;
                    default:

                        // If the name is defined in an outer function, make an outer entry, and if
                        // it was unused, make it var.

                        if (s === true) {
                            funct[v] = true;
                        } else if (s === null) {
                            warn(bundle.a_not_allowed, token, v);
                            note_implied(token);
                        } else if (typeof s !== 'object') {
                            if (option.undef) {
                                warn(bundle.a_not_defined, token, v);
                            } else {
                                funct[v] = true;
                            }
                            note_implied(token);
                        } else {
                            switch (s[v]) {
                                case 'function':
                                case 'unction':
                                    this['function'] = true;
                                    s[v] = 'closure';
                                    funct[v] = s['(global)'] ? 'global' : 'outer';
                                    break;
                                case 'var':
                                case 'unused':
                                    s[v] = 'closure';
                                    funct[v] = s['(global)'] ? 'global' : 'outer';
                                    break;
                                case 'closure':
                                case 'parameter':
                                    funct[v] = s['(global)'] ? 'global' : 'outer';
                                    break;
                                case 'label':
                                    warn(bundle.a_label, token, v);
                                    break;
                            }
                        }
                }
            }
            return this;
        },
        led: function () {
            fail(bundle.expected_operator_a);
        }
    };

    // Build the syntax table by declaring the syntactic elements of the language.

    type('(number)', 'number', return_this);
    type('(string)', 'string', return_this);
    type('(regexp)', 'regexp', return_this);
    type('(color)', 'color');
    type('(range)', 'range');

    ultimate('(begin)');
    ultimate('(end)');
    ultimate('(error)');
    postscript(delim('</'));
    delim('<!');
    delim('<!--');
    delim('-->');
    postscript(delim('}'));
    delim(')');
    delim(']');
    postscript(delim('"'));
    postscript(delim('\''));
    delim(';');
    delim(':');
    delim(',');
    delim('#');
    delim('@');
    delim('*/');
    reserve('else');
    postscript(reserve('case'));
    reserve('catch');
    postscript(reserve('default'));
    reserve('finally');
    reservevar('arguments', function (x) {
        if (strict_mode && funct['(global)']) {
            warn(bundle.strict, x);
        } else if (option.safe) {
            warn(bundle.adsafe, x);
        }
    });
    reservevar('eval', function (x) {
        if (option.safe) {
            warn(bundle.adsafe, x);
        }
    });
    reservevar('false');
    reservevar('Infinity');
    reservevar('NaN');
    reservevar('null');
    reservevar('this', function (x) {
        if (strict_mode && ((funct['(statement)'] &&
                funct['(name)'].charAt(0) > 'Z') || funct['(global)'])) {
            warn(bundle.strict, x);
        } else if (option.safe) {
            warn(bundle.adsafe, x);
        }
    });
    reservevar('true');
    reservevar('undefined');
    assignop('=');
    assignop('+=');
    assignop('-=');
    assignop('*=');
    assignop('/=').nud = function () {
        fail(bundle.slash_equal);
    };
    assignop('%=');
    assignop('&=', true);
    assignop('|=', true);
    assignop('^=', true);
    assignop('<<=', true);
    assignop('>>=', true);
    assignop('>>>=', true);
    infix('?', 30, function (left, that) {
        that.first = expected_condition(expected_relation(left));
        that.second = expression(0);
        spaces();
        advance(':');
        discard();
        spaces();
        that.third = expression(10);
        that.arity = 'ternary';
        if (are_similar(that.second, that.third)) {
            warn(bundle.weird_ternary, that);
        }
        return that;
    });

    infix('||', 40, function (left, that) {
        function paren_check(that) {
            if (that.id === '&&' && !that.paren) {
                warn(bundle.and, that);
            }
            return that;
        }

        that.first = paren_check(expected_condition(expected_relation(left)));
        that.second = paren_check(expected_relation(expression(40)));
        if (are_similar(that.first, that.second)) {
            warn(bundle.weird_condition, that);
        }
        return that;
    });
    infix('&&', 50, function (left, that) {
        that.first = expected_condition(expected_relation(left));
        that.second = expected_relation(expression(50));
        if (are_similar(that.first, that.second)) {
            warn(bundle.weird_condition, that);
        }
        return that;
    });
    prefix('void', function () {
        this.first = expression(0);
        if (this.first.arity !== 'number' || this.first.value) {
            warn(bundle.unexpected_a, this);
            return this;
        }
        return this;
    });
    bitwise('|', 70);
    bitwise('^', 80);
    bitwise('&', 90);
    relation('==', '===');
    relation('===');
    relation('!=', '!==');
    relation('!==');
    relation('<');
    relation('>');
    relation('<=');
    relation('>=');
    bitwise('<<', 120);
    bitwise('>>', 120);
    bitwise('>>>', 120);
    infix('in', 120, function (left, that) {
        warn(bundle.infix_in, that);
        that.left = left;
        that.right = expression(130);
        return that;
    });
    infix('instanceof', 120);
    infix('+', 130, function (left, that) {
        if (!left.value) {
            if (left.arity === 'number') {
                warn(bundle.unexpected_a, left);
            } else if (left.arity === 'string') {
                warn(bundle.expected_a_b, left, 'String', '\'\'');
            }
        }
        var right = expression(130);
        if (!right.value) {
            if (right.arity === 'number') {
                warn(bundle.unexpected_a, right);
            } else if (right.arity === 'string') {
                warn(bundle.expected_a_b, right, 'String', '\'\'');
            }
        }
        if (left.arity === right.arity &&
                (left.arity === 'string' || left.arity === 'number')) {
            left.value += right.value;
            left.thru = right.thru;
            if (left.arity === 'string' && jx.test(left.value)) {
                warn(bundle.url, left);
            }
            discard(right);
            discard(that);
            return left;
        }
        that.first = left;
        that.second = right;
        return that;
    });
    prefix('+', 'num');
    prefix('+++', function () {
        warn(bundle.confusing_a, token);
        this.first = expression(150);
        this.arity = 'prefix';
        return this;
    });
    infix('+++', 130, function (left) {
        warn(bundle.confusing_a, token);
        this.first = left;
        this.second = expression(130);
        return this;
    });
    infix('-', 130, function (left, that) {
        if ((left.arity === 'number' && left.value === 0) || left.arity === 'string') {
            warn(bundle.unexpected_a, left);
        }
        var right = expression(130);
        if ((right.arity === 'number' && right.value === 0) || right.arity === 'string') {
            warn(bundle.unexpected_a, left);
        }
        if (left.arity === right.arity && left.arity === 'number') {
            left.value -= right.value;
            left.thru = right.thru;
            discard(right);
            discard(that);
            return left;
        }
        that.first = left;
        that.second = right;
        return that;
    });
    prefix('-');
    prefix('---', function () {
        warn(bundle.confusing_a, token);
        this.first = expression(150);
        this.arity = 'prefix';
        return this;
    });
    infix('---', 130, function (left) {
        warn(bundle.confusing_a, token);
        this.first = left;
        this.second = expression(130);
        return this;
    });
    infix('*', 140, function (left, that) {
        if ((left.arity === 'number' && (left.value === 0 || left.value === 1)) || left.arity === 'string') {
            warn(bundle.unexpected_a, left);
        }
        var right = expression(140);
        if ((right.arity === 'number' && (right.value === 0 || right.value === 1)) || right.arity === 'string') {
            warn(bundle.unexpected_a, right);
        }
        if (left.arity === right.arity && left.arity === 'number') {
            left.value *= right.value;
            left.thru = right.thru;
            discard(right);
            discard(that);
            return left;
        }
        that.first = left;
        that.second = right;
        return that;
    });
    infix('/', 140, function (left, that) {
        if ((left.arity === 'number' && left.value === 0) || left.arity === 'string') {
            warn(bundle.unexpected_a, left);
        }
        var right = expression(140);
        if ((right.arity === 'number' && (right.value === 0 || right.value === 1)) || right.arity === 'string') {
            warn(bundle.unexpected_a, right);
        }
        if (left.arity === right.arity && left.arity === 'number') {
            left.value /= right.value;
            left.thru = right.thru;
            discard(right);
            discard(that);
            return left;
        }
        that.first = left;
        that.second = right;
        return that;
    });
    infix('%', 140, function (left, that) {
        if ((left.arity === 'number' && (left.value === 0 || left.value === 1)) || left.arity === 'string') {
            warn(bundle.unexpected_a, left);
        }
        var right = expression(140);
        if ((right.arity === 'number' && (right.value === 0 || right.value === 1)) || right.arity === 'string') {
            warn(bundle.unexpected_a, right);
        }
        if (left.arity === right.arity && left.arity === 'number') {
            left.value %= right.value;
            left.thru = right.thru;
            discard(right);
            discard(that);
            return left;
        }
        that.first = left;
        that.second = right;
        return that;
    });

    suffix('++');
    prefix('++');

    suffix('--');
    prefix('--');
    //prefix('delete', function () {
    //    one_space();
    //    var p = expression(0);
    //    if (!p || (p.id !== '.' && p.id !== '[')) {
    //        warn(bundle.deleted);
    //    }
    //    this.first = p;
    //    return this;
    //});


    prefix('~', function () {
        no_space_only();
        if (option.bitwise) {
            warn(bundle.unexpected_a, this);
        }
        expression(150);
        return this;
    });
    prefix('!', function () {
        no_space_only();
        this.first = expression(150);
        this.arity = 'prefix';
        if (bang[this.first.id] === true) {
            warn(bundle.confusing_a, this);
        }
        return this;
    });
    prefix('typeof');
    prefix('new', function () {
        one_space();
        var c = expression(160), i, p;
        this.first = c;
        if (c.id !== 'function') {
            if (c.identifier) {
                switch (c.value) {
                    case 'Object':
                        warn(bundle.use_object, token);
                        break;
                    case 'Array':
                        if (nexttoken.id === '(') {
                            p = nexttoken;
                            p.first = this;
                            advance('(');
                            if (nexttoken.id !== ')') {
                                p.second = expression(0);
                                if (p.second.arity !== 'number' || !p.second.value) {
                                    expected_condition(p.second, bundle.use_array);
                                    i = false;
                                } else {
                                    i = true;
                                }
                                while (nexttoken.id !== ')' && nexttoken.id !== '(end)') {
                                    if (i) {
                                        warn(bundle.use_array, p);
                                        i = false;
                                    }
                                    advance();
                                }
                            } else {
                                warn(bundle.use_array, token);
                            }
                            advance(')', p);
                            discard();
                            return p;
                        }
                        warn(bundle.use_array, token);
                        break;
                    case 'Number':
                    case 'String':
                    case 'Boolean':
                    case 'Math':
                    case 'JSON':
                        warn(bundle.not_a_constructor, c);
                        break;
                    case 'Function':
                        if (!option.evil) {
                            warn(bundle.function_eval);
                        }
                        break;
                    case 'Date':
                    case 'RegExp':
                        break;
                    default:
                        if (c.id !== 'function') {
                            i = c.value.substr(0, 1);
                            if (option.newcap && (i < 'A' || i > 'Z')) {
                                warn(bundle.constructor_name_a, token);
                            }
                        }
                }
            } else {
                if (c.id !== '.' && c.id !== '[' && c.id !== '(') {
                    warn(bundle.bad_constructor, token);
                }
            }
        } else {
            warn(bundle.weird_new, this);
        }
        if (nexttoken.id !== '(') {
            warn(bundle.missing_a, nexttoken, '()');
        }
        return this;
    });

    infix('(', 160, function (left, that) {
        if (indent && indent.mode === 'expression') {
            no_space(prevtoken, token);
        } else {
            no_space_only(prevtoken, token);
        }
        if (!left.immed && left.id === 'function') {
            warn(bundle.wrap_immediate);
        }
        var p = [];
        if (left) {
            if (left.identifier) {
                if (left.value.match(/^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/)) {
                    if (left.value !== 'Number' && left.value !== 'String' &&
                            left.value !== 'Boolean' && left.value !== 'Date') {
                        if (left.value === 'Math' || left.value === 'JSON') {
                            warn(bundle.not_a_function, left);
                        } else if (left.value === 'Object') {
                            warn(bundle.use_object, token);
                        } else if (left.value === 'Array' || option.newcap) {
                            warn(bundle.missing_a, left, 'new');
                        }
                    }
                }
            } else if (left.id === '.') {
                if (option.safe && left.first.value === 'Math' &&
                        left.second === 'random') {
                    warn(bundle.adsafe, left);
                }
            }
        }
        step_in();
        if (nexttoken.id !== ')') {
            no_space();
            for (; ;) {
                edge();
                p.push(expression(10));
                if (nexttoken.id !== ',') {
                    break;
                }
                comma();
            }
        }
        no_space();
        step_out(')', that);
        if (typeof left === 'object') {
            if (left.value === 'parseInt' && p.length === 1) {
                warn(bundle.radix, left);
            }
            if (!option.evil) {
                if (left.value === 'eval' || left.value === 'Function' ||
                        left.value === 'execScript') {
                    warn(bundle.evil, left);
                } else if (p[0] && p[0].arity === 'string' &&
                        (left.value === 'setTimeout' ||
                        left.value === 'setInterval')) {
                    warn(bundle.implied_evil, left);
                }
            }
            if (!left.identifier && left.id !== '.' && left.id !== '[' &&
                    left.id !== '(' && left.id !== '&&' && left.id !== '||' &&
                    left.id !== '?') {
                warn(bundle.bad_invocation, left);
            }
        }
        that.first = left;
        that.second = p;
        return that;
    }, true);

    prefix('(', function () {
        step_in('expression');
        discard();
        no_space();
        edge();
        if (nexttoken.id === 'function') {
            nexttoken.immed = true;
        }
        var value = expression(0);
        value.paren = true;
        no_space();
        step_out(')', this);
        discard();
        if (value.id === 'function') {
            if (nexttoken.id === '(') {
                warn(bundle.move_invocation);
            } else {
                warn(bundle.bad_wrap, this);
            }
        }
        return value;
    });

    infix('.', 170, function (left, that) {
        no_space(prevtoken, token);
        no_space();
        var m = identifier();
        if (typeof m === 'string') {
            tally_member(m);
        }
        that.first = left;
        that.second = token;
        if (left && left.value === 'arguments' &&
                (m === 'callee' || m === 'caller')) {
            warn(bundle.avoid_a, left, 'arguments.' + m);
        } else if (!option.evil && left && left.value === 'document' &&
                (m === 'write' || m === 'writeln')) {
            warn(bundle.write_is_wrong, left);
        } else if (option.adsafe) {
            if (!adsafe_top && left.value === 'ADSAFE') {
                if (m === 'id' || m === 'lib') {
                    warn(bundle.adsafe, that);
                } else if (m === 'go') {
                    if (xmode !== 'script') {
                        warn(bundle.adsafe, that);
                    } else if (adsafe_went || nexttoken.id !== '(' ||
                            peek(0).arity !== 'string' ||
                            peek(0).value !== adsafe_id ||
                            peek(1).id !== ',') {
                        fail(bundle.adsafe_a, that, 'go');
                    }
                    adsafe_went = true;
                    adsafe_may = false;
                }
            }
            adsafe_top = false;
        }
        if (!option.evil && (m === 'eval' || m === 'execScript')) {
            warn(bundle.evil);
        } else if (option.safe) {
            for (; ;) {
                if (banned[m] === true) {
                    warn(bundle.adsafe_a, token, m);
                }
                if (typeof predefined[left.value] !== 'boolean' ||
                        nexttoken.id === '(') {
                    break;
                }
                if (standard_member[m] === true) {
                    if (nexttoken.id === '.') {
                        warn(bundle.adsafe, that);
                    }
                    break;
                }
                if (nexttoken.id !== '.') {
                    warn(bundle.adsafe, that);
                    break;
                }
                advance('.');
                token.first = that;
                token.second = m;
                that = token;
                m = identifier();
                if (typeof m === 'string') {
                    tally_member(m);
                }
            }
        }
        return that;
    }, true);

    infix('[', 170, function (left, that) {
        no_space_only(prevtoken, token);
        no_space();
        step_in();
        edge();
        var e = expression(0), s;
        if (e.arity === 'string') {
            if (option.safe && banned[e.value] === true) {
                warn(bundle.adsafe_a, e);
            } else if (!option.evil &&
                    (e.value === 'eval' || e.value === 'execScript')) {
                warn(bundle.evil, e);
            } else if (option.safe &&
                    (e.value.charAt(0) === '_' || e.value.charAt(0) === '-')) {
                warn(bundle.adsafe_subscript_a, e);
            }
            tally_member(e.value);
            if (!option.sub && ix.test(e.value)) {
                s = syntax[e.value];
                if (!s || !s.reserved) {
                    warn(bundle.subscript, e);
                }
            }
        } else if (e.arity !== 'number' || e.value < 0) {
            if (option.safe) {
                warn(bundle.adsafe_subscript_a, e);
            }
        }
        step_out(']', that);
        discard();
        no_space(prevtoken, token);
        that.first = left;
        that.second = e;
        return that;
    }, true);

    prefix('[', function () {
        this.arity = 'prefix';
        this.first = [];
        step_in('array');
        while (nexttoken.id !== '(end)') {
            while (nexttoken.id === ',') {
                warn(bundle.unexpected_a, nexttoken);
                advance(',');
                discard();
            }
            if (nexttoken.id === ']') {
                break;
            }
            edge();
            this.first.push(expression(10));
            if (nexttoken.id === ',') {
                comma();
                if (nexttoken.id === ']' && !option.es5) {
                    warn(bundle.unexpected_a, token);
                    break;
                }
            } else {
                break;
            }
        }
        step_out(']', this);
        discard();
        return this;
    }, 170);


    function property_name() {
        var id = optional_identifier(true);
        if (!id) {
            if (nexttoken.arity === 'string') {
                id = nexttoken.value;
                if (option.safe) {
                    if (banned[id]) {
                        warn(bundle.adsafe_a);
                    } else if (id.charAt(0) === '_' ||
                            id.charAt(id.length - 1) === '_') {
                        warn(bundle.dangling_a);
                    }
                }
                advance();
            } else if (nexttoken.arity === 'number') {
                id = nexttoken.value.toString();
                advance();
            }
        }
        return id;
    }


    function function_params() {
        var id, paren = nexttoken, params = [];
        advance('(');
        step_in();
        discard();
        no_space();
        if (nexttoken.id === ')') {
            no_space();
            step_out(')', paren);
            discard();
            return;
        }
        for (; ;) {
            edge();
            id = identifier();
            params.push(token);
            add_label(id, 'parameter');
            if (nexttoken.id === ',') {
                comma();
            } else {
                no_space();
                step_out(')', paren);
                discard();
                return params;
            }
        }
    }


    function do_function(func, name) {
        var s = scope;
        scope = Object.create(s);
        funct = {
            '(name)': name || '"' + anonname + '"',
            '(line)': nexttoken.line,
            '(context)': funct,
            '(breakage)': 0,
            '(loopage)': 0,
            '(scope)': scope,
            '(token)': func
        };
        token.funct = funct;
        functions.push(funct);
        if (name) {
            add_label(name, 'function');
        }
        func.name = name || '';
        func.first = funct['(params)'] = function_params();
        one_space();
        func.block = block(false);

        scope = s;
        funct = funct['(context)'];
        return func;
    }


    prefix('{', function () {
        var get, i, j, name, p, set, seen = {}, t;
        this.arity = 'prefix';
        this.first = [];
        step_in();
        while (nexttoken.id !== '}') {

            // JSLint recognizes the ES5 extension for get/set in object literals,
            // but requires that they be used in pairs.

            edge();
            if (nexttoken.value === 'get' && peek().id !== ':') {
                if (!option.es5) {
                    warn(bundle.get_set);
                }
                get = nexttoken;
                one_space_only();
                advance('get');
                name = nexttoken;
                i = property_name();
                if (!i) {
                    fail(bundle.missing_property);
                }
                do_function(get, '');
                if (funct['(loopage)']) {
                    warn(bundle.function_loop, t);
                }
                p = get.first;
                if (p) {
                    warn(bundle.parameter_a_get_b, t, p[0], i);
                }
                comma();
                set = nexttoken;
                spaces();
                edge();
                advance('set');
                one_space_only();
                j = property_name();
                if (i !== j) {
                    fail(bundle.expected_a_b, token, i, j);
                }
                do_function(set, '');
                p = set.first;
                if (!p || p.length !== 1 || p[0] !== 'value') {
                    warn(bundle.parameter_set_a, t, i);
                }
                name.first = [get, set];
            } else {
                name = nexttoken;
                i = property_name();
                if (typeof i !== 'string') {
                    fail(bundle.missing_property);
                }
                advance(':');
                discard();
                spaces();
                name.first = expression(10);
            }
            this.first.push(name);
            if (seen[i] === true) {
                warn(bundle.duplicate_a, nexttoken, i);
            }
            seen[i] = true;
            tally_member(i);
            if (nexttoken.id !== ',') {
                break;
            }
            for (; ;) {
                comma();
                if (nexttoken.id !== ',') {
                    break;
                }
                warn(bundle.unexpected_a, nexttoken);
            }
            if (nexttoken.id === '}' && !option.es5) {
                warn(bundle.unexpected_a, token);
            }
        }
        step_out('}', this);
        discard();
        return this;
    });

    stmt('{', function () {
        discard();
        warn(bundle.statement_block);
        this.arity = 'statement';
        this.block = statements();
        this.disrupt = this.block.disrupt;
        advance('}', this);
        discard();
        return this;
    });

    stmt('/*members', do_option);
    stmt('/*member', do_option);
    stmt('/*jslint', do_option);
    stmt('/*global', do_option);



    stmt('var', function () {

        // JavaScript does not have block scope. It only has function scope. So,
        // declaring a variable in a block can have unexpected consequences.

        // var.first will contain an array, the array containing name tokens
        // and assignment tokens.

        var assign, id, name;

        if (funct['(onevar)'] && option.onevar) {
            warn(bundle.combine_var);
        } else if (!funct['(global)']) {
            funct['(onevar)'] = true;
        }
        this.arity = 'statement';
        this.first = [];
        step_in('var');
        for (; ;) {
            name = nexttoken;
            id = identifier();
            if (funct['(global)'] && predefined[id] === false) {
                warn(bundle.redefinition_a, token, id);
            }
            add_label(id, 'unused');

            if (nexttoken.id === '=') {
                assign = nexttoken;
                assign.first = name;
                spaces();
                advance('=');
                spaces();
                if (nexttoken.id === 'undefined') {
                    warn(bundle.unnecessary_initialize, token, id);
                }
                if (peek(0).id === '=' && nexttoken.identifier) {
                    fail(bundle.var_a_not);
                }
                assign.second = expression(0);
                assign.arity = 'infix';
                this.first.push(assign);
            } else {
                this.first.push(name);
            }
            if (nexttoken.id !== ',') {
                break;
            }
            comma();
            if (var_mode && nexttoken.line === token.line &&
                    this.first.length === 1) {
                var_mode = false;
                indent.open = false;
                indent.at -= option.indent;
            }
            spaces();
            edge();
        }
        var_mode = false;
        step_out();
        return this;
    });

    stmt('function', function () {
        one_space();
        if (in_block) {
            warn(bundle.function_block, token);
        }
        var i = identifier();
        if (i) {
            add_label(i, 'unction');
            no_space();
        }
        do_function(this, i, true);
        if (nexttoken.id === '(' && nexttoken.line === token.line) {
            fail(bundle.function_statement);
        }
        this.arity = 'statement';
        return this;
    });

    prefix('function', function () {
        one_space();
        var i = optional_identifier();
        if (i) {
            no_space();
        }
        do_function(this, i);
        if (funct['(loopage)']) {
            warn(bundle.function_loop);
        }
        this.arity = 'function';
        return this;
    });

    stmt('if', function () {
        var t = nexttoken;
        one_space();
        advance('(');
        step_in('control');
        discard();
        no_space();
        edge();
        this.arity = 'statement';
        this.first = expected_condition(expected_relation(expression(0)));
        no_space();
        step_out(')', t);
        discard();
        one_space();
        this.block = block(true);
        if (nexttoken.id === 'else') {
            one_space();
            advance('else');
            discard();
            one_space();
            this['else'] = nexttoken.id === 'if' || nexttoken.id === 'switch' ?
                statement(true) : block(true);
            if (this['else'].disrupt && this.block.disrupt) {
                this.disrupt = true;
            }
        }
        return this;
    });

    stmt('try', function () {

        // try.first    The catch variable
        // try.second   The catch clause
        // try.third    The finally clause
        // try.block    The try block

        var b, e, s, t;
        if (option.adsafe) {
            warn(bundle.adsafe_a, this);
        }
        one_space();
        this.arity = 'statement';
        this.block = block(false);
        if (nexttoken.id === 'catch') {
            one_space();
            advance('catch');
            discard();
            one_space();
            t = nexttoken;
            advance('(');
            step_in('control');
            discard();
            no_space();
            edge();
            s = scope;
            scope = Object.create(s);
            e = nexttoken.value;
            this.first = e;
            if (!nexttoken.identifier) {
                warn(bundle.expected_identifier_a, nexttoken);
            } else {
                add_label(e, 'exception');
            }
            advance();
            no_space();
            step_out(')', t);
            discard();
            one_space();
            this.second = block(false);
            b = true;
            scope = s;
        }
        if (nexttoken.id === 'finally') {
            discard();
            one_space();
            t = nexttoken;
            advance('finally');
            discard();
            one_space();
            this.third = block(false);
        } else if (!b) {
            fail(bundle.expected_a_b, nexttoken, 'catch', nexttoken.value);
        }
        return this;
    });


    labeled_stmt('while', function () {
        one_space();
        var t = nexttoken;
        funct['(breakage)'] += 1;
        funct['(loopage)'] += 1;
        advance('(');
        step_in('control');
        discard();
        no_space();
        edge();
        this.arity = 'statement';
        this.first = expected_relation(expression(0));
        if (this.first.id !== 'true') {
            expected_condition(this.first, bundle.unexpected_a);
        }
        no_space();
        step_out(')', t);
        discard();
        one_space();
        this.block = block(true);
        if (this.block.disrupt) {
            warn(bundle.strange_loop, prevtoken);
        }
        funct['(breakage)'] -= 1;
        funct['(loopage)'] -= 1;
        return this;
    });

    reserve('with');

    labeled_stmt('switch', function () {

        // switch.first             the switch expression
        // switch.second            the array of cases. A case is 'case' or 'default' token:
        //    case.first            the array of case expressions
        //    case.second           the array of statements
        // If all of the arrays of statements are disrupt, then the switch is disrupt.

        var particular,
            the_case = nexttoken,
            unbroken = true;
        funct['(breakage)'] += 1;
        one_space();
        advance('(');
        discard();
        no_space();
        step_in();
        this.arity = 'statement';
        this.first = expected_condition(expected_relation(expression(0)));
        no_space();
        step_out(')', the_case);
        discard();
        one_space();
        advance('{');
        step_in();
        this.second = [];
        while (nexttoken.id === 'case') {
            the_case = nexttoken;
            the_case.first = [];
            spaces();
            edge('case');
            advance('case');
            for (; ;) {
                one_space();
                particular = expression(0);
                the_case.first.push(particular);
                if (particular.id === 'NaN') {
                    warn(bundle.unexpected_a, particular);
                }
                no_space_only();
                advance(':');
                discard();
                if (nexttoken.id !== 'case') {
                    break;
                }
                spaces();
                edge('case');
                advance('case');
                discard();
            }
            spaces();
            the_case.second = statements();
            if (the_case.second && the_case.second.length > 0) {
                particular = the_case.second[the_case.second.length - 1];
                if (particular.disrupt) {
                    if (particular.id === 'break') {
                        unbroken = false;
                    }
                } else {
                    warn(bundle.missing_a_after_b, nexttoken, 'break', 'case');
                }
            } else {
                warn(bundle.empty_case);
            }
            this.second.push(the_case);
        }
        if (this.second.length === 0) {
            warn(bundle.missing_a, nexttoken, 'case');
        }
        if (nexttoken.id === 'default') {
            spaces();
            the_case = nexttoken;
            edge('case');
            advance('default');
            discard();
            no_space_only();
            advance(':');
            discard();
            spaces();
            the_case.second = statements();
            if (the_case.second && the_case.second.length > 0) {
                particular = the_case.second[the_case.second.length - 1];
                if (unbroken && particular.disrupt && particular.id !== 'break') {
                    this.disrupt = true;
                }
            }
            this.second.push(the_case);
        }
        funct['(breakage)'] -= 1;
        spaces();
        step_out('}', this);
        return this;
    });

    stmt('debugger', function () {
        if (!option.debug) {
            warn(bundle.unexpected_a, this);
        }
        this.arity = 'statement';
        return this;
    });

    labeled_stmt('do', function () {
        funct['(breakage)'] += 1;
        funct['(loopage)'] += 1;
        one_space();
        this.arity = 'statement';
        this.block = block(true);
        if (this.block.disrupt) {
            warn(bundle.strange_loop, prevtoken);
        }
        one_space();
        advance('while');
        discard();
        var t = nexttoken;
        one_space();
        advance('(');
        step_in();
        discard();
        no_space();
        edge();
        this.first = expected_condition(expected_relation(expression(0)), bundle.unexpected_a);
        no_space();
        step_out(')', t);
        discard();
        funct['(breakage)'] -= 1;
        funct['(loopage)'] -= 1;
        return this;
    });

    labeled_stmt('for', function () {
        var blok, filter, ok = false, paren = nexttoken, the_in, value;
        this.arity = 'statement';
        funct['(breakage)'] += 1;
        funct['(loopage)'] += 1;
        advance('(');
        step_in('control');
        discard();
        spaces(this, paren);
        no_space();
        if (nexttoken.id === 'var') {
            if (option.forvar) {
                fail(bundle.move_var);
            }
            else {
                advance();
                add_label(nexttoken.value, 'unused');
            }
        }
        edge();
        if (peek(0).id === 'in') {
            value = nexttoken;
            switch (funct[value.value]) {
                case 'unused':
                    funct[value.value] = 'var';
                    break;
                case 'var':
                    break;
                default:
                    warn(bundle.bad_in_a, value);
            }
            advance();
            the_in = nexttoken;
            advance('in');
            the_in.first = value;
            the_in.second = expression(20);
            step_out(')', paren);
            discard();
            this.first = the_in;
            blok = block(true);
            if (!option.forin) {
                if (blok.length === 1 && typeof blok[0] === 'object' &&
                        blok[0].value === 'if' && !blok[0]['else']) {
                    filter = blok[0].first;
                    while (filter.id === '&&') {
                        filter = filter.first;
                    }
                    switch (filter.id) {
                        case '===':
                        case '!==':
                            ok = filter.first.id === '[' ? (
                                filter.first.first.value === the_in.second.value &&
                                filter.first.second.value === the_in.first.value
                            ) : (
                                filter.first.id === 'typeof' &&
                                filter.first.first.id === '[' &&
                                filter.first.first.first.value === the_in.second.value &&
                                filter.first.first.second.value === the_in.first.value
                            );
                            break;
                        case '(':
                            ok = filter.first.id === '.' && ((
                                filter.first.first.value === the_in.second.value &&
                                filter.first.second.value === 'hasOwnProperty' &&
                                filter.second[0].value === the_in.first.value
                            ) || (
                                filter.first.first.value === 'ADSAFE' &&
                                filter.first.second.value === 'has' &&
                                filter.second[0].value === the_in.second.value &&
                                filter.second[1].value === the_in.first.value
                            ) || (
                                filter.first.first.id === '.' &&
                                filter.first.first.first.id === '.' &&
                                filter.first.first.first.first.value === 'Object' &&
                                filter.first.first.first.second.value === 'prototype' &&
                                filter.first.first.second.value === 'hasOwnProperty' &&
                                filter.first.second.value === 'call' &&
                                filter.second[0].value === the_in.second.value &&
                                filter.second[1].value === the_in.first.value
                            ));
                            break;
                    }
                }
                if (!ok) {
                    warn(bundle.for_if, this);
                }
            }
        } else {
            if (nexttoken.id !== ';') {
                edge();
                this.first = [];
                for (; ;) {
                    this.first.push(expression(0, 'for'));
                    if (nexttoken.id !== ',') {
                        break;
                    }
                    comma();
                }
            }
            semicolon();
            if (nexttoken.id !== ';') {
                edge();
                this.second = expected_relation(expression(0));
                if (this.second.id !== 'true') {
                    expected_condition(this.second, bundle.unexpected_a);
                }
            }
            semicolon(token);
            if (nexttoken.id === ';') {
                fail(bundle.expected_a_b, nexttoken, ')', ';');
            }
            if (nexttoken.id !== ')') {
                this.third = [];
                edge();
                for (; ;) {
                    this.third.push(expression(0, 'for'));
                    if (nexttoken.id !== ',') {
                        break;
                    }
                    comma();
                }
            }
            no_space();
            step_out(')', paren);
            discard();
            one_space();
            blok = block(true);
        }
        if (blok.disrupt) {
            warn(bundle.strange_loop, prevtoken);
        }
        this.block = blok;
        funct['(breakage)'] -= 1;
        funct['(loopage)'] -= 1;
        return this;
    });


    disrupt_stmt('break', function () {
        var v = nexttoken.value;
        this.arity = 'statement';
        if (funct['(breakage)'] === 0) {
            warn(bundle.unexpected_a, this);
        }
        if (nexttoken.identifier && token.line === nexttoken.line) {
            one_space_only();
            if (funct[v] !== 'label') {
                warn(bundle.not_a_label, nexttoken);
            } else if (scope[v] !== funct) {
                warn(bundle.not_a_scope, nexttoken);
            }
            this.first = nexttoken;
            advance();
        }
        return this;
    });


    disrupt_stmt('continue', function () {
        if (!option['continue']) {
            warn(bundle.unexpected_a, this);
        }
        var v = nexttoken.value;
        this.arity = 'statement';
        if (funct['(breakage)'] === 0) {
            warn(bundle.unexpected_a, this);
        }
        if (nexttoken.identifier && token.line === nexttoken.line) {
            one_space_only();
            if (funct[v] !== 'label') {
                warn(bundle.not_a_label, nexttoken);
            } else if (scope[v] !== funct) {
                warn(bundle.not_a_scope, nexttoken);
            }
            this.first = nexttoken;
            advance();
        }
        return this;
    });


    disrupt_stmt('return', function () {
        this.arity = 'statement';
        if (nexttoken.id !== ';' && nexttoken.line === token.line) {
            one_space_only();
            if (nexttoken.id === '/' || nexttoken.id === '(regexp)') {
                warn(bundle.wrap_regexp);
            }
            this.first = expression(20);
        }
        return this;
    });


    disrupt_stmt('throw', function () {
        this.arity = 'statement';
        one_space_only();
        this.first = expression(20);
        return this;
    });


    //  Superfluous reserved words

    reserve('class');
    reserve('const');
    reserve('enum');
    reserve('export');
    reserve('extends');
    reserve('import');
    reserve('super');

    // Harmony reserved words

    reserve('let');
    reserve('yield');
    reserve('implements');
    reserve('interface');
    reserve('package');
    reserve('private');
    reserve('protected');
    reserve('public');
    reserve('static');


    // Parse JSON

    function json_value() {

        function json_object() {
            var o = {}, t = nexttoken;
            advance('{');
            if (nexttoken.id !== '}') {
                while (nexttoken.id !== '(end)') {
                    while (nexttoken.id === ',') {
                        warn(bundle.unexpected_a, nexttoken);
                        comma();
                    }
                    if (nexttoken.arity !== 'string') {
                        warn(bundle.expected_string_a);
                    }
                    if (o[nexttoken.value] === true) {
                        warn(bundle.duplicate_a);
                    }
                    //else if (nexttoken.value === '__proto__') {
                    //    warn(bundle.dangling_a);
                    //}
                    else {
                        o[nexttoken.value] = true;
                    }
                    advance();
                    advance(':');
                    json_value();
                    if (nexttoken.id !== ',') {
                        break;
                    }
                    comma();
                    if (nexttoken.id === '}') {
                        warn(bundle.unexpected_a, token);
                        break;
                    }
                }
            }
            advance('}', t);
        }

        function json_array() {
            var t = nexttoken;
            advance('[');
            if (nexttoken.id !== ']') {
                while (nexttoken.id !== '(end)') {
                    while (nexttoken.id === ',') {
                        warn(bundle.unexpected_a, nexttoken);
                        comma();
                    }
                    json_value();
                    if (nexttoken.id !== ',') {
                        break;
                    }
                    comma();
                    if (nexttoken.id === ']') {
                        warn(bundle.unexpected_a, token);
                        break;
                    }
                }
            }
            advance(']', t);
        }

        switch (nexttoken.id) {
            case '{':
                json_object();
                break;
            case '[':
                json_array();
                break;
            case 'true':
            case 'false':
            case 'null':
            case '(number)':
            case '(string)':
                advance();
                break;
            case '-':
                advance('-');
                no_space_only();
                advance('(number)');
                break;
            default:
                fail(bundle.unexpected_a);
        }
    }


    // CSS parsing.

    function css_name() {
        if (nexttoken.identifier) {
            advance();
            return true;
        }
    }


    function css_number() {
        if (nexttoken.id === '-') {
            advance('-');
            no_space_only();
        }
        if (nexttoken.arity === 'number') {
            advance('(number)');
            return true;
        }
    }


    function css_string() {
        if (nexttoken.arity === 'string') {
            advance();
            return true;
        }
    }

    function css_color() {
        var i, number, t, value;
        if (nexttoken.identifier) {
            value = nexttoken.value;
            if (value === 'rgb' || value === 'rgba') {
                advance();
                t = nexttoken;
                advance('(');
                for (i = 0; i < 3; i += 1) {
                    if (i) {
                        comma();
                    }
                    number = nexttoken.value;
                    if (nexttoken.arity !== 'number' || number < 0) {
                        warn(bundle.expected_positive_a, nexttoken);
                        advance();
                    } else {
                        advance();
                        if (nexttoken.id === '%') {
                            advance('%');
                            if (number > 100) {
                                warn(bundle.expected_percent_a, token, number);
                            }
                        } else {
                            if (number > 255) {
                                warn(bundle.expected_small_a, token, number);
                            }
                        }
                    }
                }
                if (value === 'rgba') {
                    comma();
                    number = +nexttoken.value;
                    if (nexttoken.arity !== 'number' || number < 0 || number > 1) {
                        warn(bundle.expected_fraction_a, nexttoken);
                    }
                    advance();
                    if (nexttoken.id === '%') {
                        warn(bundle.unexpected_a);
                        advance('%');
                    }
                }
                advance(')', t);
                return true;
            } else if (css_colorData[nexttoken.value] === true) {
                advance();
                return true;
            }
        } else if (nexttoken.id === '(color)') {
            advance();
            return true;
        }
        return false;
    }


    function css_length() {
        if (nexttoken.id === '-') {
            advance('-');
            no_space_only();
        }
        if (nexttoken.arity === 'number') {
            advance();
            if (nexttoken.arity !== 'string' &&
                    css_lengthData[nexttoken.value] === true) {
                no_space_only();
                advance();
            } else if (+token.value !== 0) {
                warn(bundle.expected_linear_a);
            }
            return true;
        }
        return false;
    }


    function css_line_height() {
        if (nexttoken.id === '-') {
            advance('-');
            no_space_only();
        }
        if (nexttoken.arity === 'number') {
            advance();
            if (nexttoken.arity !== 'string' &&
                    css_lengthData[nexttoken.value] === true) {
                no_space_only();
                advance();
            }
            return true;
        }
        return false;
    }


    function css_width() {
        if (nexttoken.identifier) {
            switch (nexttoken.value) {
                case 'thin':
                case 'medium':
                case 'thick':
                    advance();
                    return true;
            }
        } else {
            return css_length();
        }
    }


    function css_margin() {
        if (nexttoken.identifier) {
            if (nexttoken.value === 'auto') {
                advance();
                return true;
            }
        } else {
            return css_length();
        }
    }

    function css_attr() {
        if (nexttoken.identifier && nexttoken.value === 'attr') {
            advance();
            advance('(');
            if (!nexttoken.identifier) {
                warn(bundle.expected_name_a);
            }
            advance();
            advance(')');
            return true;
        }
        return false;
    }


    function css_comma_list() {
        while (nexttoken.id !== ';') {
            if (!css_name() && !css_string()) {
                warn(bundle.expected_name_a);
            }
            if (nexttoken.id !== ',') {
                return true;
            }
            comma();
        }
    }


    function css_counter() {
        if (nexttoken.identifier && nexttoken.value === 'counter') {
            advance();
            advance('(');
            advance();
            if (nexttoken.id === ',') {
                comma();
                if (nexttoken.arity !== 'string') {
                    warn(bundle.expected_string_a);
                }
                advance();
            }
            advance(')');
            return true;
        }
        if (nexttoken.identifier && nexttoken.value === 'counters') {
            advance();
            advance('(');
            if (!nexttoken.identifier) {
                warn(bundle.expected_name_a);
            }
            advance();
            if (nexttoken.id === ',') {
                comma();
                if (nexttoken.arity !== 'string') {
                    warn(bundle.expected_string_a);
                }
                advance();
            }
            if (nexttoken.id === ',') {
                comma();
                if (nexttoken.arity !== 'string') {
                    warn(bundle.expected_string_a);
                }
                advance();
            }
            advance(')');
            return true;
        }
        return false;
    }


    function css_shape() {
        var i;
        if (nexttoken.identifier && nexttoken.value === 'rect') {
            advance();
            advance('(');
            for (i = 0; i < 4; i += 1) {
                if (!css_length()) {
                    warn(bundle.expected_number_a);
                    break;
                }
            }
            advance(')');
            return true;
        }
        return false;
    }


    function css_url() {
        var c, url;
        if (nexttoken.identifier && nexttoken.value === 'url') {
            nexttoken = lex.range('(', ')');
            url = nexttoken.value;
            c = url.charAt(0);
            if (c === '"' || c === '\'') {
                if (url.slice(-1) !== c) {
                    warn(bundle.bad_url);
                } else {
                    url = url.slice(1, -1);
                    if (url.indexOf(c) >= 0) {
                        warn(bundle.bad_url);
                    }
                }
            }
            if (!url) {
                warn(bundle.missing_url);
            }
            if (option.safe && ux.test(url)) {
                fail(bundle.adsafe_a, nexttoken, url);
            }
            urls.push(url);
            advance();
            return true;
        }
        return false;
    }


    css_any = [css_url, function () {
        for (; ;) {
            if (nexttoken.identifier) {
                switch (nexttoken.value.toLowerCase()) {
                    case 'url':
                        css_url();
                        break;
                    case 'expression':
                        warn(bundle.unexpected_a);
                        advance();
                        break;
                    default:
                        advance();
                }
            } else {
                if (nexttoken.id === ';' || nexttoken.id === '!' ||
                        nexttoken.id === '(end)' || nexttoken.id === '}') {
                    return true;
                }
                advance();
            }
        }
    }];


    css_border_style = [
        'none', 'dashed', 'dotted', 'double', 'groove',
        'hidden', 'inset', 'outset', 'ridge', 'solid'
    ];

    css_break = [
        'auto', 'always', 'avoid', 'left', 'right'
    ];

    css_media = {
        'all': true,
        'braille': true,
        'embossed': true,
        'handheld': true,
        'print': true,
        'projection': true,
        'screen': true,
        'speech': true,
        'tty': true,
        'tv': true
    };

    css_overflow = [
        'auto', 'hidden', 'scroll', 'visible'
    ];

    css_attribute_data = {
        background: [
            true, 'background-attachment', 'background-color',
            'background-image', 'background-position', 'background-repeat'
        ],
        'background-attachment': ['scroll', 'fixed'],
        'background-color': ['transparent', css_color],
        'background-image': ['none', css_url],
        'background-position': [
            2, [css_length, 'top', 'bottom', 'left', 'right', 'center']
        ],
        'background-repeat': [
            'repeat', 'repeat-x', 'repeat-y', 'no-repeat'
        ],
        'border': [true, 'border-color', 'border-style', 'border-width'],
        'border-bottom': [
            true, 'border-bottom-color', 'border-bottom-style',
            'border-bottom-width'
        ],
        'border-bottom-color': css_color,
        'border-bottom-style': css_border_style,
        'border-bottom-width': css_width,
        'border-collapse': ['collapse', 'separate'],
        'border-color': ['transparent', 4, css_color],
        'border-left': [
            true, 'border-left-color', 'border-left-style', 'border-left-width'
        ],
        'border-left-color': css_color,
        'border-left-style': css_border_style,
        'border-left-width': css_width,
        'border-right': [
            true, 'border-right-color', 'border-right-style',
            'border-right-width'
        ],
        'border-right-color': css_color,
        'border-right-style': css_border_style,
        'border-right-width': css_width,
        'border-spacing': [2, css_length],
        'border-style': [4, css_border_style],
        'border-top': [
            true, 'border-top-color', 'border-top-style', 'border-top-width'
        ],
        'border-top-color': css_color,
        'border-top-style': css_border_style,
        'border-top-width': css_width,
        'border-width': [4, css_width],
        bottom: [css_length, 'auto'],
        'caption-side': ['bottom', 'left', 'right', 'top'],
        clear: ['both', 'left', 'none', 'right'],
        clip: [css_shape, 'auto'],
        color: css_color,
        content: [
            'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote',
            css_string, css_url, css_counter, css_attr
        ],
        'counter-increment': [
            css_name, 'none'
        ],
        'counter-reset': [
            css_name, 'none'
        ],
        cursor: [
            css_url, 'auto', 'crosshair', 'default', 'e-resize', 'help', 'move',
            'n-resize', 'ne-resize', 'nw-resize', 'pointer', 's-resize',
            'se-resize', 'sw-resize', 'w-resize', 'text', 'wait'
        ],
        direction: ['ltr', 'rtl'],
        display: [
            'block', 'compact', 'inline', 'inline-block', 'inline-table',
            'list-item', 'marker', 'none', 'run-in', 'table', 'table-caption',
            'table-cell', 'table-column', 'table-column-group',
            'table-footer-group', 'table-header-group', 'table-row',
            'table-row-group'
        ],
        'empty-cells': ['show', 'hide'],
        'float': ['left', 'none', 'right'],
        font: [
            'caption', 'icon', 'menu', 'message-box', 'small-caption',
            'status-bar', true, 'font-size', 'font-style', 'font-weight',
            'font-family'
        ],
        'font-family': css_comma_list,
        'font-size': [
            'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large',
            'xx-large', 'larger', 'smaller', css_length
        ],
        'font-size-adjust': ['none', css_number],
        'font-stretch': [
            'normal', 'wider', 'narrower', 'ultra-condensed',
            'extra-condensed', 'condensed', 'semi-condensed',
            'semi-expanded', 'expanded', 'extra-expanded'
        ],
        'font-style': [
            'normal', 'italic', 'oblique'
        ],
        'font-variant': [
            'normal', 'small-caps'
        ],
        'font-weight': [
            'normal', 'bold', 'bolder', 'lighter', css_number
        ],
        height: [css_length, 'auto'],
        left: [css_length, 'auto'],
        'letter-spacing': ['normal', css_length],
        'line-height': ['normal', css_line_height],
        'list-style': [
            true, 'list-style-image', 'list-style-position', 'list-style-type'
        ],
        'list-style-image': ['none', css_url],
        'list-style-position': ['inside', 'outside'],
        'list-style-type': [
            'circle', 'disc', 'square', 'decimal', 'decimal-leading-zero',
            'lower-roman', 'upper-roman', 'lower-greek', 'lower-alpha',
            'lower-latin', 'upper-alpha', 'upper-latin', 'hebrew', 'katakana',
            'hiragana-iroha', 'katakana-oroha', 'none'
        ],
        margin: [4, css_margin],
        'margin-bottom': css_margin,
        'margin-left': css_margin,
        'margin-right': css_margin,
        'margin-top': css_margin,
        'marker-offset': [css_length, 'auto'],
        'max-height': [css_length, 'none'],
        'max-width': [css_length, 'none'],
        'min-height': css_length,
        'min-width': css_length,
        opacity: css_number,
        outline: [true, 'outline-color', 'outline-style', 'outline-width'],
        'outline-color': ['invert', css_color],
        'outline-style': [
            'dashed', 'dotted', 'double', 'groove', 'inset', 'none',
            'outset', 'ridge', 'solid'
        ],
        'outline-width': css_width,
        overflow: css_overflow,
        'overflow-x': css_overflow,
        'overflow-y': css_overflow,
        padding: [4, css_length],
        'padding-bottom': css_length,
        'padding-left': css_length,
        'padding-right': css_length,
        'padding-top': css_length,
        'page-break-after': css_break,
        'page-break-before': css_break,
        position: ['absolute', 'fixed', 'relative', 'static'],
        quotes: [8, css_string],
        right: [css_length, 'auto'],
        'table-layout': ['auto', 'fixed'],
        'text-align': ['center', 'justify', 'left', 'right'],
        'text-decoration': [
            'none', 'underline', 'overline', 'line-through', 'blink'
        ],
        'text-indent': css_length,
        'text-shadow': ['none', 4, [css_color, css_length]],
        'text-transform': ['capitalize', 'uppercase', 'lowercase', 'none'],
        top: [css_length, 'auto'],
        'unicode-bidi': ['normal', 'embed', 'bidi-override'],
        'vertical-align': [
            'baseline', 'bottom', 'sub', 'super', 'top', 'text-top', 'middle',
            'text-bottom', css_length
        ],
        visibility: ['visible', 'hidden', 'collapse'],
        'white-space': [
            'normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'inherit'
        ],
        width: [css_length, 'auto'],
        'word-spacing': ['normal', css_length],
        'word-wrap': ['break-word', 'normal'],
        'z-index': ['auto', css_number]
    };

    function style_attribute() {
        var v;
        while (nexttoken.id === '*' || nexttoken.id === '#' ||
                nexttoken.value === '_') {
            if (!option.css) {
                warn(bundle.unexpected_a);
            }
            advance();
        }
        if (nexttoken.id === '-') {
            if (!option.css) {
                warn(bundle.unexpected_a);
            }
            advance('-');
            if (!nexttoken.identifier) {
                warn(bundle.expected_nonstandard_style_attribute);
            }
            advance();
            return css_any;
        } else {
            if (!nexttoken.identifier) {
                warn(bundle.expected_style_attribute);
            } else {
                if (Object.prototype.hasOwnProperty.call(css_attribute_data, nexttoken.value)) {
                    v = css_attribute_data[nexttoken.value];
                } else {
                    v = css_any;
                    if (!option.css) {
                        warn(bundle.unrecognized_style_attribute_a);
                    }
                }
            }
            advance();
            return v;
        }
    }


    function style_value(v) {
        var i = 0,
            n,
            once,
            match,
            round,
            start = 0,
            vi;
        switch (typeof v) {
            case 'function':
                return v();
            case 'string':
                if (nexttoken.identifier && nexttoken.value === v) {
                    advance();
                    return true;
                }
                return false;
        }
        for (; ;) {
            if (i >= v.length) {
                return false;
            }
            vi = v[i];
            i += 1;
            if (vi === true) {
                break;
            } else if (typeof vi === 'number') {
                n = vi;
                vi = v[i];
                i += 1;
            } else {
                n = 1;
            }
            match = false;
            while (n > 0) {
                if (style_value(vi)) {
                    match = true;
                    n -= 1;
                } else {
                    break;
                }
            }
            if (match) {
                return true;
            }
        }
        start = i;
        once = [];
        for (; ;) {
            round = false;
            for (i = start; i < v.length; i += 1) {
                if (!once[i]) {
                    if (style_value(css_attribute_data[v[i]])) {
                        match = true;
                        round = true;
                        once[i] = true;
                        break;
                    }
                }
            }
            if (!round) {
                return match;
            }
        }
    }

    function style_child() {
        if (nexttoken.arity === 'number') {
            advance();
            if (nexttoken.value === 'n' && nexttoken.identifier) {
                no_space_only();
                advance();
                if (nexttoken.id === '+') {
                    no_space_only();
                    advance('+');
                    no_space_only();
                    advance('(number)');
                }
            }
            return;
        } else {
            if (nexttoken.identifier &&
                    (nexttoken.value === 'odd' || nexttoken.value === 'even')) {
                advance();
                return;
            }
        }
        warn(bundle.unexpected_a);
    }

    function substyle() {
        var v;
        for (; ;) {
            if (nexttoken.id === '}' || nexttoken.id === '(end)' ||
                    (xquote && nexttoken.id === xquote)) {
                return;
            }
            while (nexttoken.id === ';') {
                warn(bundle.unexpected_a);
                semicolon();
            }
            v = style_attribute();
            advance(':');
            if (nexttoken.identifier && nexttoken.value === 'inherit') {
                advance();
            } else {
                if (!style_value(v)) {
                    warn(bundle.unexpected_a);
                    advance();
                }
            }
            if (nexttoken.id === '!') {
                advance('!');
                no_space_only();
                if (nexttoken.identifier && nexttoken.value === 'important') {
                    advance();
                } else {
                    warn(bundle.expected_a_b,
                        nexttoken, 'important', nexttoken.value);
                }
            }
            if (nexttoken.id === '}' || nexttoken.id === xquote) {
                warn(bundle.expected_a_b, nexttoken, ';', nexttoken.value);
            } else {
                semicolon();
            }
        }
    }

    function style_selector() {
        if (nexttoken.identifier) {
            if (!Object.prototype.hasOwnProperty.call(html_tag, option.cap ?
                    nexttoken.value.toLowerCase() : nexttoken.value)) {
                warn(bundle.expected_tagname_a);
            }
            advance();
        } else {
            switch (nexttoken.id) {
                case '>':
                case '+':
                    advance();
                    style_selector();
                    break;
                case ':':
                    advance(':');
                    switch (nexttoken.value) {
                        case 'active':
                        case 'after':
                        case 'before':
                        case 'checked':
                        case 'disabled':
                        case 'empty':
                        case 'enabled':
                        case 'first-child':
                        case 'first-letter':
                        case 'first-line':
                        case 'first-of-type':
                        case 'focus':
                        case 'hover':
                        case 'last-child':
                        case 'last-of-type':
                        case 'link':
                        case 'only-of-type':
                        case 'root':
                        case 'target':
                        case 'visited':
                            advance();
                            break;
                        case 'lang':
                            advance();
                            advance('(');
                            if (!nexttoken.identifier) {
                                warn(bundle.expected_lang_a);
                            }
                            advance(')');
                            break;
                        case 'nth-child':
                        case 'nth-last-child':
                        case 'nth-last-of-type':
                        case 'nth-of-type':
                            advance();
                            advance('(');
                            style_child();
                            advance(')');
                            break;
                        case 'not':
                            advance();
                            advance('(');
                            if (nexttoken.id === ':' && peek(0).value === 'not') {
                                warn(bundle.not);
                            }
                            style_selector();
                            advance(')');
                            break;
                        default:
                            warn(bundle.expected_pseudo_a);
                    }
                    break;
                case '#':
                    advance('#');
                    if (!nexttoken.identifier) {
                        warn(bundle.expected_id_a);
                    }
                    advance();
                    break;
                case '*':
                    advance('*');
                    break;
                case '.':
                    advance('.');
                    if (!nexttoken.identifier) {
                        warn(bundle.expected_class_a);
                    }
                    advance();
                    break;
                case '[':
                    advance('[');
                    if (!nexttoken.identifier) {
                        warn(bundle.expected_attribute_a);
                    }
                    advance();
                    if (nexttoken.id === '=' || nexttoken.value === '~=' ||
                            nexttoken.value === '$=' ||
                            nexttoken.value === '|=' ||
                            nexttoken.id === '*=' ||
                            nexttoken.id === '^=') {
                        advance();
                        if (nexttoken.arity !== 'string') {
                            warn(bundle.expected_string_a);
                        }
                        advance();
                    }
                    advance(']');
                    break;
                default:
                    fail(bundle.expected_selector_a);
            }
        }
    }

    function style_pattern() {
        if (nexttoken.id === '{') {
            warn(bundle.expected_style_pattern);
        }
        for (; ;) {
            style_selector();
            if (nexttoken.id === '</' || nexttoken.id === '{' ||
                    nexttoken.id === '(end)') {
                return '';
            }
            if (nexttoken.id === ',') {
                comma();
            }
        }
    }

    function style_list() {
        while (nexttoken.id !== '</' && nexttoken.id !== '(end)') {
            style_pattern();
            xmode = 'styleproperty';
            if (nexttoken.id === ';') {
                semicolon();
            } else {
                advance('{');
                substyle();
                xmode = 'style';
                advance('}');
            }
        }
    }

    function styles() {
        var i;
        while (nexttoken.id === '@') {
            i = peek();
            advance('@');
            if (nexttoken.identifier) {
                switch (nexttoken.value) {
                    case 'import':
                        advance();
                        if (!css_url()) {
                            warn(bundle.expected_a_b,
                                nexttoken, 'url', nexttoken.value);
                            advance();
                        }
                        semicolon();
                        break;
                    case 'media':
                        advance();
                        for (; ;) {
                            if (!nexttoken.identifier || css_media[nexttoken.value] === true) {
                                fail(bundle.expected_media_a);
                            }
                            advance();
                            if (nexttoken.id !== ',') {
                                break;
                            }
                            comma();
                        }
                        advance('{');
                        style_list();
                        advance('}');
                        break;
                    default:
                        warn(bundle.expected_at_a);
                }
            } else {
                warn(bundle.expected_at_a);
            }
        }
        style_list();
    }


    // Parse HTML

    function do_begin(n) {
        if (n !== 'html' && !option.fragment) {
            if (n === 'div' && option.adsafe) {
                fail(bundle.adsafe_fragment);
            } else {
                fail(bundle.expected_a_b, token, 'html', n);
            }
        }
        if (option.adsafe) {
            if (n === 'html') {
                fail(bundle.adsafe_html, token);
            }
            if (option.fragment) {
                if (n !== 'div') {
                    fail(bundle.adsafe_div, token);
                }
            } else {
                fail(bundle.adsafe_fragment, token);
            }
        }
        option.browser = true;
        assume();
    }

    function do_attribute(n, a, v) {
        var u, x;
        if (a === 'id') {
            u = typeof v === 'string' ? v.toUpperCase() : '';
            if (ids[u] === true) {
                warn(bundle.duplicate_a, nexttoken, v);
            }
            if (!/^[A-Za-z][A-Za-z0-9._:\-]*$/.test(v)) {
                warn(bundle.bad_id_a, nexttoken, v);
            } else if (option.adsafe) {
                if (adsafe_id) {
                    if (v.slice(0, adsafe_id.length) !== adsafe_id) {
                        warn(bundle.adsafe_prefix_a, nexttoken, adsafe_id);
                    } else if (!/^[A-Z]+_[A-Z]+$/.test(v)) {
                        warn(bundle.adsafe_bad_id);
                    }
                } else {
                    adsafe_id = v;
                    if (!/^[A-Z]+_$/.test(v)) {
                        warn(bundle.adsafe_bad_id);
                    }
                }
            }
            x = v.search(dx);
            if (x >= 0) {
                warn(bundle.unexpected_char_a_b, token, v.charAt(x), a);
            }
            ids[u] = true;
        } else if (a === 'class' || a === 'type' || a === 'name') {
            x = v.search(qx);
            if (x >= 0) {
                warn(bundle.unexpected_char_a_b, token, v.charAt(x), a);
            }
            ids[u] = true;
        } else if (a === 'href' || a === 'background' ||
                a === 'content' || a === 'data' ||
                a.indexOf('src') >= 0 || a.indexOf('url') >= 0) {
            if (option.safe && ux.test(v)) {
                fail(bundle.bad_url, nexttoken, v);
            }
            urls.push(v);
        } else if (a === 'for') {
            if (option.adsafe) {
                if (adsafe_id) {
                    if (v.slice(0, adsafe_id.length) !== adsafe_id) {
                        warn(bundle.adsafe_prefix_a, nexttoken, adsafe_id);
                    } else if (!/^[A-Z]+_[A-Z]+$/.test(v)) {
                        warn(bundle.adsafe_bad_id);
                    }
                } else {
                    warn(bundle.adsafe_bad_id);
                }
            }
        } else if (a === 'name') {
            if (option.adsafe && v.indexOf('_') >= 0) {
                warn(bundle.adsafe_name_a, nexttoken, v);
            }
        }
    }

    function do_tag(n, a) {
        var i, t = html_tag[n], script, x;
        src = false;
        if (!t) {
            fail(
                bundle.unrecognized_tag_a,
                nexttoken,
                n === n.toLowerCase() ? n : n + ' (capitalization error)'
            );
        }
        if (stack.length > 0) {
            if (n === 'html') {
                fail(bundle.unexpected_a, token, n);
            }
            x = t.parent;
            if (x) {
                if (x.indexOf(' ' + stack[stack.length - 1].name + ' ') < 0) {
                    fail(bundle.tag_a_in_b, token, n, x);
                }
            } else if (!option.adsafe && !option.fragment) {
                i = stack.length;
                do {
                    if (i <= 0) {
                        fail(bundle.tag_a_in_b, token, n, 'body');
                    }
                    i -= 1;
                } while (stack[i].name !== 'body');
            }
        }
        switch (n) {
            case 'div':
                if (option.adsafe && stack.length === 1 && !adsafe_id) {
                    warn(bundle.adsafe_missing_id);
                }
                break;
            case 'script':
                xmode = 'script';
                advance('>');
                if (a.lang) {
                    warn(bundle.lang, token);
                }
                if (option.adsafe && stack.length !== 1) {
                    warn(bundle.adsafe_placement, token);
                }
                if (a.src) {
                    if (option.adsafe && (!adsafe_may || !approved[a.src])) {
                        warn(bundle.adsafe_source, token);
                    }
                    if (a.type) {
                        warn(bundle.type, token);
                    }
                } else {
                    step_in(nexttoken.from);
                    edge();
                    use_strict();
                    adsafe_top = true;
                    script = statements();

                    // JSLint is also the static analyzer for ADsafe. See www.ADsafe.org.

                    if (option.adsafe) {
                        if (adsafe_went) {
                            fail(bundle.adsafe_script, token);
                        }
                        if (script.length !== 1 ||
                                aint(script[0], 'id', '(') ||
                                aint(script[0].first, 'id', '.') ||
                                aint(script[0].first.first, 'value', 'ADSAFE') ||
                                aint(script[0].second[0], 'value', adsafe_id)) {
                            fail(bundle.adsafe_id_go);
                        }
                        switch (script[0].first.second.value) {
                            case 'id':
                                if (adsafe_may || script[0].second.length !== 1) {
                                    fail(bundle.adsafe_id, nexttoken);
                                }
                                adsafe_may = true;
                                break;
                            case 'go':
                                if (!adsafe_may) {
                                    fail(bundle.adsafe_id);
                                }
                                if (script[0].second.length !== 2 ||
                                        aint(script[0].second[1], 'id', 'function') ||
                                        script[0].second[1].first.length !== 2 ||
                                        aint(script[0].second[1].first[0], 'value', 'dom') ||
                                        aint(script[0].second[1].first[1], 'value', 'lib')) {
                                    fail(bundle.adsafe_go, nexttoken);
                                }
                                adsafe_went = true;
                                break;
                            default:
                                fail(bundle.adsafe_id_go);
                        }
                    }
                    indent = null;
                }
                xmode = 'html';
                advance('</');
                if (!nexttoken.identifier && nexttoken.value !== 'script') {
                    warn(bundle.expected_a_b, nexttoken, 'script', nexttoken.value);
                }
                advance();
                xmode = 'outer';
                break;
            case 'style':
                xmode = 'style';
                advance('>');
                styles();
                xmode = 'html';
                advance('</');
                if (!nexttoken.identifier && nexttoken.value !== 'style') {
                    warn(bundle.expected_a_b, nexttoken, 'style', nexttoken.value);
                }
                advance();
                xmode = 'outer';
                break;
            case 'input':
                switch (a.type) {
                    case 'radio':
                    case 'checkbox':
                    case 'button':
                    case 'reset':
                    case 'submit':
                        break;
                    case 'text':
                    case 'file':
                    case 'password':
                    case 'file':
                    case 'hidden':
                    case 'image':
                        if (option.adsafe && a.autocomplete !== 'off') {
                            warn(bundle.adsafe_autocomplete);
                        }
                        break;
                    default:
                        warn(bundle.bad_type);
                }
                break;
            case 'applet':
            case 'body':
            case 'embed':
            case 'frame':
            case 'frameset':
            case 'head':
            case 'iframe':
            case 'noembed':
            case 'noframes':
            case 'object':
            case 'param':
                if (option.adsafe) {
                    warn(bundle.adsafe_tag, nexttoken, n);
                }
                break;
        }
    }


    function closetag(n) {
        return '</' + n + '>';
    }

    function html() {
        var a, attributes, e, n, q, t, v, w = option.white, wmode;
        xmode = 'html';
        xquote = '';
        stack = null;
        for (; ;) {
            switch (nexttoken.value) {
                case '<':
                    xmode = 'html';
                    advance('<');
                    attributes = {};
                    t = nexttoken;
                    if (!t.identifier) {
                        warn(bundle.bad_name_a, t);
                    }
                    n = t.value;
                    if (option.cap) {
                        n = n.toLowerCase();
                    }
                    t.name = n;
                    advance();
                    if (!stack) {
                        stack = [];
                        do_begin(n);
                    }
                    v = html_tag[n];
                    if (typeof v !== 'object') {
                        fail(bundle.unrecognized_tag_a, t, n);
                    }
                    e = v.empty;
                    t.type = n;
                    for (; ;) {
                        if (nexttoken.id === '/') {
                            advance('/');
                            if (nexttoken.id !== '>') {
                                warn(bundle.expected_a_b, nexttoken, '>', nexttoken.value);
                            }
                            break;
                        }
                        if (nexttoken.id && nexttoken.id.substr(0, 1) === '>') {
                            break;
                        }
                        if (!nexttoken.identifier) {
                            if (nexttoken.id === '(end)' || nexttoken.id === '(error)') {
                                warn(bundle.expected_a_b, nexttoken, '>', nexttoken.value);
                            }
                            warn(bundle.bad_name_a);
                        }
                        option.white = true;
                        spaces();
                        a = nexttoken.value;
                        option.white = w;
                        advance();
                        if (!option.cap && a !== a.toLowerCase()) {
                            warn(bundle.attribute_case_a, token);
                        }
                        a = a.toLowerCase();
                        xquote = '';
                        if (Object.prototype.hasOwnProperty.call(attributes, a)) {
                            warn(bundle.duplicate_a, token, a);
                        }
                        if (a.slice(0, 2) === 'on') {
                            if (!option.on) {
                                warn(bundle.html_handlers);
                            }
                            xmode = 'scriptstring';
                            advance('=');
                            q = nexttoken.id;
                            if (q !== '"' && q !== '\'') {
                                fail(bundle.expected_a_b, nexttoken, '"', nexttoken.value);
                            }
                            xquote = q;
                            wmode = option.white;
                            option.white = false;
                            advance(q);
                            use_strict();
                            statements();
                            option.white = wmode;
                            if (nexttoken.id !== q) {
                                fail(bundle.expected_a_b, nexttoken, q, nexttoken.value);
                            }
                            xmode = 'html';
                            xquote = '';
                            advance(q);
                            v = false;
                        } else if (a === 'style') {
                            xmode = 'scriptstring';
                            advance('=');
                            q = nexttoken.id;
                            if (q !== '"' && q !== '\'') {
                                fail(bundle.expected_a_b, nexttoken, '"', nexttoken.value);
                            }
                            xmode = 'styleproperty';
                            xquote = q;
                            advance(q);
                            substyle();
                            xmode = 'html';
                            xquote = '';
                            advance(q);
                            v = false;
                        } else {
                            if (nexttoken.id === '=') {
                                advance('=');
                                v = nexttoken.value;
                                if (!nexttoken.identifier &&
                                        nexttoken.id !== '"' &&
                                        nexttoken.id !== '\'' &&
                                        nexttoken.arity !== 'string' &&
                                        nexttoken.arity !== 'number' &&
                                        nexttoken.id !== '(color)') {
                                    warn(bundle.expected_attribute_value_a, token, a);
                                }
                                advance();
                            } else {
                                v = true;
                            }
                        }
                        attributes[a] = v;
                        do_attribute(n, a, v);
                    }
                    do_tag(n, attributes);
                    if (!e) {
                        stack.push(t);
                    }
                    xmode = 'outer';
                    advance('>');
                    break;
                case '</':
                    xmode = 'html';
                    advance('</');
                    if (!nexttoken.identifier) {
                        warn(bundle.bad_name_a);
                    }
                    n = nexttoken.value;
                    if (option.cap) {
                        n = n.toLowerCase();
                    }
                    advance();
                    if (!stack) {
                        fail(bundle.unexpected_a, nexttoken, closetag(n));
                    }
                    t = stack.pop();
                    if (!t) {
                        fail(bundle.unexpected_a, nexttoken, closetag(n));
                    }
                    if (t.name !== n) {
                        fail(bundle.expected_a_b,
                            nexttoken, closetag(t.name), closetag(n));
                    }
                    if (nexttoken.id !== '>') {
                        fail(bundle.expected_a_b, nexttoken, '>', nexttoken.value);
                    }
                    xmode = 'outer';
                    advance('>');
                    break;
                case '<!':
                    if (option.safe) {
                        warn(bundle.adsafe_a);
                    }
                    xmode = 'html';
                    for (; ;) {
                        advance();
                        if (nexttoken.id === '>' || nexttoken.id === '(end)') {
                            break;
                        }
                        if (nexttoken.value.indexOf('--') >= 0) {
                            fail(bundle.unexpected_a, nexttoken, '--');
                        }
                        if (nexttoken.value.indexOf('<') >= 0) {
                            fail(bundle.unexpected_a, nexttoken, '<');
                        }
                        if (nexttoken.value.indexOf('>') >= 0) {
                            fail(bundle.unexpected_a, nexttoken, '>');
                        }
                    }
                    xmode = 'outer';
                    advance('>');
                    break;
                case '(end)':
                    return;
                default:
                    if (nexttoken.id === '(end)') {
                        fail(bundle.missing_a, nexttoken,
                            '</' + stack[stack.length - 1].value + '>');
                    } else {
                        advance();
                    }
            }
            if (stack && stack.length === 0 && (option.adsafe ||
                    !option.fragment || nexttoken.id === '(end)')) {
                break;
            }
        }
        if (nexttoken.id !== '(end)') {
            fail(bundle.unexpected_a);
        }
    }


    // The actual JSLINT function itself.

    var itself = function (the_source, the_option) {
        var i, keys, predef;
        JSLINT.errors = [];
        JSLINT.tree = '';
        predefined = Object.create(standard);
        if (the_option) {
            option = Object.create(the_option);
            predef = option.predef;
            if (predef) {
                if (Array.isArray(predef)) {
                    for (i = 0; i < predef.length; i += 1) {
                        predefined[predef[i]] = true;
                    }
                } else if (typeof predef === 'object') {
                    keys = Object.keys(predef);
                    for (i = 0; i < keys.length; i += 1) {
                        predefined[keys[i]] = !!predef[keys];
                    }
                }
            }
            if (option.adsafe) {
                option.safe = true;
            }
            if (option.safe) {
                option.browser =
                    option['continue'] =
                    option.css =
                    option.debug =
                    option.devel =
                    option.evil =
                    option.forin =
                    option.on =
                    option.rhino =
                    option.sub =
                    option.widget =
                    option.windows = false;

                option.nomen =
                    option.strict =
                    option.undef = true;

                predefined.Date =
                    predefined['eval'] =
                    predefined.Function =
                    predefined.Object = null;

                predefined.ADSAFE =
                    predefined.lib = false;
            }
        } else {
            option = {};
        }
        option.indent = +option.indent || 0;
        option.maxerr = option.maxerr || 50;
        adsafe_id = '';
        adsafe_may = adsafe_top = adsafe_went = false;
        approved = {};
        if (option.approved) {
            for (i = 0; i < option.approved.length; i += 1) {
                approved[option.approved[i]] = option.approved[i];
            }
        } else {
            approved.test = 'test';
        }
        tab = '';
        for (i = 0; i < option.indent; i += 1) {
            tab += ' ';
        }
        global = Object.create(predefined);
        scope = global;
        funct = {
            '(global)': true,
            '(name)': '(global)',
            '(scope)': scope,
            '(breakage)': 0,
            '(loopage)': 0
        };
        functions = [funct];

        comments_off = false;
        ids = {};
        implied = {};
        in_block = false;
        indent = false;
        json_mode = false;
        lookahead = [];
        member = {};
        members_only = null;
        prereg = true;
        src = false;
        stack = null;
        strict_mode = false;
        urls = [];
        var_mode = false;
        warnings = 0;
        xmode = false;
        lex.init(the_source);

        prevtoken = token = nexttoken = syntax['(begin)'];
        assume();

        try {
            advance();
            if (nexttoken.arity === 'number') {
                fail(bundle.unexpected_a);
            } else if (nexttoken.value.charAt(0) === '<') {
                html();
                if (option.adsafe && !adsafe_went) {
                    warn(bundle.adsafe_go, this);
                }
            } else {
                switch (nexttoken.id) {
                    case '{':
                    case '[':
                        json_mode = true;
                        json_value();
                        break;
                    case '@':
                    case '*':
                    case '#':
                    case '.':
                    case ':':
                        xmode = 'style';
                        advance();
                        if (token.id !== '@' || !nexttoken.identifier ||
                                nexttoken.value !== 'charset' || token.line !== 1 ||
                                token.from !== 1) {
                            fail(bundle.css);
                        }
                        advance();
                        if (nexttoken.arity !== 'string' &&
                                nexttoken.value !== 'UTF-8') {
                            fail(bundle.css);
                        }
                        advance();
                        semicolon();
                        styles();
                        break;

                    default:
                        if (option.adsafe && option.fragment) {
                            fail(bundle.expected_a_b,
                                nexttoken, '<div>', nexttoken.value);
                        }

                        // If the first token is predef semicolon, ignore it. This is sometimes used when
                        // files are intended to be appended to files that may be sloppy. predef sloppy
                        // file may be depending on semicolon insertion on its last line.

                        step_in(1);
                        if (nexttoken.id === ';') {
                            semicolon();
                        }
                        if (nexttoken.value === 'use strict') {
                            warn(bundle.function_strict);
                            use_strict();
                        }
                        adsafe_top = true;
                        JSLINT.tree = statements();
                        if (option.adsafe && (JSLINT.tree.length !== 1 ||
                                aint(JSLINT.tree[0], 'id', '(') ||
                                aint(JSLINT.tree[0].first, 'id', '.') ||
                                aint(JSLINT.tree[0].first.first, 'value', 'ADSAFE') ||
                                aint(JSLINT.tree[0].first.second, 'value', 'lib') ||
                                JSLINT.tree[0].second.length !== 2 ||
                                JSLINT.tree[0].second[0].arity !== 'string' ||
                                aint(JSLINT.tree[0].second[1], 'id', 'function'))) {
                            fail(bundle.adsafe_lib);
                        }
                        if (JSLINT.tree.disrupt) {
                            warn(bundle.weird_program, prevtoken);
                        }
                }
            }
            indent = null;
            advance('(end)');
        } catch (e) {
            if (e) {        // `~
                JSLINT.errors.push({
                    reason: e.message,
                    line: e.line || nexttoken.line,
                    character: e.character || nexttoken.from
                }, null);
            }
        }
        return JSLINT.errors.length === 0;
    };


    // Data summary.

    itself.data = function () {
        var data = { functions: [] },
            function_data,
            globals,
            i,
            implieds = [],
            j,
            members = [],
            name,
            the_function,
            unused = [],
            variable;
        if (itself.errors.length) {
            data.errors = itself.errors;
        }

        if (json_mode) {
            data.json = true;
        }

        for (name in implied) {
            if (Object.prototype.hasOwnProperty.call(implied, name)) {
                implieds.push({
                    name: name,
                    line: implied[name]
                });
            }
        }
        if (implieds.length > 0) {
            data.implieds = implieds;
        }

        if (urls.length > 0) {
            data.urls = urls;
        }

        globals = Object.keys(scope);
        if (globals.length > 0) {
            data.globals = globals;
        }

        for (i = 1; i < functions.length; i += 1) {
            the_function = functions[i];
            function_data = {};
            for (j = 0; j < functionicity.length; j += 1) {
                function_data[functionicity[j]] = [];
            }
            for (name in the_function) {
                if (Object.prototype.hasOwnProperty.call(the_function, name)) {
                    if (name.charAt(0) !== '(') {
                        variable = the_function[name];
                        if (variable === 'unction') {
                            variable = 'unused';
                        }
                        if (Array.isArray(function_data[variable])) {
                            function_data[variable].push(name);
                            if (variable === 'unused') {
                                unused.push({
                                    name: name,
                                    line: the_function['(line)'],
                                    'function': the_function['(name)']
                                });
                            }
                        }
                    }
                }
            }
            for (j = 0; j < functionicity.length; j += 1) {
                if (function_data[functionicity[j]].length === 0) {
                    delete function_data[functionicity[j]];
                }
            }
            function_data.name = the_function['(name)'];
            function_data.param = the_function['(params)'];
            function_data.line = the_function['(line)'];
            data.functions.push(function_data);
        }

        if (unused.length > 0) {
            data.unused = unused;
        }

        members = [];
        for (name in member) {
            if (typeof member[name] === 'number') {
                data.member = member;
                break;
            }
        }

        return data;
    };

    itself.report = function (errors_only) {
        var data = itself.data();

        var err, evidence, i, j, key, keys, length, mem = '', name, names,
            output = [], snippets, the_function, warning;

        function detail(h, array) {
            var comma_needed, i, singularity;
            if (array) {
                output.push('<div><i>' + h + '</i> ');
                array = array.sort();
                for (i = 0; i < array.length; i += 1) {
                    if (array[i] !== singularity) {
                        singularity = array[i];
                        output.push((comma_needed ? ', ' : '') + singularity);
                        comma_needed = true;
                    }
                }
                output.push('</div>');
            }
        }

        if (data.errors || data.implieds || data.unused) {
            err = true;
            output.push('<div id=errors><i>Error:</i>');
            if (data.errors) {
                for (i = 0; i < data.errors.length; i += 1) {
                    warning = data.errors[i];
                    if (warning) {
                        evidence = warning.evidence || '';
                        output.push('<p>Problem' + (isFinite(warning.line) ? ' at line ' +
                            warning.line + ' character ' + warning.character : '') +
                            ': ' + warning.reason.entityify() +
                            '</p><p class=evidence>' +
                            (evidence && (evidence.length > 80 ? evidence.slice(0, 77) + '...' :
                            evidence).entityify()) + '</p>');
                    }
                }
            }

            if (data.implieds) {
                snippets = [];
                for (i = 0; i < data.implieds.length; i += 1) {
                    snippets[i] = '<code>' + data.implieds[i].name + '</code>&nbsp;<i>' +
                        data.implieds[i].line + '</i>';
                }
                output.push('<p><i>Implied global:</i> ' + snippets.join(', ') + '</p>');
            }

            if (data.unused) {
                snippets = [];
                for (i = 0; i < data.unused.length; i += 1) {
                    snippets[i] = '<code><u>' + data.unused[i].name + '</u></code>&nbsp;<i>' +
                        data.unused[i].line + ' </i> <small>' +
                        data.unused[i]['function'] + '</small>';
                }
                output.push('<p><i>Unused variable:</i> ' + snippets.join(', ') + '</p>');
            }
            if (data.json) {
                output.push('<p>JSON: bad.</p>');
            }
            output.push('</div>');
        }

        if (!errors_only) {

            output.push('<br><div id=functions>');

            if (data.urls) {
                detail("URLs<br>", data.urls, '<br>');
            }

            if (xmode === 'style') {
                output.push('<p>CSS.</p>');
            } else if (data.json && !err) {
                output.push('<p>JSON: good.</p>');
            } else if (data.globals) {
                output.push('<div><i>Global</i> ' +
                    data.globals.sort().join(', ') + '</div>');
            } else {
                output.push('<div><i>No new global variables introduced.</i></div>');
            }

            for (i = 0; i < data.functions.length; i += 1) {
                the_function = data.functions[i];
                names = [];
                if (the_function.param) {
                    for (j = 0; j < the_function.param.length; j += 1) {
                        names[j] = the_function.param[j].value;
                    }
                }
                output.push('<br><div class=function><i>' + the_function.line + '</i> ' +
                    (the_function.name || '') + '(' + names.join(', ') + ')</div>');
                detail('<big><b>Unused</b></big>', the_function.unused);
                detail('Closure', the_function.closure);
                detail('Variable', the_function['var']);
                detail('Exception', the_function.exception);
                detail('Outer', the_function.outer);
                detail('Global', the_function.global);
                detail('Label', the_function.label);
            }

            if (data.member) {
                keys = Object.keys(data.member);
                if (keys.length) {
                    keys = keys.sort();
                    mem = '<br><pre id=members>/*members ';
                    length = 10;
                    for (i = 0; i < keys.length; i += 1) {
                        key = keys[i];
                        name = key.name();
                        if (length + name.length > 72) {
                            output.push(mem + '<br>');
                            mem = '    ';
                            length = 1;
                        }
                        length += name.length + 2;
                        if (data.member[key] === 1) {
                            name = '<i>' + name + '</i>';
                        }
                        if (i < keys.length - 1) {
                            name += ', ';
                        }
                        mem += name;
                    }
                    output.push(mem + '<br>*/</pre>');
                }
                output.push('</div>');
            }
        }
        return output.join('');
    };
    itself.jslint = itself;

    itself.edition = '2011-02-28';

    return itself;

}());
//https://raw.githubusercontent.com/amb26/JSLint/97ae0eb0605811e4b6b6a348c63d5222d51315d4/fulljslint.js
!function (global, undefined) {
    var define, kmdjs = {};
    var currentAST, exportNamespace;
    var isDebug = false, modules = {}, classList = [], baseUrl = getBaseUrl(), mapping = {}, cBaseUrl, nsmp = {}, dataMain;
    var isBrowser = !!("undefined" !== typeof window && "undefined" !== typeof navigator && window.document);
    var ProjName;
    var kmdmdinfo = [];
    var lazyMdArr = [];
    var isMDBuild = false;
    var allPending = [];
    var isMtClassesBuild = false, readyBuildClasses = [];
    var conflictMapping = {};
    var xmdModules = {};
    function findScope(node) {
        var sp;
        function chain(node) {
            if (node.property) chain(node.expression); else {
                sp = node.scope;
                name = node.name;
            }
        }
        chain(node);
        return {
            sp: sp,
            name: name
        };
    }
    function chainNS(node) {
        var result = [];
        function chain(node) {
            if (node.property) {
                result.unshift(node.property);
                chain(node.expression);
            } else result.unshift(node.name);
        }
        chain(node);
        return result.join("_");
    }
    function splice_string(str, begin, end, replacement) {
        return str.substr(0, begin) + replacement + str.substr(end);
    }
    var beautifier_options_defaults = {
        indent_start: 0,
        indent_level: 4,
        quote_keys: false,
        space_colon: true,
        ascii_only: false,
        inline_script: false,
        width: 80,
        max_line_len: 32e3,
        screw_ie8: false,
        beautify: true,
        bracketize: false,
        comments: false,
        semicolons: false
    };
    var isIE = !!window.ActiveXObject;
    var isIE6 = isIE && !window.XMLHttpRequest;
    function addOneSI(codeStr, index, evidence) {
        var arr = codeStr.split("\n");
        arr[index] = evidence + ";";
        return arr.join("\n");
    }
    function addSi(fn) {
        var codeStr = "var a=" + fn.toString() + ";";
        if (isIE6) {
            JSLINT.jslint(codeStr, {
                maxerr: 1e4
            });
            for (var i = 0, len = JSLINT.errors.length; i < len; i++) {
                var item = JSLINT.errors[i];
                if (item && ";" == item.a) codeStr = addOneSI(codeStr, item.line - 1, item.evidence);
            }
            return codeStr.substring(6, codeStr.length - 1);
        } else {
            var ast = UglifyJS.parse(codeStr);
            var out = ast.print_to_string(beautifier_options_defaults);
            return out.replace("var a = ", "");
        }
    }
    var defined = {};
    define = function (name, deps, foctory) {
        var argc = arguments.length;
        if (1 == argc) throw "the class must take a name"; else if (2 == argc) {
            foctory = deps;
            deps = [];
        } else if (isString(deps)) deps = [deps];
        var mda = name.split(":");
        mda[0] = mda[0].trim();
        if (mda.length > 1) { mda[1] = mda[1].trim() }
        var fullname = mda[0];
        var lastIndex = lastIndexOf(fullname, ".");
        if (lastIndex == -1) {
            fullname = ProjName + "." + fullname;
            lastIndex = lastIndexOf(fullname, ".");
        }
        if (defined[fullname]) return;
        defined[fullname] = true;
        if (mda.length > 1 && lastIndexOf(mda[1], ".") == -1) mda[1] = ProjName + "." + mda[1];
        var baseClass = "__class", parentClass;
        if (1 != mda.length) if (mda[1].split(".")[0] in window && !isInArray(classList, mda[1])) baseClass = mda[1]; else {
            baseClass = mda[1];
            parentClass = mda[1];
        }
        var className = fullname.substring(lastIndex + 1, fullname.length);
        deps.unshift(fullname.substring(0, lastIndex));
        var xmd = [];
        for (var i = 0; i < deps.length; i++) if (xmdModules[deps[i]]) {
            if (!isInArray(xmd, deps[i])) xmd.push(deps[i]);
            deps.splice(i, 1);
            i--;
        }
        if (!isInArray(deps, ProjName)) deps.unshift(ProjName);
        var ldCount = 0, xmdLen = xmd.length;
        if (xmdLen > 0) for (var j = 0; j < xmdLen; j++) !function (ns) {
            allPending.push(ns);
            request(mapping[ns], function () {
                remove(allPending, ns);
                ldCount++;
                if (ldCount == xmdLen) {
                    refrence(className, deps, fullname + "=" + baseClass + ".extend(" + stringifyWithFuncs(foctory) + ");return " + className + ";", fullname);
                    checkMainCpt();
                }
            });
        }(xmd[j]); else refrence(className, deps, fullname + "=" + baseClass + ".extend(" + stringifyWithFuncs(foctory) + ");return " + className + ";", fullname, parentClass);
    };
    var currentPendingModuleFullName = [], compotentMapping = {};
    window.kmdmdinfo = kmdmdinfo;
    function compressor(fn) {
        var ast = UglifyJS.parse(fn.toString());
        ast.figure_out_scope();
        var sq = UglifyJS.Compressor();
        var compressed_ast = ast.transform(sq);
        compressed_ast.compute_char_frequency();
        compressed_ast.mangle_names();
        var code = compressed_ast.print_to_string();
        return code;
    }
    function refrence(className, deps, foctory, fullname, parentClass) {
        conflictMapping = {};
        var body;
        if (isIE6) body = foctory.replace(/"function[\s\S]*?\}"/g, function (str) {
            return str.substr(1, str.length - 2);
        }); else body = foctory.replace(/"function[\s\S]*?\};"/g, function (str) {
            return str.substr(1, str.length - 4) + "}";
        });
        body = body.replace(/(\\r)?\\n(\\t)?([\s]*?)\/\/([\s\S]*?)(?=(\\r)?\\n(\\t)?)/g, "").replace(/(\/\*[\s\S]*?\*\/)/g, "").replace(/\\r\\n/g, "").replace(/\\n/g, function (item, b, c) {
            if ("\\" == c.charAt(b - 1)) return item;
            return "";
        }).replace(/\\t/g, function (item, b, c) {
            if ("\\" == c.charAt(b - 1)) return item;
            return "";
        }).replace(/\\"/g, function (item, b, c) {
            return '"';
        }).replace(/\\'/g, function (item, b, c) {
            return "'";
        }).replace(/\\\\/g, "\\");
        body = js_beautify(body);
        try {
            var fn = new Function(body);
        } catch (ex) {
            log(body);
            throw ex.name + "__" + ex.message + "__" + ex.number + "__" + ex.description;
            return;
        }
        var allFullNameDeps = [];
        if (parentClass) {
            var parentNs = parentClass.substr(0, lastIndexOf(parentClass, "."));
            !isInArray(deps, parentNs) && deps.push(parentNs);
        }
        var refArr = getRef(fn, deps, fullname), ref = refArr[0];
        remove(ref, "__class");
        var newArr = [];
        for (var i = 0, len = deps.length; i < len; i++) for (var k = 0; k < ref.length; k++) isInArray(classList, deps[i] + "." + ref[k]) && !isInArray(newArr, deps[i] + "." + ref[k]) && newArr.push(deps[i] + "." + ref[k]);

        var frArr=refArr[2]
        for (var m = 0, frLen = frArr.length; m < frLen; m++) {
            var fr = frArr[m];
            !isInArray(newArr, fr) && newArr.push(fr);
        }
        if (parentClass && !isInArray(newArr, parentClass)) newArr.push(parentClass);
        if (isMtClassesBuild && "MAIN" == className.toUpperCase()) each(readyBuildClasses, function (item) {
            newArr.push(item);
        });
        var entire = refArr[1];
        body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
        if (isDebug) log(fullname + "  ref:" + ref.toString());
        var moduleNameArr = [];
        for (i = 0; i < newArr.length; i++) {
            var xx = newArr[i].split(".");
            moduleNameArr.push(xx[xx.length - 1]);
        }
        var isPush = false;
        each(kmdmdinfo, function (item) {
            if (item.c == fullname) {
                isPush = true;
                return false;
            }
        });
        for (var ck in conflictMapping) {
            var fname = conflictMapping[ck];
            var fnameReal = fname.replace(/_/g, ".");
            if (isInArray(classList, fnameReal)) {
                moduleNameArr.push(fname);
                newArr.push(fnameReal);
            }
        }
        if (!isPush) kmdmdinfo.push({
            a: moduleNameArr,
            b: body,
            c: fullname,
            d: newArr,
            e: parentClass
        });
        if (0 == newArr.length && !isBuild) checkMainCpt(); else for (var k = 0; k < newArr.length; k++) !function (ns) {
            if (!define.modules[ns]) if (mapping[ns + "_deps"] && !compotentMapping[ns]) loadComponent(mapping[ns + "_deps"], function () {
                compotentMapping[ns] = JSON.stringify(Array.prototype.slice.call(arguments));
                allPending.push(ns);
                if (mapping[ns]) request(mapping[ns], function () {
                    remove(allPending, ns);
                    checkMainCpt();
                }); else throw "no module named :" + ns;
            }); else {
                allPending.push(ns);
                if (mapping[ns]) request(mapping[ns], function () {
                    remove(allPending, ns);
                    checkMainCpt();
                }); else throw "no module named :" + ns;
            }
        }(newArr[k]);
        window.allPending = allPending;
    }
    function loadComponent(arr, callback) {
        var count = 0, len = arr.length, datas = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            var currentUrl = cBaseUrl + "/" + arr[i];
            !function (currentUrl) {
                ajax(currentUrl, function (data) {
                    datas.push(data);
                    if (lastIndexOf(currentUrl, ".css") != -1) {
                        var cssStr = data;
                        var style = doc.createElement("style");
                        style.setAttribute("type", "text/css");
                        if (style.styleSheet) style.styleSheet.cssText = cssStr; else {
                            var cssText = doc.createTextNode(cssStr);
                            style.appendChild(cssText);
                        }
                        head.appendChild(style);
                    }
                    count++;
                    if (count == len) callback.apply(null, datas);
                });
            }(currentUrl);
        }
    }
    function dotChain(node) {
        var result = [], ep = node.end.endpos, bp;
        function chain(node) {
            if (node.property) {
                result.unshift(node.property);
                chain(node.expression);
            } else {
                bp = node.end.pos;
                result.unshift(node.name);
            }
        }
        chain(node);
        return {
            ns: result.join("."),
            bp: bp,
            ep: ep
        };
    }
    function getTopName(node) {
        var cNode;
        function chain(node) {
            if (node.property) chain(node.expression); else cNode = node;
        }
        chain(node);
        return {
            name: cNode.name,
            scope: cNode.scope
        };
    }
    function getNSRef(fn) {
        var U2 = UglifyJS;
        var ast = U2.parse(fn.toString());
        ast.figure_out_scope();
        var allNS = [];
        ast.walk(new U2.TreeWalker(function (node) {
            if (node instanceof U2.AST_Dot) {
                var cc = getTopName(node);
                var ex = node.expression, name = cc.name, scope = cc.scope;
                if (name && "this" != name && !(name in window) && !isInScopeChainVariables(scope, name)) allNS.push(dotChain(node));
            }
        }));
        var len = allNS.length;
        var result = {};
        for (var i = 0; i < len; i++) {
            var item = allNS[i];
            if (!result[item.bp]) result[item.bp] = item; else if (result[item.bp] == item.bp && item.ep > result[item.bp].ep) result[item.bp] = item;
        }
        return result;
    }
    define.pendingCallback = [];
    kmdjs.get = function (fullname, callback) {
        if (isString(fullname)) fullname = [fullname];
        for (var i = 0, len = fullname.length; i < len; i++) if (lastIndexOf(fullname[i], ".") == -1) {
            fullname[i] = ProjName + "." + fullname[i];
            currentPendingModuleFullName.push(fullname[i]);
        }
        var loaded = true;
        var mdArr = [];
        for (var i = 0, len = fullname.length; i < len; i++) if (modules[fullname[i]]) mdArr.push(modules[fullname[i]]); else loaded = false;
        if (loaded) {
            if (callback) callback.apply(null, mdArr);
        } else for (var i = 0, len = fullname.length; i < len; i++) if (!modules[fullname[i]]) {
            var ns = fullname[i];
            allPending.push(ns);
            !function (ns) {
                if (mapping[ns]) request(mapping[ns], function () {
                    if (callback) define.pendingCallback.push(callback);
                    remove(allPending, ns);
                    checkMainCpt();
                }); else throw "no module named :" + ns;
            }(ns);
        }
    };
    var kmdmaincpt = false;
    function downloadFile(code, fileName) {
        if (window.URL.createObjectURL) {
            var fileParts = [code];
            var bb = new Blob(fileParts, {
                type: "text/plain"
            });
            var dnlnk = window.URL.createObjectURL(bb);
            var dlLink = document.createElement("a");
            dlLink.setAttribute("href", dnlnk);
            dlLink.setAttribute("download", fileName);
            dlLink.click();
        }
    }
    function isInModules(mds,md){
        var result=false;
        each(mds,function(item){
            if(item.c==md.c)result=true;
        })
        return result;
    }
    var storeModule=[];
    function getDepModule(name){

        each(kmdmdinfo,function(item){
            if(item.c==name&&!isInModules(storeModule,item)){
                storeModule.push(item);
                each(item.d,function(depName){
                        getDepModule(depName);
                
                })
            }
        })
    }
    function checkMainCpt() {
        if (allPending.length > 0) return;
        if (kmdmaincpt) return;
        kmdmaincpt = true;
        var buildArr = [];
        if (isMtClassesBuild) each(readyBuildClasses, function (item) {
            getDepModule(item);
            buildArr=storeModule;
        });
        var topNsStr = "";
        each(kmdmdinfo, function (item) {
            var arr = nsToCode(item.c);
            for (var i = 0; i < arr.length; i++) {
                var item2 = arr[i];
                var isInKMD = false;
                for (var k = 0, klen = kmdmdinfo.length; k < klen; k++) if (kmdmdinfo[k].c + "={};" == item2) isInKMD = true;
                if (!isInKMD) lastIndexOf(topNsStr, item2) == -1 && (topNsStr += item2 + "\n");
            }
        });
        if (exportNamespace) {
            topNsStr = "var " + exportNamespace + "={};";

        }
        var evalOrder = [];
        var outPutMd = [];
        function createParentCode(item) {
            if (isInArray(outPutMd, item.c)) return;
            each(kmdmdinfo, function (currentItem) {
                if (currentItem.c == item.e) createParentCode(currentItem);
            });
            outPutMd.push(item.c);
            var temp = "";
            temp += "\n//begin-------------------" + item.c + "---------------------begin\n";
            temp += item.b.substr(0, lastIndexOf(item.b, "return"));
            temp += "\n//end-------------------" + item.c + "---------------------end\n";
            if (exportNamespace) {
                if (item.c.split(".")[0].toUpperCase() == exportNamespace.toUpperCase()) {

                    combineCode += temp;
                }
            } else {
                combineCode += temp;
            }
            evalOrder.push(temp);
        }
        var cpCode = "//create by kmdjs   https://github.com/kmdjs/kmdjs \n";
        var combineCode = ";(function(){\n" + topNsStr;
        kmdmdinfo.sort(function (l, r) {
            return l.c.split(".").length - r.c.split(".").length;
        });
        for (var i = 0; i < kmdmdinfo.length; i++) {
            var item = kmdmdinfo[i];
            if (isInArray(outPutMd, item.c)) continue;
            if (!item.e) {
                outPutMd.push(item.c);
                var temp = "";
                temp += "\n//begin-------------------" + item.c + "---------------------begin\n";
                temp += item.b.substr(0, lastIndexOf(item.b, "return"));
                temp += "\n//end-------------------" + item.c + "---------------------end\n";
                if (exportNamespace) {
                    if (item.c.split(".")[0].toUpperCase() == exportNamespace.toUpperCase()) {

                        combineCode += temp;
                    }
                } else {
                    combineCode += temp;
                }
                evalOrder.push(temp);
            } else createParentCode(item);
        }
        for (var cptKey in compotentMapping) {
            combineCode += "\n" + cptKey + ".baseUrl=\"" + mapping[cptKey+"_baseUrl"]+"\"";
            combineCode += "\n" + cptKey + ".deps=" + compotentMapping[cptKey];
            evalOrder.push( "\n" + cptKey + ".baseUrl=\"" + mapping[cptKey+"_baseUrl"]+"\"");
            evalOrder.push("\n" + cptKey + ".deps=" + compotentMapping[cptKey]);
        }
        if (!exportNamespace) combineCode += "\nnew " + ProjName + ".Main();\n";
        if (exportNamespace) {
            combineCode+=
                 "  if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = "+exportNamespace+" }\n"+
        "else if (typeof define === 'function' && define.amd) { define("+exportNamespace+") }\n"+
        "else { win." + exportNamespace + " = " + exportNamespace + " };"
        }
        cpCode += '(function(win){var initializing=!1,fnTest=/xyz/.test(function(){xyz})?/\\b_super\\b/:/.*/,__class=function(){};__class.extend=function(n){function i(){!initializing&&this.ctor&&this.ctor.apply(this,arguments)}var f=this.prototype,u,r,t;initializing=!0,u=new this,initializing=!1;for(t in n)t!="statics"&&(u[t]=typeof n[t]=="function"&&typeof f[t]=="function"&&fnTest.test(n[t])?function(n,t){return function(){var r=this._super,i;return this._super=f[n],i=t.apply(this,arguments),this._super=r,i}}(t,n[t]):n[t]);for(r in this)this.hasOwnProperty(r)&&r!="extend"&&(i[r]=this[r]);if(i.prototype=u,n.statics)for(t in n.statics)n.statics.hasOwnProperty(t)&&(i[t]=n.statics[t],t=="ctor"&&i[t]());return i.prototype.constructor=i,i.extend=arguments.callee,i.implement=function(n){for(var t in n)u[t]=n[t]},i};\n\n' + combineCode + "})();})(Function('return this')())";
        if (isBuild || isCombine) {
            var ctt = doc.createElement("div");
            var msgDiv = doc.createElement("div");
            var titleDiv = doc.createElement("div");
            titleDiv.innerHTML = "Build Complete!";
            msgDiv.innerHTML = isMtClassesBuild ? readyBuildClasses.join("<br/>") : ProjName + ".js ";
            if (exportNamespace) {
                msgDiv.innerHTML = exportNamespace.toLowerCase() + ".js ";

            }
            var codePanel = doc.createElement("textarea");
            ctt.appendChild(titleDiv);
            ctt.appendChild(codePanel);
            ctt.appendChild(msgDiv);
            doc.body.appendChild(ctt);
            codePanel.setAttribute("rows", "8");
            codePanel.setAttribute("cols", "55");
            if (isMtClassesBuild) {
                cpCode = "kmdjs.exec([\n";
                each(buildArr, function (item, index) {
                    cpCode += "{\n";
                    cpCode += "a:" + JSON.stringify(item.a) + ",\n";
                    cpCode += "b:function(){" + item.b.toString() + "\n},\n";
                    cpCode += "c:" + JSON.stringify(item.c) + ",\n";
                    cpCode += "d:" + JSON.stringify(item.d);
                    if (item.e) cpCode += ",\ne:" + JSON.stringify(item.e) + "\n"; else cpCode += "\n";
                    cpCode += "}" + (0 == index ? "" : ",") + "\n";
                });
                cpCode += "])";
            } else cpCode = isCombine ? cpCode : compressor(cpCode);
            codePanel.value = cpCode;
            codePanel.focus();
            codePanel.select();
            if (exportNamespace) {
                downloadFile(cpCode, exportNamespace.toLowerCase()+ ".js");
            } else {
                downloadFile(cpCode, ProjName + ".Main.js");
            }
           
            var lmclone = [];
            each(lazyMdArr, function (item) {
                lmclone.push(item);
            });
        }
        if (isDebug) log(cpCode);
        if (!isBuild && !isCombine && !isView && !isSplit) {
            eval('(function(n){var t=!1,r=/xyz/.test(function(){xyz})?/\\b_super\\b/:/.*/,i=function(){};i.extend=function(n){function u(){!t&&this.ctor&&this.ctor.apply(this,arguments)}var o=this.prototype,e,f,i;t=!0,e=new this,t=!1;for(i in n)i!="statics"&&(e[i]=typeof n[i]=="function"&&typeof o[i]=="function"&&r.test(n[i])?function(n,t){return function(){var r=this._super,i;return this._super=o[n],i=t.apply(this,arguments),this._super=r,i}}(i,n[i]):n[i]);for(f in this)this.hasOwnProperty(f)&&f!="extend"&&(u[f]=this[f]);if(u.prototype=e,n.statics)for(i in n.statics)n.statics.hasOwnProperty(i)&&(u[i]=n.statics[i],i=="ctor"&&u[i]());return u.prototype.constructor=u,u.extend=arguments.callee,u.implement=function(n){for(var t in n)e[t]=n[t]},u},n.__class=i})(this)');
            eval(topNsStr);
            for (var i = 0; i < evalOrder.length; i++) eval(evalOrder[i]);
            eval("new " + ProjName + ".Main();");
        }
        if (isSplit) {
            var baseCode = '(function(n){var t=!1,r=/xyz/.test(function(){xyz})?/\\b_super\\b/:/.*/,i=function(){};i.extend=function(n){function u(){!t&&this.ctor&&this.ctor.apply(this,arguments)}var o=this.prototype,e,f,i;t=!0,e=new this,t=!1;for(i in n)i!="statics"&&(e[i]=typeof n[i]=="function"&&typeof o[i]=="function"&&r.test(n[i])?function(n,t){return function(){var r=this._super,i;return this._super=o[n],i=t.apply(this,arguments),this._super=r,i}}(i,n[i]):n[i]);for(f in this)this.hasOwnProperty(f)&&f!="extend"&&(u[f]=this[f]);if(u.prototype=e,n.statics)for(i in n.statics)n.statics.hasOwnProperty(i)&&(u[i]=n.statics[i],i=="ctor"&&u[i]());return u.prototype.constructor=u,u.extend=arguments.callee,u.implement=function(n){for(var t in n)e[t]=n[t]},u},n.__class=i})(this)';
            renderToTextarea(baseCode, "Base.js");
            downloadFile(baseCode, "Base.js");
            renderToTextarea(topNsStr, "Namespace.js");
            downloadFile(topNsStr, "Namespace.js");
            for (var i = 0; i < evalOrder.length; i++) {
                renderToTextarea(evalOrder[i], evalOrder[i].match(/-------------------[\s\S]*?---------------------/)[0].replace(/[-]*/g, "") + ".js");
                downloadFile(evalOrder[i], evalOrder[i].match(/-------------------[\s\S]*?---------------------/)[0].replace(/[-]*/g, "") + ".js");
            }
            renderToTextarea("new " + ProjName + ".Main();", ProjName + ".Main.js");
            downloadFile("new " + ProjName + ".Main();", ProjName + ".Main.js");
        }
        if (isView) {
            var vp = getViewport();
            var center = document.createElement("center");
            var mainCanvas = document.createElement("canvas");
            mainCanvas.width = vp[2] - 300;
            mainCanvas.height = vp[3] - 20;
            var signCanvas = document.createElement("canvas");
            signCanvas.width = 200;
            signCanvas.height = 20;
            var lable = document.createElement("div");
            center.appendChild(mainCanvas);
            center.appendChild(signCanvas);
            center.appendChild(lable);
            document.body.style.cssText = "margin: 0px; height: 100%;width: 100%;display: table;overflow:hidden;";
            center.style.cssText = " display: table-cell; vertical-align: middle;";
            signCanvas.style.cssText = "  position: absolute;bottom: 10px;right: 10px;";
            lable.style.cssText = " position: absolute;bottom: 10px; left: 10px; font: 12pt Lucida Sans Typewriter, Monospace;";
            var data = [];
            each(kmdmdinfo, function (item) {
                if (isInArray(item.d, item.c)) remove(item.d, item.c);
                data.push({
                    name: item.c,
                    deps: item.d
                });
            });
            document.body.appendChild(center);
            new DependencyTreeControl(data, mainCanvas, signCanvas, lable).init();
        }
    }
    function renderToTextarea(code, fileName) {
        var ctt = doc.createElement("div");
        var msgDiv = doc.createElement("div");
        msgDiv.innerHTML = fileName;
        var codePanel = doc.createElement("textarea");
        ctt.appendChild(codePanel);
        ctt.appendChild(msgDiv);
        doc.body.appendChild(ctt);
        codePanel.setAttribute("rows", "8");
        codePanel.setAttribute("cols", "55");
        codePanel.value = code;
    }
    function getViewport() {
        var d = document.documentElement, b = document.body, w = window, div = document.createElement("div");
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        var lt = !(3 === div.firstChild.nodeType) ? {
            left: b.scrollLeft || d.scrollLeft,
            top: b.scrollTop || d.scrollTop
        } : {
            left: w.pageXOffset,
            top: w.pageYOffset
        };
        var wh = w.innerWidth ? {
            width: w.innerWidth,
            height: w.innerHeight
        } : d && d.clientWidth && 0 != d.clientWidth ? {
            width: d.clientWidth,
            height: d.clientHeight
        } : {
            width: b.clientWidth,
            height: b.clientHeight
        };
        return [lt.left, lt.top, wh.width, wh.height];
    }
    function nsToCode(ns) {
        var result = [];
        var nsSplitArr = ns.split(".");
        result.push("var " + nsSplitArr[0] + "={};");
        for (var i = 1; i < nsSplitArr.length - 1; i++) {
            var str = nsSplitArr[0];
            for (var j = 1; j < i + 1; j++) str += "." + nsSplitArr[j];
            result.push(str + "={};");
        }
        return result;
    }
    function stringifyWithFuncs(obj) {
        Object.prototype.toJSON = function () {
            var sobj = {}, i;
            for (i in this) if (this.hasOwnProperty(i)) if ("function" == typeof this[i]) sobj[i] = addSi(this[i]); else sobj[i] = this[i];
            return sobj;
        };
        var str = JSON.stringify(obj);
        delete Object.prototype.toJSON;
        return str;
    }
    function isInScopeChainVariables(scope, name) {
        if (scope) {
            var vars = scope.variables._values;
            if (Object.prototype.hasOwnProperty.call(vars, "$" + name)) return true;
            if (scope.parent_scope) return isInScopeChainVariables(scope.parent_scope, name);
        }
        return false;
    }
    function isResultNodeInArray(arr, item) {
        for (var i = 0; i < arr.length; i++) if (arr[i].start.pos == item.start.pos) return true;
        return false;
    }
    function chainDotNames(dotNode) {
        var arr = [];
        function chain(node) {
            arr.push(node.property||node.name);
            if (node.expression)
                chain(node.expression);
        }
        chain(dotNode)
        return arr.reverse().join(".")
    }
    function getRef(fn, deps, fullname) {
        var U2 = UglifyJS;
        currentAST = U2.parse(fn.toString());
        currentAST.figure_out_scope();
        var result = [], resultNode = [],dotNodes=[];
        currentAST.walk(new U2.TreeWalker(function (node) {
            if (node instanceof U2.AST_New) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                if (name && "this" != name && "arguments" != name && !(name in window) && !isInScopeChainVariables(scope, name)) isResultNodeInArray(resultNode, node) || (result.push(name),
                resultNode.push(node));
            }
            if (node instanceof U2.AST_Dot) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                if (name && "this" != name && "arguments" != name && !(name in window) && !isInScopeChainVariables(scope, name)) isResultNodeInArray(resultNode, node) || (result.push(name),
                resultNode.push(node));
                dotNodes.push(node);
            }
            if (node instanceof U2.AST_Call) if ("get" == node.expression.property && "kmdjs" == node.expression.expression.name) if (node.args[0].value) lazyMdArr.push(node.args[0].value); else for (var i = 0, len = node.args[0].elements.length; i < len; i++) {
                var item = node.args[0].elements[i];
                lazyMdArr.push(item.value);
            }

            if (node instanceof U2.AST_SymbolRef) {
                var name = node.name, scope = node.scope;
                if (name && "this" != name && "arguments" != name && !(name in window) && !isInScopeChainVariables(scope, name)) isResultNodeInArray(resultNode, node) || (result.push(name),
               resultNode.push(node));
            }
        }));

       
        var code = fn.toString();
        var refs = [], refNodes = [], checkNames = [], checkClassNames = [], secNames = [];
        for (var j = 0; j < classList.length; j++) {
            var arr = classList[j].split(".");
            checkNames.push(arr[0]);
            secNames.push(arr[1]);
            checkClassNames.push(arr[arr.length - 1]);
        }
        for (var k = 0; k < result.length; k++) if (!isInArray(checkNames, result[k])) {
            if (!isInArray(refNodes, resultNode[k])) {
                refs.push(result[k]);
                refNodes.push(resultNode[k]);
            }
        } else if (isInArray(checkClassNames, result[k])) for (var i = 0; i < classList.length; i++) if (result[k] == classList[i].split(".")[0] && resultNode[k].property != classList[i].split(".")[1]) {
            if (!isInArray(refNodes, resultNode[k])) {
                refs.push(result[k]);
                refNodes.push(resultNode[k]);
            }
            break;
        }
        remove(refs, "arguments");
        remove(refs, "console");
        for (var m = 0; m < refs.length; m++) {
            var hasAddToClass = false;
            for (var n = 0; n < deps.length; n++) {



                if (isInArray(classList, deps[n] + "." + refs[m])) {
                    if (refNodes[m]) { refNodes[m].fullName = deps[n] + "." + refs[m]; }
                    hasAddToClass = true;
                } 
            }

    
            if (refs[m] != ProjName && refs[m].toUpperCase() != "MAIN" && !hasAddToClass) throw "【"+ refs[m] + "】 class is not in classes ! the error is from  【" + fullname + ".js】";
       
        }
        each(refNodes, function (item) {
            item.replaceArea = [];
        });
        for (var i = refNodes.length; --i >= 0;) {
            var node = refNodes[i];
            var start_pos = node.start.pos;
            var end_pos = node.end.endpos;
            var replacement;
            var fna = node.fullName || "KMDNull";
            if (node instanceof UglifyJS.AST_New) replacement = new U2.AST_New({
                expression: new U2.AST_SymbolRef({
                    name: fna
                }),
                args: node.args
            }).print_to_string({
                beautify: true
            }); else if (node instanceof UglifyJS.AST_SymbolRef) replacement = new U2.AST_SymbolRef({
                name: fna
            }).print_to_string({
                beautify: true
            }); else replacement = new U2.AST_Dot({
                expression: new U2.AST_SymbolRef({
                    name: fna
                }),
                property: node.property
            }).print_to_string({
                beautify: true
            });
            for (var k = 0; k < refNodes.length; k++) {
                var otherNode = refNodes[k];
                if (otherNode.start.pos < start_pos && otherNode.end.endpos > end_pos) {
                    var fna2 = otherNode.fullName;
                    var step = fna2.length - fna2.split(".")[fna2.split(".").length - 1].length;
                    otherNode.replaceArea.push({
                        step: step,
                        begin: start_pos,
                        end: end_pos,
                        replaceM: replacement,
                        children: node,
                        self: otherNode
                    });
                    node.parent = otherNode;
                }
            }
        }
        for (var i = refNodes.length; --i >= 0;) {
            var node = refNodes[i];
            if (node.parent) continue;
            var start_pos = node.start.pos;
            var end_pos = node.end.endpos;
            var replacement;
            var fna = node.fullName || "_________KMDNULL______________";
            if (!node.fullName) continue;
            if (node instanceof UglifyJS.AST_New) replacement = new U2.AST_New({
                expression: new U2.AST_SymbolRef({
                    name: fna
                }),
                args: node.args
            }).print_to_string({
                beautify: true
            }); else if (node instanceof UglifyJS.AST_SymbolRef) replacement = new U2.AST_SymbolRef({
                name: fna
            }).print_to_string({
                beautify: true
            }); else replacement = new U2.AST_Dot({
                expression: new U2.AST_SymbolRef({
                    name: fna
                }),
                property: node.property
            }).print_to_string({
                beautify: true
            });
            code = splice_string(code, start_pos, end_pos, replacement);
            if (node.replaceArea && node.replaceArea.length > 0 && !node.parent) code = fixNode(node, code);
        }

        //找出直接ns打点使用类的
        var fullRef = [];
            for (var kkk = 0, len = dotNodes.length; kkk < len; kkk++) {
                var fr= chainDotNames(dotNodes[kkk]);
                if (isInArray(classList, fr) && !isInArray(fullRef, fr)) {
                    fullRef.push(fr);
                }
            }
           
      
        return [refs, code, fullRef];
    }
    function replaceToFullName(code,target,replacement){
        var matchReg = new RegExp("\"(?:\\\\\"|[^\"])*\"|\'(?:\\\\\'|[^\'])*\'|\\/\\*[\\S\\s]*?\\*\\/|\\/(?:\\\\\\/|[^/\\r\\n])+\\/(?=[^\\/])|\\/\\/.*|(?:)(\\b)("+target+")\\1", "g");
        code=code.replace(matchReg, function (m, m1, m2) {                  
            if (m2) {
                return replacement;
            }
            return m;
        })
        return code;
    }
    function fixNode(node, code) {
        var step = +node.replaceArea[0].step, target = code.substr(node.start.pos, node.end.endpos - node.start.pos + step);
        for (var m = node.replaceArea.length; --m >= 0;) {
            var item = node.replaceArea[m], child = item.children;
            if (child instanceof UglifyJS.AST_New) {
                //target = target.replace(new RegExp("\\bnew\\s+" + child.fullName + "\\b", "g"), "new " + child.expression.name);
                //target = target.replace(new RegExp("\\bnew\\s+" + child.expression.name + "\\b", "g"), "new " + child.fullName);
                target=replaceToFullName(target, "new\\s+" + child.fullName ,"new " + child.expression.name);
                target=replaceToFullName(target, "new\\s+" + child.expression.name,"new " + child.fullName);
            } else if (child instanceof UglifyJS.AST_SymbolRef) {
                //target = target.replace(new RegExp("\\b" + child.fullName + "\\b", "g"), child.expression.name);
                //target = target.replace(new RegExp("\\b" + child.expression.name + "\\b", "g"), child.fullName);
                target = replaceToFullName(target, child.fullName, child.name);
                target = replaceToFullName(target, child.name, child.fullName);
            } else {
                target = replaceToFullName(target, child.fullName, child.expression.name);
                target = replaceToFullName(target, child.expression.name, child.fullName);
            }
        }
        code = splice_string(code, node.start.pos, node.end.endpos + step, target);
        return code;
    }
    function getBaseUrl() {
        var baseUrl;
        var scripts = doc.getElementsByTagName("script");
        for (var i = 0, len = scripts.length; i < len; i++) {
            var scrp = scripts[i];
            var srcL = scrp.getAttribute("src");
            if (!srcL) continue;
            var src = srcL.toUpperCase();
            var arr = src.match(/\bKMD.JS\b/g);
            if (arr) {
                var m2 = src.match(/DEBUG/g);
                if (m2) isDebug = true;
                var arr = src.split("/");
                arr.pop();
                baseUrl = arr.length ? arr.join("/") + "/" : "./";
                var dm = scrp.getAttribute("data-main");
                var arr2 = dm.split("?");
                dataMain = arr2[0];
                dataMain = dataMain.replace(/.js/g, "");
                if (arr2.length > 1) {
                    if (lastIndexOf(arr2[1], "&") == -1) {
                        if ("build" == arr2[1].toLowerCase()) isBuild = true; else if ("view" == arr2[1].toLowerCase()) isView = true; else if ("combine" == arr2[1].toLowerCase()) isCombine = true; else if ("split" == arr2[1].toLowerCase()) isSplit = true;
                    } else {
                        var actionCmd = arr2[1].split("&")[0];
                        exportNamespace = arr2[1].split("&")[1];
                        
                        if ("build" == actionCmd.toLowerCase()) isBuild = true; else if ("view" == actionCmd.toLowerCase()) isView = true; else if ("combine" == actionCmd.toLowerCase()) isCombine = true; else if ("split" == actionCmd.toLowerCase()) isSplit = true;
                    }
                }
                break;
            }
        }
        return baseUrl;
    }
    allPending.push("Main");
    request(dataMain + ".js", function () {
        remove(allPending, "Main");
        checkMainCpt();
    });
    function ajax(url, callback) {
        var httpRequest;
        if (window.XMLHttpRequest) httpRequest = new XMLHttpRequest(); else if (window.ActiveXObject) try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) { }
        }
        if (!httpRequest) {
            alert("Giving up :( Cannot create an XMLHTTP instance");
            return false;
        }
        httpRequest.onreadystatechange = function () {
            if (4 === httpRequest.readyState) if (200 === httpRequest.status) callback(httpRequest.responseText); else alert("There was a problem with the request.");
        };
        httpRequest.open("GET", url, false);
        httpRequest.send();
    }
    kmdjs.config = function (option) {
        ProjName = option.name;
        cBaseUrl = option.baseUrl;
        var i;
        if (!isBuild) if (option.build) {
            isMtClassesBuild = true;
            isBuild = true;
            readyBuildClasses = option.build;
        }
        if (option.deps) for (i = 0; i < option.deps.length; i++) {
            var item = option.deps[i];
            var currentUrl = item.url;
            for (var j = 0; j < item.classes.length; j++) {
                var cls = item.classes[j];
                classList.push(cls.name);
                var arr = cls.name.split(".");
                if (lastIndexOf(item.url, "http:") == -1) mapping[cls.name] = (cBaseUrl ? cBaseUrl + "/" : "") + (lastIndexOf(currentUrl, ".js") == -1 ? currentUrl + ".js" : currentUrl); else mapping[cls.name] = currentUrl;
                nsmp[arr[arr.length - 1]] = cls.name;
            }
        }
        if (option.classes) for (i = 0; i < option.classes.length; i++) {
            var item = option.classes[i];
            classList.push(item.name);
            var arr = item.name.split(".");
            if (item.url) if (lastIndexOf(item.url, "http:") == -1) mapping[item.name] = cBaseUrl + "/" + item.url + "/" + arr[arr.length - 1] + ".js"; else mapping[item.name] = item.url; else if (false == item.kmd) {
                mapping[item.name] = cBaseUrl + "/" + item.name + ".js";
                xmdModules[item.name] = true;
            } else mapping[item.name] = cBaseUrl + "/" + arr[arr.length - 1] + ".js";
            if (item.deps) {
                mapping[item.name + "_deps"] = item.deps;
                mapping[item.name + "_baseUrl"] =cBaseUrl + "/" + item.url + "/";
            }
            nsmp[arr[arr.length - 1]] = item.name;
        }
    };
    kmdjs.exec = function (a) {
        each(a, function (item) {
            var entire = item.b.toString();
            item.b = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
            kmdmdinfo.push(item);
        });
    };
    global.__class = __class;
    define.modules = global.__modules = modules;
    define.kmd=true;
    global.define = define;
    global.kmdjs = kmdjs;
}(this);
})();
