'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorFunctions = exports.callable = exports.lessly = exports.parse = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.theme = theme;

var _parser = require('./parser/parser');

var _parser2 = _interopRequireDefault(_parser);

var _functions = require('./functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sZXNzbHkuanMiXSwibmFtZXMiOlsidGhlbWUiLCJwYXJzZSIsImNhbWVsQ2FzZVRvRGFzaCIsImtleSIsInJlcGxhY2UiLCJ0b0xvd2VyQ2FzZSIsInBhcnNlVmFycyIsInN0ciIsInZhcnMiLCJrZXlzIiwiT2JqZWN0Iiwic29ydCIsImEiLCJiIiwibGVuZ3RoIiwicmVkdWNlIiwicG9pbnRlciIsInJlcGxhY2VtZW50IiwiX2tleSIsImRhc2hLZXkiLCJsZXNzbHkiLCJmaW5hbHN0ciIsInRvQ1NTIiwiYmluZFBhcnNlIiwiZnVuYyIsImFyZ3MiLCJmaW5hbEFyZ3MiLCJtYXAiLCJTdHJpbmciLCJhcmciLCJyZXN1bHQiLCJpc05hTiIsIk51bWJlciIsImNhbGxhYmxlIiwiZGVmYXVsRnVuY3Rpb24iLCJzdWJWYXJzIiwiY29sb3JGdW5jdGlvbnMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUF3RGdCQSxLLEdBQUFBLEs7O0FBeERoQjs7OztBQW9EQTs7Ozs7Ozs7UUFuRFFDLEs7O0FBRVI7Ozs7QUFHQSxTQUFTQyxlQUFULENBQXlCQyxHQUF6QixFQUE4QjtBQUM1QixTQUFPQSxJQUFJQyxPQUFKLENBQWEsaUJBQWIsRUFBZ0MsT0FBaEMsRUFBMENDLFdBQTFDLEVBQVA7QUFDRDs7QUFFRDs7O0FBR0EsU0FBU0MsU0FBVCxDQUFtQkMsR0FBbkIsRUFBbUM7QUFBQSxNQUFYQyxJQUFXLHlEQUFKLEVBQUk7O0FBQ2pDLE1BQU1DLE9BQU9DLE9BQU9ELElBQVAsQ0FBWUQsSUFBWixDQUFiO0FBQ0FDLE9BQUtFLElBQUwsQ0FBVSxVQUFTQyxDQUFULEVBQVlDLENBQVosRUFBYztBQUN0QixXQUFPQSxFQUFFQyxNQUFGLEdBQVdGLEVBQUVFLE1BQXBCO0FBQ0QsR0FGRDtBQUdBLFNBQU9MLEtBQUtNLE1BQUwsQ0FBWSxVQUFDQyxPQUFELEVBQVViLEdBQVYsRUFBa0I7QUFDbkMsUUFBTWMsY0FBY1QsS0FBS0wsR0FBTCxDQUFwQjtBQUNBLFFBQU1lLE9BQU9mLElBQUksQ0FBSixNQUFXLEdBQVgsR0FBaUJBLEdBQWpCLFNBQTJCQSxHQUF4QztBQUNBLFFBQU1nQixVQUFVakIsZ0JBQWdCZ0IsSUFBaEIsQ0FBaEI7QUFDQSxRQUFJQyxZQUFZRCxJQUFoQixFQUFzQjtBQUNwQkYsZ0JBQVVBLFFBQVFaLE9BQVIsQ0FBZ0JlLE9BQWhCLEVBQXlCRixXQUF6QixDQUFWO0FBQ0Q7O0FBRUQsV0FBT0QsUUFBUVosT0FBUixDQUFnQmMsSUFBaEIsRUFBc0JELFdBQXRCLENBQVA7QUFDRCxHQVRNLEVBU0pWLEdBVEksQ0FBUDtBQVVEOztBQUVEOzs7QUFHQSxTQUFTYSxNQUFULENBQWdCYixHQUFoQixFQUFnQztBQUFBLE1BQVhDLElBQVcseURBQUosRUFBSTs7QUFDOUIsTUFBTWEsV0FBV2YsVUFBVUMsR0FBVixFQUFlQyxJQUFmLENBQWpCO0FBQ0EsU0FBTyxzQkFBTWEsUUFBTixFQUFnQkMsS0FBaEIsRUFBUDtBQUNEOztrQkFFY0YsTTtRQUNQQSxNLEdBQUFBLE07O0FBRVI7O0FBRUE7O0FBQ0EsU0FBU0csU0FBVCxDQUFtQkMsSUFBbkIsRUFBeUJoQixJQUF6QixFQUErQjtBQUM3QixTQUFPLFlBQWE7QUFBQSxzQ0FBVGlCLElBQVM7QUFBVEEsVUFBUztBQUFBOztBQUNsQixRQUFNQyxZQUFZRCxLQUFLRSxHQUFMLENBQVM7QUFBQSxhQUFPckIsVUFBVXNCLE9BQU9DLEdBQVAsQ0FBVixFQUF1QnJCLElBQXZCLENBQVA7QUFBQSxLQUFULENBQWxCO0FBQ0EsUUFBTXNCLFNBQVNOLHlDQUFRRSxVQUFVQyxHQUFWLGtCQUFSLEdBQThCTCxLQUE5QixFQUFmO0FBQ0EsV0FBT1MsTUFBTUQsTUFBTixJQUFnQkEsTUFBaEIsR0FBeUJFLE9BQU9GLE1BQVAsQ0FBaEM7QUFDRCxHQUpEO0FBS0Q7O1FBSU9HLFE7QUFFRCxTQUFTakMsS0FBVCxHQUEwQjtBQUFBLE1BQVhRLElBQVcseURBQUosRUFBSTs7QUFDL0IsTUFBTTBCLGlCQUFpQixTQUFqQkEsY0FBaUIsQ0FBQzNCLEdBQUQsRUFBdUI7QUFBQSxRQUFqQjRCLE9BQWlCLHlEQUFQLEVBQU87O0FBQzVDLFdBQU9mLE9BQU9iLEdBQVAsZUFBZ0JDLElBQWhCLEVBQXlCMkIsT0FBekIsRUFBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT3pCLE9BQU9ELElBQVAsc0JBQXNCTSxNQUF0QixDQUE2QixVQUFDQyxPQUFELEVBQVViLEdBQVYsRUFBa0I7QUFDcEQsUUFBTXFCLE9BQU8sb0JBQVNyQixHQUFULENBQWI7QUFDQWEsWUFBUWIsR0FBUixJQUFlb0IsVUFBVUMsSUFBVixFQUFnQmhCLElBQWhCLENBQWY7QUFDQSxXQUFPUSxPQUFQO0FBQ0QsR0FKTSxFQUlKa0IsY0FKSSxDQUFQO0FBS0Q7O0FBRUQsSUFBTUUsaUJBQWlCMUIsT0FBT0QsSUFBUCxzQkFBc0JNLE1BQXRCLENBQTZCLFVBQUNDLE9BQUQsRUFBVWIsR0FBVixFQUFrQjtBQUNwRSxNQUFNcUIsT0FBTyxvQkFBU3JCLEdBQVQsQ0FBYjtBQUNBLHNCQUNLYSxPQURMLHNCQUVHYixHQUZILEVBRVNvQixVQUFVQyxJQUFWLENBRlQ7QUFJRCxDQU5zQixFQU1wQixFQU5vQixDQUF2Qjs7UUFRUVksYyxHQUFBQSxjOzs7QUFFUixLQUFJLElBQUlqQyxHQUFSLElBQWVpQyxjQUFmLEVBQStCO0FBQzdCQyxTQUFPQyxPQUFQLENBQWVuQyxHQUFmLElBQXNCaUMsZUFBZWpDLEdBQWYsQ0FBdEI7QUFDRCIsImZpbGUiOiJsZXNzbHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGFyc2UgZnJvbSAnLi9wYXJzZXIvcGFyc2VyJ1xuZXhwb3J0IHtwYXJzZX07XG5cbi8qXG4gIENvbnZlcnRzIGNhbWVsQ2FzZSB0byBjYW1lbC1jYXNlXG4gKi9cbmZ1bmN0aW9uIGNhbWVsQ2FzZVRvRGFzaChrZXkpIHtcbiAgcmV0dXJuIGtleS5yZXBsYWNlKCAvKFthLXpdKShbQS1aXSkvZywgJyQxLSQyJyApLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8qXG4gUGFyc2VzIEB2YXIgd2l0aCB7dmFyOiAndmFsdWUnfVxuICovXG5mdW5jdGlvbiBwYXJzZVZhcnMoc3RyLCB2YXJzID0ge30pIHtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHZhcnMpO1xuICBrZXlzLnNvcnQoZnVuY3Rpb24oYSwgYil7XG4gICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XG4gIH0pO1xuICByZXR1cm4ga2V5cy5yZWR1Y2UoKHBvaW50ZXIsIGtleSkgPT4ge1xuICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gdmFyc1trZXldO1xuICAgIGNvbnN0IF9rZXkgPSBrZXlbMF0gPT09ICdAJyA/IGtleSA6IGBAJHtrZXl9YDtcbiAgICBjb25zdCBkYXNoS2V5ID0gY2FtZWxDYXNlVG9EYXNoKF9rZXkpO1xuICAgIGlmIChkYXNoS2V5ICE9PSBfa2V5KSB7XG4gICAgICBwb2ludGVyID0gcG9pbnRlci5yZXBsYWNlKGRhc2hLZXksIHJlcGxhY2VtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcG9pbnRlci5yZXBsYWNlKF9rZXksIHJlcGxhY2VtZW50KTtcbiAgfSwgc3RyKTtcbn1cblxuLypcbiAgUGFyc2VzIGxlc3MgZW50aXR5IHN0cmluZ1xuICovXG5mdW5jdGlvbiBsZXNzbHkoc3RyLCB2YXJzID0ge30pIHtcbiAgY29uc3QgZmluYWxzdHIgPSBwYXJzZVZhcnMoc3RyLCB2YXJzKTtcbiAgcmV0dXJuIHBhcnNlKGZpbmFsc3RyKS50b0NTUygpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbGVzc2x5O1xuZXhwb3J0IHtsZXNzbHl9O1xuXG4vLyBleHBvcnQgZnVuY3Rpb25zXG5cbi8vIHBhcnNlIGZ1bmN0aW9uIGFyZ3Mgc28gd2UgZG9udCBuZWVkIHRvIGV4cG9zZSBDb2xvciBOb2RlXG5mdW5jdGlvbiBiaW5kUGFyc2UoZnVuYywgdmFycykge1xuICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICBjb25zdCBmaW5hbEFyZ3MgPSBhcmdzLm1hcChhcmcgPT4gcGFyc2VWYXJzKFN0cmluZyhhcmcpLCB2YXJzKSk7XG4gICAgY29uc3QgcmVzdWx0ID0gZnVuYyguLi5maW5hbEFyZ3MubWFwKHBhcnNlKSkudG9DU1MoKTtcbiAgICByZXR1cm4gaXNOYU4ocmVzdWx0KSA/IHJlc3VsdCA6IE51bWJlcihyZXN1bHQpO1xuICB9O1xufVxuXG5pbXBvcnQge2NhbGxhYmxlfSBmcm9tICcuL2Z1bmN0aW9ucyc7XG5cbmV4cG9ydCB7Y2FsbGFibGV9O1xuXG5leHBvcnQgZnVuY3Rpb24gdGhlbWUodmFycyA9IHt9KSB7XG4gIGNvbnN0IGRlZmF1bEZ1bmN0aW9uID0gKHN0ciwgc3ViVmFycyA9IHt9KSA9PiB7XG4gICAgcmV0dXJuIGxlc3NseShzdHIsIHsuLi52YXJzLCAuLi5zdWJWYXJzfSk7XG4gIH07XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGNhbGxhYmxlKS5yZWR1Y2UoKHBvaW50ZXIsIGtleSkgPT4ge1xuICAgIGNvbnN0IGZ1bmMgPSBjYWxsYWJsZVtrZXldO1xuICAgIHBvaW50ZXJba2V5XSA9IGJpbmRQYXJzZShmdW5jLCB2YXJzKTtcbiAgICByZXR1cm4gcG9pbnRlcjtcbiAgfSwgZGVmYXVsRnVuY3Rpb24pO1xufVxuXG5jb25zdCBjb2xvckZ1bmN0aW9ucyA9IE9iamVjdC5rZXlzKGNhbGxhYmxlKS5yZWR1Y2UoKHBvaW50ZXIsIGtleSkgPT4ge1xuICBjb25zdCBmdW5jID0gY2FsbGFibGVba2V5XTtcbiAgcmV0dXJuIHtcbiAgICAuLi5wb2ludGVyLFxuICAgIFtrZXldOiBiaW5kUGFyc2UoZnVuYylcbiAgfTtcbn0sIHt9KTtcblxuZXhwb3J0IHtjb2xvckZ1bmN0aW9uc307XG5cbmZvcihsZXQga2V5IGluIGNvbG9yRnVuY3Rpb25zKSB7XG4gIG1vZHVsZS5leHBvcnRzW2tleV0gPSBjb2xvckZ1bmN0aW9uc1trZXldO1xufVxuIl19