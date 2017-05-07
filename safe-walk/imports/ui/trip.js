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
  	Meteor.call('trips.update', this._id, newCapacity, newUsers, Meteor.user().homeAddress, Meteor.user().username, Meteor.user().firstName,  Meteor.user().lastName);
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
  	var index = -1;
    for(var i = 0, len = this.users.length; i < len; i++) {
      if (this.users[i].userId === Meteor.userId()) {
        index = i;
        break;
      }
    }
     return index !== -1;
  },
  showBook(currentUser) {
  	var index = -1;
    for(var i = 0, len = this.users.length; i < len; i++) {
      if (this.users[i].userId === Meteor.userId()) {
        index = i;
        break;
      }
    }
  	return (this.currCapacity < this.capacity) && (index === -1) && (currentUser.currTrip === null);
  },
  hasUsers() {
  	return this.users.length > 0;
  },
  isAdmin(currentUser) {
  	return currentUser.admin;
  },
  isNotAdmin(currentUser) {
  	return !currentUser.admin;
  },
  spotsRemaining() {
  	return this.capacity - this.currCapacity;
  },
});