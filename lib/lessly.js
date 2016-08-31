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

var _utils = require('./utils');

var _functions = require('./functions');

var _dimension = require('./tree/dimension');

var _dimension2 = _interopRequireDefault(_dimension);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.parse = _parser2.default;

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
    var dashKey = (0, _utils.camelCaseToDash)(_key);
    if (dashKey !== _key) {
      pointer = pointer.replace(dashKey, replacement);
    }

    return pointer.replace(_key, replacement);
  }, str);
}

function containsCall(str) {
  return str.trim().search(/\)$/) > -1;
}

function isDimension(str) {
  return typeof str === "number" || containsOp(str) || !containsCall(str) && containsUnit(str);
}

/*
  Parses less entity string
 */
function lessly(str) {
  var vars = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var finalstr = parseVars(str, vars);

  if (isPlainObj(str)) {
    return Object.keys(str).reduce(function (pointer, key) {
      var subVal = str[key];
      return _extends({}, pointer, _defineProperty({}, key, lessly(subVal, vars)));
    }, {});
  }

  if (isDimension(parseVars(str, vars))) {
    return dimension(parseVars(str, vars));
  }

  return (0, _parser2.default)(finalstr).toCSS();
}

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

function containsUnit(val) {
  var units = Object.keys(dimensions);
  for (var i = 0; i < units.length; i++) {
    var reg = new RegExp(units[i] + '/b');
    if (val.search && val.trim().search(reg) > -1) {
      return true;
    }
  }
  return false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sZXNzbHkuanMiXSwibmFtZXMiOlsidGhlbWUiLCJkaW1lbnNpb24iLCJ2YWx1ZSIsInBhcnNlIiwicGFyc2VWYXJzIiwic3RyIiwidmFycyIsImtleXMiLCJPYmplY3QiLCJzb3J0IiwiYSIsImIiLCJsZW5ndGgiLCJyZWR1Y2UiLCJwb2ludGVyIiwia2V5IiwicmVwbGFjZW1lbnQiLCJfa2V5IiwiZGFzaEtleSIsInJlcGxhY2UiLCJjb250YWluc0NhbGwiLCJ0cmltIiwic2VhcmNoIiwiaXNEaW1lbnNpb24iLCJjb250YWluc09wIiwiY29udGFpbnNVbml0IiwibGVzc2x5IiwiZmluYWxzdHIiLCJpc1BsYWluT2JqIiwic3ViVmFsIiwidG9DU1MiLCJiaW5kUGFyc2UiLCJmdW5jIiwiY29udmVydCIsImFyZ3MiLCJmaW5hbEFyZ3MiLCJtYXAiLCJTdHJpbmciLCJhcmciLCJyZXN1bHQiLCJpc05hTiIsIk51bWJlciIsImNhbGxhYmxlIiwiZGVmYXVsRnVuY3Rpb24iLCJzdWJWYXJzIiwiZGltZW5zaW9ucyIsImNvbG9yRnVuY3Rpb25zIiwibW9kdWxlIiwiZXhwb3J0cyIsIm8iLCJjb25zdHJ1Y3RvciIsInZhbCIsInVuaXQiLCJ1bmRlZmluZWQiLCJvcCIsInRvT3BzIiwiZGltIiwidW5pdHMiLCJpIiwicmVnIiwiUmVnRXhwIiwiam9pbiIsImdldFVuaXQiLCJnZXRWYWx1ZSIsImdldEFyZ3MiLCJzcGxpdCIsInNsaWNlIiwidmFsMiIsImRpbTEiLCJkaW0yIiwib3BlcmF0ZSIsInB4IiwicGVyY2VudCIsImVtIiwicmFkIiwicHQiLCJ2aCIsInZ3IiwiaW5jaCIsIm1tIiwidm1pbiIsImNtIiwicGMiLCJleCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztRQTRFZ0JBLEssR0FBQUEsSztRQXVDQUMsUyxHQUFBQSxTO1FBdUJBQyxLLEdBQUFBLEs7O0FBMUloQjs7OztBQUNBOztBQXVFQTs7QUEwQ0E7Ozs7Ozs7Ozs7OztRQWhIUUMs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WDtBQUNBLElBQU1nQyxrQkFBSyxTQUFMQSxFQUFLO0FBQUEsU0FBT2xGLFVBQVVrRCxHQUFWLEVBQWUsSUFBZixDQUFQO0FBQUEsQ0FBWDs7QUFFQSxJQUFNTixrQ0FBYTtBQUN4QjBCLFFBRHdCLEVBQ3BCQyxnQkFEb0IsRUFDWE0sVUFEVyxFQUNMQyxNQURLLEVBQ0RILE1BREMsRUFDR0MsTUFESCxFQUNPSCxRQURQLEVBQ1lDLE1BRFosRUFDZ0JNLE1BRGhCLEVBQ29CRCxVQURwQixFQUMwQkUsTUFEMUIsRUFDOEJDLE1BRDlCLEVBQ2tDbEYsb0JBRGxDLEVBQzZDdUQ7QUFEN0MsQ0FBbkIiLCJmaWxlIjoibGVzc2x5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhcnNlIGZyb20gJy4vcGFyc2VyL3BhcnNlcidcbmltcG9ydCB7IGNhbWVsQ2FzZVRvRGFzaCB9IGZyb20gJy4vdXRpbHMnO1xuZXhwb3J0IHtwYXJzZX07XG5cbi8qXG4gUGFyc2VzIEB2YXIgd2l0aCB7dmFyOiAndmFsdWUnfVxuICovXG5mdW5jdGlvbiBwYXJzZVZhcnMoc3RyLCB2YXJzID0ge30pIHtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHZhcnMpO1xuICBrZXlzLnNvcnQoZnVuY3Rpb24oYSwgYil7XG4gICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XG4gIH0pO1xuICByZXR1cm4ga2V5cy5yZWR1Y2UoKHBvaW50ZXIsIGtleSkgPT4ge1xuICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gdmFyc1trZXldO1xuICAgIGNvbnN0IF9rZXkgPSBrZXlbMF0gPT09ICdAJyA/IGtleSA6IGBAJHtrZXl9YDtcbiAgICBjb25zdCBkYXNoS2V5ID0gY2FtZWxDYXNlVG9EYXNoKF9rZXkpO1xuICAgIGlmIChkYXNoS2V5ICE9PSBfa2V5KSB7XG4gICAgICBwb2ludGVyID0gcG9pbnRlci5yZXBsYWNlKGRhc2hLZXksIHJlcGxhY2VtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcG9pbnRlci5yZXBsYWNlKF9rZXksIHJlcGxhY2VtZW50KTtcbiAgfSwgc3RyKTtcbn1cblxuZnVuY3Rpb24gY29udGFpbnNDYWxsKHN0cikge1xuICByZXR1cm4gc3RyLnRyaW0oKS5zZWFyY2goL1xcKSQvKSA+IC0xO1xufVxuXG5mdW5jdGlvbiBpc0RpbWVuc2lvbihzdHIpIHtcbiAgcmV0dXJuIHR5cGVvZiBzdHIgPT09IFwibnVtYmVyXCIgfHwgY29udGFpbnNPcChzdHIpIHx8ICghY29udGFpbnNDYWxsKHN0cikgJiYgY29udGFpbnNVbml0KHN0cikpO1xufVxuXG4vKlxuICBQYXJzZXMgbGVzcyBlbnRpdHkgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGxlc3NseShzdHIsIHZhcnMgPSB7fSkge1xuICBjb25zdCBmaW5hbHN0ciA9IHBhcnNlVmFycyhzdHIsIHZhcnMpO1xuXG4gIGlmIChpc1BsYWluT2JqKHN0cikpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc3RyKS5yZWR1Y2UoZnVuY3Rpb24ocG9pbnRlciwga2V5KXtcbiAgICAgIGNvbnN0IHN1YlZhbCA9IHN0cltrZXldO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ucG9pbnRlcixcbiAgICAgICAgW2tleV06IGxlc3NseShzdWJWYWwsIHZhcnMpXG4gICAgICB9O1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIGlmIChpc0RpbWVuc2lvbihwYXJzZVZhcnMoc3RyLCB2YXJzKSkpIHtcbiAgICByZXR1cm4gZGltZW5zaW9uKHBhcnNlVmFycyhzdHIsIHZhcnMpKTtcbiAgfVxuXG4gIHJldHVybiBwYXJzZShmaW5hbHN0cikudG9DU1MoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGVzc2x5O1xuZXhwb3J0IHtsZXNzbHl9O1xuXG4vLyBleHBvcnQgZnVuY3Rpb25zXG5cbi8vIHBhcnNlIGZ1bmN0aW9uIGFyZ3Mgc28gd2UgZG9udCBuZWVkIHRvIGV4cG9zZSBDb2xvciBOb2RlXG5mdW5jdGlvbiBiaW5kUGFyc2UoZnVuYywgdmFycywgY29udmVydCA9IHRydWUpIHtcbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgY29uc3QgZmluYWxBcmdzID0gYXJncy5tYXAoYXJnID0+IHBhcnNlVmFycyhTdHJpbmcoYXJnKSwgdmFycykpO1xuICAgIGxldCByZXN1bHQgPSBmdW5jKC4uLmZpbmFsQXJncy5tYXAoKC4uLmFyZ1NldCkgPT4gY29udmVydCA/IHBhcnNlKC4uLmFyZ1NldCkgOiBhcmdTZXRbMF0pKTtcbiAgICBpZiAoY29udmVydCkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0LnRvQ1NTKCk7XG4gICAgfVxuICAgIHJldHVybiBpc05hTihyZXN1bHQpID8gcmVzdWx0IDogTnVtYmVyKHJlc3VsdCk7XG4gIH07XG59XG5cbmltcG9ydCB7Y2FsbGFibGV9IGZyb20gJy4vZnVuY3Rpb25zJztcblxuZXhwb3J0IHtjYWxsYWJsZX07XG5cbmV4cG9ydCBmdW5jdGlvbiB0aGVtZSh2YXJzID0ge30pIHtcbiAgbGV0IGRlZmF1bEZ1bmN0aW9uID0gKHN0ciwgc3ViVmFycyA9IHt9KSA9PiB7XG4gICAgcmV0dXJuIGxlc3NseShzdHIsIHsuLi52YXJzLCAuLi5zdWJWYXJzfSk7XG4gIH07XG5cbiAgZGVmYXVsRnVuY3Rpb24gPSBPYmplY3Qua2V5cyhjYWxsYWJsZSkucmVkdWNlKChwb2ludGVyLCBrZXkpID0+IHtcbiAgICBjb25zdCBmdW5jID0gY2FsbGFibGVba2V5XTtcbiAgICBwb2ludGVyW2tleV0gPSBiaW5kUGFyc2UoZnVuYywgdmFycyk7XG4gICAgcmV0dXJuIHBvaW50ZXI7XG4gIH0sIGRlZmF1bEZ1bmN0aW9uKTtcblxuICBkZWZhdWxGdW5jdGlvbiA9IE9iamVjdC5rZXlzKGRpbWVuc2lvbnMpLnJlZHVjZSgocG9pbnRlciwga2V5KSA9PiB7XG4gICAgY29uc3QgZnVuYyA9IGRpbWVuc2lvbnNba2V5XTtcbiAgICBwb2ludGVyW2tleV0gPSBiaW5kUGFyc2UoZnVuYywgdmFycywgZmFsc2UpO1xuICAgIHJldHVybiBwb2ludGVyO1xuICB9LCBkZWZhdWxGdW5jdGlvbik7XG5cbiAgcmV0dXJuIGRlZmF1bEZ1bmN0aW9uO1xufVxuXG5jb25zdCBjb2xvckZ1bmN0aW9ucyA9IE9iamVjdC5rZXlzKGNhbGxhYmxlKS5yZWR1Y2UoKHBvaW50ZXIsIGtleSkgPT4ge1xuICBjb25zdCBmdW5jID0gY2FsbGFibGVba2V5XTtcbiAgcmV0dXJuIHtcbiAgICAuLi5wb2ludGVyLFxuICAgIFtrZXldOiBiaW5kUGFyc2UoZnVuYylcbiAgfTtcbn0sIHt9KTtcblxuZXhwb3J0IHtjb2xvckZ1bmN0aW9uc307XG5cbmZvcihsZXQga2V5IGluIGNvbG9yRnVuY3Rpb25zKSB7XG4gIG1vZHVsZS5leHBvcnRzW2tleV0gPSBjb2xvckZ1bmN0aW9uc1trZXldO1xufVxuXG5mdW5jdGlvbiBpc1BsYWluT2JqKG8pIHtcbiAgcmV0dXJuIHR5cGVvZiBvID09ICdvYmplY3QnICYmIG8uY29uc3RydWN0b3IgPT0gT2JqZWN0O1xufVxuXG5pbXBvcnQgRGltZW5zaW9uIGZyb20gJy4vdHJlZS9kaW1lbnNpb24nO1xuZXhwb3J0IGZ1bmN0aW9uIGRpbWVuc2lvbih2YWwsIHVuaXQsIC4uLmFyZ3MpIHtcbiAgaWYgKGlzUGxhaW5PYmoodmFsKSkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh2YWwpLnJlZHVjZShmdW5jdGlvbihwb2ludGVyLCBrZXkpe1xuICAgICAgY29uc3Qgc3ViVmFsID0gdmFsW2tleV07XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5wb2ludGVyLFxuICAgICAgICBba2V5XTogZGltZW5zaW9uKHN1YlZhbCwgdW5pdCwgLi4uYXJncylcbiAgICAgIH07XG4gICAgfSwge30pO1xuICB9XG4gIGlmICh1bml0ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gb3AodmFsKTtcbiAgfVxuICBpZiAoYXJncy5sZW5ndGgpIHtcbiAgICByZXR1cm4gb3AodG9PcHModmFsLCB1bml0LCAuLi5hcmdzKSk7XG4gIH1cbiAgaWYgKGNvbnRhaW5zT3AodmFsKSB8fCBjb250YWluc09wKHVuaXQpKSB7XG4gICAgcmV0dXJuIG9wKHRvT3BzKHZhbCwgdW5pdCkpO1xuICB9XG4gIGNvbnN0IGRpbSA9IG5ldyBEaW1lbnNpb24odmFsLCB1bml0KTtcbiAgcmV0dXJuIGRpbS50b0NTUygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsdWUodmFsKSB7XG4gIGNvbnN0IGRpbSA9IG5ldyBEaW1lbnNpb24odmFsLCB1bml0KTtcbiAgcmV0dXJuIE51bWJlcihkaW0udG9DU1MoKSk7XG59XG5cbmZ1bmN0aW9uIGNvbnRhaW5zT3AodmFsKSB7XG4gIHJldHVybiB2YWwuc2VhcmNoICYmIHZhbC5zZWFyY2goL1tcXCtcXCpcXC1cXC9dLykgPiAtMTtcbn1cblxuZnVuY3Rpb24gY29udGFpbnNVbml0KHZhbCkge1xuICBjb25zdCB1bml0cyA9IE9iamVjdC5rZXlzKGRpbWVuc2lvbnMpO1xuICBmb3IobGV0IGkgPSAwOyBpIDwgdW5pdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByZWcgPSBuZXcgUmVnRXhwKHVuaXRzW2ldICsgJy9iJyk7XG4gICAgaWYodmFsLnNlYXJjaCAmJiB2YWwudHJpbSgpLnNlYXJjaChyZWcpID4gLTEpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHRvT3BzKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIGFyZ3MubWFwKGFyZyA9PiBhcmcudHJpbSA/IGFyZy50cmltKCkgOiBhcmcpLmpvaW4oJyAnKTtcbn1cblxuZnVuY3Rpb24gZ2V0VW5pdChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bMC05XFxzXS9naSwgJycpO1xufVxuXG5mdW5jdGlvbiBnZXRWYWx1ZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXjAtOV0vZ2ksICcnKTtcbn1cblxuZnVuY3Rpb24gZ2V0QXJncyhzdHIpIHtcbiAgcmV0dXJuIFtnZXRWYWx1ZShzdHIpLCBnZXRVbml0KHN0cildO1xufVxuXG5mdW5jdGlvbiBvcCh2YWwpIHtcbiAgbGV0IFtyZXN1bHQsIC4uLmFyZ3NdID0gdmFsLnNwbGl0KCcgJyk7XG4gIGlmIChhcmdzLmxlbmd0aCA8IDIpIHtcbiAgICBjb25zdCBkaW0gPSBuZXcgRGltZW5zaW9uKHJlc3VsdCk7XG4gICAgcmV0dXJuIGRpbS50b0NTUygpO1xuICB9XG4gIHJlc3VsdCA9IG5ldyBEaW1lbnNpb24oLi4uZ2V0QXJncyhyZXN1bHQpKTtcbiAgd2hpbGUoYXJncy5sZW5ndGggPj0gMikge1xuICAgIGNvbnN0IFtvcCwgdmFsMl0gPSBhcmdzLnNsaWNlKDAsIDIpO1xuICAgIGFyZ3MgPSBhcmdzLnNsaWNlKDIpO1xuICAgIGNvbnN0IGRpbTEgPSByZXN1bHQ7XG4gICAgY29uc3QgZGltMiA9IG5ldyBEaW1lbnNpb24oLi4uZ2V0QXJncyh2YWwyKSk7XG4gICAgcmVzdWx0ID0gZGltMS5vcGVyYXRlKHt9LCBvcCwgZGltMik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC50b0NTUygpO1xufVxuXG5leHBvcnQgY29uc3QgZGltID0gZGltZW5zaW9uO1xuZXhwb3J0IGNvbnN0IHB4ID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICdweCcpO1xuZXhwb3J0IGNvbnN0IHBlcmNlbnQgPSB2YWwgPT4gZGltZW5zaW9uKHZhbCwgJyUnKTtcbmV4cG9ydCBjb25zdCBlbSA9IHZhbCA9PiBkaW1lbnNpb24odmFsLCAnZW0nKTtcbmV4cG9ydCBjb25zdCByYWQgPSB2YWwgPT4gZGltZW5zaW9uKHZhbCwgJ3JhZCcpO1xuZXhwb3J0IGNvbnN0IHB0ID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICdwdCcpO1xuZXhwb3J0IGNvbnN0IHZoID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICd2aCcpO1xuZXhwb3J0IGNvbnN0IHZ3ID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICd2dycpO1xuZXhwb3J0IGNvbnN0IGluY2ggPSB2YWwgPT4gZGltZW5zaW9uKHZhbCwgJ2luJyk7XG5leHBvcnQgY29uc3QgbW0gPSB2YWwgPT4gZGltZW5zaW9uKHZhbCwgJ21tJyk7XG5leHBvcnQgY29uc3Qgdm1pbiA9IHZhbCA9PiBkaW1lbnNpb24odmFsLCAndm1pbicpO1xuZXhwb3J0IGNvbnN0IGNtID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICdjbScpO1xuZXhwb3J0IGNvbnN0IHBjID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICdwYycpO1xuZXhwb3J0IGNvbnN0IGV4ID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICdleCcpO1xuXG5leHBvcnQgY29uc3QgZGltZW5zaW9ucyA9IHtcbiAgcHgsIHBlcmNlbnQsIGluY2gsIG1tLCB2aCwgdncsIHJhZCwgcHQsIGNtLCB2bWluLCBwYywgZXgsIGRpbWVuc2lvbiwgZGltXG59O1xuIl19