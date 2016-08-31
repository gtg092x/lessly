import parse from './parser/parser'
export {parse};

/*
  Converts camelCase to camel-case
 */
function camelCaseToDash(key) {
  return key.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
}

/*
 Parses @var with {var: 'value'}
 */
function parseVars(str, vars = {}) {
  const keys = Object.keys(vars);
  keys.sort(function(a, b){
    return b.length - a.length;
  });
  return keys.reduce((pointer, key) => {
    const replacement = vars[key];
    const _key = key[0] === '@' ? key : `@${key}`;
    const dashKey = camelCaseToDash(_key);
    if (dashKey !== _key) {
      pointer = pointer.replace(dashKey, replacement);
    }

    return pointer.replace(_key, replacement);
  }, str);
}

/*
  Parses less entity string
 */
function lessly(str, vars = {}) {
  const finalstr = parseVars(str, vars);
  return parse(finalstr).toCSS();
};

export default lessly;
export {lessly};

// export functions

// parse function args so we dont need to expose Color Node
function bindParse(func, vars, convert = true) {
  return (...args) => {
    const finalArgs = args.map(arg => parseVars(String(arg), vars));
    let result = func(...finalArgs.map((...argSet) => convert ? parse(...argSet) : argSet[0]));
    if (convert) {
      result = result.toCSS();
    }
    return isNaN(result) ? result : Number(result);
  };
}

import {callable} from './functions';

export {callable};

export function theme(vars = {}) {
  let defaulFunction = (str, subVars = {}) => {
    return lessly(str, {...vars, ...subVars});
  };

  defaulFunction = Object.keys(callable).reduce((pointer, key) => {
    const func = callable[key];
    pointer[key] = bindParse(func, vars);
    return pointer;
  }, defaulFunction);

  defaulFunction = Object.keys(dimensions).reduce((pointer, key) => {
    const func = dimensions[key];
    pointer[key] = bindParse(func, vars, false);
    return pointer;
  }, defaulFunction);

  return defaulFunction;
}

const colorFunctions = Object.keys(callable).reduce((pointer, key) => {
  const func = callable[key];
  return {
    ...pointer,
    [key]: bindParse(func)
  };
}, {});

export {colorFunctions};

for(let key in colorFunctions) {
  module.exports[key] = colorFunctions[key];
}

function isPlainObj(o) {
  return typeof o == 'object' && o.constructor == Object;
}

import Dimension from './tree/dimension';
export function dimension(val, unit, ...args) {
  if (isPlainObj(val)) {
    return Object.keys(val).reduce(function(pointer, key){
      const subVal = val[key];
      return {
        ...pointer,
        [key]: dimension(subVal, unit, ...args)
      };
    }, {});
  }
  if (unit === undefined) {
    return op(val);
  }
  if (args.length) {
    return op(toOps(val, unit, ...args));
  }
  if (containsOp(val) || containsOp(unit)) {
    return op(toOps(val, unit));
  }
  const dim = new Dimension(val, unit);
  return dim.toCSS();
}

export function value(val) {
  const dim = new Dimension(val, unit);
  return Number(dim.toCSS());
}

function containsOp(val) {
  return val.search && val.search(/[\+\*\-\/]/) > -1;
}

function toOps(...args) {
  return args.map(arg => arg.trim ? arg.trim() : arg).join(' ');
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
  let [result, ...args] = val.split(' ');
  if (args.length < 2) {
    const dim = new Dimension(result);
    return dim.toCSS();
  }
  result = new Dimension(...getArgs(result));
  while(args.length >= 2) {
    const [op, val2] = args.slice(0, 2);
    args = args.slice(2);
    const dim1 = result;
    const dim2 = new Dimension(...getArgs(val2));
    result = dim1.operate({}, op, dim2);
  }
  return result.toCSS();
}

export const dim = dimension;
export const px = val => dimension(val, 'px');
export const percent = val => dimension(val, '%');
export const em = val => dimension(val, 'em');
export const rad = val => dimension(val, 'rad');
export const pt = val => dimension(val, 'pt');
export const vh = val => dimension(val, 'vh');
export const vw = val => dimension(val, 'vw');
export const inch = val => dimension(val, 'in');
export const mm = val => dimension(val, 'mm');
export const vmin = val => dimension(val, 'vmin');
export const cm = val => dimension(val, 'cm');
export const pc = val => dimension(val, 'pc');
export const ex = val => dimension(val, 'ex');

export const dimensions = {
  px, percent, inch, mm, vh, vw, rad, pt, cm, vmin, pc, ex, dimension, dim
};
