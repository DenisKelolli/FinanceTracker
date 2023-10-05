import React from 'react';
import './Dashboard.css'
import NetWorth from './NetWorth';
import RecentTransactions from './RecentTransactions';
import DashBoardIncome from './DashboardIncome';
import DashboardExpenses from './DashboardExpenses';


function Dashboard() {
  

  return (
    
     <><div className="dashboard-container">
         <div className="dashboard-networth-income-expenses">
            <div className="dashboard-networth">
               <NetWorth />
            </div>
            <div className="dashboard-income">
               <DashBoardIncome />
            </div>
            <div className="dashboard-expenses">
               <DashboardExpenses />
            </div>
         </div>
         <div className="dashboard-recenttransactions">
            <RecentTransactions />
         </div>
     </div>
     </>
         
    
  )
}

export default Dashboard