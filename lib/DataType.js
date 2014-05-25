(function(global) {
"use strict";

// --- dependency module -----------------------------------
//{@dev
//  This code block will be removed in `$ npm run build-release`. http://git.io/Minify
var Valid = global["Valid"] || require("uupaa.valid.js"); // http://git.io/Valid
//}@dev

// --- local variable --------------------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

// --- define ----------------------------------------------
// --- interface -------------------------------------------
function DataType() {
}

DataType["repository"] = "https://github.com/uupaa/DataType.js"; // GitHub repository URL. http://git.io/Help
DataType["Array"] = {
    "unit":             DataType_Array_unit,            // DataType.Array.unit(source:TypedArray|IntegerArray, from:Integer = 1, to:Integer = 1):IntegerArray
    "toString":         DataType_Array_toString,        // DataType.Array.toString(source:TypedArray|IntegerArray):BinaryString
    "fromString":       DataType_Array_fromString,      // DataType.Array.fromString(source:BinaryString, bytes:Integer = 1):IntegerArray
    "clampValue":       DataType_Array_clampValue,      // DataType.Array.clampValue(source:TypedArray|IntegerArray, bytes:Integer = 1):TypedArray|IntegerArray
    "toHexStringArray": DataType_Array_toHexStringArray // DataType.Array.toHexStringArray(source:TypedArray|IntegerArray, hexEncode:Boolean = false, bytes:Integer = 1):HexStringArray
};

// --- implement -------------------------------------------
function DataType_Array_unit(source, // @arg TypedArray|IntegerArray
                             from,   // @arg Integer = 1
                             to) {   // @arg Integer = 1
                                     // @ret IntegerArray
//{@dev
    Valid(Valid.type(source, "TypedArray|IntegerArray"), DataType_Array_unit, "source");
    Valid(Valid.type(from,   "Integer|omit"),            DataType_Array_unit, "from");
    Valid(Valid.type(to,     "Integer|omit"),            DataType_Array_unit, "to");
    if (from) {
        Valid(from >= 1 && from <= 4, DataType_Array_unit, "from");
    }
    if (to) {
        Valid(to >= 1 && to <= 4, DataType_Array_unit, "to");
    }
//}@dev

    var type = { "1_1": _8_8, "1_2": _8_16, "1_4": _8_32, "2_1": _16_8, "4_1": _32_8, };
    var fn = type[from + "_" + to];

    if (fn) {
        return fn([], source, 0, source.length);
    }
    throw new TypeError("Unsupported data unit");
}

function _8_8(result, source, i, iz) {
    for (; i < iz; ++i) {
        result.push( source[i] & 0xff );
    }
    return result;
}
function _8_16(result, source, i, iz) {
    for (; i < iz; i += 2) {
        result.push( ((source[i    ] & 0xff) <<  8) | (source[i + 1] & 0xff) );
    }
    return result;
}
function _8_32(result, source, i, iz) {
    for (; i < iz; i += 4) {
        result.push( ((source[i    ] & 0xff) << 24) | ((source[i + 1] & 0xff) << 16) |
                     ((source[i + 2] & 0xff) <<  8) |  (source[i + 3] & 0xff) );
    }
    return result;
}
function _16_8(result, source, i, iz) {
    for (; i < iz; ++i) {
        var value = source[i];

        result.push( (value >>  8) & 0xff, value & 0xff );
    }
    return result;
}
function _32_8(result, source, i, iz) {
    for (; i < iz; ++i) {
        var value = source[i];

        result.push( (value >> 24) & 0xff, (value >> 16) & 0xff,
                     (value >>  8) & 0xff,  value        & 0xff );
    }
    return result;
}

function DataType_Array_toString(source) { // @arg TypedArray|IntegerArray(= undefined): [0xff, ...]
                                           // @ret BinaryString:
//{@dev
    Valid(Valid.type(source, "TypedArray|IntegerArray|omit"), DataType_Array_toString, "source");
//}@dev

    source = source || [];

    var rv = [], i = 0, iz = source.length, bulkSize = 32000;

    // Avoid String.fromCharCode.apply(null, BigArray) exception
    if (iz < bulkSize) {
        return String.fromCharCode.apply(null, source);
    }
    if (Array.isArray(source)) {
        for (; i < iz; i += bulkSize) {
            rv.push( String.fromCharCode.apply(null, source.slice(i, i + bulkSize)) );
        }
    } else {
        for (; i < iz; i += bulkSize) {
            rv.push( String.fromCharCode.apply(null, source.subarray(i, i + bulkSize)) );
        }
    }
    return rv.join("");
}

function DataType_Array_fromString(source,  // @arg BinaryString -
                                   bytes) { // @arg Integer = 1  - byte size(from 1 to 4)
                                            // @ret IntegerArray - [value, ...]
//{@dev
    Valid(Valid.type(source, "BinaryString"), DataType_Array_fromString, "source");
    Valid(Valid.type(bytes,  "Integer|omit"), DataType_Array_fromString, "bytes");
    if (bytes) {
        Valid(bytes >= 1 && bytes <= 4, DataType_Array_fromString, "bytes");
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

function DataType_Array_clampValue(source,  // @arg TypedArray|IntegerArray - source: [0x100, 0x101, 0x102]
                                   bytes) { // @arg Integer = 1             - byte size(from 1 to 4): 1 -> 0xff, 2 -> 0xffff, 4 -> 0xffffffff
                                            // @ret TypedArray|IntegerArray - clamped value: [0xff, 0xff, 0xff]
                                            // @desc clamp byte array
//{@dev
    Valid(Valid.type(source, "TypedArray|IntegerArray"), DataType_Array_clampValue, "source");
    Valid(Valid.type(bytes,  "Integer|omit"),            DataType_Array_clampValue, "bytes");
    if (bytes) {
        Valid(bytes >= 1 && bytes <= 4, DataType_Array_clampValue, "bytes");
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
    Valid(Valid.type(source,    "TypedArray|IntegerArray"), DataType_Array_toHexStringArray, "source");
    Valid(Valid.type(hexEncode, "Boolean|omit"),            DataType_Array_toHexStringArray, "hexEncode");
    Valid(Valid.type(bytes,     "Integer|omit"),            DataType_Array_toHexStringArray, "bytes");
    if (bytes) {
        Valid(bytes >= 1 && bytes <= 4, DataType_Array_toHexStringArray, "bytes");
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

// --- export ----------------------------------------------
if ("process" in global) {
    module["exports"] = DataType;
}
global["DataType" in global ? "DataType_" : "DataType"] = DataType; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule

