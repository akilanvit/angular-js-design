define(['app', 'utility/restapi', 'utility/messages'], function (app, restapi, messages) {
    app.controller('UploadOrders', ['$scope', '$bus', '$location', 'ngProgress', '$http', '$constants', 'toaster', 'fileUpload', '$rootScope',
        function ($scope, $bus, $location, ngProgress, $http, $constants, toaster, fileUpload, $rootScope) {

            $scope.orderTemplateXlsx = $constants.orderTemplateXlsx;

            $scope.orderTemplateCsv = $constants.orderTemplateCsv;

            $scope.fileStatus = $constants.fileStatus;

            $scope.fileValid = true;
            $scope.constants = $constants;

            $scope.validateFile = function (file_name) {
                var aValidExtensions = ["xls", "xlsx", "csv"];
                var aFileNameParts = file_name.split(".");
                if (aFileNameParts.length > 1) {
                    var sExtension = aFileNameParts[aFileNameParts.length - 1];
                    return ($.inArray(sExtension, aValidExtensions) >= 0) ? true : false;
                } else {
                    return false;
                }
            }

            $scope.$on('refreshUploadList', function () {
                $scope.getPagedDataAsync();
            });

            $scope.isUploadable = true;

            $scope.uploadOrders = function () {
                if ($scope.isUploadable || $constants.developerMode) {
                    if ($scope.myFile && $scope.validateFile($scope.myFile.name)) {
                        $rootScope.activateOverlay = true;
                        var file = $scope.myFile;
                        var uploadUrl = $constants.baseUrl + restapi.uploadorders.url;
                        fileUpload.uploadFileToUrl(file, uploadUrl)
                            .done(function (response, status) {
                                if (response.success.length) {
                                    toaster.pop("success", messages.uploadSuccess);
                                    $("#upload-order-file").val('');
                                    $scope.getPagedDataAsync();
                                } else {
                                    var errors = [];
                                    _.forEach(response.errors, function (error) {
                                        errors.push(error)
                                    });
                                    if (errors.length) {
                                        toaster.pop("error", errors.join(', '), '', 0);
                                    } else {
                                        toaster.pop("error", messages.orderUploadError, "", 0);
                                    }
                                }
                                $rootScope.activateOverlay = false;
                                ngProgress.complete();
                            }).fail(function (error) {
                                $rootScope.activateOverlay = false;
                                toaster.pop("error", messages.orderUploadError);
                                ngProgress.complete();
                            });
                    } else {
                        toaster.pop("error", messages.uploadInvalidFiles);
                    }
                } else {
                    toaster.pop("error", messages.uploadStopAnotherFile);
                }
            }

            $scope.init = function () {
                $rootScope.getOrdersCount();
                $scope.getPagedDataAsync = function () {
                    ngProgress.start();
                    var params = {
                        p: 1,
                        rcd: 20
                    };
                    $bus.fetch({
                        name: 'importorders',
                        api: 'importorders',
                        params: params,
                        data: null
                    })
                        .done(function (success) {
                            var uploads = [];
                            var data = success.response.data;
                            if (data && data.dataUploadList) {

                                if (_.where(data.dataUploadList, {
                                    "duTxnFileStatus": 0
                                }).length) {
                                    $scope.isUploadable = false;
                                } else {
                                    $scope.isUploadable = true;
                                }

                                if (!_.isArray(data.dataUploadList)) {
                                    _.forEach(data.dataUploadList, function (upload) {
                                        uploads.push(upload)
                                    });
                                } else {
                                    uploads = data.dataUploadList;
                                }
                                $scope.myData = uploads;
                            }
                            ngProgress.complete();
                        }).fail(function (error) {
                            toaster.pop("error", messages.orderListFetchError);
                            ngProgress.complete();
                        });
                };

                $scope.getPagedDataAsync();

            };


            ngProgress.complete();
    }]);
});