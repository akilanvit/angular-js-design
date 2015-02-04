define(['app', 'model/shipments/details', 'downloader', 'utility/restapi', 'utility/messages'], function (app, model, downloader, restapi, messages) {
    app.controller('SendShipments', ['$scope', '$bus', '$location', 'ngProgress', '$constants', 'toaster', '$rootScope', '$routeParams', '$timeout',
        function ($scope, $bus, $location, ngProgress, $constants, toaster, $rootScope, $routeParams, $timeout) {

            //ngProgress.start();
            $scope.model = new model();

            $scope.constants = $constants;

            $scope.validationMessages = $constants.validationMessages;

            $scope.labelList = $constants.labelList;

            $scope.shipmentCreated = false;

            $scope.$on('$locationChangeStart', function (event, next, current) {
                if (!$scope.shipmentCreated) {
                    var answer = confirm(messages.warnPageNavigation)
                    if (!answer) {
                        event.preventDefault();
                    }
                }
            });

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
                                $scope.model.header.cancelledDate = success.response.data.shipment[0].cancelledDate;
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
                var answer = confirm(shipmentRestoreConfirm)
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
                                $scope.model.header.cancelledDate = success.response.data.shipment[0].cancelledDate;
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

            $scope.getShipmentDetails = function () {
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
                            if ($scope.model.header.status != 1) {
                                $scope.shipmentCreated = true;
                                $location.path('shipments/view/' + params.id);
                            }
                            toaster.pop("success", messages.shipmentDetail, messages.retrivedSuccess);
                        } else {
                            toaster.pop("error", messages.shipmentFetchError);
                        }
                        ngProgress.complete();
                    }).fail(function (error) {
                        $scope.model = new model();
                        toaster.pop("error", messages.shipmentFetchError);
                        ngProgress.complete();
                    });
            }

            $scope.convertDateFormat = function (date, format) {
                var dates = date.split("/");
                var dd, mm, yyyy;
                dd   = dates[0];
                mm   = dates[1];
                yyyy = dates[2];
                if      (format == "mm/dd/yyyy")    return mm + '/' + dd + '/' + yyyy;
                else if (format == "dd/mm/yyyy")    return dd + '/' + mm + '/' + yyyy;
            };
            $scope.formatDate = function (nowTemp) {
                var dd = nowTemp.getDate();
                var mm = nowTemp.getMonth() + 1; //January is 0!
                var yyyy = nowTemp.getFullYear();

                if (dd < 10) {
                    dd = '0' + dd
                }

                if (mm < 10) {
                    mm = '0' + mm
                }

                return dd + '/' + mm + '/' + yyyy;
            }

            $scope.validateShipDate = function (shipDate) {
                $scope.shipDt_isInvalid 	 = false;
                $scope.shipDt_errorMessage = "";

                if (!shipDate){
                    $scope.shipDt_isInvalid 	 = false;
                    $scope.shipDt_errorMessage = "";
                    return;
                }

                var validDate       = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/; // 31/12/2XXX
                var validDateFormat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/; // dd/mm/yyyy

                if (!shipDate.match(validDateFormat)) {
                    $scope.shipDt_isInvalid 	 = true;
                    $scope.shipDt_errorMessage = "Invalid Date Format";
                    return;
                }

                if (!shipDate.match(validDate) || new Date($scope.convertDateFormat(shipDate, "mm/dd/yyyy")) == "Invalid Date") {
                    $scope.shipDt_isInvalid 	 = true;
                    $scope.shipDt_errorMessage = "Invalid Date";
                }
            };

            $scope.validateArrivalDate = function (arrivalDate) {
                $scope.arrivalDt_isInvalid 	  = false;
                $scope.arrivalDt_errorMessage = "";

                if (!arrivalDate){
                    $scope.arrivalDt_isInvalid 	  = false;
                    $scope.arrivalDt_errorMessage = "";
                    return;
                }

                var validDate       = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/; // 31/12/2XXX
                var validDateFormat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/; // dd/mm/yyyy

                if (!arrivalDate.match(validDateFormat)) {
                    $scope.arrivalDt_isInvalid 	   = true;
                    $scope.arrivalDt_errorMessage = "Invalid Date Format";
                    return;
                }

                if (!arrivalDate.match(validDate) || new Date($scope.convertDateFormat(arrivalDate, "mm/dd/yyyy")) == "Invalid Date") {
                    $scope.arrivalDt_isInvalid 	  = true;
                    $scope.arrivalDt_errorMessage = "Invalid Date";
                    return
                }

                var today = new Date();
                var enteredDate =  new Date($scope.convertDateFormat(arrivalDate, "mm/dd/yyyy"));
                if (enteredDate < today) {
                    $scope.arrivalDt_isInvalid 	   = true;
                    $scope.arrivalDt_errorMessage = "Date should be greater than current date";
                }
            };

            $scope.dateinit = function () {
                $timeout(function () {
                    var nowTemp = new Date();
                    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

                    var today = new Date();
                    var binddate = $scope.formatDate(nowTemp);
                    $scope.model.header.estShipDate = binddate;
                    $scope.model.header.estArrivalDate = binddate;

                    var checkin = $('#shipment-send-estimated-date').datepicker()
                    .on('changeDate', function (ev) {
                        var newDate = new Date(ev.date)
                            //newDate.setDate(newDate.getDate() + 1);
                        checkout.setValue(newDate);
                        checkin.hide();
                        //$scope.model.header.estShipDate = $scope.formatDate(ev.date);
                        //$scope.model.header.estArrivalDate = $scope.formatDate(ev.date);
                        $scope.validateShipDate($scope.model.header.estShipDate);
                        //$('#shipment-send-estimated-arrival')[0].focus();
                    })
                    .data('datepicker');

                    var checkout = $('#shipment-send-estimated-arrival').datepicker({
                        startDate: new Date(),
                        onRender: function (date) {
                            return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
                        }
                    })
                    .on('changeDate', function (ev) {
                            checkout.hide();
                            //$scope.model.header.estArrivalDate = $scope.formatDate(ev.date);
                            $scope.validateArrivalDate($scope.model.header.estArrivalDate);
                        })
                    .data('datepicker');

                    checkin.setValue(binddate);
                    // newDate.setDate(newDate.getDate() + 1);
                    checkout.setValue(binddate);
                });
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

            $scope.sendShipment = function () {
                $bus.fetch({
                    name: 'editshipments',
                    api: 'editshipments',
                    params: null,
                    data: JSON.stringify($scope.model)
                })
                    .done(function (success) {
                        if (success.response.success.length) {
                            var inboundCode = success.response.data.shipment.header.inboundCode;
                            $scope.shipmentCreated = true;
                            toaster.pop("success", messages.shipmentUpdateSucess);
                            $location.path('shipments');
                        } else {
                            var errors = [];
                            _.forEach(success.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                toaster.pop("error", errors.join(', '), '', 0);
                            } else {
                                toaster.pop("error", messages.shipmentUpdateError, "", 0);
                            }
                        }
                    }).fail(function (error) {
                        toaster.pop("error", messages.shipmentUpdateError);
                    });
            }

            $scope.init = function () {
                $scope.dateinit();
                $rootScope.getShipmentsCount();
                $scope.productLabelList = $scope.constants.productLabelList[0];
                $scope.boxLabelList = $scope.constants.boxLabelList[0];
                $scope.getShipmentDetails();
                $rootScope.getCountryList();
                ngProgress.complete();
            };
    }]);
});