import pkg from 'pg';

const { Pool } = pkg;

export const db = new Pool({
    host: "dpg-d3anb6hgv73c739c9qt0-a.oregon-postgres.render.com",
    user: "root",
    password: "6qqUGhwmqsPpivI770v72qxgpc392LVn",
    database: "gerenciamentocontatos",
    port: 5432,
    ssl: {
        rejectUnauthorized: false 
    },
    max: 5, 
    idleTimeoutMillis: 10000, 
    connectionTimeoutMillis: 5000
});
