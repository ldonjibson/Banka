let expect = require('chai').expect;
let request = require('request');
let users = require('../server/datastore/user')

const PORT = process.env.PORT || 4000;


let url = `http://localhost:${PORT}/api/v1/`

describe('For Staff  and Admin Alone', ()=> {

	it ('Should contain status code 200', (done) => {
		request.get(`${url}users`, (error,response,body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();	
		});
	}); 

	it('should not get the single user with the id passed', (done) => {
		request.get(`${url}user/1`, (error,response,body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();
		});

	});

	it('should not get all client transaction but return 1004 status code because no token provided', (done) => {
		request.get(`${url}allclients/transactions`,(error,response,body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should not get individual transaction recorde becuase staff token is not provided',(done) => {
		request.get(`${url}/clienttransaction/1/detail/`, (error, response,body) => {
			let json =JSON.parse(body);
			expect(response.statusCode).to.be.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should return 1004 instead of all record performed by a specific', (done) => {
		request.get(`${url}mydone/usertransaction/`, (error,response, body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.be.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should return 1004 instead of deleting the account', (done) => {
		request.delete(`${url}accounts/1920000034/`, (error,response, body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.be.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();
		});
	});

});


describe('Patch method For Admin and Staff to be able to edit user profile and change accout status',() =>{

	it('should should return 1004 instead of changing account status', (done) => {
		request.patch(`${url}account/1920000034`,  (error, response,body)=> {
			let json = JSON.parse(body);
			expect(response.statusCode).to.be.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should not  allow Staff to edit user profile', (done) => {
		request.patch(`${url}user/profile/1/edit`, (error, response, body) => {
			expect(response.statusCode).to.equal(200);
			let json = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1004);
			expect(json).to.be.an('object');
			// console.log(response)
			done();
		});
	});

	it('should not allow Staff  to change user password', (done) => {
		request.patch(`${url}user/profile/1/changepassword`, (error, response, body) => {
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


describe('Post method For Admin and Staff to be credit and debit a bank account and then send notification for it', () => {

	it('should return 1004 instead of updating the crediting account balance', (done) => {
		request.post(`${url}transactions/1920000034/credit`,  (error, response,body)=> {
			let json = JSON.parse(body);
			expect(response.statusCode).to.be.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();
		});
	});


	it('should  return 1004 instead of updating the debiting account balance', (done) => {
		request.post(`${url}transactions/1920000034/debit`,  (error, response,body)=> {
			let json = JSON.parse(body);
			expect(response.statusCode).to.be.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();
		});
	});


});