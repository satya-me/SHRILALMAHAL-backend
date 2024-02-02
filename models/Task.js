// model.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  randomNumber: Object,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
