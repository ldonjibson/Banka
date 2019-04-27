import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs'; // used to encrypt password
import jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens
import * as helper from '../helpers/helper';
import {jwtVerify} from '../middleware/verifyuserlogin.js'
import {sendNotificationMail} from '../helpers/mailer';
// const db = require('../db')
import {pool} from '../db/index'

import {secret} from '../config/config'
dotenv.config()

let db = pool
const {check, validationResult} = require('express-validator/check')

let server = express();
const router = express.Router();

server.set('superSecret', secret);


// sign up
const signUp = (req, res) => {
	console.log(req)
  let data = Object.keys(req.body);
  const error = validationResult(req);
  if (!error.isEmpty()) {
    helper.authHelper(error, res);
  } else if (req.body.password !== req.body.password1) {
    res.status(406).json({
      "status": 406,
      "error": 'Password does not match'
    });
  } else {
    db.query('SELECT * FROM users WHERE email = $1', [req.body.email])
      .then((response) => {
        const results = response.rows;
        if (results.length !== 0) {
          res.status(401).json({
            "status": 401,
            "error": "User already exist with email address",
          });
 			} else {
          const payload = { email: req.body.email};
          let token = jwt.sign(payload, server.get('superSecret'), {
            expiresIn: '24h', // expire in 24 hours
          });
          // Create Hash Password
          let hashedPassword = bcrypt.hashSync(req.body.password, 8);
          let newUser = {
            "token": token,
            "email": req.body.email,
            "password": hashedPassword,
            "type": 'client' 
          };
			    const pass = newUser.password;
			    db.query('INSERT INTO users("email", "password", "type") values($1, $2, $3) RETURNING *', [newUser.email, pass, newUser.type])
			    .then((response)=> {
			    	const results = response.rows;
			    	if (results.length !== 0) {
			    		sendNotificationMail(results[0].email, 'Account Successfully  Created', 'Welcome to Ebanka, Login to Complete your profile', '<b><h3>Welcome to Ebanka!<h3><br> Login to Complete your profile<br/></b>')
                  .then((response) => {
                    res.status(201).json({
                      "status": 201,
                      "data": {
	                      "token": newUser.token,
								        "email": results[0].email,
								        'registerDate': results[0].registerDate
                      },
                    });

                  });			    			
			    	}
			    });

 			}
      }).catch(error =>
        res.status(400).json({
          "status": 400,
          "error": error,
        }), 
      ); 
  }
}


// login
const signIn = (req, res) => {
  // check if username or password is missing or both
  let email = req.body.email
  let password = req.body.password
  const error = validationResult(req);
  if (!error.isEmpty()) {
    helper.authHelper(error, res);
  } else if (!password) {
    res.status(400).json({
      "status": 400,
      "error": 'Password is required'
    });
    // verify that usr exist or not
  } else {
    db.query('SELECT * FROM users WHERE email = $1', [email])
      .then((response) => {
        let results = response.rows[0];
 			if (!results) {
          res.status(404).json({
            "status": 404,
            "error": "User does not exist with email",
          });
 			} else {
          bcrypt.compare(password, results.password).then((response) => {
            if (!response) {
              res.status(401).json({
                "status": 401,
                "error": 'Authentication Failed! password parameter invalid'
              });
            } else {
              const payload = { email: results.email, id: results.id, isAdmin: results.isAdmin };
              let token = jwt.sign(payload, server.get('superSecret'), {
                expiresIn: '24h',// '60 days' //'24h' // expire in 24 hours
              });
              // add token to response
              results.token = token;
              res.json({
                "status": 200,
                "data": {
                  "token": results.token,
                  "id": results.id,
						      "email": results.email,
						      "firstName": results.firsnName,
						      "lastName": results.lastname,
						      "phone": results.phone,
						      "dob": results.dob,
					        "registerDate": results.registerdate,
					        "type": results.type,
					        "isAdmin": results.isadmin,
					        "imageUrl": results.imageurl,
                },
              });
            }
          });
        }
 		}).catch(error =>
        res.status(400).json({
          "status": 400,
          "error": error,
        }), 
      );
  }
};

export { signUp, signIn }
