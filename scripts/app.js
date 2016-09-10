(function (exports) {

    'use strict';
    exports.app = new Vue({
        el: 'body',

        data: {
            //Handled locally
            state: storage.fetch('state') || { isFirstTime: true, currentUser: { name: '', email: '' }, currentGroup: { name: '', expenses: [], users: [] } },
            //Handled @server
            groups: storage.fetch('groups') || [],
            //Handled @server
            users: [
                { "email": "silverio@ua.pt", "name": "Silvério" },
                { "email": "fabio.maia@ua.pt", "name": "Fábio Maia" },
                { "email": "manuelxarez@ua.pt", "name": "Manuel Xarez" },
                { "email": "johnconnor@terminator.pt", "name": "John Connor"}
            ],
            //Handled locally
            trips: storage.fetch('trips') || [],

            tmpExpense: { debtors: [], creditor: { email: '', name: ''}, value: 0, description: '' },
            tmpTrip: { debtors: [], creditor: { email: '', name: ''}, distance: 0, description: '', pricePerLiter: 0, consumption: 0, lastPoint: null, currentState: 0, watchId: 0 },
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
            },

            trips: {
                deep: true,
                handler: function(val) {
                    storage.save('trips', val)
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

            indexOfUser: function(user,group) {
                for(var i = 0; i < group.users.length; i++) {
                    if (group.users[i].name == user.name) {
                        return i;
                    }
                }

                return 0;
            },

            sameUser: function(user1, user2) {
                return user1.email == user2.email;
            },

            resetState: function() {
                this.tmpUser = { email: '', name: '' };
                this.tmpExpense= { debtors: [], creditor: { email: '', name: ''}, value: 0, description: '' };
                this.tmpTrip= { debtors: [], creditor: { email: '', name: ''}, distance: 0, description: '', pricePerLiter: 0, consumption: 0, lastPoint: null, currentState: 0, watchId: 0 };
                this.cache = {};
            },

            updateGroup: function() {
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
                group.expenses = [];

                this.groups.push(group);
                this.state.currentGroup = group;
            },

            userHasGroup: function() {
                return this.groupsOfUser(this.state.currentUser).length > 0;
            },

            userExistsIn: function(array, user) {
                var b = false;

                array.forEach(function(item) {
                    if(item.email == user.email) {
                        b = true;
                    }
                });

                return b;
            },

            groupsOfUser: function (user) {
                var g = [];
                var self = this;
                this.groups.forEach(function(group) {
                    if (self.userExistsIn(group.users, user)) {
                        g.push(group);
                    }
                });

                return g;
            },

            usersInCurrentGroup: function() {
                return groupsOfUser(this.state.tmpUser)
            },

            /*******************************************************************
             * EXPENSES
             ******************************************************************/

            addExpense: function (expense) {
                var debtors = [];
                for(var i=0; i < expense.debtors.length; i++){
                        debtors.push(this.getUserByEmail(expense.debtors[i]));
                };

                this.state.currentGroup.expenses.push({
                    debtors: debtors,
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
                var debtors = [];
                for(var i = 0; i < expense.debtors.length; i++) {
                    debtors.push(this.getUserByEmail(expense.debtors[i]));
                }

                expense.debtors = debtors;

                this.updateGroup();
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
             },

             /*******************************************************************
              * TRIPS
              ******************************************************************/

              addTrip: function(trip) {
                  this.trips.push({
                      debtors: trip.debtors,
                      creditor: this.state.currentUser,
                      distance: 0,
                      description: trip.description.trim() || ' ',
                      pricePerLiter: trip.pricePerLiter,
                      consumption: trip.consumption,
                      lastPoint: null,
                      currentState: 0,
                      watchId: 0
                  });

                  this.resetState();
              },

              startTrip: function(trip) {
                  if(!navigator.geolocation) console.log('Geolocation is not supported.');
                  trip.currentState = 1;
                  var options = {
                      enableHighAccuracy: false,
                      timeout: 5000,
                      maximumAge: 0
                  };

                  var self = this;
                  // Push first position
                  navigator.geolocation.getCurrentPosition(function(position){
                      self.trips[self.trips.indexOf(trip)].lastPoint = position;
                  }, function(err) {
                      console.warn('ERROR(' + err.code + '): ' + err.message);
                  }, options);

                  // Position watcher, pushes new position when user moves, calculate distance as you go
                  trip.watchId = navigator.geolocation.watchPosition(function(position) {
                      trip.distance += self.calculateDistance(position, trip.lastPoint);
                      trip.lastPoint = position;
                  }, function(err) {
                      console.warn('ERROR(' + err.code + '): ' + err.message);
                  }, options);
              },

              pauseTrip: function(trip) {
                  navigator.geolocation.clearWatch(trip.watchId);
                  trip.currentState = 2;
              },

              stopTrip: function(trip) {
                  navigator.geolocation.clearWatch(trip.watchId);

                  var expense = {
                      debtors: trip.debtors,
                      creditor: trip.creditor,
                      value: trip.distance / trip.consumption * trip.pricePerLiter,
                      description: trip.description + ' (' + trip.distance.toFixed(2) + ' km)'
                  };
                  trip.currentState = 3;

                  this.addExpense(expense);
              },

              // TODO: use altitude as well
              calculateDistance: function(p1, p2) {
                  var R = 6371;
                  var lat1 = p1.coords.latitude;
                  var lat2 = p2.coords.latitude;

                  var lon1 = p1.coords.longitude;
                  var lon2 = p2.coords.longitude;

                  var dLat = (lat2 - lat1).toRad();
                  var dLon = (lon2 - lon1).toRad();

                  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                          Math.sin(dLon / 2) * Math.sin(dLon / 2);
                  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                  var d = R * c;

                  return d;
              }
        }
    });
})(window);
