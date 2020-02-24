import React, { useEffect, useState } from 'react';
import Time from "./Time";
import NextAlarm from "./NextAlarm";
import CurrentDate from "./CurrentDate";
import {min} from 'date-fns'
import {convertAlarmScheduleToDates, isAlarmNow, getManualAlarmDate} from "../helpers/timeHelpers";
import AlarmButton from "./AlarmButton";
import Menu from "./Menu";
import AlarmOverride from "./AlarmOverride";

function App() {

    const alarmSchedule = {
        "0": "18:27",
        "1": "12:36",
        "2": "7:30",
        "3": "7:30",
        "4": "7:30",
        "5": null,
        "6": null
    };


    const [currentDate, setCurrentDate] = useState(new Date());
    const [nextAlarm, setNextAlarm] = useState(min(convertAlarmScheduleToDates(alarmSchedule)));
    const [alarmActive, setAlarmActive] = useState(false);
    const [alarmCooldown, setAlarmCooldown] = useState(true);
    const [alarmOverrideActive, setAlarmOverrideActive] = useState(false);

    const onAlarmButtonClick = () => {
        setAlarmActive(false);
        setAlarmOverrideActive(false);
        setNextAlarm(min(convertAlarmScheduleToDates(alarmSchedule)));
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
            //console.log('alarmEnabled', alarmEnabled, 'alarmActive', alarmActive);

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
    }, [alarmActive, setAlarmCooldown, alarmSchedule, nextAlarm, alarmOverrideActive]);

    return (
        <div className="app">
            <CurrentDate now={currentDate} />
            <Time time={currentDate} />
            {alarmActive ? <AlarmButton onClick={onAlarmButtonClick} /> : <NextAlarm alarmDate={nextAlarm} />}
            {alarmOverrideActive ? <AlarmOverride /> : ''}
            <Menu setAlarm={setAlarm} alarmOverrideActive={alarmOverrideActive} disableAlarmOverride={disableAlarmOverride} />
        </div>
    );
}

export default App;
