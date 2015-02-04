define(['app', 'model/orders/details', 'utility/messages'], function (app, model, messages) {
    app.controller('ViewOrders', ['$scope', '$bus', 'ngProgress', '$constants', '$routeParams', 'toaster', '$rootScope',
        function ($scope, $bus, ngProgress, $constants, $routeParams, toaster, $rootScope) {

            $scope.constants = $constants;

            $scope.getDisplayName = function (code, list) {
                return _.findWhere($constants[list], {
                    "value": code
                }) ? _.findWhere($constants[list], {
                    "value": code
                }).name : $constants.notAvailable;
            }
            $scope.displayCountryName = "";
            $scope.getCountryName = function (code) {
                $rootScope.getCountryList().done(function () {
                    $scope.displayCountryName = _.findWhere($rootScope.countryList, {
                        "countryCode": code
                    }) ? _.findWhere($rootScope.countryList, {
                        "countryCode": code
                    }).countryName : $constants.notAvailable;
                });
            }

            $scope.cancel = function () {
                var answer = confirm(messages.orderCancelConfirm)
                if (answer) {
                    var request = {
                        inboundCode: $scope.model.header.inboundCode,
                        isCancel: 1
                    }
                    $bus.fetch({
                        name: 'editorders',
                        api: 'editorders',
                        params: null,
                        data: JSON.stringify(request)
                    })
                        .done(function (success) {
                            if (success.response.success.length && success.response.data && success.response.data.order) {
                                $scope.model.header.cancelledDate = success.response.data.order.header.cancelledDate;
                                toaster.pop("success", messages.orderCancelSuccess);
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    toaster.pop("error", errors.join(', '), '', 0);
                                } else {
                                    toaster.pop("error", messages.orderCancelError, "", 0);
                                }
                            }
                        }).fail(function (error) {
                            toaster.pop("error", messages.orderCancelError);
                        });
                }
            }

            $scope.restore = function () {
                var answer = confirm(messages.orderRestoreConfirm)
                if (answer) {
                    var request = {
                        inboundCode: $scope.model.header.inboundCode,
                        isRestore: 1
                    }
                    $bus.fetch({
                        name: 'editorders',
                        api: 'editorders',
                        params: null,
                        data: JSON.stringify(request)
                    })
                        .done(function (success) {
                            if (success.response.success.length && success.response.data && success.response.data.order) {
                                $scope.model.header.cancelledDate = success.response.data.order.header.cancelledDate;
                                toaster.pop("success", messages.orderRestoreSuccess);
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    toaster.pop("error", errors.join(', '), '', 0);
                                } else {
                                    toaster.pop("error", messages.orderRestoreError, "", 0);
                                }
                            }
                        }).fail(function (error) {
                            toaster.pop("error", messages.orderRestoreError);
                        });
                }
            }

            $scope.init = function () {
                $rootScope.getOrdersCount();
                var params = {
                    id: $routeParams.sku || ''
                }
                $scope.isInternationalOrder = false;
                $bus.fetch({
                    name: 'orders',
                    api: 'orders',
                    resturl: true,
                    params: params,
                    data: null
                })
                    .done(function (success) {
                        var data = success.response.data;
                        if (data && data.order) {
                            $scope.model = new model(data.order[0]);
                            if ($scope.model.customer.shippingAddress.countryCode != $constants.currentLocation) {
                                $scope.isInternationalOrder = true;
                            }
                            $scope.model.customer.shippingAddress.countryCode = $scope.getCountryName($scope.model.customer.shippingAddress.countryCode);
                            toaster.pop("success", messages.orderDetail, messages.retrivedSuccess);
                        } else {
                            toaster.pop("error", messages.orderFetchError);
                        }
                        ngProgress.complete();
                    }).fail(function (error) {
                        $scope.model = new model();
                        toaster.pop("error", messages.orderFetchError);
                        ngProgress.complete();
                    });
            };
    }]);
});