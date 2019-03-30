let expect = require('chai').expect;
let request = require('request');
let url = "http://localhost:3000/api/v1/"

describe('Checking if the page is testable', () => {

	it('should just say ok',(done) =>{
		request.get(url, (error,response,body) => {
			let json = JSON.parse(body);
			console.log(json)
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
		request(url + "users", (error,response,body) => {
			if(error){
				console.log(error);
			}

			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(200);
			expect(json).to.be.an('object');
			done();	
		});
	}); 
});

describe('User signup,login, transaction_details, profile_edit', () =>{
	
	it('should get the single userwith the id paased', (done) => {
		request(url + "user/1", (error,response,body) => {
			if(error){
				console.log(error);
			}
			// console.log(url+"users/1");
			let json = JSON.parse(body);
			console.log(json.user.id);
			// console.log(json);
			expect(response.statusCode).to.equal(200);
			expect(json).to.be.an('object');
			done();
		});

	});

	it('should allow user to sign up and create account on signup');

	it('should allow user to login');

	it('should allow user to change there profile details exceptfor the account number');

	it('should allow user to user to view transaction details and history');
});

describe('For Staff and Admin',() =>{

	it('should allow user to Staff and Admin to create account for new user');

	it('should allow user to Staff and Admin to delete user account');

	it('should allow user to Admin to create staff account');

	it('should allow user to Staff and Admin to create credit and debit');

	it('should allow user to Staff and Admin to edit and user profile and theirs');

});