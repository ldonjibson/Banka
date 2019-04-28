import dotenv from 'dotenv';
import { Pool, Client } from 'pg';

dotenv.config();

const connectionString = `postgres://jfnwebwmbjzxme:c0d9578448b40a3a9bd186963c6b206e953305008b46b0ebb9785d743ff0665a@ec2-23-23-241-119.compute-1.amazonaws.com:5432/d1mu1qpl67gnqg`

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
