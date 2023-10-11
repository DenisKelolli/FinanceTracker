import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DashboardExpenses.css"
import { BsGraphDown } from "react-icons/bs";

const DashboardExpenses = () => {
  const [expensesTotal, setExpensesTotal] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expensesResponse = await axios.get(`${import.meta.env.VITE_API}/expenses`);
        
        let expensesSum = 0;
        if (expensesResponse.data && Array.isArray(expensesResponse.data)) {
            expensesResponse.data.forEach(category => {
                if (category.expenses && Array.isArray(category.expenses)) {
                    category.expenses.forEach(expenseItem => {
                        if (expenseItem.expensesValue) {
                            expensesSum += expenseItem.expensesValue;
                        }
                    });
                }
            });
            setExpensesTotal(expensesSum);
        } else {
            console.error("Unexpected structure for expenses:", expensesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error.message);
      }
    };

    fetchExpenses();
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  }


  return (
    <div className="DashboardExpenses-container">
      <div className="DashboardExpenses-row">
        <div className="DashboardExpenses-icon-left"> <BsGraphDown size={"30px"} /></div>
      </div>
      <div className="DashboardExpenses-row">
        <div className="DashboardExpenses-title">Monthly Expenses</div>
      </div>
      <div className="DashboardExpenses-row">
        <span className="DashboardExpenses-value">${formatNumber(expensesTotal.toFixed(2))}</span>
      </div>
    </div>
  );
}

export default DashboardExpenses;
