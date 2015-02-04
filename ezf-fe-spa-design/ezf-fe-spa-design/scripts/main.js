require.config({
    baseUrl: "scripts",
    
    // alias libraries paths.  Must set 'angular'
    paths: {
        'angular': '../lib/angular/angular.min',
        'angular-route': '../lib/angular/angular-route.min',
        'angularAMD': '../lib/angular/angularAMD.min',
        'angular-cookies': '../lib/angular/angular-cookies.min',
        'angular-sanitize': '../lib/angular/angular-sanitize.min',
        'jquery': '../lib/jquery/jquery.min',
        'downloader': '../lib/downloader/jquery.fileDownload',
        'underscore': '../lib/underscore/underscore-min',
        'socketio': '../lib/socketio/socket.io',
        'ngProgress': '../lib/angular/ngProgress.min',
        'ngAnimate': '../lib/angular/angular-animate.min',
        'ngToaster': '../lib/angular/ngToaster.min',
        'bootstrap': '../lib/bootstrap/js/bootstrap.min',
        'datepicker': '../lib/datepicker/bootstrap-datepicker',
        'd3': '../lib/nvd3/d3.min',
        'nvd3': '../lib/nvd3/nv.d3.min',
        'angular-nvd3': '../lib/nvd3/angular-nvd3',
        'angular-validator': '../lib/angular/angular-validator.min',
        'ng-multiselect' : '../lib/angular/ng-multiselect',
        'g-map':'../lib/gmap/gmap',
        'app': 'router/ng-route'
    },
    
    // Add angular modules that does not support AMD out of the box, put it in a shim
    shim: {
        'angularAMD': ['angular'],
        'angular-route': ['angular'],
        'angular-cookies': ['angular'],
        'angular-sanitize': ['angular'],
        'socketio':{exports:'io'},
        'ngProgress':['angular'],
        'ngAnimate':['angular'],
        'ngToaster':['angular'],
        'ng-multiselect':['angular'],
        'angular-validator':['angular'],
        'bootstrap':['jquery'],
        'downloader':['jquery'],
        'g-map':{
          exports: 'google'
        },
        'datepicker':{
            deps: ['jquery', 'bootstrap'],
    exports: '$.fn.datepicker'
        },
        'nvd3':{
          exports: 'nv',
          deps: ['global']
        },
        'underscore': {
          exports: '_'
        },
    },

    //urlArgs: "version=1.0",
    //urlArgs: "version=1.0" + (+new Date),
    
    // kick start application
    deps: ['app']
});
define('global', ['d3', 'underscore', 'datepicker'], function(d3, _, datepicker) {
      window.d3 = d3;
      window._ = _;
      window.datepicker = datepicker
    });