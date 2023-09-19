import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'
import SideBar from "./components/Sidebar"
import NetWorth from "./pages/Dashboard/NetWorth"
import Assets from './pages/FinancialAssets/Assets';

function App() {
  

  return (
    
    <Router>
      <div className="app-container">
        <SideBar />
        <Routes>
          <Route exact path="/" element={<NetWorth />} /> 
          <Route exact path="/assets" element={<Assets />} /> 
        </Routes>
      </div>
    </Router>
  )
}

export default App
