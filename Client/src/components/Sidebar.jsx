import React, { useState } from 'react';
import './Sidebar.css';
import {Link} from "react-router-dom";
import {RxDashboard} from "react-icons/rx";
import {FaCreditCard} from "react-icons/fa";
import {BiHomeAlt} from "react-icons/bi";
import {FaRegMoneyBill1} from "react-icons/fa6";
import {GiPayMoney} from "react-icons/gi";
import { BsWallet2, BsList } from "react-icons/bs";
import { FaHistory } from 'react-icons/fa';

const Sidebar = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Handler to close the sidebar
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <>
        <div className={`sidebar-container ${isSidebarOpen ? 'show' : ''}`}>
            <div className="sidebar-icon"> <RxDashboard size={"20px"} /> </div>
            <Link className="sidebar-text" to="/" onClick={closeSidebar}>Dashboard</Link>
            
            <div className="sidebar-icon"> <BiHomeAlt size={"20px"}/> </div>
            <Link className="sidebar-text" to="/assets" onClick={closeSidebar}>Assets</Link>
            
            <div className="sidebar-icon"> <GiPayMoney size={"20px"}/> </div>
            <Link className="sidebar-text" to="/liabilities" onClick={closeSidebar}>Liabilities</Link>
            
            <div className="sidebar-icon"> <FaRegMoneyBill1 size={"20px"}/> </div>
            <Link className="sidebar-text" to="/income" onClick={closeSidebar}>Income</Link>
            
            <div className="sidebar-icon"> <BsWallet2 size={"20px"}/> </div>
            <Link className="sidebar-text" to="/expenses" onClick={closeSidebar}>Expenses</Link>
            
            <div className="sidebar-icon"> <FaCreditCard size={"20px"}/> </div>
            <Link className="sidebar-text" to="/transactions" onClick={closeSidebar}>Transactions</Link>
            
            <div className="sidebar-icon"> <FaHistory size={"20px"}/> </div>
            <Link className="sidebar-text" to="/history" onClick={closeSidebar}>History</Link>
        </div>
        
        <div className="hamburger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <BsList size={"30px"} />
        </div>
    </>
    );
}

export default Sidebar;
