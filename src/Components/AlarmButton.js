import React from 'react';

function AlarmButton({ onClick }) {

    return (
        <div className="alarm_button_container">
            <div className="alarm_button" onClick={onClick}>
                Wakey Wakey!
            </div>
        </div>

    );
}

export default AlarmButton;
