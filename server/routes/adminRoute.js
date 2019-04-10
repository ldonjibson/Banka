const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); // used to encrypt password
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
let helper = require('../helpers/helper')
let users = require('../datastore/user.js')
let transactions = require('../datastore/transaction.js')
let accounts = require('../datastore/account.js')
const jwtAdminVerify = require('../middleware/verifyAdmin.js')
let upload = require('../helpers/upload')


let server = express();
const router = express.Router();

let config = require('../config/config.js')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));

router.get('/allusers', jwtAdminVerify, (req, res) =>{
	// Allow only client to be shown to staff
	const allusers = users;
	rmpassallusers = []
	for (var i = allusers.length - 1; i >= 0; i--) {
		let key = allusers[i]
		delete key['password'];
		rmpassallusers.push(key);
	}
	res.json({
		"status": 1000,
		"data": rmpassallusers
	});
});


// Get a specific User
router.get('/allusers/:id', jwtAdminVerify, (req, res) => {
	const getUser = users.find(usr => usr.id === Number(req.params.id));
	if (getUser){
		delete getUser['password'];
		res.json({
			"status":1000,
			"data": getUser
		});
	} else {
		res.json({
			"status":1004,
			"error": "User with that ID does not exist"
		});
	}
});

//start For users alone
router.get('/staff', jwtAdminVerify, (req, res) =>{
	// Allow only client to be shown to staff
	const allstaff = users.filter(usr => usr.type === "staff" );
	delete allstaff['password']
	res.json({
		"status": 1000,
		"data": allstaff
	});
});

// Get a specific User
router.get('/staff/:id', jwtAdminVerify, (req, res) => {
	const getUser = users.find(usr => usr.id === Number(req.params.id) && usr.type === "staff");
	if (getUser){
		delete getUser['password'];
		res.json({
			"status":1000,
			"data": getUser
		});
	} else {
		res.json({
			"status":1004,
			"error": "User with that ID does not exist"
		});
	}
});

router.patch('/allusers/profile/:id/edit', upload.upload.single('file'), jwtAdminVerify,  (req, res) => {
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
				"status": 1000,
				"message": "Profile updated Successfully without Image"
			});	
		} else {
			getUser.imageUrl = 'http://localhost:3000/images/'+ req.file.filename
			res.json({
				"status": 1000,
				"message": "Profile updated Successfully with Image"
			});
		}
	} else {
		res.json({
			"status": 1005,
			"data": "Invalid User Stay Out!"
		});
	}

});


router.patch('/allusers/profile/:id/changepassword',jwtAdminVerify,  (req, res) => {
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
					"status": 1000,
					"message": "Password changed successfully"
				});
			} else{
				res.json({
					"status": 1008,
					"error": "Both Passwords doesnot match"
				});
			}
		} else {
			res.json({
				"status": 1008,
				"error": "No Password Change Attempt Made"
			});
		}
		// console.log(chKUser)	
	} else {
		res.json({
			"status": 1005,
			"error": "Invalid User Stay Out!"
		});
	}

});


module.exports = router;