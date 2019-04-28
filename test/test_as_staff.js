import chai from 'chai';
import request from 'request';
import dotenv from 'dotenv'
import express from 'express'
import * as helper from '../server/helpers/helper'

dotenv.config();

let expect = chai.expect
const PORT = process.env.PORT || 3000;

let staffToken = helper.genToken('johndoe@gmail.com', 2)
let url = `http://localhost:${PORT}/api/v1/`

	describe('GET / For Staff  and Admin Alone', ()=> {

		it ('Should return all users', (done) => {
			request.get(`${url}users?token=${staffToken}`, 
				(error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();	
			});
		});


		it('should return user id detail', (done) => {
			request.get(`${url}user/1?token=${staffToken}`, 
				(error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

		it('should not return user with wrong id detail', (done) => {
			request.get(`${url}user/200?token=${staffToken}`, 
				(error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(404);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

		it('should return user bank acount Details', (done) => {
			request.get(`${url}user/account/1427875169?token=${staffToken}`, 
				(error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});

		it('should not return user bank acount Details with wrong account', (done) => {
			request.get(`${url}user/account/1427000169?token=${staffToken}`, 
				(error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(404);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});

		it('should return user bank acount Details', (done) => {
			request.get(`${url}user/account/1427875169/transactions?token=${staffToken}`, 
				(error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

		it('should return user bank acount Details', (done) => {
			request.get(`${url}user/account/1427000069/transactions?token=${staffToken}`, 
				(error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(404);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});

		it('should return user bank acounts', (done) => {
			request.get(`${url}all/accounts?token=${staffToken}`, 
				(error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});


		it('should return all active bank account with status active', (done) => {
			request.get(`${url}all/accounts?status=active&token=${staffToken}`, 
				(error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});

		it('should return bank account with status dormant', (done) => {
			request.get(`${url}all/accounts?status=dormant?token=${staffToken}`, 
				(error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});

		it('should return user bank acount transaction Details', (done) => {
			request.get(`${url}user/account/1427875169/transaction/2/detail?token=${staffToken}`, 
				(error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});
	});

	describe('POST / method With token For Admin and Staff to be credit and debit a bank account and then send notification for it', () => {

		it('should allow update and credit account balance', () => {
			request.post({
				url: `${url}transactions/1427875169/credit?token=${staffToken}`,
				form: {
					"creditAmount": 220000.989
				}
			},(error, response,body)=> {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.be.equal(201);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
			});
		});

		it('should not  allow update and credit account balance account number is too long', () => {
			request.post({
				url: `${url}transactions/142720275169/credit?token=${staffToken}`,
				form: {
					"creditAmount": 220000.989
				}
			},(error, response,body)=> {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.be.equal(400);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
			});
		});

		it('should not allow update and  debit account balance account doesnot exist', () => {
			request.post({
				url: `${url}transactions/1000000006/credit?token=${staffToken}`,
				form: {
					"creditAmount": 56600.989
				}
			},(error, response,body)=> {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.be.equal(404);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
			});
		});


		it('should allow update and  debit account balance', () => {
			request.post({
				url: `${url}transactions/1427875169/debit?token=${staffToken}`,
				form: {
					"debitAmount": 56600.989
				}
			},(error, response,body)=> {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.be.equal(201);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
			});
		});

		it('should not allow update and  debit account balance if amount is greater than balance', () => {
			request.post({
				url: `${url}transactions/1427875169/debit?token=${staffToken}`,
				form: {
					"debitAmount": 5000006600000.989
				}
			},(error, response,body)=> {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.be.equal(401);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
			});
		});


		it('should not allow update and  debit account balance Account number is longer', () => {
			request.post({
				url: `${url}transactions/142720275169/debit?token=${staffToken}`,
				form: {
					"debitAmount": 56600.989
				}
			},(error, response,body)=> {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.be.equal(400);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
			});
		});

		it('should not allow update and  debit account balance account doesnot exist', () => {
			request.post({
				url: `${url}transactions/1000000069/debit?token=${staffToken}`,
				form: {
					"debitAmount": 56600.989
				}
			},(error, response,body)=> {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.be.equal(404);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
			});
		});

	});
// })

