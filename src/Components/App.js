import React, { useEffect, useState, useRef } from 'react';
import Time from "./Time";
import NextAlarm from "./NextAlarm";
import Header from "./Header";
import {min} from 'date-fns'
import {convertAlarmScheduleToDates, isAlarmNow, isPreAlarmNow, getManualAlarmDate} from "../helpers/timeHelpers";
import AlarmButton from "./AlarmButton";
import Menu from "./Menu";
import ExtraMessages from "./ExtraMessages";
import Websocket from "react-websocket";
const electron = window.require('electron');

const { WEBSOCKET_URL, MEDIA_PRE_ALARM, MEDIA_ALARM } = electron.remote.getGlobal('process').env;

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
    const [preAlarmActive, setPreAlarmActive] = useState(false);
    const [lightsOn, setLightsOn] = useState(false);
    const [teslaData, setTeslaData] = useState(null);
    const [lastTeslaUpdate, setLastTeslaUpdate] = useState(null);
    const [thermoData, setThermoData] = useState(null);
    const [lastThermoUpdate, setLastThermoUpdate] = useState(null);
    // TODO: display error icon when websocket is not connected
    const [websocketConnected, setwebsocketConnected] = useState(false);
    const refWebsocket = useRef(null);
    const [lightLevel, setLightLevel] = useState(10);

    const onTeslaEvent = (event, message) => {
        setTeslaData(JSON.parse(message));
        setLastTeslaUpdate(new Date());
    };

    const onScheduleUpdate = (event, message) => {
        console.log('update', message);
        setAlarmSchedule(message);
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
        setPreAlarmActive(false);
        sendSqsMessage('events/nokklok/alarm', 'alarmEnd');
        setNextAlarm(min(convertAlarmScheduleToDates(alarmSchedule)));
    };

    const toggleLight = () => {
        setLightsOn(!lightsOn);
        sendSqsMessage('commands/lights/bed1', (!lightsOn).toString());
    };

    const setAlarm = (time) => {
        const manualAlarmDate = getManualAlarmDate(time);
        console.log(manualAlarmDate);
        setAlarmOverrideActive(true);
        setNextAlarm(manualAlarmDate);
    };

    const disableAlarmOverride = () => {
        setAlarmOverrideActive(false);
        setPreAlarmActive(false);
        setNextAlarm(min(convertAlarmScheduleToDates(alarmSchedule)));
    };

    const onWebSocketMessage = (data) => {
        data = JSON.parse(data);
        if (data.lightsensor) {
            setLightLevel(data.lightsensor);
        }
    };

    const saveAlarmSchedule = (schedule) => {
        setAlarmSchedule(schedule);
        electron.ipcRenderer.send('saveSchedule', schedule);
    };

    useEffect(() => {
        const checkAlarm = () => {
            if (!alarmActive && alarmCooldown && alarmEnabled) {
                if (isAlarmNow(nextAlarm)) {
                    console.log('Alarm!');
                    sendSqsMessage('events/nokklok/alarm', 'alarm');
                    setAlarmActive(true);
                    setAlarmCooldown(false);
                    setTimeout(() => {
                        setAlarmCooldown(true);
                    }, 61000);
                }
            }
        };

        const checkPreAlarm = () => {
            if (!preAlarmActive && alarmCooldown && alarmEnabled) {
                if (isPreAlarmNow(nextAlarm)) {
                    console.log('Pre-Alarm!');
                    sendSqsMessage('events/nokklok/alarm', 'preAlarm');
                    setPreAlarmActive(true);
                }
            }
        };

        const timerSecond = setInterval(() => {
            setCurrentDate(new Date());
            checkAlarm();
            checkPreAlarm();
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
    }, [alarmActive, setAlarmCooldown, alarmCooldown, alarmSchedule, nextAlarm, alarmOverrideActive, alarmEnabled, preAlarmActive]);

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
            {preAlarmActive &&
                <audio autoPlay src={MEDIA_PRE_ALARM} />
            }
            {alarmActive ?
                <>
                    <AlarmButton onClick={onAlarmButtonClick} />
                    <audio autoPlay src={MEDIA_ALARM} />
                </>
                    : <NextAlarm alarmDate={nextAlarm} alarmEnabled={alarmEnabled} />
            }
            <ExtraMessages alarmOverride={alarmOverrideActive} preAlarm={preAlarmActive} />
            <Menu
                otherButtons={otherButtons}
                setAlarm={setAlarm}
                alarmOverrideActive={alarmOverrideActive}
                disableAlarmOverride={disableAlarmOverride}
                alarmSchedule={alarmSchedule}
                saveAlarmSchedule={saveAlarmSchedule}
            />
            <div onClick={toggleLight} className={`light_icon ${lightsOn ? 'light_icon_on' : 'light_icon_off'}`}>
            </div>
            <Websocket
                url={WEBSOCKET_URL}
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
