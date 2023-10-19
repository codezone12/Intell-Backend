import jwt from "jsonwebtoken";

export const generateToken = (userData, expiresIn) => {
  const data = {
    user: userData
  };
  const token = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: expiresIn ?? "7d"
  });
  return token;
};

export const dataFromToken = (token) => {
  const decodeData = jwt.verify(token, process.env.JWT_SECRET);
  return decodeData;
};
