const mongoose = require("mongoose");

const liabilitiesSchema = new mongoose.Schema({
    category: String,
    liability: [
      {
        liabilityTitle: String,
        liabilityValue: Number,
      }
    ],
  });

const Liabilities = mongoose.model('Liabilities', liabilitiesSchema);

module.exports = Liabilities; 