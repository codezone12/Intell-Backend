import cron from "node-cron";
import User from "../models/User.js";
import { sendEmail } from "../helpers/nodeMailer.js";
import { ALL_PACKAGES } from "./constants.js";

const sendEmailToExpiredToBePackageHolders = cron.schedule(
  "*/10 * * * *",
  async () => {
    const currentTime = new Date();

    // Find users who need to be informed of expiry or are expired
    const users = await User.find({
      $or: [
        {
          expired_inform: false,
          is_expired: false,
          package_expired_at: { $gte: currentTime }
        },
        {
          expired_inform: true,
          is_expired: false,
          package_expired_at: { $lt: currentTime }
        }
      ]
    });

    const emailPromises = users.map(async (user) => {
      const isLessThanFourHours =
        (currentTime - new Date(user.package_expired_at)) / 3600000 <= 4;
      if (isLessThanFourHours && !user.expired_inform) {
        const emailMessage = `Hello ${user.name}\n
        Your ${
          ALL_PACKAGES[user.purchased_plan].type
        } Package is about to finish.\n
        Buy your package to update it.\n 
        Thank You\n 
        Have a great day!\n
        Regards\n
        IntellSignals\n
        intellsignals.entertainment@gmail.com`;

        const emailContent = {
          from: "Intell-Signal",
          to: user.email,
          subject: "Package Repurchase",
          text: emailMessage
        };
        await sendEmail(emailContent);
        user.expired_inform = true;
      } else if (
        user.package_expired_at <= currentTime &&
        user.expired_inform
      ) {
        const emailMessage = `Dear ${user.name}\n
        Your ${
          ALL_PACKAGES[user.purchased_plan].type
        } which you bought at ${new Date(
          user.purchased_at
        ).toLocaleString()} has finished now.\n
        Pleasure repurchase your package to continue.\n 
        Thank You\n 
        Have a great day\n
        Regards,\n
        IntellSignals\n
        intellsignals.entertainment@gmail.com \n`;

        const emailContent = {
          from: "Intell-Signal",
          to: user.email,
          subject: "Package Expired",
          text: emailMessage
        };
        await sendEmail(emailContent);
        user.is_expired = true;
      }
    });

    await Promise.all(emailPromises);

    // Update all modified users in a single batch update
    const userUpdatePromises = users.map((user) => user.save());
    await Promise.all(userUpdatePromises);

    console.log("Running a task every 10 minutes");
  },
  { scheduled: false }
);

export default sendEmailToExpiredToBePackageHolders;
