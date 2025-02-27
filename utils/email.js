const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});
const SendEmail = async (options)=>{
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.email,
        subject: options.subject,
        text: options.text, 
        html: options.html, 
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          res.status(500).json({ error: "Failed to send email" }); // Send error response
        } else {
          console.log("Email sent:", info.response);
          res.status(200).json({ message: "Email sent successfully" }); // Send success response
        }
      })
}

exports.module = SendEmail
