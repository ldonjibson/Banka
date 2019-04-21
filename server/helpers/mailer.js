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


const sendNotificationMail = (to, subject, text, html) =>{
	let mailOptions = {
	    from: '"Krunal Lathiya" <ckagoxozic@gmail.com>', // sender address
	    to: `${to}`, //getAccowner.email, // list of receivers
	    subject: `${subject}`, // Subject line
	    text: `${text}`,// plain text body
	    html: `${html}` // html body
	};

	transporter.sendMail(mailOptions, (error, info)=>{
		if(error){
			console.log(error)
		} else {
			console.log(info);
		}
	})
}


//exports
module.exports = {
	sendNotificationMail,
}