//Load express module with 'require' directive
// let express = require('express');
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import {getRoutes} from './routes/indexroute';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDoc from '../swagger.json';
let server = express();

const PORT = process.env.PORT || 3000;

//All ROUTES
server.use(getRoutes);


// Define request response in root URL(/)
server.use(bodyParser.urlencoded({ extended: false }));

server.use(bodyParser.json({ type: 'application/json'}));
server.use(express.json());
//TO show uploaed image
server.use(express.static('public'));

//to log request type
server.use(morgan('combined'));

//Swagger Documentation
server.use('/api/v1/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

server.get('/api/v1/', (req, res) =>{
	let content = {
		status: 200,
		message: "Connected"
	}
	res.json(content);
});

server.get('/', (req,res)=>{
	if (req.url === '/'){
		res.redirect('https://github.com/ldonjibson/Banka/tree/api-one#documentation')
	} else {
		res.status(404).json({
			"status": 404,
			"error": "Something is Wrong with this Url"
		});
	}


});

server.get('*', (req, res) =>{
	console.log(res)
	res.status(404).json({
		"status": 404,
		"error": "Not Found"
	});
});

 //end users

//Launching listening server on port 3000
server.listen(PORT, () =>{
	console.log(`App started on port ${PORT}`)
});

export default server;
