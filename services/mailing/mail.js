import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "../../config/variables.js";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

export const sendMail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: EMAIL,
      to,
      subject,
      text,
    });
    return info;
  } catch (error) {
    throw error;
  }
};
export default transporter;
