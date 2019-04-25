/*

*/
import * as  helper from '../helpers/helper'
import bcrypt from 'bcryptjs'; 
import {pool} from './index.js'
import {sendNotificationMail} from '../helpers/mailer';
const db = pool

//Staff get all client type user alone
//create staff and admin users 
const createStaffAdmin = (req, res) => {
	let data = Object.keys(req.body);
	//checkif a all the fields are present by checking the length agains the expected length
	let chkobj = [ 'email', 'password', 'password1', 'firstName', 'lastName', 'phone', 'isAdmin']
	let obj = []
	for (let i = 0; i<data.length; i++){
		let key = data[i];
		obj.push(key);
	}
	if (obj < chkobj) {
		res.status(422).json({
			"status": 422,
			"error": "Please Check, A field is missing"
		});

	} else if(req.body['password'] !== req.body['password1']){
		res.status(403).json({
			"status": 403,
			"error": "Password does not match"
		});
	} else {
		db.query(`SELECT * FROM users WHERE email = $1`, [req.body['email']])
		.then(response =>{
			const results = response.rows[0]
			if(results){
				res.status(401).json({
						"status":401,
						"error":"User all ready exist with email address"
					})
 			} else {
				//Create Hash Password
				let hashedPassword = bcrypt.hashSync(req.body['password'], 8);
				let newUser = {
					"token": token,
					"firstName":req.body['firstName'], 
					"lastName":req.body['lastName'],
					"email":req.body['email'],
					"password": hashedPassword, 
					"phone":req.body['phone'],
					"type": "staff"
				}
				//This checks if the user was created by an admin/staff
				if(!req.body['isAdmin']){
					newUser['isAdmin'] = false;
				} else if(req.body['isAdmin'] === false){
					newUser['isAdmin'] = false;
				} else {
					newUser['isAdmin'] = true
				}
			    const pass = newUser.password
			    db.query(`INSERT INTO users("email", "firstname", "lastname", "phone", "password", "dob", "type", "isadmin") values($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,[newUser.email, newUser.firstName, newUser.lastName, newUser.phone, pass, newUser.dob, newUser.type, newUser.isAdmin])
			    .then(response=>{
			    	const results = response.rows
			    	if (results.length !== 0){
			    		sendNotificationMail(results[0].email, "Account Successfully  Created", `Welcome to Ebanka, Login to Complete your profile`, `<b><h3>Welcome to Ebanka!<h3><br> Login to Complete your profile<br/></b>`)
			    		.then((response) =>{
							res.status(201).json({
								"status": 201,
								"data": {
							        "email": results[0].email,
							        "firstName": results[0].firstName,
							        "lastName": results[0].lastName,
							        "phone": results[0].phone,
							        "dob": results[0].dob,
							        "registerDate": results[0].registerDate,
							        "type": results[0].type,
							        "isAdmin": results[0].isAdmin,
							        "imageUrl": results[0].imageUrl
								}
							});	
			    		})			    			
			    	}
			    })

			}

		})
	}
}