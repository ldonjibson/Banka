const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); // used to encrypt password
let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
let helper = require('../helpers/helper')

const jwtAdminVerify = require('../middleware/verifyAdmin')
const paramChecks = require('../middleware/paramCheck')
let upload = require('../helpers/upload')

let adminQueries = require('../db/adminQueries.js')

let server = express();
const router = express.Router();

let config = require('../config/config')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));

//All Staff
router.get('/staff', jwtAdminVerify, adminQueries.getStaffUsers)

// Get a specific Staff User
router.get('/staff/:id',paramChecks, jwtAdminVerify, adminQueries.getSingleStaffUser)

router.get('/staff/:id/transactions',paramChecks, jwtAdminVerify, adminQueries.getAllTransactionsPerfomedByOneStaff)

//Edit single User
router.patch('/singleuser/profile/:id/edit', paramChecks, upload.upload.single('file'), jwtAdminVerify, adminQueries.editUserProfile)

// deactivateAccount
router.patch('/account/:accountNumber',paramChecks, jwtAdminVerify, adminQueries.deactivateAccount)

// deleteAccount
router.delete('/accounts/:accountNumber',paramChecks, jwtAdminVerify, adminQueries.deleteAccount)

module.exports = router;