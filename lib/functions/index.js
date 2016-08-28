'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callable = exports.types = exports.number = exports.math = exports.colorBlending = exports.color = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _color2 = require('./color');

var _color3 = _interopRequireDefault(_color2);

var _colorBlending2 = require('./color-blending');

var _colorBlending3 = _interopRequireDefault(_colorBlending2);

var _math2 = require('./math');

var _math3 = _interopRequireDefault(_math2);

var _number2 = require('./number');

var _number3 = _interopRequireDefault(_number2);

var _types2 = require('./types');

var _types3 = _interopRequireDefault(_types2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.color = _color3.default;
exports.colorBlending = _colorBlending3.default;
exports.math = _math3.default;
exports.number = _number3.default;
exports.types = _types3.default;
var callable = exports.callable = _extends({}, _color3.default, _colorBlending3.default);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdW5jdGlvbnMvaW5kZXguanMiXSwibmFtZXMiOlsiY29sb3IiLCJjb2xvckJsZW5kaW5nIiwibWF0aCIsIm51bWJlciIsInR5cGVzIiwiY2FsbGFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFBT0EsSztRQUNBQyxhO1FBQ0FDLEk7UUFDQUMsTTtRQUNBQyxLO0FBSUEsSUFBTUMsb0ZBQU4iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29sb3IgZnJvbSAnLi9jb2xvcic7XG5leHBvcnQgY29sb3JCbGVuZGluZyBmcm9tICcuL2NvbG9yLWJsZW5kaW5nJztcbmV4cG9ydCBtYXRoIGZyb20gJy4vbWF0aCc7XG5leHBvcnQgbnVtYmVyIGZyb20gJy4vbnVtYmVyJztcbmV4cG9ydCB0eXBlcyBmcm9tICcuL3R5cGVzJztcblxuaW1wb3J0IGNvbG9yIGZyb20gJy4vY29sb3InO1xuaW1wb3J0IGNvbG9yQmxlbmRpbmcgZnJvbSAnLi9jb2xvci1ibGVuZGluZyc7XG5leHBvcnQgY29uc3QgY2FsbGFibGUgPSB7Li4uY29sb3IsIC4uLmNvbG9yQmxlbmRpbmd9O1xuIl19