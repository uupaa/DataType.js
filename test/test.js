var ModuleTestDataType = (function(global) {

var _runOnNode = "process" in global;
var _runOnWorker = "WorkerLocation" in global;
var _runOnBrowser = "document" in global;

return new Test("DataType", {
        disable:    false,
        browser:    true,
        worker:     true,
        node:       true,
        button:     true,
        both:       true, // test the primary module and secondary module
    }).add([
        testClamp,
        testToHexString,
        testToHexEncode,
        testFromString,
        testToString,
        testFromIntegerArray,
        testToIntegerArray,
        // --- TypedArray ---
        testClampTypedArray,
        testToHexStringTypedArray,
        testToHexEncodeTypedArray,
        testToStringTypedArray,

    ]).run().clone();

function testClamp(next) {

    var source = [0x12, 0x123, 0x1234, 0x12345];
    var byteArray = DataType["Array"].clampValue(source);
    var result = [0x12,  0xff,   0xff,    0xff];

    if (result.join(",") === byteArray.join(",")) {
        next && next.pass();
        return;
    }
    next && next.miss();
}

function testToHexString(next) {

    var source = [0x306f, 0x3089, 0x103078];
    var result = DataType["Array"].toHexStringArray(source);

    if (result.join("") === "6f8978") {
        next && next.pass();
        return;
    }
    next && next.miss();
}

function testToHexEncode(next) {

    var source = [0x00, 0x41, 0x53, 0x43, 0x49, 0x49, 0xff];
    var result = DataType["Array"].toHexStringArray(source, true);

    if (result.join("") === "%00ASCII%ff") {
        next && next.pass();
        return;
    }
    next && next.miss();
}

function testFromString(next) {

    var source = String.fromCharCode.apply(null, [0x306f, 0x3089, 0x3078]);
    var byteArray = DataType["Array"].fromString(source);

    if (byteArray[0] === 0x6f &&
        byteArray[1] === 0x89 &&
        byteArray[2] === 0x78) {

        next && next.pass();
        return;
    }
    next && next.miss();
}

function testToString(next) {

    var source = [0x20, 0x21, 0x22, 0x23];
    var result = DataType["Array"].toString(source);

    if (result === "\u0020\u0021\u0022\u0023") {
        next && next.pass();
        return;
    }
    next && next.miss();
}

function testFromIntegerArray(next) {

    var source = [0x306f, 0x3089, 0x3078];
    var result = DataType["Array"].unit(source, 2, 1);

    if (result[0] === 0x30 &&
        result[1] === 0x6f &&
        result[2] === 0x30 &&
        result[3] === 0x89 &&
        result[4] === 0x30 &&
        result[5] === 0x78) {

        next && next.pass();
        return;
    }
    next && next.miss();
}

function testToIntegerArray(next) {

    var source = [0x6f, 0x89, 0x78, 0x20];
    var result = DataType["Array"].unit(source, 1, 2);

    if (result[0] === 0x6f89 &&
        result[1] === 0x7820) {

        next && next.pass();
        return;
    }
    next && next.miss();
}

// --- TypedArray ---
function testClampTypedArray(next) {

    var source    = new Uint16Array([0x12, 0x123, 0x1234, 0x12345]);
    var byteArray = DataType["Array"].clampValue(source);
    var result    = new Uint8Array([0x12,  0xff,   0xff,    0xff]);

    if (Array.prototype.slice.call(result).join(",") ===
        Array.prototype.slice.call(byteArray).join(",")) {
        next && next.pass();
        return;
    }
    next && next.miss();
}

function testToHexStringTypedArray(next) {

    var source = new Uint8Array([0x306f, 0x3089, 0x103078]);
    var result = DataType["Array"].toHexStringArray(source);

    if (result.join("") === "6f8978") {
        next && next.pass();
        return;
    }
    next && next.miss();
}

function testToHexEncodeTypedArray(next) {

    var source = new Uint8Array([0x00, 0x41, 0x53, 0x43, 0x49, 0x49, 0xff]);
    var result = DataType["Array"].toHexStringArray(source, true);

    if (result.join("") === "%00ASCII%ff") {
        next && next.pass();
        return;
    }
    next && next.miss();
}


function testToStringTypedArray(next) {

    var source = new Uint8Array([0x20, 0x21, 0x22, 0x23]);
    var result = DataType["Array"].toString(source);

    if (result === "\u0020\u0021\u0022\u0023") {
        next && next.pass();
        return;
    }
    next && next.miss();
}

})((this || 0).self || global);

