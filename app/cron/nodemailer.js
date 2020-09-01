const nodemailer = require("nodemailer");

let send = async args => {
  console.log("nodemailer email tujuan " + args.email);
  try {
    let transporter = nodemailer.createTransport(
      configMail = {
        service: "gmail",
        auth: {
          user: "bluut022@gmail.com",
          pass: "UptT1kUT"
        }
      }
    );

    let info = await transporter.sendMail({
      from: "bluut022@gmail.com", // sender address
      to: args.email,  // list of receivers
      subject: args.subject,  // subject line
      html: args.body  // html body
    });

    console.log("Message sent: %s", info.messageId);
    return nodemailer.getTestMessageUrl(info);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

module.exports = {
  send
};