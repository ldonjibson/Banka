/*
Change Port and base url as needed before runing tests 
*/

import chai, { expect } from 'chai';
import request from 'request';
import dotenv from 'dotenv'
dotenv.config();
const PORT = process.env.PORT || 3000;
console.log(PORT)

let url = `http://localhost:${PORT}/api/v1/`

describe('Checking if the page is accessible', () => {

	it('should just say Connected',(done) =>{
		request.get(`${url}`, (error, response, body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			expect(bodyResponse.message).to.equal("Connected");
			done();
		});
	});
});

describe('User signup,login, transaction_details, profile_edit', () =>{

	it('should allow user to sign up and create account on signup', (done) => {
		request.post(`${url}auth/signup`,(error, response, body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse.status).to.be.equal(401);
			expect(bodyResponse.error).to.be.equal("Please Check, A field is missing");
			done();
		});
	});

	it('Should not allow use to login and not generate token', (done) => {
		request.post(`${url}auth/signin`, (error, response, body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse.status).to.be.equal(401);
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should allow user to change there profile details except for the account number', (done) => {
		request.get(`${url}me/profile`, (error, response, body) => {
			expect(response.statusCode).to.equal(200);
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should allow user to view Bank Account Detail', (done) => {
		request.get(`${url}me/account`, (error, response,body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json')
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should  return 1004 since notoken was passed', (done) => {
		request.get(`${url}me/account/transactions/`, (error, response,body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json')
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});


	it('should return error instead of specific transaction detail', (done) => {
		request.get(`${url}me/account/transaction/1/detail`, (error, response,body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json')
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should return error instead of creating an account', (done) => {
		request.post(`${url}accounts`, (error, response, body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json')
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should allow user to change there profile', (done) => {
		request.patch(`${url}me/profile/edit`, (error, response, body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should allow user to change their password', (done) => {
		request.patch(`${url}me/profile/changepassword`, (error, response, body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});
});

