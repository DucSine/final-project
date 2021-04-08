require('dotenv').config()
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: 'Gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
  
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.SMTP_NAME,
    to: options.email,
    subject: options.subject,
    html: options.message,
  });

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
