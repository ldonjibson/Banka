import chai from 'chai';
import request from 'request';
//import dotenv from 'dotenv'
import * as helper from '../server/helpers/helper'
let expect = chai.expect
//dotenv.config();
const PORT = process.env.PORT || 3000;


let url = `http://localhost:${PORT}/api/v1/`

describe('Admin/ Login before operations are perform here', ()=>{		
let adminToken = helper.genToken('admin@gmail.com', 1)
console.log(adminToken)
	describe('GET Admin / With Token For Admin Alone', ()=> {

		it ('Should contain status code 200 and list staff if they exist', (done) => {
			request.get(`${url}staff?token=${adminToken}`, (error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();	
			});
		}); 

		it('should not get the single staff when id passed as does not exist in db', (done) => {
			request.get(`${url}staff/8?token=${adminToken}`, (error,response,body) =>{
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(404);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});


		it('should get the single staff with the id passed as parameter', (done) => {
			request.get(`${url}staff/2?token=${adminToken}`, (error,response,body) =>{
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});

		it('should not get transactions doneby a particular staff wrong token', (done) => {
			request.get(`${url}staff/2/transactions/?token=adminToken`, 
				(error,response,body) =>{
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(403);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});


		it('should get transactions doneby a particular staff', (done) => {
			request.get(`${url}staff/2/transactions/?token=${adminToken}`, 
				(error,response,body) =>{
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});

		it('should not get transactions doneby a non staff', (done) => {
			request.get(`${url}staff/10/transactions/?token=${adminToken}`, 
				(error,response,body) =>{
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(206);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});

		it('should not get transactions doneby a staff alphabet is used', (done) => {
			request.get(`${url}staff/10/transactions/?token=adminToken`, 
				(error,response,body) =>{
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(403);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});

	});

	describe('PATCH / With Token For Admin Alone', ()=> {

		it('should allow Admin to edit user/staff/admin profile', (done) => {
			request.patch({ 
				url : `${url}singleuser/profile/1/edit?token=${adminToken}`,
				form: {
					'firstName': 'Admin',
					'lastName': 'Someone',
					'phone': '238367373433',
					'dob': '1991-06-06',
					'isAdmin': true
					}
			}, (error, response, body) => {
				expect(response.statusCode).to.equal(206);
				let bodyResponse = JSON.parse(response.body);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

		it('should not allow Admin to edit user/staff/admin profileno value was provided', (done) => {
			request.patch(`${url}singleuser/profile/1/edit?token=${adminToken}`, 
				(error, response, body) => {
				expect(response.statusCode).to.equal(422);
				let bodyResponse = JSON.parse(response.body);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

		it('should not allow Admin to edit user/staff/admin profile Invalid User iD', (done) => {
			request.patch({ 
				url : `${url}singleuser/profile/68/edit?token=${adminToken}`,
				form: {
					'firstName': 'Admin',
					'lastName': 'Someone',
					'phone': '238367373433',
					'dob': '1991-06-06',
					'isAdmin': true
					}
				}, (error, response, body) => {
				expect(response.statusCode).to.equal(404);
				let bodyResponse = JSON.parse(response.body);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

		it('should allow Admin to deactivate an account', (done) => {
			request.patch(`${url}account/1873428980?status=dormant&token=${adminToken}`, 
				(error, response, body) => {
				expect(response.statusCode).to.equal(200);
				let bodyResponse = JSON.parse(response.body);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});


		it('should allow Admin to activate an account', (done) => {
			request.patch(`${url}account/1873428980?status=active&token=${adminToken}`, 
				(error, response, body) => {
				expect(response.statusCode).to.equal(200);
				let bodyResponse = JSON.parse(response.body);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

		it('should not allow Admin to deactivate/activate an account', (done) => {
			request.patch(`${url}account/187342980?status=active&token=${adminToken}`, 
				(error, response, body) => {
				expect(response.statusCode).to.equal(404);
				let bodyResponse = JSON.parse(response.body);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});
		});

	});


	describe('POST / With Token Admin can create staff', () =>{
		it('should allow to create new admin or staff', (done) => {
			request.post({
				url : `${url}/admin/createstaff?token=${adminToken}`, 
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
				request.delete(`${url}accounts/1873428980/?token=${adminToken}`, 
					(error,response, body) => {
					let bodyResponse = JSON.parse(body);
					expect(response.statusCode).to.be.equal(200);
					expect(response.headers['content-type']).to.contain('application/json');
					expect(bodyResponse).to.be.an('object');
					done();
				});
			});

			it('should deleting the bank account', (done) => {
				request.delete(`${url}accounts/187348980/?token=${adminToken}`, 
					(error,response, body) => {
					let bodyResponse = JSON.parse(body);
					expect(response.statusCode).to.be.equal(404);
					expect(response.headers['content-type']).to.contain('application/json');
					expect(bodyResponse).to.be.an('object');
					done();
				});
			});
		});
	})
})
