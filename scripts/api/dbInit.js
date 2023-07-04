const pool = require('./dbConfig');


const dbInit = () => {
    pool.query(`
        CREATE TABLE IF NOT EXISTS request_schema (
            id SERIAL NOT NULL PRIMARY KEY,
            json_structure VARCHAR(5000),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );`, (error, results) => {
        if (error) {
            throw error
        }
    });

    // Add new columns
    pool.query(`
    ALTER TABLE IF EXISTS request_schema ADD COLUMN IF NOT EXISTS json_structure VARCHAR(5000);    
    `, (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }
    });
};

module.exports = dbInit;


