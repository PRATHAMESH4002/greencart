import nodemailer from "nodemailer";

const sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: "GreenCart <no-reply@greencart.com>",
    to: email,
    subject: "Your GreenCart Login OTP",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`
  });
};

export default sendOtp;
