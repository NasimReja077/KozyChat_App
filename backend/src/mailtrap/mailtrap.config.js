// src/mailtrap/mailtrap.config.js
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const mailtrapClient = new MailtrapClient({ token: process.env.MAILTRAP_TOKEN });

   //  endpoint: process.env.MAILTRAP_ENDPOINT || "https://send.api.mailtrap.io/",
    //  testInboxId: process.env.MAILTRAP_TEST_INBOX_ID,

const sender = {
     email: "hello@demomailtrap.co", // ✅ Use a verified sender email in Mailtrap
     name: "Chat App",
   };

   export { mailtrapClient, sender};