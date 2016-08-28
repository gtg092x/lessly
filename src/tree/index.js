var tree = Object.create(null);

tree.Node = require('./node');
tree.Alpha = require('./alpha');
tree.Color = require('./color');
tree.Call = require('./call');
// Backwards compatibility
tree.Dimension = require('./dimension');
tree.Unit = require('./unit');
tree.Keyword = require('./keyword');
tree.Negative = require('./negative');

module.exports = tree;
