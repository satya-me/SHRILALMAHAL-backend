// queue.js

const Queue = require('bull');
const mongoose = require('mongoose');
const Task = require('../models/Task');

const queue = new Queue('databaseQueue', {
    redis: {
        port: 6379,
        host: '127.0.0.1',
    },
});

queue.process(async (job) => {
    const data = job.data;
    console.log({ data });
    try {
        // Use the Task model to insert data into MongoDB
        await Task.create(data);
        console.log(`Task inserted successfully: ${JSON.stringify(data)}`);
    } catch (error) {
        console.error(`Error inserting task: ${error.message}`);
        throw error;
    }
});

module.exports = queue;

