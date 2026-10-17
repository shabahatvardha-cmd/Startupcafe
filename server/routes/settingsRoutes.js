import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

const router = express.Router();

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// GET /api/settings - Read current settings from file
router.get('/', (req, res) => {
  try {
    ensureDataDir();
    if (!fs.existsSync(SETTINGS_FILE)) {
      return res.json({ success: true, settings: null });
    }
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    if (!raw.trim()) {
      return res.json({ success: true, settings: null });
    }
    const settings = JSON.parse(raw);
    return res.json({ success: true, settings });
  } catch (error) {
    console.error('Error reading settings file:', error);
    return res.status(500).json({ success: false, message: 'Failed to read settings' });
  }
});

// POST /api/settings - Save settings to file
router.post('/', (req, res) => {
  try {
    ensureDataDir();
    const settings = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid settings payload' });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
    return res.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving settings file:', error);
    return res.status(500).json({ success: false, message: 'Failed to save settings' });
  }
});

export default router;
