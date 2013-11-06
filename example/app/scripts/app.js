'use strict';

angular.module('ParseDemoApp', [
  'ngCookies',
  'ngSanitize',
  'ParseServices'
])
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
})
.run(['ParseSDK', function(ParseServices){
  //parse instantiated throught service injection
}]);
