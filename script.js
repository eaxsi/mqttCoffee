// Quick and dirty coffee monitor fix
// Eero Silfverberg 2018

var http = require('http');
var mqtt = require('mqtt');
var fs = require('fs');
var path = require('path');

var client  = mqtt.connect('mqtt://mqtt.sik.party')

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

  });

  fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err; 
    }     

  http.createServer(function (req, res) {

    if (req.url == '/api') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(JSON.stringify(coffeeObj));
        res.end();
    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(html);
        res.end();
    }

  }).listen(8080);
});