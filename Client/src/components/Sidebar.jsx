import React from 'react';
import './Sidebar.css';
import {Link} from "react-router-dom";
import {RxDashboard} from "react-icons/rx"
import {AiOutlineFire} from "react-icons/ai"
import {FaCreditCard} from "react-icons/fa"
import {BiHomeAlt} from "react-icons/bi"
import {FaRegMoneyBill1} from "react-icons/fa6"
import {BsWallet2} from "react-icons/bs"

const Sidebar = () => {
    return (
        <div className="sidebar-container">
            <div className="sidebar-icon"> <RxDashboard/> </div>
            <Link className="sidebar-text" to="/">Dashboard</Link>
            <div className="sidebar-icon"> <BiHomeAlt/> </div>
            <Link className="sidebar-text" to="/assets">Assets</Link>
            <div className="sidebar-icon"> <FaRegMoneyBill1/> </div>
            <Link className="sidebar-text" to="/income">Income</Link>
            <div className="sidebar-icon"> <BsWallet2/> </div>
            <Link className="sidebar-text" to="/expenses">Expenses</Link>
            <div className="sidebar-icon"> <FaCreditCard/> </div>
            <Link className="sidebar-text" to="/transactions">Transactions</Link>
            <div className="sidebar-icon"> <AiOutlineFire/> </div>
            <Link className="sidebar-text" to="/fire">F.I.R.E</Link>
        </div>
    );
}

export default Sidebar;
