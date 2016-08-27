var tree = require('../tree');

function error(...args) {
  throw new Error(...args);
}

function Parse(input) {

  const parserInput = {
    $re(regex) {
      return input.match(regex);
    },
    $char(char) {
      return input.indexOf(char) > -1;
    },
    currentChar() {
      return input[0];
    },
    peekNotNumeric() {
      return !/[\d]/.test(input);
    }
  };

  return {
    arguments() {
      const match = parserInput.$re(/\((.+)\)$/);
      const argArray = match && match[1] && match[1].split(/,\s*(?![^(]*\))/);
      return argArray.map(arg => parse(arg.trim()));
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
    colorFunction: function () {
      var name, nameLC, args, alpha, index = 0;

      name = parserInput.$re(/^([\w-]+)\(/);
      if (!name) { return; }

      name = name[1];
      args = this.arguments();

      if (! parserInput.$char(')')) {
        parserInput.restore("Could not parse call arguments or missing ')'");
        return;
      }

      return new(tree.Call)(name, args, index);
    },
    //
    // A string, which supports escaping " and '
    //
    //     "milky way" 'he\'s the one!'
    //
    keyword: function () {
      var k = parserInput.$re(/^[_A-Za-z-][_A-Za-z0-9-]*/);
      if (k) {
        return tree.Color.fromKeyword(k.input) || new (tree.Keyword)(k.input);
      }
    },
    //
    // A Hexadecimal color
    //
    //     #4F3C2F
    //
    // `rgb` and `hsl` colors are parsed through the `entities.call` parser.
    //
    color: function () {
      var rgb;

      if (parserInput.currentChar() === '#' && (rgb = parserInput.$re(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/))) {
        // strip colons, brackets, whitespaces and other characters that should not
        // definitely be part of color string
        var colorCandidateString = rgb.input.match(/^#([\w]+).*/);
        colorCandidateString = colorCandidateString[1];
        if (!colorCandidateString.match(/^[A-Fa-f0-9]+$/)) { // verify if candidate consists only of allowed HEX characters
          error("Invalid HEX color code");
        }
        return new (tree.Color)(rgb[1], undefined, '#' + colorCandidateString);
      }
    }
    ,

    colorKeyword: function () {
      var k = parserInput.$re(/^[_A-Za-z-][_A-Za-z0-9-]+/);
      if (!k) {
        return;
      }
      var color = tree.Color.fromKeyword(k.input);
      if (color) {
        return color;
      }
    }
    ,

    //
    // A Dimension, that is, a number and a unit
    //
    //     0.5em 95%
    //
    dimension: function () {
      if (parserInput.peekNotNumeric()) {
        return;
      }

      var value = parserInput.$re(/^([+-]?\d*\.?\d+)(%|[a-z_]+)?/i);
      if (value) {
        return new (tree.Dimension)(value[1], value[2]);
      }
    }
  };
}

export default function parse(input) {
  const parsed = Parse(input);
  const methods = [parsed.colorFunction, parsed.colorKeyword, parsed.color, parsed.dimension, parsed.keyword];
  for(let i = 0; i < methods.length; i++) {
    let result;
    if (result = methods[i].call(parsed)) {
      return result;
    }
  }
};
