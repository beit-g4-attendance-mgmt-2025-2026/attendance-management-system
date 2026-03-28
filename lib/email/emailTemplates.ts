function getBaseUrl() {
	return (
		process.env.APP_BASE_URL ??
		process.env.NEXT_PUBLIC_BASE_URL ??
		""
	).replace(/\/$/, "");
}

function applyTemplateVariables(
	template: string,
	variables: Record<string, string>,
) {
	return Object.entries(variables).reduce((html, [key, value]) => {
		return html.replace(new RegExp(`\\{${key}\\}`, "g"), value);
	}, template);
}

export function renderEmailTemplate(
	template: string,
	variables: Record<string, string> = {},
) {
	const baseUrl = getBaseUrl();
	const defaults = {
		appName: process.env.APP_NAME ?? "Attendance Management System",
		supportEmail: process.env.SUPPORT_EMAIL ?? "support@tumeiktila.edu.mm",
		year: String(new Date().getFullYear()),
		logoURL:
			process.env.EMAIL_LOGO_URL ??
			(baseUrl
				? `${baseUrl}/TU_logo.jpg`
				: "https://dummyimage.com/96x96/0284c7/ffffff.png&text=TU"),
		loginURL: baseUrl ? `${baseUrl}/login` : "#",
	};

	return applyTemplateVariables(template, { ...defaults, ...variables });
}

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
  <div style="margin:0; padding:0; width:100%; background-color:#e6f6ff; font-family:Arial, Helvetica, sans-serif; color:#0f172a;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding:28px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px; background-color:#ffffff; border:1px solid #bae6fd; border-radius:16px; overflow:hidden;">
            <tr>
              <td style="padding:28px 24px 10px; text-align:center; background:linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);">
                <img src="{logoURL}" alt="{appName}" width="72" height="72" style="display:block; margin:0 auto 12px; border-radius:50%; border:3px solid #e0f2fe; object-fit:cover;" />
                <h1 style="margin:0; font-size:23px; line-height:1.3; color:#ffffff;">Reset Your Password</h1>
                <p style="margin:8px 0 0; font-size:14px; color:#e0f2fe;">{appName}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 14px; font-size:15px; color:#1e293b;">Hi,</p>
                <p style="margin:0 0 16px; font-size:15px; color:#334155;">
                  We received a request to reset your account password.
                  Click the button below to create a new password.
                </p>
                <div style="margin:24px 0; text-align:center;">
                  <a href="{resetURL}" style="display:inline-block; padding:12px 24px; background-color:#0284c7; border-radius:10px; color:#ffffff; text-decoration:none; font-weight:700; font-size:14px;">
                    Reset Password
                  </a>
                </div>
                <p style="margin:0 0 10px; font-size:13px; color:#475569;">
                  This link will expire in 60 minutes for security reasons.
                </p>
                <p style="margin:0 0 14px; font-size:13px; color:#64748b;">
                  If the button does not work, copy and paste this URL into your browser:
                </p>
                <p style="margin:0; font-size:12px; color:#0284c7; word-break:break-all;">{resetURL}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 24px; border-top:1px solid #e2e8f0;">
                <p style="margin:0; font-size:12px; color:#64748b;">
                  If you did not request this reset, you can ignore this email. Need help?
                  Contact us at <a href="mailto:{supportEmail}" style="color:#0284c7; text-decoration:none;">{supportEmail}</a>.
                </p>
                <p style="margin:12px 0 0; font-size:12px; color:#94a3b8;">&copy; {year} {appName}. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
  <div style="margin:0; padding:0; width:100%; background-color:#e6f6ff; font-family:Arial, Helvetica, sans-serif; color:#0f172a;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding:28px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px; background-color:#ffffff; border:1px solid #bae6fd; border-radius:16px; overflow:hidden;">
            <tr>
              <td style="padding:28px 24px 10px; text-align:center; background:linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);">
                <img src="{logoURL}" alt="{appName}" width="72" height="72" style="display:block; margin:0 auto 12px; border-radius:50%; border:3px solid #e0f2fe; object-fit:cover;" />
                <h1 style="margin:0; font-size:23px; line-height:1.3; color:#ffffff;">Password Updated</h1>
                <p style="margin:8px 0 0; font-size:14px; color:#e0f2fe;">{appName}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 14px; font-size:15px; color:#1e293b;">Your password was changed successfully.</p>
                <p style="margin:0 0 10px; font-size:14px; color:#475569;">
                  Time: <strong>{changedAt}</strong>
                </p>
                <p style="margin:0 0 18px; font-size:14px; color:#475569;">
                  If this action was not performed by you, secure your account immediately and contact support.
                </p>
                <div style="margin:20px 0 0; text-align:center;">
                  <a href="{loginURL}" style="display:inline-block; padding:11px 22px; background-color:#0284c7; border-radius:10px; color:#ffffff; text-decoration:none; font-weight:700; font-size:14px;">
                    Login to Your Account
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 24px; border-top:1px solid #e2e8f0;">
                <p style="margin:0; font-size:12px; color:#64748b;">
                  Need help? Contact us at <a href="mailto:{supportEmail}" style="color:#0284c7; text-decoration:none;">{supportEmail}</a>.
                </p>
                <p style="margin:12px 0 0; font-size:12px; color:#94a3b8;">&copy; {year} {appName}. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
`;

export const WELCOME_TEMPLATE = `
  <div style="margin:0; padding:0; width:100%; background-color:#e6f6ff; font-family:Arial, Helvetica, sans-serif; color:#0f172a;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding:28px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px; background-color:#ffffff; border:1px solid #bae6fd; border-radius:16px; overflow:hidden;">
            <tr>
              <td style="padding:28px 24px 10px; text-align:center; background:linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);">
                <img src="{logoURL}" alt="{appName}" width="72" height="72" style="display:block; margin:0 auto 12px; border-radius:50%; border:3px solid #e0f2fe; object-fit:cover;" />
                <h1 style="margin:0; font-size:23px; line-height:1.3; color:#ffffff;">Welcome, {name}!</h1>
                <p style="margin:8px 0 0; font-size:14px; color:#e0f2fe;">{appName}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 14px; font-size:15px; color:#334155;">
                  Your account has been created successfully. You can now sign in and start managing attendance, classes, and reports.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:18px 0; border:1px solid #e2e8f0; border-radius:10px;">
                  <tr>
                    <td style="padding:12px 14px; font-size:13px; color:#334155;">
                      <strong>Next steps:</strong>
                      <ul style="margin:8px 0 0 18px; padding:0; color:#475569;">
                        <li style="margin-bottom:6px;">Sign in with your assigned username and password.</li>
                        <li style="margin-bottom:6px;">Update your password from profile settings.</li>
                        <li>Review your department, class, and subject assignments.</li>
                      </ul>
                    </td>
                  </tr>
                </table>
                <div style="margin:20px 0 0; text-align:center;">
                  <a href="{loginURL}" style="display:inline-block; padding:11px 22px; background-color:#0284c7; border-radius:10px; color:#ffffff; text-decoration:none; font-weight:700; font-size:14px;">
                    Login Now
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 24px; border-top:1px solid #e2e8f0;">
                <p style="margin:0; font-size:12px; color:#64748b;">
                  For support, contact <a href="mailto:{supportEmail}" style="color:#0284c7; text-decoration:none;">{supportEmail}</a>.
                </p>
                <p style="margin:12px 0 0; font-size:12px; color:#94a3b8;">&copy; {year} {appName}. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
`;
