import express from 'express';
import bodyParser from 'body-parser';

let server = express();
const router = express.Router();


//route midleware to verify if parameter passed is a number

const paramChecks= ((req, res, next) => {
	// check header or url parameters or post parameteers for token
	let number = req.params.id || req.params.accountNumber
	if(isNaN(number)) {
		//verifies if the parameter passed is a number
		return res.status(400).json({
			"status": 400,
			"error": "Invalid Parameters"
		});
	} else {
		next();
	}

});

export let pChecks = paramChecks;
