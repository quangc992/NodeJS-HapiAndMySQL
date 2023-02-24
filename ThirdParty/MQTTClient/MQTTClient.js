/* Copyright (c) 2021-2022 Toriti Tech Team https://t.me/ToritiTech */

const fs = require('fs');
var mqtt = require('mqtt');
////MQTT Client
// var client  = mqtt.connect('mqtt://vtss-station-server.makefamousapp.com:10555')

////WS Client
// var client  = mqtt.connect('ws://vtss-station-server.makefamousapp.com:10777', {
//   wsOptions: {
//     host: "vtss-station-server.makefamousapp.com",
//     port: 10777
//   }
// })

//WSS Client
// var client  = mqtt.connect('wss://vtss-station-server.makefamousapp.com:10666', {
//   rejectUnauthorized: false
// })

client.on('connect', function () {
  console.log('connected');
  client.subscribe('RECORD_UPDATE_2', function (err) {
    console.log('Subcribed success');
  });
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  console.log(topic);
  client.end();
});

module.exports = {};
