(function (exports) {

    'use strict';
    exports.app = new Vue({
        el: 'body',

        data: {
            state: storage.fetch('state') || { isFirstTime: true, currentUser: { name: '', email: '' }, currentGroup: { name: '', expenses: [], users: [] } },
            groups: storage.fetch('groups') || [],
            users: [
                { "email": "silverio@ua.pt", "name": "Silvério" },
                { "email": "fabio.maia@ua.pt", "name": "Fábio Maia" },
                { "email": "manuelxarez@ua.pt", "name": "Manuel Xarez" },
                { "email": "johnconnor@terminator.pt", "name": "John Connor"}
            ],
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
            indexOfGroup: function(group) {
                for(var i = 0; i < this.groups.length; i++) {
                    if (this.groups[i].name == group.name) {
                        return i;
                    }
                }

                return -1;
            },

            resetState: function() {
                this.tmpUser = { email: '', name: '' };
                this.tmpExpense= { debtors: [], creditor: { email: '', name: ''}, value: 0, description: '' },
                this.tmpTrip = { description: '', distance: 0,consumption: 0, fuel: 0, lastPoint: null, isStopped: false, watchId: 0 };
                this.cache = {};
            },

            updateGroup: function() {
                console.log(this.indexOfGroup(this.state.currentGroup));
                this.groups[this.indexOfGroup(this.state.currentGroup)] = this.state.currentGroup;
            },

            /*******************************************************************
             * USERS
             ******************************************************************/

            getUserByEmail: function(email) {
                var u = null;

                this.users.forEach(function(user) {
                    if (user.email == email) {
                        u = user;
                        return;
                    }
                });

                return u;
            },

            registerUser: function(user) {
                this.state.isFirstTime = false;
                this.users.push(user);
            },

            inviteUser: function(email) {
                var u = this.getUserByEmail(email);
                var b = true;

                if (u) {
                    this.state.currentGroup.users.push(u);
                    this.updateGroup();
                } else {
                    b = false;
                }

                this.resetState();

                return b;
            },

            removeUser: function (user) {
                this.state.currentGroup.users.$remove(user);
                this.updateGroup();
            },

            createGroup: function(group) {
                group.users = [this.state.currentUser];
                group.expenses = {};

                this.groups.push(group);
                this.state.currentGroup = group;
            },

            userHasGroup: function() {
                return this.groupsOfUser(this.state.currentUser).length > 0;
            },

            groupsOfUser: function (user) {
                var g = [];

                this.groups.forEach(function(group) {
                    if (helpers.arrayContainsObject(group.users, user)) {
                        g.push(group);
                    }
                });

                return g;
            },

            /*******************************************************************
             * EXPENSES
             ******************************************************************/

            addExpense: function (expense) {
                this.currentGroup.expenses.push({
                    debtors: expense.debtors,
                    creditor: this.state.currentUser,
                    value: expense.value || 0.00,
                    description: expense.description.trim() || ' '
                });

                this.updateGroup();

                this.resetState();
            },

            removeExpense: function (expense) {
                this.state.currentGroup.expenses.$remove(expense);
                this.updateGroup();
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
                 var group = this.state.currentGroup;
                 var balance = 0;

                 group.expenses.forEach(function(expense) {
                     if(expense.creditor.email == user1.email && helpers.arrayContainsObject(expense.debtors, user2)) {
                         balance += expense.value / expense.debtors.length;
                     }

                     if(expense.creditor.email == user2.email && helpers.arrayContainsObject(expense.debtors, user1)) {
                         balance -= expense.value / expense.debtors.length;
                     }
                 });

                 return balance;
             }
        }
    });
})(window);
