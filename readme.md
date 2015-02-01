# rocambole-strip-arbitrary

> Strip arbitrary statements (e.g. console) from a [rocambole](https://github.com/millermedeiros/rocambole) AST

## Note

This is based on [sindresorhus/rocambole-strip-console](https://github.com/sindresorhus/rocambole-strip-console) and adds more parameters to allow arbitrary statements to be removed with an optional whitelist of properties to keep intact.

This is useful to e.g. strip `console` or `log` statements in production builds but keep `.warn` and `.error` statements in the code.


## Install (from Github, not on NPM yet)

```sh
$ npm install --save berstend/rocambole-strip-arbitrary
```


## Usage

```js
var rocambole = require('rocambole');
var stripStatement = require('rocambole-strip-arbitrary');

rocambole.moonwalk('if (true) { console.log("foo"); }', function (node) {
	stripStatement(node, 'console', ['warn', 'error']);
}).toString();
//=> if (true) { void 0; }
```


To prevent any side-effects, `console.*` is replaced with `void 0` instead of being removed. UglifyJS can later remove these void statements.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com) & berstend
