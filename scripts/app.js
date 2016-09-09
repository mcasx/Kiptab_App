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

            removePerson: function (person) {
                this.people.$remove(person);
            }
        }
    });

})(window);
