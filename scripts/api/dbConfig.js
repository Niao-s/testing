const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PgUsername || 'test_req_base_v2_user',
    host: process.env.PgHost ||'dpg-ckc7a4usmu8c73apuo00-a.oregon-postgres.render.com',
    database: process.env.PgBaseName || 'test_req_base_v2',
    password: process.env.PgPassword || 'P9eOqXKLQWG5xOT0z8zbwDprZ9uaYnog',
    port: 5432,
    ssl: true
});

pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
})

module.exports = pool;
