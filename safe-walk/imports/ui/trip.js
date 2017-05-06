import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import { Trips } from '../api/trips.js';
 
import './trip.html';
 
Template.trip.events({
  'click .delete'() {
   	Meteor.call('trips.remove', this._id);
   	Materialize.toast('Trip removed', 4000)
  },
  'click .register'() {
  	var newCapacity = this.currCapacity+1;
  	Meteor.call('trips.update', this._id, newCapacity);
   	Materialize.toast('Spot requested', 4000)
  },
});

Template.trip.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
  hasSpotsLeft() {
  	return this.currCapacity < this.capacity;
  }
});