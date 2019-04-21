/*
This are random functions that are used repeately through out the Api
*/
let users = require('../datastore/user.js')
let accounts = require('../datastore/account.js')
const pool = require('../db/index.js')
let db = pool.pool

const ranDom = () => {
	const accNum = 1000000000 + Math.floor((Math.random() * 999999999));
	return accNum;
}


const uniqueAccNumber = () => {
	accNum = ranDom();
	const chkIfAccount = accounts.find(acc => acc.accountNumber === accNum);
	if (chkIfAccount){
		return ranDom() - Math.floor((Math.random() * 50000));
	} else {
		return accNum
	}

}

//tally the code token from decode and check if the email exists
const togetUser = (req) =>{
	// let rows = ''
	db.query(`SELECT * FROM users WHERE email = $1`, [req.decoded.email])
	.then(response =>{
		if(!response.rows[0]){
			res.json({
					"status":404,
					"error":"User does not exist"
				});
			} else if(response.rows[0]){
			return true
		}
	});
}

//exports
module.exports = {
	ranDom,
	togetUser,
	uniqueAccNumber,
}