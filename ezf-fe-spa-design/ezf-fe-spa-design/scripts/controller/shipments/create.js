define(['app', 'model/shipments/details', 'utility/messages'], function (app, model, messages) {
    app.controller('CreateShipments', ['$scope', '$bus', '$location', 'ngProgress', '$constants', 'toaster', '$rootScope', '$timeout',
        function ($scope, $bus, $location, ngProgress, $constants, toaster, $rootScope, $timeout) {

            //ngProgress.start();
            $scope.model = new model();

            $scope.validationMessages = $constants.validationMessages;

            $scope.constants = $constants;

            $scope.labelList = $constants.labelList;

            $scope.whoLabelsCtrl = $constants.labelList[0];

            $scope.categoryOptions = $constants.categoryOptions;

            $scope.getCategory = function (cat) {
                return _.findWhere($scope.categoryOptions, {
                    'value': cat
                }) ? _.findWhere($scope.categoryOptions, {
                    'value': cat
                }).name : $constants.notAvailable
            }

            $scope.addProduct = function (product) {
                if ($scope.model.products.length > 0 && _.findIndex($scope.model.products, {
                    sku: product.fbspSkuId
                }) != -1) {
                    $("#shipment-create-product-quantity-" + _.findIndex($scope.model.products, {
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
                        product.category = null;
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
                $('html').not("#suggestion-holder, .selectboxhldr span, .suggestion-box a, #shipment-create-search-product").click(function () {
                    $scope.suggestions.length = 0;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }

            $scope.shipmentCreated = false;

            $scope.$on('$locationChangeStart', function (event, next, current) {
                if (!$scope.shipmentCreated) {
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

            $scope.createShipment = function () {
                if ($scope.model.products.length) {
                    $scope.cleanData();
                    $bus.fetch({
                        name: 'createshipments',
                        api: 'createshipments',
                        params: null,
                        data: JSON.stringify($scope.model)
                    })
                        .done(function (success) {
                            if (success.response.success.length) {
                                var inboundCode = success.response.data.shipment.header.inboundCode;
                                $scope.shipmentCreated = true;
                                toaster.pop("success", messages.shipmentCreateSuccess);
                                $location.path('shipments/send/' + inboundCode);
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    toaster.pop("error", errors.join(', '), '', 0);
                                } else {
                                    toaster.pop("error", messages.shipmentCreateError, "", 0);
                                }
                            }
                        }).fail(function (error) {
                            toaster.pop("error", messages.shipmentCreateError);
                        });
                } else {
                    $('#modal-shipment-create').modal();
                }
            }

            $scope.init = function () {
                $rootScope.getShipmentsCount();
                $rootScope.getCountryList();
                ngProgress.complete();
                $scope.attachEventsForTypeAhead();
            };
    }]);
});