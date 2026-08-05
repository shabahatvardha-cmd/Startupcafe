import nodemailer from 'nodemailer';

/**
 * Robust Email Service for Startup Cafe
 * Forces IPv4 (family: 4) to fix Render's ENETUNREACH network issues.
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false 
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 5000,
        socketTimeout: 10000
    });
};

export const sendBookingEmail = async (bookingData) => {
    try {
        const { name, email, phone, plan, duration, date, people, location, message } = bookingData;

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️ Skipping email: EMAIL_USER or EMAIL_PASS not set in environment.');
            return false;
        }

        console.log(`📧 Initiating booking email for: ${name} (${plan})`);
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Startup Cafe Dashboard" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `🚀 New Workspace Booking: ${name}`,
            family: 4, // CRITICAL: Forces IPv4 to fix ENETUNREACH on Render
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <h2 style="color: #6366f1; margin: 0; font-size: 24px;">New Booking Alert</h2>
                        <p style="color: #64748b; margin-top: 5px;">Startup Cafe Dashboard</p>
                    </div>
                    
                    <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; color: #64748b;">Customer</td>
                                <td style="padding: 10px 0; color: #1e293b; font-weight: 600; text-align: right;">${name}</td>
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
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Booking email sent successfully:', info.messageId);
        return true;

    } catch (error) {
        console.error('❌ Booking Email Error:', error.message);
        return false;
    }
};

export const sendBrochureEmail = async (brochureData) => {
    try {
        const { fullName, email, phone } = brochureData;

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️ Skipping email: EMAIL_USER or EMAIL_PASS not set in environment.');
            return false;
        }

        console.log(`📧 Initiating Brochure Download email for: ${fullName}`);
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Startup Cafe Dashboard" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `📄 New Brochure Download: ${fullName}`,
            family: 4, // CRITICAL: Forces IPv4 to fix ENETUNREACH on Render
            html: `
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
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Brochure email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Brochure Email Error:', error.message);
        return false;
    }
};

export const sendFranchiseEmail = async (franchiseData) => {
    try {
        const { fullName, email, phone, city, budget, message, source } = franchiseData;

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️ Skipping email: EMAIL_USER or EMAIL_PASS not set in environment.');
            return false;
        }

        console.log(`📧 Initiating Franchise Email for: ${fullName}`);
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Startup Cafe Portal" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `🤝 New Franchise Application: ${fullName} (${city || 'N/A'})`,
            family: 4, // CRITICAL: Forces IPv4 to fix ENETUNREACH on Render
            html: `
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
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Franchise email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Franchise Email Error:', error.message);
        return false;
    }
};
