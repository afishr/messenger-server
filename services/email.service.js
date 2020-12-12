const sgMail = require('@sendgrid/mail');

const initSender = (apiKey) => {
  sgMail.setApiKey(apiKey);
};

const sendConfirmationEmail = (email, uuid) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    templateId: process.env.SENDGRID_TEMPLATE_CONFIRM,

    dynamic_template_data: {
      link: `http://localhost/email/confirm/?token=${uuid}`,
    },
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = { initSender, sendConfirmationEmail };
