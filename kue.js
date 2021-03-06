var kue = require('kue');
var Queue = kue.createQueue();

let scheduleJob = data => {
    Queue.createJob(data.jobName, data.params)
         .attempts(3)
         .delay(data.time)
         .save();
};

module.exports = {
    scheduleJob
};