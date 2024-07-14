export default () => ({
    financeSource: process.env.FINANCE_SOURCE || 'FinnHubService',
    financeCreds: process.env.FINANCE_CREDS,
    ///
    mongoConnection: process.env.MONGO_CONNECTION,
    ///
    brevoApiKey: process.env.BREVO_API_KEY,
    brevoSenderEmail: process.env.BREVO_SENDER_EMAIL,
    brevoSenderName: process.env.BREVO_SENDER_NAME,
    brevoTemplateId: process.env.BREVO_TEMPLATE_ID,
});
    