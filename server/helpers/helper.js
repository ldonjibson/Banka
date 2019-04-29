/*
This are random functions that are used repeately through out the Api
*/
import { pool } from '../db/index';
import validator from 'validator';
import express from 'express'
import jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens
import {secret} from '../config/config'
let server = express();
server.set('superSecret', secret);


const db = pool;

const ranDom = () => {
  const accNum = 1000000000 + Math.floor((Math.random() * 999999999));
  return accNum;
};

const uniqueAccNumber = () => {
  const accNum = ranDom() - Math.floor((Math.random()
    * 50000) + Math.random() * 30000);
  return accNum;
};


const authHelper = (req) => {
  let email = req.body.email
  let password = req.body.password
  if (!validator.isEmail(email) || 
    !validator.isLength(password, {min:5, max:undefined})){
    return true
  }
};

const sanitizeInputs = (value) => {
  return validator.trim(value)
}

const sanitizePhonenumbers = (req, res) => {
phone = validator.isMobilePhone(req.body.phone)
if (phone === false){
  return false
} else{
  return true
  }
}

const sanitizeDates = (req, res) => {
dob = validator.isISO8601(req.body.dob)
if (dob === false){
 return false
} else{
  return true
  }
}

//For Test
const genToken = (email, id) => { 
  return jwt.sign({'email': email, 'id': id}, server.get('superSecret'),{expiresIn: '24h',}) 
}

// exports
export {
  ranDom,
  uniqueAccNumber,
  authHelper,
  sanitizeInputs,
  genToken,
  sanitizePhonenumbers,
  sanitizeDates
};
