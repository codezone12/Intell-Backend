import { dataFromToken } from "../helpers/token.js";
import { unAuthorized } from "../utils/responses.js";

export const validateUserLoggedIn = async (req, res, next) => {
  try {
    const token = req.header("token");
    if (!token) return unAuthorized(res, "token not found");

    const userData = dataFromToken(token);
    if (!userData) return unAuthorized(res, "token not found");
    const isVerified = userData?.user?.isVerified;
    if (!isVerified) return unAuthorized(res, "token not found");

    req.body = { ...req.body, userData };

    next();
  } catch (err) {
    return badRequest(res, err.message);
  }
};
