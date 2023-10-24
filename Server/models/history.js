const mongoose = require('mongoose');

const historiesSchema = new mongoose.Schema({
    type: String,
    value: Number,
    month: String,
    year: Number,
});

const Histories = mongoose.model('Histories', historiesSchema);
module.exports = Histories;
