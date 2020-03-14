require('dotenv').config();
const mqtt = require('mqtt');
const client  = mqtt.connect(process.env.MQTT_HOST, {
    username: process.env.MQTT_USERNAME, password: process.env.MQTT_PASSWORD
});

client.on('connect', function () {
    client.publish('test', 'testing 123');

});