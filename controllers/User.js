import User from "../models/User.js";
import {
  badRequest,
  notFound,
  sendRequest,
  serverError,
  successRequest,
  unAuthorized
} from "../utils/responses.js";
import { generateToken } from "../helpers/token.js";
import {
  checkIfPasswordMatched,
  getHashedAndSaltedPassword
} from "../helpers/passwordManager.js";
import { sendEmail } from "../helpers/nodeMailer.js";
import passport from "passport";
import { ALL_PACKAGES, USER_TYPES } from "../utils/constants.js";
import Plan from "../models/Plan.js";
import { generateOTP } from "../utils/index.js";

export const signIn = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    let user = await User.findOne({ email, name });
    if (!user) return unAuthorized(res);

    let password_matched = await checkIfPasswordMatched(
      password.toString(),
      user.password
    );
    if (!password_matched) return unAuthorized(res);

    if (!user.isVerified) {
      const unVerifiedUserData = {
        isVerified: user.isVerified
      };
      const generatedToken = generateToken(unVerifiedUserData);
      return sendRequest(res, 401, false, "User is not verified", {
        token: generatedToken
      });
    }

    const userData = {
      email,
      id: user.id,
      name: user.name,
      user_type: user.user_type,
      isVerified: user.isVerified,
      profile_image: user.profile_image,
      country: user.country,
      purchased_plan: user.purchased_plan,
      purchased_at: user.purchased_at
    };
    const generatedToken = generateToken(userData);

    return successRequest(res, 200, "User logged in successfully", {
      token: generatedToken
    });
  } catch (err) {
    console.log("error : ", err);
    return serverError(res, err?._message);
  }
};

export const signUp = async (req, res) => {
  try {
    const { name, email, password, user_type } = req.body;
    let dbUser = await User.findOne({ $or: [{ email }, { name }] });
    if (dbUser) {
      const isSameName = name === dbUser.name;
      const isSameEmail = email === dbUser.email;
      if (isSameEmail) return badRequest(res, "Email already exist");
      if (isSameName) return badRequest(res, "Name already exist");
    }
    const OTP = generateOTP();
    const newUser = await User.create({
      name,
      email,
      otp: OTP,
      user_type: USER_TYPES[user_type],
      password: getHashedAndSaltedPassword(password)
    });

    const emailMessage = `Hello ${name} \n
    Thank your for approaching us!\n
    Enter below OTP to verify your account : \n  
    OTP :${OTP}\n
    If you are in hurry please contact given email address \n
    intellsignals.entertainment@gmail.com \n 
    Have a great day!`;

    const emailContent = {
      from: "Intell-Signal",
      to: newUser.email,
      subject: "Account Verification",
      text: emailMessage
    };
    await sendEmail(emailContent);

    return successRequest(res, 200, "OTP send successfully");
  } catch (err) {
    console.log("error : ", err);
    return serverError(res, err?._message);
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;
    let dbUser = await User.findOne({ email, otp });

    if (!dbUser) return badRequest(res, "Invalid Request");
    const isOTPNotMatched = dbUser.otp !== otp;
    if (isOTPNotMatched) return badRequest(res, "OTP Not Correct");

    dbUser.isVerified = true;
    dbUser.otp = undefined;
    dbUser.verify_at = new Date();

    await dbUser.save();

    const userData = {
      email,
      id: dbUser.id,
      name: dbUser.name,
      user_type: USER_TYPES[dbUser.user_type],
      isVerified: dbUser.isVerified,
      purchased_plan: null,
      purchased_at: null,
      profile_image: null,
      counrty: ""
    };
    const generatedToken = generateToken(userData);

    return successRequest(res, 200, "User verified successfully", {
      token: generatedToken
    });
  } catch (err) {
    console.log("error : ", err);
    return serverError(res, err?._message);
  }
};

export const sentOTP = async (req, res) => {
  try {
    const { email } = req.body;
    let dbUser = await User.findOne({ email });

    if (!dbUser) return badRequest(res, "Invalid Request");
    const dbOTP = dbUser?.otp;
    const isdbUserVerified = dbUser?.isVerified;
    if (!dbOTP || isdbUserVerified) return badRequest(res, "User is verified");

    const newOTP = generateOTP();
    dbUser.otp = newOTP;
    await dbUser.save();

    const emailMessage = `Hello ${dbUser.name} \n
    Thank your for approaching us!\n
    Enter below OTP to verify your account : \n  
    OTP :${newOTP}\n
    If you are in hurry please contact given email address \n
    intellsignals.entertainment@gmail.com \n 
    Have a great day!`;

    const emailContent = {
      from: "Intell-Signal",
      to: dbUser.email,
      subject: "Resend OTP",
      text: emailMessage
    };
    await sendEmail(emailContent);

    return successRequest(res, 200, "OPT send successfully");
  } catch (err) {
    console.log("error : ", err);
    return serverError(res, err?._message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, country, profile_image } = req.body;
    const {
      userData: {
        user: { id: user_id }
      }
    } = req.body;
    let dbUser = await User.findById(user_id);
    if (!dbUser) return badRequest(res, "Invalid Request");

    if (name) dbUser.name = name;
    if (country) dbUser.country = country;
    if (profile_image) dbUser.profile_image = profile_image;

    await dbUser.save();

    return successRequest(res, 200, "Profile updated successfully");
  } catch (err) {
    console.log("error : ", err);
    return serverError(res, err?._message);
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { token: verification_token } = req.params;
    let dbUser = await User.findOne({ verification_token });

    if (!dbUser) return badRequest(res, "Invalid Request");

    dbUser.isVerified = true;
    dbUser.verification_token = undefined;
    dbUser.verify_at = new Date();

    await dbUser.save();

    return successRequest(res, 200, "User verified successfully");
  } catch (err) {
    console.log("error : ", err);
    return serverError(res, err?._message);
  }
};

export const getForgetPassword = async (req, res) => {
  try {
    const { name, email } = req.body;
    let dbUser = await User.findOne({ email });

    if (!dbUser || dbUser.name !== name) return notFound(res, "User Not Found");

    const userData = {
      email,
      name: name,
      id: dbUser.id,
      user_type: USER_TYPES[dbUser.user_type],
      isVerified: dbUser.isVerified
    };

    const generatedTokenForVerification = generateToken(userData, "4h");

    const emailMessage = `Hello ${name} \n
    Thank your for approaching us!\n
    Click below link to reset your password : \n  
    ${process.env.FE_HOST}/update-password/${generatedTokenForVerification} \n
    If you are in hurry please contact given email address \n
    intellsignals.entertainment@gmail.com \n 
    Have a great day!`;

    const emailContent = {
      from: "Intell-Signal",
      to: dbUser.email,
      subject: "Reset Password",
      text: emailMessage
    };
    await sendEmail(emailContent);

    dbUser.verification_token = generatedTokenForVerification;

    await dbUser.save();

    return successRequest(res, 200, "Verification link send on email");
  } catch (err) {
    console.log("error : ", err);
    return serverError(res, err?._message);
  }
};

export const updateForgetPassword = async (req, res) => {
  try {
    const { token: verification_token } = req.params;
    const { password } = req.body;
    let dbUser = await User.findOne({ verification_token });

    if (!dbUser) return badRequest(res, "Invalid Request");

    dbUser.verification_token = undefined;
    dbUser.password = getHashedAndSaltedPassword(password);

    await dbUser.save();

    return successRequest(res, 200, "Password updated successfully");
  } catch (err) {
    console.log("error : ", err);
    return serverError(res, err?._message);
  }
};

export const purchasePlanById = async (req, res) => {
  try {
    const {
      userData: {
        user: { id: user_id }
      },
      plan_id
    } = req.body;

    let dbUser = await User.findById(user_id);
    if (!dbUser) return badRequest(res, "Invalid Request");

    const currentDateAndTime = new Date();
    const expires_at = new Date(currentDateAndTime);
    expires_at.setDate(
      currentDateAndTime.getDate() + ALL_PACKAGES[plan_id].numOfDays
    );
    dbUser.purchased_plan = plan_id;
    dbUser.purchased_at = currentDateAndTime;
    dbUser.package_expired_at = expires_at;

    const emailMessageUser = `Dear ${dbUser.name},\n
    Thank you for buying the ${
      ALL_PACKAGES[plan_id].type
    } package. This package will give you ${
      ALL_PACKAGES[plan_id].numOfSignals ?? "Unlimited"
    } signals and will last for ${ALL_PACKAGES[plan_id].numOfDays} days.\n
    Have a great day. Have a great day\n
    Regards,\n
    IntellSignals\n
    intellsignals.entertainment@gmail.com\n`;

    const emailMessageAdmin = `Hello,\n
    There is an user ${dbUser.name} buy the ${
      ALL_PACKAGES[plan_id].type
    } package at ${new Date().toLocaleString()}.\n
    Thank you.\n
    Have a great day.`;

    const emailContentUser = {
      from: "Intell-Signal",
      to: dbUser.email,
      subject: "Pacakge Purchased",
      text: emailMessageUser
    };
    const emailContentAdmin = {
      from: "Intell-Signal",
      to: process.env.INSIG_EMAIL,
      subject: "Pakage Purchased",
      text: emailMessageAdmin
    };

    const adminEmail = sendEmail(emailContentAdmin);
    const userEmail = sendEmail(emailContentUser);
    await Promise.all([userEmail, adminEmail]);

    await dbUser.save();
    return successRequest(res, 200, "Plan purchased successfully");
  } catch (err) {
    console.log("error : ", err);
    return serverError(res, err?._message);
  }
};

export const contactUs = async (req, res) => {
  try {
    const { subject, fullName, email, message } = req.body;

    const emailMessageAdmin = `Hello Admin you got an email from user \n
    Name : ${fullName} \n
    Email : ${email} \n
    Subject : ${subject} \n
    Message " ${message}
    `;

    const emailMessageUser = `Dear ${fullName} \n
    Thank you for approaching us. We will get back to you as soon as possible on your query. \n
    Have a great day. \n
    Intel Signals\n
    intellsignals.entertainment@gmail.com`;

    const emailContentAdmin = {
      from: "Intell-Signal",
      to: process.env.INSIG_EMAIL,
      subject: "Query for quick support",
      text: emailMessageAdmin
    };

    const emailContentUser = {
      from: "Intell-Signal",
      to: email,
      subject: "Quick Support : Query Submitted",
      text: emailMessageUser
    };
    const adminEmail = sendEmail(emailContentAdmin);
    const userEmail = sendEmail(emailContentUser);

    await Promise.all([userEmail, adminEmail]);
    return successRequest(res, 200, "Form submitted successfully");
  } catch (err) {
    console.log("error : ", err);
    return serverError(res, err?._message);
  }
};

export const loginGoogleCallback = (req, res) => {
  // Successful authentication, redirect or respond as needed
  res.redirect("/");
};
