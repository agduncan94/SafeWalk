import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Trips } from '../api/trips.js';

import './trip.js';
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
});

Template.body.events({
  'submit .new-trip'(event) {
    event.preventDefault();
    const target = event.target;
    const dTime = target.dTime.value;
    const capacity = target.capacity.value;
    const travelMode = target.travelMode.value;
    Meteor.call('trips.insert', dTime, capacity, travelMode);
    target.dTime.value = '';
    target.capacity.value = '';
    target.travelMode.value = '';
  },
});

$(document).ready(function() {
  $('select').material_select();
  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15 // Creates a dropdown of 15 years to control year
  });
  $('.clockpicker').clockpicker()
  .find('input').change(function(){
    // TODO: time changed
    console.log(this.value);
  });
});