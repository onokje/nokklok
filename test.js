require('dotenv').config();
const mqtt = require('mqtt');
const client  = mqtt.connect(process.env.MQTT_HOST, {
    username: process.env.MQTT_USERNAME, password: process.env.MQTT_PASSWORD
});

client.on('connect', function () {
    client.publish('events/nokklok/schedule', JSON.stringify({
        "0": "18:27",
        "1": "12:36",
        "2": "21:23",
        "3": null,
        "4": "7:50",
        "5": null,
        "6": "12:00"
    }));

});