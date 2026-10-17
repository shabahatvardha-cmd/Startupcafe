import express from 'express';
import Booking from '../models/Booking.js';
import twilio from 'twilio';
import { sendBookingEmail } from '../src/services/emailService.js';

const router = express.Router();

// Initialize Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;


// POST /api/book
router.post('/', async (req, res) => {
  try {
    console.log('📥 Incoming booking:', req.body);
    const { name, email, phone, plan, duration, date, people, location, message } = req.body;

    // 1. Save to MongoDB
    const newBooking = new Booking({
      name,
      email,
      phone,
      plan,
      duration,
      date,
      people: Number(people),
      location: location,
      message: message
    });

    await newBooking.save();
    console.log('✅ Booking saved successfully');

    // 2. Send WhatsApp Notification (Non-blocking)
    if (client) {
      try {
        const whatsappMessage = `
📌 *New Booking Received!*

👤 *Name:* ${name}
📧 *Email:* ${email}
📞 *Phone:* ${phone}
📍 *Location:* ${location}
📦 *Plan:* ${plan}
⏳ *Duration:* ${duration}
📅 *Date:* ${date}
👥 *People:* ${people}
📝 *Message:* ${message || 'N/A'}
        `.trim();

        client.messages.create({
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${process.env.YOUR_WHATSAPP_NUMBER}`,
          body: whatsappMessage
        }).then(() => console.log('📲 WhatsApp notification sent'))
          .catch(waError => console.error('⚠️ WhatsApp error (non-blocking):', waError.message));
      } catch (waError) {
        console.error('⚠️ WhatsApp setup error (non-blocking):', waError.message);
      }
    }

    // 3. Send Email Notification (Non-blocking)
    // We don't await this so the API response is fast
    sendBookingEmail({ name, email, phone, plan, duration, date, people, location, message });

    // 4. Return Success
    res.status(200).json({ 
      success: true,
      message: "Booking successful" 
    });

  } catch (err) {
    console.error('❌ Mongoose Validation/Save Error:', err.errors || err);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error", 
      error: err.message,
      details: err.errors ? Object.keys(err.errors).map(key => err.errors[key].message) : []
    });
  }
});

// GET /api/book - Fetch all bookings (sorted by newest first)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      count: bookings.length, 
      data: bookings 
    });
  } catch (err) {
    console.error('❌ Error fetching bookings:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch bookings', 
      error: err.message 
    });
  }
});

// DELETE /api/book/:id - Delete a booking by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete booking', error: err.message });
  }
});

export default router;
