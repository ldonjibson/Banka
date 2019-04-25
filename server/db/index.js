import dotenv from 'dotenv'
dotenv.config()
import { Pool, Client } from 'pg'


// // if ( process.env.NODE_ENV === 'test' ) { 
const pool = new Pool({
	'user': process.env.DB_USER_TEST,
	'host': process.env.DB_HOST_TEST,
	'database': process.env.DB_NAME_TEST,
	'password': process.env.DB_PASS_TEST,
	'port': process.env.DB_PORT_TEST
});


export {
	pool,
}

// } else {
// 	const pool = new Pool({
// 		'user': process.env.DB_USER,
// 		'host': process.env.DB_HOST,
// 		'database': process.env.DB_NAME,
// 		'password': process.env.DB_PASS,
// 		'port': process.env.DB_PORT	
// 	});

// export {
// 	pool,
// }
// }
