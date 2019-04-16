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


//route midleware to verify if parameter passed is a number

const paramChecks= ((req, res, next) => {
	// check header or url parameters or post parameteers for token
	let number = req.params.id || req.params.accountNumber
	//decode token
	if(isNaN(number)) {
		//verifies if the parameter passed is a number
		return res.json({
			"status": 400,
			"error": "Invalid Parameters())"
		});
	} else {
		next();
	}

});

module.exports = paramChecks;
