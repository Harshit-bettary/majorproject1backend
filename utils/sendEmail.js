const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true', 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"DriveEasy Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html 
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent to', to, '| Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;
