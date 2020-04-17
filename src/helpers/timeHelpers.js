import {parse, setDay, isFuture, add, isThisMinute, format, differenceInMinutes} from "date-fns";

const convertAlarmScheduleToDates = alarmSchedule => {
    const result = [];
    Object.keys(alarmSchedule).forEach(function (dayNr) {
        if (alarmSchedule[dayNr]) {
            result.push(convertAlarmScheduleTimeToDate(dayNr, alarmSchedule[dayNr]))
        }
    });
    return result;
};

const convertAlarmScheduleToArrayWithWeekdays = alarmSchedule => {
    const result = [];
    Object.keys(alarmSchedule).forEach(function (dayNr) {
        if (alarmSchedule[dayNr]) {
            result.push({
                day: format(convertAlarmScheduleTimeToDate(dayNr, alarmSchedule[dayNr]), 'EEEE'),
                time: alarmSchedule[dayNr],
            });
        } else {
            result.push({
                day: format(convertAlarmScheduleTimeToDate(dayNr, "0:00"), 'EEEE'),
                time: '-',
            });
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

const getManualAlarmDate = time => {
    const result = parse(time, 'H:mm', new Date());
    if (isFuture(result)) {
        return result;
    } else {
        return add(result, {days: 1});
    }
};

const isAlarmNow = (nextAlarm) => {
    return isThisMinute(nextAlarm);
};

const isPreAlarmNow = (nextAlarm) => {
    return differenceInMinutes(nextAlarm, new Date()) < 16;
};

export {
    convertAlarmScheduleTimeToDate,
    convertAlarmScheduleToDates,
    isAlarmNow,
    isPreAlarmNow,
    getManualAlarmDate,
    convertAlarmScheduleToArrayWithWeekdays
};
