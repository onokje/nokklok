import React, {useState} from 'react';
import TimeKeeper from 'react-timekeeper';
import { convertAlarmScheduleToArrayWithWeekdays} from "../helpers/timeHelpers";
const electron = window.require('electron');

function Menu({ setAlarm, alarmOverrideActive, disableAlarmOverride, otherButtons, alarmSchedule, alarmEnabled }) {

    const [menuOpen, setMenuOpen] = useState(false);
    const [timePickerOpen, setTimePickerOpen] = useState(false);

    const openMenu = () => {
        setMenuOpen(true);
    };

    const setAlarmBtnClick = (event) => {
        event.stopPropagation();
        setTimePickerOpen(!timePickerOpen);
    };

    const onTimeSelect = (timeoutput) => {
        console.log(timeoutput.formatted24);
        setAlarm(timeoutput.formatted24);
        setTimeout(() => setTimePickerOpen(false), 800);
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
        return convertAlarmScheduleToArrayWithWeekdays(alarmSchedule).map(day => <><div>{day.day}</div><div>{day.time}</div></>);
    };

    return (
        <>
            {!menuOpen && <div onClick={openMenu} className="menu_open_area">
                <div className="hamburger_menu" />
            </div>}
            <div className={`menu_container ${menuOpen && 'menu_container_open'}`}>
                <div className={`menu_buttons`}>
                    <div className="nav_button" onClick={setAlarmBtnClick}>Set Alarm</div>
                    {
                        timePickerOpen ?
                            <div className="timePicker">
                                <TimeKeeper
                                    switchToMinuteOnHourSelect
                                    closeOnMinuteSelect
                                    hour24Mode
                                    onDoneClick={onTimeSelect}
                                />
                            </div> :
                            <>
                                {alarmOverrideActive && <div className="nav_button" onClick={disableAlarmOverride}>Disable override alarm</div>}
                                {otherButtons.map(button => renderButton(button))}
                                <div
                                    onClick={() => electron.remote.getCurrentWindow().close()}
                                    className="nav_button btn_close_app"
                                >Quit</div>
                            </>
                    }

                </div>
                <div className={`menu_alarm_schedule`}>
                    <b>Alarm schedule:</b><br /><br />
                    <div className={`menu_alarm_schedule_table`}>
                        {renderAlarmSchedule()}
                    </div>

                </div>

                <div className="hamburger_menu" onClick={() => setMenuOpen(false)} />

            </div>
        </>
    );
}

export default Menu;
