"use strict";

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
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwiY29weUFycmF5IiwiYXJyIiwiaSIsImxlbmd0aCIsImNvcHkiLCJBcnJheSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2JDLGVBQVcsbUJBQVNDLEdBQVQsRUFBYztBQUNyQixZQUFJQyxDQUFKO0FBQUEsWUFBT0MsU0FBU0YsSUFBSUUsTUFBcEI7QUFBQSxZQUNJQyxPQUFPLElBQUlDLEtBQUosQ0FBVUYsTUFBVixDQURYOztBQUdBLGFBQUtELElBQUksQ0FBVCxFQUFZQSxJQUFJQyxNQUFoQixFQUF3QkQsR0FBeEIsRUFBNkI7QUFDekJFLGlCQUFLRixDQUFMLElBQVVELElBQUlDLENBQUosQ0FBVjtBQUNIO0FBQ0QsZUFBT0UsSUFBUDtBQUNIO0FBVFksQ0FBakIiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBqc2hpbnQgcHJvdG86IHRydWUgKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNvcHlBcnJheTogZnVuY3Rpb24oYXJyKSB7XG4gICAgICAgIHZhciBpLCBsZW5ndGggPSBhcnIubGVuZ3RoLFxuICAgICAgICAgICAgY29weSA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgICAgICBcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb3B5W2ldID0gYXJyW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbn07XG4iXX0=