import React from 'react';
import './Dashboard.css'
import NetWorth from './NetWorth';
import RecentTransactions from './RecentTransactions';
import DashBoardIncome from './DashboardIncome';

function Dashboard() {
  

  return (
    
     <>
     <div className="dashboard-networth-income-expenses">
        <NetWorth />
        <DashBoardIncome />
        <RecentTransactions />
     </div>
     </>
         
    
  )
}

export default Dashboard