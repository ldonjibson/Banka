import chai from 'chai';
import request from 'request';
//import dotenv from 'dotenv'
let expect = chai.expect
//dotenv.config();
const PORT = process.env.PORT || 3000;

let url = `http://localhost:${PORT}/api/v1/`

describe('GET / For Admin Alone', ()=> {

	it ('Should contain status code 400', (done) => {
		request.get(`${url}staff`, (error,response,body) => {
			let bodyResponse = JSON.parse(body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();	
		});
	}); 

	it('should not get the single staff with the id passed', (done) => {
		request.get(`${url}staff/2`, (error,response,body) =>{
			let bodyResponse = JSON.parse(body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});

	});

});

describe('PATCH / For Admin Alone', ()=> {

	it('should not allow Admin to edit user profile (No token)', (done) => {
		request.patch(`${url}singleuser/profile/1/edit`, (error, response, body) => {
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});
});