let nodeMailer = require('nodemailer');

let transporter = nodeMailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
	    user: 'ckagoxozic@gmail.com',
	    pass: 'nollywood10'
	}
});

//exports
module.exports = {
	transporter,
}