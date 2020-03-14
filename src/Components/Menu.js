import React, {useState} from 'react';
import TimeKeeper from 'react-timekeeper';
const electron = window.require('electron');

function Menu({ setAlarm, alarmOverrideActive, disableAlarmOverride, otherButtons }) {

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
                        {otherButtons.map(button => renderButton(button))}
                        <div
                            onClick={() => electron.remote.getCurrentWindow().close()}
                            className="nav_button btn_close_app"
                        >Afsluiten</div>
                    </>
                }

                <div className="hamburger_menu" onClick={() => setMenuOpen(false)} />
            </div>
        </>
    );
}

export default Menu;
