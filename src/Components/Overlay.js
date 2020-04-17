import React from 'react';

function Overlay({ lightLevel }) {

    const opacity =  (10 - lightLevel) / 10;

    return (
        <div className={`overlay`} style={{ opacity }} />
    );
}

export default Overlay;
