/* global angular, localforage */

//Store module with angular-model and angular-collection
var storeModule = angular.module('storeModule', [
  'ng',
  'LocalForageModule',
  'app.models'
])
.config(['$localForageProvider', function($localForageProvider){
  $localForageProvider.config({
    driver      : [ localforage.INDEXEDDB, localforage.WEBSQL ],
    name        : 'mqtt-mobile',
    version     : 1.0,
    storeName   : 'api',
    description : 'mqtt-mobile database'
  });
}]);

storeModule.provider('$store', function(){
  var store = {};
  this.config = function(config) {
    if(!angular.isObject(config)) {
      throw new Error('The config parameter should be an object');
    }
    angular.extend(store, config);
  };

  this.$get = ['$localForage', 'MessageCollection', function($localForage, MessageCollection) {
    store.actuators = new MessageCollection();
    store.sensors   = new MessageCollection();
    store.sesssion  = null;
    store.config    = null;
    store.config = {
      "mqttServer":{
        "url": "ws://192.168.0.14",
        //"url": "ws://104.41.60.94",
        "port": 3000,
        "protocolId": "MQTT"
      }
    };

    $localForage.getItem('session').then(function(data){
      if(!data)
        $localForage.setItem('session', null);
      else
        store.session = data;
    });

    //session handlers
    store.saveSession = function(session){
      store.session = session;
      return $localForage.setItem('session', session);
    };

    store.getSession = function(){
      return $localForage.getItem('session');
    };

    store.removeSession = function(){
      store.session = null;
      return $localForage.removeItem('session');
    };

    return store;
  }];
});
