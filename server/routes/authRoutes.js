import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendAdminRecoveryOtpEmail } from '../src/services/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const AUTH_FILE = path.join(DATA_DIR, 'admin_auth.json');

const router = express.Router();

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Default fallback credentials from .env or defaults
const DEFAULT_EMAIL = (process.env.ADMIN_EMAIL || 'shabahatvardha@gmail.com').trim().toLowerCase();
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// In-memory OTP & recovery token stores (automatically managed with expiries)
const otpStore = new Map(); // key: normalized email -> { otpHash, expiresAt, attempts, requestedAt }
const resetTokenStore = new Map(); // key: tokenHash -> { email, expiresAt }

// Check if an email is authorized as the admin
function isAuthorizedAdminEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  const stored = getStoredAuth();
  const activeAdminEmail = (stored?.email || process.env.ADMIN_EMAIL || DEFAULT_EMAIL).trim().toLowerCase();
  const systemEmail = (process.env.EMAIL_USER || '').trim().toLowerCase();
  return normalized === activeAdminEmail || (systemEmail && normalized === systemEmail);
}

// Helper: Read stored auth data safely
function getStoredAuth() {
  try {
    ensureDataDir();
    if (!fs.existsSync(AUTH_FILE)) {
      return null;
    }
    const raw = fs.readFileSync(AUTH_FILE, 'utf-8');
    if (!raw.trim()) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading admin_auth.json:', err);
    return null;
  }
}

// Helper: Save auth data safely
function saveStoredAuth(data) {
  ensureDataDir();
  fs.writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// GET /api/auth/status - Check auth status & configured email (never exposes password)
router.get('/status', (req, res) => {
  try {
    const stored = getStoredAuth();
    if (!stored) {
      return res.json({
        success: true,
        email: DEFAULT_EMAIL,
        hasCustomPassword: false,
        lastUpdated: null,
      });
    }

    return res.json({
      success: true,
      email: stored.email || DEFAULT_EMAIL,
      hasCustomPassword: !!stored.passwordHash,
      lastUpdated: stored.lastUpdated || null,
    });
  } catch (error) {
    console.error('Auth status error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve auth status' });
  }
});

// POST /api/auth/login - Authenticate admin credentials
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const inputEmail = email.trim().toLowerCase();
    const stored = getStoredAuth();

    // 1. If custom credentials exist, verify strictly against them (do NOT accept old default)
    if (stored && stored.passwordHash) {
      const targetEmail = (stored.email || DEFAULT_EMAIL).trim().toLowerCase();
      const isEmailMatch = inputEmail === targetEmail;
      const isPasswordMatch = bcrypt.compareSync(password, stored.passwordHash);

      if (isEmailMatch && isPasswordMatch) {
        return res.json({
          success: true,
          message: 'Login successful',
          admin: { email: targetEmail },
        });
      }

      // Custom password exists and did not match -> Reject!
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
    }

    // 2. Only if NO custom password has been created yet, allow default .env credentials
    if (inputEmail === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
      return res.json({
        success: true,
        message: 'Login successful (default credentials)',
        admin: { email: DEFAULT_EMAIL },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password. Please verify your credentials.',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during login' });
  }
});

// POST /api/auth/change-password - Update email and/or password
router.post('/change-password', (req, res) => {
  try {
    const { currentPassword, newPassword, newEmail } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is required to make changes' });
    }

    const stored = getStoredAuth();

    // Verify current password first
    let isCurrentValid = false;
    if (stored && stored.passwordHash) {
      isCurrentValid = bcrypt.compareSync(currentPassword, stored.passwordHash);
    } else {
      isCurrentValid = currentPassword === DEFAULT_PASSWORD;
    }

    if (!isCurrentValid) {
      return res.status(403).json({ success: false, message: 'Current password is incorrect' });
    }

    // Prepare updated data
    const updatedEmail = newEmail && newEmail.trim() ? newEmail.trim().toLowerCase() : (stored?.email || DEFAULT_EMAIL);

    let updatedHash = stored?.passwordHash;
    if (newPassword) {
      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
      }
      updatedHash = bcrypt.hashSync(newPassword, 10);
    }

    const newAuthData = {
      email: updatedEmail,
      passwordHash: updatedHash,
      lastUpdated: new Date().toISOString(),
    };

    saveStoredAuth(newAuthData);

    return res.json({
      success: true,
      message: 'Admin security settings updated successfully',
      admin: {
        email: updatedEmail,
        lastUpdated: newAuthData.lastUpdated,
      },
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update password' });
  }
});

// POST /api/auth/reset-default - Revert credentials to .env defaults
router.post('/reset-default', (req, res) => {
  try {
    ensureDataDir();
    if (fs.existsSync(AUTH_FILE)) {
      fs.unlinkSync(AUTH_FILE);
    }
    return res.json({
      success: true,
      message: 'Credentials reset to default factory settings successfully',
      email: DEFAULT_EMAIL,
    });
  } catch (error) {
    console.error('Reset default error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reset credentials' });
  }
});

// POST /api/auth/request-otp - Send 6-digit recovery OTP to authorized email
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Admin email address is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check rate limit: 60-second cooldown per email
    const existing = otpStore.get(normalizedEmail);
    if (existing && Date.now() - existing.requestedAt < 60000) {
      const waitSeconds = Math.ceil((60000 - (Date.now() - existing.requestedAt)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSeconds} seconds before requesting another code.`,
        cooldownSeconds: waitSeconds,
      });
    }

    // Only dispatch OTP if the email matches an authorized admin
    if (isAuthorizedAdminEmail(normalizedEmail)) {
      // Generate cryptographically secure 6-digit OTP
      const otpCode = String(crypto.randomInt(100000, 1000000));
      // Store OTP as SHA-256 hash
      const otpHash = crypto.createHash('sha256').update(otpCode).digest('hex');

      otpStore.set(normalizedEmail, {
        otpHash,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes validity
        attempts: 0,
        requestedAt: Date.now(),
      });

      console.log(`\n========================================`);
      console.log(`🔑 ADMIN PASSWORD RECOVERY OTP: [ ${otpCode} ]`);
      console.log(`📧 Target Email: ${normalizedEmail}`);
      console.log(`⏰ Valid for 5 minutes`);
      console.log(`========================================\n`);

      // Dispatch professional verification email
      let emailSent = false;
      try {
        emailSent = await sendAdminRecoveryOtpEmail({ toEmail: normalizedEmail, otpCode });
      } catch (mailErr) {
        console.error('Failed to dispatch recovery OTP email:', mailErr);
      }

      if (!emailSent) {
        return res.json({
          success: true,
          message: `Code: ${otpCode} (SMTP pending - use this code to proceed)`,
          cooldownSeconds: 60,
          devOtp: otpCode,
        });
      }

      return res.json({
        success: true,
        message: 'A verification code has been sent to your email.',
        cooldownSeconds: 60,
      });
    }

    // Neutral security response to prevent email enumeration
    return res.json({
      success: true,
      message: 'If this email is authorized, a verification code has been sent.',
      cooldownSeconds: 60,
    });
  } catch (error) {
    console.error('Request OTP error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process verification request' });
  }
});

// POST /api/auth/verify-otp - Validate 6-digit OTP and issue single-use recovery token
router.post('/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and verification code are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const record = otpStore.get(normalizedEmail);

    if (!record || Date.now() > record.expiresAt) {
      if (record) otpStore.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: 'The verification code has expired or is invalid. Please request a new code.',
      });
    }

    // Enforce max 5 attempts to protect against brute-force
    if (record.attempts >= 5) {
      otpStore.delete(normalizedEmail);
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. This code has been invalidated. Please request a new code.',
      });
    }

    const inputOtpHash = crypto.createHash('sha256').update(String(otp).trim()).digest('hex');
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(inputOtpHash, 'utf-8'),
      Buffer.from(record.otpHash, 'utf-8')
    );

    if (!isMatch) {
      record.attempts += 1;
      const remainingAttempts = 5 - record.attempts;
      return res.status(400).json({
        success: false,
        message: `Invalid verification code. ${remainingAttempts} attempt(s) remaining.`,
      });
    }

    // OTP verified successfully - consume it immediately so it cannot be reused
    otpStore.delete(normalizedEmail);

    // Issue short-lived, single-use recovery token (valid for 10 minutes)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    resetTokenStore.set(tokenHash, {
      email: normalizedEmail,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Code verified successfully.',
      resetToken,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify code' });
  }
});

// POST /api/auth/reset-password - Set new password using verified recovery token
router.post('/reset-password', (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken) {
      return res.status(400).json({ success: false, message: 'Recovery authorization token is required' });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const tokenHash = crypto.createHash('sha256').update(String(resetToken).trim()).digest('hex');
    const tokenRecord = resetTokenStore.get(tokenHash);

    if (!tokenRecord || Date.now() > tokenRecord.expiresAt) {
      if (tokenRecord) resetTokenStore.delete(tokenHash);
      return res.status(403).json({
        success: false,
        message: 'Recovery session has expired or is invalid. Please request a new verification code.',
      });
    }

    // Invalidate recovery token immediately (single-use)
    resetTokenStore.delete(tokenHash);

    const targetEmail = tokenRecord.email;
    const updatedHash = bcrypt.hashSync(newPassword, 10);

    const newAuthData = {
      email: targetEmail,
      passwordHash: updatedHash,
      lastUpdated: new Date().toISOString(),
    };

    saveStoredAuth(newAuthData);

    return res.json({
      success: true,
      message: 'Admin password reset successfully. You can now log in with your new password.',
      email: targetEmail,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
});

export default router;
