const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); // used to encrypt password
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
let helper = require('../helpers/helper')
let users = require('../datastore/user.js')
let transactions = require('../datastore/transaction.js')
let accounts = require('../datastore/account.js')
const jwtStaffVerify = require('../middleware/verifyStaff.js')
const paramChecks = require('../middleware/paramCheck')
let upload = require('../helpers/upload')
let transporter = require('../helpers/mailer')


let server = express();
const router = express.Router();
let url = '/api/v1/';

let config = require('../config/config.js')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));


//credit account
router.post('/transactions/:accountNumber/credit',paramChecks, jwtStaffVerify, (req, res) => {
	let getUser = helper.togetUser(req);
	if (!getUser){
		res.status(403).json({
			"status": 403,
			"error": "Invalid User Stay Out!"
		})
	} else {
		//the field with "creditAmount" name
		const getAmountcredit = req.body['creditAmount'] || 0.0;
		const getFrom = req.body['from'] || "Self";
		const getFromNumber = req.body['fromNumber'] || "593 665 00993 393";
		//verify that the account number exist
		const getAcc = accounts.find(acc => acc.accountNumber === Number(req.params.accountNumber));
		if (!getAcc){
			res.json({
				"status":401,
				"error": `Cannot find a matching account number ${req.params.accountNumber}`
			})
		} else {
			let initialAmount = parseFloat(getAcc.balance);
			const newAmount = parseFloat(getAmountcredit) + initialAmount;
			//Replace the old balance with the new one
			getAcc.balance = newAmount;
			// create a new transaction 
			const newTransaction = {
				"id": transactions.length + 1,
		        "createdOn": new Date().toISOString(),
				"transactionType": "credit",
		        "accountNumber": getAcc.accountNumber,
				"cashier": getUser.id,
				"amount": getAmountcredit,
				"oldBalance": initialAmount,
				"newBalance": getAcc.balance,
				"from": getFrom,
				"to": "",
				"fromNumber": getFromNumber,
				"toNumber": "" 
			}
			// push the new transaction to the data
			transactions.push(newTransaction);

			const getAccowner = users.find(accowner => accowner.id === Number(getAcc.owner));
		    let mailOptions = {
		        from: '"Krunal Lathiya" <ckagoxozic@gmail.com>', // sender address
		        to: getAccowner.email, // list of receivers
		        subject: "Ebanka Notification", // Subject line
		        text: `hello ${getAccowner.firstName}, you have been credited with ${getAmountcredit} your new balance is ${getAcc.balance}`, // plain text body
		        html: `<b>hello ${getAccowner.firstName}, you have been credited with ${getAmountcredit} your new balance is ${getAcc.balance}</b>` // html body
		    };
		    transporter.transporter.sendMail(mailOptions, (error, info) =>{
		    	if (error){
		    		console.log(error)
					res.status(201).json({
						"status": 201,
						"data": {
							"transactionId": newTransaction.id,
							"accountNumber": newTransaction.accountNumber,
							"amount": newTransaction.amount,
							"cashier": newTransaction.cashier,
							"transactionType": newTransaction.transactionType,
							"accountBalance": newTransaction.newBalance,
							"oldBalance": newTransaction.oldBalance,
							"from": newTransaction.from,
							"to": "", 
							"fromNumber": newTransaction.fromNumber,
							"toNumber": "" 
						},
						"mail": error
					});
		    	} else {
					res.status(201).json({
						"status": 201,
						"data": {
							"transactionId": newTransaction.id,
							"accountNumber": newTransaction.accountNumber,
							"amount": newTransaction.amount,
							"cashier": newTransaction.cashier,
							"transactionType": newTransaction.transactionType,
							"accountBalance": newTransaction.newBalance,
							"oldBalance": newTransaction.oldBalance,
							"from": newTransaction.from,
							"to": "", 
							"fromNumber": newTransaction.fromNumber,
							"toNumber": "" 
						},
						"mail": info.response
					});
		    	}
		    });
		}
	}
});


router.post('/transactions/:accountNumber/debit',paramChecks, jwtStaffVerify, (req, res) => {
	let getUser = helper.togetUser(req);
	if (!getUser){
		res.status(403).json({
			"status": 403,
			"error": "Invalid User Stay Out!"
		})
	} else {
		//the field with "creditAmount" name
		const getAmountcredit = req.body['debitAmount'] || 0.0;
		const getTo = req.body['to'] || "Self";
		const getToNumber = req.body['toNumber'] || "593 665 00993 393";
		//verify that the account number exist
		const getAcc = accounts.find(acc => acc.accountNumber === Number(req.params.accountNumber));
		if (!getAcc){
			res.status(401).json({
				"status":401,
				"error": `Cannot find a matching account number ${req.params.accountNumber}`
			})
		} else {
			let initialAmount = parseFloat(getAcc.balance);
			const newAmount = initialAmount - parseFloat(getAmountcredit);
			if (newAmount < 0){
				res.status(401).json({
					"status": 401,
					"error": "You donot have sufficient Amount to perform this operation"
				})
			} else {
				//Replace the old balance with the new one
				getAcc.balance = newAmount;
				// create a new transaction 
				const newTransaction = {
					"id": transactions.length + 1,
			        "createdOn": new Date().toISOString(),
					"transactionType": "debit",
			        "accountNumber": getAcc.accountNumber,
					"cashier": getUser.id,
					"amount": getAmountcredit,
					"oldBalance": initialAmount,
					"newBalance": getAcc.balance,
					"from": "",
					"to": getTo,
					"fromNumber": "",
					"toNumber": getToNumber 
				}
				// push the new transaction to the data
				transactions.push(newTransaction);

				const getAccowner = users.find(accowner => accowner.id === Number(getAcc.owner));
			    console.log(getAccowner.email)
			    let mailOptions = {
			        from: '"Krunal Lathiya" <ckagoxozic@gmail.com>', // sender address
			        to: "ckagoxozic@gmail.com", //getAccowner.email, // list of receivers
			        subject: "Ebanka Notification", // Subject line
			        text: `hello ${getAccowner.firstName}, you have been debited by ${getAmountcredit} your new balance is ${getAcc.balance}`, // plain text body
			        html: `<b>hello ${getAccowner.firstName}, you have been debited by ${getAmountcredit}<br>from ${newTransaction.from} your new balance is ${getAcc.balance}</b>` // html body
			    };
			    transporter.transporter.sendMail(mailOptions, (error, info) =>{
			    	if (error){
			    		console.log(error)
						res.status(201).json({
							"status": 201,
							"data": {
								"transactionId": newTransaction.id,
								"accountNumber": newTransaction.accountNumber,
								"amount": newTransaction.amount,
								"cashier": newTransaction.cashier,
								"transactionType": newTransaction.transactionType,
								"accountBalance": newTransaction.newBalance,
								"oldBalance": newTransaction.oldBalance,
								"from": "",
								"to": newTransaction.to,
								"fromNumber": "",
								"toNumber": newTransaction.toNumber 
							},
							"mail": error
						});
			    	} else {
						res.status(201).json({
							"status": 201,
							"data": {
								"transactionId": newTransaction.id,
								"accountNumber": newTransaction.accountNumber,
								"amount": newTransaction.amount,
								"cashier": newTransaction.cashier,
								"transactionType": newTransaction.transactionType,
								"accountBalance": newTransaction.newBalance,
								"oldBalance": newTransaction.oldBalance,
								"from": "",
								"to": newTransaction.to,
								"fromNumber": "",
								"toNumber": newTransaction.toNumber
							},
							"mail": info.response
						});
			    	}
			    });
			}
		}
	}
});


module.exports = router;