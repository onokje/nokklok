import React, { useEffect, useState } from 'react';
import Time from "./Time";
import NextAlarm from "./NextAlarm";
import CurrentDate from "./CurrentDate";
import {min} from 'date-fns'
import {convertAlarmScheduleToDates, isAlarmNow} from "../helpers/timeHelpers";
import AlarmButton from "./AlarmButton";
import Menu from "./Menu";

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
    const [alarmEnabled, setAlarmEnabled] = useState(true);

    const onAlarmButtonClick = () => {
        setAlarmActive(false);
        setNextAlarm(min(convertAlarmScheduleToDates(alarmSchedule)));
    };

    useEffect(() => {
        const checkAlarm = () => {
            console.log('alarmEnabled', alarmEnabled, 'alarmActive', alarmActive);

            if (!alarmActive && alarmEnabled) {
                if (isAlarmNow(nextAlarm)) {
                    console.log('Alarm!');
                    setAlarmActive(true);
                    setAlarmEnabled(false);
                    setTimeout(() => {
                        setAlarmEnabled(true);
                    }, 61000);
                }

            }
        };

        const timerSecond = setInterval(() => {
            setCurrentDate(new Date());
            checkAlarm();
        }, 1000);
        const timerMinute = setInterval(() => {
            setNextAlarm(min(convertAlarmScheduleToDates(alarmSchedule)))
        }, 60000);
        return () => { // Return callback to run on unmount.
            clearInterval(timerSecond);
            clearInterval(timerMinute);
        };
    }, [alarmActive, alarmEnabled, alarmSchedule, nextAlarm]);

    return (
        <div className="app">

            <CurrentDate now={currentDate} />
            <Time time={currentDate} />
            {alarmActive ? <AlarmButton onClick={onAlarmButtonClick} /> : <NextAlarm alarmDate={nextAlarm} />}
            <Menu />
        </div>
    );
}

export default App;
