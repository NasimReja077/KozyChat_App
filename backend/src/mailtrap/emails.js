// src/mailtrap/emails.js

import { mailtrapClient, sender } from "./mailtrap.config.js"
import { ApiError } from "../utils/ApiError.js"
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) =>{
     const recipient =[{ email }];
     try {
          const response = await mailtrapClient.send({
               from: sender,
               to: recipient,
               subject: "verify your email",
               html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
               category: "Email verification",
          });
          console.log("Verification email sent successfully", response);          
     } catch (error) {
          console.error(`Error sending verification email`, error);
          throw new ApiError(500,`Error sending verification email: ${error.message}`);
     }
};
// Welcome Email
export const sendWelcomeEmail = async (email, name) => {
     const recipient = [{ email }];
     try {
          const response = await mailtrapClient.send
          ({
               from: sender,
               to: recipient,
               template_uuid:process.env.MAILTRAP_TEMPLATE_UUID,
               template_variables: {
                company_info_name: "MyApp Company",
                name: name,
              },
          });
          console.log("Welcome email send Successfully", response);
     } catch (error) {
          console.error(`Error sending welcome email`, error);
          throw new ApiError(500,`Error sending welcome email: ${error.message}`);
     }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
		});
	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new ApiError(500,`Error sending password reset email: ${error.message}`);
	}
};

export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new ApiError(500,`Error sending password reset success email: ${error.message}`);
	}
};