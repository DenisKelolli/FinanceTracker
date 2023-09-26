import React from 'react';
import './Dashboard.css'
import NetWorth from './NetWorth';
import RecentTransactions from './RecentTransactions';

function Dashboard() {
  

  return (
    
     <>
     <div className="dashboard-networth-income-expenses">
        <NetWorth />
        <RecentTransactions />
     </div>
     </>
         
    
  )
}

export default Dashboard