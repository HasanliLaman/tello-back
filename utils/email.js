const nodemailer = require("nodemailer");
const pug = require("pug");

module.exports = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
      user: process.env.MAILER_USERNAME,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Tello (tello@gmail.com)",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(mailOptions);
};

class Email {
  constructor(user, token) {
    this.name = user.name;
    this.email = user.email;
    this.from = process.env.EMAIL_FROM;
    this.url = `${process.env.EMAIL_URL}/${token}`;
  }

  createTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async send() {
    const html = pug.renderFile(`${__dirname}/../views/reset.pug`, {
      name: this.name,
      url: this.url,
    });

    const subject = "Follow link to reset password";

    const mailOptions = {
      from: this.from,
      to: this.email,
      subject,
      html,
    };

    await this.createTransport().sendMail(mailOptions);
  }
}

module.exports = Email;
