define(['app', 'model/shipments/details', 'utility/messages'], function (app, model, messages) {
    app.controller('EditShipments', ['$scope', '$bus', '$location', 'ngProgress', 'toaster', '$rootScope', '$routeParams', '$constants', '$timeout',
        function ($scope, $bus, $location, ngProgress, toaster, $rootScope, $routeParams, $constants, $timeout) {

            $scope.model = new model();

            $scope.shipmentEdited = false;

            $scope.constants = $constants;

            $scope.validationMessages = $constants.validationMessages;

            $scope.labelList = $constants.labelList;

            $scope.categoryOptions = $constants.categoryOptions;

            $scope.getCategory = function (cat) {
                return _.findWhere($scope.categoryOptions, {
                    'value': cat
                }) ? _.findWhere($scope.categoryOptions, {
                    'value': cat
                }).name : $constants.notAvailable
            };

            $scope.addProduct = function (product) {
                if ($scope.model.products.length > 0 && _.findIndex($scope.model.products, {
                    sku: product.fbspSkuId
                }) != -1) {
                    $("#shipment-edit-product-quantity-" + _.findIndex($scope.model.products, {
                        sku: product.fbspSkuId
                    })).focus();
                } else {
                    if (product.isActive == 'true' || product.isActive == '1') {
                        var _product = new $scope.model._products();
                        _product.sku = product.fbspSkuId;
                        _product.productDesc = product.productName;
                        _product.quantity = 1;
                        _product.labelQuantity = 1;
                        $scope.getProductInventory(_product).done(function (product) {
                            $scope.model.products.push(product);
                            $scope.searchKey = '';
                            $scope.suggestions = [];
                        }).fail(function (product) {
                            $scope.model.products.push(product);
                            $scope.searchKey = '';
                            $scope.suggestions = [];
                        });
                    } else {
                        toaster.pop("error", messages.addActiveProducts);
                    }
                }
            }

            $scope.updateLabelQuantity = function (product) {
                product.labelQuantity = product.quantity;
            }

            $scope.getProductInventory = function (product) {
                var deferred = $.Deferred();
                var params = {
                    id: product.sku
                }
                $bus.fetch({
                    name: 'products',
                    api: 'products',
                    params: params,
                    data: null
                })
                    .done(function (success) {
                        var products = [];
                        var data = success.response.data;
                        if (!_.isArray(data.products)) {
                            _.forEach(data.products, function (product) {
                                products.push(product)
                            });
                        } else {
                            products = data.products;
                        }
                        product.fulFilQty = products[0].qtyFulfillable;
                        product.receivedQty = products[0].qtyInShipment;
                        product.quarantinedQty = products[0].qtyDamaged;
                        product.category = $scope.getCategory(products[0].mainProductCategory);
                        deferred.resolve(product);
                    }).fail(function (error) {
                        product.fulFilQty = 0;
                        product.receivedQty = 0;
                        product.quarantinedQty = 0;
                        deferred.reject(product);
                    });
                return deferred.promise();
            }

            $scope.removeProduct = function (product) {
                $scope.model.products = _.without($scope.model.products, product)
            }

            $scope.highlightSuggest = function (str, match) {
                var regex = new RegExp("(" + match + ")", 'gi');
                return str.replace(regex, '<strong>$1</strong>');
            }

            $scope.suggestions = [];

            $scope.findSuggestion = function (txt) {
                if (txt && txt.length > 2) {
                    $timeout(function () {
                        if (txt == $scope.searchKey) {
                            $bus.fetch({
                                name: 'suggestproducts',
                                api: 'suggestproducts',
                                params: {
                                    skey: txt,
                                    scol: 'all'
                                },
                                data: null
                            })
                                .done(function (success) {
                                    if (success.response && success.response.data && success.response.data.docs)
                                        $scope.suggestions = success.response.data.docs;
                                });
                        }
                    }, 500, false);
                } else {
                    $scope.suggestions.length = 0;
                }
            }

            $scope.attachEventsForTypeAhead = function () {
                $('html').not("#suggestion-holder, .selectboxhldr span, .suggestion-box a, #shipment-edit-search-product").click(function () {
                    $scope.suggestions.length = 0;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }

            $scope.$on('$locationChangeStart', function (event, next, current) {
                if (!$scope.shipmentEdited) {
                    var answer = confirm(messages.warnPageNavigation)
                    if (!answer) {
                        event.preventDefault();
                    }
                }
            });

            $scope.isLabelByMerchant = function (labelby, index) {
                if (labelby.value == "M" && !$scope.model.products[index].labelQuantity)
                    return false;
                else
                    return true;
            }

            $scope.checkActive = function (product) {
                if (product.isActive == 'true' || product.isActive == '1')
                    return false;
                return true;
            }

            $scope.cleanData = function () {
                $scope.model.header.addressCountry = $scope.countryOfOriginCtrl ? $scope.countryOfOriginCtrl.countryCode : '';
                $scope.model.header.labelBy = $scope.whoLabelsCtrl ? $scope.whoLabelsCtrl.value : '';
            }

            $scope.updateComboValue = function () {
                $scope.whoLabelsCtrl = _.findWhere($constants.labelList, {
                    "value": $scope.model.header.labelBy
                }) || '';
                $rootScope.getCountryList().done(function () {
                    $scope.countryOfOriginCtrl = _.findWhere($rootScope.countryList, {
                        "countryCode": $scope.model.header.addressCountry
                    }) || '';
                });
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
                            $scope.model.header.addressPostalCode = $scope.model.header.addressPostalCode;
                            $scope.model.header.phone = $scope.model.header.phone;
                            $scope.updateComboValue();
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

            $scope.editShipment = function () {
                if ($scope.model.products.length) {
                    $scope.cleanData();
                    $bus.fetch({
                        name: 'editshipments',
                        api: 'editshipments',
                        params: null,
                        data: JSON.stringify($scope.model)
                    })
                        .done(function (success) {
                            if (success.response.success.length) {
                                $scope.shipmentEdited = true;
                                toaster.pop("success", messages.shipmentUpdateSucess);
                                $location.path('shipments/send/' + success.response.data.shipment.header.inboundCode);
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
                } else {
                    $('#modal-shipment-edit').modal();
                }
            }

            $scope.init = function () {
                $rootScope.getShipmentsCount();
                $scope.getShipmentDetails();
                $rootScope.getCountryList();
                ngProgress.complete();
                $scope.attachEventsForTypeAhead();
            };

    }]);
});