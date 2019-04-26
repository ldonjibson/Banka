/*

*/
import * as  helper from '../helpers/helper'
import bcrypt from 'bcryptjs'; 
import {pool} from './index.js'
import {sendNotificationMail} from '../helpers/mailer';
let db = pool


//Create bank account
const createBankAcc = (req, res) => {
	let email = req.decoded.email
	let data = Object.keys(req.body);
	let accountNumber = helper.uniqueAccNumber()
  db.query(`SELECT * FROM users WHERE email = $1`, [email])
  .then(response => {
  	const result = response.rows[0]
  	if (!result['firstname'] || !result['lastname'] || !result['phone'] || !result['dob']){
	    	res.status(301).json({
		    	"status": 301,
			    	"message": "Update your profile before you create an account"
			    })
  	}else{
	  	if (!req.body['accountName'] || !req.body['phone'] || !req.body['type'] || !accountNumber) {
				res.status(401).json({
					"status": 401,
					"error": "All fields are required"
				});
			} else {
				const getbalance = parseFloat(0.12);
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
			    	const getBank = response.rows[0] 
			    	if (getBank){
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
									    } else {
									    	console.log('what the heack is happenming')
									    }
									})
								}
					    })
			    	}
			    })
				}
  	}
	}).catch (error => 
		res.status(400).json({
			"status": 400,
			"error": error || "database error"
		})
	)
}

//Display All User acount
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

//Allow User to Edit Profile
const userEditProfile = (req, res) => {
	let email = req.decoded.email
	let firstName = req.body['firstName'];
	let lastName = req.body['lastName'];
	let phone = req.body['phone'] || null;
	let dob = req.body['dob'] || null;
	let image = req.file || null ;
	let imageurl = "http://localhost:3000/images/'+ req.file.filename"
	if(!firstName || !lastName || !phone || !dob){
		res.status(422).json({
			"status": 422,
			"message": 'All fields are required'
		});	
	} else{
	    db.query(`SELECT * FROM users WHERE email = $1`, [email]) 
	    .then((response, error) =>{
			const result = response.rows[0]
			if (image){
				result.imageurl = 'http://localhost:3000/images/'+ req.file.filename
			}
		    db.query(`UPDATE users SET firstname = $1, lastname = $2, phone = $3, dob=$4, imageurl = $5  WHERE email = $6 RETURNING id`, [result.firstname, result.lastname, result.phone, result.dob, result.imageurl, req.decoded.email])
		    .then(response =>{
		    	if (response.rows[0]){
					res.status(206).json({
						"status": 206,
						"message": 'Profile Updated Succesfully'
					});	 
				}
			})
		}).catch (error => 
			res.status(400).json({
				"status": 400,
				"error": error || "database error"
			})
		)
	}
}

//All User to change Password
const userChangePassword = (req, res) => {
	const password = req.body['password'] || null;
	const password1 = req.body['password1'] || null;
	if (password && password1){
		if (password === password1){
			let hashedPassword = bcrypt.hashSync(password, 8);
		    db.query(`UPDATE users SET password = $1 WHERE email = $2`, [hashedPassword, req.decoded.email])
		    .then(response =>{
				res.status(206).json({
					"status": 206,
					"message": 'Password changed Succesfully'
				});
			}).catch (error => 
				res.status(400).json({
					"status": 400,
					"error": error
				})
			)
		} else {
			res.status(401).json({
				"status": 401,
				"error": "Both Passwords doesnot match"
			});
		}
	} else {
		res.status(422).json({
			"status": 422,
			"error": "Both fields are required"
		});
	}
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

//Get detail transaction of specific account using transaction id
const getSpecificTransactionAccById = (req, res) => {
	let id = parseInt(req.params.id)
	let accountNumber = parseInt(req.params.accountNumber)
	//return all details including the account details
	db.query(`SELECT * FROM transaction INNER JOIN bankaccount ON bankaccount.accountnumber = transaction.accountnumber WHERE transaction.id = $1`, [id])
	.then(response =>{
		const result = response.rows;
		if (result.length == 0){
			res.status(404).json({
				"status": 404,
    			"message": "Transaction Not Found"
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
			"error": error
		})
	)
}

export {
	getUserProfile,
	getUserAccounts,
	createBankAcc,
	userEditProfile,
	userChangePassword,
	getTransactionByAccNo,
	getSpecificTransactionAccById,
}
