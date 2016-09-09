(function (exports) {

    'use strict';
    exports.app = new Vue({
        el: 'body',

        data: {
            people: api.get('/').groups[0].users,
            groups: api.get('/'),
            expenses: api.get('/').groups[0].expenses,

            tmpPerson: { email: '', name: ''},
            tmpExpenses: { debtors: [], creditor: { email: '', name: ''}, value: 0, description: ''},

            cache: {},
        },

        watch: {
            people: {
                deep: true,
                handler: function(val) {
                    storage.save('people', val)
                }
            }
        },

        methods: {
            resetState: function() {
                this.tmpPerson = { email: '', name: '' };
                this.tmpExpenses = { debtors: [], creditor: { email: '', name: ''}, value: 0, description: ''};
                this.cache = {};
            },

            /*******************************************************************
             * PEOPLE
             ******************************************************************/

            addPerson: function(person) {
                this.people.push({
                    email: person.email,
                    name: person.name
                });

                this.resetState();
            },

            editPerson: function(person) {
                this.cache = { email: person.email, name: person.name};
                this.tmpPerson = person;
            },

            doneEditPerson: function(person) {
                this.resetState();

                //TODO: Handle empty name
            },

            cancelEditPerson: function(person) {
                person.email = this.cache.email;
                person.name = this.cache.name;
                this.resetState();
            },

            removePerson: function (person) {
                this.people.$remove(person);
            }
        }
    });

})(window);
