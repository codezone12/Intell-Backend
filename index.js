import "dotenv/config";
import express, { json } from "express";
import router from "./routes/index.js";
import cors from "cors";
import passport from "passport";
import sendEmailToExpiredToBePackageHolders from "./utils/cron-ping.js";
import mongoose from "mongoose";
mongoose.set('strictQuery', false);

const app = express();

app.use(json());

//cors
app.use(cors({
  credentials: true, //allow session cookie from browser to pass through
  origin: ["https://intel-signals.vercel.app" , "http://localhost:3000" , "https://intel-signals-358zy7301-codezone12.vercel.app"]
}))

sendEmailToExpiredToBePackageHolders.start();
// app.use(passport.initialize())
// app.use(passport.session())

app.get("/", (req, res) => {
  res.send("Application is live");
});

app.get("/test", (req, res) => {
  res.json({
    messgae : 'Working'
  });
});

app.use("/api", router);

//connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log(`Connected and Listening on port ${process.env.PORT}`);
    })
  })
  .catch((err) => { console.log(err) })


