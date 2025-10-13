import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import { SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD } from "../config/variables.js";
import Notifications from "../models/notifications.js";


export const hashedPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    return hashedpassword;
  } catch (error) {
    return error;
  }
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// export const createSuperAdmin = async () => {
//   try {
//     const existingSuperAdmin = await User.findOne({ user_type: "super_admin" });

//     if (existingSuperAdmin) {
//       return;
//     }

//     const email = SUPERADMIN_EMAIL;
//     const password = SUPERADMIN_PASSWORD;

//     const hashed = await hashedPassword(password);

//     const superAdmin = new User({
//       email,
//       password: hashed,
//       user_type: "super_admin",
//       isVerified:true,
//       profileCompleted:true,
//       phone_number: 9911064724,
//     });

//     await superAdmin.save();

//     console.log("Superadmin created successfully:", email);
//   } catch (error) {
//     console.error("Error creating superadmin:", error);
//   }
// };

// export const getSuperAdminId = async () => {
//   const superadmin = await User.findOne({ user_type: "super_admin" });
//   return superadmin ? superadmin._id : null;
// };

export const createNotification = async ({ user_id, type, message }) => {


  console.log(user_id,type,message)
  try {
    await Notifications.create({ user_id, type, message });
  } catch (error) {
    throw error;
  }
};


export const generateOtp = (length = 6) => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

// export const sendOtp = async (phone,otp) => {
//   console.log(`Sending OTP ${otp} to phone ${phone}`);
//   const otp = generateOtp();
//   return otp;
// }