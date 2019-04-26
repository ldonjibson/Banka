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


