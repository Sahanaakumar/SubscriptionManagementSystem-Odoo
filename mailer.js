const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    // Check if credentials are set properly or are still placeholders
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const isPlaceholder = !user || !pass || user.includes('your_email') || pass.includes('your_email');

    // ALWAYS LOG to console for Dev Mode visibility
    console.log('----------------------------------------------------');
    console.log('DEV MODE EMAIL LOG:');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message:\n${text}`);
    console.log('----------------------------------------------------');

    // If no valid credentials, return successfully without sending
    if (isPlaceholder) {
        console.log('WARNING: Email credentials not set in .env file. Skipping actual send.');
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: user,
                pass: pass
            }
        });

        const mailOptions = {
            from: '"Subscription System" <no-reply@subscriptionsystem.com>',
            to,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email: ", error);
        // Fallback to console log if sending fails
        console.log('----------------------------------------------------');
        console.log('EMAIL SENDING FAILED. FALLBACK LOG:');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Message:\n${text}`);
        console.log('----------------------------------------------------');
        // We do NOT throw here so the user flow is not interrupted during dev/demo
    }
};

module.exports = sendEmail;
