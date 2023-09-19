import React from "react";
import "./NetWorth.css";

const NetWorth = () =>{

    return (
        <div className="networth-container">
            <div className="networth-row">
                <div className="networth-icon-left">icon</div>
            </div>
            <div className="networth-row">
                <div className="networth-title">Net Worth</div>
            </div>
            <div className="networth-row">
                <span className="networth-value">$30,000</span>
            </div>
        </div>
    )
}

export default NetWorth;