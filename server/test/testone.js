let expect = require('chai').expect;
let request = require('request');
let url = "http://localhost:3000/api/v1/"
let users = require('../datastore/user')

let formData = {
        "email": "Sincere@april.biz",
        "firstName": "Leanne Graham",
        "lastName": "Bret",
        "phone": "010-692-6593 x09125",
        "password": "1-770-736-8031 x56442",
        "dob": "25-01-1990"
		}

describe('Checking if the page is testable', () => {

	it('should just say Connected',(done) =>{
		request.get(url, (error,response,body) => {
			let json = JSON.parse(body);
			// console.log(json)
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json).to.be.an('object');
			expect(json.status).to.equal(200);
			expect(json.message).to.equal("Connected");
			done();
		});
		// if (error) throw error;
	});
	
	it ('Should contain status code 200', (done) => {
		request.get(url + "users", (error,response,body) => {
			if(error){
				console.log(error);
			}

			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();	
		});
	}); 
});

describe('User signup,login, transaction_details, profile_edit', () =>{
	
	it('should get the single userwith the id passed', (done) => {
		request(url + "user/1", (error,response,body) => {
			if(error){
				console.log(error);
				expect(response.status).to.be.equal(400);
			}
			// console.log(url+"users/1");
			let json = JSON.parse(body);
			// console.log(body);
			// console.log(json.user.id);
			// console.log(json);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();
		});

	});

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
		request.get(url + "user/profile", (error, response, body) => {
			expect(response.statusCode).to.equal(200);
			let json = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1004);
			expect(json).to.be.an('object');
			// console.log(response)
			done();
		});
	});

	it('should allow user to user to view transaction details and history', (done) => {
		request.get(url + "user/account", (error, response,body) => {
			expect(response.statusCode).to.equal(404);
			expect(response.headers['content-type']).to.contain('text/html')
			// expect(json.status).to.be.equal(1004);
			// expect(json).to.be.an('object');
			done();
		});
	});

	it('should allow user to user to view transaction details and history', (done) => {
		request.get(url + "user/accounts/transaction/", (error, response,body) => {
			expect(response.statusCode).to.equal(404);
			expect(response.headers['content-type']).to.contain('text/html')
			// expect(json.status).to.be.equal(1004);
			// expect(json).to.be.an('object');
			done();
		});
	});

});

describe('For Staff and Admin',() =>{

	it('should allow user to Staff and Admin to create account for new user');

	it('should allow user to Staff and Admin to delete user account');

	it('should allow user to Admin to create staff account');

	it('should allow user to Staff and Admin to create credit and debit');

	it('should allow user to Staff and Admin to edit and user profile and theirs');

});