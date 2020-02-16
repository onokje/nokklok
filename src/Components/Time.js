import React from 'react';
import { format } from 'date-fns'

function Time({ time }) {

    return (
        <div className="time">
            {format(time, 'H:mm')}
        </div>
    );
}

export default Time;
