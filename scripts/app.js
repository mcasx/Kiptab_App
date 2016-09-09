(function (exports) {

    'use strict';
    exports.app = new Vue({
        // the root element that will be compiled
        el: 'body',

        // app initial state
        data: {
            isFirstTime: true,

            user: storage.fetch('user'),
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
            user: {
                deep: true,
                handler: function(val) {
                    storage.save('expenses', val)
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
                this.people.push({
                    email: person.email,
                    name: person.name
                });

                this.resetState();
            },

            removePerson: function (person) {
                this.people.$remove(person);
            },

            editPerson: function (person) {
                this.cache = { email: person.email, name: person.name };
                this.tmpPerson = person;
            },

            doneEditPerson: function (person) {
                this.resetState();

                // TODO: handle empty name
            },

            cancelEditPerson: function (person) {
                person.email = this.cache.email;
                person.name = this.cache.name;
                this.resetState();
            },

            /*******************************************************************
             * EXPENSES
             ******************************************************************/

            addExpense: function (expense) {
                this.expenses.push({
                    value: expense.value || 0.00,
                    description: expense.description.trim() || ' ',
                    numIndebted: this.tmpIndebted.length
                });

                for(var i = 0; i < this.people.length; i++){
                    this.debts[i].push(this.tmpIndebted.includes(i));
                }

                this.resetState();
            },

            removeExpense: function (expense) {
                this.debts = helpers.deleteArrayColumn(this.debts, this.expenses.indexOf(expense));
                this.expenses.$remove(expense);
            },

            editExpense: function (expense) {
                this.cache = { value: expense.value, description: expense.description, tmpIndebted: this.tmpIndebted };
                this.tmpExpense = expense;
            },

            doneEditExpense: function (expense) {
                for(var i = 0; i < this.people.length; i++) {
                    this.debts[i][this.expenses.indexOf(expense)] = this.tmpIndebted.includes(i);
                }

                this.tmpExpense.numIndebted = this.tmpIndebted.length;

                this.resetState();
            },

            cancelEditExpense: function (expense) {
                expense.value = this.cache.value;
                expense.description = this.cache.description;
                this.tmpIndebted = this.cache.tmpIndebted;
                this.resetState();
            },
        }
    });

})(window);
