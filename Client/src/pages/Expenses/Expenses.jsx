import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Expenses.css';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, CategoryScale, PieController, Legend, Title } from 'chart.js';

Chart.register(ArcElement, CategoryScale, PieController, Legend, Title);

const headers = [
  'Rent', 'Utilities', 'Groceries', 'Transportation',
];

const Expenses = () => {
  const [formData, setFormData] = useState({});
  const [allExpenses, setAllExpenses] = useState({});
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/expenses');
        const expensesData = {};
        response.data.forEach(expense => {
          expensesData[expense.category] = expense.expenses;
        });
        setAllExpenses(expensesData);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, []);

  const handleAdd = (header) => {
    const updatedData = { ...formData };
    if (updatedData[header]) {
      delete updatedData[header];
    } else {
      updatedData[header] = { text: '', value: '' };
    }
    setFormData(updatedData);
  };

  const handleChange = (header, field, value) => {
    const updatedData = { ...formData };
    if (updatedData[header]) {
      updatedData[header][field] = value;
    }
    setFormData(updatedData);
  };

  const handleSubmit = async (header) => {
    if (formData[header]) {
      try {
        await axios.post('http://localhost:3000/expenses', {
          category: header,
          expenseTitle: formData[header].text,
          expenseValue: Number(formData[header].value)
        });
        console.log('Data sent successfully');
        window.location.reload();
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
  };

  const handleEditExpense = (header, expense) => {
    setEditMode({
      category: header,
      expenseId: expense._id,
      value: expense.expenseValue,
      expenseTitle: expense.expenseTitle
    });
  };

  const handleEditChange = (value) => {
    setEditMode(prevState => ({ ...prevState, value: value }));
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:3000/expenses`, {
        category: editMode.category,
        expenseId: editMode.expenseId,
        expenseValue: Number(editMode.value)
      });
      console.log('Expense edited successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error editing expense:', error);
    }
  };

  const handleDeleteExpense = async (header, expense) => {
    try {
      await axios.delete(`http://localhost:3000/expenses`, {
        data: {
          category: header,
          expenseId: expense._id
        }
      });
      console.log('Expense deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const computeTotal = () => {
    let totalFromFormData = Object.values(formData).reduce((acc, currentExpense) => {
      return acc + (currentExpense.value ? Number(currentExpense.value) : 0);
    }, 0);

    let totalFromAllExpenses = Object.values(allExpenses).reduce((total, expenseList) => {
      if (!expenseList) return total;
      return total + expenseList.reduce((acc, expense) => {
        return acc + (expense.expensesValue ? Number(expense.expensesValue) : 0);
      }, 0);
    }, 0);

    return totalFromFormData + totalFromAllExpenses;
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        labels: {
          generateLabels: (chart) => {
            const data = chart.data;
            const totalValue = data.datasets[0].data.reduce((acc, value) => acc + value, 0);
            return data.labels.map((label, index) => {
              const currentValue = data.datasets[0].data[index];
              const percentage = ((currentValue / totalValue) * 100).toFixed(2);
              return {
                text: `${label}: ${percentage}%`,
                fillStyle: data.datasets[0].backgroundColor[index],
              };
            });
          },
        },
      },
    },
  };

  const getPieData = () => {
    const data = headers.map(header => {
      if (allExpenses[header]) {
        return allExpenses[header].reduce((acc, expense) => {
          return acc + (expense.expensesValue ? Number(expense.expensesValue) : 0);
        }, 0);
      } else {
        return 0;
      }
    });

    return {
      labels: headers,
      datasets: [{
        data: data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#E7E9ED',
        ],
      }],
    };
  };

  return (
    <div className="expenses-and-pie-container">
        <div className="expenses-container">
            {headers.map((header) => (
                <div key={header} className="expenses-section">
                    <h3>{header}
                        {formData[header] ?
                            <button onClick={() => handleAdd(header)} className="expenses-remove-icon">-</button> :
                            <button onClick={() => handleAdd(header)} className="expenses-add-icon">+</button>
                        }
                    </h3>
                    {allExpenses[header] && allExpenses[header].map((expense, index) => (
                        <div key={index} className="expenses-item">
                            {editMode && editMode.expenseId === expense._id ? (
                                <>
                                    {expense.expensesTitle}: $
                                    <input
                                        type="number"
                                        value={editMode.value}
                                        onChange={(e) => handleEditChange(e.target.value)}
                                    />
                                    <button onClick={handleEditSubmit}>Save</button>
                                    <button onClick={() => setEditMode(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    {expense.expensesTitle}: ${expense.expensesValue}
                                    <div className="expenses-action-buttons">
                                        <button className="expenses-edit-button" onClick={() => handleEditExpense(header, expense)}>Edit</button>
                                        <button className="expenses-delete-button" onClick={() => handleDeleteExpense(header, expense)}>Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    {formData[header] && (
                        <div className="expenses-input-container">
                            <input
                                type="text"
                                placeholder={`Enter ${header} name`}
                                value={formData[header].text}
                                onChange={(e) => handleChange(header, 'text', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder={`Enter ${header} value`}
                                value={formData[header].value}
                                onChange={(e) => handleChange(header, 'value', e.target.value)}
                            />
                            <button onClick={() => handleSubmit(header)} className="expenses-submit">Submit</button>
                        </div>
                    )}
                </div>
            ))}
            <div className="expenses-section">
                <h3>Total Expenses</h3>
                <div className="expenses-item-total">${computeTotal().toFixed(2)}</div>
            </div>
        </div>
        <div className="expenses-pie-section">
            <Pie data={getPieData()} options={pieOptions} />
        </div>
    </div>
);
}

export default Expenses;

