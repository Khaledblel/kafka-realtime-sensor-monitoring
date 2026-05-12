const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tp_kafka',
    password: 'root',
    port: 5432,
});

pool.query(`
    CREATE TABLE IF NOT EXISTS kafka_messages (
        id SERIAL PRIMARY KEY,
        topic VARCHAR(255),
        partition INT,
        message_offset BIGINT,
        message_key VARCHAR(255),
        payload JSONB
    );
`).then(() => console.log("Table 'kafka_messages' prête !"))
  .catch(err => console.error("Erreur de création de table", err));

module.exports = pool;