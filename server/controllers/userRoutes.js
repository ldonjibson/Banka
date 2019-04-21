const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); // used to encrypt password


let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

//HELPER FUNCTIONS
let helper = require('../helpers/helper')
let upload = require('../helpers/upload')

// Middleswares
const jwtVerify = require('../middleware/verifyuserlogin')
const jwtStaffVerify = require('../middleware/verifyStaff')
const paramChecks = require('../middleware/paramCheck')

const pool = require('../db/index.js')
let clienty = pool.pool
let userQueries = require('../db/userQueries.js')

let server = express();
const router = express.Router();

let config = require('../config/config')

server.set('superSecret', config.secret);

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));

// Get the User Profile
router.get('/me/profile', jwtVerify, userQueries.getUserProfile)

router.get('/me/account', jwtVerify, userQueries.getUserAccounts)

router.get('/me/account/:accountNumber/transactions', jwtVerify, userQueries.getTransactionByAccNo)

router.get('/me/account/:accountNumber/transaction/:id/detail',paramChecks, jwtVerify, userQueries.getSpecificTransactionAccById)

router.patch('/me/profile/edit', upload.upload.single('file'), jwtVerify,  userQueries.userEditProfile)

router.patch('/me/profile/changepassword', jwtVerify,userQueries.userChangePassword)

router.post('/accounts', jwtVerify, userQueries.createBankAcc)

module.exports = router;
