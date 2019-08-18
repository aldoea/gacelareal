'use strict'
var cron = require('node-cron');
const {getSchedules} = require('./lib/scrapper.js');
const {upsertAssignature} = require('./lib/queries.js');

async function start(){
    console.log('Cronmain loaded...');
    
    try { 
        cron.schedule("* * * * *", async function() {
            console.log('Cron start');
            let results = await getSchedules()
            console.log('Assignatures fetched:', results.length);
            for(const assignature of results) {
                let dbres = await upsertAssignature(assignature);
            }
            console.log('Cron ends');
        });
    } catch (err) {
        console.log(err);
        process.exit(0);
    }
}
start();
module.exports = {
    start
}
