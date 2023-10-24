const mongoose = require("mongoose");

const incomesSchema = new mongoose.Schema({
    category: String,
    income: [
      {
        incomeTitle: String,
        incomeValue: Number,
      }
    ],
  });

const Incomes = mongoose.model('Incomes', incomesSchema);

module.exports = Incomes; 