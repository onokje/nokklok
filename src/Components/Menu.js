import React, {useState} from 'react';
import TimeKeeper from 'react-timekeeper';
import { convertAlarmScheduleToArrayWithWeekdays} from "../helpers/timeHelpers";
const electron = window.require('electron');

function Menu({ setAlarm, alarmOverrideActive, disableAlarmOverride, otherButtons, alarmSchedule, setAlarmSchedule, alarmEnabled }) {

    const [menuOpen, setMenuOpen] = useState(false);
    const [timePickerOpen, setTimePickerOpen] = useState(false);
    const [timePickerAction, setTimePickerAction] = useState('manual');
    const [timePickerActionDay, setTimePickerActionDay] = useState(null);

    const openMenu = () => {
        setMenuOpen(true);
    };

    const setAlarmBtnClick = (event) => {
        event.stopPropagation();
        setTimePickerAction('manual');
        setTimePickerActionDay(null);
        setTimePickerOpen(!timePickerOpen);
    };

    const setAlarmScheduleBtnClick = (event, day) => {
        event.stopPropagation();
        setTimePickerActionDay(day);
        setTimePickerAction('schedule');
        setTimePickerOpen(true);
    };

    const onTimeSelect = (timeoutput) => {
        switch (timePickerAction) {
            case 'manual':
                setAlarm(timeoutput.formatted24);
                setTimeout(() => setTimePickerOpen(false), 800);
            break;
            case 'schedule':
                setAlarmSchedule({...alarmSchedule, [timePickerActionDay.dayNr]: timeoutput.formatted24 });
                setTimePickerActionDay(null);
                break;
        }
    };

    const disableAlarmForDay = () => {
        setAlarmSchedule({...alarmSchedule, [timePickerActionDay.dayNr]: null });
    };

    const renderButton = (button) => <div
        className="nav_button"
        key={button.label}
        onClick={
            (event) => {
                button.onClick(event);
                if (button.closeMenuOnClick) {
                    setMenuOpen(false);
                }
            }
        }>{button.label}</div>;

    const renderAlarmSchedule = () => {
        return convertAlarmScheduleToArrayWithWeekdays(alarmSchedule).map(day =>
            <>
                <div
                    className={`alarm_scheldule_day ${timePickerActionDay && timePickerActionDay.dayNr === day.dayNr ? 'alarm_scheldule_day_active' : ''}`}
                    onClick={(event) => setAlarmScheduleBtnClick(event, day)}
                >
                    <div>{day.day}</div>
                    <div>{day.time}</div>
                </div>
            </>);
    };

    return (
        <>
            {!menuOpen && <div key="menu_open_area" onClick={openMenu} className="menu_open_area">
                <div className="hamburger_menu" />
            </div>}
            <div key="menu_container" className={`menu_container ${menuOpen && 'menu_container_open'}`}>
                <div className={`menu_buttons`}>
                    <div className="nav_button" onClick={setAlarmBtnClick}>Set Alarm</div>
                    {alarmOverrideActive && <div className="nav_button" onClick={disableAlarmOverride}>Disable override alarm</div>}
                    {otherButtons.map(button => renderButton(button))}
                    <div
                        key="button_close"
                        onClick={() => electron.remote.getCurrentWindow().close()}
                        className="nav_button btn_close_app"
                    >Quit</div>
                </div>
                <div className={`menu_datepicker`}>
                    {
                        timePickerOpen ?
                            <div className="timePicker">
                                <TimeKeeper
                                    switchToMinuteOnHourSelect
                                    closeOnMinuteSelect
                                    hour24Mode
                                    time={timePickerActionDay && timePickerActionDay.time !== '-' ? timePickerActionDay.time : undefined}
                                    onDoneClick={onTimeSelect}
                                />
                                {timePickerAction === 'schedule' && timePickerActionDay ? <div onClick={() => disableAlarmForDay()} className={`schedule_btn_removeday`}>Disable alarm for {timePickerActionDay.day}</div> : ''}
                            </div> : ''
                    }
                </div>
                <div className={`menu_alarm_schedule`}>
                    <b>Alarm schedule:</b><br /><br />
                    <div className={`menu_alarm_schedule_table`}>
                        {renderAlarmSchedule()}
                    </div>
                </div>

                <div onClick={() => setMenuOpen(false)} className="close_menu_button nav_button">
                    Close menu
                </div>

            </div>
        </>
    );
}

export default Menu;
