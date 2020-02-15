import React from 'react';
import { format } from 'date-fns'

function App() {


    return (
        <div className="app">
            <div className="time">
                { format(new Date(), 'H:mm') }
            </div>
        </div>
    );
}

export default App;
