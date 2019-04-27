import dotenv from 'dotenv';
import { Pool, Client } from 'pg';

dotenv.config();

const connectionString = `postgres://postgres@127.0.0.1:5432/${process.env.DB_NAME}`

const pool = new Pool({
  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASS,
  // port: process.env.DB_PORT,
	connectionString: connectionString,
});


export {
  pool,
};
