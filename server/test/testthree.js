let expect = require('chai').expect;
let request = require('request');
let url = "http://localhost:3000/api/v1/"
let users = require('../datastore/user')

describe('For Admin Alone', ()=> {

	it ('Should contain status code 200 and return 1004', (done) => {
		request.get(url + "staff", (error,response,body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();	
		});
	}); 

	it('should not get the single staff with the id passed', (done) => {
		request.get(url + "staff/2", (error,response,body) =>{
			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1004);
			expect(json).to.be.an('object');
			done();
		});

	});
});