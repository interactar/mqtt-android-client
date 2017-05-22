//Store module with angular-model and angular-collection
var storeModule = angular.module('storeModule', ['ng', 'LocalForageModule']);
storeModule.provider('$store', function(){
  var store = {};
  this.config = function(config) {
    if(!angular.isObject(config)) {
      throw new Error('The config parameter should be an object');
    }
    angular.extend(store, config);
  };

  this.$get = ['$localForage','AnomalyCollection', function($localForage, AnomalyCollection) {
    console.log(AnomalyCollection);
    $localForage.getItem('session').then(function(data){
      if(!data)
        $localForage.setItem('session', []);
    });
    return store;
  }];
}).config(['$localForageProvider', function($localForageProvider){
  $localForageProvider.config({
    driver      : [ localforage.INDEXEDDB, localforage.WEBSQL ],
    name        : 'egimobile',
    version     : 1.0,
    storeName   : 'api',
    description : 'egimobile database for persistence purpouses'
  });
}]);
