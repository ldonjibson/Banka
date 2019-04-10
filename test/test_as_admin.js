let expect = require('chai').expect;
let request = require('request');
let users = require('../server/datastore/user')
const PORT = process.env.PORT || 3000;


let url = `http://localhost:${PORT}/api/v1/`
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlNpbmNlcmVAYXByaWwuYml6IiwiaWQiOjEsImlzQWRtaW4iOnRydWUsImlhdCI6MTU1NDQ0NTMzNCwiZXhwIjoxNTU5NjI5MzM0fQ.bT5An0F30yXAKCADWsGkYROlBZPmpS43w_JCb7ktp-I'

describe('GET / With Token For Admin Alone', ()=> {

	it ('Should contain status code 200 and return 1004', (done) => {
		request.get(`${url}staff?token=${token}`, (error,response,body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1000);
			expect(json).to.be.an('object');
			done();	
		});
	}); 

	it('should get the single staff with the id passed', (done) => {
		request.get(`${url}staff/2?token=${token}`, (error,response,body) =>{
			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1000);
			expect(json).to.be.an('object');
			done();
		});

	});

});

describe('PATCH / With Token For Admin Alone', ()=> {

	it('should allow Admin to edit user profile', (done) => {
		request.patch(`${url}allusers/profile/1/edit?token=${token}`, (error, response, body) => {
			expect(response.statusCode).to.equal(200);
			let json = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1000);
			expect(json).to.be.an('object');
			// console.log(response)
			done();
		});
	});

	it('should allow Admin to change user password ', (done) => {
		request.patch({
			url: `${url}allusers/profile/1/changepassword?token=${token}`,
			form: {
				'password': 'testpass',
				'password1': 'testpass'
			}}, (error, response, body) => {
			expect(response.statusCode).to.equal(200);
			let json = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1000);
			expect(json).to.be.an('object');
			done();
		});
	});

});