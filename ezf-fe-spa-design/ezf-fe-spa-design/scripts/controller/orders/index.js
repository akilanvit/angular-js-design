define(['app', 'utility/messages'], function (app, messages) {
    app.controller('Orders', ['$scope', '$bus', 'ngProgress', 'toaster', '$rootScope', '$routeParams', '$constants', '$location', '$timeout',
        function ($scope, $bus, ngProgress, toaster, $rootScope, $routeParams, $constants, $location, $timeout) {

            $scope.orderFilterOptions = $constants.orderFilterOptions;

            $scope.dateOptions = $constants.orderDateOptions;

            $scope.orderStatus = $constants.orderStatus;

            $scope.orderTypeOptions = $constants.orderTypeOptions;

            $scope.orderInventoryOptions = $constants.orderInventoryOptions;

            $scope.orderChannelOptions = $constants.orderChannelOptions;

            $scope.orderSortingMapping = $constants.orderSortingMapping;

            $scope.constants = $constants;

            $scope.dynClass = function () {
                if ($routeParams.status == 'all') {
                    return true;
                }
            }


            $scope.getCountryName = function (code) {
                return code;
            }

            $scope.sort = function (field, name) {
                if ($scope.sortingOptions.field != field || $scope.sortingOptions.name != name) {
                    $scope.sortingOptions.field = field;
                    $scope.applyFilter();
                }
            }

            $scope.sortDirection = function () {
                if ($scope.sortingOptions.direction == 'desc') {
                    $scope.sortingOptions.direction = 'asc';
                } else {
                    $scope.sortingOptions.direction = 'desc';
                }
                $scope.applyFilter();
            }


            $scope.isOptionVisible = function (option) {

                switch (option) {
                case 'products':
                    return ($routeParams.status == 'hasissues' || $routeParams.status == 'unapproved' ||
                        $routeParams.status == 'inprocess' || $routeParams.status == 'fulfillment' || $routeParams.status == 'drafts' ||
                        $routeParams.status == 'drafts' || $routeParams.status == 'cancelled' || (!$routeParams.status));
                    break;
                case 'action':
                    return ($routeParams.status == 'drafts');
                    break;
                case 'approve':
                    return ($routeParams.status == 'delivered');
                    break;
                case 'cancel':
                    return (!$routeParams.status || $routeParams.status != 'delivered' || $routeParams.status != 'cancelled');
                    break;
                case 'restore':
                    return ($routeParams.status == 'cancelled');
                    break;
                case 'orderStatus':
                    return ($routeParams.status == 'all');
                    break;
                case 'remarks':
                    return ($routeParams.status == 'hasissues' || $routeParams.status == 'unapproved' || $routeParams.status == 'inprocess' || $routeParams.status == 'fulfillment' || $routeParams.status == 'drafts');
                    break;
                case 'trackingNumber':
                    return ($routeParams.status == 'shipped' || $routeParams.status == 'delivered');
                    break;
                case 'ordersView':
                    return ($routeParams.status == 'cancelled' || $routeParams.status == 'delivered' || $routeParams.status == 'shipped' || $routeParams.status == 'fulfillment' || $routeParams.status == 'inprocess');
                    break;
                case 'ordersEdit':
                    return ($routeParams.status == 'all' || $routeParams.status == 'hasissues' || $routeParams.status == 'unapproved' || $routeParams.status == 'drafts' || !$routeParams.status);
                    break;
                case 'ordOthersCollapse':
                     return ($routeParams.status == 'drafts' || $routeParams.status == 'cancelled');
                    break;
                case 'ordApprovedCollapse':
                    return ($routeParams.status == 'delivered' || $routeParams.status == 'shipped' || $routeParams.status == 'fulfillment' || $routeParams.status == 'inprocess');
                    break;
                case 'HAS_ISSUES':
                    if ($routeParams.status != 'hasissues') {
                        return true;
                    }
                    break;
                default:
                    return false;
                }
            }

            $scope.formatOrderStatus = function (val) {

                if (val == '') {
                    return $scope.constants.notAvailableText;
                } else {
                    return val.split("_").join(' ');
                }

            }

            $scope.toggleCheckBox = function () {

                $scope.toggleCheckBoxVal = ($scope.toggleCheckBoxVal) ? true : false;
                angular.forEach($scope.myData, function (order) {
                    order.Selected = $scope.toggleCheckBoxVal;
                });

            }

            $scope.getOrderUnits = function (data) {
                var ordUnits = 0;
                angular.forEach(data.lineItems, function (val, key) {
                    ordUnits = ordUnits + val.quantity;
                });
                return ordUnits;
            }

            $scope.showingSizeRowsOrders = function () {

                if ($routeParams.status == 'all' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['ALL'] : "0";

                } else if ($routeParams.status == 'hasissues' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['HAS_ISSUES'] : "0";

                } else if ($routeParams.status == 'unapproved' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['UNAPPROVED'] : "0";

                } else if ($routeParams.status == 'inprocess' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['IN_PROCESS'] : "0";

                } else if ($routeParams.status == 'fulfillment' && $routeParams.status != '') {

                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['FULFILLMENT'] : "--";

                } else if ($routeParams.status == 'shipped' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['SHIPPED'] : "0";

                } else if ($routeParams.status == 'delivered' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['DELIVERED'] : "0";

                } else if ($routeParams.status == 'drafts' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['DRAFT'] : "0";

                } else if ($routeParams.status == 'cancelled' && $routeParams.status != '') {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['CANCELLED'] : "0";

                } else {
                    return (typeof ($scope.ordersCount) != 'undefined') ? $scope.ordersCount['HAS_ISSUES'] : "0";
                }

            }


            $scope.$watch('myData', function (items) {
                var indItemSelected = 0;
                angular.forEach(items, function (items) {
                    indItemSelected += items.Selected ? 1 : 0;
                });

                $scope.showSelectedLength = indItemSelected;
                ($scope.showSelectedLength) ? $scope.showSelected = 1 : $scope.showSelected = 0;


            }, true);

            $scope.sortLogo = function () {
                return ($routeParams.d == 'asc' && typeof ($routeParams.d) != 'undefined') ? true : false;
            }

            $scope.paging = function (page, index) {
                if (index == 'last') {
                    page = Math.ceil($scope.totalRecord / $scope.pagingOptions.pageSize);
                }

                if ($scope.pagingOptions.currentPage != page && page > 0) {

                    $scope.pagingOptions.currentPage = page;
                    $scope.applyFilter();
                }
                $scope.pagingOptions.currentPage = (page > 0) ? page : $scope.pagingOptions.currentPage;
            }

            $scope.getPagingNum = function (currentPage, index) {
                return (currentPage + index);
            }

            $scope.setPageSizeClickLength = function () {
                var totalPages = Math.ceil($scope.totalRecord / $scope.pagingOptions.pageSize);
                $scope.pageSize = {
                    pageSizeClickLength: []
                }
                $scope.pageSize.pageSizeClickLength = [];

                //last
                if ($scope.pagingOptions.currentPage == totalPages) {
                    var count = 0;
                    for (var i = totalPages; i > 0; i--) {
                        count++;
                        $scope.pageSize.pageSizeClickLength.unshift(i);
                        if (count == 5) break;
                    }
                }

                //first
                else if ($scope.pagingOptions.currentPage == 1) {
                    var count = 0;
                    for (var i = 1; i <= totalPages; i++) {
                        count++;
                        $scope.pageSize.pageSizeClickLength.push(i);
                        if (count == 5) break;
                    }
                }

                //In - Between
                else {
                    var diffToStart, diffToEnd, count = 0,
                        startClickLength;
                    diffToStart = $scope.pagingOptions.currentPage - 1;
                    diffToEnd = totalPages - $scope.pagingOptions.currentPage;
                    if (totalPages <= 5 || diffToStart <= 2) startClickLength = 1;
                    else if (diffToStart >= 2 && diffToEnd >= 2) startClickLength = $scope.pagingOptions.currentPage - 2;
                    else if (diffToEnd < 2) startClickLength = $scope.pagingOptions.currentPage - 3;

                    for (var i = startClickLength; i <= totalPages; i++) {
                        count++;
                        $scope.pageSize.pageSizeClickLength.push(i);
                        if (count == 5) break;
                    }
                }
            }

            $scope.getOrdShipClass = function (data) {
                return (!data.lastname || !data.firstname || !data.address1 || !data.countryCode || !data.postalCode)
            }
            
            $scope.getShippingClass = function (value){
                
                var retVal = false;
                
                _.each($constants.internationalShippingOptions, function (option) {
                    if(option.name==value){ retVal=true; }
                });

                _.each($constants.domesticShippingOptions, function (option) {
                    if(option.name==value){ retVal=true; }
                });
                
                return retVal;
            }

            $scope.highlightSuggest = function (str, match) {
                if(str) {
                    var regex = new RegExp("(" + match + ")", 'gi');
                    return str.replace(regex, '<strong>$1</strong>');
                }
            }
            
            $scope.suggestNavigation = function(suggest) {
                if(suggest) {
                  if(suggest.orderStatus == 'IN_PROCESS' || suggest.orderStatus == 'UNAPPROVED' || suggest.orderStatus == 'DRAFT') {
                      var url = 'orders/edit/' + suggest.orderHeaderId;
                  } else {
                      var url = 'orders/view/' + suggest.orderHeaderId;
                  }
                  $location.url(url);
                }
            }

            $scope.readQueryParam = function (param) {
                $timeout(function () {
                    param.f ? $scope.sortingOptions.field = param.f : '';
                    param.f ? $scope.sortingOptions.name = (_.findWhere($constants.ordersSortingOptions, {
                        "value": param.f
                    }) ? _.findWhere($constants.ordersSortingOptions, {
                        "value": param.f
                    }).name : _.findWhere($constants.ordersSortingOptions, {
                        "value": 'createdDate'
                    }).name) : '';
                    param.d ? $scope.sortingOptions.direction = param.d : '';
                    param.fromdate ? $scope.fromdate = param.fromdate : '';
                    param.todate ? $scope.todate = param.todate : '';
                    param.skey ? $scope.searchKey = param.skey : '';
                    _.map($scope.dateOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    _.map($scope.shipmentFilterOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    if (param.scol) {
                        var scol = _.findWhere($scope.shipmentFilterOptions, {
                            "value": param.scol
                        });
                        if (scol) scol.ticked = true;
                    } else {
                        var scol = _.findWhere($scope.shipmentFilterOptions, {
                            "value": "all"
                        });
                        if (scol) scol.ticked = true;
                    }
                    if (param.date) {
                        var date = _.findWhere($scope.dateOptions, {
                            "value": param.date
                        });
                        if (date) date.ticked = true;
                    }
                });
            }

            $scope.resetFilter = function () {
                
                var resetQueryForm = $scope.getQueryParam();
                console.log(resetQueryForm);
                var resetQuery = (resetQueryForm.page ? 'p=' + resetQueryForm.page + '&' : '')+(resetQueryForm.rcdsPerPage ? 's=' + resetQueryForm.rcdsPerPage + '&' : '')+(resetQueryForm.sortCol ? 'f=' + resetQueryForm.sortCol + '&' : '')+(resetQueryForm.sortOrder ? 'd=' + resetQueryForm.sortOrder + '&' : '');
                
                $location.url((resetQuery)?$location.path() + '?' +resetQuery:$location.path());
                
                $scope.readQueryParam($routeParams);
                $scope.searchKey = ""; // added
                $scope.form.$setPristine(); // added
            }

            $scope.applyFilter = function () {
                
                var totalPageCount = Math.ceil($scope.totalRecord / $scope.pagingOptions.pageSize);
                var pageToFetch = ($scope.pagingOptions.currentPage > totalPageCount) ? totalPageCount : $scope.pagingOptions.currentPage;
                pageToFetch = ($scope.searchKey)?'1':pageToFetch;
                var query = ($scope.pagingOptions.currentPage ? 'p=' + pageToFetch + '&' : '') + ($scope.pagingOptions.pageSize ? 's=' + $scope.pagingOptions.pageSize + '&' : '') + (($scope.searchColumn.length && $scope.searchKey) ? 'scol=' + _.pluck($scope.searchColumn, 'value') + '&' : '') + ($scope.searchKey ? 'skey=' + $scope.searchKey + '&' : '') + ($scope.date.length ? 'date=' + _.pluck($scope.date, 'value') + '&' : '') + ($scope.date.length && $scope.date[0].value == 'custom' && $scope.fromdate ? 'fromdate=' + $scope.fromdate + '&' : '') + ($scope.date.length && $scope.date[0].value == 'custom' && $scope.todate ? 'todate=' + $scope.todate + '&' : '') + ($scope.sortingOptions.field ? 'f=' + $scope.sortingOptions.field + '&' : '') + ($scope.sortingOptions.direction ? 'd=' + $scope.sortingOptions.direction + '&' : '') + ($scope.type.length ? 'type=' + _.pluck($scope.type, 'value') + '&' : '') + ($scope.channel.length ? 'c=' + _.pluck($scope.channel, 'value') + '&' : '') + ($scope.inventory.length ? 'inv=' + _.pluck($scope.inventory, 'value') : '');
                if (query && ($location.url() != $location.path() + '?' + query)) {
                    $location.url($location.path() + '?' + query);
                    $scope.readQueryParam($routeParams);
                }
            };

            $scope.getQueryParam = function () {
                if ($routeParams.p)
                    $scope.pagingOptions.currentPage = Number($routeParams.p);
                if ($routeParams.s)
                    $scope.pagingOptions.pageSize = $scope.showingSize = Number($routeParams.s);
                if (!$routeParams.s) {
                    $scope.showingSize = $scope.pagingOptions.pageSize;
                }
                var params = {
                    status: $routeParams.status ? _.findWhere($scope.orderStatus, {
                        "name": $routeParams.status
                    }).value : 'HAS_ISSUES',
                    page: $routeParams.p || null,
                    rcdsPerPage: $routeParams.s || null,
                    searchCol: $routeParams.scol || null,
                    searchTerm: $routeParams.skey || null,
                    dateRange: $routeParams.date || null,
                    fromDate: $routeParams.fromdate || null,
                    toDate: $routeParams.todate || null,
                    sortCol: $routeParams.f || null,
                    sortOrder: $routeParams.d || null,
                    channel: $routeParams.c || null,
                    isDomestic: $routeParams.type || null,
                    hasInventory: $routeParams.inv || null
                };
                return _.omit(params, function (value, key) {
                    return !value || (key == 'isDomestic' && value == 'all') || (key == 'isDomestic' && value == 'none') || (key == 'channel' && value == 'none') || (key == 'channel' && value == 'all') || (key == 'dateRange' && value == 'all') || (key == 'dateRange' && value == 'none') || (key == 'hasInventory' && value == 'all') || (key == 'hasInventory' && value == 'none');
                });
            }

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

            $scope.dateinit = function () {
                $timeout(function () {
                    var nowTemp = new Date();
                    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

                    var today = new Date();
                    var binddate = $scope.formatDate(nowTemp);
                    $scope.fromdate = binddate;
                    $scope.todate = binddate;

                    var checkin = $('#order-search-fromdate').datepicker().on('changeDate', function (ev) {
                        var newDate = new Date(ev.date)
                            //newDate.setDate(newDate.getDate() + 1);
                        checkout.setValue(newDate);
                        checkin.hide();
                        $scope.fromdate = $scope.formatDate(ev.date);
                        $scope.todate = $scope.formatDate(ev.date);
                        $('#order-search-todate')[0].focus();
                    }).data('datepicker');
                    var checkout = $('#order-search-todate').datepicker({
                        onRender: function (date) {
                            return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
                        }
                    }).on('changeDate', function (ev) {
                        checkout.hide();
                        $scope.todate = $scope.formatDate(ev.date);
                    }).data('datepicker');

                    var fromDate = $routeParams.fromdate ? new Date($routeParams.fromdate.split('/')[2] + '-' + $routeParams.fromdate.split('/')[1] + '-' + $routeParams.fromdate.split('/')[0]) : nowTemp;
                    var toDate = $routeParams.todate ? new Date($routeParams.todate.split('/')[2] + '-' + $routeParams.todate.split('/')[1] + '-' + $routeParams.todate.split('/')[0]) : nowTemp;
                    checkin.setValue(fromDate);
                    // newDate.setDate(newDate.getDate() + 1);
                    checkout.setValue(toDate);
                });
            }

            $scope.suggestions = [];

            $scope.findSuggestion = function (txt, col) {
                if (txt && txt.length > 2) {
                    $timeout(function () {
                        if (txt == $scope.searchKey) {
                            $bus.fetch({
                                name: 'suggestorders',
                                api: 'suggestorders',
                                params: {
                                    skey: txt,
                                    scol: col[0].value
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
                $('html').not("#suggestion-holder, .selectboxhldr span, .suggestion-box a, #order-search-text").click(function () {
                    $scope.suggestions.length = 0;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }

            $scope.init = function () {
                $scope.dateinit();
                $scope.attachEventsForTypeAhead();
                $rootScope.getOrdersCount();
                $scope.readQueryParam($routeParams);
                $scope.totalServerItems = 0;

                $(function () {
                    setTimeout(function () {
                        $('[data-toggle="tooltip"]').tooltip();
                    }, 1000);
                });
                $scope.pagingOptions = {
                    pageSizes: [10, 25, 50, 100],
                    pageSize: 10,
                    currentPage: 1
                };

                $scope.pageSize = {
                    pageSizeClickLength: [1]
                };


                $scope.sortingOptions = {
                    field: 'createdDate',
                    name: 'Created Date',
                    direction: 'desc'
                };

                $scope.setPagingData = function (data, page, pageSize, totalSize) {
                    _(data).forEach(function (item) {
                        item.lineItemsUnits = 0;
                        _(item.lineItems).forEach(function (i) {
                            item.lineItemsUnits += Number(i.quantity);
                        });
                    });
                    $scope.myData = data;

                    $scope.totalServerItems = totalSize;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                };

                $scope.getPagedDataAsync = function () {
                    ngProgress.start();
                    $bus.fetch({
                        name: 'orders',
                        api: 'orders',
                        params: $scope.getQueryParam(),
                        data: null
                    })
                        .done(function (success) {
                            if (success.response && success.response.success && success.response.success.length) {
                                var orders = [];
                                var data = success.response.data;
                                $rootScope.notificationMessagesFrame(messages.orderList+' '+messages.retrivedSuccess,true);
                                //toaster.pop("success", messages.orderList, messages.retrivedSuccess);
                                if (data && data.orders) {
                                    if (!_.isArray(data.orders)) {
                                        _.forEach(data.orders, function (order) {
                                            orders.push(shipment)
                                        });
                                    } else {
                                        orders = data.orders;
                                    }
                                    $scope.fromRecord = Number(data.fromRecord);
                                    $scope.toRecord = Number(data.toRecord);
                                    $scope.totalRecord = Number(data.totalRecords);
                                    $scope.setPagingData(orders, (data.toRecord / (data.toRecord - data.fromRecord + 1)), (data.toRecord - data.fromRecord + 1), data.totalRecords);
                                    $scope.setPageSizeClickLength();
                                }
                            } else {
                                var errors = [];
                                _.forEach(success.response.errors, function (error) {
                                    errors.push(error)
                                });
                                if (errors.length) {
                                    toaster.pop("error", errors.join(', '), '', 0);
                                } else {
                                    toaster.pop("error", messages.orderFetchError, "", 0);
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
                                toaster.pop("error", messages.orderFetchError, "", 0);
                            }
                            ngProgress.complete();
                        });
                };

                $scope.getPagedDataAsync();
                $scope.$watch('pagingOptions', function (newVal, oldVal) {

                    if (newVal !== oldVal) {
                      $scope.showingSize = newVal.pageSize;
                      $scope.applyFilter();
                      //$scope.getPagedDataAsync();
                    }
                }, true);
            }

    }]);
});