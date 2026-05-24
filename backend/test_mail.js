require('dotenv').config();
const transporter = require('./src/config/mail');

(async () => {
  try {
    console.log('Verifying transporter...');
    await transporter.verify();
    console.log('SMTP transporter verified. Sending test email to', process.env.EMAIL_USER);
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Thozhil test email',
      text: 'This is a test email from Thozhil backend.',
      html: '<p>This is a <b>test</b> email from Thozhil backend.</p>'
    });
    console.log('Send result:', info);
  } catch (err) {
    console.error('Error sending test email:', err);
    process.exit(1);
  }
})();
