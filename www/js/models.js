/*global angular, ampersandModel, ampersandCollection*/

/**
*Collection and Models Services
**/

angular.module('app.models', [])
.factory('MessageModel', function(){
  return ampersandModel.extend({
    props:{
      id       : 'string', //device id + type
      username : 'string', //username
      deviceId : 'string', //device id
      type     : 'string', //sensor, actuator, register
      name     : 'string', //sensor, actuator or device alias (temperature, relay1, server-room)
      data     : 'any'     //payload recived (JSON object)
    },
    derived:{
      class:{
        deps: ['id','type','data', 'name'],
        fn: function(){
          var actuatorClass = "";
          if(this.type == 'actuator'){
            if(this.data.value)
              actuatorClass = "actuator-on";
            else
              actuatorClass = "actuator-off";
          }

          if(this.type == 'sensor'){
            if(this.name == 'temperature')
              actuatorClass = "temperature-icon icon ion-thermometer";

            if(this.name == 'humidity')
              actuatorClass = "temperature-icon icon ion-waterdrop";
          }
          return actuatorClass;
        }
      },
      state:{
        deps: ['id','type','data'],
        fn: function(){
          var actuatorState = "";
          if(this.type == 'actuator'){
            if(this.data.value)
              actuatorState = "On";
            else
              actuatorState = "Off";
          }

          if(this.type == 'sensor'){
            if(this.name == 'temperature')
              actuatorState = "°";
            if(this.name == 'humidity')
              actuatorState = "";
          }
          return actuatorState;
        }
      }
    }
  });
})
.factory('MessageCollection', ['MessageModel', function(MessageModel){
  return ampersandCollection.extend({
    model: MessageModel
  });
}]);
