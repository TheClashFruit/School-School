import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),

  database: process.env.DB_NAME!,

  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,

  connectionLimit: 10,
  idleTimeout: 10000,

  decimalNumbers: true
});

export default pool;
