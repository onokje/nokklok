import React from "react";
import {formatDistanceStrict, differenceInSeconds} from 'date-fns';

function TeslaData({teslaData, lastTeslaUpdate}) {

    if (!teslaData) {
        return null;
    }

    const {
        battery_level, charge_limit_soc, charger_power, charging_state
    } = teslaData.charge_state;
    const {is_climate_on} = teslaData.climate_state;

    const getStatusText = () => {
        if (charging_state === "Charging") {
            return <span> | <b>Charging</b> to {charge_limit_soc}% ({charger_power}kw) {is_climate_on ? ' (Climate On)' : ''}</span>;
        }
        if (charging_state === "Disconnected") {
            return <span>{is_climate_on ? ' | (Climate On)' : ''}</span>;
        }
        return <span> | {charging_state} {is_climate_on ? ' (Climate On)' : ''}</span>;
    };

    const getLastUpdate = () => {
        if (lastTeslaUpdate && differenceInSeconds(lastTeslaUpdate, new Date()) > 300) {
            return formatDistanceStrict(lastTeslaUpdate, new Date());
        }
        return null;
    };

    return (
        <>
            <span className={`teslaData`}>{battery_level}% {getStatusText()}</span>
            <span className={`teslaData_lastUpdate`}>{getLastUpdate()}</span>
        </>
    );
}

export default TeslaData;
