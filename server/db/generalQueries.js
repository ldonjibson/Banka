/*

*/
import * as  helper from '../helpers/helper'
import bcrypt from 'bcryptjs'; 
import {sendNotificationMail} from '../helpers/mailer';

import {pool} from './index.js'
const db = pool



const passwordReset = (req, res) => {
	const email = req.body['email'];
	db.query(`SELECT * FROM users WHERE email = $1`, [req.body['email']])
	.then(response =>{
		const result = response.rows;
		if(!result[0]){
			res.status(404).json({
					"status":404,
					"error":"User does not exist"
				});
		} else if(result[0].email === email) {
			const tempPass = Math.random().toString(36).replace('0.', '') 
			let hashedPassword = bcrypt.hashSync(tempPass, 8);
			db.query(`UPDATE users SET password = $1 WHERE email = $2`, [hashedPassword, email], (error, response) =>{
				if(error){
					res.status(400).json({
						"status":400,
						"error":err
					})
				} else {
					//TODO
		    	sendNotificationMail(email,'Password Request', `You requested to change your password, your temporary password is ${tempPass}, login to change it`, `<b>You requested to change your password, your temporary password is <br>${tempPass}<br> , login to change it</b>`)
					res.status(201).json({
						"status": 201,
						"message": `Password recovery was successful, Check your mail to change your password`,
					});
				}
			});
		}
	}).catch (error => 
		res.status(400).json({
			"status": 400,
			"error": error || "database error"
		})
	)
}

export {
	passwordReset,
}

