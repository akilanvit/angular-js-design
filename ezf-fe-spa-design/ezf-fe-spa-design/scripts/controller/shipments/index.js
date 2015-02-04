define(['app', 'utility/messages'], function (app, messages) {
    app.controller('Shipments', ['$scope', '$bus', 'ngProgress', 'toaster', '$rootScope', '$routeParams', '$constants', '$location', '$timeout',
        function ($scope, $bus, ngProgress, toaster, $rootScope, $routeParams, $constants, $location, $timeout) {

            $scope.shipmentFilterOptions = $constants.shipmentFilterOptions;

            $scope.dateOptions = $constants.dateOptions;

            $scope.shipmentStatus = $constants.shipmentStatus;

            $scope.constants = $constants;

            $scope.isOptionVisible = function (option) {
                switch (option) {
                case 'action':
                    return ($routeParams.status == 'received');
                    break;
                case 'cancel':
                    return (!$routeParams.status || $routeParams.status == 'pending' || $routeParams.status == 'intransit');
                    break;
                case 'restore':
                    return ($routeParams.status == 'cancelled');
                    break;
                case 'arrivalDetails':
                    return ($routeParams.status == 'received' || $routeParams.status == 'intransit');
                    break;
                case 'shipFrom':
                    return (!$routeParams.status || $routeParams.status == 'pending' || $routeParams.status == 'cancelled');
                    break;
                case 'receivedDetails':
                    return ($routeParams.status == 'received');
                    break;
                case 'inventoryReceived':
                    return ($routeParams.status == 'received');
                    break;
                case 'date':
                    return (!$routeParams.status || $routeParams.status == 'pending' || $routeParams.status == 'intransit');
                    break;
                case 'dateCancelled':
                    return ($routeParams.status == 'cancelled');
                    break;
                case 'labelBy':
                    return (!$routeParams.status || $routeParams.status == 'pending' || $routeParams.status == 'cancelled' || $routeParams.status == 'intransit');
                    break;
                case 'pendingEdit':
                    return (!$routeParams.status || $routeParams.status == 'pending');
                    break;
                case 'othersView':
                    return ($routeParams.status && $routeParams.status != 'pending');
                    break;
                default:
                    return true;
                }
            }

            $scope.sortLogo = function () {
                return ($routeParams.d == 'asc' && typeof ($routeParams.d) != 'undefined') ? true : false;
            }

            $scope.highlightSuggest = function (str, match) {
                var regex = new RegExp("(" + match + ")", 'gi');
                return str.replace(regex, '<strong>$1</strong>');
            }

            $scope.readQueryParam = function (param) {
                $timeout(function () {
                    param.f ? $scope.sortingOptions.field = param.f : '';
                    param.f ? $scope.sortingOptions.name = (_.findWhere($constants.shipmentSortingOptions, {
                        "value": param.f
                    }) ? _.findWhere($constants.shipmentSortingOptions, {
                        "value": param.f
                    }).name : _.findWhere($constants.productSortingOptions, {
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
                var resetQuery = (resetQueryForm.p ? 'p=' + resetQueryForm.p + '&' : '')+(resetQueryForm.rcd ? 's=' + resetQueryForm.rcd + '&' : '')+(resetQueryForm.sortcol ? 'f=' + resetQueryForm.sortcol + '&' : '')+(resetQueryForm.sortmethod ? 'd=' + resetQueryForm.sortmethod + '&' : '');
                
                $location.url((resetQuery)?$location.path() + '?' +resetQuery:$location.path());
                $scope.readQueryParam($routeParams);
                $scope.searchKey = ""; // added
                $scope.form.$setPristine(); // added
            }

            $scope.applyFilter = function () {
                var totalPageCount = Math.ceil($scope.totalRecord / $scope.pagingOptions.pageSize);
                var pageToFetch = ($scope.pagingOptions.currentPage > totalPageCount) ? totalPageCount : $scope.pagingOptions.currentPage;
				pageToFetch = ($scope.searchKey)?'1':pageToFetch;
                var query = ($scope.pagingOptions.currentPage ? 'p=' + pageToFetch + '&' : '') + ($scope.pagingOptions.pageSize ? 's=' + $scope.pagingOptions.pageSize + '&' : '') + (($scope.searchColumn.length && $scope.searchKey) ? 'scol=' + _.pluck($scope.searchColumn, 'value') + '&' : '') + ($scope.searchKey ? 'skey=' + $scope.searchKey + '&' : '') + ($scope.date.length ? 'date=' + _.pluck($scope.date, 'value') + '&' : '') + ($scope.date.length && $scope.date[0].value == 'custom' && $scope.fromdate ? 'fromdate=' + $scope.fromdate + '&' : '') + ($scope.date.length && $scope.date[0].value == 'custom' && $scope.todate ? 'todate=' + $scope.todate + '&' : '') + ($scope.sortingOptions.field ? 'f=' + $scope.sortingOptions.field + '&' : '') + ($scope.sortingOptions.direction ? 'd=' + $scope.sortingOptions.direction : '');
                if (query && ($location.url() != $location.path() + '?' + query)) {
                    $location.url($location.path() + '?' + query);
                    $scope.readQueryParam($routeParams);
                }
            };

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

            $scope.$watch('myData', function (items) {
                var indItemSelected = 0;
                angular.forEach(items, function (items) {
                    indItemSelected += items.Selected ? 1 : 0;
                });

                $scope.showSelectedLength = indItemSelected;
                ($scope.showSelectedLength) ? $scope.showSelected = 1 : $scope.showSelected = 0;


            }, true);

            $scope.toggleCheckBox = function () {

                $scope.toggleCheckBoxVal = ($scope.toggleCheckBoxVal) ? true : false;
                angular.forEach($scope.myData, function (shipment) {
                    shipment.Selected = $scope.toggleCheckBoxVal;
                });

            }

            $scope.getLabelDisplayValue = function (code) {
                return _.findWhere($constants.labelList, {
                    "value": code
                }) ? _.findWhere($constants.labelList, {
                    "value": code
                }).name : $constants.notAvailable;
            }

            $scope.getQueryParam = function () {
                if ($routeParams.p)
                    $scope.pagingOptions.currentPage = Number($routeParams.p);
                if ($routeParams.s)
                    $scope.pagingOptions.pageSize = Number($routeParams.s);
                var params = {
                    status: $routeParams.status ? _.findWhere($scope.shipmentStatus, {
                        "name": $routeParams.status
                    }).value : _.findWhere($scope.shipmentStatus, {
                        "name": "pending"
                    }).value,
                    p: $routeParams.p || null,
                    rcd: $routeParams.s || null,
                    scol: $routeParams.scol || null,
                    skey: $routeParams.skey || null,
                    date: $routeParams.date || null,
                    fromdate: $routeParams.fromdate || null,
                    todate: $routeParams.todate || null,
                    sortcol: $routeParams.f || null,
                    sortmethod: $routeParams.d || null
                };
                return _.omit(params, function (value, key) {
                    return !value || (key == 'date' && value == 'all') || (key == 'date' && value == 'none');
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

                    var checkin = $('#shipment-search-fromdate').datepicker().on('changeDate', function (ev) {
                        var newDate = new Date(ev.date)
                            //newDate.setDate(newDate.getDate() + 1);
                        checkout.setValue(newDate);
                        checkin.hide();
                        $scope.fromdate = $scope.formatDate(ev.date);
                        $scope.todate = $scope.formatDate(ev.date);
                        $('#shipment-search-todate')[0].focus();
                    }).data('datepicker');
                    var checkout = $('#shipment-search-todate').datepicker({
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
                                name: 'suggestshipments',
                                api: 'suggestshipments',
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
                $('html').not("#suggestion-holder, .selectboxhldr span, .suggestion-box a, #shipment-search-text").click(function () {
                    $scope.suggestions.length = 0;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
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

            $scope.init = function () {
                $scope.dateinit();
                $scope.attachEventsForTypeAhead();
                $rootScope.getShipmentsCount();
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
                    name: 'Date Created',
                    direction: 'desc'
                };

                $scope.setPagingData = function (data, page, pageSize, totalSize) {
                    $scope.myData = data;
                    $scope.totalServerItems = totalSize;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                };

                $scope.getPagedDataAsync = function () {
                    ngProgress.start();
                    $bus.fetch({
                        name: 'shipments',
                        api: 'shipments',
                        params: $scope.getQueryParam(),
                        data: null
                    })
                        .done(function (success) {
                            if (success.response && success.response.success && success.response.success.length) {
                                var shipments = [];
                                var data = success.response.data;
								$rootScope.notificationMessagesFrame(messages.shipmentList+' '+messages.retrivedSuccess,true);
                                //toaster.pop("success", messages.shipmentList, messages.retrivedSuccess);
                                if (data && data.shipments) {
                                    if (!_.isArray(data.shipments)) {
                                        _.forEach(data.shipments, function (shipment) {
                                            shipments.push(shipment)
                                        });
                                    } else {
                                        shipments = data.shipments;
                                    }
                                    $scope.fromRecord = Number(data.fromRecord);
                                    $scope.toRecord = Number(data.toRecord);
                                    $scope.totalRecord = Number(data.totalRecords);
                                    $scope.setPagingData(shipments, (data.toRecord / (data.toRecord - data.fromRecord + 1)), (data.toRecord - data.fromRecord + 1), data.totalRecords);
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
                                    toaster.pop("error", messages.shipmentListFetchError, "", 0);
                                }
                            }
                            ngProgress.complete();
                        }).fail(function (error) {
                            toaster.pop("error", messages.shipmentListFetchError);
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