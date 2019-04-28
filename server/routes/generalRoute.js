import express from 'express';

// HELPER FUNCTIONS
import { passwordReset } from '../controllers/generalQueries';

const router = express.Router();

// recover password
router.post('/resetpassword', passwordReset);

const generalRoute = router;
export { generalRoute };
