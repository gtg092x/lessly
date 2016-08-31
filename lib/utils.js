'use strict';

/* jshint proto: true */
module.exports = {
    copyArray: function copyArray(arr) {
        var i,
            length = arr.length,
            copy = new Array(length);

        for (i = 0; i < length; i++) {
            copy[i] = arr[i];
        }
        return copy;
    },
    camelCaseToDash: function camelCaseToDash(key) {
        return key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwiY29weUFycmF5IiwiYXJyIiwiaSIsImxlbmd0aCIsImNvcHkiLCJBcnJheSIsImNhbWVsQ2FzZVRvRGFzaCIsImtleSIsInJlcGxhY2UiLCJ0b0xvd2VyQ2FzZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2JDLGVBQVcsbUJBQVNDLEdBQVQsRUFBYztBQUNyQixZQUFJQyxDQUFKO0FBQUEsWUFBT0MsU0FBU0YsSUFBSUUsTUFBcEI7QUFBQSxZQUNJQyxPQUFPLElBQUlDLEtBQUosQ0FBVUYsTUFBVixDQURYOztBQUdBLGFBQUtELElBQUksQ0FBVCxFQUFZQSxJQUFJQyxNQUFoQixFQUF3QkQsR0FBeEIsRUFBNkI7QUFDekJFLGlCQUFLRixDQUFMLElBQVVELElBQUlDLENBQUosQ0FBVjtBQUNIO0FBQ0QsZUFBT0UsSUFBUDtBQUNILEtBVFk7QUFVYkUsbUJBVmEsMkJBVUdDLEdBVkgsRUFVUTtBQUNqQixlQUFPQSxJQUFJQyxPQUFKLENBQWEsaUJBQWIsRUFBZ0MsT0FBaEMsRUFBMENDLFdBQTFDLEVBQVA7QUFDSDtBQVpZLENBQWpCIiwiZmlsZSI6InV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoganNoaW50IHByb3RvOiB0cnVlICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjb3B5QXJyYXk6IGZ1bmN0aW9uKGFycikge1xuICAgICAgICB2YXIgaSwgbGVuZ3RoID0gYXJyLmxlbmd0aCxcbiAgICAgICAgICAgIGNvcHkgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICAgICAgXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29weVtpXSA9IGFycltpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9LFxuICAgIGNhbWVsQ2FzZVRvRGFzaChrZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleS5yZXBsYWNlKCAvKFthLXpdKShbQS1aXSkvZywgJyQxLSQyJyApLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxufTtcbiJdfQ==