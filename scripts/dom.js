(function (exports) {

    'use strict';

    exports.dom = {
        registerDialog: function(dialog) {
            var d = document.querySelector(dialog);

            //if(!d.showModal) dialogPolyfill.registerDialog(d);

            d.showModal();
        },

        closeDialog: function(dialog) {
            var d = document.querySelector(dialog);

            d.close();
        },

        registerDialogAndButton: function (dialog, button) {
            dialog = document.querySelector(dialog);
            button = document.querySelectorAll(button);

            if(!dialog.showModal) dialogPolyfill.registerDialog(dialog);

            button.forEach(function(button) {
                button.addEventListener('click', function() {
                    dialog.showModal();
                });
            });

            dialog.querySelector('.close').addEventListener('click', function() {
                dialog.close();
            });

            dialog.querySelector('.submit').addEventListener('click', function() {
                dialog.close();
            });
        }
    };

})(window);
