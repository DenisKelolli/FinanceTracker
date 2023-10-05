const mongoose = require("mongoose");

const TransactionsSchema = new mongoose.Schema({
    transactionName: String,
    type: String,
    date: { type: Date, default: Date.now },
    amount: Number
});
  
const Transactions = mongoose.model('Transactions', TransactionsSchema);

module.exports = Transactions;
