# Banka 
[![Build Status](https://travis-ci.com/ldonjibson/Banka.svg?branch=api-one)](https://travis-ci.com/ldonjibson/Banka)  [![Coverage Status](https://coveralls.io/repos/github/ldonjibson/Banka/badge.svg?branch=api-one)](https://coveralls.io/github/ldonjibson/Banka?branch=api-one)  [![Maintainability](https://api.codeclimate.com/v1/badges/c70e31b59dd7bf97d0a8/maintainability)](https://codeclimate.com/github/ldonjibson/Banka/maintainability)  [![Test Coverage](https://api.codeclimate.com/v1/badges/c70e31b59dd7bf97d0a8/test_coverage)](https://codeclimate.com/github/ldonjibson/Banka/test_coverage)
---
## E-Banka
Banka is a light-weight core banking application that powers banking operations like account creation, customer deposit and withdrawals. This app is meant to support a single bank, where users can signup and create bank accounts online, but must visit the branch to withdraw or deposit money..

### Features
1. Users can create an account and log in.
2. Users can create bank account.
3. User can upload picture and edit profile
4. Staff and Admin can create user account and bank account
5. Staff and Admin can deactivate and activate user accounts
6. Admin can create staff account.
7. Staff can only view clients
8. Staff and Admin can credit and debit users

### 

**Technologies Used**
- NodeJS
- ExpressJs

**Installation**
Install node, version 10 or greater

Clone the repo:

git clone https://github.com/ldonjibson/Banka.git

`npm install`

Start server:
`npm start`

**Testing tools**
1. Mocha - A Javascript test framework.
2. Chai - A BDD / TDD Assertion library.
3. Istanbul - Javascript code coverage tool.
4. nyc - The Istanbul command line interface.

### Documentation 
**[Link to Documentation !]('https://ebanka-api.herokuapp.com')**
List of endpoints exposed by the service.



### Endpoints & Routes

### To Run Test 
- Use POSTMAN to access the `/api/v1/auth/signin`and provide an email and password and get a token in return.
- pass token into the all test files as variable and run  `npm test`

**CHEKING IF THE API EXISTS OR IS WORKING**
### https://ebanka-api.herokuapp.com/api/v1/
```
{
	"status": 1000,
	"message": Connected
}
```
**POST** 
- `auth/signup `
Use this route to create a new user account. The following fields are required:

1. firstName The firstname of the user
2. lastName The lastname of the user
3. email The email of the user
4. phone The telephone number of the user
5. password The user's password
6. dob User's Date of Birth
7. isAdmin (Only admin can choose this)
8. type (Only admin can choose this)

```
### Success Response
{
	"status": 1000,
	"data":	{
		"token": string,
		"id": integer,
		"firstName": string,
		"lastName": string,
		"email": string,
		"dob" : string,
		"phone": string,
		"registerDate": string,
		"type": string,
		"isAdmin": string
	}
}

### Error Response
{
	"status": 401,
	"error": "Please Check, A field is missing"
}
```

- `/api/v1/auth/signin` Use this route to signin user account and generate token. The following fields are required:

1. email The email or username of the user
2. password The user's password

```
### Success Response
{
	"status": 1000,
	"data":	{
		"token": string,
		"id": integer,
		"firstName": string,
		"lastName": string,
		"email": string,
		"dob" : string,
		"phone": string,
		"registerDate": string,
		"type": string,
		"isAdmin": string
	}
}

### Error Response


{
	"status": 401,
	"error": "Please Check, One or More field is empty"
}

//The user email doesnot exist
{
	"status": 1002,
	"error": "User does not exist"
}

//if password doesnot match
{
	"status": 1001,
	"error": "Authentication Failed! password parameter invalid"
}
```

- `accounts` Create a bank account for user
```
### Success Response
{
	"status": 1000,
	"data":	{
		"accountNumber": integer,
		"firstName": string,
		"lastName": string,
		"email": string,
		"type": string,
		"openingBalance": Float
	}
}

The has to be LoggedIn
### Error Response
{
	"status": 1006,
	"error": "Log in to Create a Bank Account"
}
```

**GET**
- `me/account` Use this route to access bank account dashboard
```
### Success Response
{
	"status": 1000,
	"data":	{
		"id": integer,
		"accountNumber": integer,
		"createdOn": string,
		"owner": integer,
		"type": string,
		"status": string,
		"balance": Float
	}
}

### Error Response
{
	"status": 1005,
	"data": "Invalid User Stay Out!"
}
```

- `me/profile` Use this route to access your profile details 
```
### Success Response
{
	"status": 1000,
	"data":	{
		"id": integer,
		"firstName": string,
		"lastName": string,
		"email": string,
		"dob" : string,
		"phone": string,
		"registerDate": string,
		"type": string,
		"isAdmin": string
	}
}

### Error Response
{
	"status": 1005,
	"data": "Invalid User Stay Out!"
}
```

- `me/account/transactions` List my transactions
```
### Success Response
{
	"status": 1000,
	"data":	[{
        "id": integer,
        "createdOn": string,
        "transactionType": string, e.g credit, debit
        "accountNumber": integer,
        "cashier": integer,
        "amount": Float,
        "oldBalance": Float,
        "newBalance": Float,
        "from": string,
        "to" : "",
        "fromNumber": string,
        "toNumber": ""
	},
	{
        "id": integer,
        "createdOn": string,
        "transactionType": string, e.g credit, debit
        "accountNumber": integer,
        "cashier": integer,
        "amount": Float,
        "oldBalance": Float,
        "newBalance": Float,
        "from": "",
        "to" : string,
        "fromNumber": "",
        "toNumber": string
	},
	...
	]
}

### Error Response
{
	"status": 1005,
	"data": "Invalid User Stay Out!"
}
```

- `me/account/transaction/<transaction-id>/detail` Check individual transaction detail
```
### Success Response
{
	"status": 1000,
	"data":	{
        "id": integer,
        "createdOn": string,
        "transactionType": string, e.g credit, debit
        "accountNumber": integer,
        "cashier": integer,
        "amount": Float,
        "oldBalance": Float,
        "newBalance": Float,
        "from": string,
        "to" : "",
        "fromNumber": string,
        "toNumber": ""
	}
}

### Error Response
//if a user is trying to access a transaction that doesnot belong to his/her
{
	"status": 2010,
	"error": "(not your transaction!) Wrong transaction details
}

//if the user does not exist
{
	"status": 1005,
	"data": "Invalid User Stay Out!"
}
```

**PATCH**

- `me/profile/edit` edit your profile
editable fields are: firstName(optional), lastName(optional), phone(optional), image(optional)
```
### Success Response
{
	"status": 1000,
	"data":	{
		"id": integer,
		"firstName": string,
		"lastName": string,
		"email": string,
		"dob" : string,
		"phone": string,
		"registerDate": string,
		"type": string,
		"isAdmin": string
	}
}

//if the user does not exist
{
	"status": 1005,
	"error": "Invalid User Stay Out!"
}
```

- `me/profile/changepassword` change your password 
field requires password and password1(confirm password)

```
### Success Response
{
	"status": 1000,
	"message": "Password changed successfully"
}

### Error Response

// if Password doesnot match
{
	"status": 1007,
	"error": "Both Password doesnot match!"
}

// if password attempt was not made
{
	"status": 1008,
	"error": "No password Attempt made"
}

// if the user does not exist
{
	"status": 1005,
	"error": "Invalid User Stay Out!"
}
```

### General to reset password

**POST**
- `resetpassword` for all users to reset password if they forget
```
### Success Response
{
	"status": 1000,
	"data": "Password recovery was successful" or "Password not sent due to failed emailing",
	"mail": <emailing response status>
}

## Error Response
{
	"status": 1101,
	"error": "User with <email string> doest not exist"
}
```

### Staff Only

**POST**
- `createbank/accounts` Create a bank account for user
```
### Success Response
{
	"status": 1000,
	"data":	{
		"accountNumber": integer,
		"firstName": string,
		"lastName": string,
		"email": string,
		"type": string,
		"openingBalance": Float
	}
}

### Error Response
//The has to be LoggedIn
{
	"status": 1006,
	"error": "Log in to Create a Bank Account"
}

//User email cannot be found in the database
{
	"status": 1002,
	"error": "User does not exist in the database create the user before a bank account"
}

//No email was sent/provided
{
	"status": 401,
	"error": "No email was provided"
}


```
**GET**
- `users` Allows only Clients(Users) to be shown to Staff
```
### Success Repsonse
{
    "status": 1000,
    "data": [
        {
            "id": integer,
            "email": string,
            "firstName": string,
            "lastName": string,
            "phone": string,
            "dob": string,
            "registerDate": string,
            "type": string,
            "isAdmin": false or true,
            "imageUrl": string
        },
        ...
    ]
}

```


- `user/<user-id>` single user detail is shown to the staff

```
### Success Repsonse
{
    "status": 1000,
    "data": 
        {
            "id": integer,
            "email": string,
            "firstName": string,
            "lastName": string,
            "phone": string,
            "dob": string,
            "registerDate": string,
            "type": string,
            "isAdmin": false or true,
            "imageUrl": string
        },
}

```

- `user/profile/<user-id>/edit`	Allow staff to edit users
editable fields are: firstName(optional), lastName(optional), phone(optional), image(optional)
```
### Success Response
{
	"status": 1000,
	"message": "Profile updated Successfully without Image"
}

{
	"status": 1000,
	"message": "Profile updated Successfully with Image"
}

//if the user does not exist
{
	"status": 1005,
	"error": "Invalid User Stay Out!"
}
```

**PATCH**
- `user/profile/<user-id>/changepassword` Allow staff to change user password

```
### Success Response
{
	"status": 1000,
	"message": "Password changed successfully"
}

### Error Response

// if Password doesnot match
{
	"status": 1007,
	"error": "Both Password doesnot match!"
}

// if password attempt was not made
{
	"status": 1008,
	"error": "No password Attempt made"
}

// if the user does not exist
{
	"status": 1005,
	"error": "Invalid User Stay Out!"
}
```


### Staff & Admin (Debit & Credit)

**POST**

- `transactions/<account-number>/credit` 

- `transactions/<account-number>/debit` 

```
### Success Response
{
	"status": 1000,
	"data": {
		"transactionId": integer,
		"accountNumber": integer,
		"amount": Float,
		"cashier": integer,
		"transactionType": string,// credit or debit
		"accountBalance": Float,
		"oldBalance": Float,
		"from": string, // only for credit transactiontype
		"to": "string", // only for debit transactiontype
		"fromNumber": string, // only for credit transactiontype
		"toNumber": "string" // only for debit transactiontype
	},
	"mail": string // success or error
}
}

### Error Response
// if account number cannot be found
{
	"status":2004,
	"error": "Cannot find a matching account number <accountNumber>"
}

// if the user does not exist
{
	"status": 1004,
	"error": "Invalid User Stay Out!"
}

```

### Staff & Admin

**GET**
- `allclients/transactions` This display all clients' transactions
```
###Success Response
{
	"status": 1000,
	"data": [{
        "id": integer,
        "createdOn": string,
        "transactionType": string, e.g credit, debit
        "accountNumber": integer,
        "cashier": integer,
        "amount": Float,
        "oldBalance": Float,
        "newBalance": Float,
        "from": string, //depends on transaction type
        "to" : string,//depends on transaction type
        "fromNumber": string, //depends on transaction type
        "toNumber": string //depends on transaction type
		},
		...
		]
}
```

- `clienttransaction/<transaction-id>/detail` This diplay the details of a particular transaction

```
###Success Response
{
	"status": 1000,
	"data": {
        "id": integer,
        "createdOn": string,
        "transactionType": string, e.g credit, debit
        "accountNumber": integer,
        "cashier": integer,
        "amount": Float,
        "oldBalance": Float,
        "newBalance": Float,
        "from": string, //depends on transaction type
        "to" : string,//depends on transaction type
        "fromNumber": string, //depends on transaction type
        "toNumber": string //depends on transaction type
		}
}

### Error Response
{
	"status": 2009,
	"error": "transaction ID does not exist!"
}
```

- `mydone/usertransaction/` This display only transaction done by a particular Staff or Admin
```
###Success Response
{
	"status": 1000,
	"data": [{
        "id": integer,
        "createdOn": string,
        "transactionType": string, e.g credit, debit
        "accountNumber": integer,
        "cashier": integer,
        "amount": Float,
        "oldBalance": Float,
        "newBalance": Float,
        "from": string, //depends on transaction type
        "to" : string,//depends on transaction type
        "fromNumber": string, //depends on transaction type
        "toNumber": string //depends on transaction type
		},
		...
		]
}

###Second success
{
	"status": 1000,
	"data": "You have not made any transaction at all"
}

### Error Response
{
	"status": 1004,
	"error": "Invalid User Stay Out!"
}
```
**DELETE**
- `accounts/<account-number>` This Staff and admin can deletes a bank account

```
###Success Response
{
	"status": 1000,
	"message": "Account <accountNumber> deleted Succesfully"
}

### Error Response
// account number doesnnot exist
{
	"status": 2004,
	"error": "Cannot find a matching account number <accountNumber>"

}
// User doesnot exist
{
	"status": 1004,
	"error": "Invalid User Stay Out!"
}
```

**PATCH**
- `account/<account-number>` This Staff and admin can Deactivate/suspend/dormant a bank account

```
###Success Response
{
	"status": 1000,
	"data": {
        "id": integer,
        "accountNumber": integer,
        "createdOn": string,
        "owner": integer,
        "type": string,
        "status": string, //Status (dormant/active)
        "balance": Float
	}
}

### Error Response
// account number doesnnot exist
{
	"status": 2004,
	"error": "Cannot find a matching account number <accountNumber>"

}
// User doesnot exist
{
	"status": 1004,
	"error": "Invalid User Stay Out!"
}
```

### Admin Only
**GET**
- `allusers` This list alluser to the admin including the staff & clients
```
### Success Repsonse
{
    "status": 1000,
    "data": [
        {
            "id": integer,
            "email": string,
            "firstName": string,
            "lastName": string,
            "phone": string,
            "dob": string,
            "registerDate": string,
            "type": string,
            "isAdmin": false or true,
            "imageUrl": string
        },
        ...
    ]
}

```

- `allusers/<user-id>` get a specific user details
```
### Success Repsonse
{
    "status": 1000,
    "data": {
            "id": integer,
            "email": string,
            "firstName": string,
            "lastName": string,
            "phone": string,
            "dob": string,
            "registerDate": string,
            "type": string,
            "isAdmin": false or true,
            "imageUrl": string
        }
}

##Error Response

{
	"status": 1004,
	"error": "User with that ID does not exist"
}

```

- `staff` This list alluser to the admin including the staff
```
### Success Repsonse
{
    "status": 1000,
    "data": {
            "id": integer,
            "email": string,
            "firstName": string,
            "lastName": string,
            "phone": string,
            "dob": string,
            "registerDate": string,
            "type": staff,
            "isAdmin": false or true,
            "imageUrl": string
        }
}

##Error Response

{
	"status": 1004,
	"error": "User with that ID does not exist"
}

```

- `staff/<staff-id>` This get a specific staff details.
```
### Success Repsonse
{
    "status": 1000,
    "data": {
            "id": integer,
            "email": string,
            "firstName": string,
            "lastName": string,
            "phone": string,
            "dob": string,
            "registerDate": string,
            "type": staff,
            "isAdmin": false or true,
            "imageUrl": string
        }
}

##Error Response

{
	"status": 1004,
	"error": "User with that ID does not exist"
}

```

**PATCH**
- `allusers/profile/<user-id>/edit` get a specific user + staff details and edit. 
Field Required are:
- firstName(optional), lastName(optional), phone(optional), image(optional)
```
### Success Repsonse
{
    "status": 1000,
    "message": "Profile updated Successfully without Image"
}

{
    "status": 1000,
    "message": "Profile updated Successfully with Image"
}

##Error Response

{
	"status": 1005,
	"error": "Invalid User Stay Out!"
}

```

- `allusers/profile/<user-id>/changepassword` get a specific user + staff details and changethe password.
field requires password and password1(confirm password)

```
### Success Response
{
	"status": 1000,
	"message": "Password changed successfully"
}

### Error Response

// if Password doesnot match
{
	"status": 1007,
	"error": "Both Password doesnot match!"
}

// if password attempt was not made
{
	"status": 1008,
	"error": "No password Attempt made"
}

// if the user does not exist
{
	"status": 1005,
	"error": "Invalid User Stay Out!"
}
```


### Permission needed route checks and if it is not meet the response is always the same


```
// For Staff Permission level
{
	"status": "1005",
	"error": "You are not a staff"
}

// For Admin Permission level
{
	"status": 1005,
	"error": "You are not an Admin"
}

// For User Level Permission 
{
	"status": 1002,
	"error": "Failed to Authenticate token"
}

//if no token was provided

{
	"status": 1004,
	"error": "No token provided."
}


```
