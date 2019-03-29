let expect = require('chai').expect;
let request = require('request');
let url = "http://localhost:3000/api/v1/"

describe('Checking if the page is testable', function(){
	
	it ('Should contain status code 200', function(done){
		request(url, function(error,response,body) {
			// console.log(response);
			// expect(response).to.contain('200');
			expect(response.statusCode).to.equal(200);
			expect(body).to.contain('data');
			done();	
			});
	}); 
});

describe('User signup,login, transaction_details, profile_edit', function(){
	
	it('should outputjson also', function(done){
		request(url + "1", function(error,response,body){
			console.log(url+"1");
			expect(response.statusCode).to.equal(404);
			done();
		});

	});

	it('should allow user to sign up and create account on signup');

	it('should allow user to login');

	it('should allow user to change there profile details exceptfor the account number');

	it('should allow user to user to view transaction details and history');
});

describe('For Staff and Admin',function(){

	it('should allow user to Staff and Admin to create account for new user');

	it('should allow user to Staff and Admin to delete user account');

	it('should allow user to Admin to create staff account');

	it('should allow user to Staff and Admin to create credit and debit');

	it('should allow user to Staff and Admin to edit and user profile and theirs');

});