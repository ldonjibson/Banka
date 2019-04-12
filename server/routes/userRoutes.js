const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); // used to encrypt password

let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

//HELPER FUNCTIONS
let helper = require('../helpers/helper')
let upload = require('../helpers/upload')
//DATA USED
let users = require('../datastore/user.js')
let transactions = require('../datastore/transaction.js')
let accounts = require('../datastore/account.js')

// Middleswares
const jwtVerify = require('../middleware/verifyuserlogin.js')
const jwtStaffVerify = require('../middleware/verifyStaff.js')


let server = express();
const router = express.Router();

let config = require('../config/config.js')

server.set('superSecret', config.secret);

// router.use();
// router.use('', jwtverify);
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));

// Get the User Profile
router.get('/me/profile', jwtVerify,  (req, res) => {
	const getUser = users.find(usr => usr.email === req.decoded.email);
	if (getUser) {
		delete getUser['password'];
		res.json({
			"status": 1000,
			"data": getUser
		});		
	} else {
		res.json({
			"status": 1005,
			"data": "Invalid User Stay Out!"
		});
	}

});

router.get('/me/account', jwtVerify,  (req, res) => {
	const getUser = users.find(usr => usr.email === req.decoded.email);
	if (getUser) {
		const getUseracct = accounts.find(acc => acc.owner === getUser.id);
		res.json({
			"status": 1000,
			"data": getUseracct
		});		
	} else {
		res.json({
			"status": 1005,
			"data": "Invalid User Stay Out!"
		});
	}

});

router.get('/me/account/transactions', jwtVerify,  (req, res) => {
	let getUser = helper.togetUser(req);
	// console.log(getUser);
	if (getUser) {
		const getUseracct = accounts.find(acc => acc.owner === getUser.id);
		const getUsertransactns = transactions.filter(transactn => transactn.accountNumber === getUseracct.accountNumber);
		res.json({
			"status": 1000,
			"data": getUsertransactns
		});		
	} else {
		res.json({
			"status": 1005,
			"data": "Invalid User Stay Out!"
		});
	}

});

router.get('/me/account/transaction/:id/detail', jwtVerify,  (req, res) => {
	const getUser = helper.togetUser(req);
	if (getUser) {
		const getUseracct = accounts.find(acc => acc.owner === getUser.id);
		// console.log(getUseracct);
		const gettheUsertransactns = transactions.find(transactn => transactn.id === Number(req.params.id) && transactn.accountNumber === getUseracct.accountNumber);
		// console.log(gettheUsertransactns);
		if (gettheUsertransactns){
			res.json({
				"status": 1000,
				"data": gettheUsertransactns
		});			
		} else {
			res.json({
				"status":2010,
				error: "(not your transaction!) Wrong transaction details"
			})
		}
	
	} else {
		res.json({
			"status": 1005,
			"data": "Invalid User Stay Out!"
		});
	}

});


router.post('/accounts', jwtVerify, (req, res) => {
	const getUser = helper.togetUser(req);
	const getAllacc = accounts.length + 1;
	if (getUser){
		getbalance = parseFloat(req.body['openingBalance']) || parseFloat(0.12);
		let creatBank = {
	        "id": getAllacc,
	        "accountNumber": helper.uniqueAccNumber(),
	        "createdOn": new Date().toISOString(),
	        "owner": getUser.id,
	        "type": "current",
	        "status": "active",
	        "balance": getbalance,
	    }
	    res.json({
	    	"status": 1000,
	    	"data": { 
	    		"accountNumber": creatBank['accountNumber'],
	    		"firstName": getUser.firstName,
	    		"lastName":getUser.lastName,
	    		"email": getUser.email,
	    		"type": creatBank['type'],
	    		"openingBalance": creatBank['balance']
	    	}
	    });
	} else {
		res.json({
			"status": 1006,
			"error":"Log in to Create a Bank Account"
		})
	}
})


router.patch('/me/profile/edit', upload.upload.single('file'), jwtVerify,  (req, res) => {
	const getUser = users.find(usr => usr.email === req.decoded.email);
	if (getUser) {
		const firstName = req.body['firstName'] || null;
		const lastName = req.body['lastName'] || null;
		const phone = req.body['phone'] || null;
		const image = req.file || null ;
		delete getUser['password'];
		if (firstName){
			getUser.firstName = firstName;
		}
		if (lastName){
			getUser.lastName = lastName;
		}
		if (phone){
			getUser.phone = phone;
		}
		if (!image){
			res.json({
				"status": 1000,
				"data": getUser
			});	
		} else {
			getUser.imageUrl = 'http://localhost:3000/images/'+ req.file.filename
			res.json({
				"status": 1000,
				"data": getUser
			});
		}
	
	} else {
		res.json({
			"status": 1005,
			"data": "Invalid User Stay Out!"
		});
	}

});


router.patch('/me/profile/changepassword', upload.upload.single('file'), jwtVerify,  (req, res) => {
	const getUser = users.find(usr => usr.email === req.decoded.email);
	if (getUser) {
		const password = req.body['password'] || null;
		const password1 = req.body['password1'] || null;;
		if (password && password1){
			if (password === password1){
				let hashedPassword = bcrypt.hashSync(password, 8);
				getUser.password = hashedPassword;
				res.json({
					"status": 1000,
					"message": "Password changed successfully"
				});
			} else{
				res.json({
					"status": 1007,
					"error": "Both Passwords doesnot match"
				});
			}
		} else {
			res.json({
				"status": 1008,
				"error": "No Password Change Attempt Made"
			});
		}
	
	} else {
		res.json({
			"status": 1005,
			"error": "Invalid User Stay Out!"
		});
	}

});



module.exports = router;