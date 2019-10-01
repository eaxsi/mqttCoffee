// Quick and dirty coffee monitor fix
// Eero Silfverberg 2018

var http = require('http');
var mqtt = require('mqtt');
var fs = require('fs');
var path = require('path');

var MQTT_HOST = process.env.MQTT_HOST;
var MQTT_USER = process.env.MQTT_USER
var MQTT_PASSWD = process.env.MQTT_PASSWD

var client  = mqtt.connect('mqtt://' + MQTT_HOST,
  {
    clientId: 'alternativeCoffee' + Math.floor((Math.random()*1000)),
    username: MQTT_USER,
    password: MQTT_PASSWD,
  });

coffeeObj = {};

client.on('connect', function () {
  client.subscribe('sik/kiltahuone/kahvivaaka/#', function (err) {
    if (!err) {
      console.log("Connected to MQTT server!")
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  if (isNaN(message.toString())) {
    // message is garbage
    errorSituation('?')
    console.log(message.toString())
  }
  else {
    if (topic == 'sik/kiltahuone/kahvivaaka/cups') {
      coffeeObj.cups = message.toString()
    }
    if (topic == 'sik/kiltahuone/kahvivaaka/brewtime') {
      coffeeObj.brewtime = message.toString()
    }
    if (topic == 'sik/kiltahuone/kahvivaaka/brewing') {
      coffeeObj.brewing = message.toString()
    }
  }

});
client.on('offline', function(){
  console.log('No MQTT connection!')
  errorSituation('MQTT error')
})

function errorSituation(errorName) {
  coffeeObj.cups = errorName
  coffeeObj.brewtime = '0'
  coffeeObj.brewing = '0'
}

http.createServer(function (req, res) {

  if (req.url == '/api/' || req.url == '/api') {
    res.writeHead(200, {
        'Content-Type': 'text/json',
        'Access-Control-Allow-Origin': '*'
    });
    res.write(JSON.stringify(coffeeObj));
    res.end();
  }
  else {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write('Not found');
    res.end();
  }

}).listen(8080);
