/*
Change Port and base url as needed before runing tests 
*/
import chai from 'chai';
import request from 'request';
let expect = chai.expect
const PORT = process.env.PORT || 3000;

let url = `http://localhost:${PORT}/api/v1/`

describe('User signup,login, transaction_details, profile_edit', () =>{

	it('should not allow user to sign up and create account on signup', (done) => {
		request.post(`${url}auth/signup`,(error, response, body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse.status).to.be.equal(406);
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('Should not allow use to login and not generate token', (done) => {
		request.post(`${url}auth/signin`, (error, response, body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse.status).to.be.equal(422);
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should not allow user to view their profile', (done) => {
		request.get(`${url}me/profile`, (error, response, body) => {
			expect(response.statusCode).to.equal(401);
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should not allow user to view Bank Account', (done) => {
		request.get(`${url}me/account`, (error, response,body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json')
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should return error instead of creating an account', (done) => {
		request.post(`${url}accounts`, (error, response, body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json')
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should not allow user to change there profile', (done) => {
		request.patch(`${url}me/profile/edit`, (error, response, body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should not allow user to change their password', (done) => {
		request.patch(`${url}me/profile/changepassword`, (error, response, body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});
});

