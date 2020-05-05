import React from 'react';
import TimeKeeper from "react-timekeeper";

function TimePicker({ timePickerActionDay, onTimeSelect, timePickerAction, disableAlarmForDay }) {

    console.log(timePickerAction, timePickerActionDay);
    if (timePickerAction === 'schedule' && !timePickerActionDay) {
        return null;
    }
    console.log('timePickerActionDay', timePickerActionDay);
    const renderDisableButton = () => {
        if (timePickerAction === 'schedule' && timePickerActionDay) {
            return <div
                onClick={() => disableAlarmForDay()}
                className={`schedule_btn_removeday`}
            >
                Disable alarm for {timePickerActionDay.day}
            </div>
        }
        return null;
    };

    return (
        <div className="timePicker">
            <TimeKeeper
                switchToMinuteOnHourSelect
                closeOnMinuteSelect
                hour24Mode
                time={timePickerActionDay && timePickerActionDay.time !== '-' ? timePickerActionDay.time : undefined}
                onDoneClick={onTimeSelect}
            />
            {renderDisableButton()}
        </div>
    );
}

export default TimePicker;
