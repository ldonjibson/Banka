import express from 'express';
import bodyParser from 'body-parser';

//HELPER FUNCTIONS
import * as helper from '../helpers/helper';
import {passwordReset} from '../db/generalQueries'

// Middleswares
import {pChecks as paramChecks} from '../middleware/paramCheck';


let server = express();
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json({ type: 'application/json'}));

// recover password
router.post('/resetpassword', passwordReset)

let generalRoute = router;
export {generalRoute}
