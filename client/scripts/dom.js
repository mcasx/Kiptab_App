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
        },

        init: function() {
            var list = [
                { dialog: '#trip-add-dialog', button: '#trip-add-button'},
                { dialog: '#people-add-dialog', button: '#people-add-button'},
                { dialog: '#people-edit-dialog', button: '.people-edit-button'},
                { dialog: '#expenses-add-dialog', button: '#expenses-add-button' },
                { dialog: '#expenses-edit-dialog', button: '.expenses-edit-button' },
            ];

            list.forEach(function(i) {
                dom.registerDialogAndButton(i.dialog, i.button);
            });
        }
    };

})(window);
