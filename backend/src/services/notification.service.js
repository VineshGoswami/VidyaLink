// Simple stub for email/SMS. Integrate Twilio / SendGrid in production.
exports.sendEmail = async (to, subject, body) => {
  console.log(`[notify] email to ${to} - ${subject}`);
};
exports.sendSMS = async (to, message) => {
  console.log(`[notify] sms to ${to} - ${message}`);
};
