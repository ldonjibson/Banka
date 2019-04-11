# Banka 
[![Build Status](https://travis-ci.com/ldonjibson/Banka.svg?branch=api-one)](https://travis-ci.com/ldonjibson/Banka)  [![Coverage Status](https://coveralls.io/repos/github/ldonjibson/Banka/badge.svg?branch=api-one)](https://coveralls.io/github/ldonjibson/Banka?branch=api-one)  [![Maintainability](https://api.codeclimate.com/v1/badges/c70e31b59dd7bf97d0a8/maintainability)](https://codeclimate.com/github/ldonjibson/Banka/maintainability)  [![Test Coverage](https://api.codeclimate.com/v1/badges/c70e31b59dd7bf97d0a8/test_coverage)](https://codeclimate.com/github/ldonjibson/Banka/test_coverage)
---
## E-Banka
Banka is a light-weight core banking application that powers banking operations like account creation, customer deposit and withdrawals. This app is meant to support a single bank, where users can signup and create bank accounts online, but must visit the branch to withdraw or deposit money..

## Features
1. Users can create an account and log in.
2. Users can create bank account.
3. User can upload picture and edit profile
4. Staff and Admin can create user account and bank account
5. Staff and Admin can deactivate and activate user accounts
6. Admin can create staff account.
7. Staff can only view clients
8. Staff and Admin can credit and debit users

## Technologies Used
- NodeJS
- ExpressJs

## Installation
Install node, version 10 or greater

Clone the repo:

git clone https://github.com/ldonjibson/Banka.git

`npm install`

Start server:
`npm start`

##Testing tools
Mocha - A Javascript test framework.
Chai - A BDD / TDD Assertion library.
Istanbul - Javascript code coverage tool.
nyc - The Istanbul command line interface.

star Documentation star
List of endpoints exposed by the service. For full api documentation, visit docs

Endpoints
Routes

# POST 
/api/v1/auth/signup 
Use this route to create a new user account. The following fields are required:

firstName The firstname of the user
lastName The lastname of the user
email The email of the user
phone The telephone number of the user
password The user's password
dob User's Date of Birth
isAdmin (Only admin can choose this)
type (Only admin can choose this)

/api/v1/auth/signin Use this route to signin user account and generate token. The following fields are required:

email The email or username of the user
password The user's password

me/account Use this route to access bank account dashboard


# GET /api/v1/
me/profile Use this route to access your profile details 

/accounts Create a bank account


me/account/transactions List my transactions

me/account/transaction/<transaction-id>/detail Check individual transaction detail


PATCH /api/v1/

me/profile/edit edit your profile
editable fields are: firstName, lastName, phone, image

me/profile/changepassword change your password


