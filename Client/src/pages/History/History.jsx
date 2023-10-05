import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./History.css";

const History = () => {
    const [type, setType] = useState('Type');
    const [value, setValue] = useState('');
    const [month, setMonth] = useState('Month');
    const [year, setYear] = useState('Year');
    const [histories, setHistories] = useState({ income: [], expenses: [] });

    const monthsOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('http://localhost:3000/history');
            const sortedData = {
                income: response.data.income.sort((a, b) => b.year - a.year || monthsOrder.indexOf(b.month) - monthsOrder.indexOf(a.month)),
                expenses: response.data.expenses.sort((a, b) => b.year - a.year || monthsOrder.indexOf(b.month) - monthsOrder.indexOf(a.month)),
            };
            setHistories(sortedData);
        }
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (type === 'Type' || month === 'Month' || year === 'Year') {
            alert("Please select valid Type, Month, and Year.");
            return;
        }
        const data = { type, value, month, year };
        const response = await axios.post('http://localhost:3000/history', data);
        setHistories(response.data);
        window.location.reload();
    };

    return (
        <div className="History-container">
            <form className="History-form" onSubmit={handleSubmit}>
                <input 
                    className="History-input"
                    value={value} 
                    onChange={(e) => setValue(e.target.value)} 
                    placeholder="Value" 
                />
                <select className="History-select" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="Type">Type</option>
                    <option value="Income">Income</option>
                    <option value="Expenses">Expenses</option>
                </select>
                <select className="History-select" value={month} onChange={(e) => setMonth(e.target.value)}>
                    <option value="Month">Month</option>
                    {monthsOrder.map(monthName => (
                        <option key={monthName} value={monthName}>{monthName}</option>
                    ))}
                </select>
                <select className="History-select" value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="Year">Year</option>
                    {[...Array(11)].map((_, i) => (
                        <option key={i} value={2020 + i}>{2020 + i}</option>
                    ))}
                </select>
                <button className="History-button" type="submit">Submit</button>
            </form>

            <div className="History-list">
                <h2 className="History-title">Income History</h2>
                {histories.income.map(item => (
                    <div className="History-item" key={item._id}>
                        ${item.value} {item.month} {item.year}
                    </div>
                ))}
            </div>

            <div className="History-list">
                <h2 className="History-title">Expenses History</h2>
                {histories.expenses.map(item => (
                    <div className="History-item" key={item._id}>
                         ${item.value} {item.month} {item.year}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;
