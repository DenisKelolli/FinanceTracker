const mongoose = require("mongoose");

const expensesSchema = new mongoose.Schema({
    category: String,
    expenses: [
      {
        expensesTitle: String,
        expensesValue: Number,
      }
    ],
  });

const Expenses = mongoose.model('Expenses', expensesSchema);

module.exports = Expenses; 