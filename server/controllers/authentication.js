const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); // used to encrypt password
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
let helper = require('../helpers/helper')
let users = require('../datastore/user.js')
const jwtVerify = require('../middleware/verifyuserlogin.js')

// const db = require('../db')
const pool = require('../db/index.js')
let db = pool.pool

let server = express();
const router = express.Router();
let url = '/api/v1/';

let config = require('../config/config.js')

server.set('superSecret', config.secret);

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));

//sign up 
router.post('/auth/signup', (req, res) => {
	let data = Object.keys(req.body);
	db.connect((err,client,done)=>{
		if (err){
			console.log("not able to connect" + err);
			res.json({
				"status":400,
				"error":err
			})
		}
		client.query(`SELECT * FROM users WHERE email = $1`, [req.body['email']])
		.then(response =>{
			const results = response.rows[0]
			if(results){
				res.status(400).json({
						"status":400,
						"error":"User all ready exist with email address"
					})
 			} else{
					//checkif a all the fields are present by checking the length agains the expected length
					let chkobj = [ 'email', 'password', 'password1']
					obj = []
					for (let i = 0; i<data.length; i++){
						let key = data[i];
						obj.push(key);
					}
					if (obj < chkobj) {
						res.status(401).json({
							"status": 401,
							"error": "Please Check, A field is missing"
						});

					} else if(req.body['password'] !== req.body['password1']){
						res.status(401).json({
							"status": 401,
							"error": "Password does not match"
						});
					} else {
							//This pushes the adds the new id
					const payload = {email: req.body['email']}
					let token = jwt.sign(payload, server.get('superSecret'), {
						expiresIn: '24h' // expire in 24 hours
					});
					//Create Hash Password
					let hashedPassword = bcrypt.hashSync(req.body['password'], 5);
					let newUser = {
						"token": token,
						"firstName":req.body['firstName'], 
						"lastName":req.body['lastName'],
						"email":req.body['email'],
						"password": hashedPassword, 
						"dob":req.body['dob'],
						"phone":req.body['phone'],
					}
					//This checks if the user was created by an admin/staff
					if (!req.body['type']){
						newUser['type'] = 'client';
					} else {
						newUser['type'] = req.body['type'];
					}
					if(!req.body['isAdmin']){
						newUser['isAdmin'] = false;
					} else if(req.body['isAdmin'] === false){
						newUser['isAdmin'] = false;
					} else {
						newUser['isAdmin'] = true
					}
				    const pass = newUser.password
				    client.query(`INSERT INTO users("email", "firstname", "lastname", "phone", "password", "dob", "type", "isadmin") values($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,[newUser.email, newUser.firstName, newUser.lastName, newUser.phone, pass, newUser.dob, newUser.type, newUser.isAdmin])
				    .then(response=>{
				    	const results = response.rows
				    	if (results.length !== 0){
				    		transporter.sendNotificationMail(results[0].email, "Account Successfully  Created", `Welcome to Ebanka, Login to Complete your profile`, `<b><h3>Welcome to Ebanka!<h3><br> Login to Complete your profile<br/></b>`)
							res.status(201).json({
								"status": 201,
								"data": {
									"token": newUser['token'],
							        "email": results[0].email,
							        // "firstName": results.[0]['firstName'],
							        // "lastName": results.[0]['lastName'],
							        // "phone": results.[0]['phone'],
							        // "dob": results.[0]['dob'],
							        "registerDate": results[0].registerDate,
							        // "type": results.[0]['type'],
							        // "isAdmin": results.[0]['isAdmin'],
							        // "imageUrl": results.[0]['imageUrl']
								}
							});				    			
				    	}
				    }).catch (error => 
						res.status(400).json({
							"status": 400,
							"error": error
						}) 
					)

				}

 			}
		})
	})

});


//login
router.post('/auth/signin', (req, res) => {
	let x = req.body;
	let email = req.body.email
	let password = req.body.password
	//cehck if username or password is missing or both
	if (!email || !password){

		res.status(401).json({
			"status": 401,
			error: "Please Check, One or More field is empty"
		});

	} else if (email && password){
		//verify that usr exist or not
		db.connect((err,client,done)=>{
			if (err){
				console.log("not able to connect" + err);
				res.status(400).json({
					"status":400,
					"error":err
				});
			}
			client.query(`SELECT * FROM users WHERE email = $1`, [req.body['email']]) 
			.then(response =>{
				results = response.rows[0]
	 			if(!results){
					res.status(404).json({
							"status":404,
							"error":"User does not exist with email"
						});
	 			} else {
					bcrypt.compare(password, results.password).then((response) =>{
						if (!response){
							res.status(401).json({
								"status": 401,
								"error": "Authentication Failed! password parameter invalid"
							});
						} else {
							const payload = {email: results.email, id: results.id, isAdmin: results.isAdmin}
							let token = jwt.sign(payload, server.get('superSecret'), {
								expiresIn: '24h'//'60 days' //'24h' // expire in 24 hours
							});
							//add token to response
							results['token'] = token;
							res.json({
								"status": 200,
								"data": {
									"token": results.token,
									"id": results.id,
							        "email": results.email,
							        "firstName": results.firsnName,
							        "lastName": results.lastname,
							        "phone": results.phone,
							        "dob": results.dob,
							        "registerDate": results.registerdate,
							        "type": results.type,
							        "isAdmin": results.isadmin,
							        "imageUrl": results.imageurl
								}
							});
						}
					});				
				}
	 		}).catch (error => 
				res.status(400).json({
					"status": 400,
					"error": error
				}) 
			)
		});

	}

});

module.exports = router;