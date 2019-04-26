/*
This are random functions that are used repeately through out the Api
*/
import {pool} from '../db/index';
let db = pool.pool

const ranDom = () => {
	const accNum = 1000000000 + Math.floor((Math.random() * 999999999));
	return accNum;
}

const uniqueAccNumber = () => {
	const accNum = ranDom() - Math.floor((Math.random() * 50000) + Math.random() * 30000);
	return accNum
}


//tally the code token from decode and check if the email exists
const togetUser = (req) =>{
	db.query(`SELECT * FROM users WHERE email = $1`, [req.decoded.email])
	.then(response =>{
		if(!response.rows[0]){
			res.status(404).json({
					"status":404,
					"error":"User does not exist"
				});
			} else if(response.rows[0]){
			return true
		}
	});
}

const authHelper = (error, res) =>{
	if (error.array()[0].param = 'email' || 'password') {
		res.status(422).json({
			"status":422,
			"error": `${error.array()[0].msg} for email or password not up to 5 characters`		
		})
	}
}

//exports
export {
	ranDom,
	togetUser,
	uniqueAccNumber,
	authHelper,
}