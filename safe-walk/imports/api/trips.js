import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Trips = new Mongo.Collection('trips');

if (Meteor.isServer) {
  Meteor.publish('trips', function tripsPublication() {
    return Trips.find();
  });
  
  Accounts.onCreateUser((options, user) => {
    user.admin = false;
    user.currTrip = null;
    user.homeAddress = null;

    if (options.profile) {
      user.profile = options.profile;
    }

    return user;
  });

  Meteor.publish('users', function() {
    if(!this.userId) return null;
    return Meteor.users.find(this.userId, {fields: {
      currTrip: 1,
      admin: 1,
      homeAddress:1,
    }});
  });
}

if (Meteor.isClient) {
  Deps.autorun(function(){
    Meteor.subscribe('users');
  });
}

Meteor.methods({
  'trips.insert'(dTime, capacity, travelMode, startingAddress) {
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Trips.insert({
      dTime: dTime,
      capacity: capacity,
      currCapacity: 0,
      travelMode: travelMode,
      startingAddress: startingAddress,
      users: [],
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'trips.remove'(tripId) {
    check(tripId, String);
    Trips.remove(tripId);
  },
  'trips.update'(tripId, newCapacity, newUsers, address, username) {
    check(tripId, String);
    // create new user object and push
    var newUser = {
      userId: Meteor.userId(),
      username: username,
      homeAddress: address,
    }
    newUsers.push(newUser);

    Trips.update(tripId, {
      $set: { currCapacity: newCapacity, users: newUsers},
    });
    Meteor.users.update(Meteor.userId(), {
      $set: { currTrip: tripId }
    });
  },
  'trips.deregister'(tripId, newCapacity, newUsers) {
    check(tripId, String);

    // Remove user with given id
    var index = -1;
    for(var i = 0, len = newUsers.length; i < len; i++) {
      if (newUsers[i].userId === Meteor.userId()) {
        index = i;
        break;
      }
    }
    newUsers.splice(index, 1);

    // need to find a new way to find index
    Trips.update(tripId, {
      $set: { currCapacity: newCapacity, users: newUsers},
    });
    Meteor.users.update(Meteor.userId(), {
      $set: { currTrip: null }
    });
  },
  'trips.updateUser'(homeAddress) {

    Meteor.users.update(Meteor.userId(), {
      $set: { homeAddress: homeAddress, }
    });
  },
});