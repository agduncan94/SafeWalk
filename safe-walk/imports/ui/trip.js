import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import { Trips } from '../api/trips.js';
 
import './trip.html';
 
Template.trip.events({
  'click .delete'() {
   	Meteor.call('trips.remove', this._id);
  },
});

Template.trip.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});