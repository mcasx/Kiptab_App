(function (exports) {

    'use strict';

    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }

    exports.helpers = {
        randomInteger: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        deleteArrayColumn: function(arr, col) {
            return arr.map(function(subarr){
                return subarr.slice(0, col);
            });
        },
        deleteArrayRow: function(arr,row) {
            arr.splice(row,1);
            return arr;
        }
    };

})(window);
