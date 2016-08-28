'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;
var tree = require('../tree');

function error() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  throw new (Function.prototype.bind.apply(Error, [null].concat(args)))();
}

function Parse(input) {

  var parserInput = {
    $re: function $re(regex) {
      return input.match(regex);
    },
    $char: function $char(char) {
      return input.indexOf(char) > -1;
    },
    currentChar: function currentChar() {
      return input[0];
    },
    peekNotNumeric: function peekNotNumeric() {
      return !/[\d]/.test(input);
    }
  };

  return {
    arguments: function _arguments() {
      var match = parserInput.$re(/\((.+)\)$/);
      var argArray = match && match[1] && match[1].split(/,\s*(?![^(]*\))/);
      return argArray.map(function (arg) {
        return parse(arg.trim());
      });
    },

    //
    // A function call
    //
    //     rgb(255, 0, 255)
    //
    // We also try to catch IE's `alpha()`, but let the `alpha` parser
    // deal with the details.
    //
    // The arguments are parsed with the `entities.arguments` parser.
    //
    colorFunction: function colorFunction() {
      var name,
          nameLC,
          args,
          alpha,
          index = 0;

      name = parserInput.$re(/^([\w-]+)\(/);
      if (!name) {
        return;
      }

      name = name[1];
      args = this.arguments();

      if (!parserInput.$char(')')) {
        parserInput.restore("Could not parse call arguments or missing ')'");
        return;
      }

      return new tree.Call(name, args, index);
    },
    //
    // A string, which supports escaping " and '
    //
    //     "milky way" 'he\'s the one!'
    //
    keyword: function keyword() {
      var k = parserInput.$re(/^[_A-Za-z-][_A-Za-z0-9-]*/);
      if (k) {
        return tree.Color.fromKeyword(k.input) || new tree.Keyword(k.input);
      }
    },
    //
    // A Hexadecimal color
    //
    //     #4F3C2F
    //
    // `rgb` and `hsl` colors are parsed through the `entities.call` parser.
    //
    color: function color() {
      var rgb;

      if (parserInput.currentChar() === '#' && (rgb = parserInput.$re(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/))) {
        // strip colons, brackets, whitespaces and other characters that should not
        // definitely be part of color string
        var colorCandidateString = rgb.input.match(/^#([\w]+).*/);
        colorCandidateString = colorCandidateString[1];
        if (!colorCandidateString.match(/^[A-Fa-f0-9]+$/)) {
          // verify if candidate consists only of allowed HEX characters
          error("Invalid HEX color code");
        }
        return new tree.Color(rgb[1], undefined, '#' + colorCandidateString);
      }
    },

    colorKeyword: function colorKeyword() {
      var k = parserInput.$re(/^[_A-Za-z-][_A-Za-z0-9-]+/);
      if (!k) {
        return;
      }
      var color = tree.Color.fromKeyword(k.input);
      if (color) {
        return color;
      }
    },

    //
    // A Dimension, that is, a number and a unit
    //
    //     0.5em 95%
    //
    dimension: function dimension() {
      if (parserInput.peekNotNumeric()) {
        return;
      }

      var value = parserInput.$re(/^([+-]?\d*\.?\d+)(%|[a-z_]+)?/i);
      if (value) {
        return new tree.Dimension(value[1], value[2]);
      }
    }
  };
}

function parse(input) {
  var parsed = Parse(input);
  var methods = [parsed.colorFunction, parsed.colorKeyword, parsed.color, parsed.dimension, parsed.keyword];
  for (var i = 0; i < methods.length; i++) {
    var result = void 0;
    if (result = methods[i].call(parsed)) {
      return result;
    }
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvcGFyc2VyLmpzIl0sIm5hbWVzIjpbInBhcnNlIiwidHJlZSIsInJlcXVpcmUiLCJlcnJvciIsImFyZ3MiLCJFcnJvciIsIlBhcnNlIiwiaW5wdXQiLCJwYXJzZXJJbnB1dCIsIiRyZSIsInJlZ2V4IiwibWF0Y2giLCIkY2hhciIsImNoYXIiLCJpbmRleE9mIiwiY3VycmVudENoYXIiLCJwZWVrTm90TnVtZXJpYyIsInRlc3QiLCJhcmd1bWVudHMiLCJhcmdBcnJheSIsInNwbGl0IiwibWFwIiwiYXJnIiwidHJpbSIsImNvbG9yRnVuY3Rpb24iLCJuYW1lIiwibmFtZUxDIiwiYWxwaGEiLCJpbmRleCIsInJlc3RvcmUiLCJDYWxsIiwia2V5d29yZCIsImsiLCJDb2xvciIsImZyb21LZXl3b3JkIiwiS2V5d29yZCIsImNvbG9yIiwicmdiIiwiY29sb3JDYW5kaWRhdGVTdHJpbmciLCJ1bmRlZmluZWQiLCJjb2xvcktleXdvcmQiLCJkaW1lbnNpb24iLCJ2YWx1ZSIsIkRpbWVuc2lvbiIsInBhcnNlZCIsIm1ldGhvZHMiLCJpIiwibGVuZ3RoIiwicmVzdWx0IiwiY2FsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBdUh3QkEsSztBQXZIeEIsSUFBSUMsT0FBT0MsUUFBUSxTQUFSLENBQVg7O0FBRUEsU0FBU0MsS0FBVCxHQUF3QjtBQUFBLG9DQUFOQyxJQUFNO0FBQU5BLFFBQU07QUFBQTs7QUFDdEIsMkNBQVVDLEtBQVYsZ0JBQW1CRCxJQUFuQjtBQUNEOztBQUVELFNBQVNFLEtBQVQsQ0FBZUMsS0FBZixFQUFzQjs7QUFFcEIsTUFBTUMsY0FBYztBQUNsQkMsT0FEa0IsZUFDZEMsS0FEYyxFQUNQO0FBQ1QsYUFBT0gsTUFBTUksS0FBTixDQUFZRCxLQUFaLENBQVA7QUFDRCxLQUhpQjtBQUlsQkUsU0FKa0IsaUJBSVpDLElBSlksRUFJTjtBQUNWLGFBQU9OLE1BQU1PLE9BQU4sQ0FBY0QsSUFBZCxJQUFzQixDQUFDLENBQTlCO0FB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Q0E7QUFDQTtBQUNBO0FBQ0FLLGVBQVcscUJBQVk7QUFDckIsVUFBSWpDLFlBQVlRLGNBQVosRUFBSixFQUFrQztBQUNoQztBQUNEOztBQUVELFVBQUkwQixRQUFRbEMsWUFBWUMsR0FBWixDQUFnQixnQ0FBaEIsQ0FBWjtBQUNBLFVBQUlpQyxLQUFKLEVBQVc7QUFDVCxlQUFPLElBQUt6QyxLQUFLMEMsU0FBVixDQUFxQkQsTUFBTSxDQUFOLENBQXJCLEVBQStCQSxNQUFNLENBQU4sQ0FBL0IsQ0FBUDtBQUNEO0FBQ0Y7QUE1RkksR0FBUDtBQThGRDs7QUFFYyxTQUFTMUMsS0FBVCxDQUFlTyxLQUFmLEVBQXNCO0FBQ25DLE1BQU1xQyxTQUFTdEMsTUFBTUMsS0FBTixDQUFmO0FBQ0EsTUFBTXNDLFVBQVUsQ0FBQ0QsT0FBT3BCLGFBQVIsRUFBdUJvQixPQUFPSixZQUE5QixFQUE0Q0ksT0FBT1IsS0FBbkQsRUFBMERRLE9BQU9ILFNBQWpFLEVBQTRFRyxPQUFPYixPQUFuRixDQUFoQjtBQUNBLE9BQUksSUFBSWUsSUFBSSxDQUFaLEVBQWVBLElBQUlELFFBQVFFLE1BQTNCLEVBQW1DRCxHQUFuQyxFQUF3QztBQUN0QyxRQUFJRSxlQUFKO0FBQ0EsUUFBSUEsU0FBU0gsUUFBUUMsQ0FBUixFQUFXRyxJQUFYLENBQWdCTCxNQUFoQixDQUFiLEVBQXNDO0FBQ3BDLGFBQU9JLE1BQVA7QUFDRDtBQUNGO0FBQ0YiLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHRyZWUgPSByZXF1aXJlKCcuLi90cmVlJyk7XG5cbmZ1bmN0aW9uIGVycm9yKC4uLmFyZ3MpIHtcbiAgdGhyb3cgbmV3IEVycm9yKC4uLmFyZ3MpO1xufVxuXG5mdW5jdGlvbiBQYXJzZShpbnB1dCkge1xuXG4gIGNvbnN0IHBhcnNlcklucHV0ID0ge1xuICAgICRyZShyZWdleCkge1xuICAgICAgcmV0dXJuIGlucHV0Lm1hdGNoKHJlZ2V4KTtcbiAgICB9LFxuICAgICRjaGFyKGNoYXIpIHtcbiAgICAgIHJldHVybiBpbnB1dC5pbmRleE9mKGNoYXIpID4gLTE7XG4gICAgfSxcbiAgICBjdXJyZW50Q2hhcigpIHtcbiAgICAgIHJldHVybiBpbnB1dFswXTtcbiAgICB9LFxuICAgIHBlZWtOb3ROdW1lcmljKCkge1xuICAgICAgcmV0dXJuICEvW1xcZF0vLnRlc3QoaW5wdXQpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGFyZ3VtZW50cygpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gcGFyc2VySW5wdXQuJHJlKC9cXCgoLispXFwpJC8pO1xuICAgICAgY29uc3QgYXJnQXJyYXkgPSBtYXRjaCAmJiBtYXRjaFsxXSAmJiBtYXRjaFsxXS5zcGxpdCgvLFxccyooPyFbXihdKlxcKSkvKTtcbiAgICAgIHJldHVybiBhcmdBcnJheS5tYXAoYXJnID0+IHBhcnNlKGFyZy50cmltKCkpKTtcbiAgICB9LFxuICAgIC8vXG4gICAgLy8gQSBmdW5jdGlvbiBjYWxsXG4gICAgLy9cbiAgICAvLyAgICAgcmdiKDI1NSwgMCwgMjU1KVxuICAgIC8vXG4gICAgLy8gV2UgYWxzbyB0cnkgdG8gY2F0Y2ggSUUncyBgYWxwaGEoKWAsIGJ1dCBsZXQgdGhlIGBhbHBoYWAgcGFyc2VyXG4gICAgLy8gZGVhbCB3aXRoIHRoZSBkZXRhaWxzLlxuICAgIC8vXG4gICAgLy8gVGhlIGFyZ3VtZW50cyBhcmUgcGFyc2VkIHdpdGggdGhlIGBlbnRpdGllcy5hcmd1bWVudHNgIHBhcnNlci5cbiAgICAvL1xuICAgIGNvbG9yRnVuY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBuYW1lLCBuYW1lTEMsIGFyZ3MsIGFscGhhLCBpbmRleCA9IDA7XG5cbiAgICAgIG5hbWUgPSBwYXJzZXJJbnB1dC4kcmUoL14oW1xcdy1dKylcXCgvKTtcbiAgICAgIGlmICghbmFtZSkgeyByZXR1cm47IH1cblxuICAgICAgbmFtZSA9IG5hbWVbMV07XG4gICAgICBhcmdzID0gdGhpcy5hcmd1bWVudHMoKTtcblxuICAgICAgaWYgKCEgcGFyc2VySW5wdXQuJGNoYXIoJyknKSkge1xuICAgICAgICBwYXJzZXJJbnB1dC5yZXN0b3JlKFwiQ291bGQgbm90IHBhcnNlIGNhbGwgYXJndW1lbnRzIG9yIG1pc3NpbmcgJyknXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcodHJlZS5DYWxsKShuYW1lLCBhcmdzLCBpbmRleCk7XG4gICAgfSxcbiAgICAvL1xuICAgIC8vIEEgc3RyaW5nLCB3aGljaCBzdXBwb3J0cyBlc2NhcGluZyBcIiBhbmQgJ1xuICAgIC8vXG4gICAgLy8gICAgIFwibWlsa3kgd2F5XCIgJ2hlXFwncyB0aGUgb25lISdcbiAgICAvL1xuICAgIGtleXdvcmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBrID0gcGFyc2VySW5wdXQuJHJlKC9eW19BLVphLXotXVtfQS1aYS16MC05LV0qLyk7XG4gICAgICBpZiAoaykge1xuICAgICAgICByZXR1cm4gdHJlZS5Db2xvci5mcm9tS2V5d29yZChrLmlucHV0KSB8fCBuZXcgKHRyZWUuS2V5d29yZCkoay5pbnB1dCk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvL1xuICAgIC8vIEEgSGV4YWRlY2ltYWwgY29sb3JcbiAgICAvL1xuICAgIC8vICAgICAjNEYzQzJGXG4gICAgLy9cbiAgICAvLyBgcmdiYCBhbmQgYGhzbGAgY29sb3JzIGFyZSBwYXJzZWQgdGhyb3VnaCB0aGUgYGVudGl0aWVzLmNhbGxgIHBhcnNlci5cbiAgICAvL1xuICAgIGNvbG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmdiO1xuXG4gICAgICBpZiAocGFyc2VySW5wdXQuY3VycmVudENoYXIoKSA9PT0gJyMnICYmIChyZ2IgPSBwYXJzZXJJbnB1dC4kcmUoL14jKFtBLUZhLWYwLTldezZ9fFtBLUZhLWYwLTldezN9KS8pKSkge1xuICAgICAgICAvLyBzdHJpcCBjb2xvbnMsIGJyYWNrZXRzLCB3aGl0ZXNwYWNlcyBhbmQgb3RoZXIgY2hhcmFjdGVycyB0aGF0IHNob3VsZCBub3RcbiAgICAgICAgLy8gZGVmaW5pdGVseSBiZSBwYXJ0IG9mIGNvbG9yIHN0cmluZ1xuICAgICAgICB2YXIgY29sb3JDYW5kaWRhdGVTdHJpbmcgPSByZ2IuaW5wdXQubWF0Y2goL14jKFtcXHddKykuKi8pO1xuICAgICAgICBjb2xvckNhbmRpZGF0ZVN0cmluZyA9IGNvbG9yQ2FuZGlkYXRlU3RyaW5nWzFdO1xuICAgICAgICBpZiAoIWNvbG9yQ2FuZGlkYXRlU3RyaW5nLm1hdGNoKC9eW0EtRmEtZjAtOV0rJC8pKSB7IC8vIHZlcmlmeSBpZiBjYW5kaWRhdGUgY29uc2lzdHMgb25seSBvZiBhbGxvd2VkIEhFWCBjaGFyYWN0ZXJzXG4gICAgICAgICAgZXJyb3IoXCJJbnZhbGlkIEhFWCBjb2xvciBjb2RlXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgKHRyZWUuQ29sb3IpKHJnYlsxXSwgdW5kZWZpbmVkLCAnIycgKyBjb2xvckNhbmRpZGF0ZVN0cmluZyk7XG4gICAgICB9XG4gICAgfVxuICAgICxcblxuICAgIGNvbG9yS2V5d29yZDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGsgPSBwYXJzZXJJbnB1dC4kcmUoL15bX0EtWmEtei1dW19BLVphLXowLTktXSsvKTtcbiAgICAgIGlmICghaykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgY29sb3IgPSB0cmVlLkNvbG9yLmZyb21LZXl3b3JkKGsuaW5wdXQpO1xuICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICAgIH1cbiAgICB9XG4gICAgLFxuXG4gICAgLy9cbiAgICAvLyBBIERpbWVuc2lvbiwgdGhhdCBpcywgYSBudW1iZXIgYW5kIGEgdW5pdFxuICAgIC8vXG4gICAgLy8gICAgIDAuNWVtIDk1JVxuICAgIC8vXG4gICAgZGltZW5zaW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAocGFyc2VySW5wdXQucGVla05vdE51bWVyaWMoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZSA9IHBhcnNlcklucHV0LiRyZSgvXihbKy1dP1xcZCpcXC4/XFxkKykoJXxbYS16X10rKT8vaSk7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyAodHJlZS5EaW1lbnNpb24pKHZhbHVlWzFdLCB2YWx1ZVsyXSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZShpbnB1dCkge1xuICBjb25zdCBwYXJzZWQgPSBQYXJzZShpbnB1dCk7XG4gIGNvbnN0IG1ldGhvZHMgPSBbcGFyc2VkLmNvbG9yRnVuY3Rpb24sIHBhcnNlZC5jb2xvcktleXdvcmQsIHBhcnNlZC5jb2xvciwgcGFyc2VkLmRpbWVuc2lvbiwgcGFyc2VkLmtleXdvcmRdO1xuICBmb3IobGV0IGkgPSAwOyBpIDwgbWV0aG9kcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHJlc3VsdCA9IG1ldGhvZHNbaV0uY2FsbChwYXJzZWQpKSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxufTtcbiJdfQ==