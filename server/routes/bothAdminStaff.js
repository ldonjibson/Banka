const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); // used to encrypt password
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
let helper = require('../helpers/helper')
let users = require('../datastore/user')
let transactions = require('../datastore/transaction')
let accounts = require('../datastore/account')
const jwtStaffVerify = require('../middleware/verifyStaff')
const paramChecks = require('../middleware/paramCheck')

let upload = require('../helpers/upload')


let server = express();
const router = express.Router();
let url = '/api/v1/';

let config = require('../config/config')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));


//Get all transactions
router.get('/allclients/transactions', jwtStaffVerify, (req,res) =>{
	const allTrans = transactions
	res.json({
		"status": 206,
		"data": transactions
	})
}); 

//Get individual client transaction
router.get('/clienttransaction/:id/detail/',paramChecks, jwtStaffVerify, (req,res) =>{
	const clientTrans = transactions.find(trans => trans.id === Number(req.params.id));
	if (clientTrans){
		res.json({
			"status": 200,
			"data": clientTrans
		});
	} else {
		res.json({
			"status":401,
			"error": "transaction ID does not exist!"
		});
	}

});

// Get transations done by Staff/Admin themeselves
router.get('/mydone/usertransaction/', jwtStaffVerify, (req, res) =>{
	let getUser = helper.togetUser(req);
	if (getUser){
		const gettrans = transactions.filter(trans => trans.cashier === getUser.id)
		// console.log(gettrans)
		if (gettrans) {
			res.json({
				"status":201,
				"data": gettrans
			})
		} else {
			res.json({
				"status": 200,
				"error": "You have not made any transaction at all"
			})
		}
	} else {
		res.json({
			"status": 403,
			"error": "Invalid User Stay Out!"
		})
	}
});

router.delete('/accounts/:accountNumber',paramChecks, jwtStaffVerify, (req, res) => {
	let getUser = helper.togetUser(req);
	if (getUser) {
		const getAcc = accounts.find(acc => acc.accountNumber === Number(req.params.accountNumber));
		if (!getAcc){
			res.json({
				"status":401,
				"error": `Cannot find a matching account number ${req.params.accountNumber}`
			})
		}
		// get the position of the account to be deleted
		const index = accounts.indexOf(getAcc);
		//delete the account at tha position
		accounts.splice(index, 1);

		res.json({
			"status": 204,
			"message": `Account ${getAcc.accountNumber} deleted  Successfully` 
		});

	} else {
		res.json({
			"status": 403,
			"error": "Invalid User Stay Out!"
		})
	}
});

router.patch('/account/:accountNumber',paramChecks, jwtStaffVerify, (req, res) => {
	let getUser = helper.togetUser(req);
	if (getUser) {
		const getAcc = accounts.find(acc => acc.accountNumber === Number(req.params.accountNumber));
		if (!getAcc){
			res.json({
				"status":401,
				"error": `Cannot find a matching account number ${req.params.accountNumber}`
			})
		}
		getAcc.status = "dormant";
		
		res.json({
			"status": 201,
			"data": getAcc 
		});

	} else {
		res.json({
			"status": 403,
			"error": "Invalid User Stay Out!"
		});
	}
});


//Create bank account for existing users 
router.post('/createbank/accounts', jwtStaffVerify, (req, res) => {
	const getUser = helper.togetUser(req);
	const getAllAcc = accounts.length + 1;
	if (getUser){
		getuseremail = req.body['email'] || null
		if (getuseremail === null){
			res.json({
				"status": 401,
				"error": "No email was provided"
			})
		} else {
			chKUser = users.find(usr=> usr.email === getuseremail)
			if(!chKUser){
				res.json({
					"status": 400,
					"error": "User does not exist in the database create the user before a bank account"
				})
			} else {
				getbalance = parseFloat(req.body['openingBalance']) || parseFloat(0.12);
				let creatBank = {
			        "id": getAllAcc,
			        "accountNumber": helper.uniqueAccNumber(),
			        "createdOn": new Date().toISOString(),
			        "owner": chKUser.id,
			        "type": "current",
			        "status": "active",
			        "balance": getbalance,
			    }
			    res.json({
			    	"status": 201,
			    	"data": { 
			    		"accountNumber": creatBank['accountNumber'],
			    		"firstName": chKUser.firstName,
			    		"lastName":chKUser.lastName,
			    		"email": chKUser.email,
			    		"type": creatBank['type'],
			    		"openingBalance": creatBank['balance']
			    	}
			    });
			}
		}

	} else {
		res.json({
			"status": 403,
			"error":"Log in to Create a Bank Account for Users"
		})
	}
});

module.exports = router;