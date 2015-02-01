'use strict';
var assert = require('assert');
var rocambole = require('rocambole');
var stripConsole = require('./');

function strip(str, id, whitelist) {
  return rocambole.moonwalk(str, function (node) {
      stripConsole(node, id, whitelist);
  }).toString();
}

it('should strip console statement', function () {
  var id = 'console';
  var whitelist = [];
  assert.equal(strip('function test(){console.log("foo");}', id, whitelist), 'function test(){void 0;}');
  assert.equal(strip('function test(){window.console.warn("foo");}', id, whitelist), 'function test(){void 0;}');
  assert.equal(strip('"use strict";console.info("foo");foo()', id, whitelist), '"use strict";void 0;foo()');
  assert.equal(strip('if(console){console.log("foo", "bar");}', id, whitelist), 'if(console){void 0;}');
  assert.equal(strip('foo && console.debug("foo");', id, whitelist), 'foo && void 0;');
  assert.equal(strip('if (foo) console.log("foo")\nnextLine();', id, whitelist), 'if (foo) void 0\nnextLine();');
});

it('should strip all console statements if no parameters are given', function () {
  var id = undefined;
  var whitelist = undefined;
  assert.equal(strip('function test(){console.log("foo");}', id, whitelist), 'function test(){void 0;}');
  assert.equal(strip('function test(){window.console.warn("foo");}', id, whitelist), 'function test(){void 0;}');
  assert.equal(strip('"use strict";console.info("foo");foo()', id, whitelist), '"use strict";void 0;foo()');
  assert.equal(strip('if(console){console.log("foo", "bar");}', id, whitelist), 'if(console){void 0;}');
  assert.equal(strip('foo && console.debug("foo");', id, whitelist), 'foo && void 0;');
  assert.equal(strip('if (foo) console.log("foo")\nnextLine();', id, whitelist), 'if (foo) void 0\nnextLine();');
});

it('should strip console statement but leave .warn and .error intact', function () {
  var id = 'console';
  var whitelist = ['warn', 'error'];
  assert.equal(strip('function test(){console.error("foo");}', id, whitelist), 'function test(){console.error("foo");}');
  assert.equal(strip('function test(){window.console.warn("foo");}', id, whitelist), 'function test(){window.console.warn("foo");}');
  assert.equal(strip('"use strict";console.info("foo");foo()', id, whitelist), '"use strict";void 0;foo()');
  assert.equal(strip('if(console){console.log("foo", "bar");}', id, whitelist), 'if(console){void 0;}');
  assert.equal(strip('foo && console.debug("foo");', id, whitelist), 'foo && void 0;');
  assert.equal(strip('if (foo) console.log("foo")\nnextLine();', id, whitelist), 'if (foo) void 0\nnextLine();');
});

it('should strip log statement', function () {
  var id = 'log';
  var whitelist = [];
  assert.equal(strip('function test(){log("foo");}', id, whitelist), 'function test(){log("foo");}');
  assert.equal(strip('function test(){window.log.warn("foo");}', id, whitelist), 'function test(){void 0;}');
  assert.equal(strip('"use strict";log.info("foo");foo()', id, whitelist), '"use strict";void 0;foo()');
  assert.equal(strip('if(console){log.debug("foo", "bar");}', id, whitelist), 'if(console){void 0;}');
  assert.equal(strip('foo && log.debug("foo");', id, whitelist), 'foo && void 0;');
  assert.equal(strip('if (foo) log.trace("foo")\nnextLine();', id, whitelist), 'if (foo) void 0\nnextLine();');
});

it('should never strip away non-debugging code', function () {
  var t = 'var test = {\n    getReadSections: function(){\n        var readSections = window.localStorage.getItem(\'storyReadSections\') || \'[]\';\n        return JSON.parse(readSections);\n    }\n};';
  assert.equal(strip(t), t);
})
