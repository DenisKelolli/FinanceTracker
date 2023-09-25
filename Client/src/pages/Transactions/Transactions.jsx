import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transactions.css';

const Transactions = () => {
    const [transactionName, setTransactionName] = useState('');
    const [type, setType] = useState('');
 // Adjust the initial date value to avoid timezone issues
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const [date, setDate] = useState(formattedDate);
    const [amount, setAmount] = useState(''); 
    const [allTransactions, setAllTransactions] = useState([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');

    const handleSubmit = async () => {
        try {
            // Convert the date to an ISO string with timezone included
            const localIsoString = new Date(date + "T00:00:00").toISOString();
    
            await axios.post('http://localhost:3000/transactions', {
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
            const response = await axios.get('http://localhost:3000/transactions');
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
        // Allow empty values and any numeric value
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
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort in descending order based on date

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
                            onChange={(e) => setTransactionName(e.target.value)}
                        />
                    </div>
                    <div className="transactions-input-group">
                        <select className="transactions-select" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="" disabled>Select type</option>
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </select>
                    </div>
                    <div className="transactions-input-group">
                        <input 
                            className="transactions-input"
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="transactions-input-group">
                        <input 
                            className="transactions-input"
                            type="number" 
                            placeholder="Amount"
                            value={amount}
                            onChange={handleAmountChange}
                        />
                    </div>
                    <button className="transactions-button" type="button" onClick={handleSubmit}>
                        Add Transaction
                    </button>
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
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{transaction.transactionName}</td>
                                <td>{transaction.type}</td>
                                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                <td style={{
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
