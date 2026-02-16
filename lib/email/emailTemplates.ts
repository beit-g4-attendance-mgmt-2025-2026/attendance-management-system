export const PASSWORD_RESET_REQUEST_TEMPLATE = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1b1f24;">
    <h2>Reset Your Password</h2>
    <p>We received a request to reset your password.</p>
    <p>
      <a href="{resetURL}" style="display: inline-block; padding: 10px 16px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 6px;">
        Reset password
      </a>
    </p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
  </div>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1b1f24;">
    <h2>Password Reset Successful</h2>
    <p>Your password has been updated.</p>
    <p>If this wasn’t you, please contact support immediately.</p>
  </div>
`;

export const WELCOME_TEMPLATE = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1b1f24;">
    <h2>Welcome, {name}!</h2>
    <p>Thanks for joining us. We're excited to have you on board.</p>
    <p>If you have any questions, reply to this email and we'll help.</p>
  </div>
`;
