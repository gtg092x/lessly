'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dimensions = exports.ex = exports.pc = exports.cm = exports.vmin = exports.mm = exports.inch = exports.vw = exports.vh = exports.pt = exports.rad = exports.em = exports.percent = exports.px = exports.dim = exports.colorFunctions = exports.callable = exports.lessly = exports.parse = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.theme = theme;
exports.dimension = dimension;
exports.value = value;

var _parser = require('./parser/parser');

var _parser2 = _interopRequireDefault(_parser);

var _functions = require('./functions');

var _dimension = require('./tree/dimension');

var _dimension2 = _interopRequireDefault(_dimension);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.parse = _parser2.default;

/*
  Converts camelCase to camel-case
 */

function camelCaseToDash(key) {
  return key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/*
 Parses @var with {var: 'value'}
 */
function parseVars(str) {
  var vars = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var keys = Object.keys(vars);
  keys.sort(function (a, b) {
    return b.length - a.length;
  });
  return keys.reduce(function (pointer, key) {
    var replacement = vars[key];
    var _key = key[0] === '@' ? key : '@' + key;
    var dashKey = camelCaseToDash(_key);
    if (dashKey !== _key) {
      pointer = pointer.replace(dashKey, replacement);
    }

    return pointer.replace(_key, replacement);
  }, str);
}

/*
  Parses less entity string
 */
function lessly(str) {
  var vars = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var finalstr = parseVars(str, vars);
  return (0, _parser2.default)(finalstr).toCSS();
};

exports.default = lessly;
exports.lessly = lessly;

// export functions

// parse function args so we dont need to expose Color Node

function bindParse(func, vars) {
  var convert = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var finalArgs = args.map(function (arg) {
      return parseVars(String(arg), vars);
    });
    var result = func.apply(undefined, _toConsumableArray(finalArgs.map(function () {
      return convert ? _parser2.default.apply(undefined, arguments) : arguments.length <= 0 ? undefined : arguments[0];
    })));
    if (convert) {
      result = result.toCSS();
    }
    return isNaN(result) ? result : Number(result);
  };
}

exports.callable = _functions.callable;
function theme() {
  var vars = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var defaulFunction = function defaulFunction(str) {
    var subVars = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return lessly(str, _extends({}, vars, subVars));
  };

  defaulFunction = Object.keys(_functions.callable).reduce(function (pointer, key) {
    var func = _functions.callable[key];
    pointer[key] = bindParse(func, vars);
    return pointer;
  }, defaulFunction);

  defaulFunction = Object.keys(dimensions).reduce(function (pointer, key) {
    var func = dimensions[key];
    pointer[key] = bindParse(func, vars, false);
    return pointer;
  }, defaulFunction);

  return defaulFunction;
}

var colorFunctions = Object.keys(_functions.callable).reduce(function (pointer, key) {
  var func = _functions.callable[key];
  return _extends({}, pointer, _defineProperty({}, key, bindParse(func)));
}, {});

exports.colorFunctions = colorFunctions;


for (var key in colorFunctions) {
  module.exports[key] = colorFunctions[key];
}

function isPlainObj(o) {
  return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) == 'object' && o.constructor == Object;
}

function dimension(val, unit) {
  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key3 = 2; _key3 < _len2; _key3++) {
    args[_key3 - 2] = arguments[_key3];
  }

  if (isPlainObj(val)) {
    return Object.keys(val).reduce(function (pointer, key) {
      var subVal = val[key];
      return _extends({}, pointer, _defineProperty({}, key, dimension.apply(undefined, [subVal, unit].concat(args))));
    }, {});
  }
  if (unit === undefined) {
    return op(val);
  }
  if (args.length) {
    return op(toOps.apply(undefined, [val, unit].concat(args)));
  }
  if (containsOp(val) || containsOp(unit)) {
    return op(toOps(val, unit));
  }
  var dim = new _dimension2.default(val, unit);
  return dim.toCSS();
}

function value(val) {
  var dim = new _dimension2.default(val, unit);
  return Number(dim.toCSS());
}

function containsOp(val) {
  return val.search && val.search(/[\+\*\-\/]/) > -1;
}

function toOps() {
  for (var _len3 = arguments.length, args = Array(_len3), _key4 = 0; _key4 < _len3; _key4++) {
    args[_key4] = arguments[_key4];
  }

  return args.map(function (arg) {
    return arg.trim ? arg.trim() : arg;
  }).join(' ');
}

function getUnit(str) {
  return str.replace(/[0-9\s]/gi, '');
}

function getValue(str) {
  return str.replace(/[^0-9]/gi, '');
}

function getArgs(str) {
  return [getValue(str), getUnit(str)];
}

function op(val) {
  var _val$split = val.split(' ');

  var _val$split2 = _toArray(_val$split);

  var result = _val$split2[0];

  var args = _val$split2.slice(1);

  if (args.length < 2) {
    var _dim = new _dimension2.default(result);
    return _dim.toCSS();
  }
  result = new (Function.prototype.bind.apply(_dimension2.default, [null].concat(_toConsumableArray(getArgs(result)))))();
  while (args.length >= 2) {
    var _args$slice = args.slice(0, 2);

    var _args$slice2 = _slicedToArray(_args$slice, 2);

    var _op = _args$slice2[0];
    var val2 = _args$slice2[1];

    args = args.slice(2);
    var dim1 = result;
    var dim2 = new (Function.prototype.bind.apply(_dimension2.default, [null].concat(_toConsumableArray(getArgs(val2)))))();
    result = dim1.operate({}, _op, dim2);
  }
  return result.toCSS();
}

var dim = exports.dim = dimension;
var px = exports.px = function px(val) {
  return dimension(val, 'px');
};
var percent = exports.percent = function percent(val) {
  return dimension(val, '%');
};
var em = exports.em = function em(val) {
  return dimension(val, 'em');
};
var rad = exports.rad = function rad(val) {
  return dimension(val, 'rad');
};
var pt = exports.pt = function pt(val) {
  return dimension(val, 'pt');
};
var vh = exports.vh = function vh(val) {
  return dimension(val, 'vh');
};
var vw = exports.vw = function vw(val) {
  return dimension(val, 'vw');
};
var inch = exports.inch = function inch(val) {
  return dimension(val, 'in');
};
var mm = exports.mm = function mm(val) {
  return dimension(val, 'mm');
};
var vmin = exports.vmin = function vmin(val) {
  return dimension(val, 'vmin');
};
var cm = exports.cm = function cm(val) {
  return dimension(val, 'cm');
};
var pc = exports.pc = function pc(val) {
  return dimension(val, 'pc');
};
var ex = exports.ex = function ex(val) {
  return dimension(val, 'ex');
};

var dimensions = exports.dimensions = {
  px: px, percent: percent, inch: inch, mm: mm, vh: vh, vw: vw, rad: rad, pt: pt, cm: cm, vmin: vmin, pc: pc, ex: ex, dimension: dimension, dim: dim
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sZXNzbHkuanMiXSwibmFtZXMiOlsidGhlbWUiLCJkaW1lbnNpb24iLCJ2YWx1ZSIsInBhcnNlIiwiY2FtZWxDYXNlVG9EYXNoIiwia2V5IiwicmVwbGFjZSIsInRvTG93ZXJDYXNlIiwicGFyc2VWYXJzIiwic3RyIiwidmFycyIsImtleXMiLCJPYmplY3QiLCJzb3J0IiwiYSIsImIiLCJsZW5ndGgiLCJyZWR1Y2UiLCJwb2ludGVyIiwicmVwbGFjZW1lbnQiLCJfa2V5IiwiZGFzaEtleSIsImxlc3NseSIsImZpbmFsc3RyIiwidG9DU1MiLCJiaW5kUGFyc2UiLCJmdW5jIiwiY29udmVydCIsImFyZ3MiLCJmaW5hbEFyZ3MiLCJtYXAiLCJTdHJpbmciLCJhcmciLCJyZXN1bHQiLCJpc05hTiIsIk51bWJlciIsImNhbGxhYmxlIiwiZGVmYXVsRnVuY3Rpb24iLCJzdWJWYXJzIiwiZGltZW5zaW9ucyIsImNvbG9yRnVuY3Rpb25zIiwibW9kdWxlIiwiZXhwb3J0cyIsImlzUGxhaW5PYmoiLCJvIiwiY29uc3RydWN0b3IiLCJ2YWwiLCJ1bml0Iiwic3ViVmFsIiwidW5kZWZpbmVkIiwib3AiLCJ0b09wcyIsImNvbnRhaW5zT3AiLCJkaW0iLCJzZWFyY2giLCJ0cmltIiwiam9pbiIsImdldFVuaXQiLCJnZXRWYWx1ZSIsImdldEFyZ3MiLCJzcGxpdCIsInNsaWNlIiwidmFsMiIsImRpbTEiLCJkaW0yIiwib3BlcmF0ZSIsInB4IiwicGVyY2VudCIsImVtIiwicmFkIiwicHQiLCJ2aCIsInZ3IiwiaW5jaCIsIm1tIiwidm1pbiIsImNtIiwicGMiLCJleCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztRQTJEZ0JBLEssR0FBQUEsSztRQXVDQUMsUyxHQUFBQSxTO1FBdUJBQyxLLEdBQUFBLEs7O0FBekhoQjs7OztBQXVEQTs7QUEwQ0E7Ozs7Ozs7Ozs7OztRQWhHUUMsSzs7QUFFUjs7OztBQUdBLFNBQVNDLGVBQVQsQ0FBeUJDLEdBQXpCLEVBQThC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SyxTQUFMQSxFQUFLO0FBQUEsU0FBTzdFLFVBQVU2QyxHQUFWLEVBQWUsSUFBZixDQUFQO0FBQUEsQ0FBWDs7QUFFQSxJQUFNUCxrQ0FBYTtBQUN4QjJCLFFBRHdCLEVBQ3BCQyxnQkFEb0IsRUFDWE0sVUFEVyxFQUNMQyxNQURLLEVBQ0RILE1BREMsRUFDR0MsTUFESCxFQUNPSCxRQURQLEVBQ1lDLE1BRFosRUFDZ0JNLE1BRGhCLEVBQ29CRCxVQURwQixFQUMwQkUsTUFEMUIsRUFDOEJDLE1BRDlCLEVBQ2tDN0Usb0JBRGxDLEVBQzZDb0Q7QUFEN0MsQ0FBbkIiLCJmaWxlIjoibGVzc2x5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhcnNlIGZyb20gJy4vcGFyc2VyL3BhcnNlcidcbmV4cG9ydCB7cGFyc2V9O1xuXG4vKlxuICBDb252ZXJ0cyBjYW1lbENhc2UgdG8gY2FtZWwtY2FzZVxuICovXG5mdW5jdGlvbiBjYW1lbENhc2VUb0Rhc2goa2V5KSB7XG4gIHJldHVybiBrZXkucmVwbGFjZSggLyhbYS16XSkoW0EtWl0pL2csICckMS0kMicgKS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKlxuIFBhcnNlcyBAdmFyIHdpdGgge3ZhcjogJ3ZhbHVlJ31cbiAqL1xuZnVuY3Rpb24gcGFyc2VWYXJzKHN0ciwgdmFycyA9IHt9KSB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh2YXJzKTtcbiAga2V5cy5zb3J0KGZ1bmN0aW9uKGEsIGIpe1xuICAgIHJldHVybiBiLmxlbmd0aCAtIGEubGVuZ3RoO1xuICB9KTtcbiAgcmV0dXJuIGtleXMucmVkdWNlKChwb2ludGVyLCBrZXkpID0+IHtcbiAgICBjb25zdCByZXBsYWNlbWVudCA9IHZhcnNba2V5XTtcbiAgICBjb25zdCBfa2V5ID0ga2V5WzBdID09PSAnQCcgPyBrZXkgOiBgQCR7a2V5fWA7XG4gICAgY29uc3QgZGFzaEtleSA9IGNhbWVsQ2FzZVRvRGFzaChfa2V5KTtcbiAgICBpZiAoZGFzaEtleSAhPT0gX2tleSkge1xuICAgICAgcG9pbnRlciA9IHBvaW50ZXIucmVwbGFjZShkYXNoS2V5LCByZXBsYWNlbWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvaW50ZXIucmVwbGFjZShfa2V5LCByZXBsYWNlbWVudCk7XG4gIH0sIHN0cik7XG59XG5cbi8qXG4gIFBhcnNlcyBsZXNzIGVudGl0eSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gbGVzc2x5KHN0ciwgdmFycyA9IHt9KSB7XG4gIGNvbnN0IGZpbmFsc3RyID0gcGFyc2VWYXJzKHN0ciwgdmFycyk7XG4gIHJldHVybiBwYXJzZShmaW5hbHN0cikudG9DU1MoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxlc3NseTtcbmV4cG9ydCB7bGVzc2x5fTtcblxuLy8gZXhwb3J0IGZ1bmN0aW9uc1xuXG4vLyBwYXJzZSBmdW5jdGlvbiBhcmdzIHNvIHdlIGRvbnQgbmVlZCB0byBleHBvc2UgQ29sb3IgTm9kZVxuZnVuY3Rpb24gYmluZFBhcnNlKGZ1bmMsIHZhcnMsIGNvbnZlcnQgPSB0cnVlKSB7XG4gIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgIGNvbnN0IGZpbmFsQXJncyA9IGFyZ3MubWFwKGFyZyA9PiBwYXJzZVZhcnMoU3RyaW5nKGFyZyksIHZhcnMpKTtcbiAgICBsZXQgcmVzdWx0ID0gZnVuYyguLi5maW5hbEFyZ3MubWFwKCguLi5hcmdTZXQpID0+IGNvbnZlcnQgPyBwYXJzZSguLi5hcmdTZXQpIDogYXJnU2V0WzBdKSk7XG4gICAgaWYgKGNvbnZlcnQpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC50b0NTUygpO1xuICAgIH1cbiAgICByZXR1cm4gaXNOYU4ocmVzdWx0KSA/IHJlc3VsdCA6IE51bWJlcihyZXN1bHQpO1xuICB9O1xufVxuXG5pbXBvcnQge2NhbGxhYmxlfSBmcm9tICcuL2Z1bmN0aW9ucyc7XG5cbmV4cG9ydCB7Y2FsbGFibGV9O1xuXG5leHBvcnQgZnVuY3Rpb24gdGhlbWUodmFycyA9IHt9KSB7XG4gIGxldCBkZWZhdWxGdW5jdGlvbiA9IChzdHIsIHN1YlZhcnMgPSB7fSkgPT4ge1xuICAgIHJldHVybiBsZXNzbHkoc3RyLCB7Li4udmFycywgLi4uc3ViVmFyc30pO1xuICB9O1xuXG4gIGRlZmF1bEZ1bmN0aW9uID0gT2JqZWN0LmtleXMoY2FsbGFibGUpLnJlZHVjZSgocG9pbnRlciwga2V5KSA9PiB7XG4gICAgY29uc3QgZnVuYyA9IGNhbGxhYmxlW2tleV07XG4gICAgcG9pbnRlcltrZXldID0gYmluZFBhcnNlKGZ1bmMsIHZhcnMpO1xuICAgIHJldHVybiBwb2ludGVyO1xuICB9LCBkZWZhdWxGdW5jdGlvbik7XG5cbiAgZGVmYXVsRnVuY3Rpb24gPSBPYmplY3Qua2V5cyhkaW1lbnNpb25zKS5yZWR1Y2UoKHBvaW50ZXIsIGtleSkgPT4ge1xuICAgIGNvbnN0IGZ1bmMgPSBkaW1lbnNpb25zW2tleV07XG4gICAgcG9pbnRlcltrZXldID0gYmluZFBhcnNlKGZ1bmMsIHZhcnMsIGZhbHNlKTtcbiAgICByZXR1cm4gcG9pbnRlcjtcbiAgfSwgZGVmYXVsRnVuY3Rpb24pO1xuXG4gIHJldHVybiBkZWZhdWxGdW5jdGlvbjtcbn1cblxuY29uc3QgY29sb3JGdW5jdGlvbnMgPSBPYmplY3Qua2V5cyhjYWxsYWJsZSkucmVkdWNlKChwb2ludGVyLCBrZXkpID0+IHtcbiAgY29uc3QgZnVuYyA9IGNhbGxhYmxlW2tleV07XG4gIHJldHVybiB7XG4gICAgLi4ucG9pbnRlcixcbiAgICBba2V5XTogYmluZFBhcnNlKGZ1bmMpXG4gIH07XG59LCB7fSk7XG5cbmV4cG9ydCB7Y29sb3JGdW5jdGlvbnN9O1xuXG5mb3IobGV0IGtleSBpbiBjb2xvckZ1bmN0aW9ucykge1xuICBtb2R1bGUuZXhwb3J0c1trZXldID0gY29sb3JGdW5jdGlvbnNba2V5XTtcbn1cblxuZnVuY3Rpb24gaXNQbGFpbk9iaihvKSB7XG4gIHJldHVybiB0eXBlb2YgbyA9PSAnb2JqZWN0JyAmJiBvLmNvbnN0cnVjdG9yID09IE9iamVjdDtcbn1cblxuaW1wb3J0IERpbWVuc2lvbiBmcm9tICcuL3RyZWUvZGltZW5zaW9uJztcbmV4cG9ydCBmdW5jdGlvbiBkaW1lbnNpb24odmFsLCB1bml0LCAuLi5hcmdzKSB7XG4gIGlmIChpc1BsYWluT2JqKHZhbCkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModmFsKS5yZWR1Y2UoZnVuY3Rpb24ocG9pbnRlciwga2V5KXtcbiAgICAgIGNvbnN0IHN1YlZhbCA9IHZhbFtrZXldO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ucG9pbnRlcixcbiAgICAgICAgW2tleV06IGRpbWVuc2lvbihzdWJWYWwsIHVuaXQsIC4uLmFyZ3MpXG4gICAgICB9O1xuICAgIH0sIHt9KTtcbiAgfVxuICBpZiAodW5pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG9wKHZhbCk7XG4gIH1cbiAgaWYgKGFyZ3MubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG9wKHRvT3BzKHZhbCwgdW5pdCwgLi4uYXJncykpO1xuICB9XG4gIGlmIChjb250YWluc09wKHZhbCkgfHwgY29udGFpbnNPcCh1bml0KSkge1xuICAgIHJldHVybiBvcCh0b09wcyh2YWwsIHVuaXQpKTtcbiAgfVxuICBjb25zdCBkaW0gPSBuZXcgRGltZW5zaW9uKHZhbCwgdW5pdCk7XG4gIHJldHVybiBkaW0udG9DU1MoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlKHZhbCkge1xuICBjb25zdCBkaW0gPSBuZXcgRGltZW5zaW9uKHZhbCwgdW5pdCk7XG4gIHJldHVybiBOdW1iZXIoZGltLnRvQ1NTKCkpO1xufVxuXG5mdW5jdGlvbiBjb250YWluc09wKHZhbCkge1xuICByZXR1cm4gdmFsLnNlYXJjaCAmJiB2YWwuc2VhcmNoKC9bXFwrXFwqXFwtXFwvXS8pID4gLTE7XG59XG5cbmZ1bmN0aW9uIHRvT3BzKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIGFyZ3MubWFwKGFyZyA9PiBhcmcudHJpbSA/IGFyZy50cmltKCkgOiBhcmcpLmpvaW4oJyAnKTtcbn1cblxuZnVuY3Rpb24gZ2V0VW5pdChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bMC05XFxzXS9naSwgJycpO1xufVxuXG5mdW5jdGlvbiBnZXRWYWx1ZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXjAtOV0vZ2ksICcnKTtcbn1cblxuZnVuY3Rpb24gZ2V0QXJncyhzdHIpIHtcbiAgcmV0dXJuIFtnZXRWYWx1ZShzdHIpLCBnZXRVbml0KHN0cildO1xufVxuXG5mdW5jdGlvbiBvcCh2YWwpIHtcbiAgbGV0IFtyZXN1bHQsIC4uLmFyZ3NdID0gdmFsLnNwbGl0KCcgJyk7XG4gIGlmIChhcmdzLmxlbmd0aCA8IDIpIHtcbiAgICBjb25zdCBkaW0gPSBuZXcgRGltZW5zaW9uKHJlc3VsdCk7XG4gICAgcmV0dXJuIGRpbS50b0NTUygpO1xuICB9XG4gIHJlc3VsdCA9IG5ldyBEaW1lbnNpb24oLi4uZ2V0QXJncyhyZXN1bHQpKTtcbiAgd2hpbGUoYXJncy5sZW5ndGggPj0gMikge1xuICAgIGNvbnN0IFtvcCwgdmFsMl0gPSBhcmdzLnNsaWNlKDAsIDIpO1xuICAgIGFyZ3MgPSBhcmdzLnNsaWNlKDIpO1xuICAgIGNvbnN0IGRpbTEgPSByZXN1bHQ7XG4gICAgY29uc3QgZGltMiA9IG5ldyBEaW1lbnNpb24oLi4uZ2V0QXJncyh2YWwyKSk7XG4gICAgcmVzdWx0ID0gZGltMS5vcGVyYXRlKHt9LCBvcCwgZGltMik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC50b0NTUygpO1xufVxuXG5leHBvcnQgY29uc3QgZGltID0gZGltZW5zaW9uO1xuZXhwb3J0IGNvbnN0IHB4ID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICdweCcpO1xuZXhwb3J0IGNvbnN0IHBlcmNlbnQgPSB2YWwgPT4gZGltZW5zaW9uKHZhbCwgJyUnKTtcbmV4cG9ydCBjb25zdCBlbSA9IHZhbCA9PiBkaW1lbnNpb24odmFsLCAnZW0nKTtcbmV4cG9ydCBjb25zdCByYWQgPSB2YWwgPT4gZGltZW5zaW9uKHZhbCwgJ3JhZCcpO1xuZXhwb3J0IGNvbnN0IHB0ID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICdwdCcpO1xuZXhwb3J0IGNvbnN0IHZoID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICd2aCcpO1xuZXhwb3J0IGNvbnN0IHZ3ID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICd2dycpO1xuZXhwb3J0IGNvbnN0IGluY2ggPSB2YWwgPT4gZGltZW5zaW9uKHZhbCwgJ2luJyk7XG5leHBvcnQgY29uc3QgbW0gPSB2YWwgPT4gZGltZW5zaW9uKHZhbCwgJ21tJyk7XG5leHBvcnQgY29uc3Qgdm1pbiA9IHZhbCA9PiBkaW1lbnNpb24odmFsLCAndm1pbicpO1xuZXhwb3J0IGNvbnN0IGNtID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICdjbScpO1xuZXhwb3J0IGNvbnN0IHBjID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICdwYycpO1xuZXhwb3J0IGNvbnN0IGV4ID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICdleCcpO1xuXG5leHBvcnQgY29uc3QgZGltZW5zaW9ucyA9IHtcbiAgcHgsIHBlcmNlbnQsIGluY2gsIG1tLCB2aCwgdncsIHJhZCwgcHQsIGNtLCB2bWluLCBwYywgZXgsIGRpbWVuc2lvbiwgZGltXG59O1xuIl19