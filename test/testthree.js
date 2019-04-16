let expect = require('chai').expect;
let request = require('request');
let users = require('../server/datastore/user')


const PORT = process.env.PORT || 3000;


let url = `http://localhost:${PORT}/api/v1/`

describe('GET / For Admin Alone', ()=> {

	it ('Should contain status code 200 and return 1004', (done) => {
		request.get(`${url}staff`, (error,response,body) => {
			let bodyResponse = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();	
		});
	}); 

	it('should not get the single staff with the id passed', (done) => {
		request.get(`${url}staff/2`, (error,response,body) =>{
			let bodyResponse = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});

	});

});

describe('PATCH / For Admin Alone', ()=> {

	it('should not allow Admin to edit user profile (No token)', (done) => {
		request.patch(`${url}allusers/profile/1/edit`, (error, response, body) => {
			expect(response.statusCode).to.equal(200);
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should not allow Admin to change user password (No token)', (done) => {
		request.patch(`${url}allusers/profile/1/changepassword`, (error, response, body) => {
			expect(response.statusCode).to.equal(200);
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

});