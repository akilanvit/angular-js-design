define(['app', 'model/products/details', 'utility/messages'], function (app, model, messages) {
    app.controller('CreateProducts', ['$scope', '$bus', '$location', 'ngProgress', '$constants', 'toaster', '$rootScope','$window',
        function ($scope, $bus, $location, ngProgress, $constants, toaster, $rootScope,$window) {

            //ngProgress.start();
            $scope.model = new model();

            $scope.validationMessages = $constants.validationMessages;

            $scope.codeType = $constants.codeType;

            $scope.categoryOptions = $constants.categoryOptions;

            $scope.incrementAddInfo = function () {
                $scope.addInfo++;
            }

            $scope.productCreated = false;

            $scope.$on('$locationChangeStart', function (event, next, current) {
				
				if (!$scope.productCreated) {
					
					event.preventDefault();
					
					$('#modalCancel').on('click',function(e){

						$('#confirm-modal').modal('hide');
						$('#confirm-modal').on('hidden.bs.modal', function (e) {
							$('#createOk').off('click');
						});
					});
					
					$('#confirm-modal').modal();
					$('#confirm-modal').on('shown.bs.modal', function (e) {
						$('#createOk').on('click',function(){
							$scope.productCreated = true;
							
							$('#confirm-modal').modal('hide');
							$('#confirm-modal').on('hidden.bs.modal', function (e) {
								$window.location=next;
							});
							$scope.$apply();
							
						});
					});
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
			
			$scope.isCodeValidPrice = function (text, value) {
				
                if (text && !value)
                    return false;
                else
                    return true;
            }
			
			$scope.isCodeValidPid = function(text,value) {
				
				var retValue = false;
				
				if (text && !value){
					$scope.productIdInvalidMessages = $constants.validationMessages.required;
					retValue = false;
				}else if (!text && !value){
					retValue = true;
				}
				else if (!text && value){
					$scope.productIdInvalidMessages = '';
					retValue = false;
				}
				else if(text && value){
					_.each($constants.codeType,function(option){
						if(option.name==text){
							_.each(option.validationlength,function(valLength){
								if (valLength == value.length) {
									retValue = true;
								}else{
									_.find($constants.validationMessages, function (valMsg,key) {
										if (key==text) { $scope.productIdInvalidMessages=valMsg; }
									});
								}
							});
						}
					});
				}
				else{
					$scope.productIdInvalidMessages = $constants.validationMessages.required;
					retValue = false;
				}
				return retValue;
			}
			
            $scope.isExportSelected = function (text) {
                if ($scope.model.isExportable && !text)
                    return false;
                else
                    return true;
            }

            $scope.cleanExportableData = function (value) {
                if (!value) {
                    $scope.model.customsDescription = "";
                    $scope.model.hsCode = "";
                    $scope.countryOfOriginCtrl = null;
                }
            }

            $scope.cleanData = function () {
                delete $scope.model.fbspSkuId;
                $scope.model.mainProductCategory = $scope.mainProductCategoryCtrl ? $scope.mainProductCategoryCtrl.value : '';
                $scope.model.declaredValueCurrency = $scope.declaredValueCurrencyCtrl ? $scope.declaredValueCurrencyCtrl.currencyCode : '';
                $scope.model.retailPriceCurrency = $scope.retailPriceCurrencyCtrl ? $scope.retailPriceCurrencyCtrl.currencyCode : '';
                $scope.model.codeType = $scope.codeTypeCtrl ? $scope.codeTypeCtrl.value : '';
                $scope.model.costPriceCurrency = $scope.costPriceCurrencyCtrl ? $scope.costPriceCurrencyCtrl.currencyCode : '';
                $scope.model.countryOfOrigin = $scope.countryOfOriginCtrl ? $scope.countryOfOriginCtrl.countryCode : '';
            }

            $scope.createProduct = function () {
                if (!$scope.model.isActive) {
                    var answer = confirm(messages.warnInactiveProductCreation)
                    if (!answer) {
                        return;
                    }
                }
                $scope.cleanData();
                $bus.fetch({
                    name: 'createproducts',
                    api: 'createproducts',
                    params: null,
                    data: JSON.stringify($scope.model)
                })
                    .done(function (success) {
                        if (success.response.success.length) {
                            $scope.productCreated = true;
							$rootScope.notificationMessagesFrame(messages.productCreateSuccess,true);
                            //toaster.pop("success", messages.productCreateSuccess);
                            $location.path('products');
                            $rootScope.getProductsCount();
                        } else {
                            var errors = [];
                            _.forEach(success.response.errors, function (error) {
                                errors.push(error)
                            });
                            if (errors.length) {
                                toaster.pop("error", errors.join(', '), '', 0);
                            } else {
                                toaster.pop("error", messages.productCreateError, "", 0);
                            }
                        }
                    }).fail(function (error) {
                        toaster.pop("error", messages.productCreateError);
                    });
            }

            $scope.init = function () {
                $rootScope.getProductsCount();
                $rootScope.getCountryList();
                $rootScope.getCurrencyList();
            };


            ngProgress.complete();
    }]);
});