/*

*/
import * as  helper from '../helpers/helper'
import bcrypt from 'bcryptjs'; 
import {pool} from './index.js'
import {sendNotificationMail} from '../helpers/mailer';

const db = pool

//Staff get all client type user alone
const getAllUsers = (req, res) => {
	db.query(`SELECT users.id, email, firstname, lastname, phone, dob, imageurl FROM users`)
	.then(response => {
		const result = response.rows;
		if (response.rows.length == 0){
			res.status(400).json({
			"status":400,
			"message": "You have no client yet"
			});
		} else {
			res.status(200).json({
			"status":200,
			"data": response.rows
			});
		}
	}).catch (error => 
		res.status(400).json({
			"status": 400,
			"error": error
		}) 
	) 	
}

//From the list of client type user above get a one client type user + bank accounts
const getOneClientTypeUser = (req, res) => {
	const userId = parseInt(req.params.id)
    db.query(`SELECT users.id, email, firstname, lastname, phone, dob, imageurl, accountnumber, accountname, accountphone, accounttype, balance FROM users LEFT JOIN bankaccount as bkacc on bkacc.owner = users.id WHERE users.id = $1`, [userId])
    .then(response =>{
		const result = response.rows;
		if (result.length == 0){
		    res.status(404).json({
		    	"status": 404,
		    	"message": "Not Found"
		    });
		} else {
		    res.status(200).json({
		    	"status": 200,
		    	"data": result
		    });
		}
    }).catch (error => 
	    res.status(400).json({
			"status": 400,
			"error": error
		}) 
	)
}

//Get specific bank account of a specific user + number of transactions
const getSpecificClientBkAcc = (req, res) => {
	const accountNumber = req.params.accountNumber
    db.query(`SELECT bk.id, bk.accountname, accountphone, bk.accountnumber, bk.accounttype, bk.createdOn, bk.status, bk.balance FROM bankaccount as bk WHERE bk.accountnumber = $1`, [accountNumber])
    .then(response => {
		const result = response.rows;
		if (result.length == 0){
		    res.status(404).json({
		    	"status": 404,
		    	"message": "Not Found"
		    });
		} else {
		    res.status(200).json({
		    	"status": 200,
		    	"data": result
		    });
		}
    }).catch (error => 
	    res.status(400).json({
			"status": 400,
			"error": error
		})
	)
}

//Get specific transaction
const getSpecificAccTransactionDetail = (req, res) => {
	const accountNumber = req.params.accountNumber
	const transactionId = req.params.transactionId
    db.query(`SELECT t.id, t.accountnumber, t.createdOn, t.transactiontype, t.transactionid, t.cashier, t.oldBalance, t.newBalance, t.sender, t.recipient, t.fromnumber, t.tonumber, bk.accounttype, bk.accountphone, bk.balance, bk.accountname, bk.status, u.firstname, u.lastname, u.email, u.phone, u.imageurl FROM transaction as t LEFT JOIN bankaccount as bk ON t.accountnumber = bk.accountnumber LEFT JOIN users as u ON bk.owner = u.id  WHERE t.accountnumber = $1 AND t.transactionid = $2`, [accountNumber, transactionId])
    .then(response => {
		const result = response.rows;
			if (result.length == 0){
			    res.status(404).json({
			    	"status": 404,
			    	"message": "No transactions to display"
			    });
			} else {
			    res.status(200).json({
			    	"status": 200,
			    	"data": result
			    });
			}
    }).catch (error => 
	    res.status(400).json({
			"status": 400,
			"error": error
		})
	)
}

//All Account Transactions of a Specific Account Number
const getAllTransactionsofSpecificBkAcc = (req, res) => {
	const accountNumber = req.params.accountNumber
    db.query(`SELECT bk.accountname, accountphone, bk.accountnumber, bk.accounttype, bk.accountphone, bk.status, bk.balance,  t.transactionid, t.createdOn, t.transactiontype, t.cashier, oldBalance, newBalance, sender, recipient, fromnumber, tonumber, u.firstname, u.lastname, u.phone, u.email FROM bankaccount as bk LEFT JOIN transaction as t ON bk.accountnumber = t.accountnumber LEFT JOIN users as u ON bk.owner = u.id WHERE bk.accountnumber = $1`, [accountNumber])
    .then(response => {
		const result = response.rows;
		if (result.length == 0){
		    res.status(404).json({
		    	"status": 404,
		    	"message": "Not Found"
		    });
		} else {
		    res.status(200).json({
		    	"status": 200,
		    	"data": result
		    });
		}
    }).catch (error => 
	    res.status(400).json({
			"status": 400,
			"error": error
		})
	)
}

//Staff can debit and credit user account
//ADD WHERE ACCOUNT IS NOT = "active"
const staffCanDebitAcc = (req, res) =>{
	const staffId = req.decoded.id
	const accountNumber = req.params.accountNumber
	const debitAmount = req.body['debitAmount']
	const sender = req.body['sender'] || null
	const to = req.body['recipient'] || null
	const fromNumber = req.body['fromNumber'] || null
	const toNumber = req.body['toNumber'] || null
	db.query(`SELECT * FROM bankaccount WHERE accountnumber = $1`, [accountNumber])
	.then(response =>{
		const result = response.rows[0];
		if (!result){
		    res.status(404).json({
		    	"status": 404,
		    	"message": "Account not found"
		    });
		} else if (debitAmount !== undefined && debitAmount > 0){
			if (parseFloat(debitAmount) < parseFloat(result.balance)){
				let subtractAmount = parseFloat(result.balance) - parseFloat(debitAmount)
			    db.query(`INSERT INTO transaction(accountname, accountnumber, transactiontype, cashier, oldbalance, newbalance, recipient, tonumber) values($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`, [result.accountname, result.accountnumber, "debit", staffId, result.balance, subtractAmount, to, toNumber]) 
			    .then(response =>{
			    	if(response.rows[0]){
			    		db.query(`UPDATE bankaccount SET balance = $1 WHERE accountnumber = $2 RETURNING balance, owner`, [subtractAmount, result.accountnumber])
			    		.then(response =>{
			    			const getUser = response.rows[0]
			    			if (getUser){
			    				db.query(`SELECT * FROM users WHERE id = $1`, [getUser.owner])
			    				.then(response =>{
			    					const emailparam = response.rows[0]
			    					if (response.rows[0]){
			    						sendNotificationMail(emailparam.email, "Ebanka Notification", `hello ${emailparam.firsname}, you have been credited by ${debitAmount} your new balance is ${getUser.balance}`, `<b>hello ${emailparam.firsname}, you have been credited by ${debitAmount} your new balance is ${getUser.balance}</b>`)
			    						.then((response)=>{
										    res.status(201).json({
										    	"status": 201,
										    	"message": "Account Successfully Dedited"
										    });
			    						})
									}
								})
							}
						})
					}
				})
			} else {
			    res.status(401).json({
			    	"status": 401,
			    	"message": "Not enough fund in this account"
			    });
			}
		} else {
			res.status(422).json({
				"status": 422,
				"message": "Invalid value provided" 
			})
		}
	}).catch (error => 
	    res.status(400).json({
			"status": 400,
			"error": error
		}) 
	)
}

const staffCanCreditAcc = (req, res) =>{
	const staffId = req.decoded.id
	const accountNumber = req.params.accountNumber
	const creditAmount = req.body['creditAmount']
	const sender = req.body['sender'] || null
	const to = req.body['recipient'] || null
	const fromNumber = req.body['fromNumber'] || null
	const toNumber = req.body['toNumber'] || null
	db.query(`SELECT * FROM bankaccount WHERE accountnumber = $1`, [accountNumber])
	.then(response =>{
		const result = response.rows[0];
		if (!result){
		    res.status(404).json({
		    	"status": 404,
		    	"message": "Account not found"
		    });
		} else if(creditAmount !== undefined && debitAmount > 0){
			let addAmount = parseFloat(result.balance) + parseFloat(creditAmount)
		    db.query(`INSERT INTO transaction(accountname, accountnumber, transactiontype, cashier, oldbalance, newbalance, sender, fromnumber) values($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`, [result.accountname, result.accountnumber, "credit", staffId, result.balance, addAmount, sender, fromNumber]) 
		    .then(response =>{
		    	if(response.rows[0]){
		    		db.query(`UPDATE bankaccount SET balance = $1 WHERE accountnumber = $2 RETURNING balance, owner`, [addAmount, result.accountnumber])
		    		.then(response =>{
		    			const getUser = response.rows[0]
		    			if (getUser){
		    				db.query(`SELECT * FROM users WHERE id = $1`, [getUser.owner])
		    				.then(response =>{
		    					const emailparam = response.rows[0]
		    					if (response.rows[0]){
		    						sendNotificationMail(emailparam.email, "Ebanka Notification", `hello ${emailparam.firsname}, you have been credited by ${creditAmount} your new balance is ${getUser.balance}`, `<b>hello ${emailparam.firsname}, you have been credited by ${creditAmount} your new balance is ${getUser.balance}</b>`)
		    						.then((response) =>{
									    res.status(201).json({
									    	"status": 201,
									    	"message": "Account Successfully Credited"
									    });
		    						})
								}
							})
						}
					})
		    	}
		    });
		} else {
			res.status(422).json({
				"status": 422,
				"message": "Invalid value provided" 
			})
		}
	}).catch (error => 
	    res.status(400).json({
			"status": 400,
			"error": error
		})
	)
}
