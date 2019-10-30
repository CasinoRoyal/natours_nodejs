const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //-Create a transporter 
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  //-Create email options
  const emailOptions = {
    from: 'Deep swamp <kraken@mail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  //-Send email
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;