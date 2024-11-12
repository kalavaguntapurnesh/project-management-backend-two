const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.clouddatanetworks.com",
  port: 465,
  // secure: true,
  auth: {
    user: "noreply-syndeo@clouddatanetworks.com",
    pass: "CDN@syndeo",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMailToUser(to, subject, text, html) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "noreply-syndeo@clouddatanetworks.com", // sender address
    to,
    subject,
    text,
    html,
  });
  console.log("Mail Sent Successfully");
}

async function forgotMail(subject, text, html) {
  const info = await transporter.sendMail({
    from: "noreply-syndeo@clouddatanetworks.com", // sender address
    to,
    subject,
    text,
    html,
  });
  console.log("Forgot Password Sent Successfully");
}

module.exports = { sendMailToUser, forgotMail };
