const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = "3000";
const Assets = require("./models/assets");
const Liabilities = require("./models/liabilities");


//Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
  }));

  // GET request handler for /assets route
app.get('/assets', async (req, res) => {
  try {
    const allAssets = await Assets.find();
    res.status(200).json(allAssets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets', error: error.message });
  }
});


app.put('/assets', async (req, res) => {
  const { category, assetId, assetValue } = req.body;

  try {
    const assetDocument = await Assets.findOne({ category });
    if (assetDocument) {
      const assetToUpdate = assetDocument.asset.id(assetId);
      if (assetToUpdate) {
        assetToUpdate.assetValue = assetValue;
        await assetDocument.save();
        return res.json({ success: true, message: "Asset updated successfully." });

      }
    }
    res.status(404).json({ success: false, message: "Asset not found." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error.", error: error.message });
  }
});


app.delete('/assets', async (req, res) => {
  const { category, assetId } = req.body;

  try {
    const assetDocument = await Assets.findOne({ category });
    if (assetDocument) {
      const assetToRemove = assetDocument.asset.id(assetId);
      if (assetToRemove) {
        // Remove the subdocument from the array
        assetDocument.asset.pull(assetToRemove);
        await assetDocument.save();
        return res.json({ success: true, message: "Asset updated successfully." });

      }
    }
    res.status(404).json({ success: false, message: "Asset not found." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error.", error: error.message });
  }
});





// POST request handler for /assets route
app.post('/assets', async (req, res) => {
  try {
      // Extract data from the request body
      const { category, assetTitle, assetValue } = req.body;

      // Check if an asset for the given category already exists
      let assetDocument = await Assets.findOne({ category });

      if (assetDocument) {
          // If exists, push the new asset to the asset array
          assetDocument.asset.push({ assetTitle, assetValue });
          await assetDocument.save();
      } else {
          // Otherwise, create a new document
          assetDocument = new Assets({
              category,
              asset: [{ assetTitle, assetValue }]
          });
          await assetDocument.save();
      }

      res.status(200).json({ message: 'Asset added successfully!' });

  } catch (error) {
      res.status(500).json({ message: 'Error adding asset', error: error.message });
  }
});


//Liabilities 

app.get('/liabilities', async (req, res) => {
  try {
    const allAssets = await Liabilities.find();
    res.status(200).json(allAssets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets', error: error.message });
  }
});


app.put('/liabilities', async (req, res) => {
  const { category, liabilityId, liabilityValue } = req.body;

  try {
    const assetDocument = await Liabilities.findOne({ category });
    if (assetDocument) {
      const assetToUpdate = assetDocument.liability.id(liabilityId);
      if (assetToUpdate) {
        assetToUpdate.liabilityValue = liabilityValue;
        await assetDocument.save();
        return res.json({ success: true, message: "Asset updated successfully." });

      }
    }
    res.status(404).json({ success: false, message: "Asset not found." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error.", error: error.message });
  }
});


app.delete('/liabilities', async (req, res) => {
  const { category, liabilityId } = req.body;

  try {
    const assetDocument = await Liabilities.findOne({ category });
    if (assetDocument) {
      const assetToRemove = assetDocument.liability.id(liabilityId);
      if (assetToRemove) {
        // Remove the subdocument from the array
        assetDocument.liability.pull(assetToRemove);
        await assetDocument.save();
        return res.json({ success: true, message: "Asset updated successfully." });

      }
    }
    res.status(404).json({ success: false, message: "Asset not found." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error.", error: error.message });
  }
});



app.post('/liabilities', async (req, res) => {
  try {
      // Extract data from the request body
      const { category, liabilityTitle, liabilityValue } = req.body;

      // Check if an asset for the given category already exists
      let assetDocument = await Liabilities.findOne({ category });

      if (assetDocument) {
          // If exists, push the new asset to the asset array
          assetDocument.liability.push({ liabilityTitle, liabilityValue });
          await assetDocument.save();
      } else {
          // Otherwise, create a new document
          assetDocument = new Liabilities({
              category,
              liability: [{ liabilityTitle, liabilityValue }]
          });
          await assetDocument.save();
      }

      res.status(200).json({ message: 'Asset added successfully!' });

  } catch (error) {
      res.status(500).json({ message: 'Error adding asset', error: error.message });
  }
});




  const start = async () => {
    try {
      await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } catch (e) {
      console.log(e.message);
    }
  };
  
  
  start();