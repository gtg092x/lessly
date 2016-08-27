import {callable} from '../functions';
//
// A function call node.
//
var Call = function (name, args) {
    this.name = name;
    this.args = args;

    if (callable[name]) {
        return callable[name].apply(this, args);
    }

    return null;
};


module.exports = Call;
