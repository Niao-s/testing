const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PgUsername || 'test_req_base_user',
    host: process.env.PgHost ||'dpg-cm39s80cmk4c73cb059g-a.oregon-postgres.render.com',
    database: process.env.PgBaseName || 'test_req_base',
    password: process.env.PgPassword || 'ZjFZbCVF6BzJK4gFijk5CgtHGo19XBy7',
    port: process.env.PgPort || 5432,
    ssl: true
});

pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
})

module.exports = pool;
