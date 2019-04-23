/*
Change Port and base url as needed before runing tests 
*/

let expect = require('chai').expect;
let request = require('request');
let users = require('../server/datastore/user')
let express = require('express');

const PORT = process.env.PORT || 3000;

let url = `http://localhost:${PORT}/api/v1/`
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlNpbmNlcmVAYXByaWwuYml6IiwiaWQiOjEsImlzQWRtaW4iOnRydWUsImlhdCI6MTU1NDQ0NTMzNCwiZXhwIjoxNTU5NjI5MzM0fQ.bT5An0F30yXAKCADWsGkYROlBZPmpS43w_JCb7ktp-I'

describe('GET / With Token and User data, transaction_details', () =>{

	it('should allow user to see there profile details except for the account number', (done) => {
		request.get(`${url}me/profile?token=${token}`, (error, response, body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should allow user to view All Bank Accounts', (done) => {
		request.get(`${url}me/account?token=${token}`, (error, response,body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should return all transactions', (done) => {
		request.get(`${url}me/account/1427875169/transactions?token=${token}`, (error, response,body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});


	it('should return of specific transaction detail', (done) => {
		request.get(`${url}me/account/1427875169/transaction/2/detail?token=${token}`, (error, response,body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});
});


describe('PATCH / methods for users ', ()=>{
	// it('should allow user to change there profile', (done) => {
	// 	request.patch({
	// 		url : `${url}me/profile/edit?token=${token}`, 
	// 		form: {
	// 			'firstName':'Mark', 
	// 			'lastName':'Junior'
	// 			'phone': '090863885335'
	// 			'dob': '1991-03-23'
	// 		}
	// 	}, 
	// 	(error, response, body) =>{
	// 		let bodyResponse = JSON.parse(response.body);
	// 		expect(response.statusCode).to.equal(206);
	// 		expect(response.headers['content-type']).to.contain('application/json');
	// 		expect(bodyResponse).to.be.an('object');
	// 		done();
	// 	});
	// });

	it('should allow user to change their password', (done) => {
		request.patch({
			url : `${url}me/profile/changepassword?token=${token}`, 
			form: {
				'password':'nollywood', 
				'password1':'nollywood'
			}
		}, 
		(error, response, body) =>{
			let bodyResponse = JSON.parse(response.body);
			expect(response.statusCode).to.equal(206);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});
});


describe('POST / With Token signup, login, profile_edit', () =>{

	it('should allow user to sign up and create account on signup', (done) => {
		request.post({
			url : `${url}auth/signup`, 
			form: {
				'email':'newuser@gmail.com', 
				'password':'elohim',
				'password': 'newpass', 
				}
		}, 
		(error, response, body) =>{
			let bodyResponse = JSON.parse(response.body);
			expect(response.statusCode).to.equal(406);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse.status).to.be.equal(406);
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should allow user to reset password', () => {
		request.post({
			url : `${url}/resetpassword`, 
			form: {
				'email':'shetma@yesenia.net', 
			}
		}, 
		(error, response, body) =>{
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
		});
	});

	it('Should allow user to login and generate token', () => {
		request.post({
			headers: {'content-type' : 'application/x-www-form-urlencoded'},
			url : `${url}auth/signin`, 
			form: {
					"email": "Sincere@april.biz",
					"password":"nollywood"
				},
			sendImmediately: false
		}, 
		(error, response, body) =>{
			let bodyResponse = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse.status).to.be.equal(200);
			expect(bodyResponse).to.be.an('object');
		});
	});


	it('should create a bank account', (done) => {
		request.post({
			headers: {'content-type' : 'application/x-www-form-urlencoded'},
			url : `${url}accounts?token=${token}`, 
			form: {
				'accountName':'Metasin Limited', 
				'phone':'080234567823',
				'type': 'current', 
				}
		}, 
		(error, response, body) =>{
			let bodyResponse = JSON.parse(response.body);
			expect(response.statusCode).to.equal(403);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse.status).to.be.equal(403);
			expect(bodyResponse).to.be.an('object');
		});
		done();
	});
});


