var ModuleTestDataType = (function(global) {

var _runOnNode = "process" in global;
var _runOnWorker = "WorkerLocation" in global;
var _runOnBrowser = "document" in global;

var test = new Test("DataType", {
        disable:    false,
        browser:    true,
        worker:     true,
        node:       true,
        button:     true,
        both:       true, // test the primary module and secondary module
    }).add([
        testArrayUnit,
        testArrayClampValue,
        testToHexString,
        testToHexEncode,
        testFromString,
        testToString,
        // --- TypedArray ---
        testClampTypedArray,
        testToHexStringTypedArray,
        testToHexEncodeTypedArray,
        testToStringTypedArray,
        // --- DataType.Object ---
        testObjectCloneLiteral,
        testObjectCloneObject,
        testObjectCloneSparseArray,
        testObjectCloneError,
    ]);

if (typeof document !== "undefined") { // for Browser
    test.add([
        testObjectCloneNode,
        testObjectCloneNamedNodeMap,
        testObjectCloneCSSStyleDeclaration,
    ]);
}

return test.run().clone();



function testArrayUnit(next) {

    var source1byte = [      0x6f,       0x89,       0x78,       0x11];
    var source2byte = [    0x306f,     0x3089,     0x3078,     0xff11];
    var source4byte = [0x1234306f, 0x34563089, 0x56783078, 0x0101ff11];

    var result8_8   = DataType["Array"].toHexStringArray( DataType["Array"].unit(source1byte, 1, 1), false, 1).join(",");
    var result8_16  = DataType["Array"].toHexStringArray( DataType["Array"].unit(source1byte, 1, 2), false, 2).join(",");
    var result8_32  = DataType["Array"].toHexStringArray( DataType["Array"].unit(source1byte, 1, 4), false, 4).join(",");
    var result16_8  = DataType["Array"].toHexStringArray( DataType["Array"].unit(source2byte, 2, 1), false, 1).join(",");
    var result16_16 = DataType["Array"].toHexStringArray( DataType["Array"].unit(source2byte, 2, 2), false, 2).join(",");
    var result16_32 = DataType["Array"].toHexStringArray( DataType["Array"].unit(source2byte, 2, 4), false, 4).join(",");
    var result32_8  = DataType["Array"].toHexStringArray( DataType["Array"].unit(source4byte, 4, 1), false, 1).join(",");
    var result32_16 = DataType["Array"].toHexStringArray( DataType["Array"].unit(source4byte, 4, 2), false, 2).join(",");
    var result32_32 = DataType["Array"].toHexStringArray( DataType["Array"].unit(source4byte, 4, 4), false, 4).join(",");

    var items = {
            1: result8_8   === "6f,89,78,11",
            2: result8_16  === "6f89,7811",
            3: result8_32  === "6f897811",
            4: result16_8  === "30,6f,30,89,30,78,ff,11",
            5: result16_16 === "306f,3089,3078,ff11",
            6: result16_32 === "306f3089,3078ff11",
            7: result32_8  === "12,34,30,6f,34,56,30,89,56,78,30,78,01,01,ff,11",
            8: result32_16 === "1234,306f,3456,3089,5678,3078,0101,ff11",
            9: result32_32 === "1234306f,34563089,56783078,0101ff11"
        };

   var ok = Object.keys(items).every(function(num) {
        return items[num];
    });

   if (ok) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}

function testArrayClampValue(next) {

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



function testObjectCloneLiteral(next) {

    if (DataType["Object"].clone(1)        === 1       &&
        DataType["Object"].clone(null)     === null    &&
        DataType["Object"].clone("a")      === "a"     &&
        DataType["Object"].clone(false)    === false) {

        next && next.pass();
        return;
    }
    next && next.miss();
}

function testObjectCloneObject(next) {
    var object = {
            key: "value",
            child: {
                key: "value"
            }
        };
    var date = new Date();
    var fn = function() { return true; };
    var array = [1, 2, 3];
    var error = new Error("hello");

    if (DataType["Object"].clone(object).child.key === "value" &&
        DataType["Object"].clone(date).getTime() === date.getTime() &&
        DataType["Object"].clone(fn)() === true &&
        DataType["Object"].clone(array).join(",") === "1,2,3" &&
        DataType["Object"].clone(error).message === "hello") {

        next && next.pass();
        return;
    }
    next && next.miss();
}

function testObjectCloneSparseArray(next) {
    var sparseArray = [0, 1, 2, 3];

    delete sparseArray[1]; // [0, undefined, 2, 3];

    sparseArray.length = 100;

    var clonedArray = DataType["Object"].clone(sparseArray);

    if (sparseArray[0] === clonedArray[0] &&
        sparseArray[1] === clonedArray[1] &&
        sparseArray[2] === clonedArray[2] &&
        sparseArray[3] === clonedArray[3]) {

        next && next.pass();
        return;
    }
    next && next.miss();
}


function testObjectCloneError(next) {
    var result = {
            1: DataType["Object"].clone(new Error("1")),
            2: DataType["Object"].clone(new TypeError("2")),
        };

    if (result[1].message === "1" &&
        result[2].message === "2") {

        next && next.pass();
        return;
    }
    next && next.miss();
}


function testObjectCloneNode(next) {
    var node1 = document.createElement("div");
    var node2 = document.createElement("div");
    var textNode = document.createTextNode("hello");

    node1.appendChild(node2);
    node2.appendChild(textNode);

    var clonedNodeTree = DataType["Object"].clone(node1);
    var treeImage = clonedNodeTree.outerHTML;

    if (clonedNodeTree.nodeName === "DIV" &&
        clonedNodeTree.children[0].nodeName === "DIV" &&
        treeImage === "<div><div>hello</div></div>") {

        next && next.pass();
        return;
    }
    next && next.miss();
}

function testObjectCloneNamedNodeMap(next) {
    var node = document.createElement("div");

    node.setAttribute("id", "id123");
    node.setAttribute("class", "class123");

    var attr = DataType["Object"].clone( node.attributes );

    if (node.getAttribute("id") === attr["id"] &&
        node.getAttribute("class") === attr["class"]) {

        next && next.pass();
        return;
    }
    next && next.miss();
}

function testObjectCloneCSSStyleDeclaration(next) {
    var result = true;
    var style = window.getComputedStyle(document.body);
    var clonedStyle = DataType["Object"].clone(style);

    for (var i = 0, iz = style.length; i < iz; ++i) {
        var key = style.item(i);
        var value = style[key];
        if (value && typeof value === "string") { // value only (skip methods)
            if (key in clonedStyle) {
                if (clonedStyle[key] === value) {
                    continue;
                }

            }
        }
        result = false;
        break;
    }
    if (result) {
        next && next.pass();
        return;
    }
    next && next.miss();
}




})((this || 0).self || global);

