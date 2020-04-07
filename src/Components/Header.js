import React from "react";
import {format} from 'date-fns';
import teslaImg from "../images/tesla.svg";
import TeslaData from "./TeslaData";
import ThermoData from "./ThermoData";

function Header({ now, teslaData, lastTeslaUpdate, thermoData, lastThermoUpdate }) {
    return (
        <div className="header">
            {format(now, 'eeee d MMMM')}
            <div className={`header_tesla_statusbar`}>
                <TeslaData teslaData={teslaData} lastTeslaUpdate={lastTeslaUpdate} />
                <img alt="tesla" src={teslaImg} className={`tesla_icon`}/>
            </div>
            <div className={`header_thermo_statusbar`}>
                <ThermoData thermoData={thermoData} lastThermoUpdate={lastThermoUpdate} />
            </div>
        </div>
    );
}

export default Header;
