(function (exports) {

    'use strict';

    var STORAGE_KEY = 'dividentravel';

    exports.storage = {
        fetch: function (collection) {
            return JSON.parse(localStorage.getItem(STORAGE_KEY + '-' + collection) || '[]');
        },
        save: function (collection, items) {
            localStorage.setItem(STORAGE_KEY + '-' + collection, JSON.stringify(items));
        }
    };

})(window);
