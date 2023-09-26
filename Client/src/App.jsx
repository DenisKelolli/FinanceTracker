import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'
import SideBar from "./components/Sidebar"
import Assets from './pages/FinancialAssets/Assets';
import Liabilities from './pages/Liabilities/Liabilities';
import Income from './pages/Income/Income';
import Transactions from './pages/Transactions/Transactions';
import Dashboard from './pages/Dashboard/Dashboard';


function App() {
  
  return (
    
    <Router>
      <div className="app-container">
        <SideBar />
        <Routes>
          <Route exact path="/" element={<Dashboard/>} /> 
          <Route exact path="/assets" element={<Assets />} /> 
          <Route exact path="/liabilities" element={<Liabilities />} /> 
          <Route exact path="/income" element={<Income />} /> 
          <Route exact path="/transactions" element={<Transactions />} /> 
        </Routes>
      </div>
    </Router>
  )
}

export default App
