import { unProcessableEntity } from "../utils/responses.js";

export const validateSchema = async (req, res, next, schema) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    return unProcessableEntity(res, err.message);
  }
};
