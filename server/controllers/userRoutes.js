import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs'; 
//HELPER FUNCTIONS
import * as helper from '../helpers/helper';
import * as upload from '../helpers/upload';

// Middleswares
import {jwtVerify} from '../middleware/verifyuserlogin';
import {pChecks as paramChecks} from '../middleware/paramCheck';
import {upload as xUpload}  from '../helpers/upload'
// import {pool} from '../db/index'
// let clienty = pool.pool
import * as userQueries from '../db/userQueries';

let server = express();
const router = express.Router();

import * as config from '../config/config'

server.set('superSecret', config.secret);

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));


// Get the User Profile
router.get('/me/profile', jwtVerify, userQueries.getUserProfile)

router.get('/me/account', jwtVerify, userQueries.getUserAccounts)

router.get('/me/account/:accountNumber/transactions', jwtVerify, userQueries.getTransactionByAccNo)

router.get('/me/account/:accountNumber/transaction/:id/detail',paramChecks, jwtVerify, userQueries.getSpecificTransactionAccById)

router.patch('/me/profile/edit', xUpload.single('file'), jwtVerify,  userQueries.userEditProfile)

router.patch('/me/profile/changepassword', jwtVerify,userQueries.userChangePassword)

router.post('/accounts', jwtVerify, userQueries.createBankAcc)

let userRouter = router;
export {userRouter}
