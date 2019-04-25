/*

*/
import * as  helper from '../helpers/helper'
import bcrypt from 'bcryptjs'; 
import {pool} from './index.js'
import {sendNotificationMail} from '../helpers/mailer';
let db = pool


//Create bank account
const createBankAcc = (req, res) => {
	let data = Object.keys(req.body);
	let accountNumber = helper.uniqueAccNumber()
	//TODO Remove undefined
	if (!req.body['accountName'] || !req.body['phone'] || !req.body['type'] || !accountNumber) {
		res.status(401).json({
			"status": 401,
			"error": "Please Check, A field is missing"
		});
	} else {
		getbalance = parseFloat(0.12);
		let creatBank = {
	        "accountNumber": accountNumber,
	        "accountName": req.body['accountName'],
	        "createdOn": new Date().toISOString(),
	        "phone": req.body['phone'],
	        "owner": req.decoded.id,
	        "type": req.body['type'],
	        "status": "pending",
	        "balance": getbalance,
	    }
	    db.query(`SELECT * FROM bankaccount WHERE accountName = $1`, [creatBank.accountName])
	    .then (response =>{
	    	if (response.rows !== 0){
				res.status(403).json({
					"status": 403,
					"error": "An bank account with that name already exist"
				});
	    	} else {
			    db.query(`INSERT INTO bankaccount("accountname", "accountnumber", "accountphone", "createdon", "accounttype", "owner", "status", "balance") values($1, $2, $3, $4, $5, $6, $7, $8) RETURNING owner`,[creatBank['accountName'], creatBank['accountNumber'], creatBank['phone'], creatBank['createdOn'], creatBank['type'], creatBank['owner'], creatBank['status'], creatBank['balance']])
			    .then (response =>{
			    	const result = response.rows[0] 
			    	if (result){
						db.query(`SELECT * FROM users WHERE id = $1`, [result.owner])
						.then(response=>{
							let result = response.rows[0]
							if(result){
					    		sendNotificationMail(result.email, "Bank Account Successfully Created", `Your bank account has been created successfully, it will be reviewed and activated, Your ACCOUNT NUMBER IS ${result.accountnumber}, we will contact you with this same email address for further process.`, `<b><Your bank account has been created successfully, it will be reviewed and activated<br>Your ACCOUNT NUMBER IS ${result.accountnumber}<br/>we will contact you with this same email address forfurther process.</b>`)
							    .then((response) => {
								    	res.status(201).json({
								    	"status": 201,
								    	"data": { 
								    		"accountNumber": creatBank['accountNumber'],
								    		"accountName": creatBank['accountName'],
								    		"phone":creatBank['phone'],
								    		"type": creatBank['type'],
								    		"status": creatBank['status'],
								    		"openingBalance": creatBank['balance']
								    	}
								    })

							    })

						    }
						})
					}
			    })
	    	}
	    }).catch (error => 
			res.status(400).json({
				"status": 400,
				"error": error || "database error"
			})
		)
	}
}


//Display UserProfile 
const getUserProfile = (req, res) => {
    db.query(`SELECT * FROM users WHERE email = $1`, [req.decoded.email]) 
    .then((response) => {
    		const result = response.rows[0];
		    res.status(200).json({
		    	"status": 200,
		    	"data": {
			    	"id": result['id'],
		    		"email": result['email'],
		    		"firstName": result['firstname'],
		    		"lastName": result['lastname'],
		    		"phone": result['phone'],
		    		"dob": result['dob'],
		    		"type": result['type'],
		    		"imageUrl": result['imageurl'],
		    		"isAdmin": result['isadmin'],
		    		"resgisterDate": result['registerdate']
		    	}
		    });
    }).catch (error => 
		res.status(400).json({
			"status": 400,
			"error": error || "database error"
		})
	)
} 


const getUserAccounts = (req, res) => {
	    db.query(`SELECT * FROM bankaccount WHERE owner = $1`, [req.decoded.id]) 
	    .then(response =>{
    		const result = response.rows;
			if (result.length == 0){
			    res.status(206).json({
			    	"status": 206,
			    	"message": "You have no account created yet"
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
			"error": error || "database error"
		})
	)
}

//Get All Transactions of a particular Account number
const getTransactionByAccNo = (req, res) => {
	let accountnumber = parseInt(req.params.accountNumber)
    db.query(`SELECT * FROM transaction WHERE accountnumber = $1`, [accountnumber])
    .then(response =>{
		const result = response.rows;
		if (result.length == 0){
			res.status(206).json({
				"status": 206,
    			"message": "No transaction yet"
    			}); 
		} else {
    		res.status(200).json({
    			"status":200,
    			"data": result
    		})
		}
    }).catch (error => 
		res.status(400).json({
			"status": 400,
			"error": error || "database error"
		})
	)	
}