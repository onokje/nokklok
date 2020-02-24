import React, {useState} from 'react';
import TimeKeeper from 'react-timekeeper';

function Menu({ setAlarm, alarmOverrideActive, disableAlarmOverride }) {

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

    return (
        <>
            {!menuOpen && <div onClick={openMenu} className="menu_open_area">
                <div className="hamburger_menu" />
            </div>}
            <div className={`menu_container ${menuOpen && 'menu_container_open'}`}>
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
                        <div className="nav_button">other button</div>
                    </>
                }

                <div className="hamburger_menu" onClick={() => setMenuOpen(false)} />
            </div>
        </>

    );
}

export default Menu;
