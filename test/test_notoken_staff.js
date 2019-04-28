import chai from 'chai';
import request from 'request';
import dotenv from 'dotenv'
let expect = chai.expect
dotenv.config();
const PORT = process.env.PORT || 3000;

let url = `http://localhost:${PORT}/api/v1/`

describe('For Staff  and Admin Alone', ()=> {

	it ('Should contain status code 400', (done) => {
		request.get(`${url}users`, (error,response,body) => {
			let bodyResponse = JSON.parse(body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse.status).to.be.equal(400);
			expect(bodyResponse).to.be.an('object');
			done();	
		});
	}); 

	it('should not get the single user with the id passed', (done) => {
		request.get(`${url}user/1`, (error,response,body) => {
			let bodyResponse = JSON.parse(body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse.status).to.be.equal(400);
			expect(bodyResponse).to.be.an('object');
			done();
		});

	});

	it('should return error instead of deleting the account', (done) => {
		request.delete(`${url}accounts/1920000034/`, (error,response, body) => {
			let bodyResponse = JSON.parse(body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse.status).to.be.equal(400);
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

});


describe(`Patch method For Admin and Staff to be able to 
	edit user profile and change accout status`,() =>{

	it('should should return 401 instead of changing account status', (done) => {
		request.patch(`${url}account/1920000034`,  (error, response,body)=> {
			let bodyResponse = JSON.parse(body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse.status).to.be.equal(400);
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

});


describe(`Post method For Admin and Staff to be credit and debit a 
	bank account and then send notification for it`, () => {

	it('should not update the crediting account balance', (done) => {
		request.post(`${url}transactions/1920000034/credit`,  (error, response,body)=> {
			let bodyResponse = JSON.parse(body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse.status).to.be.equal(400);
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});


	it('should  not update the debiting account balance', (done) => {
		request.post(`${url}transactions/1920000034/debit`,  (error, response,body)=> {
			let bodyResponse = JSON.parse(body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse.status).to.be.equal(400);
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});


});