import { Router } from "express";
import {
  contactUs,
  getForgetPassword,
  loginGoogleCallback,
  purchasePlanById,
  sentOTP,
  signIn,
  signUp,
  updateForgetPassword,
  updateProfile,
  verifyOTP,
  verifyUser
} from "../controllers/User.js";
import { USER } from "../utils/apiRoutes.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import {
  contactUsValidation,
  forgetPasswordValidations,
  getForgetPasswordValidations,
  purchasePlanValidations,
  sendOTPValidation,
  signInValidations,
  signUpValidations,
  updateProfileValidation,
  verifyOTPValidation
} from "../validations/user.js";
import passport from "passport";
import { validateUserLoggedIn } from "../middlewares/userLoggedIn.js";

const router = Router();
const {
  SIGN_IN,
  SIGN_UP,
  VERIFY_OTP,
  GET_FORGET_PASSWORD,
  FORGET_PASSWORD,
  LOGIN_GOOGLE,
  LOGIN_GOOGLE_CALLBACK,
  PURCHASE_PLAN,
  PROFILE_UPDATE,
  CONTACT_US,
  SEND_OTP
} = USER;

router.post(
  SIGN_IN,
  (req, res, next) => validateSchema(req, res, next, signInValidations),
  signIn
);
router.post(
  SIGN_UP,
  (req, res, next) => validateSchema(req, res, next, signUpValidations),
  signUp
);
router.put(
  VERIFY_OTP,
  (req, res, next) => validateSchema(req, res, next, verifyOTPValidation),
  verifyOTP
);

router.post(
  SEND_OTP,
  (req, res, next) => validateSchema(req, res, next, sendOTPValidation),
  sentOTP
);
router.put(
  GET_FORGET_PASSWORD,
  (req, res, next) =>
    validateSchema(req, res, next, getForgetPasswordValidations),
  getForgetPassword
);
router.put(
  `${FORGET_PASSWORD}/:token`,
  (req, res, next) => validateSchema(req, res, next, forgetPasswordValidations),
  updateForgetPassword
);
router.put(
  PURCHASE_PLAN,
  (req, res, next) => validateSchema(req, res, next, purchasePlanValidations),
  purchasePlanById
);
router.put(
  PROFILE_UPDATE,
  (req, res, next) => validateSchema(req, res, next, updateProfileValidation),
  validateUserLoggedIn,
  updateProfile
);
router.post(
  CONTACT_US,
  (req, res, next) => validateSchema(req, res, next, contactUsValidation),
  contactUs
);
router.get(
  LOGIN_GOOGLE,
  passport.authenticate("google", { scope: ["profile"] })
);
router.get(
  LOGIN_GOOGLE_CALLBACK,
  passport.authenticate("google", { failureRedirect: "/" }),
  loginGoogleCallback
);

export default router;
