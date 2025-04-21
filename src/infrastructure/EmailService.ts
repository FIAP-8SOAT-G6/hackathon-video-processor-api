import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
}

const sendEmail = async ({ to, subject, text }: SendEmailInput) => {
  const msg = {
    to,
    from: 'soatstudants@gmail.com',
    subject,
    text,
  };

  await sgMail.send(msg);
};

const EmailService = { sendEmail };

export default EmailService;
