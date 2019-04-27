/*

*/
import bcrypt from 'bcryptjs'; 
import * as  helper from '../helpers/helper'
import { pool } from '../db/index';
import { sendNotificationMail } from '../helpers/mailer';

const db = pool;


// Staff get all client type user alone
const getStaffUsers = (req, res) => {
  db.query('SELECT users.id, email, firstname, lastname, phone, dob, imageurl FROM users WHERE users.type = $1', ['staff'])
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
  db.query('SELECT users.id, email, firstname, lastname, phone, dob, imageurl, type, isAdmin,registerdate FROM users WHERE users.id = $1 AND users.type=$2', [staffId, 'staff'])
    .then((response) => {
      const result = response.rows;
      if (result.length == 0) {
        res.status(404).json({
          "status": 404,
          "error": 'User with that ID does not exist'
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
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "password": hashedPassword,
            "phone": req.body.phone,
            "type": 'staff',
            "isAdmin": isAdmin
          };
          const staffpass = req.body.password
			    const pass = newUser.password;
			    db.query('INSERT INTO users("email", "firstname", "lastname", "phone", "password", "type", "isadmin") values($1, $2, $3, $4, $5, $6, $7) RETURNING *', [newUser.email, newUser.firstName, newUser.lastName, newUser.phone, pass, newUser.type, newUser.isAdmin])
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
  db.query('SELECT * FROM users WHERE id = $1', [userId])
    .then((response) => {
      let result = response.rows[0];
      if (result) {
        let firstName = req.body.firstName || null;
        let lastName = req.body.lastName || null;
        let phone = req.body.phone || null;
        let dob = req.body.dob || null;
        let image = req.file || null;
        let imageurl = 'http://localhost:3000/images/\'+ req.file.filename';
        let type = req.body.type
        let isAdmin = req.body.isAdmin

        if (firstName) {
          result.firstname = firstName; 
        }
        if (lastName) {
          result.lastname = lastName;
        }
        if (phone) {
          result.phone = phone;
        }
        if (dob) {
          result.phone = dob;
        }
        if (image) {
          result.imageurl = `http://localhost:3000/images/${ req.file.filename}`
        }
        if (type) {
          result.type = type;
        }
        if (isAdmin) {
          result.isadmin = isAdmin;
        }
		    db.query('UPDATE users SET firstname = $1, lastname = $2, phone = $3, dob=$4, imageurl = $5, type = $6, isadmin = $7  WHERE id = $8', [result.firstname, result.lastname, result.phone, result.dob, result.imageurl, result.type, result.isadmin, userId])
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
};

const getAllTransactionsPerfomedByOneStaff = (req, res) => {
  db.query('SELECT * FROM transaction WHERE cashier = $1', [parseInt(req.params.id)])
    .then((response) => {
      const result = response.rows;
      if (result.length == 0) {
		    res.status(200).json({
		    	status: 200,
		    	message: 'Staff has yet to perform a transaction'
		    });
      } else {
		    res.status(200).json({
		    	'status': 200,
		    	data: result,
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
  const status = req.query.status || null;
  db.query('UPDATE bankaccount SET status = $1 WHERE accountnumber = $2 RETURNING id', [status, accountNumber])
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
