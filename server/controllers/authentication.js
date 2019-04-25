import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs'; // used to encrypt password
import jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens
import * as helper from '../helpers/helper';
import {jwtVerify} from '../middleware/verifyuserlogin.js'
import {sendNotificationMail} from '../helpers/mailer';

const {check, validationResult} = require('express-validator/check')
// const db = require('../db')
import {pool} from '../db/index'
let db = pool

let server = express();
const router = express.Router();

import {secret} from '../config/config'

server.set('superSecret', secret);

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));

//sign up 
router.post('/auth/signup', [
	check('email').isEmail(),
	check('password').isLength({min:5})
	], (req, res) => {
	let data = Object.keys(req.body);
	const error = validationResult(req);
	if (!error.isEmpty()){
		helper.authHelper(error, res)
	} else if(req.body['password'] !== req.body['password1']){
		res.status(406).json({
			"status": 406,
			"error": "Password does not match"
		});
	} else {
		db.query(`SELECT * FROM users WHERE email = $1`, [req.body['email']])
		.then(response =>{
			const results = response.rows
			if(results.length !== 0){
				res.status(401).json({
						"status":401,
						"error":"User already exist with email address"
					})
 			} else{
				const payload = {email: req.body['email']}
				let token = jwt.sign(payload, server.get('superSecret'), {
					expiresIn: '24h' // expire in 24 hours
				});
				//Create Hash Password
				let hashedPassword = bcrypt.hashSync(req.body['password'], 8);
				let newUser = {
					"token": token,
					"email":req.body['email'],
					"password": hashedPassword,
					"type": "client" 
				}
			    const pass = newUser.password
			    db.query(`INSERT INTO users("email", "password", "type") values($1, $2, $3) RETURNING *`,[newUser.email, pass, newUser.type])
			    .then(response=>{
			    	const results = response.rows
			    	if (results.length !== 0){
			    		sendNotificationMail(results[0].email, "Account Successfully  Created", `Welcome to Ebanka, Login to Complete your profile`, `<b><h3>Welcome to Ebanka!<h3><br> Login to Complete your profile<br/></b>`)
						.then((response) =>{
							res.status(201).json({
								"status": 201,
								"data": {
									"token": newUser['token'],
							        "email": results[0].email,
							        "registerDate": results[0].registerDate,
								}
							});	

						})			    			
			    	}
			    })

 			}
		}).catch (error => 
			res.status(400).json({
				"status": 400,
				"error": error
			}) 
		) 
	}

});


//login
router.post('/auth/signin', (req, res) => {
	let x = req.body;
	console.log(x)
	let email = req.body.email
	let password = req.body.password

	//cehck if username or password is missing or both
	if (!email || !password){

		res.status(401).json({
			"status": 401,
			error: "Please Check, One or More field is empty"
		});

	} else if ( email && password){
		//verify that usr exist or not

		//this search through the json(users) to getthe user if it exists
		const getUser = users.find(usr => usr.email === email);
		if (!getUser){
			res.status(401).json({
				"status": 404,
				"error": "User does not exist!"
			});
		} else {
			bcrypt.compare(password, getUser.password).then((response) =>{
				if (!response){
					res.status(401).json({
						"status": 401,
						"error": "Authentication Failed! password parameter invalid"
					});
				} else {
					const payload = {email: getUser.email, id: getUser.id, isAdmin: getUser.isAdmin}
					let token = jwt.sign(payload, server.get('superSecret'), {
						expiresIn: '60 days' //'24h' // expire in 24 hours
					});
					//add token to response
					getUser['token'] = token;
					res.json({
						"status": 200,
						"data": {
							"id": getUser['id'],
					        "email": getUser['email'],
					        "firstName": getUser['firstName'],
					        "lastName": getUser['lastName'],
					        "phone": getUser['phone'],
					        "dob": getUser['dob'],
					        "registerDate": getUser['registerDate'],
					        "type": getUser['type'],
					        "isAdmin": getUser['isAdmin'],
					        "imageUrl": getUser['imageUrl']
						}
					});
				}
			});				
		}

	}

});

module.exports = router;