=========
DataType.js
=========

![](https://travis-ci.org/uupaa/DataType.js.png)

DataType.js description.

# Document

- [DataType.js wiki](https://github.com/uupaa/DataType.js/wiki/DataType)
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [WebModule](https://github.com/uupaa/WebModule) ([Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html))


# How to use

## Browser

```js
<script src="lib/DataType.js">
<script>
console.log( DataType["Object"].clone({ a: 1 }) );
</script>
```

## WebWorkers

```js
importScripts("lib/DataType.js");

console.log( DataType["Object"].clone({ a: 1 }) );
```

## Node.js

```js
var DataType = require("lib/DataType.js");

console.log( DataType["Object"].clone({ a: 1 }) );
```

