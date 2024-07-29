const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendMail = async (id, email, purpose, orderDetails, totalPrice) => {
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
           <b style="font-size: 18px;">your otp is ${id}</b>
          </div>`;
    } else if (purpose === "reset_password") {
        subject = "Reset Your Password";
        htmlContent = `<div style="font-size: 16px;">
            <b style="font-size: 18px;">Reset Your Password</b> <br> 
             <b style="font-size: 18px;">your otp is ${id}</b> <br>
           <span style="font-size: 16px;">⚠️ Note: If you did not request a password change, please ignore this message.</span>
          </div>`;
    } else if (purpose === "order_confirmation") {
        subject = "Order Confirmation";
        htmlContent = `<div style="font-size: 16px;">
            <b style="font-size: 18px;">Thank you for your order!</b> <br> 
            <span style="font-size: 16px;">Order Details:</span><br>
            ${orderDetails.map(item => `
              <div>
                <span style="font-size: 16px;">${item.productName} - ${item.quantity} x ${item.price}</span>
              </div>
            `).join('')}
            <br>
            <span style="font-size: 16px;">Total Price: $${totalPrice}</span><br>
            <span style="font-size: 16px;">We will notify you when your order is shipped.</span>
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
