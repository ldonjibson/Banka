import express from 'express';

import { jwtAdminVerify } from '../middleware/verifyAdmin';
import { pChecks as paramChecks } from '../middleware/paramCheck';
import { upload as xUpload } from '../helpers/upload';

import * as adminQueries from '../controllers/adminQueries';

const router = express.Router();

router.post('/admin/createstaff', jwtAdminVerify,
  adminQueries.createStaffAdmin);

// All Staff
router.get('/staff', jwtAdminVerify, adminQueries.getStaffUsers);

router.get('/staff/:id/transactions', paramChecks,
  jwtAdminVerify, adminQueries.getAllTransactionsPerfomedByOneStaff);

// Get a specific Staff User
router.get('/staff/:id', paramChecks, jwtAdminVerify,
  adminQueries.getSingleStaffUser);

// Edit single User
router.patch('/singleuser/profile/:id/edit', paramChecks,
  xUpload.single('file'), jwtAdminVerify, adminQueries.editUserProfile);

// deactivateAccount
router.patch('/account/:accountNumber', paramChecks,
  jwtAdminVerify, adminQueries.deactivateAccount);

// deleteAccount
router.delete('/accounts/:accountNumber', paramChecks,
  jwtAdminVerify, adminQueries.deleteAccount);

const adminRouter = router;
export { adminRouter };
