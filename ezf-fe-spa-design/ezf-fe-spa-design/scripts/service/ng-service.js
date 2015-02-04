define(['angularAMD'], function (angularAMD) {
		angularAMD
        .service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl){
                var fd = new FormData();
                var deferred = $.Deferred();
                fd.append('uploadFile', file);
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function(data, status){
                    deferred.resolve(data, status);
                })
                .error(function(data, status){
                    deferred.reject(data, status);
                });
                return deferred.promise();
            }
        }]);
});