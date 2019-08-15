'use strict'
const {getSchedules} = require('./lib/scrapper.js');
const {upsertAssignature} = require('./lib/queries.js');

async function main(){
    try {   
        let results = await getSchedules()
        console.log('Assignatures fetched:', results.length);
        
        for(const assignature of results) {
            let dbres = await upsertAssignature(assignature);
            //console.log(dbres.result);
        }
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(0);
    }
}

main();
