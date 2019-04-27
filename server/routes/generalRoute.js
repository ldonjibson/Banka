import express from 'express';

// HELPER FUNCTIONS
import * as helper from '../helpers/helper';
import { passwordReset } from '../controllers/generalQueries';

// Middleswares
import { pChecks as paramChecks } from '../middleware/paramCheck';


const router = express.Router();


// recover password
router.post('/resetpassword', passwordReset);

const generalRoute = router;
export { generalRoute };
