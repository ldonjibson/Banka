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

describe('Login before operations are perform here', ()=>{
	const validateAdmin = {
		email: 'admin@gmail.com',
		password: 'nollywood'
	};
	let clientToken;
	before((done)=>{
		request.post({
			url: `${url}auth/signin`,
			form: validateAdmin
		}, (error, response,body)=> {
			let bodyResponse = JSON.parse(body)
			clientToken = bodyResponse.data['token']
			console.log(clientToken);
			done();
		});
	});

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
			request.get(`${url}me/account?token=${clientToken}`, (error, response,body) => {
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

		it('should return all transactions', (done) => {
			request.get(`${url}me/account/1427875169/transactions?token=${clientToken}`, (error, response,body) => {
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});


		it('should return of specific transaction detail', (done) => {
			request.get(`${url}me/account/1427875169/transaction/2/detail?token=${clientToken}`, (error, response,body) => {
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(200);
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
					'phone': '090863885335',
					'dob': '1991-03-23'
				}
			},(error, response, body) =>{
				let bodyResponse = JSON.parse(response.body);
				expect(response.statusCode).to.equal(422);
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

		// it('Should allow user to login and generate token', () => {
		// 	request.post({
		// 		headers: {'content-type' : 'application/x-www-form-urlencoded'},
		// 		url : `${url}auth/signin`, 
		// 		form: {
		// 				"email": "Sincere@april.biz",
		// 				"password":"nollywood"
		// 			},
		// 		sendImmediately: false
		// 	}, 
		// 	(error, response, body) =>{
		// 		let bodyResponse = JSON.parse(body);
		// 		expect(response.statusCode).to.equal(404);
		// 		expect(response.headers['content-type']).to.contain('application/json');
		// 		expect(bodyResponse.status).to.be.equal(404);
		// 		expect(bodyResponse).to.be.an('object');
		// 	});
		// });


		it('should create a bank account', (done) => {
			request.post({
				headers: {'content-type' : 'application/x-www-form-urlencoded'},
				url : `${url}accounts?token=${clientToken}`, 
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
});


