import { object, string } from "yup";
import { EMAIL_REGEX, PASSWORD_REGEX, USER_TYPES } from "../utils/constants.js";

export const signInValidations = object().shape({
  name: string().required("Name is required"),
  email: string()
    .email("Invalid email address")
    .matches(EMAIL_REGEX, "Invalid email address")
    .required("Email is required"),
  password: string().required("Password is required")
});

export const verifyOTPValidation = object().shape({
  email: string()
    .email("Invalid email address")
    .matches(EMAIL_REGEX, "Invalid email address")
    .required("Email is required"),
  otp: string().required("OTP is required")
});

export const sendOTPValidation = object().shape({
  email: string()
    .email("Invalid email address")
    .matches(EMAIL_REGEX, "Invalid email address")
    .required("Email is required")
});

export const signUpValidations = object().shape({
  name: string()
    .required("Name is required")
    .min(3, "Name must contain atleat 3 characters"),
  email: string()
    .email("Invalid email address")
    .matches(EMAIL_REGEX, "Invalid email address")
    .required("Email is required"),
  password: string()
    .required("Password is required")
    .min(6, "Password must be greather than 6 characters")
    .matches(
      PASSWORD_REGEX,
      "Password must contain an uppercase, lowercase, special letter and digit"
    ),
  user_type: string()
    .required("User Type is requried")
    .oneOf(Object.keys(USER_TYPES), "User Type must be 1 for admin, 2 for user")
});

export const purchasePlanValidations = object().shape({
  plan_id: string().required("Plan id is required")
});

export const contactUsValidation = object().shape({
  fullName: string()
    .required("Full name is requireds")
    .min(6, "Full name must contain atleat 6 characters"),
  email: string()
    .email("Invalid email address")
    .matches(EMAIL_REGEX, "Invalid email address")
    .required("Email is required"),
  subject: string()
    .required("Subject is required")
    .min(3, "Subject must contain atleat 3 characters"),
  message: string()
    .required("Message is required")
    .min(10, "Message must contain atleat 10 characters")
});

export const getForgetPasswordValidations = object().shape({
  name: string().required("Name is required"),
  email: string()
    .email("Invalid email address")
    .matches(EMAIL_REGEX, "Invalid email address")
    .required("Email is required")
});

export const forgetPasswordValidations = object().shape({
  password: string()
    .required("Password is required")
    .min(6, "Password must be greather than 6 characters")
    .matches(
      PASSWORD_REGEX,
      "Password must contain atleat an uppercase, a lowercase, a special letter and digit"
    )
});

export const updateProfileValidation = object().shape({
  name: string()
    .required("Name is required")
    .min(3, "Name must contain atleat 3 characters"),
  country: string()
    .optional()
    .min(3, "Country must contain atleat 3 characters"),
  profile_image: string().optional()
});
