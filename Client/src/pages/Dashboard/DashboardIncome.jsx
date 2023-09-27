import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DashBoardIncome.css";

const DashBoardIncome = () => {
  const [incomeTotal, setIncomeTotal] = useState(0);

  useEffect(() => {
    const fetchIncome = async () => {
        try {
          const incomeResponse = await axios.get('http://localhost:3000/income');
          
          let incomeSum = 0;
          if (incomeResponse.data && Array.isArray(incomeResponse.data)) {
              incomeResponse.data.forEach(category => {
                  if (category.income && Array.isArray(category.income)) {
                      category.income.forEach(incomeItem => {
                          if (incomeItem.incomeValue) {
                              incomeSum += incomeItem.incomeValue;
                          }
                      });
                  }
              });
              setIncomeTotal(incomeSum);
          } else {
              console.error("Unexpected structure for income:", incomeResponse.data);
          }
        } catch (error) {
          console.error("Error fetching income:", error.message);
        }
      };
      

    fetchIncome();
  }, []);

  return (
    <div className="DashBoardIncome-container">
      <div className="DashBoardIncome-row">
        <div className="DashBoardIncome-icon-left">icon</div>
      </div>
      <div className="DashBoardIncome-row">
        <div className="DashBoardIncome-title">Income</div>
      </div>
      <div className="DashBoardIncome-row">
        <span className="DashBoardIncome-value">${incomeTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default DashBoardIncome;
