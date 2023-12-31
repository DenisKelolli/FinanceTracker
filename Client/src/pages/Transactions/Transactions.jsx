import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transactions.css';

const Transactions = () => {
    const [transactionName, setTransactionName] = useState('');
    const [transactionNameError, setTransactionNameError] = useState(false);
    const [type, setType] = useState('');
    const [typeError, setTypeError] = useState(false);
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const [date, setDate] = useState(formattedDate);
    const [dateError, setDateError] = useState(false);
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState(false);
    const [allTransactions, setAllTransactions] = useState([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');

    const handleSubmit = async () => {
        setTransactionNameError(!transactionName);
        setTypeError(!type);
        setDateError(!date);
        setAmountError(!amount);
    
        if (!transactionName || !type || !date || !amount) {
            return;
        }
    
        try {
            // Get the current time (hours, minutes, seconds, and milliseconds)
            const currentTime = new Date();
            const timeString = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}:${String(currentTime.getSeconds()).padStart(2, '0')}.${String(currentTime.getMilliseconds()).padStart(3, '0')}`;
    
            // Use the provided date and attach the current time to it
            const localIsoString = new Date(date + "T" + timeString).toISOString();
    
            await axios.post(`${import.meta.env.VITE_API}/transactions`, {
                transactionName,
                type,
                date: localIsoString,
                amount: parseFloat(amount || 0)
            });
            fetchTransactions();
        } catch (error) {
            console.error("Error sending transaction data:", error);
        }
    };
    

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/transactions`);
            setAllTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value === '' || (!isNaN(value) && value >= 0)) {
            setAmount(value);
        }
    };

    const filteredTransactions = allTransactions
        .filter(transaction => {
            if (typeFilter && transaction.type !== typeFilter) {
                return false;
            }
            if (monthFilter && new Date(transaction.date).getMonth() !== (parseInt(monthFilter) - 1)) {
                return false;
            }
            return true;
        });

    return (
        <div className="transactions-container">
            <div className="transactions-form-container">
                <form>
                    <div className="transactions-input-group">
                        <input 
                            className="transactions-input"
                            type="text" 
                            placeholder="Name of Transaction" 
                            value={transactionName}
                            onChange={(e) => {
                                setTransactionName(e.target.value);
                                setTransactionNameError(!e.target.value);
                            }}
                        />
                        {transactionNameError && <span style={{color: 'red'}}>Name can't be blank</span>}
                    </div>
                    <div className="transactions-input-group">
                        <select className="transactions-select" value={type} onChange={(e) => {
                            setType(e.target.value);
                            setTypeError(!e.target.value);
                        }}>
                            <option value="" disabled>Select Type</option>
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </select>
                        {typeError && <span style={{color: 'red'}}>Type can't be blank</span>}
                    </div>
                    <div className="transactions-input-group">
                        <input 
                            className="transactions-input"
                            type="date" 
                            value={date} 
                            onChange={(e) => {
                                setDate(e.target.value);
                                setDateError(!e.target.value);
                            }}
                        />
                        {dateError && <span style={{color: 'red'}}>Date can't be blank</span>}
                    </div>
                    <div className="transactions-input-group">
                        <input 
                            className="transactions-input"
                            type="number" 
                            placeholder="Amount"
                            value={amount}
                            onChange={handleAmountChange}
                        />
                        {amountError && <span style={{color: 'red'}}>Amount can't be blank</span>}
                    </div>
                    <div className="transactions-addtransaction-button">
                        <button className="transactions-button" type="button" onClick={handleSubmit}>
                            Add Transaction
                        </button>
                    </div>
                </form>
            </div>
    
            <div className="transactions-filters">
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="">Filter by Type</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                </select>
                <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
                    <option value="">Filter by Month</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
            </div>
    
            <div className="transactions-table-container">
                <table className="transactions-table">
                    <thead>
                        <tr className="transactions-tr">
                            <th className="transactions-th">Name</th>
                            <th className="transactions-th">Type</th>
                            <th className="transactions-th">Date</th>
                            <th className="transactions-th">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((transaction, index) => (
                            <tr key={index} className="transactions-tr">
                                <td className="transactions-td">{transaction.transactionName}</td>
                                <td className="transactions-td">{transaction.type}</td>
                                <td className="transactions-td">{new Date(transaction.date).toLocaleDateString()}</td>
                                <td className="transactions-td" style={{
                                    color: transaction.type === 'Expense' ? 'red' : 'green'
                                }}>
                                    {transaction.type === 'Expense' 
                                    ? `- $${parseFloat(transaction.amount).toFixed(2)}`
                                    : `+ $${parseFloat(transaction.amount).toFixed(2)}`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
