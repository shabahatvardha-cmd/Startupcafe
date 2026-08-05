import express from 'express';
import BrochureDownload from '../models/BrochureDownload.js';
import twilio from 'twilio';
import { sendBrochureEmail } from '../src/services/emailService.js';

const router = express.Router();

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

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
    if (client) {
      try {
        const whatsappMessage = `
📄 *New Brochure Download Lead!*

👤 *Name:* ${personName}
📧 *Email:* ${email}
📞 *Phone:* ${phone}
📅 *Date:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        `.trim();

        client.messages.create({
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${process.env.YOUR_WHATSAPP_NUMBER}`,
          body: whatsappMessage
        }).then(() => console.log('📲 WhatsApp notification sent for Brochure Download'))
          .catch(waErr => console.error('⚠️ WhatsApp error:', waErr.message));
      } catch (waError) {
        console.error('⚠️ WhatsApp setup error:', waError.message);
      }
    }

    // 3. Send Email Notification (Non-blocking, with IPv4 forced for Render)
    sendBrochureEmail({ fullName: personName, email, phone });

    res.status(200).json({ success: true, message: "Brochure download request saved successfully", data: newDownload });

  } catch (err) {
    console.error('❌ Brochure download error:', err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
});

export default router;
