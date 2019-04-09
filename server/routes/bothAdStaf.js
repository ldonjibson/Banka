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
let transporter = require('../helpers/mailer')


let server = express();
const router = express.Router();
let url = '/api/v1/';

let config = require('../config/config.js')

// server.set('superSecret', config.secret);

// router.use();
// router.use('', jwtverify);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));


//credit account
router.post('/transactions/:accountNumber/credit', jwtStaffVerify, (req, res) => {
	let getUser = helper.togetUser(req);
	if (getUser) {
		//the field with "creditAmount" name
		const getAmountcredit = req.body['creditAmount'] || 0.0;
		//verify that the account number exist
		const getacc = accounts.find(acc => acc.accountNumber === Number(req.params.accountNumber));
		if (!getacc){
			res.json({
				"status":2004,
				"error": `Cannot find a matching account number ${req.params.accountNumber}`
			})
		}
		let initialAmount = parseFloat(getacc.balance);
		const newAmount = parseFloat(getAmountcredit) + initialAmount;
		//Replace the old balance with the new one
		getacc.balance = newAmount;
		// create a new transaction 
		const newTransaction = {
			"id": transactions.length + 1,
	        "createdOn": new Date().toISOString(),
			"transactionType": "credit",
	        "accountNumber": getacc.accountNumber,
			"cashier": getUser.id,
			"amount": getAmountcredit,
			"oldBalance": initialAmount,
			"newBalance": getacc.balance,
		}
		// push the new transaction to the data
		transactions.push(newTransaction);

		// console.log(transactions);
		const getaccowner = users.find(accowner => accowner.id === Number(getacc.owner));
	    console.log(getaccowner.email)
	    let mailOptions = {
	        from: '"Krunal Lathiya" <ckagoxozic@gmail.com>', // sender address
	        to: getaccowner.email, // list of receivers
	        subject: "Ebanka Notification", // Subject line
	        text: `hello ${getaccowner.firstName}, you have been credited with ${getAmountcredit} your new balance is ${getacc.balance}`, // plain text body
	        html: '<b>hello ${getaccowner.firstName}, you have been credited with ${getAmountcredit} your new balance is ${getacc.balance}</b>' // html body
	    };
	    transporter.transporter.sendMail(mailOptions, (error, info) =>{
	    	if (error){
	    		console.log(error)
				res.json({
					"status": 1000,
					"data": {
						"transactionId": newTransaction.id,
						"accountNumber": newTransaction.accountNumber,
						"amount": newTransaction.amount,
						"cashier": newTransaction.cashier,
						"transactionType": newTransaction.transactionType,
						"accountBalance": newTransaction.newBalance,
						"oldBalance": newTransaction.oldBalance,
						"from": "Kelvin Magic"
					},
					"mail": error
				});
	    	} else {
				res.json({
					"status": 1000,
					"data": {
						"transactionId": newTransaction.id,
						"accountNumber": newTransaction.accountNumber,
						"amount": newTransaction.amount,
						"cashier": newTransaction.cashier,
						"transactionType": newTransaction.transactionType,
						"accountBalance": newTransaction.newBalance,
						"oldBalance": newTransaction.oldBalance,
						"from": "Kelvin Magic"
					},
					"mail": info.response
				});
	    	}
	    });

	} else {
		res.json({
			"status": 1004,
			"error": "Invalid User Stay Out!"
		})
	}
});


router.post('/transactions/:accountNumber/debit', jwtStaffVerify, (req, res) => {
	let getUser = helper.togetUser(req);
	if (getUser) {
		//the field with "creditAmount" name
		const getAmountcredit = req.body['debitAmount'] || 0.0;
		//verify that the account number exist
		const getacc = accounts.find(acc => acc.accountNumber === Number(req.params.accountNumber));
		if (!getacc){
			res.json({
				"status":2004,
				"error": `Cannot find a matching account number ${req.params.accountNumber}`
			})
		}
		let initialAmount = parseFloat(getacc.balance);
		const newAmount = initialAmount - parseFloat(getAmountcredit);
		//Replace the old balance with the new one
		getacc.balance = newAmount;
		// create a new transaction 
		const newTransaction = {
			"id": transactions.length + 1,
	        "createdOn": new Date().toISOString(),
			"transactionType": "credit",
	        "accountNumber": getacc.accountNumber,
			"cashier": getUser.id,
			"amount": getAmountcredit,
			"oldBalance": initialAmount,
			"newBalance": getacc.balance,
			// "from": "Kelvin Magic"
		}
		// push the new transaction to the data
		transactions.push(newTransaction);

		// console.log(transactions); 
		const getaccowner = users.find(accowner => accowner.id === Number(getacc.owner));
	    let mailOptions = {
	        from: '"Krunal Lathiya" <ckagoxozic@gmail.com>', // sender address
	        to: "ckagoxozic@gmail.com", //getaccowner.email, // list of receivers
	        subject: "Ebanka Notification", // Subject line
	        text: `hello ${getaccowner.firstName}, you have been debited by ${getAmountcredit} your new balance is ${getacc.balance}`, // plain text body
	        html: '<b>hello ${getaccowner.firstName}, you have been credited with ${getAmountcredit} your new balance is ${getacc.balance}</b>' // html body
	    };
	    transporter.transporter.sendMail(mailOptions, (error, info) =>{
	    	if (error){
	    		console.log(error)
				res.json({
					"status": 1000,
					"data": {
						"transactionId": newTransaction.id,
						"accountNumber": newTransaction.accountNumber,
						"amount": newTransaction.amount,
						"cashier": newTransaction.cashier,
						"transactionType": newTransaction.transactionType,
						"accountBalance": newTransaction.newBalance,
						"oldBalance": newTransaction.oldBalance,
						"from": "Kelvin Magic"
					},
					"mail": error
				});
	    	} else {
				res.json({
					"status": 1000,
					"data": {
						"transactionId": newTransaction.id,
						"accountNumber": newTransaction.accountNumber,
						"amount": newTransaction.amount,
						"cashier": newTransaction.cashier,
						"transactionType": newTransaction.transactionType,
						"accountBalance": newTransaction.newBalance,
						"oldBalance": newTransaction.oldBalance
					},
					"mail": info.response
				});
	    	}
	    });

	} else {
		res.json({
			"status": 1004,
			"error": "Invalid User Stay Out!"
		})
	}
});


module.exports = router;