# parse-angular
Utilities for working with Parse.com data.

Check out my [blog post](http://www.jonathanbroquist.com/integrating-parse-data-with-ng-model-in-angularjs/) for a more detailed walkthough.

## Create a new object
```
//create new contact record from string
$scope.newContact = new ParseObject('Contact', ['firstName','lastName','email']);

/* OR */

//create new contact record from parse object instance
var Contact = Parse.Object.extend('Contact');
$scope.newContact = new ParseObject(new Contact(), ['firstName','lastName','email']);
```
We can now bind $scope.newContact to any directive with ng-model to modify or display the object properties.
```
<input type="text" ng-model="newContact.firstName" />
<input type="text" ng-model="newContact.lastName" />
<input type="text" ng-model="newContact.email" />
<button ng-click="newContact.save()">Save</button>
```

## Retrieving records
```
var query = new Parse.Query(Parse.Object.extend('Contact'));
ParseQuery(query, {functionToCall:'first'}).then(function(obj){
    $scope.newContact = new ParseObject(obj, ['firstName','lastName','email']);
});
```
This creates a query to retrieve the first record from the Contact class. The returned object is then wrapped in an instance of my ParseObject function allowing the fields to be accessed via the object properties.
