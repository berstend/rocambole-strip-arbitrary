'use strict';
var updateNode = require('rocambole-node-update');

module.exports = function (node, id, whitelist) {
  var nodeIdentifier = id || 'console';
  var propertyWhitelist = whitelist || [];

  if (node.type !== 'CallExpression') {
    return;
  }

  var expression = node.callee;

  if (expression && expression.type !== 'MemberExpression') {
    return;
  }

  var main = expression.object;

  // collapse `window`
  if (main && main.type === 'MemberExpression' && main.object && main.object.type === 'Identifier' && main.object.name === 'window' && main.property) {
    main = main.property;
  }

  if (main && main.type === 'Identifier' && main.name === nodeIdentifier && expression.property) {
    if (propertyWhitelist.indexOf(expression.property.name) === -1) {
      // Property is not whitelisted, strip it.
      updateNode(node, 'void 0');
    }
  }
};
