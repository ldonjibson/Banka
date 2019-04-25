import {pool} from '../db/index'
let clienty = pool.pool

const createUsersTable = `
	CREATE TABLE users(
	id SERIAL PRIMARY KEY, 
	email VARCHAR(40) NOT NULL UNIQUE, 
	firstname VARCHAR(40) NULL, 
	lastName VARCHAR(40) NULL,
	phone VARCHAR(40) NULL,
	password VARCHAR(225) NOT NULL,
	dob DATE NULL,
	registerDate TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
	type VARCHAR NOT NULL DEFAULT 'client',
	isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
	imageUrl VARCHAR NULL
	);`

const createAccountTable = `
	CREATE TABLE bankAccount(
	id SERIAL,
	accountName VARCHAR NOT NULL, 
	accountphone VARCHAR(40) NOT NULL,
	createdOn TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
	accounttype VARCHAR(40) NOT NULL,
	accountNumber INT NOT NULL CHECK (accountNumber > 0) UNIQUE,
	status VARCHAR(40) NOT NULL,
	owner INT references users(id) ON DELETE CASCADE,
	balance DECIMAL DEFAULT 0.0,
	CONSTRAINT pk_account PRIMARY KEY (id, accountNumber)
	);`

const createTransactionTable = `
	CREATE TABLE transaction(
	id SERIAL PRIMARY KEY,
	accountName VARCHAR(100) NOT NULL, 
	createdOn TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
	transactionType VARCHAR(40),
	transactionId SERIAL,
	accountNumber INT references bankAccount(accountNumber) ON DELETE CASCADE,
	cashier INT references users(id),
	oldBalance DECIMAL DEFAULT '0',
	newBalance DECIMAL ,
	sender VARCHAR(100), 
	recipient VARCHAR(100), 
	fromNumber VARCHAR(40),
	toNumber VARCHAR(40) 
	);`


const genUserTable = () =>{
	return new Promise((resolve, reject) =>{
		clienty.query(createUsersTable, (err, res) => {
				if (err){
					console.log(err);
				}else {
					genAccountTable();
			}
		});
	});
}

const genAccountTable = () =>{
	return new Promise((resolve, reject) =>{	
			clienty.query(createAccountTable, (err, res) => {
					if (err){
						console.log(err);
					}else {
						genTransactionTable();
				}
			});
		}
	)
}

const genTransactionTable = ()=>{
	return new Promise((resolve, reject) =>{
			clienty.query(createTransactionTable, (err, res) => {
					if (err){
						console.log(err);
					}else {
						console.log('created the transaction table successfully');
				}
			});
		}	
	)
}

const genTransactionTable = ()=>{
	return new Promise((resolve, reject) =>{
			clienty.query(insertUsers, (err, res) => {
					if (err){
						console.log(err);
					}else {
						console.log('populated');
				}
			});
		}	
	)
}

 const tableInit = async () => {
	await genUserTable();
	await genAccountTable(); 
	await genTransactionTable();
}





