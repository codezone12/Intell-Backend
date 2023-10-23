import { Schema, model } from "mongoose";
import { USER_TYPES } from "../utils/constants.js";

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  country: { type: String },
  profile_image: { type: String },
  walletAddress: { type: String },

  verification_token: { type: String },
  isVerified: { type: Boolean, default: false },
  verify_at: { type: Date },
  otp: { type: String },

  is_deleted: { type: Boolean, default: false },
  deleted_by: { type: Schema.Types.ObjectId, ref: "user" },
  created_by: { type: Schema.Types.ObjectId, ref: "user" },
  updated_by: { type: Schema.Types.ObjectId, ref: "user" },

  deleted_at: { type: Date },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date },

  user_type: { type: String, enum: USER_TYPES, required: true },

  purchased_plan: { type: String },
  purchased_at: { type: Date },
  package_expired_at: { type: Date },
  is_expired: { type: Boolean, default: false },
  expired_inform: { type: Boolean, default: false }
});

UserSchema.index({ user_type: 1 });
UserSchema.index({ is_deleted: 1 });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ name: 1 }, { unique: true });

const User = model("user", UserSchema);

export default User;
