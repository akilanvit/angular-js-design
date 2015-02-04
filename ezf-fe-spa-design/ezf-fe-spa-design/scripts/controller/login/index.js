define(['app', 'utility/messages'], function (app, messages) {
    app.controller('Login', function ($scope, $bus, ngProgress, $location, $http, toaster, $rootScope, $cookieStore) {
        $scope.init = function () {
            ngProgress.complete();
            if ($location.path() == '/logout') {
                $bus.fetch({
                    name: 'logout.refresh',
                    api: 'logout',
                    params: null,
                    data: JSON.stringify({
                        body: 'logout'
                    })
                })
                    .done(function (success) {
                        $rootScope.isLoggedIn = false;
                        toaster.pop("success", messages.logoutSuccess);
                    }).fail(function (error) {
                        toaster.pop("error", messages.logoutError);
                    });
            }
        };
        $scope.submit = function () {
            var data = {
                body: JSON.stringify({
                    username: $scope.email,
                    password: $scope.password
                })
            }
            $bus.fetch({
                name: 'login.refresh',
                api: 'login',
                params: null,
                data: JSON.stringify(data)
            })
                .done(function (success) {
                    toaster.pop("success", messages.loginSuccess);
                    $location.path('home');
                }).fail(function (error) {
                    toaster.pop("error", messages.invalidCredential);
                });
        };
    });
});