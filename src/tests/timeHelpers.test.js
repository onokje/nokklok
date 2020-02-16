import {convertAlarmScheduleTimeToDate, convertAlarmScheduleToDates, isAlarmNow} from "../helpers/timeHelpers";
import { format } from 'date-fns'

it('converts a single alarm schedule day to a date obj', () => {
    const result = convertAlarmScheduleTimeToDate(1, "8:00");

    console.log(format(result, 'eeee d MMMM yyyy, H:mm'));

});

it('converts a alarm schedule to an array of date objects', () => {
    const result = convertAlarmScheduleToDates({
        "0": "8:00",
        "1": "8:00",
        "2": "7:30",
        "3": "7:30",
        "4": "7:30",
        "5": null,
        "6": null
    });
    console.log(result);
    expect(result).toHaveLength(5);
});

it('checks if alarm is now', () => {

    const result = convertAlarmScheduleTimeToDate(0, "15:43");

    console.log(isAlarmNow(result));

});