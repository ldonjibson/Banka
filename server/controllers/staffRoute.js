import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs'; 
import * as helper from '../helpers/helper';
import {jwtStaffVerify} from '../middleware/verifyStaff';
import {pChecks as paramChecks} from '../middleware/paramCheck';

import * as staffQueries from '../db/staffQueries'

let server = express();
const router = express.Router();

import * as config from '../config/config'


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));





// //Staff credit and debit users
router.post('/transactions/:accountNumber/credit',paramChecks, jwtStaffVerify, staffQueries.staffCanCreditAcc)

router.post('/transactions/:accountNumber/debit',paramChecks, jwtStaffVerify, staffQueries.staffCanDebitAcc)

let staffRouter = router;
export {staffRouter}

