//Start Redis Worker
var kue = require('kue');
var Queue = kue.createQueue();
var nodemailer = require("./app/cron/nodemailer");

Queue.process("sendEmail", async function(job, done) {
    let { data } = job;
    await nodemailer.send(data);
    done();
});