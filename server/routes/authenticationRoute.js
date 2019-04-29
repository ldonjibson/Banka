import dotenv from 'dotenv';
import express from 'express';
import * as authQueries from '../controllers/authentication';
// const db = require('../db')
//dotenv.config();
const router = express.Router();
const { check } = require('express-validator/check');

// router.use(bodyParser.json({ type: 'application/json' }));
// sign up
router.post('/auth/signup',authQueries.signUp);

// login
router.post('/auth/signin', authQueries.signIn);

const AuthController = router;
export { AuthController };
