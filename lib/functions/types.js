"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Keyword = require("../tree/keyword"),
    Dimension = require("../tree/dimension"),
    Color = require("../tree/color"),
    Anonymous = require("../tree/anonymous"),
    Operation = require("../tree/operation");

var isa = function isa(n, Type) {
    return n instanceof Type ? Keyword.True : Keyword.False;
},
    isunit = function isunit(n, unit) {
    if (unit === undefined) {
        throw { type: "Argument", message: "missing the required second argument to isunit." };
    }
    unit = typeof unit.value === "string" ? unit.value : unit;
    if (typeof unit !== "string") {
        throw { type: "Argument", message: "Second argument to isunit should be a unit or a string." };
    }
    return n instanceof Dimension && n.unit.is(unit) ? Keyword.True : Keyword.False;
},
    getItemsFromNode = function getItemsFromNode(node) {
    // handle non-array values as an array of length 1
    // return 'undefined' if index is invalid
    var items = Array.isArray(node.value) ? node.value : Array(node);

    return items;
};
exports.default = {
    iscolor: function iscolor(n) {
        return isa(n, Color);
    },
    isnumber: function isnumber(n) {
        return isa(n, Dimension);
    },
    iskeyword: function iskeyword(n) {
        return isa(n, Keyword);
    },
    ispixel: function ispixel(n) {
        return isunit(n, 'px');
    },
    ispercentage: function ispercentage(n) {
        return isunit(n, '%');
    },
    isem: function isem(n) {
        return isunit(n, 'em');
    },
    isunit: isunit,
    unit: function unit(val, _unit) {
        if (!(val instanceof Dimension)) {
            throw { type: "Argument",
                message: "the first argument to unit must be a number" + (val instanceof Operation ? ". Have you forgotten parenthesis?" : "") };
        }
        if (_unit) {
            if (_unit instanceof Keyword) {
                _unit = _unit.value;
            } else {
                _unit = _unit.toCSS();
            }
        } else {
            _unit = "";
        }
        return new Dimension(val.value, _unit);
    },
    "get-unit": function getUnit(n) {
        return new Anonymous(n.unit);
    },
    extract: function extract(values, index) {
        index = index.value - 1; // (1-based index)

        return getItemsFromNode(values)[index];
    },
    length: function length(values) {
        return new Dimension(getItemsFromNode(values).length);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdW5jdGlvbnMvdHlwZXMuanMiXSwibmFtZXMiOlsiS2V5d29yZCIsInJlcXVpcmUiLCJEaW1lbnNpb24iLCJDb2xvciIsIkFub255bW91cyIsIk9wZXJhdGlvbiIsImlzYSIsIm4iLCJUeXBlIiwiVHJ1ZSIsIkZhbHNlIiwiaXN1bml0IiwidW5pdCIsInVuZGVmaW5lZCIsInR5cGUiLCJtZXNzYWdlIiwidmFsdWUiLCJpcyIsImdldEl0ZW1zRnJvbU5vZGUiLCJub2RlIiwiaXRlbXMiLCJBcnJheSIsImlzQXJyYXkiLCJpc2NvbG9yIiwiaXNudW1iZXIiLCJpc2tleXdvcmQiLCJpc3BpeGVsIiwiaXNwZXJjZW50YWdlIiwiaXNlbSIsInZhbCIsInRvQ1NTIiwiZXh0cmFjdCIsInZhbHVlcyIsImluZGV4IiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLElBQUlBLFVBQVVDLFFBQVEsaUJBQVIsQ0FBZDtBQUFBLElBQ0lDLFlBQVlELFFBQVEsbUJBQVIsQ0FEaEI7QUFBQSxJQUVJRSxRQUFRRixRQUFRLGVBQVIsQ0FGWjtBQUFBLElBR0lHLFlBQVlILFFBQVEsbUJBQVIsQ0FIaEI7QUFBQSxJQUlJSSxZQUFZSixRQUFRLG1CQUFSLENBSmhCOztBQU1BLElBQUlLLE1BQU0sU0FBTkEsR0FBTSxDQUFVQyxDQUFWLEVBQWFDLElBQWIsRUFBbUI7QUFDckIsV0FBUUQsYUFBYUMsSUFBZCxHQUFzQlIsUUFBUVMsSUFBOUIsR0FBcUNULFFBQVFVLEtBQXBEO0FBQ0gsQ0FGTDtBQUFBLElBR0lDLFNBQVMsU0FBVEEsTUFBUyxDQUFVSixDQUFWLEVBQWFLLElBQWIsRUFBbUI7QUFDeEIsUUFBSUEsU0FBU0MsU0FBYixFQUF3QjtBQUNwQixjQUFNLEVBQUVDLE1BQU0sVUFBUixFQUFvQkMsU0FBUyxpREFBN0IsRUFBTjtBQUNIO0FBQ0RILFdBQU8sT0FBT0EsS0FBS0ksS0FBWixLQUFzQixRQUF0QixHQUFpQ0osS0FBS0ksS0FBdEMsR0FBOENKLElBQXJEO0FBQ0EsUUFBSSxPQUFPQSxJQUFQLEtBQWdCLFFBQXBCLEVBQThCO0FBQzFCLGNBQU0sRUFBRUUsTUFBTSxVQUFSLEVBQW9CQyxTQUFTLHlEQUE3QixFQUFOO0FBQ0g7QUFDRCxXQUFRUixhQUFhTCxTQUFkLElBQTRCSyxFQUFFSyxJQUFGLENBQU9LLEVBQVAsQ0FBVUwsSUFBVixDQUE1QixHQUE4Q1osUUFBUVMsSUFBdEQsR0FBNkRULFFBQVFVLEtBQTVFO0FBQ0gsQ0FaTDtBQUFBLElBYUlRLG1CQUFtQixTQUFuQkEsZ0JBQW1CLENBQVNDLElBQVQsRUFBZTtBQUM5QjtBQUNBO0FBQ0EsUUFBSUMsUUFBUUMsTUFBTUMsT0FBTixDQUFjSCxLQUFLSCxLQUFuQixJQUNSRyxLQUFLSCxLQURHLEdBQ0tLLE1BQU1GLElBQU4sQ0FEakI7O0FBR0EsV0FBT0MsS0FBUDtBQUNILENBcEJMO2tCQXFCZ0I7QUFDWkcsYUFBUyxpQkFBVWhCLENBQVYsRUFBYTtBQUNsQixlQUFPRCxJQUFJQyxDQUFKLEVBQU9KLEtBQVAsQ0FBUDtBQUNILEtBSFc7QUFJWnFCLGNBQVUsa0JBQVVqQixDQUFWLEVBQWE7QUFDbkIsZUFBT0QsSUFBSUMsQ0FBSixFQUFPTCxTQUFQLENBQVA7QUFDSCxLQU5XO0FBT1p1QixlQUFXLG1CQUFVbEIsQ0FBVixFQUFhO0FBQ3BCLGVBQU9ELElBQUlDLENBQUosRUFBT1AsT0FBUCxDQUFQO0FBQ0gsS0FUVztBQVVaMEIsYUFBUyxpQkFBVW5CLENBQVYsRUFBYTtBQUNsQixlQUFPSSxPQUFPSixDQUFQLEVBQVUsSUFBVixDQUFQO0FBQ0gsS0FaVztBQWFab0Isa0JBQWMsc0JBQVVwQixDQUFWLEVBQWE7QUFDdkIsZUFBT0ksT0FBT0osQ0FBUCxFQUFVLEdBQVYsQ0FBUDtBQUNILEtBZlc7QUFnQlpxQixVQUFNLGNBQVVyQixDQUFWLEVBQWE7QUFDZixlQUFPSSxPQUFPSixDQUFQLEVBQVUsSUFBVixDQUFQO0FBQ0gsS0FsQlc7QUFtQlpJLFlBQVFBLE1BbkJJO0FBb0JaQyxVQUFNLGNBQVVpQixHQUFWLEVBQWVqQixLQUFmLEVBQXFCO0FBQ3ZCLFlBQUksRUFBRWlCLGVBQWUzQixTQUFqQixDQUFKLEVBQWlDO0FBQzdCLGtCQUFNLEVBQUVZLE1BQU0sVUFBUjtBQUNGQyx5QkFBUyxpREFDSmMsZUFBZXhCLFNBQWYsR0FBMkIsbUNBQTNCLEdBQWlFLEVBRDdELENBRFAsRUFBTjtBQUdIO0FBQ0QsWUFBSU8sS0FBSixFQUFVO0FBQ04sZ0JBQUlBLGlCQUFnQlosT0FBcEIsRUFBNkI7QUFDekJZLHdCQUFPQSxNQUFLSSxLQUFaO0FBQ0gsYUFGRCxNQUVPO0FBQ0hKLHdCQUFPQSxNQUFLa0IsS0FBTCxFQUFQO0FBQ0g7QUFDSixTQU5ELE1BTU87QUFDSGxCLG9CQUFPLEVBQVA7QUFDSDtBQUNELGVBQU8sSUFBSVYsU0FBSixDQUFjMkIsSUFBSWIsS0FBbEIsRUFBeUJKLEtBQXpCLENBQVA7QUFDSCxLQXBDVztBQXFDWixnQkFBWSxpQkFBVUwsQ0FBVixFQUFhO0FBQ3JCLGVBQU8sSUFBSUgsU0FBSixDQUFjRyxFQUFFSyxJQUFoQixDQUFQO0FBQ0gsS0F2Q1c7QUF3Q1ptQixhQUFTLGlCQUFTQyxNQUFULEVBQWlCQyxLQUFqQixFQUF3QjtBQUM3QkEsZ0JBQVFBLE1BQU1qQixLQUFOLEdBQWMsQ0FBdEIsQ0FENkIsQ0FDSjs7QUFFekIsZUFBT0UsaUJBQWlCYyxNQUFqQixFQUF5QkMsS0FBekIsQ0FBUDtBQUNILEtBNUNXO0FBNkNaQyxZQUFRLGdCQUFTRixNQUFULEVBQWlCO0FBQ3JCLGVBQU8sSUFBSTlCLFNBQUosQ0FBY2dCLGlCQUFpQmMsTUFBakIsRUFBeUJFLE1BQXZDLENBQVA7QUFDSDtBQS9DVyxDIiwiZmlsZSI6InR5cGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEtleXdvcmQgPSByZXF1aXJlKFwiLi4vdHJlZS9rZXl3b3JkXCIpLFxuICAgIERpbWVuc2lvbiA9IHJlcXVpcmUoXCIuLi90cmVlL2RpbWVuc2lvblwiKSxcbiAgICBDb2xvciA9IHJlcXVpcmUoXCIuLi90cmVlL2NvbG9yXCIpLFxuICAgIEFub255bW91cyA9IHJlcXVpcmUoXCIuLi90cmVlL2Fub255bW91c1wiKSxcbiAgICBPcGVyYXRpb24gPSByZXF1aXJlKFwiLi4vdHJlZS9vcGVyYXRpb25cIik7XG5cbnZhciBpc2EgPSBmdW5jdGlvbiAobiwgVHlwZSkge1xuICAgICAgICByZXR1cm4gKG4gaW5zdGFuY2VvZiBUeXBlKSA/IEtleXdvcmQuVHJ1ZSA6IEtleXdvcmQuRmFsc2U7XG4gICAgfSxcbiAgICBpc3VuaXQgPSBmdW5jdGlvbiAobiwgdW5pdCkge1xuICAgICAgICBpZiAodW5pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyB7IHR5cGU6IFwiQXJndW1lbnRcIiwgbWVzc2FnZTogXCJtaXNzaW5nIHRoZSByZXF1aXJlZCBzZWNvbmQgYXJndW1lbnQgdG8gaXN1bml0LlwiIH07XG4gICAgICAgIH1cbiAgICAgICAgdW5pdCA9IHR5cGVvZiB1bml0LnZhbHVlID09PSBcInN0cmluZ1wiID8gdW5pdC52YWx1ZSA6IHVuaXQ7XG4gICAgICAgIGlmICh0eXBlb2YgdW5pdCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3cgeyB0eXBlOiBcIkFyZ3VtZW50XCIsIG1lc3NhZ2U6IFwiU2Vjb25kIGFyZ3VtZW50IHRvIGlzdW5pdCBzaG91bGQgYmUgYSB1bml0IG9yIGEgc3RyaW5nLlwiIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChuIGluc3RhbmNlb2YgRGltZW5zaW9uKSAmJiBuLnVuaXQuaXModW5pdCkgPyBLZXl3b3JkLlRydWUgOiBLZXl3b3JkLkZhbHNlO1xuICAgIH0sXG4gICAgZ2V0SXRlbXNGcm9tTm9kZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgLy8gaGFuZGxlIG5vbi1hcnJheSB2YWx1ZXMgYXMgYW4gYXJyYXkgb2YgbGVuZ3RoIDFcbiAgICAgICAgLy8gcmV0dXJuICd1bmRlZmluZWQnIGlmIGluZGV4IGlzIGludmFsaWRcbiAgICAgICAgdmFyIGl0ZW1zID0gQXJyYXkuaXNBcnJheShub2RlLnZhbHVlKSA/XG4gICAgICAgICAgICBub2RlLnZhbHVlIDogQXJyYXkobm9kZSk7XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgIH07XG5leHBvcnQgZGVmYXVsdCAoe1xuICAgIGlzY29sb3I6IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBpc2EobiwgQ29sb3IpO1xuICAgIH0sXG4gICAgaXNudW1iZXI6IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBpc2EobiwgRGltZW5zaW9uKTtcbiAgICB9LFxuICAgIGlza2V5d29yZDogZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgcmV0dXJuIGlzYShuLCBLZXl3b3JkKTtcbiAgICB9LFxuICAgIGlzcGl4ZWw6IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBpc3VuaXQobiwgJ3B4Jyk7XG4gICAgfSxcbiAgICBpc3BlcmNlbnRhZ2U6IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBpc3VuaXQobiwgJyUnKTtcbiAgICB9LFxuICAgIGlzZW06IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBpc3VuaXQobiwgJ2VtJyk7XG4gICAgfSxcbiAgICBpc3VuaXQ6IGlzdW5pdCxcbiAgICB1bml0OiBmdW5jdGlvbiAodmFsLCB1bml0KSB7XG4gICAgICAgIGlmICghKHZhbCBpbnN0YW5jZW9mIERpbWVuc2lvbikpIHtcbiAgICAgICAgICAgIHRocm93IHsgdHlwZTogXCJBcmd1bWVudFwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwidGhlIGZpcnN0IGFyZ3VtZW50IHRvIHVuaXQgbXVzdCBiZSBhIG51bWJlclwiICtcbiAgICAgICAgICAgICAgICAgICAgKHZhbCBpbnN0YW5jZW9mIE9wZXJhdGlvbiA/IFwiLiBIYXZlIHlvdSBmb3Jnb3R0ZW4gcGFyZW50aGVzaXM/XCIgOiBcIlwiKSB9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh1bml0KSB7XG4gICAgICAgICAgICBpZiAodW5pdCBpbnN0YW5jZW9mIEtleXdvcmQpIHtcbiAgICAgICAgICAgICAgICB1bml0ID0gdW5pdC52YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdW5pdCA9IHVuaXQudG9DU1MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXQgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRGltZW5zaW9uKHZhbC52YWx1ZSwgdW5pdCk7XG4gICAgfSxcbiAgICBcImdldC11bml0XCI6IGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5vbnltb3VzKG4udW5pdCk7XG4gICAgfSxcbiAgICBleHRyYWN0OiBmdW5jdGlvbih2YWx1ZXMsIGluZGV4KSB7XG4gICAgICAgIGluZGV4ID0gaW5kZXgudmFsdWUgLSAxOyAvLyAoMS1iYXNlZCBpbmRleClcblxuICAgICAgICByZXR1cm4gZ2V0SXRlbXNGcm9tTm9kZSh2YWx1ZXMpW2luZGV4XTtcbiAgICB9LFxuICAgIGxlbmd0aDogZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGltZW5zaW9uKGdldEl0ZW1zRnJvbU5vZGUodmFsdWVzKS5sZW5ndGgpO1xuICAgIH1cbn0pO1xuIl19