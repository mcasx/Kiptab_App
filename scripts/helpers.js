(function (exports) {

    'use strict';

    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }

    exports.helpers = {
        arrayDeleteColumn: function(arr, col) {
            return arr.map(function(subarr){
                return subarr.slice(0, col);
            });
        },

        arrayDeleteRow: function(arr, row) {
            arr.splice(row,1);
            return arr;
        },

        arrayContainsObject: function(arr, obj) {
            var b = false;
            arr.forEach(function(item) {
                if (helpers.areObjectsEqual(item, obj)) {
                    b = true;
                }
            });

            return b;
        },

        areObjectsEqual: function(obj1, obj2) {
            return JSON.stringify(obj1) === JSON.stringify(obj2);
        },

        randomInteger: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
    };

})(window);
