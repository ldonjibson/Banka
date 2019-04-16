const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); // used to encrypt password

let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

//HELPER FUNCTIONS
let helper = require('../helpers/helper')
let upload = require('../helpers/upload')
//DATA USED
let users = require('../datastore/user')
let transactions = require('../datastore/transaction')
let accounts = require('../datastore/account')

// Middleswares
const jwtVerify = require('../middleware/verifyuserlogin')
const jwtStaffVerify = require('../middleware/verifyStaff')
const paramChecks = requrie('../middleware/paramCheck')


let server = express();
const router = express.Router();

let config = require('../config/config')

server.set('superSecret', config.secret);

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));

let transporter = require('../helpers/mailer')

// recover password
router.post('/resetpassword', (req, res) => {
	const email = req.body['email'];
	const getUser = users.find(usr => usr.email === email);
	if (!getUser) {
		res.json({
			"status": 401,
			"error": `User with ${email} does not exist` 
		});
	} else {
		const temppass = Math.random().toString(36).replace('0.', '') 
		let hashedPassword = bcrypt.hashSync(temppass, 8);
		getUser.password = hashedPassword;
	    let mailOptions = {
	        from: '"Krunal Lathiya" <ckagoxozic@gmail.com>', // sender address
	        to: getUser.email, // list of receivers
	        subject: "Ebanka Password Reset", // Subject line
	        text: `Hello ${getUser.firstName}, you requested to change your password, your new password is "${temppass}" , login to change it`, // plain text body
	        html: `<b>Hello ${getUser.firstName}, you requested to change your password, your new password is <br>"${temppass}"<br> , login to change it</b>` // html body
	    };
	    transporter.transporter.sendMail(mailOptions, (error, info) =>{
	    	if (error){
				res.json({
					"status": 201,
					"message": "Password was notsent due to failed emailing system",
				});
	    	} else {
				res.json({
					"status": 201,
					"message": "Password recoverywas successful",
				});
	    	}
	    });
	} 

});

module.exports = router;
