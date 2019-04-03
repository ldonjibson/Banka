let expect = require('chai').expect;
let request = require('request');
let url = "http://localhost:3000/api/v1/"
let users = require('../datastore/user')

describe('For Staff  and Admin Alone', ()=> {

	it ('Should contain status code 200', (done) => {
		request.get(url + "users", (error,response,body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();	
		});
	}); 

	it('should not get the single user with the id passed', (done) => {
		request.get(url + "user/1", (error,response,body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();
		});

	});

	it('should not get all client transaction but return 1004 status code because no token provided', (done) => {
		request.get(url + "allclients/transactions",(error,response,body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should not get individual transaction recorde becuase staff token is not provided',(done) => {
		request.get(url + "/clienttransaction/1/detail/", (error, response,body) => {
			let json =JSON.parse(body);
			expect(response.statusCode).to.be.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should return 1004 instead of all record performed by a specific', (done) => {
		request.get(url + "mydone/usertransaction/", (error,response, body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.be.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should return 1004 instead of deleting the account', (done) => {
		request.delete(url + "accounts/1920000034/", (error,response, body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.be.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();
		});
	});

});



describe('For Admin Alone',() =>{

	it('should allow user to Staff and Admin to create credit and debit');

	it('should allow user to Staff and Admin to edit and user profile and theirs');
	
	// it('should allow user to Staff and Admin to edit and user profile and theirs');

});