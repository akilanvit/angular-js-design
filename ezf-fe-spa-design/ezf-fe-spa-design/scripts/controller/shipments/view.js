define(['app', 'model/shipments/details', 'downloader', 'utility/restapi', 'utility/messages'], function (app, model, downloader, restapi, messages) {
    app.controller('ViewShipments', ['$scope', '$bus', 'ngProgress', '$constants', '$routeParams', 'toaster', '$rootScope',
        function ($scope, $bus, ngProgress, $constants, $routeParams, toaster, $rootScope) {

            $scope.constants = $constants;

            $scope.statusTxt = "";
            $scope.labelTxt = "";
            $scope.getStatus = function (id) {
                $scope.statusTxt = _.findWhere($constants.shipmentStatus, {
                    "value": id.toString()
                }) ? _.findWhere($constants.shipmentStatus, {
                    "value": id.toString()
                }).display : $constants.notAvailable;
            }

            $scope.getLabel = function (code) {
                $scope.labelTxt = _.findWhere($constants.labelList, {
                    "value": code
                }) ? _.findWhere($constants.labelList, {
                    "value": code
                }).name : $constants.notAvailable;
            }

            $scope.cancel = function () {
                var answer = confirm(messages.shipmentCancelConfirm)
                if (answer) {
                    var request = {
                        inboundCode: $scope.model.header.inboundCode,
                        isCancel: 1
                    }
                    $bus.fetch({
                        name: 'editshipments',
                        api: 'editshipments',
                        params: null,
                        data: JSON.stringify(request)
                    })
                        .done(function (success) {
                            if (success.response.success.length && success.response.data && success.response.data.shipment) {
                                $scope.model.header.cancelledDate = success.response.data.shipment.header.cancelledDate;
                                toaster.pop("success", messages.shipmentCancelSuccess);
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    toaster.pop("error", errors.join(', '), '', 0);
                                } else {
                                    toaster.pop("error", messages.shipmentCancelError, "", 0);
                                }
                            }
                        }).fail(function (error) {
                            toaster.pop("error", messages.shipmentCancelError);
                        });
                }
            }

            $scope.restore = function () {
                var answer = confirm(messages.shipmentRestoreConfirm)
                if (answer) {
                    var request = {
                        inboundCode: $scope.model.header.inboundCode,
                        isRestore: 1
                    }
                    $bus.fetch({
                        name: 'editshipments',
                        api: 'editshipments',
                        params: null,
                        data: JSON.stringify(request)
                    })
                        .done(function (success) {
                            if (success.response.success.length && success.response.data && success.response.data.shipment) {
                                $scope.model.header.cancelledDate = success.response.data.shipment.header.cancelledDate;
                                toaster.pop("success", messages.shipmentRestoreSuccess);
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    toaster.pop("error", errors.join(', '), '', 0);
                                } else {
                                    toaster.pop("error", messages.shipmentRestoreError, "", 0);
                                }
                            }
                        }).fail(function (error) {
                            toaster.pop("error", messages.shipmentRestoreError);
                        });
                }
            }

            $scope.getFileUrl = function (type, label) {
                if (type) {
                    var url = $constants.baseUrl + restapi[label].url + '?inboundCode=' + $scope.model.header.inboundCode + '&standardCode=' + type.value;
                    $.fileDownload(url, {
                        successCallback: function (url) {
                            toaster.pop("success", messages.labelDownloadSuccess);
                        },
                        failCallback: function (error, url) {
                            var err = JSON.parse($(error).text());
                            if (err && err.errors) {
                                var errors = [];
                                _.forEach(err.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    toaster.pop("error", errors.join(', '), '', 0);
                                } else {
                                    toaster.pop("error", messages.labelDownloadError);
                                }
                            } else {
                                toaster.pop("error", messages.labelDownloadError);
                            }
                        }
                    });
                } else {
                    toaster.pop("error", messages.labelInvalid);
                }
            }

            $scope.init = function () {
                $rootScope.getShipmentsCount();
                $scope.productLabelList = $scope.constants.productLabelList[0];
                $scope.boxLabelList = $scope.constants.boxLabelList[0];
                var params = {
                    id: $routeParams.sku || ''
                }
                $bus.fetch({
                    name: 'shipments',
                    api: 'shipments',
                    params: params,
                    data: null
                })
                    .done(function (success) {
                        var data = success.response.data;
                        if (data && data.shipment) {
                            $scope.model = new model(data.shipment);
                            toaster.pop("success", messages.shipmentDetail, messages.retrivedSuccess);
                            $scope.getStatus($scope.model.header.status);
                            $scope.getLabel($scope.model.header.labelBy);
                        } else {
                            toaster.pop("error", messages.shipmentFetchError);
                        }
                        ngProgress.complete();
                    }).fail(function (error) {
                        $scope.model = new model();
                        toaster.pop("error", messages.shipmentFetchError);
                        ngProgress.complete();
                    });
            };
    }]);
});