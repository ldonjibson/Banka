import express from 'express';
import { jwtStaffVerify } from '../middleware/verifyStaff';
import { pChecks as paramChecks } from '../middleware/paramCheck';

import * as staffQueries from '../controllers/staffQueries';


const router = express.Router();

// Get all users alone
router.get('/users', jwtStaffVerify, staffQueries.getAllUsers);

// Get a specific User
router.get('/user/:id', paramChecks, jwtStaffVerify,
  staffQueries.getOneClientTypeUser);

// //Get Specific user bank account
router.get('/user/account/:accountNumber',
  paramChecks, jwtStaffVerify, staffQueries.getSpecificClientBkAcc);

// //Get All transactions of Specific Bank Account
router.get('/user/account/:accountNumber/transactions',
  paramChecks, jwtStaffVerify, staffQueries.getAllTransactionsofSpecificBkAcc);

// //Get detailed transaction of a specific transaction of a bankaccount
router.get('/user/account/:accountNumber/transaction/:transactionId/detail',
  paramChecks, jwtStaffVerify, staffQueries.getSpecificAccTransactionDetail);

// //Get All Bank Accounts including active and dormant
router.get('/all/accounts/', jwtStaffVerify, staffQueries.getAllBankAccs);


// //Staff credit and debit users
router.post('/transactions/:accountNumber/credit',
  paramChecks, jwtStaffVerify, staffQueries.staffCanCreditAcc);

router.post('/transactions/:accountNumber/debit',
  paramChecks, jwtStaffVerify, staffQueries.staffCanDebitAcc);

const staffRouter = router;
export { staffRouter };
