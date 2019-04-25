/*

*/
import * as  helper from '../helpers/helper'
import bcrypt from 'bcryptjs'; 
import {pool} from './index.js'
import {sendNotificationMail} from '../helpers/mailer';



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
