const { Pool } = require('pg');

const pool = new Pool({
    user: 'test_user',
    host: 'dpg-cihrjjd9aq012evopd00-a.oregon-postgres.render.com',
    database: 'zp_test_base',
    password: 'iEPoXXHP3TOGd0Znd144nYwU4XZJo0Sz',
    port: 5432,
    ssl: true
});

pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
})

module.exports = pool;
