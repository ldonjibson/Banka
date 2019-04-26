import chai, { expect } from 'chai';
import request from 'request';
import dotenv from 'dotenv'
dotenv.config();
const PORT = process.env.PORT || 3000;
console.log(PORT)

let url = `http://localhost:${PORT}/api/v1/`
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlNpbmNlQGFwcmlsLmJpeiIsImlkIjoyLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTU0NDcwOTE3LCJleHAiOjE1NTk2NTQ5MTd9.-j_h2OUe1PH4Ptb1siOORyxle9rzeD85Zh2mbJA5S0I'

describe('Login before operations are perform here', ()=>{
	const validateAdmin = {
		email: 'Sincere@april.biz',
		password: 'nollywood'
	};
	let staffToken;
	before((done)=>{
		request.post({
			url: `${url}auth/signin`,
			form: validateAdmin
		}, (error, response,body)=> {
			console.log(body)
			let bodyResponse = JSON.parse(body)
			staffToken = bodyResponse.data['token']
			console.log(staffToken);
			done();
		});
	});


	describe('GET / For Staff  and Admin Alone', ()=> {

		it ('Should return all users', (done) => {
			request.get(`${url}users?token=${staffToken}`, (error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();	
			});
		}); 

		it('should return user id detail', (done) => {
			request.get(`${url}user/1?token=${staffToken}`, (error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});

		it('should return user bank acount Details', (done) => {
			request.get(`${url}user/account/1427875169?token=${staffToken}`, (error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});

		it('should return user bank acount Details', (done) => {
			request.get(`${url}user/account/1427875169/transactions?token=${staffToken}`, (error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});

		it('should return user bank acounts', (done) => {
			request.get(`${url}all/accounts?token=${staffToken}`, (error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});


		it('should return all active bank account with status active', (done) => {
			request.get(`${url}all/accounts?status=active&token=${staffToken}`, (error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(206);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});

		it('should return bank account with status dormant', (done) => {
			request.get(`${url}all/accounts?status=dormant?token=${staffToken}`, (error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(400);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});

		it('should return user bank acount Details', (done) => {
			request.get(`${url}user/account/1427875169/transaction/2/detail?token=${staffToken}`, (error,response,body) => {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.equal(200);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
				done();
			});

		});
	});

	describe('POST / method With token For Admin and Staff to be credit and debit a bank account and then send notification for it', () => {

		it('should allow update and credit account balance', () => {
			request.post({
				url: `${url}transactions/1427875169/credit?token=${staffToken}`,
				form: {
					"creditAmount": 220000.989
				}
			},(error, response,body)=> {
				let bodyResponse = JSON.parse(body);
				// expect(response.statusCode).to.be.equal(201);
				console.log(bodyResponse.error)
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
			});
		});


		it('should allow update and  debit account balance', () => {
			request.post({
				url: `${url}transactions/1427875169/debit?token=${staffToken}`,
				form: {
					"debitAmount": 56600.989
				}
			},(error, response,body)=> {
				let bodyResponse = JSON.parse(body);
				expect(response.statusCode).to.be.equal(201);
				expect(response.headers['content-type']).to.contain('application/json');
				expect(bodyResponse).to.be.an('object');
			});
		});
	});

})






