const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendMail = async (id, email, purpose) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        logger: true,
        secure: true,
        debug: true,
        secureConnection: false,
        auth: {
            user: "gokulsubashwydnov@gmail.com",
            pass: process.env.PASSCODE,
        },
    });

    let subject, htmlContent;
    if (purpose === "verification") {
        subject = "Please Verify Your Email";
        htmlContent = `<div style="font-size: 16px;">
            <b style="font-size: 18px;">Please Verify your Email</b> <br> 
            <span style="font-size: 16px;">Visit the link below to verify your email:
            <a href="http://localhost:3000/verify-email/${id}" style="font-size: 16px;">Click here</a></span>
          </div>`;
    } else if (purpose === "reset_password") {
        subject = "Reset Your Password";
        htmlContent = `<div style="font-size: 16px;">
            <b style="font-size: 18px;">Reset Your Password</b> <br> 
            <span style="font-size: 16px;">To reset your password, please click the link below:
            <a href="http://localhost:3000/reset-password/${id}" style="font-size: 16px;">Reset Password</a></span>
          </div>`;
    }

    await transporter.sendMail({
        from: '"Gokul Subhash" <gokulsubashwydnov@gmail.com>',
        to: email,
        subject: subject,
        html: htmlContent,
    });
}

module.exports = sendMail;
