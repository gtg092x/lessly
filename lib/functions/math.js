"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var mathHelper = require("./math-helper.js");

var mathFunctions = {
    // name,  unit
    ceil: null,
    floor: null,
    sqrt: null,
    abs: null,
    tan: "",
    sin: "",
    cos: "",
    atan: "rad",
    asin: "rad",
    acos: "rad"
};

for (var f in mathFunctions) {
    if (mathFunctions.hasOwnProperty(f)) {
        mathFunctions[f] = mathHelper._math.bind(null, Math[f], mathFunctions[f]);
    }
}

mathFunctions.round = function (n, f) {
    var fraction = typeof f === "undefined" ? 0 : f.value;
    return mathHelper._math(function (num) {
        return num.toFixed(fraction);
    }, null, n);
};

exports.default = mathFunctions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdW5jdGlvbnMvbWF0aC5qcyJdLCJuYW1lcyI6WyJtYXRoSGVscGVyIiwicmVxdWlyZSIsIm1hdGhGdW5jdGlvbnMiLCJjZWlsIiwiZmxvb3IiLCJzcXJ0IiwiYWJzIiwidGFuIiwic2luIiwiY29zIiwiYXRhbiIsImFzaW4iLCJhY29zIiwiZiIsImhhc093blByb3BlcnR5IiwiX21hdGgiLCJiaW5kIiwiTWF0aCIsInJvdW5kIiwibiIsImZyYWN0aW9uIiwidmFsdWUiLCJudW0iLCJ0b0ZpeGVkIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLElBQUlBLGFBQWFDLFFBQVEsa0JBQVIsQ0FBakI7O0FBRUEsSUFBSUMsZ0JBQWdCO0FBQ2hCO0FBQ0FDLFVBQU8sSUFGUztBQUdoQkMsV0FBTyxJQUhTO0FBSWhCQyxVQUFPLElBSlM7QUFLaEJDLFNBQU8sSUFMUztBQU1oQkMsU0FBTyxFQU5TO0FBT2hCQyxTQUFPLEVBUFM7QUFRaEJDLFNBQU8sRUFSUztBQVNoQkMsVUFBTyxLQVRTO0FBVWhCQyxVQUFPLEtBVlM7QUFXaEJDLFVBQU87QUFYUyxDQUFwQjs7QUFjQSxLQUFLLElBQUlDLENBQVQsSUFBY1gsYUFBZCxFQUE2QjtBQUN6QixRQUFJQSxjQUFjWSxjQUFkLENBQTZCRCxDQUE3QixDQUFKLEVBQXFDO0FBQ2pDWCxzQkFBY1csQ0FBZCxJQUFtQmIsV0FBV2UsS0FBWCxDQUFpQkMsSUFBakIsQ0FBc0IsSUFBdEIsRUFBNEJDLEtBQUtKLENBQUwsQ0FBNUIsRUFBcUNYLGNBQWNXLENBQWQsQ0FBckMsQ0FBbkI7QUFDSDtBQUNKOztBQUVEWCxjQUFjZ0IsS0FBZCxHQUFzQixVQUFVQyxDQUFWLEVBQWFOLENBQWIsRUFBZ0I7QUFDbEMsUUFBSU8sV0FBVyxPQUFPUCxDQUFQLEtBQWEsV0FBYixHQUEyQixDQUEzQixHQUErQkEsRUFBRVEsS0FBaEQ7QUFDQSxXQUFPckIsV0FBV2UsS0FBWCxDQUFpQixVQUFTTyxHQUFULEVBQWM7QUFBRSxlQUFPQSxJQUFJQyxPQUFKLENBQVlILFFBQVosQ0FBUDtBQUErQixLQUFoRSxFQUFrRSxJQUFsRSxFQUF3RUQsQ0FBeEUsQ0FBUDtBQUNILENBSEQ7O2tCQUtlakIsYSIsImZpbGUiOiJtYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG1hdGhIZWxwZXIgPSByZXF1aXJlKFwiLi9tYXRoLWhlbHBlci5qc1wiKTtcblxudmFyIG1hdGhGdW5jdGlvbnMgPSB7XG4gICAgLy8gbmFtZSwgIHVuaXRcbiAgICBjZWlsOiAgbnVsbCxcbiAgICBmbG9vcjogbnVsbCxcbiAgICBzcXJ0OiAgbnVsbCxcbiAgICBhYnM6ICAgbnVsbCxcbiAgICB0YW46ICAgXCJcIixcbiAgICBzaW46ICAgXCJcIixcbiAgICBjb3M6ICAgXCJcIixcbiAgICBhdGFuOiAgXCJyYWRcIixcbiAgICBhc2luOiAgXCJyYWRcIixcbiAgICBhY29zOiAgXCJyYWRcIlxufTtcblxuZm9yICh2YXIgZiBpbiBtYXRoRnVuY3Rpb25zKSB7XG4gICAgaWYgKG1hdGhGdW5jdGlvbnMuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgICAgbWF0aEZ1bmN0aW9uc1tmXSA9IG1hdGhIZWxwZXIuX21hdGguYmluZChudWxsLCBNYXRoW2ZdLCBtYXRoRnVuY3Rpb25zW2ZdKTtcbiAgICB9XG59XG5cbm1hdGhGdW5jdGlvbnMucm91bmQgPSBmdW5jdGlvbiAobiwgZikge1xuICAgIHZhciBmcmFjdGlvbiA9IHR5cGVvZiBmID09PSBcInVuZGVmaW5lZFwiID8gMCA6IGYudmFsdWU7XG4gICAgcmV0dXJuIG1hdGhIZWxwZXIuX21hdGgoZnVuY3Rpb24obnVtKSB7IHJldHVybiBudW0udG9GaXhlZChmcmFjdGlvbik7IH0sIG51bGwsIG4pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgbWF0aEZ1bmN0aW9ucztcbiJdfQ==