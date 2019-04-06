//Load express module with 'require' directive
let express = require('express');
let server = express();
let path = require('path');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let users = require('./datastore/user.js');
// let app = require('./app');

// let fs = require('fs')

const PORT = process.env.PORT || 3000;

//All ROUTES
const userRouter = require('./routes/userRoutes.js');
const AuthController = require('./controllers/authentication.js');
const staffRouter = require('./routes/staffRoute.js');
const adminRouter = require('./routes/adminRoute.js');

// server.use();
// All user ROUTES
server.use('/api/v1/', userRouter);

// All Authentication Route
server.use('/api/v1/', AuthController);

//All staff Route
server.use('/api/v1/', staffRouter);

//All admin only route
server.use('/api/v1/', adminRouter);

// Define request response in root URL(/)
server.use(bodyParser.urlencoded({ extended: false }));
// server.use(bodyParser.text());                                    
server.use(bodyParser.json({ type: 'application/json'}));
server.use(express.json());
//TO show uploaed image
server.use(express.static('public'));

//to log request type
server.use(morgan('combined'));


server.get('/api/v1/', (req, res) =>{
	// console.log(res)
	let content = {
		status: 1000,
		message: "Connected"
	}
	res.json(content);
});


 //end users

//Launching listening server on port 3000
server.listen(PORT, () =>{
	console.log(`App started on port ${PORT}`)
});

module.exports = {
	server,
}