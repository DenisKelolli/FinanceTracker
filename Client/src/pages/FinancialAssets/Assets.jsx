import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Assets.css';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, CategoryScale, PieController, Legend, Title } from 'chart.js';

Chart.register(ArcElement, CategoryScale, PieController, Legend, Title);




const headers = [
  'Real Estate', 'Vehicles', 'Stocks', 'Retirement', 'Cash', 'Personal Assets'
];

const Assets = () => {
  const [formData, setFormData] = useState({});
  const [allAssets, setAllAssets] = useState({});
  const [editMode, setEditMode] = useState(null);



  useEffect(() => {
    // Fetch all assets on component mount
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/assets');
        const assetsData = {};
        response.data.forEach(asset => {
          assetsData[asset.category] = asset.asset;
        });
        setAllAssets(assetsData);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
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
        await axios.post('http://localhost:3000/assets', {
          category: header,
          assetTitle: formData[header].text,
          assetValue: Number(formData[header].value)
        });
        console.log('Data sent successfully');
        window.location.reload();
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
  };

  const handleEditAsset = (header, asset) => {
    setEditMode({ 
        category: header, 
        assetId: asset._id, 
        value: asset.assetValue, 
        assetTitle: asset.assetTitle 
    });
};

  
  
  const handleEditChange = (value) => {
    setEditMode(prevState => ({ ...prevState, value: value }));
  };
  
  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:3000/assets`, {
        category: editMode.category,
        assetId: editMode.assetId,  // Using asset's unique ID
        assetValue: Number(editMode.value)
      });
      console.log('Asset edited successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error editing asset:', error);
    }
  };
  
  
  const handleDeleteAsset = async (header, asset) => {
    try {
      await axios.delete(`http://localhost:3000/assets`, {
        data: {
          category: header,
          assetId: asset._id  // Using asset's unique ID
        }
      });
      console.log('Asset deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };
  
  

  const computeTotal = () => {
    let totalFromFormData = Object.values(formData).reduce((acc, currentAsset) => {
      return acc + (currentAsset.value ? Number(currentAsset.value) : 0);
    }, 0);

    let totalFromAllAssets = Object.values(allAssets).reduce((total, assetsList) => {
      return total + assetsList.reduce((acc, asset) => {
        return acc + (asset.assetValue ? Number(asset.assetValue) : 0);
      }, 0);
    }, 0);

    return totalFromFormData + totalFromAllAssets;
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
      if (allAssets[header]) {
        return allAssets[header].reduce((acc, asset) => {
          return acc + (asset.assetValue ? Number(asset.assetValue) : 0);
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
          '#71B280',
        ],
      }],
    };
  };
  
  
  
  return (
    <div className="assetsandpiecontainer">
    <div className="assets-container">
      {headers.map((header) => (
        <div key={header} className="assets-section">
          <h3>{header}
            {formData[header] ? 
              <button  onClick={() => handleAdd(header)} className="assets-remove-icon">-</button> :
              <button onClick={() => handleAdd(header)} className="assets-add-icon">+</button>
            }
          </h3>
          
          {allAssets[header] && allAssets[header].map((asset, index) => (
  <div key={index} className="asset-item">
    {editMode && editMode.assetId === asset._id ? (
      <>
        {asset.assetTitle}: $
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
        {asset.assetTitle}: ${asset.assetValue}
        <div className="asset-action-buttons">
          <button className="assets-edit-button" onClick={() => handleEditAsset(header, asset)}>Edit</button>
          <button className="assets-delete-button" onClick={() => handleDeleteAsset(header, asset)}>Delete</button>
        </div>
      </>
    )}
  </div>
))}

          
          {formData[header] && (
            <div className="assets-input-container">
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
              <button onClick={() => handleSubmit(header)} className="assets-submit">Submit</button>
            </div>
          )}
        </div>
      ))}
            <div className="assets-section">
                <h3>Total Assets</h3>
                <div className='asset-item-total'>${computeTotal()}</div>
            </div>
    </div>
    <div className="assets-pie-section">
                <h3>Pie Chart of Assets</h3>
                <Pie data={getPieData()} options={pieOptions} />
            </div> 
    </div>
    

  );
};

export default Assets;