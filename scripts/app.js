(function (exports) {

    'use strict';
    exports.app = new Vue({
        el: 'body',

        data: {
            state: storage.fetch('state') || { isFirstTime: true, currentUser: {}, currentGroup: {} },
            groups: storage.fetch('groups') || [],
            users: storage.fetch('users') || [],
            trips: storage.fetch('trips') || [],

            tmpExpense: { debtors: [], creditor: { email: '', name: ''}, value: 0, description: '' },
            tmpTrip: { description: '', distance: 0, consumption: 0, fuel: 0, lastPoint: null, isStopped: false, watchId: 0 },
            tmpUser: { email: '', name: ''},

            cache: {},
        },

        watch: {
            state: {
                deep: true,
                handler: function(val) {
                    storage.save('state', val)
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
                    storage.save('users', val)
                }
            }
        },

        methods: {
            resetState: function() {
                this.tmpUser = { email: '', name: '' };
                this.tmpExpense= { debtors: [], creditor: { email: '', name: ''}, value: 0, description: '' },
                this.tmpTrip = { description: '', distance: 0,consumption: 0, fuel: 0, lastPoint: null, isStopped: false, watchId: 0 };
                this.cache = {};
            },

            /*******************************************************************
             * USERS
             ******************************************************************/

             registerUser: function(user) {
                 this.state.isFirstTime = false;
                 this.users.push(user);
             },

            inviteUser: function(user) {
                if(!userExists(this.users, user)) return 0; //ERROR - USER NOT FOUND
                this.state.currentGroup.users.push({
                    email: user.email,
                    name: user.name
                });

                this.resetState();
                return 1;
            },

            removeUser: function (user) {
                this.groups[this.groups.indexOf(this.state.currentGroup)].users.$remove(user);
            },

            groupsOfUser: function (user) {
                var groups = [];

                this.groups.forEach(function(group) {
                    if (arrayContainsObject(group.users, user)) {
                        groups.push(group);
                    }
                });

                return groups;
            },

            /*******************************************************************
             * EXPENSES
             ******************************************************************/

            addExpense: function (expense) {
                this.expenses.push({
                    debtors: expense.debtors,
                    creditor: this.state.currentUser,
                    value: expense.value || 0.00,
                    description: expense.description.trim() || ' '
                });

                this.resetState();
            },

            removeExpense: function (expense) {
                this.groups[this.groups.indexOf(this.state.currentGroup)].expenses.$remove(expense);
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

            /*******************************************************************
             * DEBTS
             ******************************************************************/

             balanceBetween(user1, user2){
                 var group = this.groups[this.groups.indexOf(this.state.currentGroup)];
                 var balance = 0;

                 group.expenses.forEach(function(expense) {
                     if(expense.creditor.email == user1.email && arrayContainsObject(expense.debtors, user2)) {
                         balance += expense.value / expense.debtors.length;
                     }

                     if(expense.creditor.email == user2.email && arrayContainsObject(expense.debtors, user1)) {
                         balance -= expense.value / expense.debtors.length;
                     }
                 });

                 return balance;
             }
        }
    });
})(window);
