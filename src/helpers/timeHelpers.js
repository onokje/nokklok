import {parse, setDay, isFuture, add, isThisMinute} from "date-fns";

const convertAlarmScheduleToDates = alarmSchedule => {
    const result = [];
    Object.keys(alarmSchedule).forEach(function(dayNr) {
        if (alarmSchedule[dayNr]) {
            result.push(convertAlarmScheduleTimeToDate(dayNr, alarmSchedule[dayNr]))
        }
    });
    return result;
};

const convertAlarmScheduleTimeToDate = (dayNr, time) => {
    const result = setDay(parse(time, 'H:mm', new Date()), dayNr);
    if (isFuture(result)) {
        return result;
    } else {
        return add(result, {days: 7});
    }
};

const isAlarmNow = (nextAlarm) => {
    return isThisMinute(nextAlarm);
};

export {convertAlarmScheduleTimeToDate, convertAlarmScheduleToDates, isAlarmNow};
