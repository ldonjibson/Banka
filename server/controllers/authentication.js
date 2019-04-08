const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); // used to encrypt password
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
let helper = require('../helpers/helper')
let users = require('../datastore/user.js')
const jwtVerify = require('../middleware/verifyuserlogin.js')


let server = express();
const router = express.Router();
let url = '/api/v1/';

let config = require('../config/config.js')

server.set('superSecret', config.secret);

// router.use();
// router.use('', jwtverify);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));

//sign up 
router.post('/auth/signup', (req, res) => {
	let data = Object.keys(req.body);
	//checkif a all the fields are present by checking the length agains the expected length
	let chkobj = [ 'email', 'firstName', 'lastName', 'phone', 'password', 'dob' ]
	obj = []
	for (let i = 0; i<data.length; i++){
		let key = data[i];
		obj.push(key);
	}
	if (obj < chkobj) {
		res.json({
			"status": 401,
			"error": "Please Check, A field is missing"
		});

	} else {
		//This pushes the adds the new id
		const payload = {email: req.body['email']}
		let token = jwt.sign(payload, server.get('superSecret'), {
			expiresIn: '24h' // expire in 24 hours
		});
		//Create Hash Password
		let hashedPassword = bcrypt.hashSync(req.body['password'], 8);
		let newUser = {
			"token": token,
			"id": users.length + 1,
			"firstName":req.body['firstName'], 
			"lastName":req.body['lastName'],
			"email":req.body['email'],
			"password": hashedPassword, 
			"dob":req.body['dob'],
			"phone":req.body['phone'],
			"registerDate": new Date().toISOString(),
		}
		//This checks if the user was created by an admin/staff
		if (!req.body['type']){
			newUser['type'] = 'client';
		} else {
			newUser['type'] = req.body['type'];
			delete newUser['token'];
		}
		if(!req.body['isAdmin']){
			newUser['isAdmin'] = false;
		} else {
			newUser ['isAdmin'] = true;
		}
		// console.log(req.body)

		//This pushes the newly gotten value to the data
		// users = JSON.stringify(usobj);
		let usObj = users
		usObj.push(newUser);
		// console.log(usObj);
		const getUser = usObj.find(usr => usr.id === Number(usObj.length));
		delete getUser['password'];
		res.json({
			"status": 1000,
			"data": getUser
		});

	}

});


//login
router.post('/auth/signin', (req, res) => {
	let x = req.body;
	let email = x['email']
	let password = x['password']

	console.log(password + ' , ' + email)
	//cehck if username or password is missing or both
	if (!email || !password){

		res.json({
			"status": 401,
			error: "Please Check, One or More field is empty"
		});

	} else if ( email && password){
		//verify that usr exist or not

		//this search through the json(users) to getthe user if it exists
		const getUser = users.find(usr => usr.email === email)
		const getPassword = () => {
			if (getUser){
				//Unhash the password
				const chkpassword = bcrypt.compareSync(req.body['password'], getUser.password);				
				if (chkpassword){
					return true;
				} else {
					return false
				}
			} else {
				return "User Not found"
			}
		}
		// console.log(getUser)
		if (getPassword() === false) {

			res.json({
				"status": 1001,
				"error": "Authentication Failed! password parameter invalid"
			})

			//This pushes the adds the new id
		} else if(getPassword() === "User Not found") {
			res.json({
				"status": 1002,
				"error": "User does not exist!"
			})

		} else if(getPassword() === true) {
			const payload = {email: getUser.email, id: getUser.id, isAdmin: getUser.isAdmin}
			let token = jwt.sign(payload, server.get('superSecret'), {
				expiresIn: '60 days' //'24h' // expire in 24 hours
			});
			//add token to response
			getUser['token'] = token;
			// remove the password key
			delete getUser['password'];
			res.json({
				"status": 1000,
				"data": getUser
			})

		}

	}

});


//Request Password Reset
router.post('/password-reset/',  (req, res) => {
	const email = req.body['email'];
	if(!email){
		res.json({
			"status": 1100,
			"error": "No email provided"
		});
	} else {
		const chkForUser = users.find(usr => usr.email === email);
		if (!chkForUser){
			res.json({
				"status": 1002,
				"error": "User does not exist!"
			})
		} else {

		}

	}
});



module.exports = router;