/* global angular, mqtt */
angular.module('app.services', [])
/**
*Login service for standard user and password login
**/
.service('authService', ['$q', '$store', 'basicLogin', function($q, $store, basicLogin) {
  var authService = {
    login : function(provider, options){
      var deferred = $q.defer();
      var loginStrategy;
      switch (provider) {
        case 'basic':
          loginStrategy = basicLogin;
          break;
      }

      loginStrategy(options).then(function(session){
        if(session){
          deferred.resolve();
        }else{
          deferred.reject("No session created");
        }
      }).catch(function(e){
        deferred.reject(e);
      });

      return deferred.promise;
    },
    isAuthenticated: function(){
      return $store.getSession();
    },
    logout: function(){
      return $store.removeSession();
    }
  };
  return authService;
}])
/**
*Basic Login Service
**/
.service('basicLogin', ['$q', '$store', 'MessageModel', function($q, $store, MessageModel) {
  var basicLogin = function(options){
    var deferred = $q.defer();
    var mqttServer = $store.config.mqttServer;
    var username = options.username;
    var password = options.password;
    var Client = $store.mqttClient = mqtt.connect(mqttServer.url + ":" + mqttServer.port, {
      username: username,
      password: password,
      protocolId: mqttServer.protocolId,
      clientId: Date.now() + ':' + username
    });

    Client.subscribe("users/"+username+"/#");

    Client.on("connect", function(){
      console.log("Succesfully conected to mqtt broker");

      //Requesting to all devices to report himself to the mqtt broker
      console.log("Publishing to users/%s/report", username);
      Client.publish("users/"+username+"/report", "gooby pls!");

      $store.saveSession({
        username:  username,
        password: password,
        timestamp: Date.now()
      });

      deferred.resolve($store.session);
    });

    Client.on("error", function(){
      console.log("Error while conecting to mqtt-server");
      Client.end();
      deferred.reject("Not authorized");
    });

    Client.on("message", function (topic, payload){
      console.log("New incoming message: ", [topic, payload].join(": "));
      //making sense of the recived message (topic and payload)
      var route = topic.split("/");
      try{
        payload = JSON.parse(payload);
      }catch(e){
        payload = {"origin": "unknown", "value": 0};//null;
      }

      var message = new MessageModel({
        id       : route[2] + ":" +route[4], //deviceId + type
        username : route[1], //username
        deviceId : route[2], //device id
        type     : route[3], //sensor, actuator, register
        name     : route[4], //sensor, actuator or device alias (temperature, relay1, server-room)
        data     : payload  //payload recived
      });

      switch (message.type) {
        case 'sensor':
          $store.sensors.add(message, {merge: true});
          break;
        case 'actuator':
          $store.actuators.add(message, {merge: true});
          break;
        default:
          console.log("unknown message type %s", message.type);
      }
    });

    return deferred.promise;
  };

  return basicLogin;
}]);
