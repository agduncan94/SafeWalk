import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Trips = new Mongo.Collection('trips');

if (Meteor.isServer) {
  Meteor.publish('trips', function tripsPublication() {
    return Trips.find();
  });
  Accounts.onCreateUser((options, user) => {
    user.admin = true;
    user.currTrip = null;

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
    }});
  });
}

if (Meteor.isClient) {
  Deps.autorun(function(){
    Meteor.subscribe('users');
  });
}

Meteor.methods({
  'trips.insert'(dTime, capacity, travelMode) {
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Trips.insert({
      dTime: dTime,
      capacity: capacity,
      currCapacity: 0,
      travelMode: travelMode,
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
  'trips.update'(tripId, newCapacity, newUsers) {
    check(tripId, String);
    newUsers.push(Meteor.userId());
    Trips.update(tripId, {
      $set: { currCapacity: newCapacity, users: newUsers},
    });
    Meteor.users.update(Meteor.userId(), {
      $set: { currTrip: tripId }
    });
  },
  'trips.deregister'(tripId, newCapacity, newUsers) {
    check(tripId, String);
    var index = newUsers.indexOf(Meteor.userId());
    newUsers.splice(index, 1);
    Trips.update(tripId, {
      $set: { currCapacity: newCapacity, users: newUsers},
    });
    Meteor.users.update(Meteor.userId(), {
      $set: { currTrip: null }
    });
  },
});