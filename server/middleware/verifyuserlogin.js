const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcrypt-nodejs'); // used to encrypt password
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

let helper = require('../helpers/helper')
let users = require('../datastore/user.js')

const pool = require('../db/index.js')
const db = pool.pool

let server = express();
const router = express.Router();
let url = '/api/v1/';

let config = require('../config/config.js')

server.set('superSecret', config.secret);

// router.use(bodyParser.urlencoded({ extended: false }));
// router.use(bodyParser.json({ type: 'application/json'}));

//route midleware to verify atoken

const jwtVerify= ((req, res, next) => {
	// check header or url parameters or post parameteers for token
	let token = req.body.token || req.query.token || req.headers['x-access-token'];
	//decode token
	if(token) {
		//verifies secret and check up
		jwt.verify(token, server.get('superSecret'), (err, decoded) => {
			if(err) {
				return res.json({"status":403, "error": 'Failed to Authenticate token'});
			} else {
				//if authenticatable save to request for other route to use
				req.decoded = decoded;
				db.query(`SELECT * FROM users WHERE email = $1 AND id = $2`,[decoded.email, decoded.id], (error, response) => {
					if (error){
						res.status(400).json({
							"status": 400,
							"error": error
						})
					} else if (response.rows.length === 0){
						res.status(404).json({
							"status": 404,
							"error": "User does not exist"
						})
						
					} else {
						next();
					}
				});
			}
		})
	} else {
		//if there is no token return an error
		return res.status(401).json({
			"status": 401,
			"error": "No token provided."
		});
	}

});

module.exports = jwtVerify;
