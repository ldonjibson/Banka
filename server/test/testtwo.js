let expect = require('chai').expect;
let request = require('request');
let url = "http://localhost:3000/api/v1/"
let users = require('../datastore/user')

describe('For Staff Alone', ()=> {
	
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
});



describe('For Staff and Admin',() =>{

	it('should allow user to Staff and Admin to create account for new user');

	it('should allow user to Staff and Admin to delete user account');

	it('should allow user to Admin to create staff account');

	it('should allow user to Staff and Admin to create credit and debit');

	it('should allow user to Staff and Admin to edit and user profile and theirs');

});