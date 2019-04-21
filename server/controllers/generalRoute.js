const express = require('express')
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs'); // used to encrypt password

let jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

//HELPER FUNCTIONS
let helper = require('../helpers/helper')
let upload = require('../helpers/upload')
let generalQueries = require('../db/generalQueries.js')


// Middleswares
const jwtVerify = require('../middleware/verifyuserlogin')
const jwtStaffVerify = require('../middleware/verifyStaff')
const paramChecks = require('../middleware/paramCheck')


let server = express();
const router = express.Router();

let config = require('../config/config')

server.set('superSecret', config.secret);

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));

let transporter = require('../helpers/mailer')

// recover password
router.post('/resetpassword', generalQueries.passwordReset)

module.exports = router;
