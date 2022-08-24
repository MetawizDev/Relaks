const nodemailer = require("nodemailer");

exports.sendMail = async (subject, text, to) => {
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   service: "Gmail",
  //   auth: {
  //     user: process.env.MAIL,
  //     pass: process.env.MAILPASSWORD,
  //   },
  // });

  const transporter = nodemailer.createTransport({
    host: "smtp.ionos.co.uk",
    port: 587,
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAILPASSWORD,
    },
  });

  const msgOptions = { subject, text, to, from: process.env.MAIL };
  const result = await transporter.sendMail(msgOptions);

  console.log(result);
};
