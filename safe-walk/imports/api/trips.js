import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Trips = new Mongo.Collection('trips');

if (Meteor.isServer) {
  Meteor.publish('trips', function tripsPublication() {
    return Trips.find();
  });
}

Meteor.methods({
  'trips.insert'(dTime, capacity, travelMode) {
    // check(dTime, String);
    // check(capacity, String);
 
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Trips.insert({
      dTime: dTime,
      capacity: capacity,
      travelMode: travelMode,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'trips.remove'(tripId) {
    check(tripId, String);
 
    Trips.remove(tripId);
  },
});