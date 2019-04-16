const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); // used to encrypt password
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
let helper = require('../helpers/helper')
let users = require('../datastore/user')
let transactions = require('../datastore/transaction')
let accounts = require('../datastore/account')
const jwtAdminVerify = require('../middleware/verifyAdmin')
const paramChecks = require('../middleware/paramCheck')
let upload = require('../helpers/upload')


let server = express();
const router = express.Router();

let config = require('../config/config')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));

router.get('/allusers', jwtAdminVerify, (req, res) =>{
	// Allow only client to be shown to staff
	const allUsers = users;
	rmPassAllUsers = []
	for (var i = allUsers.length - 1; i >= 0; i--) {
		let key = allUsers[i]
		delete key['password'];
		rmPassAllUsers.push(key);
	}
	res.json({
		"status": 206,
		"data": rmPassAllUsers
	});
});


// Get a specific User
router.get('/allusers/:id', paramChecks, jwtAdminVerify, (req, res) => {
	const getUser = users.find(usr => usr.id === Number(req.params.id));
	if (getUser){
		delete getUser['password'];
		res.json({
			"status":200,
			"data": getUser
		});
	} else {
		res.json({
			"status":400,
			"error": "User with that ID does not exist"
		});
	}
});

//start For users alone
router.get('/staff', jwtAdminVerify, (req, res) =>{
	// Allow only client to be shown to staff
	const allStaff = users.filter(usr => usr.type === "staff" );
	delete allStaff['password']
	res.json({
		"status": 206,
		"data": allStaff
	});
});

// Get a specific User
router.get('/staff/:id',paramChecks, jwtAdminVerify, (req, res) => {
	const getUser = users.find(usr => usr.id === Number(req.params.id) && usr.type === "staff");
	if (getUser){
		delete getUser['password'];
		res.json({
			"status":200,
			"data": getUser
		});
	} else {
		res.json({
			"status":400,
			"error": "User with that ID does not exist"
		});
	}
});

router.patch('/allusers/profile/:id/edit', paramChecks, upload.upload.single('file'), jwtAdminVerify,  (req, res) => {
	const getUser = users.find(usr => usr.email === req.decoded.email);
	if (getUser) {
		const chKUser = users.find(chkusr => chkusr.id === Number(req.params.id));
		const firstName = req.body['firstName'] || null;
		const lastName = req.body['lastName'] || null;
		const phone = req.body['phone'] || null;
		const image = req.file || null ;
		if (firstName){
			chKUser.firstName = firstName;
		}
		if (lastName){
			chKUser.lastName = lastName;
		}
		if (phone){
			chKUser.phone = phone;
		}
		if (!image){
			res.json({
				"status": 201,
				"message": "Profile updated Successfully without Image"
			});	
		} else {
			getUser.imageUrl = 'http://localhost:3000/images/'+ req.file.filename
			res.json({
				"status": 201,
				"message": "Profile updated Successfully with Image"
			});
		}
	} else {
		res.json({
			"status": 403,
			"data": "Invalid User Stay Out!"
		});
	}

});


router.patch('/allusers/profile/:id/changepassword', paramChecks, jwtAdminVerify,  (req, res) => {
	const getUser = users.find(usr => usr.email === req.decoded.email);
	if (getUser) {
		let chKUser = users.find(chkusr => chkusr.id === Number(req.params.id));
		let password = req.body['password'] || null;
		let password1 = req.body['password1'] || null;;
		if (password && password1){
			if (password === password1){
				let hashedPassword = bcrypt.hashSync(password, 8);
				chKUser.password = hashedPassword
				res.json({
					"status": 201,
					"message": "Password changed successfully"
				});
			} else{
				res.json({
					"status": 401,
					"error": "Both Passwords doesnot match"
				});
			}
		} else {
			res.json({
				"status": 200,
				"error": "No Password Change Attempt Made"
			});
		}
		// console.log(chKUser)	
	} else {
		res.json({
			"status": 403,
			"error": "Invalid User Stay Out!"
		});
	}

});


module.exports = router;