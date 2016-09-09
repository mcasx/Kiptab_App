(function (exports) {

    'use strict';

    exports.api = {
        get: function(route) {
            if(route == '/') route = '';

            var results;

            $.get('/api' + route, function (data) {
                console.log('GET ' + (route ? route : '/'));
                console.log(data);
                results = data;
            });

            return results;
        }
    }

})(window);
