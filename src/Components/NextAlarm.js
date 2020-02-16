import React from 'react';
import {format, formatDistanceStrict, differenceInHours} from 'date-fns'

function NextAlarm({ alarmDate }) {

    const sleepIn = (differenceInHours(alarmDate, new Date()) > 24);
    if (sleepIn) {
        return (
            <div className={`next_alarm`}>
                Lekker uitslapen!
            </div>
        );
    }

    return (
        <div className={`next_alarm`}>
            <span className="alarm_icon" />
            <span>{format(alarmDate, 'eee H:mm')}</span>
            <span className="distance">in {formatDistanceStrict(new Date(), alarmDate)}</span>
        </div>
    );
}

export default NextAlarm;
