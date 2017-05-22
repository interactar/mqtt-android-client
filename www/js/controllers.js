/*global angular*/
angular.module('app.controllers', [])

//Home Controller
.controller('homeCtrl', ['$scope', '$stateParams', '$store', function($scope, $stateParams, $store) {
  $scope.sensors = $store.sensors.models;

  $store.sensors.on('add',function(){
    $scope.sensors = $store.sensors.models;
    $scope.$apply();
  });

  $store.sensors.on('change',function(){
    $scope.sensors = $store.sensors.models;
  });

  $scope.actuators = $store.actuators.models;

  $store.actuators.on('add',function(){
    $scope.actuators = $store.actuators.models;
    $scope.$apply();
  });

  $store.actuators.on('change',function(){
    $scope.actuators = $store.actuators.models;
  });

  $scope.setActuatorValue = function(id){
    var session = $store.session;
    var actuator = $store.actuators.get(id);
    actuator.data = {value: !actuator.data.value, origin: actuator.data.origin};
    var topic = "users/"+session.username+"/"+actuator.deviceId+"/write/actuator/"+actuator.name;
    var payload = '{"value": '+ actuator.data.value +'}';
    console.log("Publishing to %s with payload: %s", topic, payload);
    $store.mqttClient.publish(topic, payload);
  };
}])

//Login Controller
.controller('loginCtrl', ['$scope', '$state', 'authService', '$store',
function($scope, $state, authService, $store) {

  $scope.data = { username: '', password: '' };
  $scope.error = '';

  authService.isAuthenticated().then(function(session){
    if(session){
      authService.login('basic', session).then(function(){
        $state.go('home');
      }).catch(function(e){
        $state.go('login');
      });
    }
  });

  $scope.login = function(provider){
    authService.login(provider, $scope.data).then(function(){
      console.log("LOGED IN!");
      $state.go('home');
    }).catch(function(e){
      console.log("CONNECTION REJECTED!");
      $state.go('login');
    });
  };
}]);
