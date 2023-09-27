import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NetWorth.css";

const NetWorth = () => {
  const [assetsTotal, setAssetsTotal] = useState(0);
  const [liabilitiesTotal, setLiabilitiesTotal] = useState(0);
  const [netWorth, setNetWorth] = useState(0);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const assetsResponse = await axios.get('http://localhost:3000/assets');
        let assetsSum = 0;
        if (assetsResponse.data && Array.isArray(assetsResponse.data)) {
          assetsResponse.data.forEach(category => {
            if (category.asset && Array.isArray(category.asset)) {
              category.asset.forEach(assetItem => {
                assetsSum += assetItem.assetValue;
              });
            }
          });
          setAssetsTotal(assetsSum);
        } else {
          console.error("Unexpected structure for assets:", assetsResponse.data);
        }
    
        const liabilitiesResponse = await axios.get('http://localhost:3000/liabilities');
        let liabilitiesSum = 0;
        if (liabilitiesResponse.data && Array.isArray(liabilitiesResponse.data)) {
          liabilitiesResponse.data.forEach(category => {
            if (category.liability && Array.isArray(category.liability)) {
              category.liability.forEach(liabilityItem => {
                if (liabilityItem.liabilityValue) { 
                  liabilitiesSum += liabilityItem.liabilityValue;
                }
              });
            }
          });
          setLiabilitiesTotal(liabilitiesSum);
        } else {
          console.error("Unexpected structure for liabilities:", liabilitiesResponse.data);
        }
    
        setNetWorth(assetsSum - liabilitiesSum);
      } catch (error) {
        console.error("Error fetching assets or liabilities:", error.message);
      }
    };

    fetchTotals();
  }, []);



  return (
    <div className="networth-container">
      <div className="networth-row">
        <div className="networth-icon-left">icon</div>
      </div>
      <div className="networth-row">
        <div className="networth-title">Net Worth</div>
      </div>
      <div className="networth-row">
        <span className="networth-value">${netWorth.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default NetWorth;
