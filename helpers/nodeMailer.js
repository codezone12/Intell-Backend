import nodemailer from "nodemailer";

const emailConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NM_EMAIL,
    pass: process.env.NM_APP_PASSWORD
  }
};
const transporter = nodemailer.createTransport(emailConfig);

export const sendEmail = async (mailOptions) => {
  return await transporter.sendMail(mailOptions);
};
