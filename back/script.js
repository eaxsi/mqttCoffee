// Quick and dirty coffee monitor fix
// Eero Silfverberg 2018

var http = require('http');
var mqtt = require('mqtt');
var fs = require('fs');
var path = require('path');

var MQTT_HOST = process.env.MQTT_HOST;
var client  = mqtt.connect('mqtt://' + MQTT_HOST);

coffeeObj = {};

client.on('connect', function () {
  client.subscribe('sik/kiltahuone/kahvivaaka/#', function (err) {
    if (!err) {
      console.log("Connected to MQTT server!")
      //client.publish('presence', 'Hello mqtt')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  if (topic == 'sik/kiltahuone/kahvivaaka/cups') {
    coffeeObj.cups = message.toString();
  }
  if (topic == 'sik/kiltahuone/kahvivaaka/brewtime') {
    coffeeObj.brewtime = message.toString();
  }
  if (topic == 'sik/kiltahuone/kahvivaaka/brewing') {
    coffeeObj.brewing = message.toString();
  }

});


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
