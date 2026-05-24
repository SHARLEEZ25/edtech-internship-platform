const transporter = require("../../config/mail");

const sendOTPEmail = async ({ to, otp, type }) => {
    const subject =
        type === "EMAIL_VERIFICATION"
            ? "Verify your email"
            : "Reset your password";

    const message = `
    <h2>${subject}</h2>
    <p>Your OTP code is:</p>
    <h1>${otp}</h1>
    <p>This code expires in 10 minutes.</p>
  `;

    try {
        const info = await transporter.sendMail({
            from: `"Thozhil" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: message,
        });
        console.log('OTP email sent to', to, 'response:', info.response);
        return info;
    } catch (err) {
        console.error('Failed to send OTP email to', to, err);
        throw err;
    }
};

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Thozhil" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log('Email sent to', to, 'subject:', subject, 'response:', info.response);
        return info;
    } catch (err) {
        console.error('Failed to send email to', to, err);
        // We generally don't want to crash the request if email fails, but log it.
        // Or rethrow if critical.
    }
};

const sendInterviewScheduledEmail = async ({ to, studentName, companyName, date, link, mode }) => {
    const subject = `Interview Scheduled with ${companyName}`;
    const html = `
        <h2>Interview Scheduled</h2>
        <p>Hello ${studentName},</p>
        <p>An interview has been scheduled with <strong>${companyName}</strong>.</p>
        <p><strong>Date:</strong> ${new Date(date).toUTCString()}</p>
        <p><strong>Mode:</strong> ${mode}</p>
        ${link ? `<p><strong>Link:</strong> <a href="${link}">${link}</a></p>` : ''}
        <p>Good luck!</p>
    `;
    return sendEmail(to, subject, html);
};

module.exports = {
    sendOTPEmail,
    sendEmail,
    sendInterviewScheduledEmail
};
