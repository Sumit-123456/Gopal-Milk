const nodemailer = require("nodemailer");

/*
==========================================
EMAIL TRANSPORTER
==========================================
*/

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/*
==========================================
SEND EMAIL FUNCTION
==========================================
*/

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

module.exports = sendEmail;
