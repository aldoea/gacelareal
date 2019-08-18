'use strict'
const cheerio = require('cheerio');
const request = require('request');
const iconv  = require('iconv-lite');
const url = "https://gacela.itc.mx/inscripciones/consultas/horarios_semestre.php?cve_esp=14";
var requestOptions  = { encoding: null, method: "GET", uri: url};


function getSchedules() {
  return new Promise(function(resolve, reject) {
    try {
      request(requestOptions, (err, res, body) => {
        if (!err && (res.statusCode >= 200 && res.statusCode <= 206)) {
          var utf8String = iconv.decode(Buffer.from(body), "ISO-8859-1");
          let $ = cheerio.load(utf8String);
          let rows = $('form[name="grupos_base"] .datalist_border tr');
          let json = [];
          for(var i = 0; i < rows.length; i ++) {
              if(i<=2) continue;
              let cells = $(rows[i]).find('td');
              let clave = $(cells[0]).text();
              let grupo = $(cells[1]).text();
              let materia = $(cells[2]).text();
              let maestro = $(cells[3]).text();
              json.push( {
                'clave': clave,
                'grupo': grupo,
                'materia': materia,
                'maestro': maestro
              });
          }
          resolve(json);
        }
      });
    } catch (err) {
      reject(err)
    }
  });
}

module.exports = {
  getSchedules
}