const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); // used to encrypt password
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
let helper = require('../helpers/helper')
let users = require('../datastore/user')
let transactions = require('../datastore/transaction')
let accounts = require('../datastore/account')
const jwtStaffVerify = require('../middleware/verifyStaff')
const paramChecks = require('../middleware/paramCheck')

let upload = require('../helpers/upload')


let server = express();
const router = express.Router();
let url = '/api/v1/';

let config = require('../config/config')


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));

//staff For users alone
router.get('/users', jwtStaffVerify, (req, res) =>{
	// Allow only client to be shown to staff
	const allUsers = users.filter(usr => usr.isAdmin === false && usr.type === "client" );
	rmPassAllUsers = []
	for (var i = allUsers.length - 1; i >= 0; i--) {
		let key = allUsers[i]
		delete key['password'];
		rmPassAllUsers.push(key);
	}
	res.status(206).json({
		"status": 206,
		"data": rmPassAllUsers
	});
});

// Get a specific User
router.get('/user/:id',paramChecks, jwtStaffVerify, (req, res) => {
	const getUser = users.find(usr => usr.id === Number(req.params.id));
	if (getUser){
		delete getUser['password'];
		res.json({
			"status":200,
			"data": getUser
		});
	} else {
		re.json({
			"status":401,
			"error": "User with that ID does not exist"
		});
	}
});


router.patch('/user/profile/:id/edit',paramChecks, upload.upload.single('file'), jwtStaffVerify,  (req, res) => {
	const getUser = users.find(usr => usr.email === req.decoded.email);
	if (getUser) {
		let chKUser = users.find(chkusr => chkusr.id === Number(req.params.id) && chkusr.type === "client");
		if (!chKUser){
			res.status(403).json({
				status:403,
				error: "No Permmission, You Cannot edit a Staff/Admin profile"
			});
		} else {
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
				res.status(201).json({
					"status": 201,
					"message": "Profile updated Successfully without Image"
				});	
			} else {
				getUser.imageUrl = 'http://localhost:3000/images/'+ req.file.filename
				res.status(201).json({
					"status": 201,
					"message": "Profile updated Successfully with Image"
				});
			}
		}
	} else {
		res.status(403).json({
			"status": 403,
			"data": "Invalid User Stay Out!"
		});
	}

});


router.patch('/user/profile/:id/changepassword',paramChecks, jwtStaffVerify,  (req, res) => {
	const getUser = users.find(usr => usr.email === req.decoded.email);
	if (getUser) {
		const chKUser = users.find(chkusr => chkusr.id === Number(req.params.id) && chkusr.type === "client");
		if (!chKUser){
			res.status(403).json({
				status:403,
				error: "No Permmission, You Cannot edit a Staff/Admin profile"
			});
		} else {
			let userpassword = req.body['password'] || null;
			let userpassword1 = req.body['password1'] || null;;
			if (userpassword && userpassword1){
				if (userpassword === userpassword1){
					let hashedPassword = bcrypt.hashSync(userpassword, 8);
					chKUser.password = hashedPassword
					res.json({
						"status": 200,
						"message": "Password changed successfully"
					});
				} else{
					res.status(401).json({
						"status": 401,
						"error": "Both Passwords doesnot match"
					});
				}
			} else {
				res.status(204).json({
					"status": 204,
					"error": "No Password Change Attempt Made"
				});
			}
		}
	} else {
		res.status(403).json({
			"status": 403,
			"error": "Invalid User Stay Out!"
		});
	}

});


module.exports = router;