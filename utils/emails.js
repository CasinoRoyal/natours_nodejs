const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// const sendEmail = async (options) => {
//   //-Create a transporter 
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_NAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });

//   //-Create email options
//   const emailOptions = {
//     from: 'Deep swamp <kraken@mail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//   };
//   //-Send email
//   await transporter.sendMail(emailOptions);
// };

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Natours Ltd. <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      })
    };

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}\\..\\views\\emails\\${template}.pug`,{
      firstName: this.firstName,
      url: this.url,
      subject
    });

    const emailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmlToText.fromString(html)
    };

    await this.newTransport().sendMail(emailOptions);
  }

  async sendWelcome() {
    await this.send('welcomeEmail', 'Welcome to the Natours Ltd.');
  }

  async sendPasswordReset() {
    await this.send('forgotPasswordEmail', 'Your reset token (valid for only 10 minutes)');
  }
};