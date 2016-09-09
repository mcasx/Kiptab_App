(function (exports) {

    'use strict';

    exports.app = new Vue({
        el: 'body',

        data: {
            users: {},
            expenses: {},

            tmpUser: { email: '', name: '' },
            tmpExpenses: { debtors: [], creditor: { email: '', name: ''}, value: 0, description: '' },

            cache: {},
        },

        ready: function() {
            var self = this;

            $.get('/api', function (data) {
                self.users = data.groups[0].users;
                self.expenses = data.groups[0].expenses;
            });
        },

        methods: {
            resetState: function() {
                this.tmpUser = { email: '', name: '' };
                this.tmpExpenses = { debtors: [], creditor: { email: '', name: ''}, value: 0, description: '' };
                this.cache = {};
            },

            /*******************************************************************
             * USERS
             ******************************************************************/

            addUser: function(user) {
                this.users.push({
                    email: user.email,
                    name: user.name
                });

                this.resetState();
            },

            editUser: function(user) {
                this.cache = { email: user.email, name: user.name};
                this.tmpUser = user;
            },

            doneEditUser: function(user) {
                this.resetState();
            },

            cancelEditUser: function(user) {
                user.email = this.cache.email;
                user.name = this.cache.name;
                this.resetState();
            },

            removeUser: function (user) {
                this.users.$remove(user);
            }
        }
    });

})(window);
