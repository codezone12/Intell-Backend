import { Schema, model } from "mongoose";
import { PLAN_CATEGORY, PLAN_TYPES } from "../utils/constants.js";

const PlanSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  numOfDays: { type: Number, required: true },
  numOfSignals: { type: Number, required: true },
  type: { type: String, enum: PLAN_TYPES, required: true },
  category: {
    type: String,
    enum: PLAN_CATEGORY,
    default: "regular",
    required: true
  },
  feautures: [String],

  is_deleted: { type: Boolean, default: false },
  deleted_by: { type: Schema.Types.ObjectId, ref: "user" },
  created_by: { type: Schema.Types.ObjectId, ref: "user" },
  updated_by: { type: Schema.Types.ObjectId, ref: "user" },

  deleted_at: { type: Date },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date }
});

PlanSchema.index({ is_deleted: 1 });
PlanSchema.index({ type: 1 }, { unique: true });
PlanSchema.index({ name: 1 }, { unique: true });

const Plan = model("plan", PlanSchema);

export default Plan;
