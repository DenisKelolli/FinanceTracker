import React, { useEffect, useState, memo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import "./DashboardIncomeExpenses.css";

Chart.register(...registerables);

const DashboardIncomeExpenses = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3000/history');
        if (response.data && response.data.income && response.data.expenses) {
          setIncomeData(response.data.income);
          setExpensesData(response.data.expenses);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const currentYear = new Date().getFullYear();
  const monthsOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getMonthlySum = (data, month) => {
    return data
      .filter(item => item.month === month && parseInt(item.year) === currentYear)
      .reduce((acc, curr) => acc + parseFloat(curr.value), 0);
  };

  const incomeMonthlySum = monthsOrder.map(month => getMonthlySum(incomeData, month));
  const expensesMonthlySum = monthsOrder.map(month => getMonthlySum(expensesData, month));

  const maxIncome = Math.max(...incomeMonthlySum);
  const maxExpense = Math.max(...expensesMonthlySum);
  const maxChartValue = 1.4 * Math.max(maxIncome, maxExpense);
  const roundedMaxChartValue = Math.floor(maxChartValue / 100) * 100;
  

  const chartData = {
    labels: monthsOrder,
    datasets: [
      {
        label: 'Gross Income',
        data: incomeMonthlySum,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Expenses',
        data: expensesMonthlySum,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: roundedMaxChartValue,
        ticks: {
          callback: (value) => `$${value}`,
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: `Financial Insights ${currentYear}`,
        position: 'top',
        align: 'start',
        color: "black",
        font: {
          size: 24,
          family : "Times New Roman",
        }
      },
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  return (
    <div className="bargraph-wrapper">
      <div className="bargraph">
        <Bar data={chartData} options={chartOptions} className="bar-canvas" />
      </div>
    </div>
  );
};

export default memo(DashboardIncomeExpenses);
