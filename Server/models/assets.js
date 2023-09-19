const mongoose = require("mongoose");

const assetsSchema = new mongoose.Schema({
    category: String,
    asset: [
      {
        assetTitle: String,
        assetValue: Number,
      }
    ],
  });

const Assets = mongoose.model('Assets', assetsSchema);

module.exports = Assets; 