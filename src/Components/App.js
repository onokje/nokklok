import React, { useEffect, useState, useRef } from 'react';
import Time from "./Time";
import NextAlarm from "./NextAlarm";
import Header from "./Header";
import {min} from 'date-fns'
import {convertAlarmScheduleToDates, isAlarmNow, getManualAlarmDate} from "../helpers/timeHelpers";
import AlarmButton from "./AlarmButton";
import Menu from "./Menu";
import AlarmOverride from "./AlarmOverride";
import Websocket from "react-websocket";
import Overlay from "./Overlay";
const electron = window.require('electron');

function App() {

    const [alarmSchedule, setAlarmSchedule] = useState({
        "0": "18:27",
        "1": "12:36",
        "2": "7:30",
        "3": "7:30",
        "4": "7:30",
        "5": null,
        "6": "12:00"
    });     // 0 = sunday
    const [currentDate, setCurrentDate] = useState(new Date());
    const [nextAlarm, setNextAlarm] = useState(min(convertAlarmScheduleToDates(alarmSchedule)));
    const [alarmActive, setAlarmActive] = useState(false);
    const [alarmCooldown, setAlarmCooldown] = useState(true);
    const [alarmOverrideActive, setAlarmOverrideActive] = useState(false);
    const [alarmEnabled, setAlarmEnabled] = useState(true);
    const [lightsOn, setLightsOn] = useState(false);
    const [teslaData, setTeslaData] = useState(null);
    const [lastTeslaUpdate, setLastTeslaUpdate] = useState(null);
    const [thermoData, setThermoData] = useState(null);
    const [lastThermoUpdate, setLastThermoUpdate] = useState(null);
    const [websocketConnected, setwebsocketConnected] = useState(false);
    const refWebsocket = useRef(null);
    const [lightLevel, setLightLevel] = useState(10);

    const onTeslaEvent = (event, message) => {
        setTeslaData(JSON.parse(message));
        setLastTeslaUpdate(new Date());
    };

    const onScheduleUpdate = (event, message) => {
        setAlarmSchedule(JSON.parse(message));
    };

    const onThermoUpdate = (event, message) => {
        setThermoData(JSON.parse(message));
        setLastThermoUpdate(new Date());
    };

    const sendSqsMessage = (topic, message) => {
        electron.ipcRenderer.send('sqsMessage', {topic, message});
    };

    const otherButtons = [
        {
            label: alarmEnabled ? 'Disable all alarms' : 'Enable all alarms',
            onClick: () => setAlarmEnabled(!alarmEnabled),
            closeMenuOnClick: true
        },
        {
            label: 'Tesla Pre-heat',
            onClick: () => sendSqsMessage('commands/tesla/preheat', 'on'),
            closeMenuOnClick: true
        },
    ];

    const onAlarmButtonClick = () => {
        setAlarmActive(false);
        setAlarmOverrideActive(false);
        setNextAlarm(min(convertAlarmScheduleToDates(alarmSchedule)));
    };

    const toggleLight = () => {
        setLightsOn(!lightsOn);
    };

    const setAlarm = (time) => {
        const manualAlarmDate = getManualAlarmDate(time);
        console.log(manualAlarmDate);
        setAlarmOverrideActive(true);
        setNextAlarm(manualAlarmDate);
    };

    const disableAlarmOverride = () => {
        setAlarmOverrideActive(false);
        setNextAlarm(min(convertAlarmScheduleToDates(alarmSchedule)));
    };

    const onWebSocketMessage = (data) => {
        data = JSON.parse(data);
        if (data.lightsensor) {
            setLightLevel(data.lightsensor);
        }
    };

    useEffect(() => {
        const checkAlarm = () => {
            if (!alarmActive && alarmCooldown && alarmEnabled) {
                if (isAlarmNow(nextAlarm)) {
                    console.log('Alarm!');
                    setAlarmActive(true);
                    setAlarmCooldown(false);
                    setTimeout(() => {
                        setAlarmCooldown(true);
                    }, 61000);
                }
            }
        };

        const timerSecond = setInterval(() => {
            setCurrentDate(new Date());
            checkAlarm();
        }, 1000);
        const timerMinute = setInterval(() => {
            if (!alarmOverrideActive) {
                setNextAlarm(min(convertAlarmScheduleToDates(alarmSchedule)));
            }
        }, 60000);
        return () => { // Return callback to run on unmount.
            clearInterval(timerSecond);
            clearInterval(timerMinute);
        };
    }, [alarmActive, setAlarmCooldown, alarmCooldown, alarmSchedule, nextAlarm, alarmOverrideActive, alarmEnabled]);

    useEffect(() => {
        electron.ipcRenderer.on('scheduleUpdate', onScheduleUpdate);
        electron.ipcRenderer.on('teslaUpdate', onTeslaEvent);
        electron.ipcRenderer.on('thermoUpdate', onThermoUpdate);


        return () => {
            electron.ipcRenderer.removeListener('scheduleUpdate', onScheduleUpdate);
            electron.ipcRenderer.removeListener('teslaUpdate', onTeslaEvent);
            electron.ipcRenderer.removeListener('thermoUpdate', onThermoUpdate);
        }
    }, []);

    const opacity =  lightLevel / 10;

    return (
        <div className="app" style={{ opacity }}>
            <Header
                now={currentDate}
                teslaData={teslaData}
                lastTeslaUpdate={lastTeslaUpdate}
                thermoData={thermoData}
                lastThermoUpdate={lastThermoUpdate}
            />
            <div className="dragger" />
            <Time time={currentDate} />
            {alarmActive ?
                <>
                    <AlarmButton onClick={onAlarmButtonClick} />
                    <audio autoPlay src="alarmsound.mp3" />
                </>
                    : <NextAlarm alarmDate={nextAlarm} alarmEnabled={alarmEnabled} />
            }
            {alarmOverrideActive ? <AlarmOverride /> : ''}
            <Menu
                otherButtons={otherButtons}
                setAlarm={setAlarm}
                alarmOverrideActive={alarmOverrideActive}
                disableAlarmOverride={disableAlarmOverride}
                alarmSchedule={alarmSchedule}
            />
            <div onClick={toggleLight} className={`light_icon ${lightsOn ? 'light_icon_on' : 'light_icon_off'}`}>
            </div>
            <Websocket
                url='ws://192.168.2.86:1880/ws/nokklok'
                onMessage={onWebSocketMessage}
                ref={Websocket => {
                    refWebsocket.current = Websocket;
                }}
                onOpen={() => {
                    setwebsocketConnected(true);
                }}
                onClose={() => {
                    setwebsocketConnected(false);
                }}
            />
        </div>
    );
}

export default App;
