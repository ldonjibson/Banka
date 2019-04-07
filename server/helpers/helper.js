/*
This are random functions that are used repeately through out the Api
*/
let users = require('../datastore/user.js')
let accounts = require('../datastore/account.js')

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
	const getUser = users.find(usr => usr.email === req.decoded.email);
	if(getUser){
		return getUser;
	}
}

//exports
module.exports = {
	ranDom,
	togetUser,
	uniqueAccNumber,
}