const nodemailer = require("nodemailer");

const sendEmail = async (option) =>{
    let transporter = nodemailer.createTransport({
        service:'qq',
        auth: {
            user: process.env.SMTP_EMAIL, // generated ethereal user
            pass: process.env.SMTP_PASSWORD, // generated ethereal password
        },
    });

    const message = {
        from: `${process.env.FROM_NAME}<${process.env.SMTP_EMAIL}>`, // sender address
        to: option.email, // list of receivers
        subject: option.subject, // Subject line
        text: option.message, // plain text body
    }

    let info = await transporter.sendMail(message);
}

module.exports = sendEmail;