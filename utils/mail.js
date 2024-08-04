const nodemailer = require('nodemailer');

const sendMail = async (userEmail, subject, body) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: userEmail,
      subject,
      html: body,
    };
    transporter.sendMail(mailOptions, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent successfully!', result.response);
      }
      transporter.close(); // Closing the connection to the server once done.
    });
  } catch (err) {
    console.error('Error sending email:', err);
    return;
  }
};

module.exports = {
  sendMail,
};
