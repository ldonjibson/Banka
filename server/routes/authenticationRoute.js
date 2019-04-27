import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens
import * as helper from '../helpers/helper';
import {jwtVerify} from '../middleware/verifyuserlogin'
import {sendNotificationMail} from '../helpers/mailer';
import * as authQueries from '../controllers/authentication'
// const db = require('../db')
dotenv.config()
const router = express.Router();
const {check, validationResult} = require('express-validator/check')

// router.use(bodyParser.json({ type: 'application/json' }));
// sign up
router.post('/auth/signup',[check('email').isEmail(), 
  check('password').isLength({ min: 5 })], 
  authQueries.signUp)

// login
router.post('/auth/signin', [check('email').isEmail()], authQueries.signIn)

const AuthController = router;
export { AuthController };
