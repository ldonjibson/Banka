const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcrypt-nodejs'); // used to encrypt password
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

let helper = require('../helpers/helper')
let users = require('../datastore/user.js')

let server = express();
const router = express.Router();
let url = '/api/v1/';

let config = require('../config/config.js')

server.set('superSecret', config.secret);

// router.use(bodyParser.urlencoded({ extended: false }));
// router.use(bodyParser.json({ type: 'application/json'}));

//route midleware to verify atoken

const jwtAdminVerify= ((req, res, next) => {
	// check header or url parameters or post parameteers for token
	let token = req.body.token || req.query.token || req.headers['x-access-token'];
	//decode token
	if(token) {
		//verifies secret and check up
		jwt.verify(token, server.get('superSecret'), (err, decoded) => {
			if(err) {
				return res.json({status:1002, error: 'Failed to Authenticate token'});
			} else {
				//if authenticatable save to request for other route to use
				req.decoded = decoded;
				// console.log(decoded);
				//check if user email has staff property
				const getUser = users.find(usr => usr.email === decoded.email);
				if (getUser.type === "staff" && getUser.isAdmin === true ){
					next();
				} else {
					res.json({
						status:1005,
						error: "You are not an Admin"
					});
				}
				// res.status(200).send();
			}
		})
	} else {
		//if there is no token return an error
		return res.json({
			status: 1004,
			error: "No token provided."
		});
	}
});

module.exports = jwtAdminVerify;
// server.use('', router);