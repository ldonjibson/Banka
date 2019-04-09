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


describe('POST / With Token signup,login, transaction_details, profile_edit', () =>{

	it('should allow user to sign up and create account on signup', (done) => {
		request.post({
			url : `${url}auth/signup`, 
			form: {
				'email':'newuser@gmail.com', 
				'password':'elohim',
				'firstName':'Hakeem', 
				'lastName':'Ketum',
				'password': 'newpass', 
				'dob':'25-08-1982',
				'phone':'23482384349343',
				'registerDate': new Date().toISOString(),
			}
		}, 
		(error, response, body) =>{
			let json = JSON.parse(response.body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1000);
			expect(json.data.token).to.be.a('string');
			expect(json).to.be.an('object');
			done();
		});
	});

	it('Should allow user to login and generate token', (done) => {
		request.post({
			headers: {'content-type' : 'application/x-www-form-urlencoded'},
			url : `${url}auth/signin`, 
			body: "email=Sincere@april.biz&password=nollywood",
			sendImmediately: false
		}, 
		(error, response, body) =>{
			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1001);
			// expect(json.data.token).to.be.a('string');
			expect(json).to.be.an('object');
			console.log(json);
			done();
		});
	});


	it('should create an account', (done) => {
		request.post(`${url}accounts?token=${token}`, (error, response, body) => {
			let json = JSON.parse(response.body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1000);
			expect(json).to.be.an('object');
			done();
		});
	});
});


describe('GET / With Token and User data, transaction_details', () =>{

	it('should allow user to see there profile details except for the account number', (done) => {
		request.get(`${url}me/profile?token=${token}`, (error, response, body) => {
			let json = JSON.parse(response.body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1000);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should allow user to view Bank Account Detail', (done) => {
		request.get(`${url}me/account?token=${token}`, (error, response,body) => {
			let json = JSON.parse(response.body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1000);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should return all transactions', (done) => {
		request.get(`${url}me/account/transactions?token=${token}`, (error, response,body) => {
			let json = JSON.parse(response.body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1000);
			expect(json).to.be.an('object');
			done();
		});
	});


	it('should return of specific transaction detail', (done) => {
		request.get(`${url}me/account/transaction/1/detail?token=${token}`, (error, response,body) => {
			let json = JSON.parse(response.body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(2010);
			expect(json).to.be.an('object');
			done();
		});
	});
});


describe('PATCH / methods for users ', ()=>{
	it('should allow user to change there profile', (done) => {
		request.patch({
			url : `${url}me/profile/edit?token=${token}`, 
			form: {
				'firstName':'Mark', 
				'lastName':'Junior'
			}
		}, 
		(error, response, body) =>{
			let json = JSON.parse(response.body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1000);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should allow user to change their password', (done) => {
		request.patch({
			url : `${url}me/profile/changepassword?token=${token}`, 
			form: {
				'password':'everly', 
				'password1':'everly'
			}
		}, 
		(error, response, body) =>{
			let json = JSON.parse(response.body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1000);
			expect(json).to.be.an('object');
			done();
		});
	});
});

