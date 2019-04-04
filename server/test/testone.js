let expect = require('chai').expect;
let request = require('request');
let url = "http://localhost:3000/api/v1/"
let users = require('../datastore/user');
let express = require('express');
let server = express();
// server.use('')
// request = request(url)

describe('Checking if the page is accessible', () => {

	it('should just say Connected',(done) =>{
		request.get('/', (error,response,body) => {
			// let json = JSON.parse(body);
			console.log(response)
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json).to.be.an('object');
			expect(json.status).to.equal(200);
			expect(json.message).to.equal("Connected");
			done();
		});
		// if (error) throw error;
	});
});

describe('User signup,login, transaction_details, profile_edit', () =>{

	it('should allow user to sign up and create account on signup', (done) => {
		request.post(url + "auth/signup", (error, response, body) => {
			// console.log(response);
			expect(response.statusCode).to.equal(200);
			let json = JSON.parse(response.body);
			// console.log(json);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(401);
			expect(json.error).to.be.equal("Please Check, A field is missing");
			done();
		});
	});

	it('Should not allow use to login and not generate token', (done) => {
		request.post(url + "auth/signin", (error, response, body) => {
			let json = JSON.parse(response.body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(401);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should allow user to change there profile details except for the account number', (done) => {
		request.get(url + "me/profile", (error, response, body) => {
			expect(response.statusCode).to.equal(200);
			let json = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1004);
			expect(json).to.be.an('object');
			// console.log(response)
			done();
		});
	});

	it('should allow user to view Bank Account Detail', (done) => {
		request.get(url + "me/account", (error, response,body) => {
			expect(response.statusCode).to.equal(200);
			let json = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json')
			expect(json.status).to.be.equal(1004);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should  return 1004 since notoken was passed', (done) => {
		request.get(url + "me/account/transactions/", (error, response,body) => {
			expect(response.statusCode).to.equal(200);
			let json = JSON.parse(response.body);
			// console.log(json);
			expect(response.headers['content-type']).to.contain('application/json')
			expect(json.status).to.be.equal(1004);
			expect(json).to.be.an('object');
			done();
		});
	});


	it('should return "1004" instead of specific transaction detail', (done) => {
		request.get(url + "me/account/transaction/1/detail", (error, response,body) => {
			expect(response.statusCode).to.equal(200);
			let json = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json')
			expect(json.status).to.be.equal(1004);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should return "1004" instead of creating an account', (done) => {
		request.post(url + "accounts", (error, response, body) => {
			expect(response.statusCode).to.equal(200);
			let json = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json')
			expect(json.status).to.be.equal(1004);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should allow user to change there profile', (done) => {
		request.patch(url + "me/profile/edit", (error, response, body) => {
			expect(response.statusCode).to.equal(200);
			let json = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1004);
			expect(json).to.be.an('object');
			// console.log(response)
			done();
		});
	});

	it('should allow user to change their password', (done) => {
		request.patch(url + "me/profile/changepassword", (error, response, body) => {
			expect(response.statusCode).to.equal(200);
			let json = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1004);
			expect(json).to.be.an('object');
			// console.log(response)
			done();
		});
	});
});

