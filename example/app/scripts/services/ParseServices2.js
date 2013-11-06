angular.module('ParseServices2', [])

.factory('ParseSDK', function(){
	//initialize parse
  	Parse.initialize("bHFg1WL11No24JnQ52lKsXoiYXOJnfJUXhEizUZD", "b9mkopWAE3pnEFQ3GSnHaLIxMNhcbnUF02gsgPZ8");
})


.factory('ParseQuery', [function(){

}])


.factory('ParseObject', ['$http','$q','$localStorage', function($http, $q, $localStorage){

	var defer = $q.defer();

	function successHandler(data, status, headers, config){
		console.log('success:', data);
		defer.resolve(data);
	};

	function errorHandler(data, status, headers, config){
		console.log('error:', data.code, data.error);
		defer.reject(data);
	};

	var config = {
		headers: {
			'X-Parse-Application-Id': 'tJQ889YzDkLQJk8WR7Fg7IY8oLhTWWOqAAUnlGXy',
			'X-Parse-REST-API-Key': 'w4QqAYIW4fdyp9YYjY90nD6MHYvetm25w4CDEqt9'
		}
	};

	function ParseObject(className, currentObj){

		if(className == undefined) throw new Error('Missing Parse class name');

		if(currentObj != undefined) angular.extend(this, currentObj);

		var baseUrl = 'https://api.parse.com/1/classes/'+ className + '/';

		if(className == 'User')
		{
			baseUrl = 'https://api.parse.com/1/users/';
			config.headers['X-Parse-Session-Token'] = $localStorage.parseSessionToken;
		}
			
		this.save = function(){
			if(!this.objectId)
			{
				var self = this;
				$http.post(baseUrl, this, config).success(function(data, status, headers, _config){
					angular.extend(self, data);
				}).error(errorHandler);
			}
			else
			{
				var payload = this;
				
				//strips session token property from user object update
				if(payload.sessionToken) delete payload.sessionToken;

				$http.put(baseUrl+this.objectId, payload, config).success(successHandler).error(errorHandler);
			}
			
			return defer.promise;
		}

		this.fetch = function(){
			var self = this;

			$http.get(baseUrl+this.objectId, config).success(function(user){
				angular.extend(self, user);
			}).error(errorHandler);
			return defer.promise;
		}

		this.destroy = function(){
			$http.delete(baseUrl+this.objectId, config).success(successHandler).error(errorHandler);
			return defer.promise;
		}

		this.first = function(){
			console.log(config);
			var self = this;
			$http.get(baseUrl, config).success(function(data, status, headers, _config){
				
				var record = data.results[0];
				angular.extend(self, record);
				defer.resolve(self);

				console.log(self);

					
			}).error(errorHandler);

			return defer.promise;
		}
	}


	return ParseObject;

}])

.factory('ParseUser',[function(){
	return function (){
		console.log('new user instantiated');
	}
}])

.factory('ParseUser',['$q','$http','$localStorage', 'ParseObject', function($q, $http, $localStorage, ParseObject){
	var defer = $q.defer();

	function successHandler(data, status, headers, config){
		console.log('success:', data);
		defer.resolve(data);
	};

	function errorHandler(data, status, headers, config){
		// console.log('error:', data.code, data.error);
		defer.reject(data);
	};

	var config = {
		headers: {
			'X-Parse-Application-Id': 'tJQ889YzDkLQJk8WR7Fg7IY8oLhTWWOqAAUnlGXy',
			'X-Parse-REST-API-Key': 'w4QqAYIW4fdyp9YYjY90nD6MHYvetm25w4CDEqt9'
		}
	};

	var baseUrl = 'https://api.parse.com/1/users/';

	function ParseUser(){

		

	}

	if(this instanceof ParseUser)
	{
		console.log('is an instance');
		return ParseUser;
	}
	else
	{
		return {
			signUp: function(){
				console.log('signing up...');
			},
			resetPassword: function(){

			},
			current: function(){

				var sessionToken = $localStorage.parseSessionToken;
				config.headers['X-Parse-Session-Token'] = sessionToken;

				var self = this;

				var request = $http.get(baseUrl+'me', config).success(function(user){
					defer.resolve(new ParseObject('User', user));
				}).error(errorHandler);

				return defer.promise;
			},
			login: function(username, password){
				var endpoint = 'https://api.parse.com/1/login?username='+username+'&password='+password;

				$http.get(endpoint, config).success(function(data, status, headers, _config){
					
					//store session locally
					$localStorage.parseSessionToken = data.sessionToken;
					
					defer.resolve(new ParseObject('User', data));

				}).error(errorHandler);

				return defer.promise;
			},
			logout: function(){

			}

		};
	}

}])

