define(['angularAMD'], function (angularAMD) {
		angularAMD
		.directive('showEmptyMsg', ['$compile', '$timeout', function ($compile, $timeout) {
		    return {
		        restrict: 'A',
		        link: function (scope, element, attrs) {
		            var msg = (attrs.showEmptyMsg) ? attrs.showEmptyMsg : 'No Data to display';
		            var template = "<div class='nodatarow' ng-hide='myData.length'>" + msg + "</div>";
		            var tmpl = angular.element(template);
		            $compile(tmpl)(scope);
		            $timeout(function () {
		                element.find('.ngViewport').append(tmpl).height('60px');
		            }, 0);
                }
            };
		}])
        .directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.bind('change', function(){
                        scope.$apply(function(){
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }])
        .directive('notificationMessages', [function () {
            return {
                restrict: 'A',
                replace:true,
                controller:function(){
                       
                },
                template:'<div class="container-fluid">'+
                            '<div class="row" ng-repeat="showMsg in $root.notificationMessages track by $index">'+
                                '<div class="col-sm-4 col-md-4 col-md-offset-4 col-sm-offset-4 notificationRow">'+
                                        '{{showMsg}}'+
                                        '<span class="glyphicon glyphicon-notificationClose pull-right notificationClose"></span>'+
                                '</div>'+
                                '<div class="clearfix"></div>'+
                            '</div>'+
                          '</div>'
            };
        }]);
});