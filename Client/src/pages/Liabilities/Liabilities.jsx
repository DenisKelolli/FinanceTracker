import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Liabilities.css';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, CategoryScale, PieController, Legend, Title } from 'chart.js';
Chart.register(ArcElement, CategoryScale, PieController, Legend, Title);

const headers = [
  'Mortgage Loan', 'Car Loan', 'Credit Card Debt', 'Student Loan',];

  const Liabilities = () => {
  const [formData, setFormData] = useState({});
  const [allLiabilities, setAllLiabilities] = useState({});
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    // Fetch all liabilities on component mount
    const fetchliabilities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/liabilities');
        const liabilitiesData = {};
        response.data.forEach(liability => {
          liabilitiesData[liability.category] = liability.liability;
        });
        setAllLiabilities(liabilitiesData);
      } catch (error) {
        console.error('Error fetching liabilities:', error);
      }
    };

    fetchliabilities();
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
        await axios.post('http://localhost:3000/liabilities', {
          category: header,
          liabilityTitle: formData[header].text,
          liabilityValue: Number(formData[header].value)
        });
        console.log('Data sent successfully');
        window.location.reload();
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
  };

  const handleEditliability = (header, liability) => {
    setEditMode({ 
        category: header, 
        liabilityId: liability._id, 
        value: liability.liabilityValue, 
        liabilityTitle: liability.liabilityTitle 
    });
};

  
  
  const handleEditChange = (value) => {
    setEditMode(prevState => ({ ...prevState, value: value }));
  };
  
  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:3000/liabilities`, {
        category: editMode.category,
        liabilityId: editMode.liabilityId,  // Using liability's unique ID
        liabilityValue: Number(editMode.value)
      });
      console.log('liability edited successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error editing liability:', error);
    }
  };
  
  
  const handleDeleteliability = async (header, liability) => {
    try {
      await axios.delete(`http://localhost:3000/liabilities`, {
        data: {
          category: header,
          liabilityId: liability._id  // Using liability's unique ID
        }
      });
      console.log('liability deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting liability:', error);
    }
  };
  
  

  const computeTotal = () => {
    let totalFromFormData = Object.values(formData).reduce((acc, currentliability) => {
      return acc + (currentliability.value ? Number(currentliability.value) : 0);
    }, 0);

    let totalFromAllliabilities = Object.values(allLiabilities).reduce((total, liabilitiesList) => {
      if (!liabilitiesList) return total;
      return total + liabilitiesList.reduce((acc, liability) => {
        return acc + (liability.liabilityValue ? Number(liability.liabilityValue) : 0);
      }, 0);
    }, 0);

    return totalFromFormData + totalFromAllliabilities;
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
      if (allLiabilities[header]) {
        return allLiabilities[header].reduce((acc, liability) => {
          return acc + (liability.liabilityValue ? Number(liability.liabilityValue) : 0);
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
    <div className="liabilitiesandpiecontainer">
    <div className="liabilities-container">
      {headers.map((header) => (
        <div key={header} className="liabilities-section">
          <h3>{header}
            {formData[header] ? 
              <button  onClick={() => handleAdd(header)} className="liabilities-remove-icon">-</button> :
              <button onClick={() => handleAdd(header)} className="liabilities-add-icon">+</button>
            }
          </h3>
          
          {allLiabilities[header] && allLiabilities[header].map((liability, index) => (
  <div key={index} className="liability-item">
    {editMode && editMode.liabilityId === liability._id ? (
      <>
        {liability.liabilityTitle}: $
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
        {liability.liabilityTitle}: ${liability.liabilityValue}
        <div className="liability-action-buttons">
          <button className="liabilities-edit-button" onClick={() => handleEditliability(header, liability)}>Edit</button>
          <button className="liabilities-delete-button" onClick={() => handleDeleteliability(header, liability)}>Delete</button>
        </div>
      </>
    )}
  </div>
))}

          
          {formData[header] && (
            <div className="liabilities-input-container">
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
              <button onClick={() => handleSubmit(header)} className="liabilities-submit">Submit</button>
            </div>
          )}
        </div>
      ))}
        <div className="liabilities-section">
                <h3>Total Liabilities</h3>
                <div className='liability-item-total'>${computeTotal()}</div>
            </div>
    </div>
    <div className="liabilities-pie-section">
                <h3>Pie Chart of Liabilities</h3>
                <Pie data={getPieData()} options={pieOptions} />
                
            </div> 
    </div>
    

  );
};

export default Liabilities;