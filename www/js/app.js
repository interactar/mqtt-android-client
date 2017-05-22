/* global angular, cordova, StatusBar */
angular.module('app', [
  'ionic',
  'app.controllers',
  'app.routes',
  'app.directives',
  'app.services',
  'app.models',
  'ngCordova',
  'storeModule'
])
.config(function($ionicConfigProvider, $sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['self']);
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('map', {
    url: '/',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  });
  $urlRouterProvider.otherwise("/");
})
.run(function($ionicPlatform, $state, $window, $store)
{
  var windowElement = angular.element($window);
  windowElement.on('beforeunload', function (event) {
    $state.go('login');
  });

  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});
