import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecentTransactions = () => {
    const [recentTransactions, setRecentTransactions] = useState([]);

    useEffect(() => {
        const fetchRecentTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:3000/transactions');
                // Assuming the data is sorted by date in descending order (most recent first)
                // If it's not, you might need to sort it before slicing the top 5
                const latestTransactions = response.data.slice(0, 5);
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
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {recentTransactions.map((transaction, index) => (
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
    );
};

export default RecentTransactions;
