(function (exports) {

    'use strict';
    exports.app = new Vue({
        el: 'body',

        data: {
            people: storage.fetch('people'),
            tmpPerson: { name: ''},

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
                this.tmpPerson = { name: '' };
                this.cache = {};
            },

            /*******************************************************************
             * PEOPLE
             ******************************************************************/

            addPerson: function(person) {
                this.people.push({
                    name: person.name
                });

                this.resetState();
            },
            
            editPerson: function(person) {
                this.cache = { name: person.name };
                this.tmpPerson = person;
            },

            doneEditPerson: function(person) {
                this.resetState();

                //TODO: Handle empty name
            },

            cancelEditPerson: function(person) {
                person.name = this.cache.name;
                this.resetState();
            }

            removePerson: function (person) {
                this.people.$remove(person);
            }
        }
    });

})(window);
