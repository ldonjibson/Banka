const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); // used to encrypt password
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
let helper = require('../helpers/helper')
const jwtVerify = require('../middleware/verifyuserlogin.js')

const {check, validationResult} = require('express-validator/check')
// const db = require('../db')
const pool = require('../db/index.js')
let db = pool.pool

let server = express();
const router = express.Router();

let config = require('../config/config.js')

server.set('superSecret', config.secret);

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
		db.connect((err,client,done)=>{
			if (err){
				res.status(400).json({
					"status":400,
					"error":err
				})
			}
			client.query(`SELECT * FROM users WHERE email = $1`, [req.body['email']])
			.then(response =>{
				const results = response.rows[0]
				if(results){
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
					let hashedPassword = bcrypt.hashSync(req.body['password'], 5);
					let newUser = {
						"token": token,
						"email":req.body['email'],
						"password": hashedPassword,
						"type": "client" 
					}
				    const pass = newUser.password
				    client.query(`INSERT INTO users("email", "password", "type") values($1, $2, $3) RETURNING *`,[newUser.email, pass, newUser.type])
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
				    })

	 			}
			})
		})
	}

});


//login
router.post('/auth/signin',[
	check('email').isEmail()
	], (req, res) => {
	let email = req.body['email']
	let password = req.body['password']
	//cehck if username or password is missing or both
	const error = validationResult(req);
	if (!error.isEmpty()){
		helper.authHelper(error, res)
	} else if (!password){
		res.status(400).json({
			"status":400,
			"error": "Password is required"
		});
		//verify that usr exist or not
	} else {
		db.connect((err,client,done)=>{
			if (err){
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