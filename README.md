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
List of endpoints exposed by the service. For full api documentation, visit docs

Endpoints
Routes

**POST** 
- `/api/v1/auth/signup `
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
		"token": <token>,
		"id": <:id>,
		"firstName": <first-name>,
		"lastName": <last-name>,
		"email": <email>,
		"dob" : <date-of-birth>,
		"phone": <Phone>,
		"registerDate": <Date>,
		"type": <Type of User>,
		"isAdmin": <User's Role>
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
		"token": <token>,
		"id": <:id>,
		"firstName": <first-name>,
		"lastName": <last-name>,
		"email": <email>,
		"dob" : <date-of-birth>,
		"phone": <Phone>,
		"registerDate": <Date>,
		"type": <Type of User>,
		"isAdmin": <User's Role>
	}
}

### Error Response
{
	"status": 401,
	"error": "Please Check, One or More field is empty"
}

{
	"status": 1002,
	"error": "User does not exist"
}

{
	"status": 1001,
	"error": "Authentication Failed! password parameter invalid"
}
```



**GET `/api/v1/`**
- `me/account` Use this route to access bank account dashboard
```
### Success Response
{
	"status": 1000,
	"data":	{
		"id": <:id>,
		"accountNumber": <AccountNumber>,
		"createdOn": <created date>,
		"owner": <user-id>,
		"type": <type of account>,
		"status": <status of account>,
		"balance": <Amount in Bank>
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
		"id": <:id>,
		"firstName": <first-name>,
		"lastName": <last-name>,
		"email": <email>,
		"dob" : <date-of-birth>,
		"phone": <Phone>,
		"registerDate": <Date>,
		"type": <Type of User>,
		"isAdmin": <User's Role>
	}
}

### Error Response
{
	"status": 1005,
	"data": "Invalid User Stay Out!"
}
```

- `me/account/transactions` List my transactions

- `me/account/transaction/<transaction-id>/detail` Check individual transaction detail


**PATCH `/api/v1/`**

- `me/profile/edit` edit your profile
editable fields are: firstName, lastName, phone, image

- `me/profile/changepassword` change your password


### General to reset password

**POST `/api/v1/`**
- `resetpassword` for all users to reset password if they forget


### Staff Only

**POST `/api/v1/`**
- `/accounts` Create a bank account


**GET `/api/v1/`**
- `users` Allows only Clients(Users) to be shown to Staff

- `user/<user-id>` single user detail is shown to the staff

- `user/profile/<user-id>/edit`	Allow staff to edit users

**PATCH `/api/v1/`**

- `user/profile/<user-id>/changepassword` Allow staff to change user password

### Staff & Admin (Debit & Credit)

**POST `/api/v1/`**

- `transactions/<account-number>/credit` 

- `transactions/<account-number>/debit` 

### Staff & Admin

**GET `/api/v1/`**
- `allclients/transactions` This display all clients' transactions

- `clienttransaction/<transaction-id>/detail` This diplay the details of a particular transaction

- `mydone/usertransaction/` This display only transaction done by a particular Staff or Admin

**DELETE `/api/v1/`**
- `accounts/<account-number>` This Staff and admin can deletes a bank account

**PATCH `/api/v1/`**
- `account/<account-number>` This Staff and admin can Deactivate/suspend/dormant a bank account

### Admin Only

**GET `/api/v1/`**
- `allusers` This list alluser to the admin including the staff & clients

- `allusers/<user-id>` get a specific user details

- `staff` This list alluser to the admin including the staff

- `staff/<staff-id>` This get a specific staff details.

**PATCH `/api/v1/`**
- `allusers/profile/<user-id>/edit` get a specific user + staff details and edit.

- `allusers/profile/<user-id>/changepassword` get a specific user + staff details and changethe password.


