import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs'; // used to encrypt password
import jwt from 'jsonwebtoken'; // used to create, sign, and verify tokens
import * as helper from '../helpers/helper';

import {jwtAdminVerify} from '../middleware/verifyAdmin';
import {pChecks as paramChecks} from '../middleware/paramCheck';
import {upload as xUpload}  from '../helpers/upload'

import * as adminQueries from '../db/adminQueries'

let server = express();
const router = express.Router();

import * as config from '../config/config'

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));


router.post('/admin/createstaff', jwtAdminVerify, adminQueries.createStaffAdmin)

//All Staff
router.get('/staff', jwtAdminVerify, adminQueries.getStaffUsers)

router.get('/staff/:id/transactions',paramChecks, jwtAdminVerify, adminQueries.getAllTransactionsPerfomedByOneStaff)

// Get a specific Staff User
router.get('/staff/:id',paramChecks, jwtAdminVerify, adminQueries.getSingleStaffUser)

//Edit single User
router.patch('/singleuser/profile/:id/edit', paramChecks, xUpload.single('file'), jwtAdminVerify, adminQueries.editUserProfile)

// deactivateAccount
router.patch('/account/:accountNumber',paramChecks, jwtAdminVerify, adminQueries.deactivateAccount)
