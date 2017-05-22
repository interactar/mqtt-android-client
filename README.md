# MQTT #
Android Client In this repo you will found a basic implementation of the MQTT client mqttjs(https://github.com/mqttjs/MQTT.js) for reporting and acting over many esp devices with both sensors and actuators. This project is intended to serve as a guide for feature mobile and spa implementations, and not as a final product himself.

### Setup ###
This project uses Ionic Framework, so if you don't have it already installed, go to  http://ionicframework.com/getting-started/.
For building an apk you will also need to have the android sdk installed.
`git clone git@github.com:JuanMsanchez/mqtt-android-client.git`
`cd mqtt-android-client`
`npm install`
`bower install`
`ionic serve`

### MQTT topic structure ###

The root topic is "users". /users

Each user has his own domain under the root topic followed by his username. /user/alice

Each devices has his own id (ESP.getChipId()) and will be next to the username in the topic structure. /user/alice/12601668

Each device has sensors, actuators or both, in the case of the sensors, will be found under the "sensor" topic followed by an alias for each kind of sensor (humidity, temperature, luminosity). /user/alice/12601668/sensor/temperature

Each device actuator will be both listen and publishing to his alias(by default relay1, relay2) under the "actuator" domain. /user/alice/12601668/actuator/relay1

### Device/Client communication protocol ###

Each request must include the basic authorization data (username and password).

On a new client connection the client will request to each device from the user to report to the mqtt broker. /users/alice/report

On a "report" request each device will publish to the "register" topic. /users/alice/12601668/register

The client will subscribe to the user parent topic listening for all published data tho his child topics as a sensor or an actuator. /users/alice/#

The client will publish data to an actuator topic on every time a user requires it. /user/alice/12601668/actuator/relay1

### Payload schema ###

The sensors will publish data with this schema: { "value": float, "origin": string }

The actuators will publish and listen for this schema: { "value": boolean, "origin": string }
