/*
Change Port and base url as needed before runing tests 
*/

import chai from 'chai';
import request from 'request';
import dotenv from 'dotenv'
import * as helper from '../server/helpers/helper'

let expect = chai.expect
dotenv.config();
const PORT = process.env.PORT || 3000;
let clientToken = helper.genToken('tmarvin@gmail.com', 4)

let url = `http://localhost:${PORT}/api/v1/`

	describe('GET / With Token and User data, transaction_details', () =>{

		it('should allow user to see there profile details except for the account number', (done) => {
			request.get(`${url}me/profile?token=${clientToken}`, (error, response, body) => {
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

		it('should allow user to view All Bank Accounts', (done) => {
			request.get(`${url}me/account?token=${clientToken}`, 
				(error, response,body) => {
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});


		it('should return all transactions', (done) => {
			request.get(`${url}me/account/1473428980/transactions?token=${clientToken}`, 
				(error, response,body) => {
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

	it('should return all transactions', (done) => {
			request.get(`${url}me/account/1400000009/transactions?token=${clientToken}`, 
				(error, response,body) => {
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(404);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

		it('should return of specific transaction detail', (done) => {
			request.get(`${url}me/account/1473428980/transaction/2/detail?token=${clientToken}`, 
				(error, response,body) => {
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

		it('should return of specific transaction detail', (done) => {
			request.get(`${url}me/account/1400000009/transaction/2/detail?token=${clientToken}`, 
				(error, response,body) => {
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(404);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

	});


	describe('PATCH / methods for users ', ()=>{
		it('should allow user to change there profile', (done) => {
			request.patch({
				url : `${url}me/profile/edit?token=${clientToken}`, 
				form: {
					'firstName': 'Toks',
					'lastName': 'Marvins',
					'phone': '090863885335',
					'dob': '1991-03-23'
				}
			},(error, response, body) =>{
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(206);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

		it('should allow user to change their password', (done) => {
			request.patch({
				url : `${url}me/profile/changepassword?token=${clientToken}`, 
				form: {
					'password':'nollywood', 
					'password1':'nollywood'
				}
			},(error, response, body) =>{
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(206);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

		it('should not allow user to change their password if one of them is omitted', (done) => {
			request.patch({
				url : `${url}me/profile/changepassword?token=${clientToken}`, 
				form: {
					'password':'', 
					'password1':'nollywood'
				}
			},(error, response, body) =>{
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(422);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

		it('should not allow user to change their password if one of them is omitted', (done) => {
			request.patch({
				url : `${url}me/profile/changepassword?token=${clientToken}`, 
				form: {
					'password':'', 
					'password1':''
				}
			},(error, response, body) =>{
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(422);
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
					'password1': 'newpass', 
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


		it('should not allow user to sign up and create account on signup', (done) => {
			request.post({
				url : `${url}auth/signup`, 
				form: {
					'email':'newuser@gmail.com', 
					'password':'elohim',
					'password1': 'newpass', 
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

		it('should not allow user to sign up if password is less than 5', (done) => {
			request.post({
				url : `${url}auth/signup`, 
				form: {
					'email':'newuser@gmail.com', 
					'password':'elo',
					'password1': 'elo', 
					}
			}, 
			(error, response, body) =>{
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(422);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse.status).to.be.equal(422);
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});


		it('should not allow user to sign up if invalid email was inputted', (done) => {
			request.post({
				url : `${url}auth/signup`, 
				form: {
					'email':'newusermail.com', 
					'password':'elohim',
					'password1': 'elohim', 
					}
			}, 
			(error, response, body) =>{
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(422);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse.status).to.be.equal(422);
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

		it('should not allow user to sign up if invalid email was inputted', (done) => {
			request.post({
				url : `${url}auth/signup`, 
				form: {
					'email':'admin@gmail.com', 
					'password':'elohim',
					'password1': 'elohim', 
					}
			}, 
			(error, response, body) =>{
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(401);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse.status).to.be.equal(401);
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});


		it('should allow user to reset password', () => {
			request.post({
				url : `${url}/resetpassword`, 
				form: {
					'email':'ckagoxozic@gmail.com', 
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
						"email": "m.tatcher@gmail.com",
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

		it('Should allow user to login and generate token', () => {
			request.post({
				headers: {'content-type' : 'application/x-www-form-urlencoded'},
				url : `${url}auth/signin`, 
				form: {
						"email": "m.tatcher@gmail.com",
						"password":"nood"
					},
				sendImmediately: false
			}, 
			(error, response, body) =>{
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(422);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse.status).to.be.equal(422);
				expect(bodyResponse).to.be.an('object');
			});
		});

		it('Should allow user to login and generate token', () => {
			request.post({
				headers: {'content-type' : 'application/x-www-form-urlencoded'},
				url : `${url}auth/signin`, 
				form: {
						"email": "m.tatchergmail.com",
						"password":"nollwood"
					},
				sendImmediately: false
			}, 
			(error, response, body) =>{
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(422);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse.status).to.be.equal(422);
				expect(bodyResponse).to.be.an('object');
			});
		});


		it('Should allow user to login and generate token', () => {
			request.post({
				headers: {'content-type' : 'application/x-www-form-urlencoded'},
				url : `${url}auth/signin`, 
				form: {
						"email": "m.tatchergmail.com",
						"password":"nollywood9387835"
					},
				sendImmediately: false
			}, 
			(error, response, body) =>{
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(422);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse.status).to.be.equal(422);
				expect(bodyResponse).to.be.an('object');
			});
		});


		it('should create a bank account', (done) => {
			request.post({
				headers: {'content-type' : 'application/x-www-form-urlencoded'},
				url : `${url}accounts?token=${clientToken}`, 
				form: {
					'accountName':`Metasin Liotmited ${helper.uniqueAccNumber()}`, 
					'phone':'080234567823',
					'type': 'savings', 
					}
			}, 
			(error, response, body) =>{
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.be.equal(201);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse.status).to.be.equal(201);
				expect(bodyResponse).to.be.an('object');
			});
			done();
		});
	});
// });


