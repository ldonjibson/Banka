let expect = require('chai').expect;
let request = require('request');
let users = require('../server/datastore/user')

const PORT = process.env.PORT || 3000;


let url = `http://localhost:${PORT}/api/v1/`
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlNpbmNlQGFwcmlsLmJpeiIsImlkIjoyLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTU0NDcwOTE3LCJleHAiOjE1NTk2NTQ5MTd9.-j_h2OUe1PH4Ptb1siOORyxle9rzeD85Zh2mbJA5S0I'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlNpbmNlcmVAYXByaWwuYml6IiwiaWQiOjEsImlzQWRtaW4iOnRydWUsImlhdCI6MTU1NDQ0NTMzNCwiZXhwIjoxNTU5NjI5MzM0fQ.bT5An0F30yXAKCADWsGkYROlBZPmpS43w_JCb7ktp-I'



describe('GET / For Staff  and Admin Alone', ()=> {

	it ('Should return all users except for admin and staffs ', (done) => {
		request.get(`${url}users?token=${token}`, (error,response,body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1000);
			expect(json).to.be.an('object');
			done();	
		});
	}); 

	it('should return user id detail', (done) => {
		request.get(`${url}user/3?token=${token}`, (error,response,body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1000);
			expect(json).to.be.an('object');
			done();
		});

	});

	it('should get all client transaction', (done) => {
		request.get(`${url}allclients/transactions?token=${token}`,(error,response,body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1000);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should get individual transaction record becuase staff ',(done) => {
		request.get(`${url}/clienttransaction/1/detail/?token=${token}`, (error, response,body) => {
			let json =JSON.parse(body);
			expect(response.statusCode).to.be.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1000);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should all record performed by a specific staff', (done) => {
		request.get(`${url}mydone/usertransaction/?token=${token}`, (error,response, body) => {
			let json = JSON.parse(body);
			expect(response.statusCode).to.be.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1000);
			expect(json).to.be.an('object');
			done();
		});
	});
});


describe('PATCH / method With Token For Admin and Staff to be able to edit user profile and change accout status',() =>{

	it('should change account status', (done) => {
		request.patch(`${url}account/1920000034?token=${token}`,  (error, response,body)=> {
			let json = JSON.parse(body);
			expect(response.statusCode).to.be.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1000);
			expect(json).to.be.an('object');
			done();
		});
	});

	it('should allow Staff to edit user profile', (done) => {
		request.patch(`${url}user/profile/3/edit?token=${token}`, (error, response, body) => {
			expect(response.statusCode).to.equal(200);
			let json = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1000);
			expect(json).to.be.an('object');
			// console.log(response)
			done();
		});
	});

	it('should allow Staff to change user password', (done) => {
		request.patch({
			url: `${url}user/profile/3/changepassword?token=${token}`,
			form: {
				'password': 'testpass',
				'password1': 'testpass'
			}
		}, (error, response, body) => {
			expect(response.statusCode).to.equal(200);
			let json = JSON.parse(response.body);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.be.equal(1000);
			expect(json).to.be.an('object');
			// console.log(response)
			done();
		});
	});

});


describe('POST / method With token For Admin and Staff to be credit and debit a bank account and then send notification for it', () => {

	it('should allow update and credit account balance', () => {
		request.post({
			url: `${url}createbank/accounts/?token=${token}`,
			form:{
				"email": "Since@april.biz"
			}
		},  (error, response,body)=> {
			let json = JSON.parse(body);
			expect(response.statusCode).to.be.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1000);
			expect(json).to.be.an('object');
		});
	});


	it('should allow update and credit account balance', () => {
		request.post(`${url}transactions/1920000034/credit?token=${token}`,  (error, response,body)=> {
			let json = JSON.parse(body);
			expect(response.statusCode).to.be.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1000);
			expect(json).to.be.an('object');
		});
	});


	it('should allow update and  debit account balance', () => {
		request.post(`${url}transactions/1920000034/debit?token=${token}`,  (error, response,body)=> {
			let json = JSON.parse(body);
			expect(response.statusCode).to.be.equal(200);
			expect(response.headers['content-type']).to.contain('application/json');
			expect(json.status).to.equal(1000);
			expect(json).to.be.an('object');
		});
	});


});


describe('DELETE / Delete selected user Account ', () => {
	after('run after all code', () => {
		it('should deleting the bank account', (done) => {
			request.delete(`${url}accounts/1920000034/?token=${token}`, (error,response, body) => {
				let json = JSON.parse(body);
				expect(response.statusCode).to.be.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(json.status).to.equal(1000);
				expect(json).to.be.an('object');
				done();
			});
		});

	});

});