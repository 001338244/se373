const mongoose = require('mongoose');

let employeeSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    department: String,
    startDate: Date,
    jobTitle: String,
    salary: Number
});

module.exports = mongoose.model('Employee', employeeSchema);