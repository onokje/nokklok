import React from "react";
import {formatDistanceStrict, differenceInSeconds} from "date-fns";

function ThermoData({thermoData, lastThermoUpdate}) {

    if (!thermoData) {
        return null;
    }

    const getLastUpdate = () => {
        if (lastThermoUpdate && differenceInSeconds(lastThermoUpdate, new Date()) > 60) {
            return formatDistanceStrict(lastThermoUpdate, new Date());
        }
        return null;
    };

    const {currentTemp, targetTemp} = thermoData.update.thermoData;
    return (
        <>
            <span>{parseFloat(currentTemp).toFixed(1)}&deg; -> {targetTemp}&deg;</span>
            <span className={`thermoData_lastUpdate`}>{getLastUpdate()}</span>
        </>
    );
}

export default ThermoData;
