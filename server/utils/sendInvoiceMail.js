import nodemailer from "nodemailer";

const sendInvoiceMail = async (email, invoicePath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "GreenCart <no-reply@greencart.com>",
    to: email,
    subject: "Your GreenCart Order Invoice",
    text: "Thank you for your order. Please find your invoice attached.",
    attachments: [
      {
        filename: "invoice.pdf",
        path: invoicePath,
      },
    ],
  });
};

export default sendInvoiceMail;
