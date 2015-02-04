define(['app', 'model/products/details', 'utility/messages'], function (app, model, messages) {
    app.controller('EditProducts', ['$scope', '$bus', '$location', 'ngProgress', 'toaster', '$rootScope', '$routeParams', '$constants',
        function ($scope, $bus, $location, ngProgress, toaster, $rootScope, $routeParams, $constants) {

            $scope.model = new model();

            $scope.productEdited = false;

            $scope.constants = $constants;

            $scope.validationMessages = $constants.validationMessages;

            $scope.categoryOptions = $constants.categoryOptions;

            $scope.$on('$locationChangeStart', function (event, next, current) {
                if (!$scope.productEdited) {
                    var answer = confirm(messages.warnPageNavigation)
                    if (!answer) {
                        event.preventDefault();
                    }
                }
            });

            $scope.isHsCodeValid = function (text) {
                if (!text)
                    return true;
                var reg = new RegExp('^[0-9]{6,}$');
                if ($scope.model.isExportable && !reg.test(text))
                    return false;
                else
                    return true;
            }

            $scope.isCodeValid = function (text, value) {
                if (!text && value)
                    return false;
                else
                    return true;
            }

            $scope.isExportSelected = function (text) {
                if ($scope.model.isExportable && !text)
                    return false;
                else
                    return true;
            }

            $scope.cleanData = function () {
                $scope.model.mainProductCategory = $scope.mainProductCategoryCtrl ? $scope.mainProductCategoryCtrl.value : '';
                $scope.model.declaredValueCurrency = $scope.declaredValueCurrencyCtrl ? $scope.declaredValueCurrencyCtrl.currencyCode : '';
                $scope.model.retailPriceCurrency = $scope.retailPriceCurrencyCtrl ? $scope.retailPriceCurrencyCtrl.currencyCode : '';
                $scope.model.codeType = $scope.codeTypeCtrl ? $scope.codeTypeCtrl.value : '';
                $scope.model.costPriceCurrency = $scope.costPriceCurrencyCtrl ? $scope.costPriceCurrencyCtrl.currencyCode : '';
                $scope.model.countryOfOrigin = $scope.countryOfOriginCtrl ? $scope.countryOfOriginCtrl.countryCode : '';
            }

            $scope.updateComboValue = function () {
                $scope.mainProductCategoryCtrl = _.findWhere($scope.categoryOptions, {
                    "value": $scope.model.mainProductCategory
                }) || '';
                $rootScope.getCountryList().done(function () {
                    $scope.countryOfOriginCtrl = _.findWhere($rootScope.countryList, {
                        "countryCode": $scope.model.countryOfOriginCode
                    }) || '';
                });
                $rootScope.getCurrencyList().done(function () {
                    $scope.declaredValueCurrencyCtrl = _.findWhere($rootScope.currencyList, {
                        "currencyCode": $scope.model.declaredValueCurrencyCode
                    }) || '';
                    $scope.retailPriceCurrencyCtrl = _.findWhere($rootScope.currencyList, {
                        "currencyCode": $scope.model.retailPriceCurrencyCode
                    }) || '';
                    $scope.costPriceCurrencyCtrl = _.findWhere($rootScope.currencyList, {
                        "currencyCode": $scope.model.costPriceCurrencyCode
                    }) || '';
                });
            }

            $scope.getProductDetails = function () {
                var params = {
                    id: $routeParams.sku || ''
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
                        $scope.model = new model(products[0]);
                        if ($scope.model.isExportable) {
                            $scope.model.isExportable = true
                        } else {
                            $scope.model.isExportable = false
                        }
                        if ($scope.model.isActive) {
                            $scope.model.isActive = true
                        } else {
                            $scope.model.isActive = false
                        }
                        $scope.model.retailPrice = Number($scope.model.retailPrice) || null;
                        $scope.model.declaredValue = Number($scope.model.declaredValue) || null;
                        $scope.model.costPrice = Number($scope.model.costPrice) || null;
                        $scope.updateComboValue();
                        toaster.pop("success", messages.productDetail, messages.retrivedSuccess);
                        ngProgress.complete();
                    }).fail(function (error) {
                        $scope.model = new model();
                        toaster.pop("error", messages.productFetchError);
                        ngProgress.complete();
                    });
            }

            $scope.editProduct = function () {
                $scope.cleanData();
                $bus.fetch({
                    name: 'editproducts',
                    api: 'editproducts',
                    params: null,
                    data: JSON.stringify($scope.model)
                })
                    .done(function (success) {
                        if (success.response.success.length) {
                            $scope.productEdited = true;
                            toaster.pop("success", messages.productUpdateSucess);
                            $location.path('products');
                        } else {
                            var errors = [];
                            _.forEach(success.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                toaster.pop("error", errors.join(', '), '', 0);
                            } else {
                                toaster.pop("error", messages.productUpdateError, "", 0);
                            }
                        }
                    }).fail(function (error) {
                        toaster.pop("error", messages.productUpdateError);
                    });
            }

            $scope.archive = function (val) {
                var answer = confirm(messages.productArchiveConfirm)
                if (answer) {
                    var request = {
                        fbspSkuId: $scope.model.fbspSkuId,
                        archived: val
                    }
                    $bus.fetch({
                        name: 'editproducts',
                        api: 'editproducts',
                        params: null,
                        data: JSON.stringify(request)
                    })
                        .done(function (success) {
                            if (success.response.success.length) {
                                var products = [];
                                var data = success.response.data;
                                if (!_.isArray(data.products)) {
                                    _.forEach(data.products, function (product) {
                                        products.push(product)
                                    });
                                } else {
                                    products = data.products;
                                }
                                $scope.model.dateArchived = products[0].dateArchived;
                                toaster.pop("success", messages.productArchiveSuccess);
								$scope.productEdited = true;
								$location.path('products');
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    toaster.pop("error", errors.join(', '), '', 0);
                                } else {
                                    toaster.pop("error", messages.productArchiveError, "", 0);
                                }
                            }
                        }).fail(function (error) {
                            toaster.pop("error", messages.productArchiveError);
                        });
                }
            }

            $scope.init = function () {
                $rootScope.getProductsCount();
                $scope.getProductDetails();
                $rootScope.getCountryList();
                $rootScope.getCurrencyList();
                ngProgress.complete();
            };

    }]);
});