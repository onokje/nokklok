import React from 'react';

function ExtraMessages({ alarmOverride, preAlarm }) {

    return (
        <div className={`alarm_override`}>
            {alarmOverride && `Alarm override is active. `}
            {preAlarm && `Pre-alarm program is running. `}
        </div>
    );
}

export default ExtraMessages;
