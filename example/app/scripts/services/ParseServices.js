angular.module('ParseServices', [])

.factory('ParseSDK', function(){
	//initialize parse
  	Parse.initialize("bHFg1WL11No24JnQ52lKsXoiYXOJnfJUXhEizUZD", "b9mkopWAE3pnEFQ3GSnHaLIxMNhcbnUF02gsgPZ8");
})

.factory('ParseQuery', ['$q', '$rootScope', function ($q, $rootScope){
	return function(query, options){
		var defer = $q.defer();

		//default function call to find
		var functionToCall = 'find';
		if(options != undefined && options.functionToCall != undefined)
			functionToCall = options.functionToCall;

		console.log(functionToCall, query);

		//wrap defer resolve/reject in $apply so angular updates watch listeners
  		var defaultParams = [{
  			success: function(data){
  				$rootScope.$apply(function(){
  					defer.resolve(data);
  				});
  			},
  			error: function(data, error){
  				console.log('error:', error);
  				$rootScope.$apply(function(){
  					defer.reject(error);
  				});
  			}
  		}];

  		//check for additional parameters to add
		if(options && options.params)
			defaultParams = options.params.concat(defaultParams);


		query[functionToCall].apply(query, defaultParams);

		return defer.promise;
	}
}])

.factory('ParseObject', ['ParseQuery', function(ParseQuery){

	return function (parseData, fields){

		//verify parameters
		if(parseData == undefined) throw new Error('Missing parseData');
		if(fields == undefined) throw new Error('Missing fields.');

		//internal parse object reference
		var	parseObject = parseData;
		var model;

		//instantiate new parse object from string 
		if(typeof parseData == 'string')
		{
			var ParseModel = Parse.Object.extend(parseData);		
			parseObject = new ParseModel();
		}

		//expose underlying parse obejct through data property
		Object.defineProperty(this, 'data', { get : function(){ return parseObject; } });

		//add dynamic properties from fields array
		var self = this;
		for(var i=0; i<fields.length; i++)
		{
			//add closure
			(function() {
				var propName = fields[i];
				Object.defineProperty(self, propName, {
														get : function(){ return parseObject.get(propName); },
													   	set : function(value){ parseObject.set(propName, value); }
													});
			})();
		}

  		//instance methods
  		this.save = function(){
  			return ParseQuery(parseObject, {functionToCall:'save', params:[null]})
  		}
  		this.delete = function(){
  			return ParseQuery(parseObject, {functionToCall:'destroy'});
  		}
  		this.fetch = function(){
  			return ParseQuery(parseObject, {functionToCall:'fetch'});
  		}
  	};

}])


;