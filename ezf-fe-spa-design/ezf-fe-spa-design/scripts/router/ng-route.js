var dep = [
            'angularAMD', 
            'angular-route',
            'angular-cookies',
            'angular-sanitize',
            'controller/base', 
            'jquery', 
            'underscore',
            'bootstrap',
            'ngAnimate',
            'ngProgress',
            'ngToaster',
            'directive/ng-directive',
            'service/dal',
            'service/exception',
            'service/ng-service',
            'factory/bus', 
            'factory/ng-factory',
            'filter/ng-filter',
            'utility/constants',
            'angular-nvd3',
            'angular-validator',
            'directive/angular-gmap',
            'ng-multiselect'
          ];

define(dep, function (angularAMD) {
  
  //Define the app module
  var app = angular.module("ezyCommerce", ['ngRoute','ngCookies','ngSanitize','ngProgress','toaster', 'multi-select', 'angularValidator']);
  
  app.config(function ($routeProvider) {
    $routeProvider
    //Login routing
    .when("/login", angularAMD.route({
        templateUrl: 'views/login/index.html', controller: 'Login', controllerUrl: 'controller/login/index'
    }))
    .when("/", angularAMD.route({
        templateUrl: 'views/login/index.html', controller: 'Login', controllerUrl: 'controller/login/index'
    }))
    //Dashboard routing
    .when("/home", angularAMD.route({
        templateUrl: 'views/dashboard/index.html', controller: 'Dashboard', controllerUrl: 'controller/dashboard/index'
    }))
    //Products routing
    .when("/products", angularAMD.route({
        templateUrl: 'views/products/index.html', controller: 'Products', controllerUrl: 'controller/products/index'
    }))
    .when("/products/create", angularAMD.route({
        templateUrl: 'views/products/create.html', controller: 'CreateProducts', controllerUrl: 'controller/products/create'
    }))
    .when("/products/upload", angularAMD.route({
        templateUrl: 'views/products/upload.html', controller: 'UploadProducts', controllerUrl: 'controller/products/upload'
    }))
    .when("/products/:status", angularAMD.route({
        templateUrl: 'views/products/index.html', controller: 'Products', controllerUrl: 'controller/products/index'
    }))
    .when("/products/view/:sku", angularAMD.route({
        templateUrl: 'views/products/view.html', controller: 'ViewProducts', controllerUrl: 'controller/products/view'
    }))
    .when("/products/edit/:sku", angularAMD.route({
        templateUrl: 'views/products/edit.html', controller: 'EditProducts', controllerUrl: 'controller/products/edit'
    }))
    //Shipments routing
    .when("/shipments", angularAMD.route({
        templateUrl: 'views/shipments/index.html', controller: 'Shipments', controllerUrl: 'controller/shipments/index'
    }))
    .when("/shipments/create", angularAMD.route({
        templateUrl: 'views/shipments/create.html', controller: 'CreateShipments', controllerUrl: 'controller/shipments/create'
    }))
    .when("/shipments/send/:sku", angularAMD.route({
        templateUrl: 'views/shipments/send.html', controller: 'SendShipments', controllerUrl: 'controller/shipments/send'
    }))
    .when("/shipments/upload", angularAMD.route({
        templateUrl: 'views/shipments/upload.html', controller: 'UploadShipments', controllerUrl: 'controller/shipments/upload'
    }))
    .when("/shipments/:status", angularAMD.route({
        templateUrl: 'views/shipments/index.html', controller: 'Shipments', controllerUrl: 'controller/shipments/index'
    }))
    .when("/shipments/view/:sku", angularAMD.route({
        templateUrl: 'views/shipments/view.html', controller: 'ViewShipments', controllerUrl: 'controller/shipments/view'
    }))
    .when("/shipments/edit/:sku", angularAMD.route({
        templateUrl: 'views/shipments/edit.html', controller: 'EditShipments', controllerUrl: 'controller/shipments/edit'
    }))
    //Orders routing
    .when("/orders", angularAMD.route({
        templateUrl: 'views/orders/index.html', controller: 'Orders', controllerUrl: 'controller/orders/index'
    }))
    .when("/orders/create", angularAMD.route({
        templateUrl: 'views/orders/create.html', controller: 'CreateOrders', controllerUrl: 'controller/orders/create'
    }))
    .when("/orders/send/:sku", angularAMD.route({
        templateUrl: 'views/orders/review.html', controller: 'ReviewOrders', controllerUrl: 'controller/orders/review'
    }))
    .when("/orders/upload", angularAMD.route({
        templateUrl: 'views/orders/upload.html', controller: 'UploadOrders', controllerUrl: 'controller/orders/upload'
    }))
    .when("/orders/:status", angularAMD.route({
        templateUrl: 'views/orders/index.html', controller: 'Orders', controllerUrl: 'controller/orders/index'
    }))
    .when("/orders/view/:sku", angularAMD.route({
        templateUrl: 'views/orders/view.html', controller: 'ViewOrders', controllerUrl: 'controller/orders/view'
    }))
    .when("/orders/edit/:sku", angularAMD.route({
        templateUrl: 'views/orders/edit.html', controller: 'EditOrders', controllerUrl: 'controller/orders/edit'
    }))
     // Accounts Routing
    .when("/accounts", angularAMD.route({
        templateUrl: 'views/accounts/editProfileIndividual.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/editProfileIndividual", angularAMD.route({
        templateUrl: 'views/accounts/editProfileIndividual.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/editProfileBusiness", angularAMD.route({
        templateUrl: 'views/accounts/editProfileBusiness.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/connections", angularAMD.route({
        templateUrl: 'views/accounts/connections.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/connections/addNewChannel", angularAMD.route({
        templateUrl: 'views/accounts/addNewChannel.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/connections/integrateEbay", angularAMD.route({
        templateUrl: 'views/accounts/integrateEbay.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/connections/integrateShopify", angularAMD.route({
        templateUrl: 'views/accounts/integrateShopify.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/connections/edit/ebay", angularAMD.route({
        templateUrl: 'views/accounts/editEbay.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/addressBook", angularAMD.route({
        templateUrl: 'views/accounts/addressBook.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/noCreditCard", angularAMD.route({
        templateUrl: 'views/accounts/noCreditCard.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/showCreditCard", angularAMD.route({
        templateUrl: 'views/accounts/showCreditCard.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/userAccounts", angularAMD.route({
        templateUrl: 'views/accounts/userAccounts.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/newSubAccount", angularAMD.route({
        templateUrl: 'views/accounts/newSubAccount.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/editSubAccount", angularAMD.route({
        templateUrl: 'views/accounts/editSubAccount.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/billingSummary", angularAMD.route({
        templateUrl: 'views/accounts/billingSummary.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/changePlan", angularAMD.route({
        templateUrl: 'views/accounts/changePlan.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/fulfillmentCost", angularAMD.route({
        templateUrl: 'views/accounts/fulfillmentCost.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/orderFulfillment", angularAMD.route({
        templateUrl: 'views/accounts/orderFulfillment.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/printSetup", angularAMD.route({
        templateUrl: 'views/accounts/printSetup.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/email", angularAMD.route({
        templateUrl: 'views/accounts/email.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/others", angularAMD.route({
        templateUrl: 'views/accounts/others.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/productsReport", angularAMD.route({
        templateUrl: 'views/accounts/productsReport.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/shipmentsReport", angularAMD.route({
        templateUrl: 'views/accounts/shipmentsReport.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/ordersReport", angularAMD.route({
        templateUrl: 'views/accounts/ordersReport.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    .when("/accounts/paymentsReport", angularAMD.route({
        templateUrl: 'views/accounts/paymentsReport.html', controller: 'Accounts', controllerUrl: 'controller/accounts/accounts'
    }))
    //Logout routing
    .when("/logout", angularAMD.route({
        templateUrl: 'views/login/index.html', controller: 'Login', controllerUrl: 'controller/login/index'
    }))
    //404 routing
    .when("/404", angularAMD.route({
        templateUrl: 'views/shared/404.html', controller: 'Base', controllerUrl: 'controller/base'
    }))
    //403 routing
    .when("/403", angularAMD.route({
        templateUrl: 'views/shared/403.html', controller: 'Base', controllerUrl: 'controller/base'
    }))
    //Default routing
    .otherwise({redirectTo: "/404"});
  });
  app.run(function($rootScope, ngProgress, $location, $window, $cookieStore) {
      $rootScope.$on('$routeChangeStart', function() {
          if($location.path() == '/404')
              $rootScope.noPage = true;
          else if($location.path() == '/403')
              $rootScope.unAuthorized = true;
          else if($location.path() == '/login')
              $rootScope.isLoggedIn = false;
        ngProgress.start();
      });

      $rootScope.$on('$routeChangeSuccess', function(event, next) {
        $rootScope.notificationMessages = [];
        ngProgress.complete();
        $window.scrollTo(0,0);
      });
      $rootScope.$on('$routeChangeError', function() {
        ngProgress.complete();
      });
      
    });
  return angularAMD.bootstrap(app);
});

