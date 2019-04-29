/*

*/
import bcrypt from 'bcryptjs'; 
import * as  helper from '../helpers/helper'
import { pool } from '../db/index';
import { sendNotificationMail } from '../helpers/mailer';

const db = pool;


// Staff get all client type user alone
const getStaffUsers = (req, res) => {
  db.query(`SELECT users.id, email, firstname, lastname, phone, 
    dob, imageurl FROM users WHERE users.type = $1`, ['staff'])
    .then((response) => {
      const result = response.rows;
      if (response.rows.length == 0) {
        res.status(206).json({
          "status": 206,
          "message": 'You have no staff yet'
        });
      } else {
        res.status(200).json({
          "status": 200,
          "data": result,
        });
      }
    }).catch(error =>
      res.status(400).json({
        "status": 400,
        "error": error,
      }), 
    ); 	
};

const getSingleStaffUser = (req, res) => {
  const staffId = parseInt(req.params.id);
  db.query(`SELECT users.id, email, firstname, lastname, phone, dob, 
    imageurl, type, isAdmin,registerdate FROM users WHERE users.id = $1 
    AND users.type=$2`, [staffId, 'staff'])
    .then((response) => {
      const result = response.rows;
      if (result.length == 0) {
        res.status(404).json({
          "status": 404,
          "error": 'User is not a staff'
        });
      } else {
        res.status(200).json({
          "status": 200,
          "data": result[0],
        });
      }
    }).catch(error =>
      res.status(400).json({
        "status": 400,
        "error": error,
      }), 
    ); 	
};


// Staff get all client type user alone
// create staff and admin users
const createStaffAdmin = (req, res) => {
  let data = Object.keys(req.body);
  // checkif a all the fields are present by checking the length agains the expected length
  let chkobj = ['email', 'password', 'password1', 'firstName', 'lastName', 'phone', 'isAdmin'];
  let obj = [];
  for (let i = 0; i < data.length; i++) {
    let key = data[i];
    obj.push(key);
  }
  if (obj < chkobj) {
    res.status(422).json({
      "status": 422,
      "error": 'Please Check, A field is missing'
    });
	} else if (req.body.password !== req.body.password1) {
    res.status(403).json({
      "status": 403,
      "error": 'Password does not match'
    });
  } else {
    db.query('SELECT * FROM users WHERE email = $1', [req.body.email])
      .then((response) => {
        const results = response.rows[0];
        if (results !== undefined) {
          res.status(401).json({
            "status": 401,
            "error": "User already exist with email address",
          });
 			} else {
          // Create Hash Password
          let isAdmin;
          if (req.body['isAdmin'] === 'false'){
          	isAdmin = false
          }else{
          	isAdmin = true
          }
          let hashedPassword = bcrypt.hashSync(req.body.password, 8);
          let newUser = {
            "firstName": helper.sanitizeInputs(req.body.firstName),
            "lastName": helper.sanitizeInputs(req.body.lastName),
            "email": helper.sanitizeInputs(req.body.email),
            "password": hashedPassword,
            "phone": helper.sanitizeInputs(req.body.phone),
            "type": 'staff',
            "isAdmin": isAdmin
          };
          const staffpass = req.body.password
			    const pass = newUser.password;
			    db.query(`INSERT INTO users("email", "firstname", "lastname", "phone", 
            "password", "type", "isadmin") values($1, $2, $3, $4, $5, $6, $7) RETURNING *`, 
            [newUser.email, newUser.firstName, newUser.lastName, 
            newUser.phone, pass, newUser.type, newUser.isAdmin])
			    .then((response)=> {
			    	const results = response.rows;
			    	if (results.length !== 0) {
			    		sendNotificationMail(results[0].email, 
			    			"Staff Account Successfully  Created", 
			    			`Welcome to Ebanka, Login with ${staffpass} to Complete your profile`, 
			    			`<b><h3>Welcome to Ebanka!<h3><br> Login with <strong>${staffpass}<strong>
			    			 to Complete your profile<br/></b>`)
                res.status(201).json({
                  "status": 201,
                  "data": {
							        'email': results[0].email,
							        'firstName': results[0].firstname,
							        'lastName': results[0].lastname,
							        'phone': results[0].phone,
							        'registerDate': results[0].registerdate,
							        'type': results[0].type,
							        'isAdmin': results[0].isadmin,
							        'imageUrl': results[0].imageurl,
                  },
                });
			    	}
			    }).catch((error)=> {
			    	res.status(500).json({
			    		"status": 500,
			    		"error": "Internal Server Error"
			    	})

			    });

        }
		});
  }
};

const editUserProfile = (req, res) => {
  const userId = parseInt(req.params.id);
  if (!req.body.firstName || !req.body.lastName 
    || !req.body.phone || !req.body.dob || !req.body.isAdmin) {
    res.status(422).json({
      "status": 422,
      "message": 'Fill the compulsory fields',
    });
  } else {
    let firstName = helper.sanitizeInputs(req.body.firstName);
    let lastName = helper.sanitizeInputs(req.body.lastName);
    let phone = helper.sanitizeInputs(req.body.phone);
    let dob = req.body.dob;
    let image = req.file || 'http://localhost:3000/images/image_not_found.jpg';
    let isAdmin = req.body.isAdmin
    db.query('SELECT * FROM users WHERE id = $1', [userId])
      .then((response) => {
        let result = response.rows[0];
        if (result) {
  		    db.query(`UPDATE users SET firstname = $1, lastname = $2, phone = $3, 
            dob=$4, imageurl = $5, isadmin = $6  WHERE id = $7`, 
            [firstName, lastName, phone,dob, 
            image, isAdmin, userId])
  		    .then((response) => {
              res.status(206).json({
                "status": 206,
                "message": 'User Profile Updated Succesfully',
              });
            });
        } else {
          res.status(404).json({
            "status": 404,
            "error": 'Nothing was found'
          });
        }
      }).catch(error =>
        res.status(400).json({
          "status": 400,
          "error": error,
        }),
      );
  }
};

const getAllTransactionsPerfomedByOneStaff = (req, res) => {
  db.query('SELECT * FROM transaction WHERE cashier = $1', 
    [parseInt(req.params.id)])
    .then((response) => {
      const result = response.rows;
      if (result.length == 0) {
		    res.status(206).json({
		    	"status": 206,
		    	"message": 'User Not a Staff or has yet to perform a transaction'
		    });
      } else {
		    res.status(200).json({
		    	"status": 200,
		    	"data": result,
		    });
      }
    }).catch(error =>
	    res.status(400).json({
        "status": 400,
        "error": error,
      }),
    );
};

// Delete and Deactivate Accounts
const deactivateAccount = (req, res) => {
  const accountNumber = parseInt(req.params.accountNumber);
  let status;
  if (req.query.status === 'dormant'){
    status = 'dormant'
  }else if(req.query.status === 'active'){
    status = 'active'
  } else{
        res.status(400).json({
          "status": 400,
          "error": 'No action Specified'
        });
  }
  db.query('UPDATE bankaccount SET status = $1 WHERE accountnumber = $2 RETURNING id', 
    [status, accountNumber])
    .then((response) => {
      if (!response.rows[0]) {
        res.status(404).json({
          "status": 404,
          "error": 'Cannot find a matching account number'
        });
      } else {
        res.status(200).json({
          "status": 200,
          "message": `Account ${status} Successfully`,
        });
      }
    }).catch(error =>
      res.status(400).json({
        "status": 400,
        "error": error || 'database error'
      }), 
    ); 	
};

const deleteAccount = (req, res) => {
  const accountNumber = parseInt(req.params.accountNumber);
  db.query('DELETE FROM bankaccount WHERE accountnumber = $1', [accountNumber])
    .then((response) => {
      if (response.rowCount === 0) {
        res.status(404).json({
          "status": 404,
          "error": 'Cannot find a matching account number'
        });
      } else {
        res.status(200).json({
          "status": 200,
          "message": 'Account deleted Successfully'
        });
      }
    }).catch(error =>
      res.status(400).json({
        "status": 400,
        "error": error || 'database error'
      }), 
    ); 	
};

export {
  getStaffUsers,
  getSingleStaffUser,
  editUserProfile,
  deactivateAccount,
  deleteAccount,
  getAllTransactionsPerfomedByOneStaff,
  createStaffAdmin,
};
