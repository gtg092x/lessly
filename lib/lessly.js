'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ex = exports.pc = exports.cm = exports.vmin = exports.mm = exports.inch = exports.vw = exports.vh = exports.pt = exports.rad = exports.em = exports.percent = exports.px = exports.dim = exports.colorFunctions = exports.callable = exports.lessly = exports.parse = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var finalArgs = args.map(function (arg) {
      return parseVars(String(arg), vars);
    });
    var result = func.apply(undefined, _toConsumableArray(finalArgs.map(_parser2.default))).toCSS();
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

  return Object.keys(_functions.callable).reduce(function (pointer, key) {
    var func = _functions.callable[key];
    pointer[key] = bindParse(func, vars);
    return pointer;
  }, defaulFunction);
}

var colorFunctions = Object.keys(_functions.callable).reduce(function (pointer, key) {
  var func = _functions.callable[key];
  return _extends({}, pointer, _defineProperty({}, key, bindParse(func)));
}, {});

exports.colorFunctions = colorFunctions;


for (var key in colorFunctions) {
  module.exports[key] = colorFunctions[key];
}

function dimension(val, unit) {
  if (unit === undefined) {
    return op(val);
  }

  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key3 = 2; _key3 < _len2; _key3++) {
    args[_key3 - 2] = arguments[_key3];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sZXNzbHkuanMiXSwibmFtZXMiOlsidGhlbWUiLCJkaW1lbnNpb24iLCJ2YWx1ZSIsInBhcnNlIiwiY2FtZWxDYXNlVG9EYXNoIiwia2V5IiwicmVwbGFjZSIsInRvTG93ZXJDYXNlIiwicGFyc2VWYXJzIiwic3RyIiwidmFycyIsImtleXMiLCJPYmplY3QiLCJzb3J0IiwiYSIsImIiLCJsZW5ndGgiLCJyZWR1Y2UiLCJwb2ludGVyIiwicmVwbGFjZW1lbnQiLCJfa2V5IiwiZGFzaEtleSIsImxlc3NseSIsImZpbmFsc3RyIiwidG9DU1MiLCJiaW5kUGFyc2UiLCJmdW5jIiwiYXJncyIsImZpbmFsQXJncyIsIm1hcCIsIlN0cmluZyIsImFyZyIsInJlc3VsdCIsImlzTmFOIiwiTnVtYmVyIiwiY2FsbGFibGUiLCJkZWZhdWxGdW5jdGlvbiIsInN1YlZhcnMiLCJjb2xvckZ1bmN0aW9ucyIsIm1vZHVsZSIsImV4cG9ydHMiLCJ2YWwiLCJ1bml0IiwidW5kZWZpbmVkIiwib3AiLCJ0b09wcyIsImNvbnRhaW5zT3AiLCJkaW0iLCJzZWFyY2giLCJ0cmltIiwiam9pbiIsImdldFVuaXQiLCJnZXRWYWx1ZSIsImdldEFyZ3MiLCJzcGxpdCIsInNsaWNlIiwidmFsMiIsImRpbTEiLCJkaW0yIiwib3BlcmF0ZSIsInB4IiwicGVyY2VudCIsImVtIiwicmFkIiwicHQiLCJ2aCIsInZ3IiwiaW5jaCIsIm1tIiwidm1pbiIsImNtIiwicGMiLCJleCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7UUF3RGdCQSxLLEdBQUFBLEs7UUEyQkFDLFMsR0FBQUEsUztRQWNBQyxLLEdBQUFBLEs7O0FBakdoQjs7OztBQW9EQTs7QUE4QkE7Ozs7Ozs7Ozs7OztRQWpGUUMsSzs7QUFFUjs7OztBQUdBLFNBQVNDLGVBQVQsQ0FBeUJDLEdBQXpCLEVBQThCO0FBQzVCLFNBQU9BLElBQUlDLE9BQUosQ0FBYSxpQkFBYixFQUFnQyxPQUFoQyxFQUEwQ0MsV0FBMUMsRUFBUDtB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SUFBTThCLGtCQUFLLFNBQUxBLEVBQUs7QUFBQSxTQUFPdEUsVUFBVXdDLEdBQVYsRUFBZSxJQUFmLENBQVA7QUFBQSxDQUFYO0FBQ0EsSUFBTStCLGtCQUFLLFNBQUxBLEVBQUs7QUFBQSxTQUFPdkUsVUFBVXdDLEdBQVYsRUFBZSxJQUFmLENBQVA7QUFBQSxDQUFYIiwiZmlsZSI6Imxlc3NseS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXJzZSBmcm9tICcuL3BhcnNlci9wYXJzZXInXG5leHBvcnQge3BhcnNlfTtcblxuLypcbiAgQ29udmVydHMgY2FtZWxDYXNlIHRvIGNhbWVsLWNhc2VcbiAqL1xuZnVuY3Rpb24gY2FtZWxDYXNlVG9EYXNoKGtleSkge1xuICByZXR1cm4ga2V5LnJlcGxhY2UoIC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInICkudG9Mb3dlckNhc2UoKTtcbn1cblxuLypcbiBQYXJzZXMgQHZhciB3aXRoIHt2YXI6ICd2YWx1ZSd9XG4gKi9cbmZ1bmN0aW9uIHBhcnNlVmFycyhzdHIsIHZhcnMgPSB7fSkge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModmFycyk7XG4gIGtleXMuc29ydChmdW5jdGlvbihhLCBiKXtcbiAgICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDtcbiAgfSk7XG4gIHJldHVybiBrZXlzLnJlZHVjZSgocG9pbnRlciwga2V5KSA9PiB7XG4gICAgY29uc3QgcmVwbGFjZW1lbnQgPSB2YXJzW2tleV07XG4gICAgY29uc3QgX2tleSA9IGtleVswXSA9PT0gJ0AnID8ga2V5IDogYEAke2tleX1gO1xuICAgIGNvbnN0IGRhc2hLZXkgPSBjYW1lbENhc2VUb0Rhc2goX2tleSk7XG4gICAgaWYgKGRhc2hLZXkgIT09IF9rZXkpIHtcbiAgICAgIHBvaW50ZXIgPSBwb2ludGVyLnJlcGxhY2UoZGFzaEtleSwgcmVwbGFjZW1lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBwb2ludGVyLnJlcGxhY2UoX2tleSwgcmVwbGFjZW1lbnQpO1xuICB9LCBzdHIpO1xufVxuXG4vKlxuICBQYXJzZXMgbGVzcyBlbnRpdHkgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGxlc3NseShzdHIsIHZhcnMgPSB7fSkge1xuICBjb25zdCBmaW5hbHN0ciA9IHBhcnNlVmFycyhzdHIsIHZhcnMpO1xuICByZXR1cm4gcGFyc2UoZmluYWxzdHIpLnRvQ1NTKCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBsZXNzbHk7XG5leHBvcnQge2xlc3NseX07XG5cbi8vIGV4cG9ydCBmdW5jdGlvbnNcblxuLy8gcGFyc2UgZnVuY3Rpb24gYXJncyBzbyB3ZSBkb250IG5lZWQgdG8gZXhwb3NlIENvbG9yIE5vZGVcbmZ1bmN0aW9uIGJpbmRQYXJzZShmdW5jLCB2YXJzKSB7XG4gIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgIGNvbnN0IGZpbmFsQXJncyA9IGFyZ3MubWFwKGFyZyA9PiBwYXJzZVZhcnMoU3RyaW5nKGFyZyksIHZhcnMpKTtcbiAgICBjb25zdCByZXN1bHQgPSBmdW5jKC4uLmZpbmFsQXJncy5tYXAocGFyc2UpKS50b0NTUygpO1xuICAgIHJldHVybiBpc05hTihyZXN1bHQpID8gcmVzdWx0IDogTnVtYmVyKHJlc3VsdCk7XG4gIH07XG59XG5cbmltcG9ydCB7Y2FsbGFibGV9IGZyb20gJy4vZnVuY3Rpb25zJztcblxuZXhwb3J0IHtjYWxsYWJsZX07XG5cbmV4cG9ydCBmdW5jdGlvbiB0aGVtZSh2YXJzID0ge30pIHtcbiAgY29uc3QgZGVmYXVsRnVuY3Rpb24gPSAoc3RyLCBzdWJWYXJzID0ge30pID0+IHtcbiAgICByZXR1cm4gbGVzc2x5KHN0ciwgey4uLnZhcnMsIC4uLnN1YlZhcnN9KTtcbiAgfTtcblxuICByZXR1cm4gT2JqZWN0LmtleXMoY2FsbGFibGUpLnJlZHVjZSgocG9pbnRlciwga2V5KSA9PiB7XG4gICAgY29uc3QgZnVuYyA9IGNhbGxhYmxlW2tleV07XG4gICAgcG9pbnRlcltrZXldID0gYmluZFBhcnNlKGZ1bmMsIHZhcnMpO1xuICAgIHJldHVybiBwb2ludGVyO1xuICB9LCBkZWZhdWxGdW5jdGlvbik7XG59XG5cbmNvbnN0IGNvbG9yRnVuY3Rpb25zID0gT2JqZWN0LmtleXMoY2FsbGFibGUpLnJlZHVjZSgocG9pbnRlciwga2V5KSA9PiB7XG4gIGNvbnN0IGZ1bmMgPSBjYWxsYWJsZVtrZXldO1xuICByZXR1cm4ge1xuICAgIC4uLnBvaW50ZXIsXG4gICAgW2tleV06IGJpbmRQYXJzZShmdW5jKVxuICB9O1xufSwge30pO1xuXG5leHBvcnQge2NvbG9yRnVuY3Rpb25zfTtcblxuZm9yKGxldCBrZXkgaW4gY29sb3JGdW5jdGlvbnMpIHtcbiAgbW9kdWxlLmV4cG9ydHNba2V5XSA9IGNvbG9yRnVuY3Rpb25zW2tleV07XG59XG5cbmltcG9ydCBEaW1lbnNpb24gZnJvbSAnLi90cmVlL2RpbWVuc2lvbic7XG5leHBvcnQgZnVuY3Rpb24gZGltZW5zaW9uKHZhbCwgdW5pdCwgLi4uYXJncykge1xuICBpZiAodW5pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG9wKHZhbCk7XG4gIH1cbiAgaWYgKGFyZ3MubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG9wKHRvT3BzKHZhbCwgdW5pdCwgLi4uYXJncykpO1xuICB9XG4gIGlmIChjb250YWluc09wKHZhbCkgfHwgY29udGFpbnNPcCh1bml0KSkge1xuICAgIHJldHVybiBvcCh0b09wcyh2YWwsIHVuaXQpKTtcbiAgfVxuICBjb25zdCBkaW0gPSBuZXcgRGltZW5zaW9uKHZhbCwgdW5pdCk7XG4gIHJldHVybiBkaW0udG9DU1MoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbHVlKHZhbCkge1xuICBjb25zdCBkaW0gPSBuZXcgRGltZW5zaW9uKHZhbCwgdW5pdCk7XG4gIHJldHVybiBOdW1iZXIoZGltLnRvQ1NTKCkpO1xufVxuXG5mdW5jdGlvbiBjb250YWluc09wKHZhbCkge1xuICByZXR1cm4gdmFsLnNlYXJjaCAmJiB2YWwuc2VhcmNoKC9bXFwrXFwqXFwtXFwvXS8pID4gLTE7XG59XG5cbmZ1bmN0aW9uIHRvT3BzKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIGFyZ3MubWFwKGFyZyA9PiBhcmcudHJpbSA/IGFyZy50cmltKCkgOiBhcmcpLmpvaW4oJyAnKTtcbn1cblxuZnVuY3Rpb24gZ2V0VW5pdChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bMC05XFxzXS9naSwgJycpO1xufVxuXG5mdW5jdGlvbiBnZXRWYWx1ZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXjAtOV0vZ2ksICcnKTtcbn1cblxuZnVuY3Rpb24gZ2V0QXJncyhzdHIpIHtcbiAgcmV0dXJuIFtnZXRWYWx1ZShzdHIpLCBnZXRVbml0KHN0cildO1xufVxuXG5mdW5jdGlvbiBvcCh2YWwpIHtcbiAgbGV0IFtyZXN1bHQsIC4uLmFyZ3NdID0gdmFsLnNwbGl0KCcgJyk7XG4gIGlmIChhcmdzLmxlbmd0aCA8IDIpIHtcbiAgICBjb25zdCBkaW0gPSBuZXcgRGltZW5zaW9uKHJlc3VsdCk7XG4gICAgcmV0dXJuIGRpbS50b0NTUygpO1xuICB9XG4gIHJlc3VsdCA9IG5ldyBEaW1lbnNpb24oLi4uZ2V0QXJncyhyZXN1bHQpKTtcbiAgd2hpbGUoYXJncy5sZW5ndGggPj0gMikge1xuICAgIGNvbnN0IFtvcCwgdmFsMl0gPSBhcmdzLnNsaWNlKDAsIDIpO1xuICAgIGFyZ3MgPSBhcmdzLnNsaWNlKDIpO1xuICAgIGNvbnN0IGRpbTEgPSByZXN1bHQ7XG4gICAgY29uc3QgZGltMiA9IG5ldyBEaW1lbnNpb24oLi4uZ2V0QXJncyh2YWwyKSk7XG4gICAgcmVzdWx0ID0gZGltMS5vcGVyYXRlKHt9LCBvcCwgZGltMik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC50b0NTUygpO1xufVxuXG5leHBvcnQgY29uc3QgZGltID0gZGltZW5zaW9uO1xuZXhwb3J0IGNvbnN0IHB4ID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICdweCcpO1xuZXhwb3J0IGNvbnN0IHBlcmNlbnQgPSB2YWwgPT4gZGltZW5zaW9uKHZhbCwgJyUnKTtcbmV4cG9ydCBjb25zdCBlbSA9IHZhbCA9PiBkaW1lbnNpb24odmFsLCAnZW0nKTtcbmV4cG9ydCBjb25zdCByYWQgPSB2YWwgPT4gZGltZW5zaW9uKHZhbCwgJ3JhZCcpO1xuZXhwb3J0IGNvbnN0IHB0ID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICdwdCcpO1xuZXhwb3J0IGNvbnN0IHZoID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICd2aCcpO1xuZXhwb3J0IGNvbnN0IHZ3ID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICd2dycpO1xuZXhwb3J0IGNvbnN0IGluY2ggPSB2YWwgPT4gZGltZW5zaW9uKHZhbCwgJ2luJyk7XG5leHBvcnQgY29uc3QgbW0gPSB2YWwgPT4gZGltZW5zaW9uKHZhbCwgJ21tJyk7XG5leHBvcnQgY29uc3Qgdm1pbiA9IHZhbCA9PiBkaW1lbnNpb24odmFsLCAndm1pbicpO1xuZXhwb3J0IGNvbnN0IGNtID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICdjbScpO1xuZXhwb3J0IGNvbnN0IHBjID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICdwYycpO1xuZXhwb3J0IGNvbnN0IGV4ID0gdmFsID0+IGRpbWVuc2lvbih2YWwsICdleCcpO1xuIl19