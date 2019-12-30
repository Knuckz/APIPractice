const { Pool } = require('pg');                             //Postgresql   
const config = require('../configs');

const pool = new Pool({
    connectionString: config.connectionString,
});

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, (err, res) => {
            let date = Date.now();
            if (!!res) {
                console.log('executed query', { text, date, rows: res.rowCount })
            }
            if (!!callback){
                callback(err, res);
            }
        })
    },
}