import mongoose from "mongoose";

const db_uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.7knvowp.mongodb.net/?retryWrites=true&w=majority`;

export const connectDB = async () => {
  try {
    await mongoose.connect(db_uri);
    console.log("DB Connected");
  } catch (err) {
    console.log("err", err);
  }
};
