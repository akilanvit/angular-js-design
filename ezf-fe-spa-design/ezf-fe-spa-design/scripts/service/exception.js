define(['angularAMD'], function (angularAMD) {
		angularAMD.service('$exceptionManager', ['$location', '$rootScope', function($location, $rootScope) {
	    	this.init = function(status) {
		    	var deferred = $.Deferred();
                $rootScope.unAuthorized = false;
                $rootScope.noPage = false;
		    	switch(status){
		    		case 401:
		    			deferred.reject({response:'fail'});
                        $rootScope.isLoggedIn = false;
                        $location.path("login");
		    			break;
		    		case 403:
		    			deferred.reject({response:'fail'});
                        $rootScope.unAuthorized = true;
		    			$location.path("403");
		    			break;
                    case 404:
		    			deferred.reject({response:'fail'});
                        $rootScope.noPage = true;
		    			$location.path("404");
		    			break;
                    case 200:
                    case 201:
		    			deferred.resolve({response:'success'});
                        $rootScope.isLoggedIn = true;
		    			break;
                    case 400:
                    case 500:
		    		default:
		    			deferred.reject({response:'fail'});
                        break;
		    	}
				return deferred.promise();
			}
		}]);
});