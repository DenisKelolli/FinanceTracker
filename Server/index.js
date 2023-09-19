const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = "3000";
const Assets = require("./models/assets")


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