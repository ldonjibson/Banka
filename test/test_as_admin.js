import chai, { expect } from 'chai';
import request from 'request';
import dotenv from 'dotenv'
dotenv.config();
const PORT = process.env.PORT || 3000;
console.log(PORT)


let url = `http://localhost:${PORT}/api/v1/`
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlNpbmNlcmVAYXByaWwuYml6IiwiaWQiOjEsImlzQWRtaW4iOnRydWUsImlhdCI6MTU1NDQ0NTMzNCwiZXhwIjoxNTU5NjI5MzM0fQ.bT5An0F30yXAKCADWsGkYROlBZPmpS43w_JCb7ktp-I'

describe('GET / With Token For Admin Alone', ()=> {

	it ('Should contain status code 200 and return error', (done) => {
		request.get(`${url}staff?token=${token}`, (error,response,body) => {
			let bodyResponse = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();	
		});
	}); 

	it('should get the single staff with the id passed', (done) => {
		request.get(`${url}staff/2?token=${token}`, (error,response,body) =>{
			let bodyResponse = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});

	});

	it('should get transactions doneby a particular staff', (done) => {
		request.get(`${url}staff/2/transactions?token=${token}`, (error,response,body) =>{
			let bodyResponse = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});

	});

});

describe('PATCH / With Token For Admin Alone', ()=> {

	it('should allow Admin to edit user profile', (done) => {
		request.patch(`${url}singleuser/profile/1/edit?token=${token}`, (error, response, body) => {
			expect(response.statusCode).to.equal(206);
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

	it('should allow Admin to deactivate an account', (done) => {
		request.patch(`${url}account/1924693676?token=${token}`, (error, response, body) => {
			expect(response.statusCode).to.equal(200);
			let bodyResponse = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});

});


describe('POST / With Token Admin can create staff', () =>{

	it('should allow tocreate new admin or staff', (done) => {
		request.post({
			url : `${url}/admin/createstaff?token=${token}`, 
			form: {
				'email':'newuser@gmail.com', 
				'password':'elohim',
				'password': 'newpass',
				'firstName': 'staff',
				'lastName': 'staff',
				'phone': '238367373433',
				'type': 'staff',
				'isAdmin': false
				}
		}, 
		(error, response, body) =>{
			console.log(body)
			let bodyResponse = JSON.parse(response.body);
			expect(response.statusCode).to.equal(422);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(bodyResponse.status).to.be.equal(422);
			expect(bodyResponse).to.be.an('object');
			done();
		});
	});
});

describe('DELETE / Delete selected user Account ', () => {
	after('run after all code', () => {
		it('should deleting the bank account', (done) => {
			request.delete(`${url}accounts/1924693676/?token=${token}`, (error,response, body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.be.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

	});

});
