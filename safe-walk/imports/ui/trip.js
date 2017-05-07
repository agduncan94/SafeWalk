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
  	var newUsers = this.users;
  	Meteor.call('trips.update', this._id, newCapacity, newUsers);
   	Materialize.toast('Spot requested', 4000)
  },
  'click .deregister'() {
  	var newCapacity = this.currCapacity-1;
  	var newUsers = this.users;
  	Meteor.call('trips.deregister', this._id, newCapacity, newUsers);
   	Materialize.toast('Spot removed', 4000)
  },
});

Template.trip.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
  showDeregister() {
  	return this.users.includes(Meteor.userId());
  },
  showBook(currentUser) {
  	console.log(currentUser);
  	return (this.currCapacity < this.capacity) && !(this.users.includes(Meteor.userId())) && (currentUser.currTrip === null);
  }
});