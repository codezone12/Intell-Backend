import Plan from "../models/Plan.js";
import { badRequest, serverError, successRequest } from "../utils/responses.js";

export const addPlan = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      numOfDays,
      numOfSignals,
      type,
      feautures
    } = req.body;
    let dbPlan = await Plan.findOne({ name });
    if (dbPlan) return badRequest(res, "Plan name already exist");

    const newPlan = await Plan.create({
      name,
      description,
      price,
      numOfDays,
      numOfSignals,
      feautures,
      type,
      created_at: new Date()
    });

    await newPlan.save();

    return successRequest(res, 200, "Plan created successfully");
  } catch (err) {
    console.log("error : ", err);
    return serverError(res, err?._message);
  }
};
