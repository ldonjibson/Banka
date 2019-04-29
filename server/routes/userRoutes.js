import express from 'express';
// Middleswares
import { jwtVerify } from '../middleware/verifyuserlogin';
import { pChecks as paramChecks } from '../middleware/paramCheck';
import { upload as xUpload } from '../helpers/upload';
// import {pool} from '../db/index'
// let clienty = pool.pool
import * as userQueries from '../controllers/userQueries';

const router = express.Router();

// Get the User Profile
router.get('/me/profile', jwtVerify, userQueries.getUserProfile);

router.get('/me/account', jwtVerify, userQueries.getUserAccounts);

router.get('/me/account/:accountNumber/transactions',
  jwtVerify, userQueries.getTransactionByAccNo);

router.get('/me/account/:accountNumber/transaction/:id/detail',
  paramChecks, jwtVerify, userQueries.getSpecificTransactionAccById);

router.patch('/me/profile/edit', xUpload.single('file'),
  jwtVerify, userQueries.userEditProfile);

router.patch('/me/profile/changepassword',
  jwtVerify, userQueries.userChangePassword);

router.post('/accounts', jwtVerify, userQueries.createBankAcc);

const userRouter = router;
export { userRouter };
