import { Resend } from 'resend';
import nodemailer from 'nodemailer';

/**
 * Dual Email Service for Startup Cafe
 * 1. Resend API (Primary - ultra fast & works on all cloud hosts)
 * 2. Nodemailer SMTP (Fallback - IPv4 forced)
 */
const getResendClient = () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
        return new Resend(apiKey);
    }
    return null;
};

const sendViaResendOrNodemailer = async ({ subject, html, userEmail }) => {
    const resend = getResendClient();
    const adminEmail = process.env.EMAIL_USER || 'priyanshuvardha@gmail.com';
    
    // Build recipient list
    const recipientArray = [adminEmail];
    if (userEmail && userEmail.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
        recipientArray.push(userEmail.trim());
    }

    // Try Resend API first
    if (resend) {
        try {
            console.log(`🚀 Sending email via Resend API to:`, recipientArray);
            const { data, error } = await resend.emails.send({
                from: 'Startup Cafe <onboarding@resend.dev>',
                to: recipientArray,
                subject: subject,
                html: html
            });

            if (error) {
                console.error('⚠️ Resend API warning:', error);
            } else {
                console.log('✅ Email sent via Resend API successfully! ID:', data?.id);
                return true;
            }
        } catch (resendErr) {
            console.error('⚠️ Resend API exception, switching to Nodemailer fallback:', resendErr.message);
        }
    }

    // Fallback to Nodemailer SMTP
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_email_app_password_here') {
            console.warn('⚠️ Skipping Nodemailer: Valid EMAIL_PASS not set in .env (still placeholder).');
            return false;
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: { rejectUnauthorized: false },
            connectionTimeout: 10000,
            greetingTimeout: 5000,
            socketTimeout: 10000
        });

        const info = await transporter.sendMail({
            from: `"Startup Cafe" <${process.env.EMAIL_USER}>`,
            to: recipientArray.join(', '),
            subject: subject,
            family: 4,
            html: html
        });

        console.log('✅ Email sent via Nodemailer SMTP successfully:', info.messageId);
        return true;
    } catch (smtpErr) {
        console.error('❌ Nodemailer SMTP Error:', smtpErr.message);
        return false;
    }
};

export const sendBookingEmail = async (bookingData) => {
    const { name, email, phone, plan, duration, date, people, location, message } = bookingData;

    console.log(`📧 Initiating booking email for: ${name} (${plan})`);
    const subject = `🚀 New Workspace Booking Confirmation: ${name}`;
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="color: #6366f1; margin: 0; font-size: 24px;">Workspace Booking Details</h2>
                <p style="color: #64748b; margin-top: 5px;">Startup Cafe Dashboard</p>
            </div>
            
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px 0; color: #64748b;">Customer Name</td>
                        <td style="padding: 10px 0; color: #1e293b; font-weight: 600; text-align: right;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #64748b;">Customer Email</td>
                        <td style="padding: 10px 0; color: #1e293b; font-weight: 600; text-align: right;">${email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #64748b;">Phone</td>
                        <td style="padding: 10px 0; color: #1e293b; font-weight: 600; text-align: right;">${phone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #64748b;">Plan</td>
                        <td style="padding: 10px 0; color: #ec4899; font-weight: 700; text-align: right;">${plan}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #64748b;">Location</td>
                        <td style="padding: 10px 0; color: #6366f1; font-weight: 700; text-align: right;">${location}</td>
                    </tr>
                </table>
            </div>

            <div style="margin-bottom: 10px;">
                <p style="color: #64748b; font-size: 14px; margin-bottom: 8px;">Message:</p>
                <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; color: #475569; font-style: italic;">
                    "${message || 'No additional message.'}"
                </div>
            </div>
        </div>
    `;

    return sendViaResendOrNodemailer({ subject, html, userEmail: email });
};

export const sendBrochureEmail = async (brochureData) => {
    const { fullName, email, phone } = brochureData;

    console.log(`📧 Initiating Brochure Download email for: ${fullName} (${email})`);
    const subject = `📄 Startup Cafe Brochure Download: ${fullName}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #8b5cf6; margin: 0;">Brochure Download Lead</h2>
                <p style="color: #64748b; margin-top: 5px;">A visitor downloaded the Startup Cafe brochure</p>
            </div>
            
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #f1f5f9;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;"><strong>Full Name:</strong></td>
                        <td style="padding: 8px 0; color: #1e293b; font-weight: bold; text-align: right;">${fullName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td>
                        <td style="padding: 8px 0; color: #1e293b; text-align: right;">${email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td>
                        <td style="padding: 8px 0; color: #1e293b; font-weight: bold; text-align: right;">${phone}</td>
                    </tr>
                </table>
            </div>
        </div>
    `;

    return sendViaResendOrNodemailer({ subject, html, userEmail: email });
};

export const sendFranchiseEmail = async (franchiseData) => {
    const { fullName, email, phone, city, budget, message, source } = franchiseData;

    console.log(`📧 Initiating Franchise Email for: ${fullName} (${email})`);
    const subject = `🤝 Franchise Application: ${fullName} (${city || 'N/A'})`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #4f46e5; margin: 0;">New Franchise Application</h2>
                <p style="color: #64748b; margin-top: 5px;">Submitted via: <strong>${source || 'Franchise Form'}</strong></p>
            </div>
            
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #f1f5f9;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;"><strong>Full Name:</strong></td>
                        <td style="padding: 8px 0; color: #1e293b; font-weight: bold; text-align: right;">${fullName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td>
                        <td style="padding: 8px 0; color: #1e293b; text-align: right;">${email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td>
                        <td style="padding: 8px 0; color: #1e293b; font-weight: bold; text-align: right;">${phone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;"><strong>City:</strong></td>
                        <td style="padding: 8px 0; color: #1e293b; text-align: right;">${city || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b;"><strong>Budget:</strong></td>
                        <td style="padding: 8px 0; color: #ec4899; font-weight: bold; text-align: right;">${budget || 'N/A'}</td>
                    </tr>
                </table>
            </div>

            <div style="margin-top: 15px; padding: 15px; background-color: #fdf2f8; border-radius: 8px;">
                <p style="margin: 0; color: #9d174d;"><strong>Message/Notes:</strong></p>
                <p style="margin-top: 5px; color: #be185d;">${message || 'No additional message.'}</p>
            </div>
        </div>
    `;

    return sendViaResendOrNodemailer({ subject, html, userEmail: email });
};

/**
 * Send 6-Digit Admin Recovery Verification Code (OTP)
 */
export const sendAdminRecoveryOtpEmail = async ({ toEmail, otpCode }) => {
    const subject = 'Your Admin Recovery Verification Code';
    const text = `Your Startup Cafe Admin recovery verification code is: ${otpCode}\n\nThis code will expire in 5 minutes.\nDo not share this code with anyone.\nIf you did not request this recovery code, please ignore this email.`;
    const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #0f172a;">
            <div style="text-align: center; margin-bottom: 28px;">
                <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; border-radius: 12px; background-color: #f1f5f9; font-size: 22px; margin-bottom: 8px;">🔐</div>
                <h2 style="color: #6366f1; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Startup Cafe Admin</h2>
                <p style="color: #64748b; margin-top: 4px; font-size: 13px;">Security &amp; Account Recovery</p>
            </div>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <p style="color: #475569; font-size: 13px; font-weight: 500; margin: 0 0 14px 0;">Use the following verification code to reset your admin password:</p>
                <div style="display: inline-block; padding: 12px 28px; background: #6366f1; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: 8px; border-radius: 12px; font-family: monospace;">
                    ${otpCode}
                </div>
                <p style="color: #dc2626; font-size: 12px; font-weight: 600; margin: 14px 0 0 0;">⏱️ This code will expire in 5 minutes.</p>
            </div>

            <div style="border-top: 1px solid #f1f5f9; padding-top: 18px; font-size: 12px; color: #64748b; line-height: 1.6;">
                <p style="margin: 0 0 8px 0;"><strong style="color: #334155;">⚠️ Security Notice:</strong> Never share this code with anyone. Startup Cafe staff will never ask you for this verification code.</p>
                <p style="margin: 0;">If you did not request password recovery, please ignore this email. Your existing credentials remain completely secure.</p>
            </div>
        </div>
    `;

    // Try Resend API first if configured
    const resend = getResendClient();
    if (resend) {
        try {
            console.log(`🚀 Sending Admin Recovery OTP via Resend API to: ${toEmail}`);
            const { data, error } = await resend.emails.send({
                from: 'Startup Cafe Security <onboarding@resend.dev>',
                to: [toEmail],
                subject,
                html,
                text,
            });

            if (!error) {
                console.log('✅ Admin OTP sent via Resend API! ID:', data?.id);
                return true;
            }
            console.warn('⚠️ Resend API warning during OTP dispatch:', error);
        } catch (resendErr) {
            console.error('⚠️ Resend exception for OTP, falling back to SMTP:', resendErr.message);
        }
    }

    // Fallback to Nodemailer SMTP
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_email_app_password_here') {
            console.warn('⚠️ Nodemailer SMTP skipped: Valid EMAIL_PASS not set in .env (still placeholder).');
            return false;
        }

        const cleanEmailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');
        const transportConfig = process.env.SMTP_HOST && process.env.SMTP_HOST !== 'smtp.gmail.com'
            ? {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: Number(process.env.SMTP_PORT) === 465,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: cleanEmailPass
                },
                tls: { rejectUnauthorized: false },
                connectionTimeout: 10000,
                greetingTimeout: 5000,
                socketTimeout: 10000
            }
            : {
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: cleanEmailPass
                },
                tls: { rejectUnauthorized: false },
                connectionTimeout: 10000,
                greetingTimeout: 5000,
                socketTimeout: 10000
            };

        const transporter = nodemailer.createTransport(transportConfig);

        const info = await transporter.sendMail({
            from: `"Startup Cafe Security" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject,
            text,
            html
        });

        console.log('✅ Admin OTP sent via Nodemailer SMTP successfully:', info.messageId);
        return true;
    } catch (smtpErr) {
        console.error('❌ Nodemailer SMTP Error during Admin OTP dispatch:', smtpErr.message);
        return false;
    }
};

