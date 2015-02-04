define(['app', 'utility/messages'], function (app, messages) {
    app.controller('Products', ['$scope', '$bus', '$location', 'ngProgress', '$http', '$constants', '$routeParams', 'toaster', '$rootScope', '$timeout',
        function ($scope, $bus, $location, ngProgress, $http, $constants, $routeParams, toaster, $rootScope, $timeout) {

            $scope.productFilterOptions = $constants.productFilterOptions;

            $scope.dateOptions = $constants.dateOptions;

            $scope.inventoryOptions = $constants.inventoryOptions;

            $scope.categoryOptions = $constants.categoryOptions;

            $scope.productStatus = $constants.productStatus;

            $scope.constants = $constants;
            
            $scope.getCategory = function (cat) {
                return _.findWhere($scope.categoryOptions, {
                    'value': cat
                }) ? _.findWhere($scope.categoryOptions, {
                    'value': cat
                }).name : $constants.notAvailable
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
                case 'shipment':
                    return ($routeParams.status != 'archived' && $routeParams.status != 'inactive');
                    break;
                case 'fulfillment':
                    return ($routeParams.status != 'archived' && $routeParams.status != 'inactive');
                    break;
                case 'removal':
                    return ($routeParams.status != 'archived' && $routeParams.status != 'inactive');
                    break;
                case 'active':
                    return ($routeParams.status != 'active' && $routeParams.status != 'archived');
                    break;
                case 'inactive':
                    return ($routeParams.status != 'inactive' && $routeParams.status != 'archived');
                    break;
                case 'archived':
                    return ($routeParams.status != 'archived');
                    break;
                case 'restore':
                    return ($routeParams.status == 'archived');
                    break;
                case 'inventory':
                    return ($routeParams.status != 'inactive' && $routeParams.status != 'archived');
                    break;
                default:
                    return true;
                }
            }

            $scope.sortOptionVisible = function (option) {

                switch (option) {
                case 'inventoryAlertLevel':
                case 'qtyInShipment':
                case 'qtyDamaged':
                case 'qtyFulfillable':
                    return false;
                    break;
                case 'dateInActive':
                    return ($routeParams.status == 'inactive');
                    break;
                default:
                    return true;
                }
            }

            $scope.getCircle = function (val) {
                if (val == 0 || val == 2) {
                    return false;
                }
                if (val == 1) {
                    return true;
                }
            }

            $scope.getInventoryAlertLevel = function (val) {

                if (val || val == '0') {
                    return val;
                } else {
                    return $constants.notAvailableText;
                }
            }

            $scope.createdText = function (option) {
                if ($routeParams.status == 'inactive') {
                    return 'Inactive Since';
                } else {
                    return 'Created';
                }
            }
            $scope.toggleCheckBox = function () {

                $scope.toggleCheckBoxVal = ($scope.toggleCheckBoxVal) ? true : false;
                angular.forEach($scope.myData, function (product) {
                    product.Selected = $scope.toggleCheckBoxVal;
                });

            }

            $scope.showingSizeRowsProducts = function () {

                if ($routeParams.status == 'all' && $routeParams.status != '') {
                    return (typeof ($scope.productCount) != 'undefined') ? $scope.productCount[-1] : "0";

                } else if ($routeParams.status == 'active' && $routeParams.status != '') {
                    return (typeof ($scope.productCount) != 'undefined') ? $scope.productCount[1] : "0";

                } else if ($routeParams.status == 'inactive' && $routeParams.status != '') {
                    return (typeof ($scope.productCount) != 'undefined') ? $scope.productCount[0] : "0";

                } else {
                    return (typeof ($scope.productCount) != 'undefined') ? $scope.productCount[1] : "0";
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


            $scope.highlightSuggest = function (str, match) {
                var regex = new RegExp("(" + match + ")", 'gi');
                return str.replace(regex, '<strong>$1</strong>');
            }

            $scope.readQueryParam = function (param) {
                $timeout(function () {
                    param.f ? $scope.sortingOptions.field = param.f : '';
                    param.f ? $scope.sortingOptions.name = (_.findWhere($constants.productSortingOptions, {
                        "value": param.f
                    }) ? _.findWhere($constants.productSortingOptions, {
                        "value": param.f
                    }).name : _.findWhere($constants.productSortingOptions, {
                        "value": 'createdDate'
                    }).name) : '';
                    param.d ? $scope.sortingOptions.direction = param.d : '';
                    param.fromdate ? $scope.fromdate = param.fromdate : '';
                    param.todate ? $scope.todate = param.todate : '';
                    param.skey ? $scope.searchKey = param.skey : '';
                    _.map($scope.categoryOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    _.map($scope.dateOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    _.map($scope.inventoryOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    _.map($scope.productFilterOptions, function (option) {
                        if (option.ticked) option.ticked = false
                    });
                    if (param.cat) {
                        _(param.cat.split(',')).forEach(function (cat) {
                            var cat = _.findWhere($scope.categoryOptions, {
                                "value": cat
                            });
                            if (cat) cat.ticked = true;
                        });
                    }
                    if (param.inv) {
                        _(param.inv.split(',')).forEach(function (inv) {
                            var inv = _.findWhere($scope.inventoryOptions, {
                                "value": inv
                            });
                            if (inv) inv.ticked = true;
                        });
                    }
                    if (param.scol) {
                        var scol = _.findWhere($scope.productFilterOptions, {
                            "value": param.scol
                        });
                        if (scol) scol.ticked = true;
                    } else {
                        var scol = _.findWhere($scope.productFilterOptions, {
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
                var query = ($scope.pagingOptions.currentPage ? 'p=' + pageToFetch + '&' : '') + ($scope.pagingOptions.pageSize ? 's=' + $scope.pagingOptions.pageSize + '&' : '') + (($scope.searchColumn.length && $scope.searchKey) ? 'scol=' + _.pluck($scope.searchColumn, 'value') + '&' : '') + ($scope.searchKey ? 'skey=' + $scope.searchKey + '&' : '') + ($scope.date.length ? 'date=' + _.pluck($scope.date, 'value') + '&' : '') + ($scope.date.length && $scope.date[0].value == 'custom' && $scope.fromdate ? 'fromdate=' + $scope.fromdate + '&' : '') + ($scope.date.length && $scope.date[0].value == 'custom' && $scope.todate ? 'todate=' + $scope.todate + '&' : '') + ($scope.category.length ? 'cat=' + _.pluck($scope.category, 'value') + '&' : '') + ($scope.inventory.length ? 'inv=' + _.pluck($scope.inventory, 'value') + '&' : '') + ($scope.sortingOptions.field ? 'f=' + $scope.sortingOptions.field + '&' : '') + ($scope.sortingOptions.direction ? 'd=' + $scope.sortingOptions.direction : '');
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
                //            var params = {
                //                                status : $routeParams.status ? _.findWhere($scope.productStatus, {"name":$routeParams.status}).value : null,
                //                                p : $scope.pagingOptions.currentPage || null,
                //                                rcd : $scope.pagingOptions.pageSize || null,
                //                                scol : _.pluck($scope.searchColumn, 'value') ? _.pluck($scope.searchColumn, 'value').join(',') : null,
                //                                skey : $scope.searchKey || null,
                //                                date : _.pluck($scope.date, 'value') ? _.pluck($scope.date, 'value').join(',') : null,
                //                                fromdate : $scope.fromdate || null,
                //                                todate : $scope.todate || null,
                //                                cat : _.pluck($scope.category, 'value') ? _.pluck($scope.category, 'value').join(',') : null,
                //                                inv : _.pluck($scope.inventory, 'value') ? _.pluck($scope.inventory, 'value').join(',') :  null
                //                        };
                var params = {
                    status: $routeParams.status ? _.findWhere($scope.productStatus, {
                        "name": $routeParams.status
                    }).value : null,
                    p: $routeParams.p || null,
                    rcd: $routeParams.s || null,
                    scol: $routeParams.scol || null,
                    skey: $routeParams.skey || null,
                    date: $routeParams.date || null,
                    fromdate: $routeParams.fromdate || null,
                    todate: $routeParams.todate || null,
                    cat: $routeParams.cat || null,
                    inv: $routeParams.inv || null,
                    sortcol: $routeParams.f || null,
                    sortmethod: $routeParams.d || null
                };
                return _.omit(params, function (value, key) {
                    return !value || (key == 'inv' && value == 'all') || (key == 'date' && value == 'all') || (key == 'inv' && value == 'none') || (key == 'date' && value == 'none');
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

                    var checkin = $('#product-search-fromdate').datepicker().on('changeDate', function (ev) {
                        var newDate = new Date(ev.date)
                            //newDate.setDate(newDate.getDate() + 1);
                        checkout.setValue(newDate);
                        checkin.hide();
                        $scope.fromdate = $scope.formatDate(ev.date);
                        $scope.todate = $scope.formatDate(ev.date);
                        $('#product-search-todate')[0].focus();
                    }).data('datepicker');
                    var checkout = $('#product-search-todate').datepicker({
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
                                name: 'suggestproducts',
                                api: 'suggestproducts',
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
                $('html').not("#suggestion-holder, .selectboxhldr span, .suggestion-box a, #product-search-text").click(function () {
                    $scope.suggestions.length = 0;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }

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


            $scope.init = function () {

                $scope.dateinit();
                $scope.attachEventsForTypeAhead();
                $rootScope.getProductsCount();
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
                    field: 'modifiedDate',
                    name: 'Modified Date',
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
                        name: 'products',
                        api: 'products',
                        params: $scope.getQueryParam(),
                        data: null
                    })
                        .done(function (success) {
                            if (success.response && success.response.success.length) {
                                var products = [];
                                var data = success.response.data;
                                $rootScope.notificationMessagesFrame(messages.productList+' '+messages.retrivedSuccess,true);
                                //toaster.pop("success", messages.productList, messages.retrivedSuccess);
                                if (data && data.products) {
                                    if (!_.isArray(data.products)) {
                                        _.forEach(data.products, function (product) {
                                            products.push(product)
                                        });
                                    } else {
                                        products = data.products;
                                    }
                                    $scope.fromRecord = Number(data.fromRecord);
                                    $scope.toRecord = Number(data.toRecord);
                                    $scope.totalRecord = Number(data.totalRecords);
                                    $scope.setPagingData(products, (data.toRecord / (data.toRecord - data.fromRecord + 1)), (data.toRecord - data.fromRecord + 1), data.totalRecords);
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
                                    toaster.pop("error", messages.productListFetchError, "", 0);
                                }
                            }
                            ngProgress.complete();
                        }).fail(function (error) {
                            toaster.pop("error", messages.productListFetchError);
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
            };
    }]);
});