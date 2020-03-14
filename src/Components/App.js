import React, { useEffect, useState } from 'react';
import Time from "./Time";
import NextAlarm from "./NextAlarm";
import CurrentDate from "./CurrentDate";
import {min} from 'date-fns'
import {convertAlarmScheduleToDates, isAlarmNow, getManualAlarmDate} from "../helpers/timeHelpers";
import AlarmButton from "./AlarmButton";
import Menu from "./Menu";
import AlarmOverride from "./AlarmOverride";
const electron = window.require('electron');

function App() {
    // 0 = sunday
    const alarmSchedule = {
        "0": "18:27",
        "1": "12:36",
        "2": "7:30",
        "3": "7:30",
        "4": "7:30",
        "5": null,
        "6": "12:00"
    };

    const onMessage = (event, message) => {
        console.log(message);
    };

    useEffect(() => {
        electron.ipcRenderer.on('scheduleUpdate', onMessage);

        return () => {
            electron.ipcRenderer.removeListener('scheduleUpdate', onMessage)
        }
    }, []);

    const sendSqsMessage = (topic, message) => {
        electron.ipcRenderer.send('sqsMessage', {topic, message});
    };

    const otherButtons = [
        {
            label: 'Tesla Pre-heat',
            onClick: () => sendSqsMessage('commands/tesla/preheat', 'on'),
            closeMenuOnClick: true
        }
    ];

    const [currentDate, setCurrentDate] = useState(new Date());
    const [nextAlarm, setNextAlarm] = useState(min(convertAlarmScheduleToDates(alarmSchedule)));
    const [alarmActive, setAlarmActive] = useState(false);
    const [alarmCooldown, setAlarmCooldown] = useState(true);
    const [alarmOverrideActive, setAlarmOverrideActive] = useState(false);
    const [lightsOn, setLightsOn] = useState(false);

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

    useEffect(() => {
        const checkAlarm = () => {
            if (!alarmActive && alarmCooldown) {
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
    }, [alarmActive, setAlarmCooldown, alarmCooldown, alarmSchedule, nextAlarm, alarmOverrideActive]);

    return (
        <div className="app">
            <CurrentDate now={currentDate} />
            <div className="dragger" />
            <Time time={currentDate} />
            {alarmActive ?
                <>
                    <AlarmButton onClick={onAlarmButtonClick} />
                    <audio autoPlay src="alarmsound.mp3" />
                </>
                    : <NextAlarm alarmDate={nextAlarm} />
            }
            {alarmOverrideActive ? <AlarmOverride /> : ''}
            <Menu otherButtons={otherButtons} setAlarm={setAlarm} alarmOverrideActive={alarmOverrideActive} disableAlarmOverride={disableAlarmOverride} />
            <div onClick={toggleLight} className={`light_icon ${lightsOn ? 'light_icon_on' : 'light_icon_off'}`}>
            </div>
        </div>
    );
}

export default App;
