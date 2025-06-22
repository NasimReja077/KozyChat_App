// src/mailtrap/emailTemplates.js
export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f2f4f8;
      color: #333;
    }

    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }

    .email-header {
      background: linear-gradient(90deg, #007cf0, #00dfd8);
      color: #fff;
      padding: 30px;
      text-align: center;
    }

    .email-header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 600;
    }

    .email-body {
      padding: 30px;
      line-height: 1.6;
    }

    .code-box {
      text-align: center;
      margin: 30px 0;
    }

    .verification-code {
      display: inline-block;
      font-size: 38px;
      font-weight: bold;
      color: #007cf0;
      letter-spacing: 8px;
      padding: 14px 28px;
      background-color: #e6f4ff;
      border-radius: 10px;
    }

    .email-footer {
      background-color: #fafafa;
      text-align: center;
      padding: 20px;
      font-size: 13px;
      color: #888;
    }

    @media (max-width: 600px) {
      .email-body {
        padding: 20px;
      }

      .verification-code {
        font-size: 28px;
        letter-spacing: 4px;
        padding: 10px 20px;
      }

      .email-header h1 {
        font-size: 22px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    
    <!-- Header -->
    <div class="email-header">
      <h1>Verify Your Email</h1>
    </div>

    <!-- Body -->
    <div class="email-body">
      <p>Hello,</p>
      <p>Thank you for signing up to <strong>MyApp.io</strong>! To complete your registration, please use the code below:</p>

      <div class="code-box">
        <div class="verification-code">{verificationCode}</div>
      </div>

      <p>This verification code is valid for the next <strong>15 minutes</strong>.</p>
      <p>If you didn’t sign up for MyApp.io, feel free to ignore this email.</p>

      <p>Best regards,<br><strong>MyApp.io Team</strong></p>
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <p>This is an automated message. Please do not reply.</p>
      <p>© 2025 MyApp.io. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset Successful</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f9;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
    }

    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    }

    .email-header {
      background: linear-gradient(90deg, #43e97b, #38f9d7);
      padding: 30px;
      text-align: center;
    }

    .email-header h1 {
      color: white;
      font-size: 24px;
      margin: 0;
    }

    .email-body {
      padding: 30px;
      line-height: 1.7;
    }

    .success-icon {
      background-color: #4CAF50;
      color: white;
      width: 60px;
      height: 60px;
      line-height: 60px;
      font-size: 32px;
      border-radius: 50%;
      text-align: center;
      margin: 30px auto;
    }

    .email-body ul {
      padding-left: 20px;
    }

    .email-body li {
      margin-bottom: 10px;
    }

    .email-footer {
      text-align: center;
      background-color: #fafafa;
      padding: 20px;
      font-size: 13px;
      color: #888;
    }

    @media (max-width: 600px) {
      .email-body {
        padding: 20px;
      }

      .email-header h1 {
        font-size: 20px;
      }

      .success-icon {
        width: 50px;
        height: 50px;
        line-height: 50px;
        font-size: 28px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    
    <!-- Header -->
    <div class="email-header">
      <h1>Password Reset Successful</h1>
    </div>

    <!-- Body -->
    <div class="email-body">
      <p>Hello,</p>
      <p>This is to confirm that your password has been successfully changed.</p>

      <div class="success-icon">✓</div>

      <p>If this wasn’t you, please <strong>contact our support team immediately</strong>.</p>

      <p>For your safety, we recommend the following security tips:</p>
      <ul>
        <li>Use a strong and unique password</li>
        <li>Enable two-factor authentication</li>
        <li>Avoid reusing passwords across different sites</li>
      </ul>

      <p>Thank you for helping us keep your account secure.</p>
      <p>Best regards,<br><strong>Your App Team</strong></p>
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <p>This is an automated message. Please do not reply.</p>
      <p>© 2025 Your App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;