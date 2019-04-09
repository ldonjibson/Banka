const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); // used to encrypt password
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
let helper = require('../helpers/helper')
let users = require('../datastore/user.js')
let transactions = require('../datastore/transaction.js')
let accounts = require('../datastore/account.js')
const jwtStaffVerify = require('../middleware/verifyStaff.js')
let upload = require('../helpers/upload')


let server = express();
const router = express.Router();
let url = '/api/v1/';

let config = require('../config/config.js')

// server.set('superSecret', config.secret);

// router.use();
// router.use('', jwtverify);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));


//Get all transactions
router.get('/allclients/transactions', jwtStaffVerify, (req,res) =>{
	const alltrans = transactions
	res.json({
		"status": 1000,
		"data": transactions
	})
}); 

//Get individual client transaction
router.get('/clienttransaction/:id/detail/', jwtStaffVerify, (req,res) =>{
	const clienttrans = transactions.find(trans => trans.id === Number(req.params.id));
	if (clienttrans){
		res.json({
			"status": 1000,
			"data": clienttrans
		});
	} else {
		res.json({
			"status":2009,
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
				"status":1000,
				"data": gettrans
			})
		} else {
			res.json({
				"status": 1000,
				"erro": "You have not made any transaction at all"
			})
		}
	} else {
		res.json({
			"status": 1004,
			"error": "Invalid User Stay Out!"
		})
	}
});

router.delete('/accounts/:accountNumber', jwtStaffVerify, (req, res) => {
	let getUser = helper.togetUser(req);
	if (getUser) {
		const getacc = accounts.find(acc => acc.accountNumber === Number(req.params.accountNumber));
		if (!getacc){
			res.json({
				"status":2004,
				"error": `Cannot find a matching account number ${req.params.accountNumber}`
			})
		}
		// get the position of the account to be deleted
		const index = accounts.indexOf(getacc);
		//delete the account at tha position
		accounts.splice(index, 1);

		res.json({
			"status": 1000,
			"message": `Account ${getacc.accountNumber} deleted  Successfully` 
		});

	} else {
		res.json({
			"status": 1004,
			"error": "Invalid User Stay Out!"
		})
	}
});

router.patch('/account/:accountNumber', jwtStaffVerify, (req, res) => {
	let getUser = helper.togetUser(req);
	if (getUser) {
		const getacc = accounts.find(acc => acc.accountNumber === Number(req.params.accountNumber));
		if (!getacc){
			res.json({
				"status":2004,
				"error": `Cannot find a matching account number ${req.params.accountNumber}`
			})
		}
		getacc.status = "dormant";
		// console.log(getacc);
		
		res.json({
			"status": 1000,
			"data": getacc 
		});

	} else {
		res.json({
			"status": 1004,
			"error": "Invalid User Stay Out!"
		});
	}
});

module.exports = router;