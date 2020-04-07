require('dotenv').config();
const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const mqtt = require('mqtt');
const client  = mqtt.connect(process.env.MQTT_HOST, {
    username: process.env.MQTT_USERNAME, password: process.env.MQTT_PASSWORD
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

client.on('connect', function () {
    console.log('Mqtt connected');
    client.subscribe('events/tesla', function (err) {
        if (!err) {
            client.publish('events/debug', 'Nokklok listening to events/tesla');
        }
    });
    client.subscribe('events/nokklok/schedule', function (err) {
        if (!err) {
            client.publish('events/debug', 'Nokklok listening to events/nokklok/schedule');
        }
    });
    client.subscribe('thermo/update', function (err) {
        if (!err) {
            client.publish('events/debug', 'Nokklok listening to events/nokklok/schedule');
        }
    })
});

ipcMain.on('sqsMessage', (event, arg) => {
    const {topic, message} = arg;
    client.publish(topic, message);
});

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 480, frame: false, webPreferences: { nodeIntegration: true }});

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    client.on('message', function (topic, message) {
        switch (topic) {
            case 'events/tesla':
                mainWindow.webContents.send('teslaUpdate', message.toString());
                break;
            case 'thermo/update':
                mainWindow.webContents.send('thermoUpdate', message.toString());
                break;
            case 'events/nokklok/schedule':
                mainWindow.webContents.send('scheduleUpdate', message.toString());
                break;
        }
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});