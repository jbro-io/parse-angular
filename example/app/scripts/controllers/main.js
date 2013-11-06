'use strict';

angular.module('ParseDemoApp')
  .controller('MainCtrl', ['$scope', 'ParseObject', 'ParseQuery',
  function ($scope, ParseObject, ParseQuery) {


  	//field schema
  	var fields = [
  		'firstName', 
  		'lastName',
  		'email',
  		];

    var Contact = Parse.Object.extend('Contact');

    //instantiate new contact record
  	$scope.newContact = new ParseObject('Contact', fields);

    //retrieve first record
    var firstRecordQuery = new Parse.Query(Contact);
    ParseQuery(firstRecordQuery, {functionToCall:'first'}).then(function(obj){
    	$scope.firstContact = new ParseObject(obj, fields);
    });

    function getAllContacts(){
      var query = new Parse.Query(Contact);
      ParseQuery(query, {functionToCall:'find'}).then(function(contacts){
        $scope.allContacts = [];
        for(var i=0; i<contacts.length; i++)
        {
          $scope.allContacts.push(new ParseObject(contacts[i],fields));
        }
      })
    }
    getAllContacts();


  }]);
