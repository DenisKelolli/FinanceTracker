import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Income.css';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, CategoryScale, PieController, Legend, Title } from 'chart.js';
Chart.register(ArcElement, CategoryScale, PieController, Legend, Title);

const headers = [
  'Salary Income', 'Business Income', 'Rental Income', 'Dividend Income',];

  const Income = () => {
  const [formData, setFormData] = useState({});
  const [allIncome, setAllIncome] = useState({});
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    // Fetch all income on component mount
    const fetchincome = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/income`);
        const incomeData = {};
        response.data.forEach(income => {
          incomeData[income.category] = income.income;
        });
        setAllIncome(incomeData);
      } catch (error) {
        console.error('Error fetching income:', error);
      }
    };

    fetchincome();
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
        await axios.post(`${import.meta.env.VITE_API}/income`, {
          category: header,
          incomeTitle: formData[header].text,
          incomeValue: Number(formData[header].value)
        });
        console.log('Data sent successfully');
        window.location.reload();
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
  };

  const handleEditincome = (header, income) => {
    setEditMode({ 
        category: header, 
        incomeId: income._id, 
        value: income.incomeValue, 
        incomeTitle: income.incomeTitle 
    });
};

  const handleEditChange = (value) => {
    setEditMode(prevState => ({ ...prevState, value: value }));
  };
  
  const handleEditSubmit = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API}/income`, {
        category: editMode.category,
        incomeId: editMode.incomeId,  
        incomeValue: Number(editMode.value)
      });
      console.log('income edited successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error editing income:', error);
    }
  };
  
  
  const handleDeleteincome = async (header, income) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API}/income`, {
        data: {
          category: header,
          incomeId: income._id 
        }
      });
      console.log('income deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };
  
  

  const computeTotal = () => {
    let totalFromFormData = Object.values(formData).reduce((acc, currentincome) => {
      return acc + (currentincome.value ? Number(currentincome.value) : 0);
    }, 0);

    let totalFromAllincome = Object.values(allIncome).reduce((total, incomeList) => {
      if (!incomeList) return total;
      return total + incomeList.reduce((acc, income) => {
        return acc + (income.incomeValue ? Number(income.incomeValue) : 0);
      }, 0);
    }, 0);

    return totalFromFormData + totalFromAllincome;
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
      if (allIncome[header]) {
        return allIncome[header].reduce((acc, income) => {
          return acc + (income.incomeValue ? Number(income.incomeValue) : 0);
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
    <div className="incomeandpiecontainer">
    <div className="income-container">
      {headers.map((header) => (
        <div key={header} className="income-section">
          <h3>{header}
            {formData[header] ? 
              <button  onClick={() => handleAdd(header)} className="income-remove-icon">-</button> :
              <button onClick={() => handleAdd(header)} className="income-add-icon">+</button>
            }
          </h3>
          
          {allIncome[header] && allIncome[header].map((income, index) => (
  <div key={index} className="income-item">
    {editMode && editMode.incomeId === income._id ? (
      <>
        {income.incomeTitle}: $
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
        {income.incomeTitle}: ${income.incomeValue}
        <div className="income-action-buttons">
          <button className="income-edit-button" onClick={() => handleEditincome(header, income)}>Edit</button>
          <button className="income-delete-button" onClick={() => handleDeleteincome(header, income)}>Delete</button>
        </div>
      </>
    )}
  </div>
))}

          {formData[header] && (
            <div className="income-input-container">
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
              <button onClick={() => handleSubmit(header)} className="income-submit">Submit</button>
            </div>
          )}
        </div>
      ))}
        <div className="income-section">
                <h3>Total Income</h3>
                <div className='income-item-total'>${computeTotal().toFixed(2)}</div>
            </div>
    </div>
    <div className="income-pie-section">
                <Pie data={getPieData()} options={pieOptions} />
                
            </div> 
    </div>
    

  );
};

export default Income;