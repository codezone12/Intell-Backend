import bcrypt from "bcryptjs";

export const getHashedAndSaltedPassword = (password) => {
  const salt = bcrypt.genSaltSync(5);
  const hashedPassowrd = bcrypt.hashSync(password, salt);
  return hashedPassowrd;
};

export const checkIfPasswordMatched = async (uPassword, dbPassword) => {
  const isPasswordMatched = await bcrypt.compare(uPassword, dbPassword);
  return isPasswordMatched;
};
