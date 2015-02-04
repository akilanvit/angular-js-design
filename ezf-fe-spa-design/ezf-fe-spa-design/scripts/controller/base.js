define(['angularAMD', 'socketio', 'utility/messages'], function (angularAMD, io, messages) {
    angularAMD.controller('Base', ['$scope', '$bus', '$location', 'ngProgress', '$rootScope', '$window', 'toaster', '$constants', '$timeout', '$cookieStore',
        function ($scope, $bus, $location, ngProgress, $rootScope, $window, toaster, $constants, $timeout, $cookieStore) {

            $scope.isTabActive = function (tabName) {
                if ($location.path().indexOf('/' + tabName) != -1) {
                    return "active";
                }
            };

            $scope.isNavActive = function (tabName, navName, initial) {
                if (($location.path() === '/' + tabName + (navName ? '/' + navName : '')) || (initial == 'default' && $location.path() === '/' + tabName)) {
                    return "active";
                }
            }

			$rootScope.notificationMessages = [];
			
			$rootScope.notificationMessagesFrame = function(msg,clear) {
				
				if (msg && clear) {
					console.log('came');
					$rootScope.notificationMessages = [];
					$rootScope.notificationMessages.push(msg);
				}else if (msg) {
					$rootScope.notificationMessages.push(msg);
				}
				
			}
			
            $rootScope.getProductsCount = function () {
                $bus.fetch({
                    name: 'productscount',
                    api: 'productscount',
                    params: null,
                    data: null
                })
                    .done(function (success) {
                        if (success.response.data.productCount)
                            $scope.productCount = success.response.data.productCount;
                        else
                            $scope.productCount = {};
                    }).fail(function (error) {
                        toaster.pop("error", messages.productCountFetchError);
                        $scope.productCount = {};
                    });
            }

            $rootScope.getShipmentsCount = function () {
                $bus.fetch({
                    name: 'shipmentscount',
                    api: 'shipmentscount',
                    params: null,
                    data: null
                })
                    .done(function (success) {
                        if (success.response.data && success.response.data.inboundCount)
                            $scope.shipmentCount = success.response.data.inboundCount;
                        else
                            $scope.shipmentCount = {};
                    }).fail(function (error) {
                        toaster.pop("error", messages.shipmentCountFetchError);
                        $scope.shipmentCount = {};
                    });
            }

            $rootScope.getOrdersCount = function () {
                $bus.fetch({
                    name: 'orderscount',
                    api: 'orderscount',
                    params: null,
                    data: null
                })
                    .done(function (success) {
                        if (success.response.data) {
                            var ordersTotalCount = 0;
                            angular.forEach(success.response.data, function (value, key) {
                                ordersTotalCount += value;
                            });
                            $scope.ordersCountTotal = (ordersTotalCount) ? ordersTotalCount : "0";
                            $scope.ordersCount = success.response.data;
                        } else {
                            $scope.ordersCount = {};
                        }
                    }).fail(function (error) {
                        toaster.pop("error", messages.orderCountFetchError);
                        $scope.ordersCount = {};
                    });
            }

            $rootScope.getCountryList = function () {
                var deferred = $.Deferred();
                $bus.fetch({
                    name: 'country.static',
                    api: 'country',
                    params: null,
                    data: null
                })
                    .done(function (success) {
                        var countries = [];
                        if (success.response) {
                            if (!_.isArray(success.response)) {
                                _.forEach(success.response, function (country) {
                                    countries.push(country)
                                });
                            } else {
                                countries = data;
                            }
                            $rootScope.countryList = countries;
                        } else {
                            $rootScope.countryList = [];
                        }
                        deferred.resolve();
                    }).fail(function (error) {
                        toaster.pop("error", messages.countryFetchError);
                        $rootScope.countryList = {};
                        deferred.reject();
                    });
                return deferred.promise();
            }

            $rootScope.getCurrencyList = function () {
                var deferred = $.Deferred();
                $bus.fetch({
                    name: 'currency.static',
                    api: 'currency',
                    params: null,
                    data: null
                })
                    .done(function (success) {
                        var currencies = [];
                        if (success.response) {
                            if (!_.isArray(success.response)) {
                                _.forEach(success.response, function (currency) {
                                    currencies.push(currency)
                                });
                            } else {
                                currencies = data;
                            }
                            $rootScope.currencyList = currencies;
                        } else {
                            $rootScope.currencyList = [];
                        }
                        deferred.resolve();
                    }).fail(function (error) {
                        toaster.pop("error", messages.currencyFetchError);
                        $rootScope.currencyList = {};
                        deferred.reject();
                    });
                return deferred.promise();
            }

            $scope.toggleLeftNav = function () {
                /*if($('aside').hasClass('full')) {
        		$('aside').removeClass('full').addClass('short');
        	} else {
        		$('aside').removeClass('short').addClass('full');	
        	}
        	if($('aside .expOrCol').hasClass('full')) {
        		$('aside .expOrCol').removeClass('full').addClass('short');
        	} else {
        		$('aside .expOrCol').removeClass('short').addClass('full');	
        	}
        	if($('section.content').hasClass('full')) {
        		$('section.content').removeClass('full').addClass('short');
        	} else {
        		$('section.content').removeClass('short').addClass('full');	
        	}*/
            }

            $scope.back = function () {
                $window.history.back();
            }

            $scope.navigate = function (url) {
                $location.path(url);
            }

            $scope.notifyProductUpload = function () {
                if (io) {
                    var socket = io.connect($constants.uploadproductsocket);
                    if (socket) {
                        socket.on("connect", function () {
                            console.log("Connected!");
                        });

                        socket.on($constants.uploadproductsocketkey, function (data) {
                            //$scope.getPagedDataAsync();
                            if(data.type==1) {
                            toaster.pop("success", "", "<a href='#/products/upload' title='" + messages.viewStatus + "'><em>" + messages.productFileProcessingCompleted + "</em></a>", 0, "trustedHtml");
                            } else if(data.type==2) {
                            toaster.pop("success", "", "<a href='#/shipments/upload' title='" + messages.viewStatus + "'><em>" + messages.shipmentFileProcessingCompleted + "</em></a>", 0, "trustedHtml");
                            } else if(data.type==3) {
                            toaster.pop("success", "", "<a href='#/orders/upload' title='" + messages.viewStatus + "'><em>" + messages.orderFileProcessingCompleted + "</em></a>", 0, "trustedHtml");
                            }
                            $scope.$broadcast('refreshUploadList');
                        });
                    }
                }
            }

            $scope.attachEvents = function () {
                $('body').on("click mousemove keyup", _.debounce(function () {
                    if ($cookieStore.get('isLoggedIn')) {
                        toaster.clear();
                        toaster.pop("warning", "", "<em>" + messages.warnSessionExpire + "</em>&nbsp;&nbsp;&nbsp;<a href='javascript:;' title='" + messages.continueBrowsing + "'>" + messages.continueBrowsing + "</a>&nbsp;&nbsp;&nbsp;<a href='#/logout' title='" + messages.logOut + "'>" + messages.logOut + "</a>", 0, "trustedHtml");
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }
                }, $constants.idleTimeout));
            }

            $scope.init = function () {
                $scope.notifyProductUpload();
                //$scope.attachEvents();
                if ($location.path() == '/404')
                    $rootScope.noPage = true;

                $('body').on('click', '.panel-heading input[type="checkbox"]', function (e) {
                    e.stopPropagation();
                });
            }
    }]);
});