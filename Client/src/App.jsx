import React, { useState} from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'
import SideBar from "./components/Sidebar"
import NetWorth from "./pages/Dashboard/NetWorth"
import Assets from './pages/FinancialAssets/Assets';
import Liabilities from './pages/Liabilities/Liabilities';
import Income from './pages/Income/Income';
import Transactions from './pages/Transactions/Transactions';

function App() {
  
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  
  const netWorth = totalAssets - totalLiabilities;

  return (
    
    <Router>
      <div className="app-container">
        <SideBar />
        <Routes>
          <Route exact path="/" element={<NetWorth value={netWorth} />} /> 
          <Route exact path="/assets" element={<Assets   onTotalChange={setTotalAssets}/>} /> 
          <Route exact path="/liabilities" element={<Liabilities onTotalChange={setTotalLiabilities} />} /> 
          <Route exact path="/income" element={<Income />} /> 
          <Route exact path="/transactions" element={<Transactions />} /> 
        </Routes>
      </div>
    </Router>
  )
}

export default App
