// import dotenv from 'dotenv';
import nodeMailer from 'nodemailer';


const transporter = nodeMailer.createTransport({
  host: process.env.host,
  port: process.env.emailport,
  secure: process.env.secure,
  auth: {
	    user: process.env.user,
	    pass: process.env.pass,
  }
});


const sendNotificationMail = (to, subject, text, html) => {
  const mailOptions = {
	    from: process.env.email_from,
	    to: `${to}`,
	    subject: `${subject}`,
	    text: `${text}`,
	    html: `${html}`,
  };

  transporter.sendMail(mailOptions)
  .then(info =>{
    return "info"
  }).catch(error=>{
    console.log(error)
    return "error"
  }) 
};


// exports
export { sendNotificationMail };
