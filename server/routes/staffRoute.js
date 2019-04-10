const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); // used to encrypt password
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
let helper = require('../helpers/helper')
let users = require('../datastore/user.js')
let transactions = require('../datastore/transaction.js')
let accounts = require('../datastore/account.js')
const jwtStaffVerify = require('../middleware/verifyStaff.js')
let upload = require('../helpers/upload')


let server = express();
const router = express.Router();
let url = '/api/v1/';

let config = require('../config/config.js')

// server.set('superSecret', config.secret);
// router.use();
// router.use('', jwtverify);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));

//staff For users alone
router.get('/users', jwtStaffVerify, (req, res) =>{
	// Allow only client to be shown to staff
	const allusers = users.filter(usr => usr.isAdmin === false && usr.type === "client" );
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
router.get('/user/:id', jwtStaffVerify, (req, res) => {
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


router.patch('/user/profile/:id/edit', upload.upload.single('file'), jwtStaffVerify,  (req, res) => {
	const getUser = users.find(usr => usr.email === req.decoded.email);
	if (getUser) {
		let chKUser = users.find(chkusr => chkusr.id === Number(req.params.id) && chkusr.type === "client");
		if (!chKUser){
			res.json({
				status:1005,
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
		}
	} else {
		res.json({
			"status": 1005,
			"data": "Invalid User Stay Out!"
		});
	}

});


router.patch('/user/profile/:id/changepassword', jwtStaffVerify,  (req, res) => {
	const getUser = users.find(usr => usr.email === req.decoded.email);
	if (getUser) {
		const chKUser = users.find(chkusr => chkusr.id === Number(req.params.id) && chkusr.type === "client");
		if (!chKUser){
			res.json({
				status:1005,
				error: "No Permmission, You Cannot edit a Staff/Admin profile"
			});
		} else {
			let userpassword = req.body['password'] || null;
			let userpassword1 = req.body['password1'] || null;;
			if (userpassword && userpassword1){
				if (userpassword === userpassword1){
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
					"status": 1007,
					"error": "No Password Change Attempt Made"
				});
			}
		}
	} else {
		res.json({
			"status": 1005,
			"error": "Invalid User Stay Out!"
		});
	}

});

module.exports = router;