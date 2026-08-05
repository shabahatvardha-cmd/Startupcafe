import express from 'express';
import Franchise from '../models/Franchise.js';
import twilio from 'twilio';
import { sendFranchiseEmail } from '../src/services/emailService.js';

const router = express.Router();

// Initialize Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;


// POST /api/franchise
router.post('/', async (req, res) => {
  try {
    console.log('📬 Incoming Franchise Inquiry:', req.body);
    const { fullName, email, phone, city, budget, message, source } = req.body;

    const leadSource = source || 'Franchise Inquiry Form';
    const userCity = city || 'N/A';
    const userBudget = budget || 'N/A';

    // 1. Save to MongoDB
    const newInquiry = new Franchise({
      fullName,
      email,
      phone,
      city: userCity,
      budget: userBudget,
      message,
      source: leadSource
    });

    await newInquiry.save();
    console.log('✅ Franchise Inquiry saved to DB, ID:', newInquiry._id);

    // 2. Send WhatsApp Notification (Non-blocking)
    if (client) {
      try {
        const whatsappMessage = `
🤝 *New Franchise Lead!*
📍 *Source:* ${leadSource}

👤 *Name:* ${fullName}
📧 *Email:* ${email}
📞 *Phone:* ${phone}
🏙️ *City:* ${userCity}
💰 *Budget:* ${userBudget}
📝 *Message:* ${message || 'N/A'}
        `.trim();

        client.messages.create({
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${process.env.YOUR_WHATSAPP_NUMBER}`,
          body: whatsappMessage
        }).then(() => console.log('📲 WhatsApp notification sent'))
          .catch(waErr => console.error('⚠️ WhatsApp error:', waErr.message));
      } catch (waError) {
        console.error('⚠️ WhatsApp setup error:', waError.message);
      }
    }

    // 3. Send Email Notification (Non-blocking, with IPv4 forced for Render)
    sendFranchiseEmail({ fullName, email, phone, city: userCity, budget: userBudget, message, source: leadSource });

    res.status(200).json({ success: true, message: "Inquiry submitted successfully", lead: newInquiry });

  } catch (err) {
    console.error('❌ Franchise inquiry error:', err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
});

export default router;
