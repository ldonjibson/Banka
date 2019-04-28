// import dotenv from 'dotenv';
import { Pool, Client } from 'pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL

const pool = new Pool({
  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASS,
  // port: process.env.DB_PORT
	connectionString: connectionString,
});


export {
  pool,
};
