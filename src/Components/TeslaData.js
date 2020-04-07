import React from "react";
import {formatDistanceStrict, differenceInSeconds} from 'date-fns';

function TeslaData({teslaData, lastTeslaUpdate}) {

    if (!teslaData) {
        return null;
    }

    const {
        battery_level, charge_limit_soc, battery_range, minutes_to_full_charge, charger_power, charging_state
    } = teslaData.charge_state;
    const {is_climate_on, inside_temp, outside_temp} = teslaData.climate_state;

    const getStatusText = () => {
        if (charging_state === "Charging") {
            return <span> | <b>Charging</b> to {charge_limit_soc}% ({charger_power}kw)</span>;
        }
        if (charging_state === "Disconnected") {
            return null;
        }
        return <span> | {charging_state}</span>;
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
