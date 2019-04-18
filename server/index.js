//Load express module with 'require' directive
let express = require('express');
let server = express();
let path = require('path');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let users = require('./datastore/user.js');
const getRoutes = require('./routes/indexroute.js');


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

module.exports = {
	server,
}