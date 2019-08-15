'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {getAssignatures} = require('./lib/queries.js');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.listen(8080);

console.log("\n\nApp listening on port 8080");

app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});


app.get('/api/assignatures', async function(req, res) {
    try{
        let assignatures = await getAssignatures();
        let response = {
            'success' : true,
            'status' : true,
            'message' : "Asignaturas encontradas: " + assignatures.length,
            'assignatures' : assignatures
        }
        res.status(200).send(response);
    }catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
}); //End of /api/assignatures

module.exports = app;