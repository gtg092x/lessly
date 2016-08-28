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
function bindParse(func, vars) {
  return (...args) => {
    const finalArgs = args.map(arg => parseVars(String(arg), vars));
    const result = func(...finalArgs.map(parse)).toCSS();
    return isNaN(result) ? result : Number(result);
  };
}

import {callable} from './functions';

export {callable};

export function theme(vars = {}) {
  const defaulFunction = (str, subVars = {}) => {
    return lessly(str, {...vars, ...subVars});
  };

  return Object.keys(callable).reduce((pointer, key) => {
    const func = callable[key];
    pointer[key] = bindParse(func, vars);
    return pointer;
  }, defaulFunction);
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
