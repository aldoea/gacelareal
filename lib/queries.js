'use strict'

const connectDb = require('./db')

function upsertAssignature(doc) {
    return new Promise(async function(resolve, reject) {
        try {
            let {clave, grupo, materia, maestro} = doc;
            let db = await connectDb();
            let result = await db.collection('assignatures').updateOne({clave: clave, grupo: grupo},
                {$set: {
                    materia: materia,
                    maestro: maestro
                }},
                {upsert: true}
            )
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}

function getAssignatures() {
    return new Promise(async function(resolve, reject) {
        try {
            let db = await connectDb();
            db.collection('assignatures').find({}).toArray(function(err, docs) {
                console.log('Assignatures finded:', docs.length);
                resolve(docs);
            });
        } catch (err) {
            reject(err);
        }
    });
}
module.exports = {
    upsertAssignature,
    getAssignatures
}