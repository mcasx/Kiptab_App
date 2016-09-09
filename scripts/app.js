(function (exports) {

    'use strict';
    exports.app = new Vue({
        // the root element that will be compiled
        el: 'body',

        // app initial state
        data: {
            settings: storage.fetch('settings'),
            groups: storage.fetch('groups'),
            users: storage.fetch('users'),
            trips: storage.fetch('trips'),

            tmpExpense: { debtors: [], creditor: { email: '', name: ''}, value: 0, description: '' },
            tmpTrip: { description: '', distance: 0, consumption: 0, fuel: 0, lastPoint: null, isStopped: false, watchId: 0 },
            tmpPerson: { email: '', name: ''},
            tmpIndebted: [],

            cache: {},
        },

        // watch expenses change for localStorage persistence
        watch: {

            settings: {
                deep: true,
                handler: function(val) {
                    storage.save('settings', val)
                }
            },

            groups: {
                deep: true,
                handler: function(val) {
                    storage.save('groups', val)
                }
            },

            users: {
                deep: true,
                handler: function(val) {
                    storage.save('people', val)
                }
            }
        },

        methods: {
            resetState: function() {
                this.tmpPerson = { email: '', name: '' };
                this.tmpExpense= { debtors: [], creditor: { email: '', name: ''}, value: 0, description: '' },
                this.tmpIndebted = [];
                this.tmpTrip = { description: '', distance: 0,consumption: 0, fuel: 0, lastPoint: null, isStopped: false, watchId: 0 };
                this.cache = {};
            },

            /*******************************************************************
             * PEOPLE
             ******************************************************************/

            invitePerson: function(person) {
                this.groups[this.groups.indexOf(this.settings.currentGroup)].users.push({
                    email: person.email,
                    name: person.name
                });

                this.resetState();
            },

            removePerson: function (person) {
                this.groups[this.groups.indexOf(this.settings.currentGroup)].users.$remove(person);
            },

            /*******************************************************************
             * EXPENSES
             ******************************************************************/

            addExpense: function (expense) {
                this.expenses.push({
                    debtors: expense.debtors;
                    creditor: this.settings.currentUser,
                    value: expense.value || 0.00,
                    description: expense.description.trim() || ' '
                });

                this.resetState();
            },

            removeExpense: function (expense) {
                this.groups[this.groups.indexOf(this.settings.currentGroup)].expenses.$remove(expense);
            },

            editExpense: function (expense) {
                this.cache = { debtors: expense.debtors, creditor: expense.creditor, value: expense.value, description: expense.description};
                this.tmpExpense = expense;
            },

            doneEditExpense: function (expense) {
                this.resetState();
            },

            cancelEditExpense: function (expense) {
                expense.debtors = this.cache.debtors;
                expense.creditor = this.cache.creditor;
                expense.value = this.cache.value;
                expense.description = this.cache.description;

                this.resetState();
            },
        }
    });

})(window);
