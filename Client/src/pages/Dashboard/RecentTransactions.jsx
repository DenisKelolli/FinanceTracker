import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecentTransactions.css';

const RecentTransactions = () => {
    const [recentTransactions, setRecentTransactions] = useState([]);

    useEffect(() => {
        const fetchRecentTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:3000/transactions');
        
                // Sort transactions by date in descending order
                const sortedTransactions = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
                // Get the top 5 recent transactions
                const latestTransactions = sortedTransactions.slice(0, 5);
        
                setRecentTransactions(latestTransactions);
            } catch (error) {
                console.error("Error fetching recent transactions:", error);
            }
        };
        

        fetchRecentTransactions();
    }, []);

    return (
        <div className="recent-transactions-container">
            <h2>Recent Transactions</h2>
            <table className="transactions-table">
                <thead>
                    <tr >
                        <th className='recenttransactions-th'>Name</th>
                        <th className='recenttransactions-th' >Type</th>
                        <th className='recenttransactions-th'>Date</th>
                        <th className='recenttransactions-th'>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {recentTransactions.map((transaction, index) => (
                        <tr key={index}>
                            <td className='recenttransactions-td'>{transaction.transactionName}</td>
                            <td className='recenttransactions-td'>{transaction.type}</td>
                            <td className='recenttransactions-td'>{new Date(transaction.date).toLocaleDateString()}</td>
                            <td className='recenttransactions-td' style={{
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
    );
};

export default RecentTransactions;
