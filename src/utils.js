/* jshint proto: true */
module.exports = {
    copyArray: function(arr) {
        var i, length = arr.length,
            copy = new Array(length);
        
        for (i = 0; i < length; i++) {
            copy[i] = arr[i];
        }
        return copy;
    },
    camelCaseToDash(key) {
        return key.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
    }
};
