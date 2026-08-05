import express from 'express';
import BrochureDownload from '../models/BrochureDownload.js';
import twilio from 'twilio';
import nodemailer from 'nodemailer';

const router = express.Router();

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// POST /api/brochure
router.post('/', async (req, res) => {
  try {
    console.log('📬 Incoming Brochure Download Request:', req.body);
    const { fullName, name, email, phone } = req.body;

    const personName = fullName || name;

    if (!personName || !email || !phone) {
      return res.status(400).json({ success: false, message: "Name, email, and phone number are required." });
    }

    // 1. Save to MongoDB in BrochureDownload collection
    const newDownload = new BrochureDownload({
      fullName: personName,
      email,
      phone
    });

    await newDownload.save();
    console.log('✅ Brochure Download lead saved to MongoDB (ID:', newDownload._id, ')');

    // 2. Send WhatsApp Notification (Non-blocking)
    try {
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        const whatsappMessage = `
📄 *New Brochure Download Lead!*

👤 *Name:* ${personName}
📧 *Email:* ${email}
📞 *Phone:* ${phone}
📅 *Date:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        `.trim();

        await client.messages.create({
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${process.env.YOUR_WHATSAPP_NUMBER}`,
          body: whatsappMessage
        });
        console.log('📲 WhatsApp notification sent for Brochure Download');
      }
    } catch (waError) {
      console.error('⚠️ WhatsApp error:', waError.message);
    }

    // 3. Send Email Notification (Non-blocking)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER, // Admin Email
          subject: `📄 New Brochure Download: ${personName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
              <div style="text-align: center; padding-bottom: 20px;">
                <h2 style="color: #8b5cf6; margin: 0;">Brochure Downloaded</h2>
                <p style="color: #6b7280; margin-top: 5px;">A user has downloaded the Startup Cafe brochure.</p>
              </div>
              
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #f3f4f6;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #374151;"><strong>Full Name:</strong></td>
                    <td style="padding: 8px 0; color: #111827; font-weight: bold;">${personName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #374151;"><strong>Email Address:</strong></td>
                    <td style="padding: 8px 0; color: #111827;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #374151;"><strong>Phone Number:</strong></td>
                    <td style="padding: 8px 0; color: #111827;">${phone}</td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px;">
                © Startup Cafe Brochure Portal
              </div>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('📧 Admin email sent successfully for Brochure Download');
      }
    } catch (emailError) {
      console.error('📧 Email error:', emailError.message);
    }

    res.status(200).json({ success: true, message: "Brochure download request saved successfully", data: newDownload });

  } catch (err) {
    console.error('❌ Brochure download error:', err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
});

export default router;
