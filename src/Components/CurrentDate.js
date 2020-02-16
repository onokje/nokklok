import React from 'react';
import { format } from 'date-fns'

function CurrentDate({ now }) {

    return (
        <div className="current_date">
            {format(now, 'eeee d MMMM')}
        </div>
    );
}

export default CurrentDate;
