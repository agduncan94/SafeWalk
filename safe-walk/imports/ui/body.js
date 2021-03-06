import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Trips } from '../api/trips.js';

import './trip.js';
import './cas-login.html';
import './cas-login.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('trips');
});

Template.body.helpers({
  trips() {
    return Trips.find({}, { sort: { createdAt: -1 } });
  },
  formatDate() {
    return moment(new Date()).format("dddd, MMMM Do YYYY");
  },
  getTripTypeById(tripId) {
    return Trips.findOne({"_id": tripId}, {}).travelMode;
  },
  getTripTimeById(tripId) {
    return Trips.findOne({"_id": tripId}, {}).dTime;
  },
  getTripStartingAddressById(tripId) {
    return Trips.findOne({"_id": tripId}, {}).startingAddress;
  },
  currTripSet(tripId){
    return tripId !== null;
  },
  isAdmin(currentUser) {
    return currentUser.admin;
  },
});

Template.body.events({
  'submit .new-trip'(event) {
    event.preventDefault();
    const target = event.target;
    const dTime = target.dTime.value;
    const capacity = target.capacity.value;
    const travelMode = target.travelMode.value;
    const startingAddress = target.startingAddress.value;
    Meteor.call('trips.insert', dTime, capacity, travelMode, startingAddress);
    target.dTime.value = '';
    target.capacity.value = '';
    target.travelMode.value = '';
    target.startingAddress.value = '';
  },
  'submit .update-user'(event) {
    event.preventDefault();
    const target = event.target;
    const homeAddress = target.homeAddress.value;
    Meteor.call('trips.updateUser', homeAddress);
    $('#modal1').modal('close');
  },
});

$(document).ready(function() {
  $('select').material_select();
  $('.clockpicker').clockpicker()
  .find('input').change(function(){
    console.log(this.value);
  });
  $('.modal').modal();
});