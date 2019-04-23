const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); 
let jwt    = require('jsonwebtoken');
let helper = require('../helpers/helper')
let users = require('../datastore/user')
let transactions = require('../datastore/transaction')
let accounts = require('../datastore/account')
const jwtStaffVerify = require('../middleware/verifyStaff')
const paramChecks = require('../middleware/paramCheck')

let upload = require('../helpers/upload')

let staffQueries = require('../db/staffQueries.js')


let server = express();
const router = express.Router();

let config = require('../config/config')


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));

//Get all users alone
router.get('/users', jwtStaffVerify, staffQueries.getAllUsers)

// Get a specific User
router.get('/user/:id',paramChecks, jwtStaffVerify, staffQueries.getOneClientTypeUser)

//Get Specific user bank account
router.get('/user/account/:accountNumber',paramChecks, jwtStaffVerify, staffQueries.getSpecificClientBkAcc)

//Get All transactions of Specific Bank Account
router.get('/user/account/:accountNumber/transactions',paramChecks, jwtStaffVerify, staffQueries.getAllTransactionsofSpecificBkAcc)

//Get detailed transaction of a specific transaction of a bankaccount
router.get('/user/account/:accountNumber/transaction/:transactionId/detail',paramChecks, jwtStaffVerify, staffQueries.getSpecificAccTransactionDetail)

//Get All Bank Accounts including active and dormant
router.get('/all/accounts/', jwtStaffVerify, staffQueries.getAllBankAccs)


//Staff credit and debit users
router.post('/transactions/:accountNumber/credit',paramChecks, jwtStaffVerify, staffQueries.staffCanCreditAcc)

router.post('/transactions/:accountNumber/debit',paramChecks, jwtStaffVerify, staffQueries.staffCanDebitAcc)


module.exports = router;