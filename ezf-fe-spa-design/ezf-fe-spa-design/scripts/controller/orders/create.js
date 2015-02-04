define(['app', 'model/orders/details', 'utility/messages'], function (app, model, messages) {
    app.controller('CreateOrders', ['$scope', '$bus', '$location', 'ngProgress', '$constants', 'toaster', '$rootScope', '$timeout', '$window',
        function ($scope, $bus, $location, ngProgress, $constants, toaster, $rootScope, $timeout, $window) {

            //ngProgress.start();
            $scope.model = new model();

            $scope.validationMessages = $constants.validationMessages;

            $scope.constants = $constants;

            $scope.currentLocation = $constants.currentLocation;

            $scope.isReviewOrder = false;

            $scope.isInternationalOrder = false;

            $scope.isApprove = false;

            $scope.shippingOptions = [];

            $scope.addProduct = function (product) {
                if ($scope.model.lineItems.length > 0 && _.findIndex($scope.model.lineItems, {
                    ezcSku: product.fbspSkuId
                }) != -1) {
                    $("#order-create-product-quantity-" + _.findIndex($scope.model.lineItems, {
                        ezcSku: product.fbspSkuId
                    })).focus();
                } else {
                    if (product.isActive == 'true' || product.isActive == '1') {
                        var _product = new $scope.model.LineItems();
                        _product.fbsp_sku = product.fbspSkuId;
                        _product.description = product.productName;
                        $scope.getProductInventory(_product).done(function (product) {
                            $scope.model.lineItems.push(product);
                            $scope.searchKey = '';
                            $scope.suggestions = [];
                        }).fail(function (product) {
                            toaster.pop("error", messages.addProductError);
                        });
                    } else {
                        toaster.pop("error", messages.addActiveProducts);
                    }
                }
            }

            $scope.incrementAddInfo = function () {
                $scope.addInfo++;
            }

            $scope.checkInternationalOrder = function (text) {
                if ($scope.isInternationalOrder && !text)
                    return false;
                else
                    return true;
            }

            $scope.checkInternationalOrderCustomDesc = function (index) {
                if ($scope.isInternationalOrder && $scope.model.lineItems.length >= 0 && !$scope.model.lineItems[index].customs.customsDescription)
                    return false;
                else
                    return true;
            }

            $scope.checkInternationalOrderCustomHsCode = function (index) {
                if ($scope.isInternationalOrder && !$scope.model.lineItems[index].customs.hsCode)
                    return false;
                else
                    return true;
            }

            $scope.checkInternationalOrderDValue = function (index) {
                if (($scope.isInternationalOrder && _.isNaN(Number($scope.model.lineItems[index].customs.itemDeclaredValue))) || ($scope.isInternationalOrder && !$scope.model.lineItems[index].customs.itemDeclaredValue))
                    return false;
                else
                    return true;
            }

            $scope.checkInternationalOrderOCountry = function (index) {
                if ($scope.isInternationalOrder && !$scope.model.lineItems[index].countryOfOriginCtrl)
                    return false;
                else
                    return true;
            }

            $scope.checkOtherShipCategory = function (text, val) {
                if ($scope.isInternationalOrder && val == 'O' && !text)
                    return false;
                else
                    return true;
            }
            $scope.isValidDate = function () {
               /* $scope.isDateInvalid = false;
                var date = $scope.processOrderDate;

                // regular expression to match required date format
                var dateFormat = "(0?[1-9]|[12][0-9]|3[01])/(0?[1-9]|1[012])/((19|20)\\d\\d)";

                //regex for mm/dd/yyyy
                var monthFirstFormat = "/^\d{2}\/\d{2}\/\d{4}$/";
                if (!date || !date.match(dateFormat)) return false;
                var today = $scope.formatDate(new Date());

                var todayDate, enteredDate, maxDate;
                todayDate   = new Date(today.replace(monthFirstFormat,'$2-$1-$3'));
                enteredDate = new Date(date.replace(monthFirstFormat,'$2-$1-$3'));
                maxDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 6, 0, 0, 0, 0);

                if ((todayDate <= enteredDate && enteredDate <= maxDate)) {
                    $scope.isDateInvalid = true;
                }
                return !$scope.isDateInvalid;*/
            }

            $scope.checkLiabilityValue = function (value, base) {
                if ((!value || value > base))
                    return false;
                else
                    return true;
            }

            $scope.updateDeliveryCharge = function () {
				if(!$scope.selectedShippingMethod.liabilityAvailable) {
                    $scope.model.shipping.liabilityTaken = false;
                }
				if ($scope.model.shipping.liabilityTaken)
                    $scope.model.shipping.estDeliveryCharge = Number($scope.selectedShippingMethod.cost) + Number($scope.model.shipping.liabilityValue);
                else
                    $scope.model.shipping.estDeliveryCharge = Number($scope.selectedShippingMethod.cost);
            }

            $scope.previous = function () {
                $scope.isReviewOrder = false;
            }

            $scope.getProductInventory = function (product) {
                var deferred = $.Deferred();
                var params = {
                    id: product.fbsp_sku
                }
                $bus.fetch({
                    name: 'products',
                    api: 'products',
                    params: params,
                    data: null
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
                            product.vendorId = products[0].vendorId;
                            product.warehouseId = products[0].vendorProductId;
                            product.merchantSku = products[0].sku;
                            product.isActive = products[0].isActive;
                            product.productWeight = products[0].weight;
                            product.quantity = 1;
                            product.isExportable = products[0].isExportable ? true : false;
                            product.weightUnit = products[0].weightUnit;
                            product.ezcSku = products[0].fbspSkuId;
                            product.productCode = products[0].articleCode;
                            product.productCodeType = products[0].codeType;
                            product.marketplaceId = products[0].productId;
                            product.description = products[0].productName;
                            product.retailPrice = products[0].retailPrice;
                            product.retailCurrencyCode = products[0].retailPriceCurrencyCode;
                            product.costPrice = products[0].costPrice;
                            product.costCurrencyCode = products[0].costPriceCurrencyCode;
                            product.customs.customsDescription = products[0].customsDescription;
                            product.customs.hsCode = products[0].hsCode;
                            product.customs.itemDeclaredValueClone = products[0].declaredValue;
                            product.customs.itemDeclaredValue = products[0].declaredValue;
                            product.customs.dvalueCurrencyCode = products[0].declaredValueCurrencyCode;
                            product.customs.originCountry = products[0].countryOfOriginCode;
                            product.qtyFulfillable = products[0].qtyFulfillable;
                            product.qtyDamaged = products[0].qtyDamaged;
                            product.qtyInShipment = products[0].qtyInShipment;
                            deferred.resolve(product);
                        } else {
                            var errors = [];
                            _.forEach(success.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                toaster.pop("error", errors.join(', '), '', 0);
                            } else {
                                toaster.pop("error", messages.productFetchError, "", 0);
                            }
                            deferred.reject(product);
                        }
                    }).fail(function (error) {
                        deferred.reject(product);
                    });
                return deferred.promise();
            }

            $scope.removeProduct = function (product) {
                $scope.model.lineItems = _.without($scope.model.lineItems, product)
            }

            $scope.highlightSuggest = function (str, match) {
                if (str && match) {
                    var regex = new RegExp("(" + match + ")", 'gi');
                    return str.replace(regex, '<strong>$1</strong>');
                }
                return str;
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
                $('html').not("#suggestion-holder, .selectboxhldr span, .suggestion-box a, #order-create-search-product").click(function () {
                    $scope.suggestions.length = 0;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }

            $scope.orderCreated = false;

            $scope.$on('$locationChangeStart', function (event, next, current) {

                if (!$scope.orderCreated) {
                    
				var answer = confirm(messages.warnPageNavigation)
                if (!answer) {
                    event.preventDefault();
                }
                
                   /* $('#modal-order-leave').modal();
                    event.preventDefault();*/
                }

            });

            $scope.checkActive = function (product) {
                if (product.isActive == 'true' || product.isActive == '1')
                    return false;
                return true;
            }

            $scope.cleanData = function () {
                if ($scope.isApprove) {
                    $scope.model.isApproved = true;
                } else {
                    $scope.model.isApproved = false;
                }
                delete $scope.model.orderHeaderId;
                delete $scope.model.ezcOrderNumber;
                delete $scope.model.orderStatus;
                $scope.model.lineItems = _.reject($scope.model.lineItems, {
                    'selected': false
                });
                $scope.model.shipping.carrier = $scope.selectedShippingMethod.carrier;
                $scope.model.shipping.methodCode = $scope.selectedShippingMethod.value;
                $scope.model.shipping.methodName = $scope.selectedShippingMethod.name;
                $scope.model.shipping.leadTime = $scope.selectedShippingMethod.leadTime;
				$scope.model.shipping.fulfillRate = $scope.selectedShippingMethod.fulfillRate;
                $scope.model.shipping.liabilityValue = $scope.selectedShippingMethod.liabilityValue;
                if ($scope.isInternationalOrder) {
                    $scope.model.shipping.categoryOfGoods = $scope.orderShipCategory.value;
                    $scope.model.shipping.nonDeliveryInstr = $scope.orderDeliveryInstruction.value;
                    _($scope.model.lineItems).forEach(function (data) {
                        $rootScope.getCountryList().done(function () {
                            data.customs.originCountry = data.countryOfOriginCtrl ? $scope.countryOfOriginCtrl.countryCode : '';
                        });
                    });
                } else {
                    $scope.model.shipping.categoryOfGoods = "";
                    $scope.model.shipping.nonDeliveryInstr = "";
                    $scope.model.shipping.otherShipmentCategory = "";
                }



            }

            $scope.updateProductBasedCalc = function () {
                $scope.model.shipping.estShippingWeight = 0;
                $scope.model.shipping.orderDeclaredValue = 0;
                $scope.model.shipping.orderRetailValue = 0;
                _($scope.model.lineItems).forEach(function (data) {
                    if (data.selected) {
                        $scope.model.shipping.estShippingWeight += (Number(data.productWeight) * Number(data.quantity));
                        $scope.model.shipping.orderDeclaredValue += Number(data.customs.itemDeclaredValue);
                        $scope.model.shipping.orderRetailValue += (Number(data.retailPrice) * Number(data.quantity));
                    } else {
                        $scope.internationalProductSelectAll = false;
                    }
                });
                $scope.model.shipping.estEnhancedCost = $scope.model.shipping.orderDeclaredValue;
            }
            $scope.convertDateFormat = function (date, format) {
                var dates = date.split("/");
                if (dates.length != 3) return "Invalid Date";

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

            $scope.validateDate = function (inputDate) {

                $scope.DisplayableOrderDate_isInvalid 	 = false;
                $scope.DisplayableOrderDate_errorMessage = "";

                if (!inputDate){
                    $scope.DisplayableOrderDate_isInvalid 	 = false;
                    $scope.DisplayableOrderDate_errorMessage = "";
                    return;
                }

                var validDate       = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/; // 31/12/2XXX
                var validDateFormat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/; // dd/mm/yyyy

                if (!inputDate.match(validDateFormat)) {
                    $scope.DisplayableOrderDate_isInvalid 	 = true;
                    $scope.DisplayableOrderDate_errorMessage = "Invalid Date Format";
                    return;
                }

                if (!inputDate.match(validDate) || new Date($scope.convertDateFormat(inputDate, "mm/dd/yyyy")) == "Invalid Date") {
                    $scope.DisplayableOrderDate_isInvalid 	 = true;
                    $scope.DisplayableOrderDate_errorMessage = "Invalid Date";
                }
            };

            $scope.createProcessDateChanged = function () {
                $scope.processOrder_isDateInvalid = false;
                $scope.processOrder_errorMessage  = "";

                //selected Date
                var date = $scope.processOrderDate;

                //today's date
                var today = $scope.formatDate(new Date());
                var todayDate, enteredDate, maxDate;

                // regular expression to match required date format
                var validDate       = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/; // 31/12/2XXX
                var validDateFormat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/; // dd/mm/yyyy

                //No date selected
                if (!date) return;

                todayDate   = new Date($scope.convertDateFormat(today, "mm/dd/yyyy"));

                //Date Entered is invalid
                if (!date.match(validDateFormat)) {
                    $scope.processOrder_isDateInvalid 	= true;
                    $scope.processOrder_errorMessage 	= "Invalid Date Format";
                    return;
                }

                //Date Entered is invalid
                if (!date.match(validDate) || new Date($scope.convertDateFormat(date, "mm/dd/yyyy")) == "Invalid Date") {
                    $scope.processOrder_isDateInvalid 	= true;
                    $scope.processOrder_errorMessage 	= "Invalid Date";
                    return;
                }

                else enteredDate = new Date($scope.convertDateFormat(date, "mm/dd/yyyy"));
                maxDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 6, 0, 0, 0, 0);

                if (!(todayDate <= enteredDate && enteredDate <= maxDate)) {
                    $scope.processOrder_isDateInvalid = true;
                    $scope.processOrder_errorMessage 	= "Date selected is out of range";
                    return;
                }
            };

            $scope.dateinit = function () {
                $timeout(function () {
                    var nowTemp = new Date();
                    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

                    var today = new Date();
                    var processDate = new Date();
                    var checkin = $('#order-create-displayable-date').datepicker()
                    .on('changeDate', function (ev) {
                        var newDate = new Date(ev.date)
                        //checkout.setValue(newDate);
                        checkin.hide();
                        $scope.displayableDate = $scope.formatDate(ev.date);
                        $scope.validateDate($scope.displayableDate);
                    }).data('datepicker');
                    var todayDate = new Date();
                    var checkout = $('#order-create-process-date').datepicker({

                        startDate: new Date(),
                        endDate: new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 6, 0, 0, 0, 0),
                        format: "dd/mm/yyyy",
                        onRender: function (date) {
                            var checkinSelect = new Date(checkin.date);
                            var processDate = new Date(checkinSelect.getFullYear(), checkinSelect.getMonth(), checkinSelect.getDate() + 6, 0, 0, 0, 0);
                            return ((date.valueOf() <= checkin.date.valueOf()) || (date.valueOf() > processDate.valueOf())) ? 'disabled' : '';
                        }
                    }).on('changeDate', function (ev) {
                        /*checkout.hide();
                        $scope.processOrderDate = $scope.formatDate(ev.date);*/
                        $scope.createProcessDateChanged();

                    }).data('datepicker');

                });

                /*
			$(function(){

				$('#modal-order-leave').on('show.bs.modal', function(e) {
					console.log(e);
					$(this).find('.danger').attr('href', $(e.relatedTarget).data('href'));
				});

			});
			*/
            }

            $scope.cleanDataPre = function () {
                $scope.internationalProductSelectAll = true;
                $scope.model.customer.shippingAddress.countryCode = $scope.countryOfOriginCtrl ? $scope.countryOfOriginCtrl.countryCode : '';
                $scope.model.customer.shippingAddress.firstname = $scope.model.customer.customerFirstname;
                $scope.model.customer.shippingAddress.lastname = $scope.model.customer.customerLastname;
                if (!$scope.model.displayableOrderId)
                    $scope.model.displayableOrderId = $scope.model.merchantOrderId;
                if (!$scope.model.displayableDate)
                    $scope.model.displayableDate = $scope.formatDate(new Date());;
                _($scope.model.lineItems).forEach(function (data) {
                    data.selected = true;
                    data.customs.itemDeclaredValue = Number(data.customs.itemDeclaredValueClone) * Number(data.quantity)
					data.itemDeclaredValue = data.customs.itemDeclaredValue;
                    $rootScope.getCountryList().done(function () {
                        data.countryOfOriginCtrl = _.findWhere($rootScope.countryList, {
                            "countryCode": data.customs.originCountry
                        }) || '';
                    });
                });
                
            }

            $scope.updateShippingMethod = function (method) {
                _.each($scope.shippingOptions, function (option) {
                    option.ticked = false;
                });
                method.ticked = true;
                $scope.selectedShippingMethod = method;
				$scope.model.shipping.liabilityValue = method.liabilityValue;
                $scope.updateDeliveryCharge();
            }

            $scope.updateDeclaredValue = function () {
                $scope.model.shipping.orderDeclaredValue = 0;
                _($scope.model.lineItems).forEach(function (data) {
                    if (data.selected)
                        $scope.model.shipping.orderDeclaredValue += Number(data.customs.itemDeclaredValue);
                });
                $scope.model.shipping.estEnhancedCost = Number($scope.model.shipping.orderDeclaredValue);
            }

            $scope.draftOrder = function () {
                if ($scope.model.lineItems.length) {
                    if (_.where($scope.model.lineItems, {
                        "isExportable": false
                    }).length && $scope.countryOfOriginCtrl.countryCode != $scope.currentLocation) {
                        $('#modal-order-create-expo-error').modal();
                    } else {
                        ngProgress.start();
                        var param = {
                            searchCol: 'merchOrderId',
                            searchTerm: $scope.model.merchantOrderId
                        }
                        $bus.fetch({
                            name: 'orderexists',
                            api: 'orderexists',
                            params: param,
                            data: null
                        })
                            .done(function (success) {
                                if (!success.response.data) {
                                    $scope.cleanDataPre();
                                    var data = {
                                        quoteRequest : {
                                            shippingAddress : $scope.model.customer.shippingAddress,
                                            lineItems : $scope.model.lineItems
                                        }
                                    }

                                    $bus.fetch({
                                        name: 'ordercarriers',
                                        api: 'ordercarriers',
                                        params: null,
                                        data: JSON.stringify({
                                            quoteRequest: JSON.stringify(data)
                                        })
                                    })
                                    .done(function (success) {
                                        if (success.response.success.length) {
                                            $scope.shippingOptions = [];
                                            _.forEach(success.response.data, function (item) {
                                                var carrier = {};
                                                carrier.name = item.service;
                                                carrier.value="IWPPSD";
                                                carrier.ticked=false;
                                                carrier.valid = item.valid ? true : false;
                                                carrier.liabilityAvailable = item.quote.liability.available ? true : false;
                                                carrier.error = item.quote.error;
                                                carrier.carrier = item.carrier;
                                                carrier.deliveryRate = item.quote.deliveryRate;
                                                carrier.fulfillRate = item.quote.fulfillRate;
                                                carrier.cost = Number(carrier.deliveryRate) + Number(carrier.fulfillRate);
                                                carrier.liabilityValue = item.quote.liabilityRate;
                                                carrier.leadFromDays = item.quote.transitTime ? item.quote.transitTime.from : $constants.notAvailableText;
                                                carrier.leadToDays = item.quote.transitTime ? item.quote.transitTime.to : $constants.notAvailableText;
                                                carrier.leadTime = item.quote.transitTime ? (item.quote.transitTime.from + '-' + item.quote.transitTime.to + ' Days') : $constants.notAvailableText;
                                                carrier.currency = "$";
                                                $scope.shippingOptions.push(carrier);
                                            });
                                            if ($scope.model.shipping.methodName) {
                                                $scope.selectedShippingMethod = _.findWhere($scope.shippingOptions, {
                                                    "name": $scope.model.shipping.methodName
                                                }) || $scope.shippingOptions[0];
                                            } else {
                                                $scope.selectedShippingMethod = $scope.shippingOptions[0];
                                            }
                                            $scope.selectedShippingMethod.ticked=true;
                                            $scope.model.shipping.liabilityValue = $scope.selectedShippingMethod.liabilityValue;
                                            if ($scope.model.customer.shippingAddress.countryCode == $scope.currentLocation) {
                                                $scope.model.shipping.deliveryType = "DOMESTIC";
                                                $scope.isInternationalOrder = false;
                                            } else {
                                                $scope.orderShipCategory = _.findWhere($constants.orderShipCategory, {
                                                    "value": $scope.model.shipping.categoryOfGoods
                                                }) || null;
                                                $scope.orderDeliveryInstruction = _.findWhere($constants.orderDeliveryInstruction, {
                                                    "value": $scope.model.shipping.nonDeliveryInstr
                                                }) || null;
                                                $scope.model.shipping.deliveryType = "INTERNATIONAL";
                                                $scope.isInternationalOrder = true;
                                            }

                                            $scope.model.shipping.carrier = $scope.selectedShippingMethod.carrier;
                                            $scope.model.shipping.methodCode = $scope.selectedShippingMethod.value;
                                            $scope.model.shipping.methodName = $scope.selectedShippingMethod.name;
                                            $scope.model.shipping.leadTime = $scope.selectedShippingMethod.leadTime;
                                            $scope.model.shipping.fulfillRate = $scope.selectedShippingMethod.fulfillRate;
                                            $scope.model.shipping.liabilityValue = $scope.selectedShippingMethod.liabilityValue;
                                            $scope.updateProductBasedCalc();
                                            $scope.updateDeliveryCharge();
                                            $scope.isReviewOrder = true;
                                            $window.scrollTo(0, 0);
                                        } else {
                                            var errors = [];
                                            _.forEach(success.response.errors, function (error) {
                                                errors.push(error)
                                            });
                                            if (errors.length) {
                                                toaster.pop("error", errors.join(', '), '', 0);
                                            } else {
                                                toaster.pop("error", messages.orderCarrierServiceError, "", 0);
                                            }
                                        }
                                        ngProgress.complete();
                                    }).fail(function (error) {
                                        var errors = [];
                                        _.forEach(error.response.errors, function (error) {
                                            errors.push(error)
                                        });
                                        if (errors.length) {
                                            toaster.pop("error", errors.join(', '), '', 0);
                                        } else {
                                            toaster.pop("error", messages.orderCarrierServiceError, "", 0);
                                        }
                                        ngProgress.complete();
                                    });
                                } else {
                                    toaster.pop("error", messages.orderMerchantIdNotAvailable, "", 0);
                                }
                                ngProgress.complete();
                            }).fail(function (error) {
                                var errors = [];
                                _.forEach(error.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    toaster.pop("error", errors.join(', '), '', 0);
                                } else {
                                    toaster.pop("error", messages.orderMerchantIdServiceError, "", 0);
                                }
                                ngProgress.complete();
                            });
                    }
                } else {
                    $('#modal-order-create').modal();
                }
            }

            $scope.checkUncheckAll = function (value) {
                _.each($scope.model.lineItems, function (item) {
                    if (value) {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                });
                $scope.updateProductBasedCalc();
                $scope.updateDeclaredValue();
            }

            $scope.createOrder = function () {
                if ($scope.model.lineItems.length && _.reject($scope.model.lineItems, {
                    'selected': false
                }).length) {
                    ngProgress.start();
                    $scope.cleanData();
                    $bus.fetch({
                        name: 'createorders',
                        api: 'createorders',
                        params: null,
                        data: JSON.stringify({
                            order: JSON.stringify($scope.model)
                        })
                    })
                        .done(function (success) {
                            if (success.response.success.length) {
                                $scope.orderCreated = true;
                                toaster.pop("success", messages.orderCreateSuccess);
                                if ($scope.model.isApproved) {
                                    $location.path('orders/inprocess');
                                } else {
                                    $location.path('orders/unapproved');
                                }
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    toaster.pop("error", errors.join(', '), '', 0);
                                } else {
                                    toaster.pop("error", messages.orderCreateError, "", 0);
                                }
                            }
                            ngProgress.complete();
                        }).fail(function (error) {
                            var errors = [];
                            _.forEach(error.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                toaster.pop("error", errors.join(', '), '', 0);
                            } else {
                                toaster.pop("error", messages.orderCreateError, "", 0);
                            }
                            ngProgress.complete();
                        });
                } else {
                    $('#modal-order-create').modal();
                }
            }

            $scope.init = function () {
                $scope.dateinit();
                $rootScope.getOrdersCount();
                $rootScope.getCountryList();
                ngProgress.complete();
                $scope.attachEventsForTypeAhead();
                $("#create-order-review").on('click', 'button[type="submit"]', function (e) {
                    $scope.isApprove = $(this).hasClass("approve") ? true : false;
                });

            };
    }]);
});