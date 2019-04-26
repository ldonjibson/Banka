import dotenv from 'dotenv'
dotenv.config();
import nodeMailer from 'nodemailer';

let transporter = nodeMailer.createTransport({
	host: process.env.host,
	port: process.env.port,
	secure: process.env.secure,
	auth: {
	    user: process.env.user,
	    pass: process.env.pass
	}
});


const sendNotificationMail = (to, subject, text, html) =>{
	let mailOptions = {
	    from: process.env.email_from, // sender address
	    to: `${to}`, //getAccowner.email, // list of receivers
	    subject: `${subject}`, // Subject line
	    text: `${text}`,// plain text body
	    html: `${html}` // html body
	};

	transporter.sendMail(mailOptions, (error, info)=>{
		if(error){
			return error
		} else {
			return info;
		}
	})
}


//exports
export {sendNotificationMail}