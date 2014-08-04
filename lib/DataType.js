(function(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

// --- class / interfaces ----------------------------------
function DataType() {
}

//{@dev
DataType["repository"] = "https://github.com/uupaa/DataType.js"; // GitHub repository URL. http://git.io/Help
//}@dev

DataType["array"] = {
//  "unit":             DataType_Array_unit,            // DataType.Array.unit(source:TypedArray|IntegerArray, from:Integer = 1, to:Integer = 1):IntegerArray
    "toString":         DataType_Array_toString,        // DataType.Array.toString(source:TypedArray|IntegerArray):BinaryString
    "fromString":       DataType_Array_fromString,      // DataType.Array.fromString(source:BinaryString, bytes:Integer = 1):IntegerArray
    "clampValue":       DataType_Array_clampValue,      // DataType.Array.clampValue(source:TypedArray|IntegerArray, bytes:Integer = 1):TypedArray|IntegerArray
    "toHexStringArray": DataType_Array_toHexStringArray // DataType.Array.toHexStringArray(source:TypedArray|IntegerArray, hexEncode:Boolean = false, bytes:Integer = 1):HexStringArray
};
DataType["uint8array"] = {
    "clone":            DataType_Uint8Array_clone,      // DataType.Uint8Array.clone(source:Uint8Array, begin:Integer = 0, end:Integer = source.length):Uint8Array
    "concat":           DataType_Uint8Array_concat,     // DataType.Uint8Array.concat(...:Array|Uint8Array):Uint8Array
    "toArray":          DataType_Uint8Array_toArray,    // DataType.Uint8Array.toArray(source:Uint8Array):Array
    "fromString":       DataType_Uint8Array_fromString  // DataType.Uint8Array.fromString(source:BinaryString):Uint8Array
};
DataType["object"] = {
    "clone":            DataType_Object_clone           // DataType.Object.clone(source:Any, depth:Integer = 0, hook:Function = null):Any
};
// --- alias ---
DataType["Array"]  = DataType["array"];
DataType["Object"] = DataType["object"];
DataType["Uint8Array"] = DataType["uint8array"];

// --- implements ------------------------------------------
/*
function DataType_Array_unit(source, // @arg TypedArray|IntegerArray
                             from,   // @arg Integer = 1 - bytes
                             to) {   // @arg Integer = 1 - bytes
                                     // @ret IntegerArray
//{@dev
    $valid($type(source, "TypedArray|IntegerArray"), DataType_Array_unit, "source");
    $valid($type(from,   "Integer|omit"),            DataType_Array_unit, "from");
    $valid($type(to,     "Integer|omit"),            DataType_Array_unit, "to");
    if (from) {
        $valid(from >= 1 && from <= 4, DataType_Array_unit, "from");
    }
    if (to) {
        $valid(to >= 1 && to <= 4, DataType_Array_unit, "to");
    }
//}@dev

    if (from === to) { // _1_1, _2_2, _4_4
        return _filterAndCopy([], source, 0, source.length, Math.pow(256, from) - 1);
    }

    var type = { "1_2": _1_2, "1_4": _1_4,
                 "2_1": _2_1, "2_4": _2_4,
                 "4_1": _4_1, "4_2": _4_2 };

    var fn = type[from + "_" + to];

    if (fn) {
        return fn([], source, 0, source.length);
    }
    throw new TypeError("Unsupported data unit");
}

function _filterAndCopy(result, source, i, iz, filter) {
    for (; i < iz; ++i) {
        result.push( source[i] & filter );
    }
    return result;
}
function _1_2(result, source, i, iz) {
    for (; i < iz; i += 2) {
        result.push( ((source[i    ] & 0xff) <<  8) | (source[i + 1] & 0xff) );
    }
    return result;
}
function _1_4(result, source, i, iz) {
    for (; i < iz; i += 4) {
        result.push( ((source[i    ] & 0xff) << 24) | ((source[i + 1] & 0xff) << 16) |
                     ((source[i + 2] & 0xff) <<  8) |  (source[i + 3] & 0xff) );
    }
    return result;
}
function _2_1(result, source, i, iz) {
    for (; i < iz; ++i) {
        result.push( (source[i] >>  8) & 0xff, source[i] & 0xff );
    }
    return result;
}
function _2_4(result, source, i, iz) {
    for (; i < iz; i += 2) {
        result.push( (source[i] & 0xffff) << 16 | (source[i + 1] & 0xffff) );
    }
    return result;
}
function _4_1(result, source, i, iz) {
    for (; i < iz; ++i) {
        var value = source[i];

        result.push( (value >> 24) & 0xff, (value >> 16) & 0xff,
                     (value >>  8) & 0xff,  value        & 0xff );
    }
    return result;
}
function _4_2(result, source, i, iz) {
    for (; i < iz; ++i) {
        result.push( (source[i] >> 16) & 0xffff, source[i] & 0xffff );
    }
    return result;
}
 */

function DataType_Array_toString(source) { // @arg TypedArray|IntegerArray(= undefined): [0xff, ...]
                                           // @ret BinaryString:
//{@dev
    $valid($type(source, "TypedArray|IntegerArray|omit"), DataType_Array_toString, "source");
//}@dev

    if (!source) {
        return "";
    }
    var rv = [], i = 0, iz = source.length, bulkSize = 32000;
    var method = Array.isArray(source) ? "slice" : "subarray";

    // Avoid String.fromCharCode.apply(null, BigArray) exception
    if (iz < bulkSize) {
        return String.fromCharCode.apply(null, source);
    }
    for (; i < iz; i += bulkSize) {
        rv.push( String.fromCharCode.apply(null, source[method](i, i + bulkSize)) );
    }
    return rv.join("");
}

function DataType_Array_fromString(source,  // @arg BinaryString -
                                   bytes) { // @arg Integer = 1  - byte size(from 1 to 4)
                                            // @ret IntegerArray - [value, ...]
//{@dev
    $valid($type(source, "BinaryString"), DataType_Array_fromString, "source");
    $valid($type(bytes,  "Integer|omit"), DataType_Array_fromString, "bytes");
    if (bytes) {
        $valid(bytes >= 1 && bytes <= 4, DataType_Array_fromString, "bytes");
    }
//}@dev

    bytes = bytes || 1;

    var i = 0, iz = source.length, rv = new Array(iz);
    var filterBits = Math.pow(256, bytes) - 1; // 0xff, 0xffff, 0xffffff

    for (; i < iz; ++i) {
        rv[i] = source.charCodeAt(i) & filterBits;
    }
    return rv;
}

function DataType_Uint8Array_concat(/* ... */) { // @var_args Array|Uint8Array
                                                 // @ret Uint8Array
                                                 // @desc [].concat(value1, value2, ...)
    var args = arguments;
    var i = 0, iz = args.length;
    var length = 0;
    var offset = 0;

    for (; i < iz; ++i) {
        length += args[i].length;
    }

    var result = new Uint8Array(length);

    for (i = 0; i < iz; ++i) {
        result.set(args[i], offset);
        offset += args[i].length;
    }
    return result;
}

function DataType_Uint8Array_clone(source,  // @arg Uint8Array
                                   begin,   // @arg Integer = 0 - begin offset
                                   end) {   // @arg Integer = source.length - end offset
                                            // @ret Uint8Array
                                            // @desc make clone (not reference)
//{@dev
    $valid($type(source, "Uint8Array"),   DataType_Uint8Array_clone, "source");
    $valid($type(begin,  "Integer|omit"), DataType_Uint8Array_clone, "begin");
    $valid($type(end,    "Integer|omit"), DataType_Uint8Array_clone, "end");
//}@dev

    if (end !== undefined) {
        return new Uint8Array( source.buffer.slice(begin, end) );
    }
    return new Uint8Array( source.buffer.slice(begin || 0) );
}

function DataType_Uint8Array_toArray(source) { // @arg Uint8Array
                                               // @ret Array
//{@dev
    $valid($type(source, "Uint8Array"), DataType_Uint8Array_toArray, "source");
//}@dev

    return Array.prototype.slice.call(source);
}

function DataType_Uint8Array_fromString(source) { // @arg BinaryString
                                                  // @ret Uint8Array
//{@dev
    $valid($type(source, "BinaryString"), DataType_Uint8Array_fromString, "source");
//}@dev

    var i = 0, iz = source.length;
    var result = new Uint8Array(iz);

    for (; i < iz; ++i) {
        result[i] = source.charCodeAt(i) & 0xff;
    }
    return result;
}

function DataType_Array_clampValue(source,  // @arg TypedArray|IntegerArray - source: [0x100, 0x101, 0x102]
                                   bytes) { // @arg Integer = 1             - byte size(from 1 to 4): 1 -> 0xff, 2 -> 0xffff, 4 -> 0xffffffff
                                            // @ret TypedArray|IntegerArray - clamped value: [0xff, 0xff, 0xff]
                                            // @desc clamp byte array
//{@dev
    $valid($type(source, "TypedArray|IntegerArray"), DataType_Array_clampValue, "source");
    $valid($type(bytes,  "Integer|omit"),            DataType_Array_clampValue, "bytes");
    if (bytes) {
        $valid(bytes >= 1 && bytes <= 4, DataType_Array_clampValue, "bytes");
    }
//}@dev

    bytes = bytes || 1;

    var i = 0, iz = source.length;
    var value = 0, min = 0, max = Math.pow(256, bytes) - 1;

    for (; i < iz; ++i) {
        value = source[i];
        // clamp
        source[i] = value < min ? min
                  : value > max ? max
                  : value;
    }
    return source;
}

function DataType_Array_toHexStringArray(source,    // @arg TypedArray|IntegerArray - [0x00, 0x41, 0x53, 0x43, 0x49, 0x49, 0xff, ...]
                                         hexEncode, // @arg Boolean = false         - hex encode.
                                         bytes) {   // @arg Integer = 1             - byte size(from 1 to 8). 1 -> 00 ~ ff, 2 -> 0000 ~ ffff, 4 -> 00000000 ~ ffffffff
                                                    // @ret HexStringArray          - ["00", "41", "53", "43", "49", "49", "ff", ...]
                                                    // @desc Convert ByteArray to HexString.
//{@dev
    $valid($type(source,    "TypedArray|IntegerArray"), DataType_Array_toHexStringArray, "source");
    $valid($type(hexEncode, "Boolean|omit"),            DataType_Array_toHexStringArray, "hexEncode");
    $valid($type(bytes,     "Integer|omit"),            DataType_Array_toHexStringArray, "bytes");
    if (bytes) {
        $valid(bytes >= 1 && bytes <= 4, DataType_Array_toHexStringArray, "bytes");
    }
//}@dev

    bytes     = bytes || 1;
    hexEncode = hexEncode || false;

    var rv = [];
    var i = 0, iz = source.length;
    var from = -(bytes * 2);

    if (hexEncode) {
        var rex = /\w/; // [A-Za-z0-9_]

        for (; i < iz; ++i) {
            var c = String.fromCharCode(source[i]);

            if ( rex.test(c) ) {
                rv.push(c);
            } else {
                rv.push( "%" + (source[i] + 0x100000000).toString(16).slice(from) );
            }
        }
    } else {
        for (; i < iz; ++i) {
            rv.push( (source[i] + 0x100000000).toString(16).slice(from) );

        }
    }
    return rv;
}

function DataType_Object_clone(source, // @arg Any             - source object.
                               depth,  // @arg Integer = 0     - max depth, 0 is infinity.
                               hook) { // @arg Function = null - handle the unknown object.
                                       // @ret Any             - copied object.
                                       // @throw TypeError("DataCloneError: ...")
                                       // @desc Object with the reference -> deep copy
                                       //       Object without the reference -> shallow copy
                                       //       do not look prototype chain.
//{@dev
    $valid($type(depth, "Number|omit"),  DataType_Object_clone, "depth");
    $valid($type(hook, "Function|omit"), DataType_Object_clone, "hook");
//}@dev

    return _clone(source, depth || 0, hook, 0);
}

function _clone(source, // @arg Any      - source object.
                depth,  // @arg Integer  - max depth, 0 is infinity.
                hook,   // @arg Function - handle the unknown object.
                nest) { // @arg Integer  - current nest count.
                        // @recursive
    if (depth && nest > depth) {
        throw new TypeError("DataCloneError: " + source);
    }
    if (source === null || source === undefined) {
        return source;
    }

    var baseClass = _getBaseClassName(source); // detect [[Class]]

    switch (baseClass) {
    case "Function":return source; // does not clone
    case "String":
    case "Number":
    case "Boolean": return source.valueOf();
    case "RegExp":  return new RegExp(source["source"], (source + "").slice(source["source"].length + 2));
    case "Date":    return new Date(+source);
    case "Array":   return _cloneArray(source, depth, hook, nest);
    case "Object":  return _cloneObject(source, depth, hook, nest);
    case "Error":   return new source["constructor"](source["message"]);
  //case "File":
  //case "Blob":
  //case "FileList":
  //case "ImageData":
  //case "CanvasPixelArray":
  //case "ImageBitmap":
    }
    // --- Node, Attr, Style, HostObjects ---
    if (source.nodeType) { // Node
        return source["cloneNode"](true);
    }
    if (source instanceof global["NamedNodeMap"]) { // NodeAttribute -> {}
        return _convertNodeAttributeToObject(source);
    }
    if (source instanceof global["CSSStyleDeclaration"]) { // CSSStyleDeclaration -> {}
        return _convertCSSStyleDeclarationToObject(source);
    }
    // --- convert ArrayLike(Arguments, NodeList, HTMLCollection) to Object ---
    if ("length" in source && typeof source["item"] === "function") {
        return _cloneArrayLike(source, depth, hook, nest);
    }
    if (hook) { // hook unknown type
        return hook(source, depth, hook, nest);
    }
    return source;
}

function _getBaseClassName(value) { // @arg Any
                                    // @ret String
    // Object.prototype.toString.call(new Error());     -> "[object Error]"
    // Object.prototype.toString.call(new TypeError()); -> "[object Error]"
    return Object.prototype.toString.call(value).split(" ")[1].slice(0, -1); // -> "Error"
}

//function _getConstructorName(value) { // @arg Any   instance, exclude null and undefined.
//                                      // @ret String
//    // _getConstructorName(new (function Aaa() {})); -> "Aaa"
//    return value.constructor["name"] ||
//          (value.constructor + "").split(" ")[1].split("\x28")[0]; // for IE
//}

function _cloneArray(source, depth, hook, nest) {
    var result = [];

    result.length = source.length;
    for (var i = 0, iz = source.length; i < iz; ++i) {
        if (i in source) {
            result[i] = _clone(source[i], depth, hook, nest + 1);
        }
    }
    return result;
}

function _cloneObject(source, depth, hook, nest) {
    var result = {};
    var keys = Object.keys(source);

    for (var i = 0, iz = keys.length; i < iz; ++i) {
        var key = keys[i];

        result[key] = _clone(source[key], depth, hook, nest + 1);
    }
    return result;
}

function _cloneArrayLike(source, depth, hook, nest) {
    var result = [];

    for (var i = 0, iz = source.length; i < iz; ++i) {
        result[i] = _clone(source[i], depth, hook, nest + 1);
    }
    return result;
}

function _convertNodeAttributeToObject(source) { // @arg Attr: NamedNodeMap
                                                 // @ret Object:
                                                 // @desc: NodeAttribute normalization.
    var result = {}, i = 0, attr;

    for (; attr = source[i++]; ) {
        result[attr["name"]] = attr["value"];
    }
    return result;
}

function _convertCSSStyleDeclarationToObject(source) { // @arg Style: CSSStyleDeclaration
                                                       // @ret Object:
                                                       // @desc: CSSStyleDeclaration normalization.
    var result = {}, key, value, i = 0, iz = source.length;

    for (; i < iz; ++i) {
        key = source["item"](i);
        value = source[key];
        if (value && typeof value === "string") { // value only (skip methods)
            result[key] = value;
        }
    }
    return result;
}

// --- validate / assertions -------------------------------
//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
if ("process" in global) {
    module["exports"] = DataType;
}
global["DataType" in global ? "DataType_" : "DataType"] = DataType; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

