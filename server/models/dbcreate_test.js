import format from 'pg-format';
import { pool } from '../db/index';

const clienty = pool;


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
	);`;

const createAccountTable = `
	CREATE TABLE bankaccount(
	id SERIAL,
	accountname VARCHAR NOT NULL, 
	accountphone VARCHAR(40) NOT NULL,
	createdOn TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
	accounttype VARCHAR(40) NOT NULL,
	accountnumber INT NOT NULL CHECK (accountNumber > 0) UNIQUE,
	status VARCHAR(40) NOT NULL,
	owner INT references users(id) ON DELETE CASCADE,
	balance DECIMAL DEFAULT 0.0,
	CONSTRAINT pk_account PRIMARY KEY (id, accountNumber)
	);`;

const createTransactionTable = `
	CREATE TABLE transaction(
	id SERIAL PRIMARY KEY,
	accountname VARCHAR(100) NOT NULL, 
	createdon TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
	transactiontype VARCHAR(40),
	transactionId SERIAL,
	accountNumber INT references bankaccount(accountnumber) ON DELETE CASCADE,
	cashier INT references users(id),
	oldbalance DECIMAL DEFAULT '0',
	newbalance DECIMAL ,
	sender VARCHAR(100), 
	recipient VARCHAR(100), 
	fromnumber VARCHAR(40),
	tonumber VARCHAR(40) 
	);`;


// TO GENERATE DATABSE Using Async / await
const genUserTable = () => {
  clienty.query(createUsersTable).then((res) => {
    genAccountTable();
  }).catch((error) => { console.log(error); });
};


const genAccountTable = () => {
  clienty.query(createAccountTable).then((res) => {
    genTransactionTable();
  }).catch((error) => { console.log(error); });
};

const genTransactionTable = () => {
  clienty.query(createTransactionTable).then((res) => {
    toInsertUsers();
  }).catch((error) => { console.log(error); });
};

const toInsertUsers = () => {
  clienty.query(insertUsers).then((res) => {
    toInsertBankAccounts();
  }).catch((error) => { console.log(error); });
};

const toInsertBankAccounts = () => {
  clienty.query(insertBankAccounts).then((res) => {
    toInsertTransaction();
  }).catch((error) => { console.log(error); });
};

const toInsertTransaction = () => {
  clienty.query(insertTransactions).then((res) => {
    console.log('Done populating');
  }).catch((error) => { console.log(error); });
};

// INSERTING DEMO DATABASE
const userdata = [
  ['admin@gmail.com', 'Admin', 'Tom', '08023464732',
    '$2a$05$lMHQB2U2nrw92yOO1mpcLumpxo6z3cLGTuxLFxO6uVi8OjpstC6Im',
    '1991-05-05', 'staff', true, ''],
  ['johndoe@gmail.com', 'John', 'Doe', '08023423732',
    '$2a$05$lMHQB2U2nrw92yOO1mpcLumpxo6z3cLGTuxLFxO6uVi8OjpstC6Im',
    '1988-10-15', 'staff', false, ''],
  ['m.tatcher@gmail.com', 'Mary', 'Tatcher', '08034464732',
    '$2a$05$lMHQB2U2nrw92yOO1mpcLumpxo6z3cLGTuxLFxO6uVi8OjpstC6Im',
    '1990-01-05', 'staff', false, ''],
  ['tmarvin@gmail.com', 'Tochukwu', 'Marvin', '080343464732',
    '$2a$05$lMHQB2U2nrw92yOO1mpcLumpxo6z3cLGTuxLFxO6uVi8OjpstC6Im',
    '1991-5-05', 'client', false, ''],
  ['goddey004@gmail.com', 'Goddey', 'Ajebo', '08000464732',
    '$2a$05$lMHQB2U2nrw92yOO1mpcLumpxo6z3cLGTuxLFxO6uVi8OjpstC6Im',
    '1985-03-05', 'client', false, ''],
];

const bankaccountdata = [
  ['Felix and Sons', '1111111111111', 'current', '1427875169', 
  'active', '4', '139093.00'],
  ['Tochukwu Marvin', '111111111111', 'savings', '1473428980', 
  'active', '4', '40003.00'],
  ['Goddey Ajebo', '22222222222', 'savings', '1873428980', 
  'dormant', '5', '1303.00'],
  ['Mica Investments', '22222222222', 'savings', '1943428980', 
  'active', '5', '200003.00']
  ];

const transactiondata = [
  ['Felix and Sons', 'credit', '1427875169', '2', '39090.00',
    '139093.00', 'Tmobiles', '', '00834332424', ''],
  ['Tochukwu Marvin', 'debit', '1473428980', '3', '50003.00',
    '40003.00', '', 'self', '', '080343464732'],
  ['Felix and Sons', 'credit', '1427875169', '2', '39090.00',
    '20093.00', 'Tmobiles', '', '00834332424', ''],
  ['Mica Investments', 'credit', '1943428980', '2', '39090.00',
    '309093.00', 'Tmobiles', '', '00834332424', ''],
  ['Goddey Ajebo', 'debit', '1873428980', '3', '50003.00',
    '13003.00', '', 'self', '', '080343464732']
];
const insertUsers = 	format(`INSERT INTO users 
		(email, firstname, lastname, phone, password, dob, 
		type, isadmin, imageurl) VALUES %L`, userdata);

const insertBankAccounts = 	format(`INSERT INTO bankaccount 
		(accountname, accountphone, accounttype, accountnumber, 
		status, owner, balance) VALUES %L`, bankaccountdata);

const insertTransactions = 	format(`INSERT INTO transaction 
		(accountname, transactiontype, accountnumber, cashier, 
		oldbalance, newbalance, sender, recipient, fromNumber, 
		toNumber) VALUES %L`, transactiondata);


genUserTable();

export {
  genUserTable,
};
